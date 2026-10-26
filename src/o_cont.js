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
   if(!seen.size||$('v-map').hidden){lg.hidden=true;return}lg.hidden=false;{const dk=$('dock'),vm=$('v-map');if(dk&&vm){const a=vm.getBoundingClientRect(),b2=dk.getBoundingClientRect();lg.style.bottom=Math.max(10,a.bottom-b2.top+10)+'px'}}lg.innerHTML=[...seen.values()].slice(0,6).map(o=>`<div><svg viewBox="0 0 30 10"><path d="M2 5H24M19 1.5L25 5L19 8.5" style="stroke:${o.col}"${o.dash?' stroke-dasharray="4 3"':''}/></svg>${esc(o.nm)} ${o.dash?'이동':'진로'}</div>`).join('')};
 const ut=updateTime;updateTime=function(ch){ut(ch);clearTimeout(updArrLeg.t);updArrLeg.t=setTimeout(updArrLeg,60)}}

/* 연대표 방향: 화면이 가로면 가로, 세로로 세우면 세로 (자동) */
{const fit=()=>{const want=(innerHeight>innerWidth*1.05)?'v':'h';if(want===ovDir)return;ovDir=want;ovCont=null;if(!$('v-ov').hidden&&ovSel)ovShow(ovSel)};let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(fit,250)});addEventListener('orientationchange',()=>setTimeout(fit,300))}

/* 선사 특징: 위 칸의 시대 이름(구석기·신석기) 바로 밑으로 올리기 */
function hzLift(){document.querySelectorAll('#ovchart .hzwrap').forEach(w=>{const top=w.querySelector('.hztop');const inn=top&&top.querySelector(':scope>div[style*="left:0;right:0"]');if(!inn)return;const r0=inn.getBoundingClientRect();
  const ns=[...w.querySelectorAll('.hzbot .hznt')];const lbs=ns.map(n=>{const b=n.querySelector('button[data-ev]');return b&&top.querySelector(`.hzn[data-ev="${b.dataset.ev}"]`)}).filter(Boolean);if(lbs.length>1){const t=Math.min(...lbs.map(l=>parseFloat(l.style.top)||0));lbs.forEach(l=>l.style.top=t+'px')}const sts=[...w.querySelectorAll(':scope>.hzst')].map(e=>parseFloat(e.style.left)||0).sort((a,b)=>a-b);const stOf=l=>sts.filter(v=>v<=(parseFloat(l.style.left)||0)+l.offsetWidth/2+1).pop();const so=lbs.map(stOf);if(so.every(v=>v!=null)&&new Set(so).size===so.length)lbs.forEach((l,i)=>{l.style.left=(so[i]+10)+'px';l.style.width='auto'});
  ns.forEach(n=>{const b=n.querySelector('button[data-ev]');const lb=b&&top.querySelector(`.hzn[data-ev="${b.dataset.ev}"]`);if(!lb)return;const r=lb.getBoundingClientRect();
    b.remove();n.classList.add('lift');n.style.left=(r.left-r0.left)+'px';n.style.top=(r.bottom-r0.top+4)+'px';inn.appendChild(n);const need=inn.offsetTop+n.offsetTop+n.offsetHeight+12;if(need>top.offsetHeight)top.style.height=need+'px'})})}


/* 키보드 방향키 = 드래그 (지도: 이동, 연대표: 옆/위아래로 넘기기) */
document.addEventListener('keydown',e=>{const KM={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],Left:[-1,0],Right:[1,0],Up:[0,-1],Down:[0,1],UIKeyInputLeftArrow:[-1,0],UIKeyInputRightArrow:[1,0],UIKeyInputUpArrow:[0,-1],UIKeyInputDownArrow:[0,1]},KC={37:[-1,0],38:[0,-1],39:[1,0],40:[0,1]};const D=KM[e.key]||KC[e.keyCode];if(!D||e.altKey||e.ctrlKey||e.metaKey)return;
  const t=e.target;if(t&&(t.isContentEditable||/^(TEXTAREA|SELECT)$/.test(t.tagName)||(t.tagName==='INPUT'&&!/^(range|checkbox|radio|button)$/.test(t.type))))return;if(t&&t.tagName==='INPUT'&&t.type==='range')return;
  const big=e.shiftKey?3:1,beh=e.repeat?'auto':'smooth';
  const pick=(root,ax)=>{let best=null,ba=0;[root,...root.querySelectorAll('*')].forEach(el=>{if(!el.offsetParent&&el!==root)return;const cs=getComputedStyle(el),ov=ax?cs.overflowY:cs.overflowX;if(!/auto|scroll/.test(ov))return;const can=ax?el.scrollHeight-el.clientHeight>2:el.scrollWidth-el.clientWidth>2;if(!can)return;const r=el.getBoundingClientRect(),a=r.width*r.height;if(a>ba){ba=a;best=el}});return best};
  const gen=root=>{let el=pick(root,D[1]?1:0);if(!el&&D[0])el=pick(root,1);if(!el)el=document.scrollingElement;if(!el)return;e.preventDefault();const vert=!!D[1]||!(el.scrollWidth-el.clientWidth>2);const d=(D[0]||D[1])*(vert?Math.max(120,el.clientHeight*.35):Math.max(160,el.clientWidth*.35))*big;el.scrollBy(vert?{top:d,behavior:beh}:{left:d,behavior:beh})};
  const ovl=[...document.querySelectorAll('#kpage,#ovpop,.modal,[role=dialog]')].find(x=>!x.hidden&&x.offsetParent!==null);if(ovl){gen(ovl);return}
  if(!$('v-map').hidden){e.preventDefault();const k=kNow(),px=120*big;cancelAnimationFrame(vbRAF);const n={...vb,x:vb.x+D[0]*px*k,y:vb.y+D[1]*px*k};if(e.repeat)setVB(n);else animVB(n,180);userMoved=true;if(typeof schedRecenter==='function')schedRecenter();return}
  if(!$('v-ov').hidden){e.preventDefault();const sc=$('ovscroll'),rd=$('ovread');
    if(ovDir==='h'){if(D[0])sc.scrollBy({left:D[0]*260*big,behavior:beh});else{const b=[...sc.querySelectorAll('.hzbot')].find(b=>{const r=b.getBoundingClientRect();return r.right>0&&r.left<innerWidth});if(b)b.scrollBy({top:D[1]*120*big,behavior:beh})}}
    else rd.scrollBy({top:(D[0]||D[1])*200*big,behavior:beh});return}
  const v=[...document.querySelectorAll('section.view')].find(x=>!x.hidden);if(v)gen(v);
},true);

addEventListener('pointerdown',e=>{const t=e.target;if(!(t.closest&&t.closest('input,textarea,select,[contenteditable]'))){try{window.focus()}catch(_){}}},true);try{window.focus()}catch(_){}
