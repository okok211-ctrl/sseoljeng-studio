/* v24.4 — extract script characters, assign stored faces after writing. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const roles=['낯선 할아버지','낯선 할머니','할아버지','할머니','시아버지','시어머니','친정엄마','친정아빠','아버지','어머니','남편','아내','아들','딸','손자','손녀','며느리','사위','시누이','아주버니','형님','동생','형','누나','언니','오빠','이웃','경비원','택시기사','의사','간호사','변호사','사장','직장동료','친구','주인공'];
let entries=[];
const storeKey=()=>`sseoljeng-script-casting:${($('name')?.value||'새로운 사연').trim().slice(0,90)}`;
function save(){try{localStorage.setItem(storeKey(),JSON.stringify(entries))}catch(e){}}
function restore(){try{const x=JSON.parse(localStorage.getItem(storeKey())||'[]');entries=Array.isArray(x)?x.filter(e=>e&&typeof e.label==='string'&&typeof e.face==='string').slice(0,100):[]}catch(e){entries=[]}render()}
function scan(){const text=$('story')?.value||'';if(!text.trim()){alert('먼저 본문 원고를 붙여넣어 주세요.');return}const found=[];
for(const role of roles){const escaped=role.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const re=new RegExp(`(^|[^가-힣])${escaped}(?=$|[^가-힣]|은|는|이|가|을|를|께|에게|와|과|도|의|님|씨)`, 'gm');if(re.test(text))found.push(role)}
// Detect common explicit name references; require repeated use to reduce false positives.
const names=new Map();const re=/(?:^|[\s“"'‘])([가-힣]{2,4})(?:은|는|이|가|을|를|에게|한테|와|과|의|도|씨|님)(?=[\s,.!?\n”"'’]|$)/gm;let m;while((m=re.exec(text))!==null){const n=m[1];if(roles.includes(n)||/^(그녀|그분|우리|제가|나는|저는|사람|남자|여자|엄마|아빠|정말|오늘|어제|그때|그날|이제|그런|그렇게|그것|그게|제가|우리|가족|자신|마음|처음|나중|모두|저희|당시|계속|이번|지난|다시|하나|하루|시간|이야기|사실|그런데)$/.test(n))continue;names.set(n,(names.get(n)||0)+1)}
for(const [n,k] of names)if(k>=2)found.push(n);
const old=new Map(entries.map(e=>[e.label,e]));entries=[...new Set(found)].slice(0,80).map(label=>old.get(label)||{label,face:''});save();render();$('scriptCastStatus').textContent=`본문에서 ${entries.length}개 인물·호칭 후보를 찾았습니다. 같은 인물의 호칭은 직접 정리하고 얼굴을 배정하세요.`}
function add(){const input=$('scriptCastNew');const label=input.value.trim().slice(0,60);if(!label)return;if(!entries.some(e=>e.label===label))entries.push({label,face:''});input.value='';save();render()}
function render(){const root=$('scriptCastList');if(!root)return;root.replaceChildren();const chars=typeof getCharacters==='function'?getCharacters():[];
for(const [i,e] of entries.entries()){
const item=document.createElement('div');item.className='cast-item';const label=document.createElement('label');label.textContent=e.label;label.title='본문에서 추출한 이름 또는 호칭';
const sel=document.createElement('select');sel.setAttribute('aria-label',e.label+' 얼굴 선택');
const choices=[['','미배정 / 새 얼굴 예정'],...chars.map(c=>[c.id,`${c.name} · ${c.role}${c.image?' 📷':''}`])];
for(const [v,t] of choices){const o=document.createElement('option');o.value=v;o.textContent=t;sel.append(o)}sel.value=e.face;if(sel.value!==e.face){sel.value='';e.face=''}
sel.onchange=()=>{e.face=sel.value;save()};const del=document.createElement('button');del.textContent='×';del.title='후보 제거';del.onclick=()=>{entries.splice(i,1);save();render()};item.append(label,sel,del);root.append(item)}
$('scriptCastCount').textContent=`${entries.length}명 후보 · ${entries.filter(e=>e.face).length}명 배정`;
}
function castingText(){const chars=typeof getCharacters==='function'?getCharacters():[];const assigned=entries.map(e=>{const c=chars.find(c=>c.id===e.face);return c?`- 대본 호칭/이름 「${e.label}」 = [${c.internalId}] ${c.name} (${c.role}) · ${c.age||''} · ${c.appearance||''}${c.image?' · 기준 얼굴 이미지 등록됨':''}`:`- 대본 호칭/이름 「${e.label}」 = 미배정 (이미지 제작 전에 얼굴 지정 필요)`});return assigned.length?'\n\n[이 작품의 대본 분석 후 확정한 등장인물 배정 — 최우선]\n'+assigned.join('\n')+'\n동일 인물의 얼굴형·체격·외모는 장면 전체에서 일관되게 유지. 미배정 인물의 외모를 확정된 인물과 혼동하지 마세요.':''}
function mount(){const story=$('story');if(!story)return;const panel=document.createElement('details');panel.id='scriptCastPanel';panel.open=false;
panel.innerHTML=`<summary>🎭 대본 등장인물 분석 · 얼굴 배정 <span id="scriptCastCount" style="font-size:12px;opacity:.75">0명 후보</span></summary><div class="cast-actionbar"><button id="scriptCastScan" type="button">🔎 본문에서 인물 찾기</button><button id="scriptCastRefresh" type="button">↻ 얼굴 목록 갱신</button><button id="scriptCastClear" type="button">배정 초기화</button></div><div class="cast-note" id="scriptCastStatus">본문을 완성한 뒤 분석하세요. 자동 추출은 후보 추천이므로 빠진 인물은 추가하고 같은 사람의 호칭은 확인해야 합니다.</div><div class="cast-custom"><input id="scriptCastNew" placeholder="직접 추가: 낯선 할아버지, 김 기사 등" maxlength="60"><button type="button" id="scriptCastAdd" class="btn ghost">추가</button></div><div class="cast-list" id="scriptCastList"></div><div class="cast-note" style="margin-top:8px">선택한 얼굴은 작품별로 저장되며 이미지 프롬프트의 인물 배정 지시에 반영됩니다. 얼굴 사진 자체는 기존 캐릭터 라이브러리/클라우드에서 관리합니다.</div>`;
const bar=story.previousElementSibling;if(bar)bar.before(panel);else story.before(panel);
$('scriptCastScan').onclick=scan;$('scriptCastRefresh').onclick=render;$('scriptCastAdd').onclick=add;$('scriptCastNew').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();add()}};
$('scriptCastClear').onclick=()=>{if(confirm('현재 작품의 등장인물 배정을 초기화할까요?')){entries=[];save();render()}};
$('name')?.addEventListener('change',restore);restore();
// Do not change existing subtitle, spelling or character persistence code.
if(typeof imageCastText==='function'){const old=imageCastText;imageCastText=function(){return old()+castingText()}}
if(typeof activeCastText==='function'){const old=activeCastText;activeCastText=function(){return old()+castingText()}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
