/* ───────── 소리 (배경음 · 효과음) : 파일 없이 Web Audio로 직접 만든다 ───────── */
const SND_DEF={bgm:false,when:'play',mood:'file',vol:.5,sfx:true,fx:{war:true,found:true,fall:true,treaty:true,flag:true,rise:true,heart:true}};
const SND=Object.assign({},SND_DEF,store.get('snd',{}));SND.fx=Object.assign({},SND_DEF.fx,SND.fx||{});
if(!SND.v2){SND.mood='file';SND.v2=true}
const saveSnd=()=>store.set('snd',SND);
let AC=null,MASTER=null,BGB=null,SFXB=null,REV=null;
/* 아이폰 등: 소리는 사용자가 누른 순간에 열어 둬야 나중에 효과음이 난다 */
try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
function unlockAudio(){const a=ac();if(!a)return;if(a.state!=='running')a.resume();const b=a.createBuffer(1,1,22050),s=a.createBufferSource();s.buffer=b;s.connect(a.destination);s.start(0)}
['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,()=>{if(!AC||AC.state!=='running')unlockAudio()},{capture:true,passive:true}));
function ac(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();MASTER=AC.createGain();MASTER.gain.value=SND.vol;const CMP=AC.createDynamicsCompressor();CMP.threshold.value=-6;CMP.ratio.value=3;MASTER.connect(CMP);CMP.connect(AC.destination);
  // 작은 잔향
  REV=AC.createConvolver();const L=AC.sampleRate*2.2,b=AC.createBuffer(2,L,AC.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}REV.buffer=b;
  const rg=AC.createGain();rg.gain.value=.35;REV.connect(rg);rg.connect(MASTER);
  BGB=AC.createGain();BGB.gain.value=0;BGB.connect(MASTER);BGB.connect(REV);SFXB=AC.createGain();SFXB.gain.value=4;SFXB.connect(MASTER);SFXB.connect(REV)}
  if(AC.state==='suspended')AC.resume();return AC}
const mtof=m=>440*Math.pow(2,(m-69)/12);
function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
function noiseBuf(sec){const n=AC.sampleRate*sec,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b}

/* 악기 */
const INST={
 pluck(t,m,v,out){// 가야금 느낌: 짧게 튕기고 살짝 꺾임
  const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='triangle';o2.type='sine';
  const fr=mtof(m);o.frequency.setValueAtTime(fr*1.012,t);o.frequency.exponentialRampToValueAtTime(fr,t+.08);if(Math.random()<.3){o.frequency.setValueAtTime(fr,t+.35);o.frequency.linearRampToValueAtTime(fr*1.06,t+.6);o.frequency.linearRampToValueAtTime(fr,t+.9)}
  o2.frequency.value=fr*2;f.type='lowpass';f.frequency.setValueAtTime(3200,t);f.frequency.exponentialRampToValueAtTime(700,t+1.2);
  o.connect(f);o2.connect(f);f.connect(g);g.connect(out);env(g,t,.005,.32*v,1.8);o.start(t);o2.start(t);o.stop(t+2);o2.stop(t+2)},
 flute(t,m,v,out,len=1.6){// 대금 느낌: 천천히 불고 떨림
  const o=AC.createOscillator(),g=AC.createGain(),lfo=AC.createOscillator(),lg=AC.createGain(),nb=AC.createBufferSource(),nf=AC.createBiquadFilter(),ng=AC.createGain();
  o.type='sine';o.frequency.value=mtof(m);lfo.frequency.value=5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(mtof(m)*.012,t+len*.6);lfo.connect(lg);lg.connect(o.frequency);
  nb.buffer=noiseBuf(len+.3);nf.type='bandpass';nf.frequency.value=mtof(m)*2;nf.Q.value=3;ng.gain.value=.05*v;nb.connect(nf);nf.connect(ng);ng.connect(g);
  o.connect(g);g.connect(out);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.2*v,t+.25);g.gain.setValueAtTime(.2*v,t+len*.7);g.gain.exponentialRampToValueAtTime(0.0001,t+len+.3);
  [o,lfo,nb].forEach(x=>{x.start(t);x.stop(t+len+.35)})},
 piano(t,m,v,out){const fr=mtof(m);[[1,.25],[2,.08],[3,.03]].forEach(([h,a])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=fr*h;o.connect(g);g.connect(out);env(g,t,.004,a*v,2.4/h);o.start(t);o.stop(t+2.6)})},
 pad(t,m,v,out,len){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';o2.type='sawtooth';o.frequency.value=mtof(m);o2.frequency.value=mtof(m)*1.004;f.type='lowpass';f.frequency.value=420;
  o.connect(f);o2.connect(f);f.connect(g);g.connect(out);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.05*v,t+len*.4);g.gain.exponentialRampToValueAtTime(0.0001,t+len);[o,o2].forEach(x=>{x.start(t);x.stop(t+len+.1)})},
 drum(t,v,out,lo=110){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(lo,t);o.frequency.exponentialRampToValueAtTime(lo*.42,t+.25);o.connect(g);g.connect(out);env(g,t,.004,.5*v,.45);o.start(t);o.stop(t+.6)}
};
/* 분위기: 음계(국악 평조·계면조, 장·단조)와 악기 */
const MOODS={
 ancient:{n:'고대 · 북과 피리',sc:[0,2,5,7,9],root:57,lead:'flute',beat:1.25,drum:true},
 gayageum:{n:'가야금',sc:[0,2,5,7,9],root:57,lead:'pluck',beat:.9},
 daegeum:{n:'대금',sc:[0,3,5,7,10],root:62,lead:'flute',beat:1.5},
 piano:{n:'잔잔한 피아노',sc:[0,2,4,7,9],root:60,lead:'piano',beat:.85},
 sad:{n:'쓸쓸한 피아노',sc:[0,2,3,7,8],root:57,lead:'piano',beat:1}};
const ERA_MOOD={prehist:'ancient',pre:'ancient',early:'ancient',three:'gayageum',nsk:'gayageum',goryeo:'gayageum',joseon1:'daegeum',joseon2:'daegeum',modern1:'sad',colonial:'sad',contemp:'piano'};
let bgOn=false,bgT=0,bgStep=0,bgDeg=2,bgTimer=0,curMood=null;
function moodNow(){return SND.mood==='auto'?ERA_MOOD[FRAMES[pos.i].era]||'piano':SND.mood}
function bgTick(){if(bgOn!==true||!AC)return;const M=MOODS[curMood=moodNow()];const now=AC.currentTime;if(bgT<now)bgT=now+.05;
  while(bgT<now+1.2){const b=M.beat;
    if(bgStep%8===0)INST.pad(bgT,M.root-12+M.sc[0],1,BGB,b*8.2);
    if(bgStep%8===4)INST.pad(bgT,M.root-12+M.sc[3],.8,BGB,b*4.4);
    if(M.drum&&bgStep%4===0)INST.drum(bgT,.35,BGB,90);
    const rest=Math.random()<(M.lead==='flute'?.45:.3);
    if(!rest){bgDeg=Math.max(0,Math.min(9,bgDeg+[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)]));const oct=Math.floor(bgDeg/5),m=M.root+M.sc[bgDeg%5]+12*oct;
      if(M.lead==='flute')INST.flute(bgT,m,.9,BGB,b*1.8);else INST[M.lead](bgT,m,.8,BGB);
      if(M.lead==='piano'&&bgStep%2===0&&Math.random()<.5)INST.piano(bgT,m-12,.5,BGB)}
    bgT+=b*(M.lead==='flute'&&!rest?2:1);bgStep++}
  bgTimer=setTimeout(bgTick,400)}
let BGA=null,fadeT=0;const FILE_VOL=.31;
function fileVol(){return Math.min(1,SND.vol*FILE_VOL*2)}
function fadeTo(a,v,ms,done){clearInterval(fadeT);const v0=a.volume,t0=performance.now();fadeT=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/ms);a.volume=v0+(v-v0)*k;if(k>=1){clearInterval(fadeT);done&&done()}},40)}
function fileStart(){if(!BGA){BGA=new Audio('bgm.mp3');BGA.loop=true;BGA.preload='auto'}BGA.volume=0;const pr=BGA.play();if(pr&&pr.catch)pr.catch(()=>{});fadeTo(BGA,fileVol(),1200)}
function fileStop(){if(BGA&&!BGA.paused)fadeTo(BGA,0,600,()=>BGA.pause())}
function bgStart(){if(SND.mood==='file'){if(bgOn==='file')return;if(bgOn)bgStop();bgOn='file';fileStart();return}if(bgOn==='file')bgStop();if(!ac())return;if(bgOn)return;bgOn=true;bgT=0;BGB.gain.cancelScheduledValues(AC.currentTime);BGB.gain.setTargetAtTime(.8,AC.currentTime,.6);bgTick()}
function bgStop(){if(!bgOn)return;if(bgOn==='file'){bgOn=false;fileStop();return}bgOn=false;clearTimeout(bgTimer);if(AC)BGB.gain.setTargetAtTime(0,AC.currentTime,.4)}
function bgSync(){const want=SND.bgm&&(SND.when==='always'||playing);want?bgStart():bgStop()}

/* 효과음 */
const SFX={
 war(){const t=AC.currentTime;INST.drum(t,1,SFXB,120);INST.drum(t+.22,.8,SFXB,100);const nb=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();nb.buffer=noiseBuf(.3);f.type='lowpass';f.frequency.value=900;nb.connect(f);f.connect(g);g.connect(SFXB);env(g,t,.003,.25,.18);nb.start(t)},
 found(){const t=AC.currentTime;[[110,.3],[110*2.76,.08],[110*5.4,.04],[164,.12]].forEach(([fr,a])=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(fr*1.02,t);o.frequency.exponentialRampToValueAtTime(fr,t+1);o.connect(g);g.connect(SFXB);env(g,t,.01,a,3.2);o.start(t);o.stop(t+3.4)})},
 fall(){const t=AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(70,t+1.1);o.connect(g);g.connect(SFXB);env(g,t,.02,.25,1.2);o.start(t);o.stop(t+1.4)},
 treaty(){const t=AC.currentTime;const nb=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();nb.buffer=noiseBuf(.15);f.type='lowpass';f.frequency.value=500;nb.connect(f);f.connect(g);g.connect(SFXB);env(g,t,.002,.6,.09);nb.start(t);INST.drum(t,.5,SFXB,180)},
 flag(){const t=AC.currentTime;const nb=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();nb.buffer=noiseBuf(.5);f.type='bandpass';f.Q.value=1.4;f.frequency.setValueAtTime(500,t);f.frequency.exponentialRampToValueAtTime(2600,t+.35);nb.connect(f);f.connect(g);g.connect(SFXB);env(g,t,.05,.18,.32);nb.start(t)},
 rise(){const t=AC.currentTime;
  /* 꽹과리: 갠-갠-갠지갠 */
  const hit=(at,a)=>{[[1180,1],[1630,.7],[2390,.5],[3170,.3]].forEach(([fr,k])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=fr;o.connect(g);g.connect(SFXB);env(g,at,.002,.07*a*k,.22);o.start(at);o.stop(at+.3)});
   const nb=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();nb.buffer=noiseBuf(.08);f.type='highpass';f.frequency.value=3000;nb.connect(f);f.connect(g);g.connect(SFXB);env(g,at,.001,.08*a,.05);nb.start(at)};
  [[0,1],[.2,.8],[.4,1],[.5,.7],[.6,1]].forEach(([d,a])=>hit(t+d,a));
  /* 북 두 번 + 웅성대는 함성 */
  INST.drum(t,.9,SFXB,95);INST.drum(t+.4,.8,SFXB,95);
  const nb=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();nb.buffer=noiseBuf(1.3);f.type='bandpass';f.Q.value=.9;f.frequency.setValueAtTime(380,t);f.frequency.linearRampToValueAtTime(780,t+.9);nb.connect(f);f.connect(g);g.connect(SFXB);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.5);g.gain.linearRampToValueAtTime(0,t+1.25);nb.start(t);nb.stop(t+1.3)},
 heart(){const t=AC.currentTime;[76,83].forEach((m,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=mtof(m);o.connect(g);g.connect(SFXB);env(g,t+i*.08,.004,.16,.35);o.start(t+i*.08);o.stop(t+i*.08+.45)})}
};
let lastSfx=0;
function sfx(k,force){if(!SND.sfx||SND.fx[k]===false)return;if(!ac())return;const now=performance.now();if(!force&&now-lastSfx<220)return;lastSfx=now;SFX[k]();duck()}
function duck(){if(bgOn==='file'&&BGA){clearInterval(fadeT);BGA.volume=fileVol()*.55;clearTimeout(duck.t);duck.t=setTimeout(()=>{if(bgOn==='file')fadeTo(BGA,fileVol(),700)},900)}else if(bgOn===true&&BGB){const t=AC.currentTime;BGB.gain.cancelScheduledValues(t);BGB.gain.setTargetAtTime(.35,t,.05);BGB.gain.setTargetAtTime(.8,t+.9,.4)}}
function sfxFor(e){if(e.found)return 'found';if(e.fall)return 'fall';if(e.treaty)return 'treaty';if(e.icon==='rev')return 'rise';const k=e.tp[0];if(k==='war')return 'war';if(k==='pol'||k==='ind')return 'flag';return null}

/* 설정 창 */
const FXN=[['war','전쟁 · 전투','둥둥 북'],['found','나라 세움','징'],['fall','멸망','낮게 떨어지는 소리'],['treaty','조약','도장 쾅'],['flag','정치 · 운동','깃발 펄럭'],['rise','백성의 봉기','꽹과리 · 함성'],['heart','하트','띵']];
const FONTS=[['plex','단정',"'IBM Plex Sans KR'"],['base','깔끔',"'Noto Sans KR'"],['nanum','나눔',"'Nanum Gothic'"],['sun','해바라기',"'Sunflower'"],['round','둥근',"'Gowun Dodum'"],['a1','모던',"'Gothic A1'"],['orbit','오르빗',"'Orbit'"],['batang','고운바탕',"'Gowun Batang'"],['myeong','나눔명조',"'Nanum Myeongjo'"],['hahm','함렛',"'Hahmlet'"],['song','송명',"'Song Myung'"],['diph','디필레이아',"'Diphylleia'"],['jua','동글',"'Jua'"],['hand','손글씨',"'Gaegu'"],['gamja','감자꽃',"'Gamja Flower'"],['poor','푸어스토리',"'Poor Story'"],['yeon','연성',"'Yeon Sung'"],['single','싱글데이',"'Single Day'"],['dongle','동글이',"'Dongle'",.62],['cute','귀염',"'Cute Font'",.6],['brush','붓글씨',"'Nanum Brush Script'",.6],['melody','연필',"'Hi Melody'",.56],['pen','펜글씨',"'Nanum Pen Script'",.6]];
function applyFont(k){const f=FONTS.find(x=>x[0]===k)||FONTS[0],r=document.documentElement;r.dataset.font=f[0];r.style.setProperty('--ui',`${f[2]},"Noto Sans KR","Apple SD Gothic Neo",system-ui,sans-serif`);r.style.setProperty('--display','var(--ui)');r.style.setProperty('--fsa',f[3]||'none')}
function openSet(){const p=$('setpop');const mo=Object.entries(MOODS);const FT=store.get('font','plex');
  p.innerHTML=`<div class="sethd"><h2>설정</h2><button class="ib" data-x aria-label="닫기"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>

  <section><label class="sw"><span><b>배경음</b><small>국악·피아노 느낌의 잔잔한 음악</small></span><input type="checkbox" data-k="bgm" ${SND.bgm?'checked':''}><i></i></label>
   <div class="seg" data-g="when"><button data-v="play" aria-pressed="${SND.when==='play'}">재생할 때만</button><button data-v="always" aria-pressed="${SND.when==='always'}">항상</button></div>
   <div class="moods" data-g="mood"><button data-v="file" aria-pressed="${SND.mood==='file'}"><b>올린 음악</b><small>작게 반복 재생</small></button><button data-v="auto" aria-pressed="${SND.mood==='auto'}"><b>시대에 맞게 자동</b><small>고대→가야금→대금→피아노</small></button>${mo.map(([k,M])=>`<button data-v="${k}" aria-pressed="${SND.mood===k}"><b>${M.n}</b><small data-try="${k}">들어 보기</small></button>`).join('')}</div>
   <label class="vol"><span>볼륨</span><input type="range" min="0" max="1" step="0.05" value="${SND.vol}" data-k="vol"></label></section>
  <section><label class="sw"><span><b>효과음</b><small>지도에 사건이 나타날 때</small></span><input type="checkbox" data-k="sfx" ${SND.sfx?'checked':''}><i></i></label>
   <ul class="fxl">${FXN.map(([k,n,d])=>`<li><label class="sw sm"><span><b>${n}</b><small>${d}</small></span><button class="try" data-fx="${k}" type="button" aria-label="${n} 들어 보기">▶</button><input type="checkbox" data-f="${k}" ${SND.fx[k]!==false?'checked':''}><i></i></label></li>`).join('')}</ul></section>`;
  p.hidden=false;$('setdim').hidden=false;
  p.querySelector('[data-x]').onclick=closeSet;
  p.querySelectorAll('[data-g2="font"] button').forEach(b=>b.onclick=()=>{store.set('font',b.dataset.v);applyFont(b.dataset.v);p.querySelectorAll('[data-g2="font"] button').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  p.querySelectorAll('input[data-k]').forEach(i=>i.oninput=()=>{const k=i.dataset.k;SND[k]=i.type==='checkbox'?i.checked:+i.value;saveSnd();if(k==='vol'){if(ac())MASTER.gain.setTargetAtTime(SND.vol,AC.currentTime,.05);if(BGA&&bgOn==='file'){clearInterval(fadeT);BGA.volume=fileVol()}}else{ac();bgSync()}});
  p.querySelectorAll('input[data-f]').forEach(i=>i.onchange=()=>{SND.fx[i.dataset.f]=i.checked;saveSnd()});
  p.querySelectorAll('[data-fx]').forEach(b=>b.onclick=ev=>{ev.preventDefault();ev.stopPropagation();if(!ac())return;SFX[b.dataset.fx]();duck()});
  p.querySelectorAll('[data-g]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{SND[g.dataset.g]=b.dataset.v;saveSnd();g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    if(g.dataset.g==='mood'){SND.bgm=true;p.querySelector('input[data-k="bgm"]').checked=true;saveSnd();ac();bgStop();setTimeout(bgPreview,bgOn?650:0)}else bgSync()}));
}
let prevT=0;function bgPreview(){bgStart();clearTimeout(prevT);if(!(SND.when==='always'||playing))prevT=setTimeout(()=>{if($('setpop').hidden||!(SND.when==='always'||playing))bgStop()},6000)}
function closeSet(){$('setpop').hidden=true;$('setdim').hidden=true;clearTimeout(prevT);bgSync()}
$('setdim').onclick=closeSet;$('setbtn').onclick=openSet;
$('heartbtn').onclick=()=>{tlHeart='h';showView('tl');renderTLFilter();$('tlread').scrollTop=0};$('bookbtn').onclick=()=>{tlHeart='b';showView('tl');renderTLFilter();$('tlread').scrollTop=0};
{const p0=play,p1=pause,pp=popPin;play=function(){unlockAudio();p0.apply(this,arguments);bgSync()};pause=function(){p1.apply(this,arguments);bgSync()};
 popPin=function(o){pp(o);if(playing&&o&&o.pin){const k=sfxFor(o.pin);if(k)sfx(k)}}}
document.addEventListener('click',ev=>{const h=ev.target.closest('[data-h]');if(h&&h.getAttribute('aria-pressed')==='true')sfx('heart',true)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)bgStop();else bgSync()});

/* 전체 화면 */
$('fsbtn').onclick=()=>{const d=document,el=d.documentElement;const on=d.fullscreenElement||d.webkitFullscreenElement;try{if(on)(d.exitFullscreen||d.webkitExitFullscreen).call(d);else (el.requestFullscreen||el.webkitRequestFullscreen).call(el)}catch(e){}};
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{const on=!!(document.fullscreenElement||document.webkitFullscreenElement);$('fsbtn').classList.toggle('on',on);$('fsbtn').innerHTML=on?'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>':'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'}));
if(!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen))$('fsbtn').hidden=true;

applyFont('jua');
