export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'POST만 지원'});
 if(!process.env.OPENAI_API_KEY)return res.status(400).json({error:'실제 이미지 생성에는 OPENAI_API_KEY 연결이 필요합니다. 직접 넣기 버튼은 지금도 사용 가능합니다.'});
 try{
  const b=req.body||{};const full=`${b.prompt}\n동일 주인공 고정: ${b.heroine||''}. 화면 문자, 자막, 말풍선, 로고, 워터마크 금지.`;
  const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1',prompt:full,size:'1536x1024',quality:'medium',response_format:'b64_json'})});
  const j=await r.json();if(!r.ok)throw new Error(j.error?.message||'이미지 생성 오류');const x=j.data?.[0]?.b64_json;if(!x)throw new Error('이미지 데이터 없음');res.status(200).json({image:`data:image/png;base64,${x}`});
 }catch(e){res.status(500).json({error:e.message})}
}