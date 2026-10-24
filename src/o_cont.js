/* ───────── 연대표: 시대 버튼 = 전체 속에서 그 시대로 이동 (한 줄로 이어 그림) ───────── */
let ovCont=null,ovBuilding=false;
function ovSecs(){return [...$('ovchart').querySelectorAll('.ovsec')]}
function buildCont(){const H=ovDir==='h',sc=$('ovscroll'),parts=[];ovBuilding=true;
  try{for(const E of ERAS){drawEra(E.k);const html=$('ovchart').innerHTML;
    parts.push(H?`<section class="ovsec hsec" data-sec="${E.k}">${html}</section>`:`<section class="ovsec vsec" data-sec="${E.k}"><div class="ovsumh ovsech"><h2>${esc(E.n)}</h2><span>${esc(E.rg)}</span></div>${html}<div class="ovsecsum">${sumHTML(E)}</div></section>`)}}
  finally{ovBuilding=false}
  $('v-ov').classList.toggle('hzsplit',H);
  $('ovchart').innerHTML=H?`<div class="hzall">${parts.join('')}</div>`:parts.join('');
  $('ovsum').innerHTML='';$('ovside').innerHTML='';
  ovCont={dir:ovDir,w:sc.clientWidth,dirty:false};if(H)hzSync()}
function ovGoSec(k,smooth){const s=$('ovchart').querySelector(`.ovsec[data-sec="${k}"]`);if(!s)return;
  if(ovDir==='h'){const sc=$('ovscroll');sc.scrollTo({left:s.getBoundingClientRect().left-sc.getBoundingClientRect().left+sc.scrollLeft,behavior:smooth?'smooth':'auto'})}
  else{const rd=$('ovread');const hd=$('v-ov').querySelector('.rhead');const top=Math.max(rd.getBoundingClientRect().top,hd&&hd.offsetHeight?hd.getBoundingClientRect().bottom:0);const y=s.getBoundingClientRect().top-top+rd.scrollTop-6;rd.scrollTo({top:y,behavior:smooth?'smooth':'auto'})}}
{const prev=drawEra;drawEra=function(k){if(ovBuilding||k==='all'||k==='heart'||!ERA[k]){if(!ovBuilding)ovCont=null;return prev(k)}
  const sc=$('ovscroll');if(!ovCont||ovCont.dir!==ovDir||ovCont.dirty||Math.abs(sc.clientWidth-ovCont.w)>24||!$('ovchart').querySelector('.ovsec'))buildCont();
  requestAnimationFrame(()=>ovGoSec(k))}}
{const os=ovShow;ovShow=function(k,keep){if(ovCont&&typeof ovDirty!=='undefined'&&ovDirty)ovCont.dirty=true;os(k,keep);if(ovCont&&ERA[k]&&!keep){ovGoSec(k);requestAnimationFrame(()=>ovGoSec(k))}}}
/* 스크롤하면 지금 보이는 시대 버튼에 불 켜기 */
let ovSpyT=0;function ovSpy(){if(!ovCont)return;clearTimeout(ovSpyT);ovSpyT=setTimeout(()=>{const H=ovDir==='h',ref=H?$('ovscroll').getBoundingClientRect().left+60:$('ovread').getBoundingClientRect().top+80;let cur=null;
  for(const s of ovSecs()){const r=s.getBoundingClientRect();if((H?r.left:r.top)<=ref)cur=s.dataset.sec}if(!cur||cur===ovSel)return;ovSel=cur;store.set('overa',cur);
  $('ovchips').querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.e===cur));const a=$('ovchips').querySelector(`[data-e="${cur}"]`);if(a)a.scrollIntoView({inline:'nearest',block:'nearest',behavior:'smooth'})},80)}
$('ovscroll').addEventListener('scroll',ovSpy,{passive:true});$('ovread').addEventListener('scroll',ovSpy,{passive:true});
/* 가로: 시대마다 요약·왕 이름이 그 시대 안에서 왼쪽에 붙어 따라오게 */
hzSync=function(){const sc=$('ovscroll');if(!sc)return;const L=sc.scrollLeft,cw=sc.clientWidth,SL=sc.getBoundingClientRect().left;
  sc.querySelectorAll('.hzwrap').forEach(w=>{const sec=w.closest('.ovsec'),x0=w.getBoundingClientRect().left-SL+L,ww=w.offsetWidth;if(x0>L+cw||x0+ww<L)return;
    const s=w.querySelector('.hzsum');if(s)s.style.transform=`translateX(${Math.max(0,Math.min(L-x0,ww-s.offsetWidth))}px)`;
    w.querySelectorAll('.hzbot .hzk').forEach(k=>{const sp=k.firstElementChild;if(!sp)return;const a=k.getBoundingClientRect().left-SL+L,kw=k.offsetWidth;sp.style.transform=`translateX(${Math.max(0,Math.min(L-a,kw-sp.offsetWidth-4))}px)`})})};
/* 시대 버튼은 왼쪽 세로 줄로 */
function ovRail(){const v=$('v-ov');let r=$('ovrail');if(!r){r=document.createElement('nav');r.id='ovrail';r.setAttribute('aria-label','시대');v.prepend(r)}
  const d=v.querySelector('.ovdir'),c=$('ovchips');if(d&&d.parentNode!==r)r.prepend(d);if(c&&c.parentNode!==r)r.append(c);v.classList.add('railed')}
{const oc=ovChips;ovChips=function(){const x=oc.apply(this,arguments);ovRail();return x}}
if(document.querySelector('#v-ov .ovdir')||$('ovchips').children.length)ovRail();
/* 좁은 화면: 옆으로 넘치는 줄은 마우스로도 끌어서 넘기기, 휠도 가로로 */
{const SEL='.jump,.chips,.htree,.hchain,#ovscroll,.fontgrid';let dr=null,moved=false;
 document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;const el=e.target.closest(SEL);if(!el||el.scrollWidth<=el.clientWidth+2)return;if(e.target.closest('input,textarea,.hzbot'))return;dr={el,x:e.clientX,sl:el.scrollLeft};moved=false});
 document.addEventListener('pointermove',e=>{if(!dr)return;const dx=e.clientX-dr.x;if(!moved&&Math.abs(dx)>5){moved=true;dr.el.classList.add('dragging')}if(moved){dr.el.scrollLeft=dr.sl-dx;e.preventDefault()}});
 const end=()=>{if(dr){dr.el.classList.remove('dragging');dr=null}};document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
 document.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
 document.addEventListener('wheel',e=>{const el=e.target.closest('.jump,.chips');if(!el||el.scrollWidth<=el.clientWidth+2||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;if(el.closest('#ovrail'))return;el.scrollLeft+=e.deltaY;e.preventDefault()},{passive:false})}
/* ───────── 한눈에 구분: 칸마다 색·상자·굵은 제목 ───────── */
const SEC_COL={'업적':'#b91c1c','어떤 사람':'#b91c1c','관련 사건':'#1d4ed8','최후':'#475569','물러남':'#475569','동시대 왕':'#7c3aed','동시대':'#7c3aed','동시대 인물':'#047857','함께 나오는 인물':'#047857','같은 시기 인물':'#0e7490','주변국':'#b45309'};
const NAT_COL={'고조선':'#8a6d1f','가야':'#6b7280','고구려':'#b91c1c','백제':'#1d4ed8','신라':'#a16207','발해':'#6d28d9','후고구려':'#be123c','후백제':'#2563eb','고려':'#0f766e','조선':'#1e40af','대한제국':'#b08900','한국':'#1d4ed8','대한민국':'#1d4ed8','북한':'#b91c1c','중국':'#c2410c','북방 민족':'#7c2d12','일본':'#be185d','미국':'#0369a1','러시아·소련':'#991b1b','영국':'#4338ca','프랑스':'#4f46e5','독일':'#3f3f46','캐나다':'#dc2626','인도':'#ea580c','외국':'#64748b','기타':'#64748b'};
function paintSections(root){if(!root)return;root.querySelectorAll('.kpin>section').forEach(s=>{const h=s.querySelector('h3');if(!h)return;const k=h.textContent.trim();const c=SEC_COL[k]||Object.entries(SEC_COL).find(([a])=>k.startsWith(a))?.[1]||'#475569';s.style.setProperty('--sc',c);s.classList.add('kpsec')});
  root.querySelectorAll('.kpng p>b').forEach(b=>{b.style.setProperty('--nc',NAT_COL[b.textContent.trim()]||'#64748b')})}
{const ok=openKing;openKing=function(){ok.apply(this,arguments);paintSections($('kpage'))};const op=openPerson;openPerson=function(){op.apply(this,arguments);paintSections($('kpage'))}}
/* 검색 결과: 묶음마다 색 상자 */
const SR_COL={'인물':'#047857','왕':'#7c3aed','구조도':'#c2410c','낱말':'#6d28d9','사건':'#1d4ed8','장소':'#0e7490'};
{const sr=srRun;srRun=function(q){sr(q);const box=$('srres');if(!box.querySelector('h4'))return;const out=document.createElement('div');let g=null;[...box.childNodes].forEach(n=>{if(n.nodeType===1&&n.tagName==='H4'){g=document.createElement('div');g.className='srgrp';const k=Object.keys(SR_COL).find(k=>n.textContent.startsWith(k));g.style.setProperty('--sc',SR_COL[k]||'#475569');out.appendChild(g)}(g||out).appendChild(n)});box.innerHTML='';box.appendChild(out)}}
