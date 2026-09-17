const slides=[
 ['images/01.jpeg','Kai kurios akimirkos tiesiog lieka atminty…'],
 ['images/02.jpeg','Man patinka matyti tave tokią — tiesiog savimi. ❤️'],
 ['images/03.jpeg','Tavo šypsena visada praskaidrina mano dieną.'],
 ['images/04.jpeg','Su tavimi net paprastos vietos tampa ypatingos.'],
 ['images/05.jpeg','Už mūsų didelius prisiminimus. 🥂'],
 ['images/06.jpeg','Už vakarus, kurių nesinori baigti…'],
 ['images/07.jpeg','Ir už tas akimirkas, kai pasaulis aplink tiesiog dingsta. ❤️'],
 ['images/08.jpeg','Už mus tokius, kokie esam — be filtrų ir rimtumo. 😘'],
 ['images/09.jpeg','Labiausiai laukiu ne vietos. Laukiu dar vieno mūsų vakaro kartu.']
];
let i=0, drawing=false, revealed=false;const card=document.querySelector('#card'),img=document.querySelector('#photo'),msg=document.querySelector('#message'),counter=document.querySelector('#counter'),canvas=document.querySelector('#scratch'),ctx=canvas.getContext('2d',{willReadFrequently:true}),next=document.querySelector('#next'),hint=document.querySelector('#hint'),final=document.querySelector('#final');
function setup(){revealed=false;next.hidden=true;hint.hidden=false;img.src=slides[i][0];msg.textContent=slides[i][1];counter.textContent=`${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;requestAnimationFrame(()=>{const r=card.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation='source-over';const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#8e5265');g.addColorStop(.5,'#4a2633');g.addColorStop(1,'#7b3f53');ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='#f5dce3';ctx.textAlign='center';ctx.font='700 14px system-ui';ctx.fillText('NUTRINK MANE ♥',r.width/2,r.height/2);});}
function point(e){const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return [t.clientX-r.left,t.clientY-r.top]}
function scratch(e){if(!drawing)return;e.preventDefault();const [x,y]=point(e);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,42,0,Math.PI*2);ctx.fill();check();}
function check(){if(revealed)return;const w=canvas.width,h=canvas.height,data=ctx.getImageData(0,0,w,h).data;let clear=0,total=0;for(let p=3;p<data.length;p+=4*90){total++;if(data[p]<40)clear++}if(clear/total>.42){revealed=true;canvas.style.transition='opacity .5s';canvas.style.opacity='0';hint.hidden=true;next.hidden=false;next.textContent=i===slides.length-1?'Paskutinė žinutė ♥':'Kita akimirka →';}}
['pointerdown'].forEach(ev=>canvas.addEventListener(ev,e=>{drawing=true;scratch(e)}));window.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointermove',scratch);next.addEventListener('click',()=>{if(i<slides.length-1){i++;canvas.style.transition='none';canvas.style.opacity='1';setup();scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}else{card.hidden=true;hint.hidden=true;next.hidden=true;document.querySelector('header').style.display='none';final.hidden=false;scrollTo({top:0,behavior:'smooth'})}});window.addEventListener('resize',()=>{if(!revealed)setup()});setup();
