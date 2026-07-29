const SYSTEM=`당신은 한국 중장년층 대상 유튜브 사연 채널 '썰쟁'의 전문 작가다.
- 사건 선제시, 강한 후킹
- 기본 3인칭 관찰자, 요청 시 1인칭 회고체
- 대화체 최소
- '~다/~습니다'는 약 10% 이하, 나머지는 '~했어요, ~였지요, ~더군요' 등
- 과도한 폭력과 선정성 금지
- 쇼츠 화면 문구는 짧고 강렬하게
- 이미지에는 말풍선과 채널 검색 유도 문구 금지`;

function demo(b){
 const {kind,topic,heroine,paragraphs=20,imageCount=4}=b;
 if(kind==='scenes')return{demo:true,scenes:Array.from({length:imageCount},(_,i)=>({title:`본문 이미지 ${i+1}`,prompt:`한국 드라마 실사 영화 스틸, 16:9. 주제: ${topic}. 동일 주인공: ${heroine}. ${['사건이 시작되는 충격적인 순간','가족 갈등이 깊어지는 장면','결정적 증거를 발견하는 장면','진실을 밝히고 단호히 돌아서는 장면','새로운 삶으로 걸어가는 장면'][i]||'핵심 장면'}. 자연스러운 한국 배경, 시네마틱 조명, 감정이 선명한 얼굴, 화면 글자·말풍선·로고·워터마크 없음.`}))};
 if(kind==='story'){let t=`0문단\n\n${topic}\n\n시청 전 구독과 좋아요, 알림은 큰 힘이 됩니다.\n오늘 이야기는 ${heroine}에게 벌어진 믿기 힘든 사건에서 시작됩니다.`;for(let i=1;i<=paragraphs;i++)t+=`\n\n${i}문단\n\n평범하다고 믿었던 일상은 작은 단서 하나로 흔들리기 시작했어요. 가족들은 아무 일도 아니라는 듯 행동했지만, 피하는 시선과 엇갈리는 설명은 오래된 비밀을 가리키고 있었지요. 주인공은 감정을 터뜨리는 대신 날짜와 기록을 맞춰보기 시작했고, 마침내 누구도 부정할 수 없는 진실과 마주하게 되었습니다. 그 순간 그녀는 울기보다 자신의 삶을 지키는 선택을 했어요.\n\n[문단 글자 수: 171자]`;return{demo:true,text:t}}
 if(kind==='shorts')return{demo:true,text:`📸 1컷\n화면 문구: "그날, 모든 게 이상해졌습니다."\n나레이션: 평범했던 하루가 한순간에 무너졌어요.\n\n📸 2컷\n화면 문구: "가족들은 이미 알고 있었습니다."\n나레이션: 아무도 말하지 않았지만 표정은 진실을 숨기지 못했지요.\n\n📸 3컷\n화면 문구: "봉투 하나가 모든 걸 밝혔습니다."\n나레이션: 그 안에는 누구도 부정할 수 없는 기록이 들어 있었습니다.\n\n📸 4컷\n화면 문구: "그녀는 울지 않았습니다."\n나레이션: 주인공은 자신의 삶을 선택했어요.`};
 if(kind==='youtube')return{demo:true,text:`📌 제목\n${topic}\n\n📌 설명\n가족 모두가 숨기고 있던 진실이 드러났습니다.\n주인공은 믿었던 사람들의 침묵 앞에서 어떤 선택을 하게 될까요?\n\n#사연 #가족갈등 #반전사연 #감동사연 #중년이야기 #인생이야기\n\n📌 고정 댓글\n여러분이라면 같은 상황에서 어떤 선택을 하셨을까요?`};
 if(kind==='japanese')return{demo:true,text:`【日本語版デモ】\n${topic}\n\n平凡だと信じていた日常は、一つの小さな手がかりによって崩れ始めました。家族は何も知らないふりをしていましたが、避ける視線と食い違う説明が長い間隠されていた秘密を示していました。`};
 return{demo:true,text:''}
}
function prompt(b){
 const base=`${SYSTEM}\n주제:${b.topic}\n주인공:${b.heroine}\n시점:${b.pov}\n분위기:${b.tone}`;
 if(b.kind==='story')return`${base}\n0문단과 본문 ${b.paragraphs}문단 작성. 본문 문단당 420~450자. 각 문단 끝에 [문단 글자 수: N자]. ${b.subscribe?'0문단에 구독·좋아요·알림 멘트 포함':'구독 멘트 제외'}. 완성 원고만 출력.`;
 if(b.kind==='scenes')return`${base}\n본문 이미지 장면 ${b.imageCount}개 설계. 한국 드라마 실사 영화 스틸, 16:9, 동일 인물·얼굴·롱펌·의상 연속성. 화면 문자·말풍선·로고·워터마크 금지. JSON만 출력: {"scenes":[{"title":"","prompt":""}]}`;
 if(b.kind==='shorts')return`${base}\n24초 쇼츠 4컷. 각 컷에 시간, 화면 장면, 강렬한 짧은 문구, 짧은 나레이션. 말풍선 금지.`;
 if(b.kind==='youtube')return`${base}\n유튜브 제목 1개, 설명, 해시태그 7개, 고정 댓글 작성.`;
 return`${SYSTEM}\n다음 한국어 원고를 일본 중장년층이 자연스럽게 듣는 일본어 사연 대본으로 번역·현지화. 문단 번호 유지. 한국식 시댁 표현은 일본인이 이해할 수 있게 자연스럽게 조정. 원고:\n${b.story||b.topic}`;
}
function text(data){if(data.output_text)return data.output_text;return(data.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('')}
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'POST만 지원'});
 try{
  if(!process.env.OPENAI_API_KEY)return res.status(200).json(demo(req.body||{}));
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_TEXT_MODEL||'gpt-5-mini',input:prompt(req.body||{})})});
  const j=await r.json();if(!r.ok)throw new Error(j.error?.message||'OpenAI 오류');const t=text(j);
  if(req.body.kind==='scenes')return res.status(200).json(JSON.parse(t.replace(/^```json\s*|```$/g,'').trim()));
  res.status(200).json({text:t});
 }catch(e){res.status(500).json({error:e.message})}
}