// ===== Firebase Cloud =====
const firebaseConfig={
 apiKey:'AIzaSyCLjNa3rlgI8h-o68-EABcLpyy1LvQH5XM',
 authDomain:'sseoljeng-studio.firebaseapp.com',
 projectId:'sseoljeng-studio',
 storageBucket:'sseoljeng-studio.firebasestorage.app',
 messagingSenderId:'779104135131',
 appId:'1:779104135131:web:a9663e1bca77fd24ebe9fe'
};
let firebaseApp=null,auth=null,db=null,currentUser=null,currentCloudProjectId='',cloudSaveTimer=null,cloudApplying=false;
function cloudStatus(text,type=''){const el=$('cloudState');el.textContent=text;el.className='cloud-state '+type}
function cloudProjectRef(id){return db.collection('users').doc(currentUser.uid).collection('projects').doc(id)}
function stripImagesForCloud(p){const copy=JSON.parse(JSON.stringify(p));copy.characters=(copy.characters||[]).map(c=>({...c,image:''}));return copy}
function localImageMap(){const m={};for(const c of getCharacters())if(c.image)m[c.id]=c.image;return m}
function mergeLocalImages(p){const m=localImageMap();p.characters=(p.characters||[]).map(c=>({...c,image:m[c.id]||c.image||''}));return p}
function cloudDocPayload(){const p=stripImagesForCloud(project());return{title:(p.project?.config?.name||'새로운 사연').slice(0,120),updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAtClient:new Date().toISOString(),appVersion:APP_VERSION,data:p}}
async function googleLogin(){try{cloudStatus('Google 로그인 창을 여는 중...');await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}catch(e){cloudStatus('로그인 실패: '+e.message,'bad')}}
async function googleLogout(){try{await auth.signOut()}catch(e){cloudStatus('로그아웃 실패: '+e.message,'bad')}}
function setCloudControls(on){for(const id of ['newCloudBtn','saveCloudBtn','cloudProjectSelect','refreshCloudBtn'])$(id).disabled=!on;$('deleteCloudBtn').disabled=!on||!currentCloudProjectId;$('loginBtn').classList.toggle('hidden',on);$('logoutBtn').classList.toggle('hidden',!on)}
async function refreshCloudProjects(selectId=''){if(!currentUser)return;try{cloudStatus('클라우드 목록 불러오는 중...');const snap=await db.collection('users').doc(currentUser.uid).collection('projects').orderBy('updatedAtClient','desc').get();const sel=$('cloudProjectSelect');sel.innerHTML='<option value="">클라우드 프로젝트 선택</option>';snap.forEach(doc=>{const d=doc.data(),o=document.createElement('option');o.value=doc.id;o.textContent=(d.title||'이름 없는 프로젝트')+' · '+String(d.updatedAtClient||'').slice(0,16).replace('T',' ');sel.appendChild(o)});if(selectId||currentCloudProjectId)sel.value=selectId||currentCloudProjectId;cloudStatus(`클라우드 프로젝트 ${snap.size}개`,'ok')}catch(e){cloudStatus('목록 불러오기 실패: '+e.message,'bad')}}
async function newCloudProject(){if(!currentUser)return;const title=prompt('새 클라우드 프로젝트 이름','새로운 사연');if(!title)return;$('name').value=title;currentCloudProjectId=db.collection('users').doc(currentUser.uid).collection('projects').doc().id;await saveCloudProject(false);await refreshCloudProjects(currentCloudProjectId);$('deleteCloudBtn').disabled=false}
async function saveCloudProject(silent=true){if(!currentUser||cloudApplying)return;if(!currentCloudProjectId)currentCloudProjectId=db.collection('users').doc(currentUser.uid).collection('projects').doc().id;try{if(!silent)cloudStatus('클라우드 저장 중...');await cloudProjectRef(currentCloudProjectId).set(cloudDocPayload(),{merge:true});$('deleteCloudBtn').disabled=false;cloudStatus('클라우드 저장 완료 · '+new Date().toLocaleTimeString(),'ok');if(!silent)await refreshCloudProjects(currentCloudProjectId)}catch(e){cloudStatus('클라우드 저장 실패: '+e.message,'bad')}}
async function loadSelectedCloudProject(){const id=$('cloudProjectSelect').value;if(!id||!currentUser)return;try{cloudStatus('클라우드 프로젝트 불러오는 중...');const snap=await cloudProjectRef(id).get();if(!snap.exists)throw new Error('프로젝트가 없습니다.');cloudApplying=true;const p=mergeLocalImages(snap.data().data||{});applyProject(p);currentCloudProjectId=id;localStorage.setItem(LOCAL_KEY,JSON.stringify(project()));$('deleteCloudBtn').disabled=false;cloudStatus('클라우드 프로젝트를 불러왔습니다.','ok')}catch(e){cloudStatus('클라우드 불러오기 실패: '+e.message,'bad')}finally{cloudApplying=false}}
async function deleteCloudProject(){if(!currentUser||!currentCloudProjectId)return;if(!confirm('현재 클라우드 프로젝트를 삭제할까요? 이 작업은 되돌릴 수 없습니다.'))return;try{await cloudProjectRef(currentCloudProjectId).delete();currentCloudProjectId='';$('deleteCloudBtn').disabled=true;await refreshCloudProjects();cloudStatus('클라우드 프로젝트를 삭제했습니다.','ok')}catch(e){cloudStatus('클라우드 삭제 실패: '+e.message,'bad')}}
function scheduleCloudSave(){clearTimeout(cloudSaveTimer);if(!currentUser||!currentCloudProjectId||cloudApplying)return;cloudSaveTimer=setTimeout(()=>saveCloudProject(true),2500)}
function initFirebase(){try{firebaseApp=firebase.initializeApp(firebaseConfig);auth=firebase.auth();db=firebase.firestore();auth.onAuthStateChanged(async user=>{currentUser=user||null;setCloudControls(!!user);$('cloudUser').textContent=user?(user.displayName||user.email):'로그아웃 상태';if(user){cloudStatus('로그인 완료. 클라우드 목록을 불러옵니다.','ok');await refreshCloudProjects()}else{currentCloudProjectId='';$('cloudProjectSelect').innerHTML='<option value="">클라우드 프로젝트 선택</option>';cloudStatus('로그인하면 PC와 휴대폰에서 같은 프로젝트를 사용할 수 있습니다.')}})}catch(e){cloudStatus('Firebase 초기화 실패: '+e.message,'bad')}}

initFirebase();
