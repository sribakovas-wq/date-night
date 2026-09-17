const slides = [
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

let i = 0, drawing = false, revealed = false, scratched = 0;
const card = document.querySelector('#card');
const img = document.querySelector('#photo');
const msg = document.querySelector('#message');
const counter = document.querySelector('#counter');
const canvas = document.querySelector('#scratch');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const next = document.querySelector('#next');
const hint = document.querySelector('#hint');
const music = document.querySelector('#music');

async function tryMusic() {
  if (!music || !music.paused) return;
  try { await music.play(); } catch (_) {}
}

// Bandome iškart. iOS/Safari gali blokuoti autoplay su garsu.
window.addEventListener('load', tryMusic);
document.addEventListener('pointerdown', tryMusic, { once: true });
document.addEventListener('touchstart', tryMusic, { once: true });
document.addEventListener('click', tryMusic, { once: true });

function setup() {
  revealed = false;
  scratched = 0;
  next.hidden = true;
  hint.hidden = false;
  img.src = slides[i][0];
  msg.textContent = slides[i][1];
  counter.textContent = `${String(i + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  canvas.style.opacity = '1';
  canvas.style.pointerEvents = 'auto';
  canvas.style.transition = 'none';
  requestAnimationFrame(resizeCanvas);
}

function resizeCanvas() {
  const rect = card.getBoundingClientRect();
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0,'#f4a7bc');
  g.addColorStop(.5,'#d96f90');
  g.addColorStop(1,'#9d405f');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,.94)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 18px system-ui, sans-serif';
  ctx.fillText('Brauk pirštu ❤️', canvas.width/2, canvas.height/2);
  ctx.globalCompositeOperation = 'destination-out';
}

function point(e) {
  const r = canvas.getBoundingClientRect();
  return {x:e.clientX-r.left, y:e.clientY-r.top};
}

function scratch(e) {
  if (!drawing || revealed) return;
  e.preventDefault();
  const p = point(e);
  const radius = Math.max(20, canvas.width * .055);
  ctx.beginPath();
  ctx.arc(p.x,p.y,radius,0,Math.PI*2);
  ctx.fill();
  scratched++;
  if (scratched % 10 === 0) checkScratch();
}

function checkScratch() {
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let transparent = 0, total = 0;
  for (let p=3; p<data.length; p+=80) {
    total++;
    if (data[p] < 40) transparent++;
  }
  if (transparent / total >= .58) reveal();
}

function reveal() {
  if (revealed) return;
  revealed = true;
  hint.hidden = true;
  canvas.style.transition = 'opacity .55s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    canvas.style.pointerEvents = 'none';
    next.hidden = false;
  }, 350);
}

canvas.addEventListener('pointerdown', e => {
  tryMusic();
  drawing = true;
  canvas.setPointerCapture?.(e.pointerId);
  scratch(e);
});
canvas.addEventListener('pointermove', scratch);
canvas.addEventListener('pointerup', () => { drawing=false; checkScratch(); });
canvas.addEventListener('pointercancel', () => { drawing=false; });

next.addEventListener('click', () => {
  tryMusic();
  if (i < slides.length - 1) {
    i++;
    setup();
    window.scrollTo({top:0, behavior:'smooth'});
  } else {
    showFinal();
  }
});

function showFinal() {
  document.querySelector('#story').innerHTML = `
    <section class="final-screen">
      <div class="final-heart">❤️</div>
      <div class="eyebrow">DABAR BELIKO VIENA…</div>
      <h1>Antradienis</h1>
      <div class="final-time">19:00</div>
      <p>Brangioji, būsiu pasiruošęs.<br><br>Šįkart planas tavo,<br>o aš su malonumu leisiuosi nustebinamas. ❤️</p>
      <div class="final-sign">Iki mūsų vakaro…</div>
    </section>`;
}

window.addEventListener('resize', () => { if (!revealed) resizeCanvas(); });
setup();
