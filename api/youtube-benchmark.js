
function send(res,s,p){res.status(s).setHeader('Content-Type','application/json; charset=utf-8').end(JSON.stringify(p))}
function durationText(v){const m=String(v||'').match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);if(!m)return'';const h=+m[1]||0,n=+m[2]||0,s=+m[3]||0;return h?`${h}시간 ${n}분`:n?`${n}분${s?' '+s+'초':''}`:`${s}초`}
export default async function handler(req,res){
 if(req.method!=='GET')return send(res,405,{error:'GET만 지원합니다.'});
 const key=process.env.YOUTUBE_API_KEY;if(!key)return send(res,500,{error:'Vercel 환경변수 YOUTUBE_API_KEY가 없습니다.'});
 const q=String(req.query?.q||'').trim(),limit=Math.max(1,Math.min(30,+req.query?.limit||20)),period=Math.max(0,+req.query?.period||90);if(!q)return send(res,400,{error:'검색어가 필요합니다.'});
 try{
  const p=new URLSearchParams({key,part:'snippet',type:'video',q,maxResults:String(limit),order:'relevance',regionCode:'KR',relevanceLanguage:'ko',safeSearch:'moderate'});
  if(period>0)p.set('publishedAfter',new Date(Date.now()-period*86400000).toISOString());
  const sr=await fetch('https://www.googleapis.com/youtube/v3/search?'+p);const sd=await sr.json();if(!sr.ok)throw new Error(sd?.error?.message||'search.list 실패');
  const ids=(sd.items||[]).map(x=>x?.id?.videoId).filter(Boolean);if(!ids.length)return send(res,200,{items:[]});
  const d=new URLSearchParams({key,part:'snippet,statistics,contentDetails',id:ids.join(',')});
  const vr=await fetch('https://www.googleapis.com/youtube/v3/videos?'+d);const vd=await vr.json();if(!vr.ok)throw new Error(vd?.error?.message||'videos.list 실패');
  return send(res,200,{items:(vd.items||[]).map(v=>({videoId:v.id,title:v.snippet?.title||'',channelTitle:v.snippet?.channelTitle||'',publishedAt:v.snippet?.publishedAt||'',thumbnail:v.snippet?.thumbnails?.medium?.url||'',viewCount:+v.statistics?.viewCount||0,durationText:durationText(v.contentDetails?.duration||'')}))});
 }catch(e){return send(res,500,{error:e.message||'YouTube 검색 실패'})}
}
