/* Sseoljeng Studio private character photo vault. Browser publishable key only. */
(()=>{
'use strict';
const URL='https://eeeapsxleuhjqrkposyc.supabase.co', BUCKET='character-images';
const KEY='sseoljeng-supabase-publishable-key';
let client=null, session=null, files=[];
const notify=()=>window.dispatchEvent(new CustomEvent('studio-cloud-faces-updated'));
window.studioCloudFaces=()=>session?.user?files.map(f=>({id:'cloud:'+session.user.id+'/'+f.name,label:fileLabel(f.name),path:session.user.id+'/'+f.name})):[];
window.studioCloudFaceUrl=async(path)=>{if(!client||!session?.user||!path.startsWith(session.user.id+'/'))throw Error('클라우드 로그인 또는 사진 경로를 확인하세요.');const {data,error}=await client.storage.from(BUCKET).createSignedUrl(path,3600);if(error)throw error;return data.signedUrl;};
const $=id=>document.getElementById(id);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function status(msg,bad=false){const el=$('sbCharStatus');if(el){el.textContent=msg;el.style.color=bad?'#b42343':'#346c64';}}
function initClient(){
 const key=$('sbCharKey').value.trim();if(!key.startsWith('sb_publishable_'))throw Error('Publishable key(sb_publishable_...)를 입력하세요.');
 if(!window.supabase?.createClient)throw Error('Supabase 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요.');
 localStorage.setItem(KEY,key);
 client=window.supabase.createClient(URL,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 return client;
}
function updateUI(){const logged=!!session?.user;$('sbCharAuth').hidden=logged;$('sbCharTools').hidden=!logged;$('sbCharUser').textContent=logged?`로그인: ${session.user.email}`:'로그아웃 상태';}
async function connect(){try{initClient();const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session;updateUI();if(session)await refresh();else status('계정 이메일과 비밀번호로 로그인하세요.');}catch(e){status(e.message,true)}}
async function login(){try{if(!client)initClient();const email=$('sbCharEmail').value.trim(),password=$('sbCharPassword').value;if(!email||!password)throw Error('이메일과 비밀번호를 입력하세요.');const {data,error}=await client.auth.signInWithPassword({email,password});$('sbCharPassword').value='';if(error)throw error;session=data.session;updateUI();status('로그인 완료');await refresh();}catch(e){status('로그인 실패: '+e.message,true)}}
async function logout(){if(client)await client.auth.signOut();session=null;files=[];notify();updateUI();$('sbCharGallery').innerHTML='';status('로그아웃했습니다.');}
async function refresh(){if(!session?.user)return;try{status('클라우드 이미지 목록을 불러오는 중...');const {data,error}=await client.storage.from(BUCKET).list(session.user.id,{limit:1000,sortBy:{column:'created_at',order:'desc'}});if(error)throw error;files=(data||[]).filter(f=>f.name&&!f.name.startsWith('.'));render();notify();status(`클라우드 사진 ${files.length}장 · 본인 계정 전용`);}catch(e){status('목록 조회 실패: '+e.message,true)}}
function fileLabel(name){const n=name.replace(/\.[^.]+$/,'');const split=n.lastIndexOf('--');try{return decodeURIComponent(split>=0?n.slice(0,split):n)}catch{return n}}
function render(){const g=$('sbCharGallery');g.innerHTML='';if(!files.length){g.textContent='아직 저장된 사진이 없습니다. 아래에서 업로드하세요.';return;}
 for(const f of files){const path=session.user.id+'/'+f.name;const card=document.createElement('div');card.className='sb-character-card';const image=document.createElement('img');image.alt=fileLabel(f.name);image.loading='lazy';const title=document.createElement('div');title.textContent=fileLabel(f.name);const actions=document.createElement('div');actions.className='sb-card-actions';
 const load=document.createElement('button');load.type='button';load.textContent='얼굴 배정으로 이동';load.onclick=()=>{document.querySelector('[data-tab=story]')?.click();document.getElementById('scriptCastPanel')?.setAttribute('open','');document.getElementById('scriptCastPanel')?.scrollIntoView({behavior:'smooth',block:'center'});};
 const remove=document.createElement('button');remove.type='button';remove.textContent='삭제';remove.onclick=()=>del(path);
 actions.append(load,remove);card.append(image,title,actions);g.append(card);
 client.storage.from(BUCKET).createSignedUrl(path,3600).then(({data,error})=>{if(!error&&data?.signedUrl)image.src=data.signedUrl;}).catch(()=>{});
 }}
async function dataToBlob(dataUrl){const response=await fetch(dataUrl);return response.blob()}
async function uploadBlob(blob,name){if(!session?.user)throw Error('먼저 로그인하세요.');if(!['image/jpeg','image/png','image/webp'].includes(blob.type))throw Error('JPG, PNG, WEBP만 업로드할 수 있습니다.');if(blob.size>50*1024*1024)throw Error('이미지 크기가 50MB를 넘습니다.');const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[blob.type];const safeName='character';const path=`${session.user.id}/${safeName}--${Date.now()}-${Math.random().toString(36).slice(2,7)}.${ext}`;const {error}=await client.storage.from(BUCKET).upload(path,blob,{contentType:blob.type,upsert:false});if(error)throw error;}
async function uploadLocal(){try{const c=typeof selectedCharacter==='function'?selectedCharacter():null;if(!c?.image)throw Error('선택한 캐릭터에 기준 얼굴 사진이 없습니다. 먼저 사진을 등록하세요.');status('선택 캐릭터 얼굴 업로드 중...');await uploadBlob(await dataToBlob(c.image),c.name||'캐릭터');await refresh();status(`${c.name} 얼굴을 클라우드에 저장했습니다.`);}catch(e){status('업로드 실패: '+e.message,true)}}
async function uploadFile(){try{const file=$('sbCharFile').files?.[0];if(!file)throw Error('이미지 파일을 선택하세요.');status('사진 업로드 중...');await uploadBlob(file,$('sbCharLabel').value||file.name.replace(/\.[^.]+$/,''));$('sbCharFile').value='';await refresh();status('사진을 클라우드에 저장했습니다.');}catch(e){status('업로드 실패: '+e.message,true)}}
async function apply(path){try{if(typeof getCharacters!=='function'||typeof storeCharacters!=='function')throw Error('캐릭터 편집기를 찾지 못했습니다.');const c=selectedCharacter();if(!c)throw Error('먼저 적용할 캐릭터를 선택하세요.');const {data,error}=await client.storage.from(BUCKET).download(path);if(error)throw error;const base64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(data)});const list=getCharacters(),idx=list.findIndex(x=>x.id===c.id);if(idx<0)throw Error('캐릭터를 찾을 수 없습니다.');list[idx].image=base64;storeCharacters(list);if(typeof saveCharacterFaceGlobalV178==='function')await saveCharacterFaceGlobalV178(list[idx],base64);if(typeof renderCharacters==='function')renderCharacters();if(typeof saveLocal==='function')saveLocal(true);status(`${c.name}에게 클라우드 기준 얼굴을 적용했습니다.`);}catch(e){status('사진 적용 실패: '+e.message,true)}}
async function del(path){if(!confirm('클라우드에서 이 사진을 영구 삭제할까요? (PC에 저장된 얼굴은 유지됩니다)'))return;try{const {error}=await client.storage.from(BUCKET).remove([path]);if(error)throw error;await refresh();status('클라우드 사진을 삭제했습니다.');}catch(e){status('삭제 실패: '+e.message,true)}}
function mount(){const cast=document.querySelector('.studio-settings-page[data-page="cast"]');if(!cast)return;const panel=document.createElement('section');panel.className='sb-character-vault';panel.innerHTML=`<div class="sb-vault-head"><strong>☁️ 얼굴 사진 보관함</strong><span id="sbCharUser">로그아웃 상태</span></div><p class="sb-vault-hint">집·회사에서 같은 계정으로 로그인하면 얼굴 사진을 불러올 수 있습니다. 인물 이름·나이·성격은 설계도와 대본에서 결정합니다. 이곳에서는 얼굴 사진만 보관하세요.</p><details class="sb-vault-config"><summary>연결 설정 · 처음 한 번만</summary><label>Supabase Publishable key (Secret key 사용 금지)</label><input id="sbCharKey" type="text" autocomplete="off" placeholder="sb_publishable_..."><button type="button" id="sbCharConnect">연결 확인</button></details><div id="sbCharAuth" class="sb-vault-auth"><input id="sbCharEmail" type="email" autocomplete="username" placeholder="계정 이메일"><input id="sbCharPassword" type="password" autocomplete="current-password" placeholder="비밀번호"><button type="button" id="sbCharLogin">로그인</button></div><div id="sbCharTools" hidden><div class="sb-vault-actions"><button type="button" id="sbCharUploadLocal" hidden>선택 캐릭터 얼굴 클라우드 저장</button><button type="button" id="sbCharRefresh">목록 새로고침</button><button type="button" id="sbCharLogout">로그아웃</button></div><details class="sb-vault-config"><summary>별도 사진 파일 업로드</summary><input id="sbCharLabel" placeholder="캐릭터 이름 (선택)"><input id="sbCharFile" type="file" accept="image/jpeg,image/png,image/webp"><button type="button" id="sbCharUploadFile">파일 업로드</button></details><div id="sbCharGallery" class="sb-vault-gallery"></div></div><div id="sbCharStatus" class="sb-vault-status" role="status">연결 설정을 열어 Publishable key를 입력하세요.</div>`;
 const intro=cast.querySelector('.studio-page-intro');if(intro)intro.after(panel);else cast.prepend(panel);
 $('sbCharKey').value=localStorage.getItem(KEY)||'';
 $('sbCharConnect').onclick=connect;$('sbCharLogin').onclick=login;$('sbCharLogout').onclick=logout;$('sbCharRefresh').onclick=refresh;$('sbCharUploadLocal').onclick=uploadLocal;$('sbCharUploadFile').onclick=uploadFile;
 if($('sbCharKey').value)connect();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
