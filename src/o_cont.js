/* ───────── 연대표: 시대 버튼 = 전체 속에서 그 시대로 이동 (한 줄로 이어 그림) ───────── */
let ovCont=null,ovBuilding=false;
function ovSecs(){return [...$('ovchart').querySelectorAll('.ovsec')]}
function buildCont(){const V=ovDir==='v',sc=$('ovscroll'),parts=[];ovBuilding=true;if(V)ovDir='h';
  try{for(const E of ERAS){drawEra(E.k);const html=$('ovchart').innerHTML;
    parts.push(`<section class="ovsec hsec" data-sec="${E.k}">${html}</section>`)}}
  finally{ovBuilding=false;if(V)ovDir='v'}
  $('v-ov').classList.add('hzsplit');
  $('ovchart').innerHTML=`<div class="hzall">${parts.join('')}</div>`;
  $('ovsum').innerHTML='';$('ovside').innerHTML='';
  if(V)vSlice();else hzAlign();
  ovCont={dir:ovDir,w:sc.clientWidth,dirty:false};if(!V)hzSync()}
/* 세로: 가로 연대표를 화면 폭만큼 잘라 줄줄이 쌓기 (글자 안 잘리는 자리에서 자름) */
function vSlice(){const sc=$('ovscroll'),cw=Math.max(280,sc.clientWidth-20),out=[];
  for(const s of $('ovchart').querySelectorAll('.hsec')){const top=s.querySelector('.hztop');if(!top)continue;const r0=top.getBoundingClientRect(),W=top.scrollWidth||r0.width,H=top.offsetHeight;
    const iv=[],bx=[];top.querySelectorAll('*').forEach(el=>{if(el.children.length&&!(el instanceof SVGElement))return;const r=el.getBoundingClientRect();if(!r.width||!r.height)return;const L=r.left-r0.left,T=r.top-r0.top;if(r.height<H*.8)bx.push([L,L+r.width,T,T+r.height]);if(r.width>cw*.6)return;iv.push([L-3,L+r.width+3])});
    const ok=x=>!iv.some(([a,b])=>x>a&&x<b);const Wc=Math.min(W,Math.max(0,...iv.map(q=>q[1]))+12);let x0=0;const rows=[];
    while(x0<Wc-2){let x1=Math.min(Wc,x0+cw);if(x1<Wc){let c=x1;while(c>x0+cw*.45&&!ok(c))c-=4;if(c>x0+cw*.45)x1=c}rows.push([x0,x1]);x0=x1}
    const inner=top.outerHTML;
    out.push(`<section class="ovsec vsec vcut" data-sec="${s.dataset.sec}">${rows.map(([a,b])=>{const ys=bx.filter(q=>q[1]>a&&q[0]<b);const y0=Math.max(0,Math.min(...ys.map(q=>q[2]))-6),y1=Math.min(H,Math.max(...ys.map(q=>q[3]))+6);const t=isFinite(y0)?y0:0,h=isFinite(y1)?y1-t:H;return `<div class="vrow" style="width:${Math.ceil(b-a)}px;height:${h}px"><div class="vrin" style="left:${-a}px;top:${-t}px;width:${W}px;height:${H}px">${inner}</div></div>`}).join('')}</section>`)}
  $('v-ov').classList.remove('hzsplit');$('ovchart').innerHTML=out.join('')}
/* 가로: 시대마다 연도 줄 높이를 맞춰 한 줄로 이어지게 */
function hzAlign(){const secs=[...$('ovchart').querySelectorAll('.hsec')];const ys=secs.map(s=>{const a=s.querySelector('.hzax');return a?a.getBoundingClientRect().top:null});const mx=Math.max(...ys.filter(v=>v!=null));
  secs.forEach((s,i)=>{if(ys[i]==null)return;const d=mx-ys[i];if(d<1)return;const top=s.querySelector('.hztop');const inner=top&&top.querySelector(':scope>div[style*="left:0;right:0"]');if(!inner)return;inner.style.top=(parseFloat(inner.style.top)||0)+d+'px';top.style.height=(top.offsetHeight+d)+'px'});
  const hs=secs.map(s=>s.querySelector('.hztop').offsetHeight);const mh=Math.max(...hs);secs.forEach((s,i)=>{const t=s.querySelector('.hztop');if(hs[i]<mh)t.style.height=mh+'px'})}
function ovGoSec(k,smooth){const s=$('ovchart').querySelector(`.ovsec[data-sec="${k}"]`);if(!s)return;
  if(ovDir==='h'){const sc=$('ovscroll');sc.scrollTo({left:s.getBoundingClientRect().left-sc.getBoundingClientRect().left+sc.scrollLeft,behavior:smooth?'smooth':'auto'})}
  else{const rd=$('ovread');const hd=$('v-ov').querySelector('.rhead');const top=Math.max(rd.getBoundingClientRect().top,hd&&hd.offsetHeight?hd.getBoundingClientRect().bottom:0);const y=s.getBoundingClientRect().top-top+rd.scrollTop-6;rd.scrollTo({top:y,behavior:smooth?'smooth':'auto'})}}
{const prev=drawEra;drawEra=function(k){if(ovBuilding||k==='all'||k==='heart'||!ERA[k]){if(!ovBuilding)ovCont=null;return prev(k)}
  const sc=$('ovscroll');if(!ovCont||ovCont.dir!==ovDir||ovCont.dirty||Math.abs(sc.clientWidth-ovCont.w)>24||!$('ovchart').querySelector('.ovsec'))buildCont();
  requestAnimationFrame(()=>ovGoSec(k))}}
{const os=ovShow;ovShow=function(k,keep){if(ovCont&&typeof ovDirty!=='undefined'&&ovDirty)ovCont.dirty=true;const had=!!(ovCont&&$('ovchart').querySelector('.ovsec'));const sc=$('ovscroll'),rd=$('ovread'),sl=sc.scrollLeft,st=rd.scrollTop;os(k,keep);if(ovCont&&ERA[k]&&!keep){if(had){sc.scrollLeft=sl;rd.scrollTop=st;requestAnimationFrame(()=>ovGoSec(k,true))}else{ovGoSec(k);requestAnimationFrame(()=>ovGoSec(k))}}}}
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
/* 마우스를 올리면 버튼 이름 말풍선 (아이콘 버튼·로그인 등) */
{const tip=document.createElement('div');tip.id='hovtip';document.body.appendChild(tip);let cur=null,tT=0;
 const nameOf=el=>{if(el.title){el.dataset.tt=el.title;el.removeAttribute('title')}return el.dataset.tt||el.getAttribute('aria-label')||''};
 const isIconish=el=>{const t=(el.textContent||'').replace(/\s+/g,'');return !t||t.length<=3||el.dataset.tt};
 document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const el=e.target.closest('button[aria-label],button[title],button[data-tt],[role=button][aria-label]');if(!el||el===cur)return;if(!isIconish(el)&&!el.matches('.loginb')){return}const n=nameOf(el);if(!n)return;cur=el;clearTimeout(tT);tT=setTimeout(()=>{if(cur!==el)return;tip.textContent=n;tip.classList.add('on');const r=el.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;let x=r.left+r.width/2-w/2,y=r.bottom+8;if(y+h>innerHeight-6)y=r.top-h-8;x=Math.max(6,Math.min(innerWidth-w-6,x));tip.style.left=x+'px';tip.style.top=y+'px'},250)});
 document.addEventListener('pointerout',e=>{if(!cur)return;if(e.relatedTarget&&cur.contains(e.relatedTarget))return;cur=null;clearTimeout(tT);tip.classList.remove('on')});
 document.addEventListener('pointerdown',()=>{cur=null;clearTimeout(tT);tip.classList.remove('on')},true)}
/* 지도 아이콘 설명 모아 보기 */
{const z=document.querySelector('.zoom');if(z){z.insertAdjacentHTML('beforeend','<button id="zleg" type="button" aria-label="아이콘 설명"><svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6M12 16.8v.2"/></svg></button>');
 const pop=document.createElement('div');pop.id='iconleg';pop.hidden=true;$('v-map').appendChild(pop);
 const ic=(inner,cls='')=>`<svg viewBox="-13 -13 26 26" class="lgi"><g class="pin ${cls}">${inner}</g></svg>`;
 const dot=c=>`<circle class="dot" r="8" style="fill:${c}"/>`;const gl=k=>{const I=ICON_GL[k];return ic(dot(I[2]||'var(--t-pol)')+`<path class="gp${I[1]?' f':''}${k==='inc'?' bold':''}" d="${I[0]}"/>`)};
 const rows=[
  ['나라 세움',ic(dot('#c2410c')+`<path class="gp f" d="${GLYPH.crown[0]}"/>`)],
  ['멸망',ic(`<circle class="dot" r="8" style="fill:color-mix(in srgb,var(--ink) 80%,var(--seal))"/><path class="gp" d="M-3.6,-3.6L3.6,3.6M3.6,-3.6L-3.6,3.6"/>`)],
  ['침입당함 · 전쟁',ic(`<path class="burst" d="${BURST}"/><path class="burst2" d="${BURST2}"/>`)],
  ['막아냄 · 승리',gl('def')],['공격 · 진출',gl('atk')],['작전',gl('op')],
  ['조약',ic(`<circle class="seal" r="8.5"/><text class="sealt" x="0" y="3.6">조</text>`)],
  ['백성의 봉기 (난·농민 봉기)',gl('rev')],['권력 다툼 · 정변',gl('coup')],['유물 · 유적',gl('relic')],['사건 · 사고',gl('inc')],
  ['정치 · 민족 운동',`<svg viewBox="-6 -30 26 34" class="lgi"><g class="pin"><path class="pole" d="M0,1.5V-26"/><path class="flg" d="M0.8,-25.5C5,-28.5,9.5,-22,15,-25.2V-14.8C9.5,-11.6,5,-18.1,0.8,-15.1Z" style="fill:var(--t-ind)"/></g></svg>`]];
 const tps=(typeof TOPICS!=='undefined'?TOPICS:[]).map(t=>`<span><i style="background:var(--t-${t.k})"></i>${esc(t.n)}</span>`).join('');
 pop.innerHTML=`<div class="lghd"><b>지도 아이콘</b><button type="button" class="lgx" aria-label="닫기">✕</button></div><ul>${rows.map(([n,s])=>`<li>${s}<span>${n}</span></li>`).join('')}</ul>${tps?`<div class="lgt"><b>그 밖의 점 색 = 주제</b><div>${tps}</div></div>`:''}`;
 $('zleg').onclick=e=>{e.stopPropagation();pop.hidden=!pop.hidden};pop.querySelector('.lgx').onclick=()=>pop.hidden=true;
 document.addEventListener('pointerdown',e=>{if(!pop.hidden&&!e.target.closest('#iconleg,#zleg'))pop.hidden=true})}}

document.addEventListener('click',e=>{const b=e.target.closest('.sumtg');if(!b)return;const s=b.closest('.ovsec').querySelector('.ovsecsum');s.hidden=!s.hidden;b.setAttribute('aria-expanded',!s.hidden);b.textContent=s.hidden?'요약 보기':'요약 접기'});
/* ───────── 교과서 지도처럼: 사건 번호·날짜, 화살표 범례 ───────── */
const circNum=n=>n<=20?String.fromCharCode(0x2460+n-1):n<=35?String.fromCharCode(0x3251+n-21):n<=50?String.fromCharCode(0x32B1+n-36):'('+n+')';
function evDate(e){if(e.yl||e.y<-3000)return '';if(e.y<0)return 'BC '+(-e.y);return e.y+(e.m&&e.y>=1100?'.'+e.m+'.':'')}
{const byF=new Map();for(const o of OV){if(!o.pin||!o.t)continue;const f=o.pin.f;if(!byF.has(f))byF.set(f,[]);byF.get(f).push(o)}
 byF.forEach(list=>{list.sort((a,b)=>a.pin.T-b.pin.T);list.forEach((o,i)=>{const e=o.pin,t=o.t;const name=t.textContent;const d=evDate(e);t.textContent='';
   const s1=document.createElementNS('http://www.w3.org/2000/svg','tspan');s1.setAttribute('class','lnum');s1.textContent=circNum(i+1)+' ';t.appendChild(s1);
   t.appendChild(document.createTextNode(name));if(d){const s2=document.createElementNS('http://www.w3.org/2000/svg','tspan');s2.setAttribute('class','ldate');s2.textContent=' '+d;t.appendChild(s2)}})});
 schedLabels()}
/* 화살표 범례: 지금 보이는 화살표가 누구의 진로인지 */
const FOREIGN=['홍건적','중국군','중공군','거란','몽골','후금','여진','당','수','원','명','청','금','연','한','왜','러시아','프랑스','영국','미국'];
function arrName(c,e){const y=e.y;const k=n=>n;
  if(c==='japan')return y<1868?'왜군':'일본군';if(c==='north')return '북한군';if(c==='south')return '국군';if(c==='us')return y>=1950?'유엔군·미군':'미군';if(c==='ussr')return '소련군';
  if(c==='han'){const src=(e.vs||'')+' '+e.t;let best=null,bi=1e9;FOREIGN.forEach(f=>{const re=new RegExp('(^|[^가-힣])'+f+'(군|$|[^가-힣])');const m=src.match(re);if(m&&m.index<bi){bi=m.index;best=f}});return best?(/군$/.test(best)?best:best+'군'):'중국·북방 세력'}
  const D=REIGNS.find(D=>D.c===c);return D?(D.n==='남한'?'국군':D.n+'군'):c}
{const lg=document.createElement('div');lg.id='arrleg';lg.hidden=true;$('v-map').appendChild(lg);
 window.updArrLeg=function(){const seen=new Map();(byFrame[pos.i]||[]).forEach(e=>{const ps=arrOf.get(e.id);if(!ps)return;ps.forEach(p=>{const cl=p.g.classList;if(cl.contains('hide')||cl.contains('gone')||cl.contains('stale'))return;const nm=arrName(p.c,e);const key=nm+'|'+p.dash;if(!seen.has(key))seen.set(key,{nm,col:acol(p.c),dash:p.dash})})});
   if(!seen.size||$('v-map').hidden){lg.hidden=true;return}lg.hidden=false;{const dk=$('dock'),vm=$('v-map');if(dk&&vm){const a=vm.getBoundingClientRect(),b2=dk.getBoundingClientRect();lg.style.bottom=Math.max(10,a.bottom-b2.top+10)+'px'}}lg.innerHTML=[...seen.values()].slice(0,6).map(o=>`<div><svg viewBox="0 0 30 10"><path d="M2 5H20" style="stroke:${o.col};stroke-width:3"${o.dash?' stroke-dasharray="4 3"':''}/><path d="M18 0.8L28 5L18 9.2Z" style="fill:${o.col};stroke:none"/></svg>${esc(o.nm)} ${o.dash?'이동':'진로'}</div>`).join('')};
 const ut=updateTime;updateTime=function(ch){ut(ch);clearTimeout(updArrLeg.t);updArrLeg.t=setTimeout(updArrLeg,60)}}

/* 연대표 방향: 화면이 가로면 가로, 세로로 세우면 세로 (자동) */
{const fit=()=>{const want=(innerHeight>innerWidth*1.05)?'v':'h';if(want===ovDir)return;ovDir=want;ovCont=null;if(!$('v-ov').hidden&&ovSel)ovShow(ovSel)};let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(fit,250)});addEventListener('orientationchange',()=>setTimeout(fit,300))}

/* 선사 특징: 위 칸의 시대 이름(구석기·신석기) 바로 밑으로 올리기 */
function hzLift(){document.querySelectorAll('#ovchart .hzwrap').forEach(w=>{const top=w.querySelector('.hztop');const inn=top&&top.querySelector(':scope>div[style*="left:0;right:0"]');if(!inn)return;const r0=inn.getBoundingClientRect();
  const ns=[...w.querySelectorAll('.hzbot .hznt')];const lbs=ns.map(n=>{const b=n.querySelector('button[data-ev]');return b&&top.querySelector(`.hzn[data-ev="${b.dataset.ev}"]`)}).filter(Boolean);if(lbs.length>1){const t=Math.min(...lbs.map(l=>parseFloat(l.style.top)||0));lbs.forEach(l=>l.style.top=t+'px')}const sts=[...w.querySelectorAll(':scope>.hzst')].map(e=>parseFloat(e.style.left)||0).sort((a,b)=>a-b);const stOf=l=>sts.filter(v=>v<=(parseFloat(l.style.left)||0)+l.offsetWidth/2+1).pop();const so=lbs.map(stOf);if(so.every(v=>v!=null)&&new Set(so).size===so.length)lbs.forEach((l,i)=>{l.style.left=(so[i]+10)+'px';l.style.width='auto'});
  ns.forEach(n=>{const b=n.querySelector('button[data-ev]');const lb=b&&top.querySelector(`.hzn[data-ev="${b.dataset.ev}"]`);if(!lb)return;const r=lb.getBoundingClientRect();
    b.remove();n.classList.add('lift');n.style.left=(r.left-r0.left)+'px';n.style.top=(r.bottom-r0.top+4)+'px';inn.appendChild(n);const need=inn.offsetTop+n.offsetTop+n.offsetHeight+12;if(need>top.offsetHeight)top.style.height=need+'px'})})}


/* 키보드 방향키 = 부드러운 드래그 (누르고 있는 동안 일정한 속도로, 떼면 서서히 멈춤) */
{const KM={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],Left:[-1,0],Right:[1,0],Up:[0,-1],Down:[0,1],UIKeyInputLeftArrow:[-1,0],UIKeyInputRightArrow:[1,0],UIKeyInputUpArrow:[0,-1],UIKeyInputDownArrow:[0,1]},KC={37:[-1,0],38:[0,-1],39:[1,0],40:[0,1]};
 const held=new Map();let raf=0,last=0,vx=0,vy=0,tgt=null,acc={x:0,y:0},boost=1;
 const keyOf=e=>KM[e.key]||KC[e.keyCode];
 const typing=t=>t&&(t.isContentEditable||/^(TEXTAREA|SELECT)$/.test(t.tagName)||(t.tagName==='INPUT'&&!/^(checkbox|radio|button)$/.test(t.type)));
 const pick=(root,ax)=>{let best=null,ba=0;[root,...root.querySelectorAll('*')].forEach(el=>{if(!el.offsetParent&&el!==root)return;const cs=getComputedStyle(el),ov=ax?cs.overflowY:cs.overflowX;if(!/auto|scroll/.test(ov))return;const can=ax?el.scrollHeight-el.clientHeight>2:el.scrollWidth-el.clientWidth>2;if(!can)return;const r=el.getBoundingClientRect(),a=r.width*r.height;if(a>ba){ba=a;best=el}});return best};
 function findT(D){
   const ovl=[...document.querySelectorAll('#kpage,#ovpop,.modal,[role=dialog]')].find(x=>!x.hidden&&x.offsetParent!==null);
   const gen=root=>{const v=pick(root,1),h=pick(root,0);return {v:v||document.scrollingElement,h:h||null}};
   if(ovl)return gen(ovl);
   if(!$('v-map').hidden)return {map:true};
   if(!$('v-ov').hidden){const sc=$('ovscroll');if(ovDir==='h'){const b=[...sc.querySelectorAll('.hzbot')].find(b=>{const r=b.getBoundingClientRect();return r.right>0&&r.left<innerWidth});return {h:sc,v:b||null}}return {v:$('ovread'),h:null}}
   const v=[...document.querySelectorAll('section.view')].find(x=>!x.hidden);return v?gen(v):null}
 const MAXV=520; // 화면 px / 초
 function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;let dx=0,dy=0;held.forEach(d=>{dx+=d[0];dy+=d[1]});
   const k=1-Math.exp(-dt*(held.size?6:5));vx+=(dx*MAXV*boost-vx)*k;vy+=(dy*MAXV*boost-vy)*k;
   if(!held.size&&Math.abs(vx)<4&&Math.abs(vy)<4){raf=0;vx=vy=0;return}
   const mx=vx*dt,my=vy*dt;
   if(tgt&&tgt.map){const kk=kNow();setVB({...vb,x:vb.x+mx*kk,y:vb.y+my*kk});userMoved=true}
   else if(tgt){let H=tgt.h,V=tgt.v,ax=mx,ay=my;if(!H&&V&&tgt.v!==$('ovscroll')&&!(V.scrollWidth-V.clientWidth>2)){ay+=ax;ax=0}
     if(H&&ax){acc.x+=ax;const s=Math.trunc(acc.x);if(s){H.scrollLeft+=s;acc.x-=s}}
     if(V&&ay){acc.y+=ay;const s=Math.trunc(acc.y);if(s){V.scrollTop+=s;acc.y-=s}}}
   raf=requestAnimationFrame(tick)}
 addEventListener('keydown',e=>{const D=keyOf(e);if(!D||e.altKey||e.ctrlKey||e.metaKey)return;const t=e.target;if(typing(t)||(t&&t.tagName==='INPUT'&&t.type==='range'))return;
   e.preventDefault();e.stopPropagation();boost=e.shiftKey?2.5:1;if(held.has(e.code||e.key))return;
   if(!held.size||!tgt){tgt=findT(D);acc={x:0,y:0};if(tgt&&tgt.map){cancelAnimationFrame(vbRAF);if(typeof schedRecenter==='function')schedRecenter()}}
   held.set(e.code||e.key,D);if(!raf){last=performance.now();vx=D[0]*MAXV*.5*boost;vy=D[1]*MAXV*.5*boost;raf=requestAnimationFrame(tick)}},true);
 addEventListener('keyup',e=>{if(held.delete(e.code||e.key)&&!held.size&&tgt&&tgt.map&&typeof schedRecenter==='function')schedRecenter();boost=e.shiftKey?2.5:1},true);
 addEventListener('blur',()=>held.clear());}

addEventListener('pointerdown',e=>{const t=e.target;if(!(t.closest&&t.closest('input,textarea,select,[contenteditable]'))){try{window.focus()}catch(_){}}},true);try{window.focus()}catch(_){}
/* 구조도: 옆에 남는 자리가 있으면 흐름(→) 카드를 세로로 세워서 끼워 넣기 */
function trTight(tb){tb.querySelectorAll('.hn').forEach(h=>h.style.maxWidth='');tb.querySelectorAll('.trcard:not(.vtr) .htree .hn').forEach(h=>{const r0=h.getBoundingClientRect();if(!r0.width)return;let mx=0;const rg=document.createRange();const tw=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);while(tw.nextNode()){const t=tw.currentNode;if(!t.nodeValue.trim())continue;rg.selectNodeContents(t);[...rg.getClientRects()].forEach(r=>{if(r.width)mx=Math.max(mx,r.right)})}h.querySelectorAll('.ha>i').forEach(e=>{const r=e.getBoundingClientRect();if(r.width)mx=Math.max(mx,r.right)});const pr=parseFloat(getComputedStyle(h).paddingRight)||0;const w=Math.ceil(mx-r0.left+pr+1);if(w<r0.width-4)h.style.maxWidth=w+'px'})}
function trPack(){const tb=$('trbody');if(!tb||!tb.offsetParent)return;const cs=[...tb.children].filter(c=>c.classList.contains('trcard'));
  cs.forEach(c=>c.classList.remove('vtr','vfit','vauto'));trTight(tb);
  const H=()=>tb.scrollHeight;const i0=Math.max(0,cs.findIndex(c=>c.id==='tree-abroad'));
  cs.forEach(c=>{const h=c.querySelector('.htree');if(h&&h.scrollWidth>h.clientWidth+2)c.classList.add('vtr','vauto')});
  /* 앞쪽(개항기까지): 흐름 카드만 옆 자리에 세로로 끼워 넣기 */
  tb.classList.add('trmeasure');
  for(let i=1;i<i0;i++){const c=cs[i],p=cs[i-1];if(!c.querySelector('.hchain')||c.classList.contains('vtr'))continue;if(c.offsetTop===p.offsetTop)continue;
    c.classList.add('vfit');if(c.offsetTop!==p.offsetTop||c.offsetHeight>p.offsetHeight*1.6)c.classList.remove('vfit')}
  tb.classList.remove('trmeasure');
  /* 독립운동 이후: 가로·세로 중 효율적인 쪽 */
  const cls=c=>c.querySelector('.htree')?'vtr':'vfit';
  const ok=c=>c&&!/tree-(laws|orgs)/.test(c.id)&&!c.classList.contains('vauto')&&(c.querySelector('.htree')||c.querySelector('.hchain'));
  for(let i=i0;i<cs.length-1;i++){const A=cs[i],B=cs[i+1];const h0=H();let best=null,bh=h0-40;
    for(const [x,y] of [[1,0],[0,1],[1,1]]){if((x&&!ok(A))||(y&&!ok(B)))continue;if(x)A.classList.add(cls(A));if(y)B.classList.add(cls(B));const h=H();if(h<bh){bh=h;best=[x,y]}if(x)A.classList.remove(cls(A));if(y)B.classList.remove(cls(B))}
    if(best){if(best[0])A.classList.add(cls(A));if(best[1])B.classList.add(cls(B));i++}}
  cs.slice(i0).forEach(c=>{if(!ok(c))return;const k=cls(c);const h0=H();c.classList.toggle(k);if(!(H()<h0-40))c.classList.toggle(k)});
  trTight(tb)}
function keepParens(root){if(!root)return;const RE=/[^\s,()]*\([^()]{1,40}\)[^\s,()]*/g;root.querySelectorAll('.hn small,.hn em,.trflow li').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.plw,.kpar')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const ns=[];while(w.nextNode())ns.push(w.currentNode);
  ns.forEach(tn=>{const t=tn.nodeValue;RE.lastIndex=0;if(!RE.test(t))return;RE.lastIndex=0;const f=document.createDocumentFragment();let i=0,m;while((m=RE.exec(t))){if(m.index>i)f.append(t.slice(i,m.index));const sp=document.createElement('span');sp.className='kpar';sp.textContent=m[0];f.append(sp);i=m.index+m[0].length}if(i<t.length)f.append(t.slice(i));tn.replaceWith(f)})})}
{const t1=trShow;trShow=function(){const r=t1.apply(this,arguments);try{keepParens($('trbody'))}catch(e){}requestAnimationFrame(trPack);return r};let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(trPack,300)})}
/* ───────── 조약 주요 내용 (누르면 펼침) ───────── */
const TREATY_TXT={
 '미일 화친 조약':['시모다·하코다테 2개 항구 개항','미국 배에 연료·식량 공급','미국에 일방적 최혜국 대우'],
 '강화도 조약':['제1관 조선은 자주국 → 청의 종주권 부정 의도','제4·5관 부산 외 2곳 개항 (원산 1880, 인천 1883)','제7관 일본의 조선 해안 측량권','제10관 개항장 일본인 범죄는 일본 영사가 재판 (영사 재판권·치외 법권)'],
 '조일 수호 조규 부록':['개항장에서 일본 화폐 사용','일본인 거류지 설정, 간행이정 10리','(무역 규칙) 양곡 무제한 유출','(무역 규칙) 무관세, 일본 선박 항세 면제'],
 '조미 수호 통상 조약':['서양과 맺은 최초의 조약 (청 이홍장 알선)','거중 조정','최혜국 대우 (최초)','치외 법권, 협정 관세 (관세 부과 첫 인정)','→ 보빙사 파견'],
 '제물포 조약':['배상금 지불','일본 공사관에 경비병 주둔','사죄 사절 파견 (박영효, 태극기 사용)'],
 '조청 상민 수륙 무역 장정':['조선은 청의 속방','청 상인의 한성 양화진 개설·내지 통상','청의 치외 법권, 상무위원 파견','→ 청·일 상인의 경쟁 심화'],
 '한성 조약':['일본에 사과','배상금 지불','일본 공사관 신축 비용 부담'],
 '톈진 조약':['청·일 양국 군대 동시 철수','파병 시 서로 미리 알림 (행문지조)','→ 청일 전쟁 때 일본 파병의 구실'],
 '시모노세키 조약':['청은 조선이 완전한 자주 독립국임을 인정','랴오둥 반도·타이완·펑후 제도를 일본에 할양','배상금 지불','→ 삼국 간섭(러·프·독)으로 랴오둥 반도 반환'],
 '제1차 한일 협약':['일본이 추천한 고문을 둠 (고문 정치)','재정 고문 메가타 → 화폐 정리 사업','외교 고문 스티븐스'],
 '포츠머스 조약':['(포츠머스) 러시아가 일본의 한국 지도·보호·감리권 인정','(포츠머스) 사할린 남부를 일본에 넘김','(가쓰라·태프트 밀약) 미국의 필리핀, 일본의 한국 지배를 서로 인정','(제2차 영일 동맹) 영국도 일본의 한국 지배 인정'],
 '을사늑약':['대한 제국의 외교권 박탈','통감부 설치 (초대 통감 이토 히로부미)','고종의 서명·비준 없음 → 무효 주장, 헤이그 특사(1907)','→ 민영환 자결, 「시일야방성대곡」, 을사의병'],
 '샌프란시스코 강화 조약':['일본의 주권 회복','일본이 한국 독립 인정, 제주도·거문도·울릉도 포기','독도는 명시되지 않음','한국은 서명국에서 제외'],
 '정전 협정':['군사 분계선(휴전선)과 비무장 지대(DMZ) 설정','포로 자유 송환','군사 정전 위원회·중립국 감독 위원회 설치','한국 정부는 서명하지 않음 (이승만 반대)'],
 '한미 상호 방위 조약':['외부 무력 공격 시 공동 대처','미군의 한국 주둔 근거']};
function treatyTxt(e){if(!e||!e.t)return null;const k=Object.keys(TREATY_TXT).find(k=>e.t.includes(k));return k?TREATY_TXT[k]:null}
const treatyHTML=e=>{const t=treatyTxt(e);return t?`<div class="tcl"><h4>조약 주요 내용</h4>${t.map(x=>`<div class="tci">${esc(x)}</div>`).join('')}</div>`:''};
{const ed=evDetailHTML;evDetailHTML=function(e){const h=ed.apply(this,arguments);const t=treatyHTML(e);if(!t)return h;const i=h.indexOf('<p');return i>=0?h.replace(/(<p[^>]*>[\s\S]*?<\/p>)/,'$1'+t):h+t}}
document.addEventListener('click',ev=>{const tb=ev.target.closest('.tclb');if(tb){ev.stopPropagation();ev.preventDefault();const e=EVENTS.find(x=>String(x.id)===tb.dataset.tcl);const nx=tb.nextElementSibling;if(nx&&nx.classList.contains('tcl')){nx.remove();tb.classList.remove('on');return}tb.insertAdjacentHTML('afterend',treatyHTML(e));tb.classList.add('on');return}
 const li=ev.target.closest('.lawl li[data-tl]');if(!li||ev.target.closest('button,.gw,.pl'))return;ev.stopPropagation();ev.preventDefault();const e=EVENTS.find(x=>String(x.id)===li.dataset.tl);if(!e)return;let box=li.querySelector('.tcl');if(box){box.remove();li.classList.remove('open');return}const t=treatyHTML(e);if(!t)return;li.querySelector('div').insertAdjacentHTML('beforeend',t);li.classList.add('open')},true);
{const rh=rowHTML;rowHTML=function(e){const h=rh.apply(this,arguments);if(!treatyTxt(e))return h;return h.replace(/(<p>[\s\S]*?<\/p>)/,`$1<button type="button" class="tclb" data-tcl="${e.id}">조약 내용</button>`)}}
function addTclb(root){(root||document).querySelectorAll('li[data-id]:not([data-tc])').forEach(li=>{li.dataset.tc=1;const e=EVENTS.find(x=>String(x.id)===li.dataset.id);if(!treatyTxt(e))return;const p=li.querySelector('p');if(p&&!li.querySelector('.tclb'))p.insertAdjacentHTML('afterend',`<button type="button" class="tclb" data-tcl="${e.id}">조약 내용</button>`)})}
addTclb();['tlbody','tpbody'].forEach(id=>{const el=$(id);if(el)new MutationObserver(()=>addTclb(el)).observe(el,{childList:true,subtree:true})});
/* ───────── 하트 모아 보기: 시대 버튼 대신 정렬 ───────── */
const HSORTS=[['add','추가한 순'],['time','시간 흐름순'],['imp','중요도순'],['custom','사용자 정의']];
function hSorted(){const q=($('q').value||'').trim().toLowerCase();const byT=new Map();EVENTS.forEach(e=>{if(!byT.has(e.t))byT.set(e.t,e)});
  let list=[...HEARTS].map(t=>byT.get(t)).filter(Boolean);
  if(q)list=list.filter(e=>(e.t+' '+e.x+' '+(e.p||'')+' '+(e.pp||'')+' '+(e.vs||'')+' '+yearLabel(e)).toLowerCase().includes(q));
  const m=store.get('hsort','add');
  if(m==='add')list.reverse();
  else if(m==='time')list.sort((a,b)=>a.T-b.T);
  else if(m==='imp'){const sc=e=>(e.top?2:0)+(isMajor(e)?1:0);list.sort((a,b)=>sc(b)-sc(a)||a.T-b.T)}
  else if(m==='custom'){const o=store.get('hord',[]);const ix=t=>{const i=o.indexOf(t);return i<0?1e6:i};const add=[...HEARTS];list.sort((a,b)=>ix(a.t)-ix(b.t)||add.indexOf(b.t)-add.indexOf(a.t))}
  return list}
function renderHList(){const body=$('tlbody'),v=$('v-tl');const on=tlHeart==='h';v.classList.toggle('hmode',on);let box=$('hlist');
  if(!on){if(box)box.remove();return}
  if(!box){box=document.createElement('section');box.id='hlist';const kh=$('tlkh');kh?kh.after(box):body.prepend(box)}
  const m=store.get('hsort','add'),list=hSorted(),cu=m==='custom';
  box.innerHTML=`<div class="hlh"><h3>하트한 사건 <small>${list.length}</small></h3><div class="hsort"><button type="button" class="hsbtn" aria-haspopup="true" aria-expanded="false">정렬 · ${HSORTS.find(s=>s[0]===m)[1]} ▾</button><div class="hsmenu" hidden>${HSORTS.map(([k,n])=>`<button type="button" data-hs="${k}" aria-pressed="${k===m}">${n}</button>`).join('')}</div></div></div>${cu&&list.length>1?'<p class="hshint">⠿ 를 잡고 위아래로 끌어 순서를 바꿔요</p>':''}<ol class="tl hl${cu?' cu':''}">${list.map(e=>{const r=rowHTML(e);return cu?r.replace('<li ','<li draggable="false" ').replace(/(<div class="d">)/,'<span class="hdrag" title="끌어서 순서 바꾸기">⠿</span>$1'):r}).join('')}</ol>${list.length?'':`<p class="dcempty">${$('q').value?'찾는 사건이 없어요.':'아직 하트한 사건이 없어요. 사건의 ♡를 누르면 여기 모여요.'}</p>`}`;
  $('tlnone').hidden=true;try{addTclb(box)}catch(_){}}
{const rt=renderTLFilter;renderTLFilter=function(){rt.apply(this,arguments);renderHList()}}
document.addEventListener('click',ev=>{const b=ev.target.closest('.hsbtn');const mn=document.querySelector('#hlist .hsmenu');
  if(b){ev.stopPropagation();mn.hidden=!mn.hidden;b.setAttribute('aria-expanded',!mn.hidden);return}
  const s=ev.target.closest('[data-hs]');if(s){ev.stopPropagation();if(s.dataset.hs==='custom'&&!store.get('hord',[]).length)store.set('hord',hSorted().map(e=>e.t));store.set('hsort',s.dataset.hs);renderHList();return}
  if(mn&&!mn.hidden&&!ev.target.closest('.hsmenu'))mn.hidden=true},true);
/* 사용자 정의: ⠿ 잡고 끌어서 순서 바꾸기 */
{let drag=null;
 document.addEventListener('pointerdown',ev=>{const h=ev.target.closest('#hlist .hdrag');if(!h)return;ev.preventDefault();const li=h.closest('li');drag={li,ol:li.parentElement,id:ev.pointerId};li.classList.add('dragging');try{h.setPointerCapture(ev.pointerId)}catch(_){}} ,true);
 document.addEventListener('pointermove',ev=>{if(!drag)return;ev.preventDefault();const y=ev.clientY;const sib=[...drag.ol.children].filter(x=>x!==drag.li);let before=null;for(const s of sib){const r=s.getBoundingClientRect();if(y<r.top+r.height/2){before=s;break}}
   if(before!==drag.li.nextElementSibling||(!before&&drag.ol.lastElementChild!==drag.li))drag.ol.insertBefore(drag.li,before);
   const rd=$('tlread'),rr=rd.getBoundingClientRect();if(y<rr.top+60)rd.scrollTop-=12;else if(y>rr.bottom-60)rd.scrollTop+=12},{passive:false});
 const end=()=>{if(!drag)return;drag.li.classList.remove('dragging');const byId=new Map(EVENTS.map(e=>[String(e.id),e.t]));const ord=[...drag.ol.children].map(li=>byId.get(li.dataset.id)).filter(Boolean);store.set('hord',ord);drag=null};
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end)}
