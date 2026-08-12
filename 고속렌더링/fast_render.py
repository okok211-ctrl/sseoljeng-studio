from pathlib import Path
import json, subprocess, sys, shutil, re

HERE=Path(__file__).resolve().parent
PLAN=HERE/"autoedit-plan.json"

def die(msg):
    print("\n[오류]",msg)
    input("\n엔터를 누르면 종료합니다...")
    raise SystemExit(1)

if not PLAN.exists():
    die("Studio에서 ⚡ 고속 FFmpeg 팩을 눌러 받은 autoedit-plan.json을 이 폴더에 넣어주세요.")

try:
    plan=json.loads(PLAN.read_text(encoding="utf-8"))
except Exception as e:
    die(f"설계 파일을 읽지 못했습니다: {e}")

ffmpeg=shutil.which("ffmpeg")
if not ffmpeg:
    local=HERE/"ffmpeg.exe"
    if local.exists(): ffmpeg=str(local)
if not ffmpeg:
    die("FFmpeg를 찾지 못했습니다. ffmpeg.exe를 이 폴더에 넣거나 FFmpeg를 Windows PATH에 설치해주세요.")

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
         "-frames:v",str(frames),"-an","-c:v","libx264","-preset","veryfast","-crf","21",
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

out=HERE/"썰쟁-자동편집-완성.mp4"
sub=esc_filter_path(srt)
# Yellow text + black outline. Font size is scaled for 1080p/vertical.
fs=52 if H>=1080 else 40
style=f"FontName=Malgun Gothic,FontSize={fs},PrimaryColour=&H0000D9FF,OutlineColour=&H00000000,BorderStyle=1,Outline=4,Shadow=1,Alignment=2,MarginV={90 if H<=1080 else 150}"
vf=f"subtitles='{sub}':force_style='{style}'"
cmd=[ffmpeg,"-y","-i",str(joined),"-i",str(audio),"-vf",vf,
     "-map","0:v:0","-map","1:a:0","-c:v","libx264","-preset","veryfast","-crf","21",
     "-c:a","aac","-b:a","192k","-shortest","-movflags","+faststart",str(out)]
print("[마지막] 노란 자막 + 검정 테두리 + MP3 합성 중...")
if subprocess.run(cmd).returncode: die("최종 MP4 생성 실패")

for p in scene_files+[concat,joined]:
    try:p.unlink()
    except:pass
print("\n완료:",out)
input("\n엔터를 누르면 종료합니다...")
