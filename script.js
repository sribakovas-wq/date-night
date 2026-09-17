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

let i=0,drawing=false,revealed=false,moves=0;
const card=document.querySelector('#card');
const img=document.querySelector('#photo');
const msg=document.querySelector('#message');
const counter=document.querySelector('#counter');
const canvas=document.querySelector('#scratch');
const ctx=canvas.getContext('2d',{willReadFrequently:true});
const next=document.querySelector('#next');
const music=document.querySelector('#music');

async function playMusic(){
 try{music.volume=.65;await music.play()}catch(e){}
}
window.addEventListener('load',playMusic);
['pointerdown','touchstart','click'].forEach(ev=>{
 document.addEventListener(ev,playMusic,{once:true,passive:true});
});

function setup(){
 revealed=false;moves=0;next.hidden=true;
 img.src=slides[i][0];
 msg.textContent=slides[i][1];
 counter.textContent=String(i+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
 canvas.style.transition='none';
 canvas.style.opacity='1';
 canvas.style.pointerEvents='auto';
 requestAnimationFrame(paintCover);
}
function paintCover(){
 const r=card.getBoundingClientRect();
 canvas.width=Math.max(1,Math.round(r.width));
 canvas.height=Math.max(1,Math.round(r.height));
 ctx.globalCompositeOperation='source-over';
 const g=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
 g.addColorStop(0,'#efa1b8');g.addColorStop(.5,'#ce6888');g.addColorStop(1,'#87384f');
 ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#fff';ctx.font='600 17px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText('Brauk pirštu ❤️',canvas.width/2,canvas.height/2);
 ctx.globalCompositeOperation='destination-out';
}
function scratch(e){
 if(!drawing||revealed)return;
 e.preventDefault();
 const r=canvas.getBoundingClientRect();
 const x=e.clientX-r.left,y=e.clientY-r.top;
 ctx.beginPath();ctx.arc(x,y,Math.max(22,canvas.width*.06),0,Math.PI*2);ctx.fill();
 if(++moves%8===0)check();
}
function check(){
 const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;
 let clear=0,total=0;
 for(let p=3;p<d.length;p+=100){total++;if(d[p]<40)clear++}
 if(clear/total>=.55)reveal();
}
function reveal(){
 if(revealed)return;
 revealed=true;
 canvas.style.transition='opacity .45s ease';
 canvas.style.opacity='0';
 setTimeout(()=>{canvas.style.pointerEvents='none';next.hidden=false},300);
}
canvas.addEventListener('pointerdown',e=>{
 playMusic();drawing=true;canvas.setPointerCapture?.(e.pointerId);scratch(e)
});
canvas.addEventListener('pointermove',scratch);
canvas.addEventListener('pointerup',()=>{drawing=false;check()});
canvas.addEventListener('pointercancel',()=>drawing=false);

next.addEventListener('click',()=>{
 playMusic();
 if(i<slides.length-1){
  i++;setup();window.scrollTo({top:0,behavior:'smooth'});
 }else{
  document.querySelector('#story').innerHTML=`
  <section class="final">
   <div class="heart">❤️</div>
   <div class="eyebrow">DABAR BELIKO VIENA…</div>
   <h1>Antradienis</h1>
   <div class="time">19:00</div>
   <p>Brangioji, būsiu pasiruošęs.<br><br>Šįkart planas tavo,<br>o aš su malonumu leisiuosi nustebinamas. ❤️</p>
   <div class="sign">Iki mūsų vakaro…</div>
  </section>`;
 }
});
window.addEventListener('resize',()=>{if(!revealed)paintCover()});
setup();