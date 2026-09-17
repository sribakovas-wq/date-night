const slides=[
 ['images/01.jpeg','Kai kurios akimirkos tiesiog lieka atminty…'],
 ['images/02.jpeg','Man patinka matyti tave tokią – tiesiog savimi. ❤️'],
 ['images/03.jpeg','Tavo šypsena visada praskaidrina mano dieną.'],
 ['images/04.jpeg','Su tavimi net paprastos vietos tampa ypatingos.'],
 ['images/05.jpeg','Už mūsų didelius prisiminimus. 🥂'],
 ['images/06.jpeg','Už vakarus, kurių nesinori baigti…'],
 ['images/07.jpeg','Ir už tas akimirkas, kai pasaulis aplink tiesiog dingsta. ❤️'],
 ['images/08.jpeg','Už mus tokius, kokie esam – be filtrų ir ritmo. 😘'],
 ['images/09.jpeg','Labiausiai laukiu ne vietos. Laukiu dar vieno mūsų vakaro kartu.']
];
let i=0,drawing=false,revealed=false;
const card=document.querySelector('#card'),img=document.querySelector('#photo'),msg=document.querySelector('#message'),counter=document.querySelector('#counter'),canvas=document.querySelector('#scratch'),ctx=canvas.getContext('2d',{willReadFrequently:true}),next=document.querySelector('#next'),hint=document.querySelector('#hint'),final=document.querySelector('#final');
const music=document.querySelector('#music');
let musicStarted=false;
function startMusic(){if(musicStarted||!music)return;music.volume=.55;music.play().then(()=>musicStarted=true).catch(()=>{});}
document.addEventListener('pointerdown',startMusic,{once:true});
document.addEventListener('touchstart',startMusic,{once:true});
function setup(){revealed=false;next.hidden=true;hint.hidden=false;img.src=slides[i][0];msg.textContent=slides[i][1];counter.textContent=`${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;requestAnimationFrame(()=>{const r=card.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.opacity='1';canvas.style.pointerEvents='auto';ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation='source-over';const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#8e5265');g.addColorStop(.5,'#4a2633');g.addColorStop(1,'#7b3f53');ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='#f5dce3';ctx.textAlign='center';ctx.font='700 14px system-ui';ctx.fillText('NUTRINK MANE ♥',r.width/2,r.height/2);});}
function point(e){const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}
function scratch(e){if(!drawing||revealed)return;e.preventDefault();const [x,y]=point(e);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,30,0,Math.PI*2);ctx.fill();}
function check(){if(revealed)return;const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0,total=0;for(let p=3;p<data.length;p+=4*80){total++;if(data[p]<40)clear++;}if(clear/total>=.58){revealed=true;canvas.style.transition='opacity .65s ease';canvas.style.opacity='0';hint.hidden=true;setTimeout(()=>{canvas.style.pointerEvents='none';next.hidden=false;next.textContent=i===slides.length-1?'Paskutinė žinutė ♥':'Kita akimirka →';},350);}}
canvas.addEventListener('pointerdown',e=>{startMusic();drawing=true;canvas.setPointerCapture?.(e.pointerId);scratch(e)});
canvas.addEventListener('pointermove',scratch);
canvas.addEventListener('pointerup',()=>{drawing=false;check()});
canvas.addEventListener('pointercancel',()=>{drawing=false;check()});
next.addEventListener('click',()=>{startMusic();if(i<slides.length-1){i++;canvas.style.transition='none';setup();card.scrollIntoView({behavior:'smooth',block:'center'});}else{card.hidden=true;hint.hidden=true;next.hidden=true;document.querySelector('header').style.display='none';final.hidden=false;scrollTo({top:0,behavior:'smooth'});}});
window.addEventListener('resize',()=>{if(!revealed)setup()});
setup();
