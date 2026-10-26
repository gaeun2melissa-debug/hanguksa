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
{const os=ovShow;ovShow=function(k,keep){if(k==='all'||(!ERA[k]&&k!=='heart'))k='prehist';if(ovCont&&typeof ovDirty!=='undefined'&&ovDirty)ovCont.dirty=true;const had=!!(ovCont&&$('ovchart').querySelector('.ovsec'));const sc=$('ovscroll'),rd=$('ovread'),sl=sc.scrollLeft,st=rd.scrollTop;os(k,keep);if(ovCont&&ERA[k]&&!keep){if(had){sc.scrollLeft=sl;rd.scrollTop=st;requestAnimationFrame(()=>ovGoSec(k,true))}else{ovGoSec(k);requestAnimationFrame(()=>ovGoSec(k))}}}}
/* 스크롤하면 지금 보이는 시대 버튼에 불 켜기 */
let ovSpyT=0;let ovSpy=function(){if(!ovCont)return;clearTimeout(ovSpyT);ovSpyT=setTimeout(()=>{const H=ovDir==='h',ref=H?$('ovscroll').getBoundingClientRect().left+60:$('ovread').getBoundingClientRect().top+80;let cur=null;
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
 byF.forEach(list=>{list.sort((a,b)=>a.pin.T-b.pin.T);
   /* 번호는 이어지는 사건(전쟁·운동처럼 기간이 있는 일)끼리만 */
   const num=new Map();ONGOING.forEach(q=>{const ser=list.filter(o=>{const e=o.pin;return e.T>=q[0]-.05&&e.T<=q[1]+.3&&(e.tp.includes('war')||e.vs||e.ar||e.t.includes(q[2].slice(0,2)))&&!num.has(o)});if(ser.length>=2)ser.forEach((o,k)=>num.set(o,k+1))});
   list.forEach((o,i)=>{const e=o.pin,t=o.t;const name=t.textContent;const d=evDate(e);t.textContent='';
   if(num.has(o)){const s1=document.createElementNS('http://www.w3.org/2000/svg','tspan');s1.setAttribute('class','lnum');s1.textContent=circNum(num.get(o))+' ';t.appendChild(s1)}
   t.appendChild(document.createTextNode(name));if(d){const s2=document.createElementNS('http://www.w3.org/2000/svg','tspan');s2.setAttribute('class','ldate');s2.textContent=' '+d;t.appendChild(s2)}})});
 schedLabels()}
/* 화살표 범례: 지금 보이는 화살표가 누구의 진로인지 */
const FOREIGN=['홍건적','중국군','중공군','거란','몽골','후금','여진','당','수','원','명','청','금','연','한','왜','러시아','프랑스','영국','미국'];
function arrName(c,e){const y=e.y;const k=n=>n;
  if(c==='japan')return y<1868?'왜군':'일본군';if(c==='north')return '북한군';if(c==='south')return '국군';if(c==='us')return y>=1950?'유엔군·미군':'미군';if(c==='ussr')return '소련군';
  if(c==='han'){const src=(e.vs||'')+' '+e.t;let best=null,bi=1e9;FOREIGN.forEach(f=>{const re=new RegExp('(^|[^가-힣])'+f+'(군|$|[^가-힣])');const m=src.match(re);if(m&&m.index<bi){bi=m.index;best=f}});return best?(/군$/.test(best)?best:best+'군'):'중국·북방 세력'}
  const D=REIGNS.find(D=>D.c===c);return D?(D.n==='남한'?'국군':D.n+'군'):c}
{const lg=document.createElement('div');lg.id='arrleg';lg.hidden=true;$('v-map').appendChild(lg);
 window.updArrLeg=function(){const seen=new Map();(byFrame[pos.i]||[]).forEach(e=>{const ps=arrOf.get(e.id);if(!ps)return;ps.forEach(p=>{const cl=p.g.classList;if(cl.contains('hide')||cl.contains('gone')||cl.contains('stale')||cl.contains('dim'))return;const nm=arrName(p.c,e);const key=nm+'|'+p.dash;if(!seen.has(key))seen.set(key,{nm,col:acol(p.c),dash:p.dash})})});
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
/* 연대표 기간 막대를 누르면 그 시기 설명과 사건 목록 */
function openRgPop(s,e,n){const p=$('ovpop');const fs=FRAMES.filter(f=>f.t2>s&&f.t<e);const evs=EVENTS.filter(x=>x.T>=s-0.2&&x.T<e&&!x.llBan).sort((a,b)=>a.T-b.T);
  const cap=fs.map(f=>f.cap).filter(Boolean).slice(0,3);
  p.innerHTML=`<div class="evd"><div class="dt">${esc(yrTxt(Math.floor(s)))} ~ ${esc(yrTxt(Math.floor(e)))}</div><div class="hrow"><h2>${esc(n)}</h2></div>${cap.map(c=>`<p>${glx(c)}</p>`).join('')}${evs.length?`<h4 class="rgh">이 시기 사건 ${evs.length}</h4><div class="rgl">${evs.slice(0,40).map(x=>`<button type="button" data-rgev="${x.id}"><span>${esc(x.yl||yrTxt(Math.floor(x.T)))}</span>${esc(x.t)}</button>`).join('')}</div>`:''}<div class="nav"><button class="btn" data-x>닫기</button></div></div>`;
  p.hidden=false;$('ovdim').hidden=false;p.querySelector('[data-x]').onclick=closeOvPop;p.querySelectorAll('[data-rgev]').forEach(b=>b.onclick=()=>{const x=EVENTS.find(q=>q.id===+b.dataset.rgev);if(x)openOvPop(x)})}
document.addEventListener('click',ev=>{const r=ev.target.closest('#ovchart [data-rg]');if(!r||ev.defaultPrevented)return;const [s,e,...n]=r.dataset.rg.split('|');openRgPop(+s,+e,n.join('|'))});
/* '당시 ○○왕' 대신 '시기 철종 13년' (즉위한 해는 즉위년) */
{whoHTML=function(e,cls='who'){const R=kingRef(e);let s='';
  if(R){const {D,r}=R;let txt;if(r.name==='미군정'||D.n==='남한'||D.n==='북한')txt=r.name==='미군정'?'미군정':r.name;else{const n=Math.floor(e.T)-Math.floor(r.s);txt=`${D.n==='대한제국'?'대한 제국':D.n} ${r.name} ${n<=0?'즉위년':n+'년'}`}
    s+=`<span class="wk" style="--rc:var(--c-${D.c})"><i></i><em>시기</em>${esc(txt)}</span>`}
  if(e.pp)s+=`<span class="wp"><em>인물</em>${e.pp.split(/,\s*/).map(n=>`<button type="button" class="pn" data-person="${esc(n)}" data-pt="${e.T}">${esc(n)}</button>`).join(', ')}</span>`;return (s?`<div class="${cls}">${s}</div>`:'')+lnkHTML(e)}}
try{buildTL();renderTLFilter();addTclb()}catch(_){}
/* 같은 사람 다른 이름 → 왕 페이지로 (수양 대군 → 세조 등) */
const P_ALIAS={'수양대군':['조선','세조'],'수양 대군':['조선','세조'],'이방원':['조선','태종'],'정안군':['조선','태종'],'충녕대군':['조선','세종'],'충녕 대군':['조선','세종'],'이성계':['조선','태조'],'이방과':['조선','정종'],'연잉군':['조선','영조'],'이산':['조선','정조'],'왕건':['고려','태조'],'김춘추':['신라','태종 무열왕'],'김법민':['신라','문무왕'],'대조영':['발해','고왕'],'주몽':['고구려','동명성왕'],'온조':['백제','온조왕'],'박혁거세':['신라','박혁거세'],'이명복':['조선','고종']};
function aliasKing(n){if(!n)return null;let s=String(n).trim();const par=(s.match(/\(([^)]+)\)/)||[])[1];const base=s.replace(/\s*\(.*\)\s*/,'').trim();
  const a=P_ALIAS[base]||P_ALIAS[base.replace(/\s+/g,'')];const tryK=(dn,nm)=>{const D=DYN[dn];if(!D)return null;const i=D.r.findIndex(r=>r.name===nm||r.name.startsWith(nm)||r.name.replace(/\s*\(.*\)/,'')===nm);return i>=0?{dn,i}:null};
  if(a)return tryK(a[0],a[1]);if(par){const K=kingOfName(par);if(K)return {dn:K.D.n,i:K.i}}return null}
{const op=openPerson;openPerson=function(n,T){const k=aliasKing(n);if(k){openKing(k.dn,k.i);return}return op.apply(this,arguments)}}
/* 인물 정보 보강 */
Object.assign(PINFO,{
 '성삼문':'집현전 학사. 훈민정음 창제에 참여하였고, 단종 복위를 꾀하다 처형된 사육신의 한 사람(1456).',
 '박팽년':'집현전 학사 출신. 단종 복위 운동에 가담하였다가 처형된 사육신.',
 '하위지':'사육신의 한 사람. 세조의 왕위 찬탈에 반대하여 단종 복위를 꾀하다 처형되었다.',
 '이개':'사육신의 한 사람. 집현전 학사로 단종 복위 운동에 참여하였다.',
 '유성원':'사육신의 한 사람. 단종 복위 계획이 발각되자 스스로 목숨을 끊었다.',
 '유응부':'무신 출신 사육신. 단종 복위 운동 때 거사의 무력을 맡았다.',
 '김시습':'생육신의 한 사람. 세조 즉위 뒤 벼슬을 버리고 떠돌며 최초의 한문 소설 『금오신화』를 지었다.',
 '남효온':'생육신의 한 사람. 『육신전』을 지어 사육신의 충절을 기록하였다.',
 '김종서':'세종 때 6진을 개척한 장군. 단종을 보필하다 계유정난(1453) 때 수양 대군에게 죽임을 당하였다.',
 '한명회':'계유정난을 기획해 세조 즉위를 도운 공신. 이후 훈구 세력의 중심이 되었다.',
 '조광조':'중종 때 사림. 현량과 실시, 소격서 폐지, 위훈 삭제를 추진하다 기묘사화(1519)로 죽었다.',
 '이황':'조선 성리학자(퇴계). 『성학십도』를 지어 선조에게 바쳤고, 영남학파·동인(남인)의 뿌리가 되었다.',
 '이이':'조선 성리학자(율곡). 『성학집요』·『동호문답』, 수미법·10만 양병 주장, 기호학파·서인의 뿌리.',
 '허준':'선조·광해군 때 의관. 『동의보감』을 완성하였다(1610).',
 '장영실':'세종 때 과학자. 자격루·앙부일구·측우기 제작에 참여하였다.',
 '세종':'조선 제4대 왕. 집현전, 훈민정음 창제, 4군 6진 개척, 『농사직설』·측우기 등 과학 발전.',
 '김정희':'조선 후기 학자·서예가(추사). 추사체를 만들고 북한산비가 진흥왕 순수비임을 밝혔다.',
 '최제우':'동학 창시자(1860). 인내천 사상을 내세웠으나 혹세무민 죄로 처형되었다(1864).',
 '최익현':'위정척사 운동가. 흥선 대원군 탄핵, 개항 반대(왜양일체론), 을사의병을 일으켰다.',
 '민영환':'을사늑약에 항거하여 자결한 관리(1905).',
 '장지연':'『황성신문』에 「시일야방성대곡」을 실어 을사늑약을 비판하였다.',
 '방정환':'천도교 소년회를 이끌며 어린이날을 만들고 잡지 『어린이』를 펴냈다.',
 '이상재':'독립 협회·신간회 초대 회장. 조선 민립 대학 기성회를 이끌었다.',
 '조만식':'평양에서 조선 물산 장려 운동을 이끈 민족 운동가.',
 '김원봉':'의열단 단장. 조선 의용대를 만들고 한국 광복군 부사령관이 되었다.',
 '지청천':'한국 독립군 총사령관, 한국 광복군 총사령관.',
 '양세봉':'조선 혁명군 총사령관. 영릉가·흥경성 전투에서 일본군을 물리쳤다.',
 '이회영':'신민회 회원. 형제들과 재산을 정리해 서간도에 신흥 강습소를 세웠다.',
 '박은식':'『한국통사』·『한국독립운동지혈사』를 쓴 역사학자, 임시 정부 제2대 대통령.'});
/* 지도: 그 장면의 사건 핀이 화면 끝에 걸려 잘리지 않게 보기 범위를 넓힘 (한반도 둘레만) */
FRAMES.forEach((f,i)=>{if(!f.view||f.view===VS)return;const pts=EVENTS.filter(e=>e.f===i&&e.ll&&e.tp[0]!=='wld'&&e.ll[0]>117&&e.ll[0]<133&&e.ll[1]>32&&e.ll[1]<44.5).map(e=>e.ll);if(!pts.length)return;
  const v=f.view,padX=.45,padT=.55,padB=.3;let [a,b,c,d]=v;pts.forEach(([lo,la])=>{a=Math.min(a,lo-padX);c=Math.max(c,lo+padX);b=Math.min(b,la-padB);d=Math.max(d,la+padT)});f.view=[a,b,c,d]});
/* 지도 맞춤: 위쪽 머리말 밑으로 (지명이 머리말에 가려 잘리지 않게) */
{const sa=safeArea;safeArea=function(){const a=sa.apply(this,arguments);const s=svg.getBoundingClientRect(),tp=document.querySelector('.top');if(tp){const ov=tp.getBoundingClientRect().bottom-s.top+14;if(ov>a.t){a.h=Math.max(80,a.h-(ov-a.t));a.t=ov}}return a}}
/* 재생 중 경로가 있는 사건(동학·임진왜란·갑신정변 등)은 경로만큼 확대해 자세히 보여 주고 다시 돌아감 */
let rzT=0;
/* 재생 확대: 같은 장면에서 가까운 곳에 사건이 연달아 3개 이상 몰릴 때(임진왜란 남해안, 동학 농민 운동 등)와
   갑신정변처럼 꼭 짚을 사건만 확대. 확대 뒤엔 잠깐 멈춰 볼 시간을 주고, 그 묶음이 끝나면 다시 전체로 */
const RZ_FORCE=/갑신정변/,RZ_HOLD=1600,RZ_R=1.4;let rzCur=null,rzSeen=new Set();
function rzPts(e){const deg=X(1)-X(0),r=[];if(e.ll&&e.tp[0]!=='wld'&&e.ll[0]>117&&e.ll[0]<133&&e.ll[1]>32&&e.ll[1]<44.5)r.push([X(e.ll[0]),Y(e.ll[1])]);
  const ps=arrOf.get(e.id);if(ps){let w=0;ps.forEach(p=>w=Math.max(w,p.bb[2]-p.bb[0],p.bb[3]-p.bb[1]));if(w<=deg*1.6)ps.forEach(p=>{r.push([p.bb[0],p.bb[1]],[p.bb[2],p.bb[3]])})}return r}
function rzCluster(e){const deg=X(1)-X(0),L=byFrame[pos.i]||[],k=L.indexOf(e),a=rzPts(e);if(k<0||!a.length)return null;
  const hasR=x=>rzPts(x).length>(x.ll?1:0);const cx=a[0][0],cy=a[0][1];let pts=a.slice(),n=1,nr=hasR(e)?1:0,mem=[e.id],gap=[];
  for(let j=k+1;j<L.length;j++){const q=rzPts(L[j]);if(!q.length){gap.push(L[j].id);continue}if(q.some(([x,y])=>Math.hypot(x-cx,y-cy)>deg*RZ_R))break;mem.push(...gap,L[j].id);gap=[];pts=pts.concat(q);n++;if(hasR(L[j]))nr++}
  const force=RZ_FORCE.test(e.t);if((n<3||nr<2)&&!force)return null;
  let x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1])),y1=Math.max(...pts.map(p=>p[1]));
  const minW=deg*(force?2.2:2.6);let w=x1-x0,h=y1-y0;if(w<minW){x0-=(minW-w)/2;w=minW}if(h<minW*.8){y0-=(minW*.8-h)/2;h=minW*.8}
  const pw=w*.18,ph=h*.22,fb=fitBox({x:x0-pw,y:y0-ph,w:w+2*pw,h:h+2*ph}),FV=fitVB(FRAMES[pos.i].view);if(fb.w*fb.h>FV.w*FV.h*.5)return null;fb.mem=new Set(mem);fb.last=mem[mem.length-1];return fb}
const rzIn=(e,b)=>rzPts(e).every(([x,y])=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);
function rzOut(){const now=performance.now(),fi=pos.i;holdUntil=Math.max(holdUntil,now+2200+900+600);clearTimeout(rzOut.t);
  rzOut.t=setTimeout(()=>{if(pos.i!==fi||userMoved)return;rzCur=null;animVB(fitVB(FRAMES[pos.i].view),900)},2200)}
const RZ_SEQ=[[/^공산 전투/,/^고창 전투/,/^일리천 전투/]];
function rzSeq(e){for(const sq of RZ_SEQ){if(!sq[0].test(e.t))continue;const evs=sq.map(r=>EVENTS.find(x=>r.test(x.t))).filter(Boolean);const pts=[].concat(...evs.map(rzPts));if(!pts.length)return null;
  const deg=X(1)-X(0);let x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1])),y1=Math.max(...pts.map(p=>p[1]));const minW=deg*2.8;let w=x1-x0,h=y1-y0;if(w<minW){x0-=(minW-w)/2;w=minW}if(h<minW*.8){y0-=(minW*.8-h)/2;h=minW*.8}
  const fb=fitBox({x:x0-w*.2,y:y0-h*.25,w:w*1.4,h:h*1.5});fb.mem=new Set(evs.map(x=>x.id));fb.last=evs[evs.length-1].id;fb.seq=true;return fb}return null}
function routeZoom(e){if(typeof playing==='undefined'||!playing||userMoved)return;
  if(rzCur&&rzCur.seq){if(e.id===rzCur.last)rzOut();else if(!rzCur.shown&&rzCur.mem.has(e.id)){rzCur.shown=1;holdUntil=Math.max(holdUntil,performance.now()+RZ_HOLD)}return}
  {const q=rzSeq(e);if(q){rzCur=q;animVB(q,900);holdUntil=Math.max(holdUntil,performance.now()+900+RZ_HOLD);return}}
  if(rzCur&&rzCur.mem.has(e.id)){if(e.id===rzCur.last)rzOut();else if(!rzCur.shown){rzCur.shown=1;holdUntil=Math.max(holdUntil,performance.now()+RZ_HOLD)}return}
  const c=rzSeen.has(e.id)?null:rzCluster(e);const now=performance.now();
  if(c){c.mem.forEach(id=>rzSeen.add(id));rzCur=c;animVB(c,900);holdUntil=Math.max(holdUntil,now+900+RZ_HOLD+(RZ_FORCE.test(e.t)?1400:0));if(e.id===c.last)setTimeout(()=>{if(rzCur===c&&playing)rzOut()},900+RZ_HOLD+(RZ_FORCE.test(e.t)?1400:0));return}
  if(rzCur){rzCur=null;animVB(fitVB(FRAMES[pos.i].view),900);holdUntil=Math.max(holdUntil,now+900+500)}}
{const sp=setPos;setPos=function(i,f,opt){if(i!==pos.i){if(rzCur&&rzCur.seq&&playing&&!userMoved&&(byFrame[i]||[]).some(x=>rzCur.mem.has(x.id))){rzSeen.clear();const r=sp.call(this,i,f,{...(opt||{}),fit:false});const c=rzCur;setTimeout(()=>{if(rzCur===c){const L=EVENTS.find(x=>x.id===c.last);if(L&&L.f===pos.i&&L.T<=curT()+1e-6)rzOut()}},60);return r}rzCur=null;rzSeen.clear();clearTimeout(rzOut.t)}return sp.apply(this,arguments)}}
{const tk=ticker;ticker=function(e){const r=tk.apply(this,arguments);try{routeZoom(e)}catch(_){}return r}}
/* ───────── 해외 작은 지도: 멀리 떨어진 곳이 여럿이면 최대 3개, 화면에 보여도 우리나라 밖이면 표시 ───────── */
{const KOR=e=>e.ll[0]>=124&&e.ll[0]<=131.3&&e.ll[1]>=33&&e.ll[1]<=43.4;
 const INS=[inset];let groups=[];
 function mk(i){if(INS[i])return INS[i];const b=document.createElement('button');b.className='inset';b.type='button';b.hidden=true;b.dataset.gi=i;
   b.innerHTML='<svg><use href="#coastc"/><use href="#coastk"/><use href="#landc"/><use href="#landk"/><use href="#terr"/><g class="ov inp"></g></svg><span class="inl"></span>';inset.parentNode.appendChild(b);INS[i]=b;
   b.addEventListener('click',()=>{const g=groups[i];if(!g)return;abroad=true;userMoved=true;outPins=g;flyVB(fitVB(gBox(g)));updAll()});return b}
 const gBox=ps=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;ps.forEach(e=>{a=Math.min(a,e.ll[0]);c=Math.max(c,e.ll[0]);b=Math.min(b,e.ll[1]);d=Math.max(d,e.ll[1])});const pw=Math.max(2.2,(c-a)*.25),ph=Math.max(1.6,(d-b)*.25);return [a-pw,b-ph,c+pw,d+ph]};
 function cluster(ps){const G=[];ps.forEach(e=>{let g=G.find(g=>Math.abs(g.cx-e.ll[0])<16&&Math.abs(g.cy-e.ll[1])<11);if(!g){g={cx:e.ll[0],cy:e.ll[1],l:[]};G.push(g)}g.l.push(e);g.cx=g.l.reduce((s,x)=>s+x.ll[0],0)/g.l.length;g.cy=g.l.reduce((s,x)=>s+x.ll[1],0)/g.l.length});
   G.sort((a,b)=>b.l.length-a.l.length);while(G.length>3){const x=G.pop();let best=G[0],bd=1e9;G.forEach(g=>{const d=Math.hypot(g.cx-x.cx,g.cy-x.cy);if(d<bd){bd=d;best=g}});best.l.push(...x.l)}return G.map(g=>g.l)}
 function draw(btn,ps){const sv=btn.querySelector('svg'),g=btn===inset?$('inpins'):btn.querySelector('.inp');const mx=Math.max(0,...ps.map(e=>(e.s||e.t).length));const narrow=innerWidth<560;btn.style.width=Math.round(Math.min(narrow?200:240,Math.max(narrow?120:150,mx*11+44)))+'px';
   const b=box(gBox(ps));const W=Math.max(60,btn.clientWidth||150),H=Math.max(40,(btn.clientHeight||120)-20);const s=Math.max(b.w/W,b.h/H);const vbx=b.x+b.w/2-W*s/2,cx0=b.x+b.w/2;sv.setAttribute('viewBox',`${vbx} ${b.y+b.h/2-H*s/2} ${W*s} ${H*s}`);g.innerHTML='';
   ps.forEach(e=>{const px=X(e.ll[0]),py=Y(e.ll[1]);el('circle',{cx:px,cy:py,r:4.5*s,style:`fill:var(--t-${e.tp[0]});stroke:var(--panel);stroke-width:${1.5*s}`},g);const right=px>cx0;const tx=el('text',{x:px+(right?-6:6)*s,y:py+4*s,'text-anchor':right?'end':'start',style:`font-size:${10.5*s}px`},g);tx.textContent=e.s||e.t;
     try{const bb=tx.getBBox();const L=vbx+2*s,R=vbx+W*s-2*s;if(bb.x<L)tx.setAttribute('x',+tx.getAttribute('x')+(L-bb.x));else if(bb.x+bb.width>R)tx.setAttribute('x',+tx.getAttribute('x')-(bb.x+bb.width-R))}catch(_){}});
   {const kept=[];[...g.querySelectorAll('text')].forEach(t=>{try{const bb=t.getBBox();const hitK=kept.some(c=>bb.x<c.x+c.width+1.5*s&&bb.x+bb.width>c.x&&bb.y<c.y+c.height&&bb.y+bb.height>c.y);if(hitK)t.style.display='none';else kept.push(bb)}catch(_){}})}
   const nm=[...new Set(ps.map(e=>(e.p||'').split(' ')[0]).filter(Boolean))];(btn===inset?$('inlab'):btn.querySelector('.inl')).textContent='해외 · '+(nm.length?nm[0]+(nm.length>1?` 외 ${nm.length-1}곳`:''):'')}
 const corners=()=>{const wrap=svg.getBoundingClientRect();const dock=$('dock')?$('dock').getBoundingClientRect():{top:wrap.bottom};const card=$('fcard')?$('fcard').getBoundingClientRect():{bottom:wrap.top+90};const hb=document.querySelector('header.top').getBoundingClientRect().bottom-wrap.top;
   return {wrap,dock,card,hb}};
 function placeAll(list){const {wrap,dock,card,hb}=corners();if(!wrap.width)return;const pts=[];document.querySelectorAll('#pins .pin:not(.hide):not(.wait):not(.stale):not(.buried):not(.gone), #ovl text:not(.hide), #arrleg:not([hidden])').forEach(g=>{const r=g.getBoundingClientRect();if(r.width){const lab=g.matches('.pin')?110:0;pts.push([r.left-wrap.left-(lab?40:0),r.top-wrap.top,r.right-wrap.left+lab,r.bottom-wrap.top])}});
   const used=[];list.forEach(btn=>{const iw=btn.offsetWidth||150,ih=btn.offsetHeight||124;const bottomY=Math.min(wrap.height,dock.top-wrap.top)-ih-52,topY=Math.max(12,card.bottom-wrap.top+10,hb+10);
     const lgE=$('arrleg'),lg=lgE&&!lgE.hidden?lgE.getBoundingClientRect():null;const C={br:[wrap.width-iw-12,bottomY],bl:[12,lg&&lg.width?Math.min(bottomY,lg.top-wrap.top-ih-10):bottomY],tr:[wrap.width-iw-60,Math.max(12,hb+10)],tl:[12,topY]};
     const sc=k=>{const [x,y]=C[k];if(y<0||x<0||used.includes(k))return 1e9;let s=0;pts.forEach(([a,b,c,d])=>{if(c>x-4&&a<x+iw+4&&d>y-4&&b<y+ih+4)s++});return s+(k==='br'?-.1:0)-(btn.dataset.corner===k?1.6:0)};
     let best=null,bs=1e10;['br','bl','tr','tl'].forEach(k=>{const s=sc(k);if(s<bs){bs=s;best=k}});used.push(best);btn.dataset.corner=best;const [x,y]=C[best];btn.style.left=x+'px';btn.style.top=y+'px';btn.style.right='auto';btn.style.bottom='auto';pts.push([x,y,x+iw,y+ih])})}
 const orig=updateInset;
 function updAll(){if(abroad){INS.slice(1).forEach(b=>b.hidden=true);return orig.apply(this,arguments)}
   const t=curT();const ps=byFrame[pos.i].filter(e=>e.ll&&!KOR(e)&&(!playing||e.T<=t+1e-9));groups=cluster(ps);outPins=groups[0]||[];
   INS.forEach((b,i)=>{if(i>=groups.length)b.hidden=true});if(!groups.length)return;
   groups.forEach((g,i)=>{const b=mk(i);b.hidden=false;draw(b,g)});placeAll(groups.map((g,i)=>INS[i]))}
 updateInset=updAll;placeInset=function(){if(abroad){return}placeAll(groups.map((g,i)=>INS[i]).filter(Boolean))};
 /* 기본 작은 지도 누르기: 첫 묶음으로 날아가기 / 돌아오기 */
 inset.addEventListener('click',ev=>{ev.stopImmediatePropagation();if(abroad){abroad=false;userMoved=true;flyVB(fitVB(FRAMES[pos.i].view));updAll();return}const g=groups[0];if(!g)return;abroad=true;userMoved=true;outPins=g;flyVB(fitVB(gBox(g)));orig()},true);
}
/* 다시 보기 버튼: 지도에서 보이는 칸의 한가운데 */
{const rb=$('replay');const fix=()=>{if(!rb||rb.hidden)return;const w=svg.getBoundingClientRect(),v=$('v-map').getBoundingClientRect(),hb=document.querySelector('header.top').getBoundingClientRect().bottom,dk=$('dock')?$('dock').getBoundingClientRect().top:w.bottom;rb.style.left=(w.left+w.width/2-v.left)+'px';rb.style.top=((Math.max(hb,w.top)+Math.min(dk,w.bottom))/2-v.top)+'px'};
 if(rb){new MutationObserver(fix).observe(rb,{attributes:true,attributeFilter:['hidden']});addEventListener('resize',fix)}}
/* 시대 막대 이름은 화면 왼쪽에 붙어 따라오게 */
{const hs=hzSync;hzSync=function(){hs.apply(this,arguments);const sc=$('ovscroll');if(!sc)return;const R=sc.getBoundingClientRect();sc.querySelectorAll('.hzrg,.hzband').forEach(b=>{const sp=b.firstElementChild;if(!sp)return;const r=b.getBoundingClientRect();if(r.right<R.left||r.left>R.right){sp.style.transform='';return}const sw=sp.offsetWidth;const dx=Math.max(0,Math.min(R.left+8-r.left,r.width-sw-16));sp.style.transform=dx>0?`translateX(${dx}px)`:''})};
 $('ovscroll').addEventListener('scroll',()=>requestAnimationFrame(()=>hzSync()),{passive:true})}
/* ───────── 시대 버튼 12개 ───────── */
const ERA12=[['선사 시대','prehist'],['고조선','pre'],['초기 여러 나라','early'],['삼국 시대','three'],['통일 신라','nsk'],['남북국 시대','nsk',698],['후삼국 시대','hsk'],['고려','goryeo'],['조선','joseon1'],['개항기와 대한 제국','modern1'],['일제 강점기','colonial'],['현대 (광복 이후)','contemp']];
function chipOf(sec,t){if(sec==='joseon2')return 8;if(sec==='nsk')return t!=null&&t>=698?5:4;const i=ERA12.findIndex(x=>x[1]===sec&&x[2]==null);return i}
function ovGoT(sec,t,smooth){const s=$('ovchart').querySelector(`.ovsec[data-sec="${sec}"]`);if(!s)return ovGoSec(sec,smooth);
  const evs=[...s.querySelectorAll('.hzn[data-ev],[data-ev]')].map(b=>({b,e:EVENTS.find(x=>x.id===+b.dataset.ev)})).filter(o=>o.e&&o.e.T>=t-.5).sort((a,b)=>a.e.T-b.e.T);if(!evs.length)return ovGoSec(sec,smooth);const b=evs[0].b;
  if(ovDir==='h'){const sc=$('ovscroll');sc.scrollTo({left:b.getBoundingClientRect().left-sc.getBoundingClientRect().left+sc.scrollLeft-60,behavior:smooth?'smooth':'auto'})}else{const rd=$('ovread');rd.scrollTo({top:b.getBoundingClientRect().top-rd.getBoundingClientRect().top+rd.scrollTop-120,behavior:smooth?'smooth':'auto'})}}
function hlChip(i){$('ovchips').querySelectorAll('.chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===i));const a=$('ovchips').querySelectorAll('.chip')[i];if(a)a.scrollIntoView({inline:'nearest',block:'nearest',behavior:'smooth'})}
{const c=$('ovchips');c.innerHTML=ERA12.map(([n,k],i)=>`<button class="chip" data-e="${k}" data-ci="${i}">${esc(n)}</button>`).join('');
 c.querySelectorAll('.chip').forEach((b,i)=>b.onclick=()=>{const [,k,t]=ERA12[i];ovShow(k);if(t!=null)setTimeout(()=>ovGoT(k,t,true),60);setTimeout(()=>hlChip(i),400)})}
/* 스크롤 위치 → 버튼 (같은 시대 칸 안에서도 통일 신라/남북국 구분) */
$('ovscroll').removeEventListener('scroll',ovSpy);$('ovread').removeEventListener('scroll',ovSpy);
ovSpy=function(){if(!ovCont)return;clearTimeout(ovSpyT);ovSpyT=setTimeout(()=>{const H=ovDir==='h',ref=H?$('ovscroll').getBoundingClientRect().left+60:$('ovread').getBoundingClientRect().top+80;let cur=null;
  for(const s of ovSecs()){const r=s.getBoundingClientRect();if((H?r.left:r.top)<=ref)cur=s.dataset.sec}if(!cur)return;
  let t=null;if(cur==='nsk'){const s=$('ovchart').querySelector('.ovsec[data-sec="nsk"]');const bh=[...s.querySelectorAll('[data-ev]')].find(b=>{const e=EVENTS.find(x=>x.id===+b.dataset.ev);return e&&e.T>=698});if(bh){const r=bh.getBoundingClientRect();t=(H?r.left:r.top)<=ref+200?698:676}}
  if(cur!==ovSel){ovSel=cur;store.set('overa',cur)}hlChip(chipOf(cur,t))},80)};
$('ovscroll').addEventListener('scroll',ovSpy,{passive:true});$('ovread').addEventListener('scroll',ovSpy,{passive:true});
/* 연표 화면의 시대 버튼도 같은 12개로 */
function setTlJump(){const j=$('tljump');if(j){j.innerHTML=ERA12.map(([n,k,t])=>`<button data-e="${k}"${t?` data-t="${t}"`:''} type="button">${esc(n)}</button>`).join('');
 j.querySelectorAll('button').forEach(b=>b.onclick=()=>{const rd=$('tlread');let target=$('era-'+b.dataset.e);if(b.dataset.t){const t=+b.dataset.t;const li=[...target.querySelectorAll('li[data-id]')].find(l=>{const e=EVENTS.find(x=>x.id===+l.dataset.id);return e&&e.T>=t-.5});if(li)target=li}
   if(target)rd.scrollTo({top:target.getBoundingClientRect().top-rd.getBoundingClientRect().top+rd.scrollTop-(rd.querySelector('.rhead')?rd.querySelector('.rhead').offsetHeight:0)-6,behavior:'smooth'})})}}
setTlJump();{const bt=buildTL;buildTL=function(){const r=bt.apply(this,arguments);setTlJump();return r}}
{const o2=ovShow;ovShow=function(){const r=o2.apply(this,arguments);setTimeout(()=>{try{ovSpy()}catch(_){}},300);return r}}
/* ───────── 인물 누르면 먼저 작은 팝업 → '자세히 보기'로 이동 ───────── */
const P_PAIR={'원종':'원종과 애노','애노':'원종과 애노','망이':'망이와 망소이','망소이':'망이와 망소이'};
Object.assign(PINFO,{'원종과 애노':'신라 말 진성 여왕 때(889) 사벌주(상주)에서 함께 봉기한 농민 지도자. 세금 독촉에 반발한 이 봉기를 시작으로 전국에서 반란이 잇따랐다.',
 '망이와 망소이':'고려 무신 집권기(1176) 공주 명학소에서 함께 봉기한 형제(소민). 소(所) 주민에 대한 차별에 맞섰고, 명학소는 한때 충순현으로 승격되었다.'});
function pName(n){return String(n).replace(/\s*\(.*\)\s*/,'').trim()}
function personPopHTML(n,T){const nm=pName(n),pair=P_PAIR[nm];const title=pair||nm;const k=aliasKing(n)||(()=>{const K=kingOfName(n,T);return K?{dn:K.D.n,i:K.i}:null})();
  let sub='',body='';if(k){const D=DYN[k.dn],r=D.r[k.i];sub=`${k.dn==='남한'?'대한민국':k.dn} · ${yrTxt(Math.floor(r.s))}~${yrTxt(Math.floor(r.e))}`;const a=(typeof kAch==='function'?kAch(D,r):[])||[];body=a.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join('');body=body?`<ul>${body}</ul>`:''}
  const info=PINFO[title]||PINFO[nm]||'';const evs=EVENTS.filter(e=>(e.pp||'').split(/,\s*/).some(x=>pName(x)===nm||(pair&&P_PAIR[pName(x)]===pair))).sort((a,b)=>a.T-b.T).slice(0,4);
  return `<b>${esc(title)}</b>${sub?`<em>${esc(sub)}</em>`:''}${info?`<p>${glx(info)}</p>`:''}${body}${evs.length?`<div class="ppev">${evs.map(e=>`<span>${esc(e.yl||yrTxt(Math.floor(e.T)))} ${esc(e.t)}</span>`).join('')}</div>`:''}<button type="button" class="ppgo" data-go-person="${esc(n)}" data-pt="${T??''}">자세히 보기 →</button>`}
{const pop=document.createElement('div');pop.id='pppop';pop.className='glpop pppop';pop.hidden=true;document.body.appendChild(pop);
 const place=(el)=>{const r=el.getBoundingClientRect();pop.hidden=false;const w=pop.offsetWidth,h=pop.offsetHeight;let x=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2)),y=r.bottom+8;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-8);pop.style.left=x+'px';pop.style.top=y+'px'};
 addEventListener('click',ev=>{const go=ev.target.closest('[data-go-person]');if(go){ev.preventDefault();ev.stopPropagation();pop.hidden=true;const T=go.dataset.pt?+go.dataset.pt:null;let n=go.dataset.goPerson;openPerson(n,T);return}
   const p=ev.target.closest('[data-person]');if(p&&!ev.target.closest('#pppop')&&!ev.target.closest('.kpage .pplist')){ev.preventDefault();ev.stopPropagation();pop.innerHTML=personPopHTML(p.dataset.person,p.dataset.pt?+p.dataset.pt:null);place(p);return}
   if(!pop.hidden&&!ev.target.closest('#pppop'))pop.hidden=true},true);}
/* 짝 인물은 한 버튼으로: '원종과 애노' */
{const wh=whoHTML;whoHTML=function(e,cls){let h=wh.apply(this,arguments);Object.entries({'원종과 애노':['원종','애노'],'망이와 망소이':['망이','망소이']}).forEach(([t,[a,b]])=>{const re=new RegExp(`<button type="button" class="pn" data-person="${a}"([^>]*)>${a}</button>, <button type="button" class="pn" data-person="${b}"[^>]*>${b}</button>`);h=h.replace(re,`<button type="button" class="pn" data-person="${a}"$1>${t}</button>`)});return h}}
try{buildTL();renderTLFilter();addTclb()}catch(_){}
/* 밑줄 낱말 팝업: '사전에서 보기' */
document.addEventListener('click',ev=>{const w=ev.target.closest('[data-gl]');if(!w||ev.target.closest('#glpop'))return;const gp=$('glpop');if(gp.hidden||gp.querySelector('.ppgo.dc'))return;const k=w.dataset.gl;gp.insertAdjacentHTML('beforeend',`<button type="button" class="ppgo dc" data-dc="${esc(k)}">사전에서 자세히 →</button>`)});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-dc]');if(!b)return;ev.stopPropagation();const k=b.dataset.dc;$('glpop').hidden=true;showView('dc');try{dcShow();dcOnlyBk=false;dcFilter()}catch(_){}setTimeout(()=>{const c=$('dcbody').querySelector(`.gl2>div[data-k="${CSS.escape(k)}"]`);if(c){c.scrollIntoView({block:'center'});c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash')}},120)},true);
/* ───────── 이야기로 듣는 사건 배경 ───────── */
const STORY={
 '무신 정변':'고려는 문신이 높은 자리를 차지하고 무신은 낮게 대접받던 나라였다. 인종 때 김부식의 아들 김돈중은 장난삼아 젊은 무신 정중부의 수염을 촛불로 태워 버렸다. 의종 때인 1170년, 왕이 보현원으로 놀러 가던 길에 무신들에게 맨손 무예 시합(수박희)을 시켰는데, 나이 든 장군 이소응이 힘에 부쳐 물러서자 젊은 문신 한뢰가 그의 뺨을 때렸다. 참다못한 정중부·이의방·이고가 "문관의 관을 쓴 자는 모두 죽여라" 하며 문신들을 죽이고 의종을 내쫓았다. 이렇게 100년 동안 무신이 나라를 쥐는 무신 정권이 시작되었다.',
 '이자겸의 난':'이자겸은 둘째 딸을 예종의 왕비로, 셋째·넷째 딸을 손자뻘인 인종의 왕비로 들여 권력을 독차지했다. "십팔자(十八子, 李)가 왕이 된다"는 소문까지 돌자 인종이 그를 없애려 했고, 이자겸은 척준경과 함께 궁궐에 불을 지르며 반란을 일으켰다. 인종은 척준경을 몰래 설득해 등을 돌리게 하여 겨우 이자겸을 몰아냈다.',
 '묘청':'이자겸의 난으로 개경 궁궐이 불타 버리자 서경(평양) 출신 승려 묘청은 "서경으로 도읍을 옮기면 금나라가 항복하고 36개 나라가 조공을 바친다"며 왕을 황제라 부르고 금을 치자고 주장했다. 개경 귀족 김부식 등이 반대해 일이 틀어지자 묘청은 서경에서 나라 이름을 대위, 연호를 천개로 정하고 반란을 일으켰다. 김부식이 이끈 관군에게 1년 만에 진압되었고, 훗날 신채호는 이 사건을 "조선 역사상 일천 년 이래 제일 대사건"이라 불렀다.',
 '위화도 회군':'명이 철령 북쪽 땅을 내놓으라고 하자 우왕과 최영은 요동을 치기로 했다. 이성계는 "작은 나라가 큰 나라를 거스르면 안 되고, 여름에 군사를 일으키면 안 되며, 왜구가 빈틈을 노리고, 장마철이라 활이 풀리고 병이 돈다"는 4불가론으로 반대했지만 결국 출병했다. 압록강의 섬 위화도에 이르자 그는 군대를 돌려 개경으로 쳐들어가 최영을 몰아내고 우왕을 폐위했다. 이 일로 이성계는 권력을 잡고 조선 건국의 발판을 마련했다.',
 '계유정난':'열두 살 단종이 왕위에 오르자 김종서·황보인 같은 대신들이 나랏일을 이끌었다. 숙부 수양 대군은 이를 못마땅히 여겨 한명회 등과 일을 꾸몄고, 1453년 밤 김종서의 집을 찾아가 철퇴로 쓰러뜨린 뒤 왕명이라며 대신들을 궁으로 불러들여 죽였다. 권력을 쥔 수양 대군은 2년 뒤 조카에게서 왕위를 넘겨받아 세조가 되었다.',
 '단종 복위 운동':'성삼문·박팽년 등은 명 사신을 맞는 잔치에서 칼을 차고 왕을 호위하는 별운검 자리를 맡아 세조를 없애고 단종을 다시 왕으로 세우려 했다. 그런데 그날 별운검을 세우지 말라는 명이 내려 거사가 미뤄졌고, 함께하던 김질이 겁을 먹고 고발했다. 성삼문 등은 모진 고문에도 세조를 "나으리"라 부르며 굽히지 않고 죽었다(사육신). 단종은 노산군으로 강등되어 영월로 쫓겨났고 이듬해 세상을 떠났다.',
 '임오군란':'신식 군대 별기군은 좋은 대우를 받았지만 구식 군인들은 13개월이나 월급을 받지 못했다. 겨우 받은 쌀 한 달 치에 겨와 모래가 섞여 있자 분노한 군인들이 담당자를 때리고, 선혜청 책임자 민겸호의 집을 부수고 일본 공사관까지 공격했다. 쫓겨난 흥선 대원군이 다시 권력을 잡았지만, 청군이 들어와 대원군을 톈진으로 끌고 가 버렸다. 이후 청의 간섭이 심해지고 일본과는 제물포 조약을 맺었다.',
 '갑신정변':'청의 간섭이 심해지자 김옥균·박영효·홍영식·서광범 등 급진 개화파는 일본의 도움을 약속받고 정변을 일으켰다. 1884년 우정총국 개국 축하 잔치에서 불이 났다고 소란을 피운 틈에 민씨 정권 고관들을 죽이고, 고종을 경우궁으로 옮긴 뒤 새 정부를 세워 14개조 정강을 내놓았다. 그러나 청군이 쳐들어오자 일본군은 슬그머니 물러났고, 정변은 3일 만에 끝났다(삼일천하). 김옥균 등은 일본으로 달아났다.',
 '을미사변':'청일 전쟁 뒤 러시아·프랑스·독일이 일본을 압박하자(삼국 간섭), 명성 황후는 러시아와 가까이하며 일본을 견제했다. 그러자 1895년 일본 공사 미우라는 낭인과 군인을 경복궁 깊숙한 건청궁으로 들여보내 왕비를 시해하고 시신을 불태웠다. 이 일과 뒤이은 단발령에 분노한 유생들이 을미의병을 일으켰다.',
 '아관 파천':'왕비가 시해된 뒤 늘 신변의 위협을 느끼던 고종은 1896년 이른 새벽 궁녀의 가마를 타고 몰래 궁을 빠져나가 러시아 공사관으로 옮겼다. 고종은 그곳에서 1년 동안 머물렀고, 친일 내각은 무너졌지만 러시아를 비롯한 열강이 광산·철도 같은 이권을 앞다투어 빼앗아 갔다.',
 '병인양요':'흥선 대원군이 천주교를 탄압하면서(병인박해) 프랑스 신부 9명이 처형되었다. 이를 구실로 1866년 프랑스 함대가 강화도에 쳐들어왔지만, 한성근이 문수산성에서, 양헌수가 정족산성에서 맞서 물리쳤다. 프랑스군은 물러나면서 외규장각에 있던 의궤 등 귀한 책을 빼앗아 갔고, 이 책들은 2011년에야 돌아왔다.',
 '신미양요':'1866년 미국 상선 제너럴셔먼호가 대동강을 거슬러 올라와 통상을 요구하며 행패를 부리다가 평양 관민에게 불태워졌다. 이를 핑계로 1871년 미국 함대가 강화도를 공격했고, 광성보에서 어재연 장군과 군사들이 끝까지 싸우다 전사했다. 미군이 물러가자 흥선 대원군은 전국에 척화비를 세워 통상 거부 의지를 알렸다.',
 '운요호 사건':'1875년 일본 군함 운요호가 강화도 초지진 앞바다에 허락 없이 다가와 조선군과 포격을 주고받고, 영종도에 상륙해 사람들을 죽이고 물건을 빼앗았다. 일본은 오히려 이 일을 따지며 군함을 이끌고 와 조약을 강요했고, 이듬해 강화도 조약이 맺어졌다.',
 '3·1 운동':'1919년 1월 고종이 갑자기 세상을 떠나자 일본이 독살했다는 소문이 돌았다. 민족 대표 33인은 고종의 장례식(인산일)을 앞둔 3월 1일 태화관에서 독립 선언서를 읽었고, 탑골 공원에서는 학생과 시민이 태극기를 흔들며 만세를 불렀다. 만세 운동은 전국과 해외로 퍼졌고, 이를 계기로 상하이에 대한민국 임시 정부가 세워졌다.'};
function storyOf(e){if(!e)return null;const k=Object.keys(STORY).find(k=>e.t.includes(k));return k?STORY[k]:null}
{const ed=evDetailHTML;evDetailHTML=function(e){const h=ed.apply(this,arguments);const s=storyOf(e);return s?h+`<div class="story"><h4>📖 이야기로 보기</h4><p>${glx(s)}</p></div>`:h}}
document.addEventListener('click',ev=>{const b=ev.target.closest('.stb');if(!b)return;ev.stopPropagation();ev.preventDefault();const e=EVENTS.find(x=>String(x.id)===b.dataset.st);const nx=b.nextElementSibling;if(nx&&nx.classList.contains('story')){nx.remove();b.classList.remove('on');return}b.insertAdjacentHTML('afterend',`<div class="story"><p>${glx(storyOf(e))}</p></div>`);b.classList.add('on')},true);
function addStb(root){(root||document).querySelectorAll('li[data-id]:not([data-sb])').forEach(li=>{li.dataset.sb=1;const e=EVENTS.find(x=>String(x.id)===li.dataset.id);if(!storyOf(e))return;const p=li.querySelector('p');if(p)p.insertAdjacentHTML('afterend',`<button type="button" class="stb" data-st="${e.id}">📖 이야기</button>`)})}
addStb();['tlbody','tpbody'].forEach(id=>{const el=$(id);if(el)new MutationObserver(()=>addStb(el)).observe(el,{childList:true,subtree:true})});
{const gp=$('glpop');let busy=false;new MutationObserver(()=>{if(busy||gp.hidden||gp.querySelector('[data-dc]'))return;const b=gp.querySelector('b');if(!b)return;const k=(b.childNodes[0]&&b.childNodes[0].nodeType===3?b.childNodes[0].nodeValue:b.textContent).trim();if(!GLOSS[k])return;busy=true;gp.insertAdjacentHTML('beforeend',`<button type="button" class="ppgo dc" data-dc="${esc(k)}">사전에서 자세히 →</button>`);busy=false}).observe(gp,{childList:true,attributes:true,attributeFilter:['hidden']})}
/* 지도 글씨: 테두리 대신 뒤로 은은하게 번지는 바탕(선이 글씨 근처에서만 흐려짐) */
{const NS='http://www.w3.org/2000/svg';const mk=(sv,id)=>{if(!sv||sv.querySelector('#'+id))return;let d=sv.querySelector('defs');if(!d){d=document.createElementNS(NS,'defs');sv.prepend(d)}
  d.insertAdjacentHTML('beforeend',`<filter id="${id}" x="-15%" y="-40%" width="130%" height="180%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="1.4" result="d"/><feGaussianBlur in="d" stdDeviation="2" result="b"/><feFlood style="flood-color:var(--paper);flood-opacity:.9"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`)};
 mk($('map'),'txglow');mk($('insvg'),'txglow2')}
/* 화살표: 그려지는 동작이 끝나면 점선 기법을 풀어 확대/축소 때 중간이 끊기지 않게 */
{const sa=setArrows;setArrows=function(e,state){const r=sa.apply(this,arguments);const ps=arrOf.get(e.id);if(ps&&state==='draw')ps.forEach(p=>{p.g.classList.remove('drawn');clearTimeout(p.dT);p.dT=setTimeout(()=>p.g.classList.add('drawn'),1050)});return r}
 for(const ps of arrOf.values())ps.forEach(p=>{if(!p.g.classList.contains('draw'))p.g.classList.add('drawn')})}
{const ul=window.updArrLeg;if(ul)window.updArrLeg=function(){const r=ul.apply(this,arguments);try{placeInset()}catch(_){}return r}}
{const sa=setArrowsAll;setArrowsAll=function(){const r=sa.apply(this,arguments);clearTimeout(updArrLeg.t2);updArrLeg.t2=setTimeout(()=>{try{updArrLeg()}catch(_){}},80);return r}}
/* 확대는 사건이 나타나기 "전"에: 다음 사건이 확대 묶음의 첫 사건이면 미리 확대하고 멈췄다가 그 사건을 보여 줌 */
(function rzPre(){requestAnimationFrame(rzPre);try{if(!playing||userMoved||performance.now()<holdUntil)return;
  const t=curT(),ta=tOfF(pos.i,Math.min(1,pos.f+450/frameDur(pos.i)));const L=byFrame[pos.i]||[];if(rzCur&&rzCur.seq)return;let ev=null,c=null;const x=L.find(x=>x.T>t+1e-9);if(x&&!(rzCur&&rzCur.mem.has(x.id))&&!rzSeen.has(x.id)&&(x.ll||arrOf.has(x.id))){c=rzSeq(x)||rzCluster(x);ev=x}
  if(!c)return;if(!c.seq)c.mem.forEach(id=>rzSeen.add(id));
  rzCur=c;animVB(c,900);holdUntil=Math.max(holdUntil,performance.now()+900+700)}catch(_){}})();
