from pathlib import Path
import json, subprocess, sys, shutil, re, os

HERE=Path(__file__).resolve().parent
PLAN=HERE/"autoedit-plan.json"

def die(msg):
    print("\n[오류]",msg)
    input("\n엔터를 누르면 종료합니다...")
    raise SystemExit(1)

if not PLAN.exists():
    die("Studio에서 ⚡ 고속 FFmpeg 팩을 눌러 받은 autoedit-plan.json을 이 폴더에 넣어주세요.")

try:
    plan=json.loads(PLAN.read_text(encoding="utf-8-sig"))
except Exception as e:
    die(f"설계 파일을 읽지 못했습니다: {e}")

ffmpeg=shutil.which("ffmpeg")
if not ffmpeg:
    local=HERE/"ffmpeg.exe"
    if local.exists(): ffmpeg=str(local)
if not ffmpeg:
    die("FFmpeg를 찾지 못했습니다. ffmpeg.exe를 이 폴더에 넣거나 FFmpeg를 Windows PATH에 설치해주세요.")

# v22.8: usable GPU encoder auto-detection. Falls back to CPU safely.
def detect_encoder():
    try:
        encs=subprocess.run([ffmpeg,"-hide_banner","-encoders"],capture_output=True,text=True,errors="replace").stdout
    except Exception:
        return "libx264", ["-preset","veryfast","-crf","21"]
    candidates=[
        ("h264_nvenc", ["-preset","p4","-cq","23","-b:v","0"]),
        ("h264_qsv", ["-global_quality","23"]),
        ("h264_amf", ["-quality","speed","-qp_i","23","-qp_p","23"]),
    ]
    for enc,args in candidates:
        if enc not in encs: continue
        test=[ffmpeg,"-hide_banner","-loglevel","error","-y","-f","lavfi","-i",
              "color=c=black:s=320x180:d=0.1:r=30","-frames:v","1","-c:v",enc,*args,"-f","null","-"]
        try:
            if subprocess.run(test,capture_output=True,timeout=15).returncode==0:
                return enc,args
        except Exception:
            pass
    return "libx264", ["-preset","veryfast","-crf","21"]

VIDEO_ENCODER, VIDEO_ARGS = detect_encoder()
print(f"[가속] 영상 인코더: {VIDEO_ENCODER}")
TEST30=os.environ.get("SSEOLJENG_TEST_30S")=="1"

audio=HERE/plan.get("audio","")
srt=HERE/plan.get("srt","")
images=[HERE/x for x in plan.get("images",[])]
if not audio.exists(): die(f"음성 파일 없음: {audio.name}")
if not srt.exists(): die(f"SRT 파일 없음: {srt.name}")
for p in images:
    if not p.exists(): die(f"이미지 파일 없음: {p.name}")

W=int(plan.get("width",1920)); H=int(plan.get("height",1080)); FPS=int(plan.get("fps",30))
scenes=plan.get("scenes",[])
if not scenes: die("장면 설계가 없습니다.")
if TEST30:
    clipped=[]
    for sc in scenes:
        st=float(sc["start"]); en=float(sc["end"])
        if st>=30000: break
        c=dict(sc); c["end"]=min(en,30000.0); clipped.append(c)
    scenes=clipped
    print("[30초 테스트] 필요한 앞부분 장면만 렌더링합니다.")

# Windows FFmpeg subtitle filter path escaping.
def esc_filter_path(p):
    x=str(p.resolve()).replace("\\","/")
    x=x.replace(":","\\:").replace("'","\\'")
    return x

def atempo_chain(speed):
    parts=[]
    while speed>2.0: parts.append("atempo=2.0"); speed/=2.0
    while speed<0.5: parts.append("atempo=0.5"); speed/=0.5
    parts.append(f"atempo={speed:.6f}")
    return ",".join(parts)

# Fast strategy:
# - Each still image becomes a short H.264 scene using zoompan.
# - concat scenes with stream copy.
# - burn SRT once while muxing audio.
# This is much faster than real-time browser capture and uses no paid API.
scene_files=[]
for idx,sc in enumerate(scenes):
    dur=max(.2,(float(sc["end"])-float(sc["start"]))/1000.0)
    frames=max(1,round(dur*FPS))
    motion=sc.get("motion","천천히 확대")
    if motion=="천천히 확대":
        z=f"min(zoom+0.00025,1.10)"; x="iw/2-(iw/zoom/2)"; y="ih/2-(ih/zoom/2)"
    elif motion=="천천히 축소":
        z=f"if(eq(on,1),1.10,max(1.02,zoom-0.00025))"; x="iw/2-(iw/zoom/2)"; y="ih/2-(ih/zoom/2)"
    elif motion=="좌→우":
        z="1.08"; x=f"(iw-iw/zoom)*on/{max(1,frames-1)}"; y="ih/2-(ih/zoom/2)"
    elif motion=="우→좌":
        z="1.08"; x=f"(iw-iw/zoom)*(1-on/{max(1,frames-1)})"; y="ih/2-(ih/zoom/2)"
    else:
        z="1.03"; x="iw/2-(iw/zoom/2)"; y="ih/2-(ih/zoom/2)"
    out=HERE/f"_scene_{idx:03d}.mp4"
    vf=(f"scale={W}:{H}:force_original_aspect_ratio=increase,"
        f"crop={W}:{H},zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s={W}x{H}:fps={FPS},"
        f"format=yuv420p")
    cmd=[ffmpeg,"-y","-loop","1","-i",str(images[sc["i"]]),"-vf",vf,
         "-frames:v",str(frames),"-an","-c:v",VIDEO_ENCODER,*VIDEO_ARGS,
         "-pix_fmt","yuv420p",str(out)]
    print(f"[{idx+1}/{len(scenes)}] 장면 렌더링: {images[sc['i']].name} ({dur:.1f}초)")
    if subprocess.run(cmd).returncode: die(f"장면 {idx+1} 렌더링 실패")
    scene_files.append(out)

concat=HERE/"_concat.txt"
concat.write_text("\n".join("file '"+str(p.resolve()).replace("'","'\\''")+"'" for p in scene_files),encoding="utf-8")
joined=HERE/"_joined.mp4"
cmd=[ffmpeg,"-y","-f","concat","-safe","0","-i",str(concat),"-c","copy",str(joined)]
print("[합치기] 장면 연결 중...")
if subprocess.run(cmd).returncode: die("장면 합치기 실패")

# ---- v22.7 subtitle safety normalization ----
# FFmpeg/libass does not reliably wrap oversized Korean SRT the way the browser preview does.
# Create a render-only SRT: max 2 lines, shorter line length, no multi-line pile-up inside one cue.
def normalize_render_srt(src_path):
    raw=src_path.read_text(encoding="utf-8-sig",errors="replace").replace("\r\n","\n")
    blocks=re.split(r"\n{2,}",raw.strip())
    out=[]
    max_chars=26 if W>=H else 16
    for b in blocks:
        lines=b.splitlines()
        if len(lines)<3: continue
        idx=lines[0].strip()
        timing=lines[1].strip()
        text=" ".join(x.strip() for x in lines[2:] if x.strip())
        text=re.sub(r"\s+"," ",text).strip()
        if not text: continue
        # Character-aware Korean wrapping, capped to two visible lines.
        chunks=[]
        cur=""
        for ch in text:
            cur+=ch
            if len(cur)>=max_chars:
                cut=cur.rfind(" ")
                if cut>=max_chars//2:
                    chunks.append(cur[:cut].strip()); cur=cur[cut+1:].strip()
                else:
                    chunks.append(cur.strip()); cur=""
        if cur: chunks.append(cur.strip())
        if len(chunks)>2:
            # Preserve all text without creating 3+ lines: merge remainder into line 2.
            chunks=[chunks[0]," ".join(chunks[1:])]
        out.append(f"{idx}\n{timing}\n"+"\n".join(chunks[:2]))
    dst=HERE/"_render_safe.srt"
    dst.write_text("\n\n".join(out)+"\n",encoding="utf-8")
    return dst

render_srt=normalize_render_srt(srt)
out=HERE/("썰쟁-자동편집-30초테스트.mp4" if TEST30 else "썰쟁-자동편집-완성.mp4")
sub=esc_filter_path(render_srt)

# Smaller YouTube-style bottom captions: yellow fill + strong black outline.
# ASS font sizes are visually larger than browser CSS, so keep 1080p around 25.
fs=22 if W>=H else 20
margin=28 if W>=H else 70
style=(f"FontName=Malgun Gothic,FontSize={fs},"
       f"PrimaryColour=&H0000D9FF,OutlineColour=&H00000000,"
       f"BorderStyle=1,Outline=3,Shadow=0,Alignment=2,MarginV={margin},"
       f"Bold=1,WrapStyle=2")
vf=f"subtitles='{sub}':force_style='{style}'"
cmd=[ffmpeg,"-y","-i",str(joined),"-i",str(audio),"-vf",vf,
     "-map","0:v:0","-map","1:a:0","-c:v",VIDEO_ENCODER,*VIDEO_ARGS,
     "-c:a","aac","-b:a","192k","-shortest"]
if TEST30: cmd += ["-t","30"]
cmd += ["-movflags","+faststart",str(out)]
print("[마지막] 하단 노란 자막 + 검정 테두리 + MP3 합성 중...")
if subprocess.run(cmd).returncode: die("최종 MP4 생성 실패")

for p in scene_files+[concat,joined,render_srt]:
    try:p.unlink()
    except:pass
print("\n완료:",out)
input("\n엔터를 누르면 종료합니다...")
