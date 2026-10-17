/* v24.4 — extract script characters, assign stored faces after writing. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const roles=['낯선 할아버지','낯선 할머니','할아버지','할머니','시아버지','시어머니','친정엄마','친정아빠','아버지','어머니','남편','아내','아들','딸','손자','손녀','며느리','사위','시누이','아주버니','형님','동생','형','누나','언니','오빠','이웃','경비원','택시기사','의사','간호사','변호사','사장','직장동료','친구','주인공'];
let entries=[];
const storeKey=()=>`sseoljeng-script-casting:${($('name')?.value||'새로운 사연').trim().slice(0,90)}`;
function save(){try{localStorage.setItem(storeKey(),JSON.stringify(entries))}catch(e){}}
function restore(){try{const x=JSON.parse(localStorage.getItem(storeKey())||'[]');entries=Array.isArray(x)?x.filter(e=>e&&typeof e.label==='string'&&typeof e.face==='string').slice(0,100):[]}catch(e){entries=[]}render()}
function blueprintPeople(){const text=$('blueprint')?.value||'';const out=[];let section='';for(const line of text.split('\n')){const h=line.trim();if(/^#{1,5}\s*(주요 등장인물|보조 등장인물|기타 엑스트라)/.test(h)){section=h.includes('주요')?'main':h.includes('보조')?'support':'extra';continue}if(/^#{1,5}\s|^\[/.test(h)&&!h.includes('등장인물'))section='';if(!['main','support'].includes(section)||!/^[-*•]\s*/.test(h))continue;const first=h.replace(/^[-*•]\s*/,'').split(/[|｜]/)[0].replace(/\[[^\]]+\]/g,'').trim();const label=first.replace(/^(?:이름|호칭)\s*[:：]\s*/,'').slice(0,35);if(label&&label.length<36&&!/^(없음|미정|예시)/.test(label))out.push({label,group:section,face:''})}return out.slice(0,24)}
function scan(){if(!($('story')?.value||'').trim()){alert('먼저 본문 원고를 붙여넣어 주세요.');return}const parsed=blueprintPeople();const old=new Map(entries.map(e=>[e.label,e]));if(!parsed.length){$('scriptCastStatus').textContent='설계도에서 주요/보조 등장인물 목록을 찾지 못했습니다. 설계도 AI를 다시 생성하거나 아래에서 인물을 직접 추가하세요. 일반 단어를 인물로 잘못 추출하지 않도록 본문 단어 자동 추출은 중지했습니다.';render();return}entries=parsed.map(e=>({...e,face:old.get(e.label)?.face||''}));save();render();$('scriptCastStatus').textContent=`설계도에서 주요 ${entries.filter(e=>e.group==='main').length}명 · 보조 ${entries.filter(e=>e.group==='support').length}명을 불러왔습니다. 기타 엑스트라는 얼굴 배정이 필요 없습니다.`}
function add(){const input=$('scriptCastNew');const label=input.value.trim().slice(0,60);if(!label)return;if(!entries.some(e=>e.label===label))entries.push({label,group:'support',face:''});input.value='';save();render()}
function render(){const root=$('scriptCastList');if(!root)return;root.replaceChildren();const chars=typeof getCharacters==='function'?getCharacters():[];
for(const [i,e] of entries.entries()){
const item=document.createElement('div');item.className='cast-item';const label=document.createElement('label');label.textContent=(e.group==='main'?'⭐ ':e.group==='support'?'· ':'')+e.label;label.title='본문에서 추출한 이름 또는 호칭';
const sel=document.createElement('select');sel.setAttribute('aria-label',e.label+' 얼굴 선택');
const choices=[['','얼굴 미배정'],...chars.filter(c=>c.image).map(c=>[c.id,`${c.name} · 얼굴 사진`])];
for(const [v,t] of choices){const o=document.createElement('option');o.value=v;o.textContent=t;sel.append(o)}sel.value=e.face;if(sel.value!==e.face){sel.value='';e.face=''}
sel.onchange=()=>{e.face=sel.value;save()};const del=document.createElement('button');del.textContent='×';del.title='후보 제거';del.onclick=()=>{entries.splice(i,1);save();render()};item.append(label,sel,del);root.append(item)}
$('scriptCastCount').textContent=`${entries.length}명 후보 · ${entries.filter(e=>e.face).length}명 배정`;
}
function castingText(){const chars=typeof getCharacters==='function'?getCharacters():[];const assigned=entries.map(e=>{const c=chars.find(c=>c.id===e.face);return c?`- 대본 등장인물 「${e.label}」: 선택한 사진 [${c.internalId}]을 얼굴 외형 참고로만 사용. 보관함의 이름·나이·역할·성격·의상은 절대 적용 금지.`:`- 대본 등장인물 「${e.label}」: 얼굴 미배정 (대본의 인물 설정 유지)`});return assigned.length?'\n\n[이 작품의 대본 분석 후 확정한 등장인물 배정 — 최우선]\n'+assigned.join('\n')+'\n동일 인물의 얼굴형·체격·외모는 장면 전체에서 일관되게 유지. 미배정 인물의 외모를 확정된 인물과 혼동하지 마세요.':''}
window.scriptFaceOnlyCastText=()=>{const t=castingText();return t||'대본/설계도에 적힌 등장인물 정보를 우선. 기타 엑스트라는 임의 얼굴 생성.'};
function mount(){const story=$('story');if(!story)return;const panel=document.createElement('details');panel.id='scriptCastPanel';panel.open=false;
panel.innerHTML=`<summary>🎭 대본 등장인물 분석 · 얼굴 배정 <span id="scriptCastCount" style="font-size:12px;opacity:.75">0명 후보</span></summary><div class="cast-actionbar"><button id="scriptCastScan" type="button">🔎 설계도 인물 불러오기</button><button id="scriptCastRefresh" type="button">↻ 얼굴 목록 갱신</button><button id="scriptCastClear" type="button">배정 초기화</button></div><div class="cast-note" id="scriptCastStatus">설계도 AI 생성 후 주요/보조 인물만 불러옵니다. 기타 엑스트라는 자동 얼굴 생성합니다.</div><div class="cast-custom"><input id="scriptCastNew" placeholder="직접 추가: 낯선 할아버지, 김 기사 등" maxlength="60"><button type="button" id="scriptCastAdd" class="btn ghost">추가</button></div><div class="cast-list" id="scriptCastList"></div><div class="cast-note" style="margin-top:8px">얼굴만 작품별로 배정됩니다. 이름·나이·역할·의상은 대본을 따릅니다. 선택한 얼굴은 이미지 프롬프트에 반영됩니다. 얼굴 사진 자체는 기존 캐릭터 라이브러리/클라우드에서 관리합니다.</div>`;
const bar=story.previousElementSibling;if(bar)bar.before(panel);else story.before(panel);
$('scriptCastScan').onclick=scan;$('scriptCastRefresh').onclick=render;$('scriptCastAdd').onclick=add;$('scriptCastNew').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();add()}};
$('scriptCastClear').onclick=()=>{if(confirm('현재 작품의 등장인물 배정을 초기화할까요?')){entries=[];save();render()}};
$('name')?.addEventListener('change',restore);restore();
// Do not change existing subtitle, spelling or character persistence code.


}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
