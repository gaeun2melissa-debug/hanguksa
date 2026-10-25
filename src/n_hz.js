/* ───────── 연대표 가로: 필기 노트처럼 (위: 조약·개혁안 / 가운데: 시기·축·사건 이름 / 아래: 왕·주요 사건 풀이) ───────── */
function drawHZ(k){$('v-ov').classList.add('hzsplit');const sr=$('ovscroll').getBoundingClientRect();const avail=Math.max(300,(sr.top>0?innerHeight-sr.top:$('ovscroll').clientHeight)-14);HZAV=avail;let sc=1,res=layHZ(k,1);for(let it=0;it<9&&res&&res.H>avail;it++){sc*=1.3;const nx=layHZ(k,sc);if(nx.H>=res.H-2)break;res=nx}if(res){$('ovchart').innerHTML=res.html;$('v-ov').classList.add('hzsplit');$('ovsum').innerHTML=''}}
let HZAV=9999;
/* 연대표 아래 칸: 사건 설명 속 꼭 알아 둘 낱말(척화비 같은 것)을 그 사건 자리에 */
function hzTerms(evs,xT,fitSep){if(typeof GLOSS==='undefined')return [];const used=new Set(),out=[];const titles=evs.map(e=>e.t);
  evs.forEach(e=>{if(!e.x||isSiteO(e))return;const tmp=document.createElement('div');tmp.innerHTML=glx(e.x);[...tmp.querySelectorAll('[data-gl]')].slice(0,2).forEach(s=>{const k=s.dataset.gl;if(used.has(k)||titles.some(t=>t.includes(k)))return;used.add(k);const x=xT(e.T);out.push(fitSep({g:k,from:e.t,a:x-120,b:x+120},x))})});return out}
const HZ_ONLY={prehist:['구석기','신석기']};
const HZ_NOTES={'구석기':['뗀석기','주먹도끼','이동 생활','사냥·채집','동굴·막집','평등 사회'],
 '신석기':['간석기','빗살무늬 토기','농경 시작','정착 생활','움집','씨족 사회']};
const hzShort=t=>{t=String(t||'').split(/[.。]/)[0].replace(/\s*\([^)]*\)/g,'');return t.length>30?t.slice(0,29)+'…':t};
function layHZ(k,SC){
  const ALL=k==='all';const E=ALL?{n:'전체 흐름',rg:'',s:{}}:ERA[k];const fs=ALL?FRAMES:FRAMES.filter(f=>f.era===k);
  const evs=EVENTS.filter(e=>(ALL||e.era===k)&&!isSiteO(e)&&(!HZ_ONLY[k]||HZ_ONLY[k].includes(e.t)));
  if(!evs.length){return {html:'<p class="ovempty">사건이 없어요.</p>',H:0}}
  const t0=fs[0].t,t1=fs[fs.length-1].t2;
  const tw=s=>s.length*13.2+8,twe=e=>tw(e.t)+(e.treaty?20:0);
  // 1) 사건마다 x: 같은 해는 붙여서, 해가 바뀌면 조금 띄움
  const xs=[];let x=40,prevY=null;evs.forEach((e,i)=>{const y=Math.floor(e.T+1e-6);if(i){const fast=(['pre','early'].includes(k)?.7:1)*((isMajor(e)||e.top)?1:.85);x+=HZ_ONLY[k]?270:(y===prevY?26:Math.max(yrTxt(y).length*8.2+10,Math.min(90,Math.max(40,yrTxt(y).length*8.5+14))*SC*fast))}xs.push(x);prevY=y});
  const W=Math.max(x+(HZ_ONLY[k]?320:260),(typeof ovBuilding!=='undefined'&&ovBuilding)?0:($('ovscroll').clientWidth||0));
  const xT=t=>{if(t<=evs[0].T)return xs[0]-30;for(let i=1;i<evs.length;i++)if(t<=evs[i].T)return xs[i-1]+(xs[i]-xs[i-1])*(t-evs[i-1].T)/Math.max(1e-6,evs[i].T-evs[i-1].T);return xs[xs.length-1]+(HZ_ONLY[k]?270:40)};
  const lanes=(items,gap=10)=>{const ends=[];items.forEach(it=>{let li=ends.findIndex(v=>v<=it.a-gap);if(li<0){li=ends.length;ends.push(-1e9)}ends[li]=it.b;it.li=li});return ends.length};
  let h='';
  // 위: 조약 · 개혁안
  const tops=[...evs.filter(e=>e.treaty).map(e=>({kind:'t',e,t:e.T,title:e.t,body:e.x})),...REFORMS.filter(r=>r[0]>=t0&&r[0]<t1).map(r=>({kind:'r',t:r[0],title:r[1],by:r[2],body:r[3]}))].sort((a,b)=>a.t-b.t);
  const rg=(ALL?ERAS.map((E2,j)=>{const ff=FRAMES.filter(x=>x.era===E2.k);return {s:ff[0].t,e:ff[ff.length-1].t2,n:E2.n,c:(j%5)+1}}):((()=>{const r=REGIMES.filter(r=>r.e>t0&&r.s<t1);return r.length?r:fs.map((F,j)=>({s:F.t,e:F.t2,n:F.title.replace(/^\d세기 · /,''),c:(j%5)+1}))})())).map(r=>({n:r.n,c:r.c,a:xT(Math.max(r.s,t0)),b:xT(Math.min(r.e,t1))})).filter((r,i,A)=>A.length<2||r.b-r.a>=60);if(rg.length)rg[0].a=Math.min(rg[0].a,0);
  const SEPS=rg.slice(1).map(r=>r.a).concat(rg.length?[rg[rg.length-1].b]:[]);
  const fitSep=(o,anchor)=>{const w=o.b-o.a;for(const s of SEPS){if(o.a<s-3&&o.b>s-3){if(anchor<s){o.b=s-5;o.a=o.b-w;o.ra=1}else{o.a=s+5;o.b=o.a+w}}}if(o.a<6){o.a=6;o.b=6+w;o.ra=0}if(o.b>W-6){o.b=W-6;o.a=o.b-w;o.ra=1}return o};
  tops.forEach(o=>{o.a=xT(o.t)-115;o.b=o.a+230;fitSep(o,xT(o.t))});tops.sort((p,q)=>p.a-q.a);const TL=lanes(tops,14);
  const og=ONGOING.filter(o=>o[1]>t0&&o[0]<t1).map(o=>({n:o[2],c:o[3],a:xT(Math.max(o[0],t0)),b:xT(Math.min(o[1],t1))})).filter(o=>o.b-o.a>=30);const OL=lanes(og,4);
  const isUp=e=>UPT.has(e.tp[0])&&!e.treaty;
  const upN=evs.map((e,i)=>({e,x:xs[i],a:xs[i]-twe(e)/2,b:xs[i]+twe(e)/2})).filter(o=>isUp(o.e)).map(o=>fitSep(o,o.x)).sort((p,q)=>p.a-q.a);const UL0=lanes(upN,6);
  const HALF=Math.max(150,HZAV*.31),FIX=(OL?OL*22+4:0)+30+22+16;let room=HALF-FIX;const ULc=Math.min(UL0,Math.max(1,Math.min(3,Math.floor(room*.45/25))));room-=ULc*25+10;const TB=74,TLc=0,TOPH=TLc*TB;
  tops.filter(o=>o.li<TLc).forEach(o=>{const y=TOPH-(o.li+1)*TB+4;h+=`<div class="hzt" style="left:${o.a}px;top:${y}px">${o.kind==='t'?`<button data-ev="${o.e.id}"><b><i class="tseal">조</i>${esc(o.title)} <em>(${yrTxt(o.t)})</em></b></button>`:`<b data-tip="${esc(o.by)}">* ${esc(o.title)} <em>(${yrTxt(Math.floor(o.t))})</em></b>`}<p>${esc(o.body)}</p></div>`});
  // 가운데: 진행 중 · 시기 띠
  // 시기 띠 바로 위부터 줄을 쌓음: 진행 중 띠가 먼저, 사건 이름은 빈 자리 중 가장 아래 줄로
  const RH=25,RR=OL+ULc,occ=Array.from({length:RR},()=>[]);
  og.forEach(o=>occ[o.li].push([o.a,o.b]));
  const free=(k,a,b)=>occ[k].every(([p,q])=>b+6<=p||a>=q+6);
  const upP=[...upN].sort((p,q)=>(isMajor(q.e)-isMajor(p.e))||(p.a-q.a));upP.forEach(o=>{o.row=-1;for(let k=0;k<RR;k++)if(free(k,o.a,o.b)){o.row=k;occ[k].push([o.a,o.b]);break}});
  const used=Math.max(OL,...upN.map(o=>o.row+1),0);
  let y0=TOPH+38+used*RH+(used?10:0);
  const rowY=k=>y0-10-(k+1)*RH+3;const gcAt=x=>{const r=rg.find(r=>x>=r.a&&x<r.b);return r?`var(--g${r.c})`:'transparent'};
  og.forEach(o=>{h+=`<div class="hzog" style="left:${o.a}px;top:${rowY(o.li)}px;width:${Math.max(8,o.b-o.a)}px;--tc:var(--t-${o.c})"><span>${esc(o.n)}</span></div>`});
  let rgH='',stH='';rg.forEach((r,ri)=>{const rb=ri===rg.length-1?Math.max(r.b,W):r.b;stH+=`<div class="hzst" style="left:${ri?r.a:Math.min(r.a,0)}px;width:${Math.max(0,rb-(ri?r.a:Math.min(r.a,0)))}px;--gc:var(--g${r.c})"></div>`;rgH+=`<div class="hzrg" style="left:${r.a}px;top:4px;width:${Math.max(8,rb-r.a-6)}px;--gc:var(--g${r.c})"><span>${esc(r.n)}</span></div><i class="hzsep" style="left:${r.a}px"></i>`});
  const axY=y0+22;
  // 축 · 연도 · 표시
  h+=`<div class="hzax" style="top:${axY}px;width:${W}px"></div>`;
  let lastY=null;evs.forEach((e,i)=>{const yy=Math.floor(e.T+1e-6);const maj=isMajor(e);
    if(yy!==lastY){h+=`<span class="hzyr${maj?' mj':''}" style="left:${xs[i]}px;top:${axY-21}px">${yrTxt(yy)}</span>`;lastY=yy}
    h+=maj?`<span class="hzx" style="left:${xs[i]}px;top:${axY-6}px">×</span>`:`<span class="hztk" style="left:${xs[i]}px;top:${axY-6}px"></span>`});
  // 축 아래: 사건 이름만
  upN.filter(o=>o.row>=0).forEach(o=>{const y=rowY(o.row);h+=`<i class="hzld up" style="left:${o.x}px;top:${y+19}px;height:${axY-6-(y+19)}px"></i><button class="hzn up${o.ra?' ra':''}${isMajor(o.e)?' mj':''}${HEARTS.has(o.e.t)?' hearted':''}" data-ev="${o.e.id}" style="left:${o.a}px;top:${y}px;width:${o.b-o.a}px;--tc:var(--t-${o.e.tp[0]});--gc:${gcAt(o.x)}"><span>${esc(o.e.t)}</span></button>`});
  const nm=evs.map((e,i)=>({e,x:xs[i],a:xs[i]-twe(e)/2,b:xs[i]+twe(e)/2})).filter(o=>!isUp(o.e)).map(o=>fitSep(o,o.x)).sort((p,q)=>p.a-q.a);const NL=lanes(nm,6);
  const nmTop=axY+20;const NLc=Math.max(2,Math.min(NL,Math.floor((HALF-30)/24)));
  nm.filter(o=>o.li<NLc).forEach(o=>{const y=nmTop+o.li*24;h+=`<i class="hzld" style="left:${o.x}px;top:${axY+6}px;height:${y-axY-2}px"></i><button class="hzn${o.ra?' ra':''}${isMajor(o.e)?' mj':''}${HEARTS.has(o.e.t)?' hearted':''}" data-ev="${o.e.id}" style="left:${o.a}px;top:${y}px;width:${o.b-o.a}px;--tc:var(--t-${o.e.tp[0]});--gc:${gcAt(o.x)}"><span>${o.e.treaty?'<i class="tseal">조</i>':''}${esc(o.e.t)}</span></button>`});
  const topH0=nmTop+NLc*24+10,aboveH=axY+3,belowH=topH0-axY-3,half=Math.max(aboveH,belowH),padT=half-aboveH,topH=half*2;
  // 아래 칸: 왕 줄 + 주요 사건 풀이
  let b='';const kr=ALL?[]:REIGNS.map(D=>({D,rs:D.r.filter(r=>Math.min(r.e,t1)-Math.max(r.s,t0)>.3)})).filter(x=>x.rs.length);
  kr.forEach(({D,rs},j)=>rs.forEach(r=>{const a=xT(Math.max(r.s,t0)),bb=xT(Math.min(r.e,t1));if(bb-a<2)return;const n=r.name.replace('대통령 ','');b+=`<div class="hzk" data-king="${esc(D.n)}|${D.r.indexOf(r)}" style="left:${a}px;top:${6+j*20}px;width:${bb-a-2}px;--rc:var(--c-${D.c})"><span>${esc(n)}</span></div>`}));
  const KH=kr.length*20+12;
  const shownT=new Set(tops.filter(o=>o.li<TLc&&o.e).map(o=>o.e.id));
  const shownL=new Set([...upN.filter(o=>o.row>=0),...nm.filter(o=>o.li<NLc)].map(o=>o.e.id));const det=[...evs.filter(e=>HZ_NOTES[e.t]||(isMajor(e)&&!shownT.has(e.id)&&!shownL.has(e.id))).map(e=>fitSep({e,a:xT(e.T)-120,b:xT(e.T)+120},xT(e.T))),...tops.filter(o=>o.li>=TLc&&o.kind==='r').map(o=>fitSep({r:o,a:xT(o.t)-120,b:xT(o.t)+120},xT(o.t))),].sort((p,q)=>p.a-q.a);let DL=lanes(det,14);if(HZ_ONLY[k]){det.forEach((o,i)=>{o.li=0;const w=o.b-o.a;o.a=Math.max(6,(o.e?xT(o.e.T):o.a)+8);o.b=o.a+w});DL=1}
  const DB=HZ_ONLY[k]?120:(evs.some(e=>HZ_NOTES[e.t])?76:62);const DLc=DL;det.filter(o=>o.li<DLc).forEach(o=>{if(o.g){b+=`<div class="hzd hzg" style="left:${o.a}px;top:${KH+o.li*DB}px"><b data-gl="${esc(o.g)}" class="gw">${esc(o.g)}</b><em>${esc(o.from)}</em><p>${esc(hzShort(GLOSS[o.g]))}</p></div>`;return}if(o.r){b+=`<div class="hzd" style="left:${o.a}px;top:${KH+o.li*DB}px"><b class="rfh">* ${esc(o.r.title)} <em>(${yrTxt(Math.floor(o.r.t))})</em></b><em>${esc(o.r.by)}</em><p>${esc(hzShort(o.r.body))}</p></div>`;return}b+=`<div class="hzd" style="left:${o.a}px;top:${KH+o.li*DB}px"><button data-ev="${o.e.id}" style="--tc:var(--t-${o.e.tp[0]})">* ${esc(o.e.t)}</button>${o.e.pp?`<em>${esc(o.e.pp)}</em>`:''}${HZ_NOTES[o.e.t]?`<div class="hzkw">${HZ_NOTES[o.e.t].map(v=>`<span>${esc(v)}</span>`).join('')}</div>`:`<p>${esc(hzShort(o.e.x))}</p>`}</div>`});
  rg.forEach(r=>{stH+=`<i class="hzsep" style="left:${r.a}px"></i>`});
  const usedB=KH+(det.length?DL*DB+4:0);if(false)b+=`<div class="hzsum" style="margin-top:${usedB}px">${sumHTML(E)}</div>`;
  const botH=Math.max(KH+DB,HZAV-topH-4);
  return {H:topH+botH+4,html:`<div class="hzwrap" style="width:${W}px">${stH}<div class="hztop" style="height:${topH}px">${rgH}<div style="position:absolute;left:0;right:0;top:${padT}px;height:${topH0}px">${h}</div></div><div class="hzbot" style="height:${botH}px">${b}</div></div>`}
}
{const de=drawEra;drawEra=function(k){if(ovDir==='h'&&k!=='heart'){$('ovscroll').classList.add('hz');drawHZ(k)}else{$('v-ov').classList.remove('hzsplit');de(k)}}}

/* 아래칸만 세로 스크롤: 요약은 가로 스크롤 따라 왼쪽에 붙어 있게 */
function hzSync(){const sc=$('ovscroll');if(!sc)return;const L=sc.scrollLeft,s=sc.querySelector('.hzsum');if(s)s.style.transform=`translateX(${L}px)`;sc.querySelectorAll('.hzbot .hzk').forEach(k=>{const sp=k.firstElementChild;if(!sp)return;const a=k.offsetLeft,w=k.offsetWidth,sw=sp.offsetWidth;sp.style.transform=`translateX(${Math.max(0,Math.min(L-a,w-sw-4))}px)`})}
{const sc=$('ovscroll');if(sc)sc.addEventListener('scroll',()=>hzSync(),{passive:true});const d0=drawHZ;drawHZ=function(k){d0(k);hzSync();requestAnimationFrame(hzSync)}}
