// Floating rose petals
const canvas = document.getElementById('petals');
const ctx = canvas.getContext('2d');
let w,h,petals=[];
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const COUNT = Math.min(40, Math.floor(window.innerWidth/20));
for(let i=0;i<COUNT;i++){
  petals.push({
    x: Math.random()*w,
    y: Math.random()*h,
    size: 6 + Math.random()*12,
    speedY: 0.2 + Math.random()*0.4,
    speedX: (Math.random()-0.5)*0.2,
    rotation: Math.random()*360,
    rotSpeed: (Math.random()-0.5)*2,
    alpha: 0.4 + Math.random()*0.4,
    tw: Math.random()*Math.PI*2
  });
}
function draw(){
  ctx.clearRect(0,0,w,h);
  petals.forEach(p=>{
    p.tw += 0.02;
    const a = p.alpha * (0.7 + 0.3*Math.sin(p.tw));
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI/180);
    p.rotation += p.rotSpeed;
    ctx.globalAlpha = a;
    ctx.fillStyle = '#ff8eb5';
    ctx.shadowColor = 'rgba(255,142,181,0.3)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size/2, p.size/3, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#ffe4ed';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size/3, p.size/4, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    p.y += p.speedY;
    p.x += p.speedX;
    if(p.y > h+10){ p.y = -10; p.x = Math.random()*w; }
    if(p.x > w+10) p.x = -10;
    if(p.x < -10) p.x = w+10;
  });
  requestAnimationFrame(draw);
}
draw();

function triggerHapticFeedback() {
  if (navigator && typeof navigator.vibrate === 'function') {
    navigator.vibrate(10);
  }
}

function triggerBirthdayBurst(target) {
  if (!target || !target.getBoundingClientRect) return;
  const rect = target.getBoundingClientRect();
  const burstSymbols = ['✨', '🎂', '💖', '🎉'];
  const burstCount = 6;

  for (let i = 0; i < burstCount; i++) {
    const burst = document.createElement('div');
    burst.className = 'tap-burst';
    burst.textContent = burstSymbols[i % burstSymbols.length];
    burst.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px`;
    burst.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 40}px`;
    burst.style.fontSize = `${14 + Math.random() * 8}px`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
  }
}

let ambientLoopTimer = null;

function spawnAmbientSpark() {
  const symbols = ['✨', '💖', '🌸', '🎀'];
  const spark = document.createElement('div');
  spark.className = 'ambient-spark';
  spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  spark.style.left = `${12 + Math.random() * 76}vw`;
  spark.style.top = `${18 + Math.random() * 52}vh`;
  spark.style.setProperty('--dx', `${(Math.random() * 110 - 55).toFixed(1)}px`);
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 2200);
}

function resetAmbientLoop() {
  if (ambientLoopTimer) clearTimeout(ambientLoopTimer);
  ambientLoopTimer = setTimeout(() => {
    spawnAmbientSpark();
    spawnAmbientSpark();
    ambientLoopTimer = setTimeout(resetAmbientLoop, 4200 + Math.random() * 1400);
  }, 5000);
}

document.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  button.classList.add('pressed');
  setTimeout(() => button.classList.remove('pressed'), 90);

  if (event.pointerType === 'touch' || event.pointerType === 'pen') {
    triggerHapticFeedback();
  }

  resetAmbientLoop();
}, { passive: true });

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  triggerBirthdayBurst(button);
  resetAmbientLoop();
});

resetAmbientLoop();

// ---------- MUSIC ----------
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const musicLabel = document.getElementById('musicLabel');
const bgMusic = document.getElementById('bgMusic');
let musicPlaying = false;

musicBtn.addEventListener('click', ()=>{
  if(musicPlaying){
    bgMusic.pause();
    musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicIcon.textContent = '♪';
    musicLabel.textContent = 'Music';
  } else {
    bgMusic.play().then(()=>{
      musicPlaying = true;
      musicBtn.classList.add('playing');
      musicIcon.textContent = '❚❚';
      musicLabel.textContent = 'Pause';
    }).catch(()=>{});
  }
});

// ---------- DARK THEME ----------
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
const secretNote = document.getElementById('secretNote');
const gifContainer = document.querySelector('.gif-container');
let darkMode = false;
let gifSecretTaps = 0;
let gifSecretTimer = null;

function setDarkStrokeColor(enabled) {
  const strokeTargets = [
    document.querySelector('h1.name'),
    document.querySelector('.stat .value'),
    document.querySelector('.wish b'),
    document.querySelector('.burst-title'),
    document.querySelector('.cake-title'),
    document.querySelector('.modal-header h2')
  ].filter(Boolean);

  strokeTargets.forEach((el) => {
    el.style.setProperty('-webkit-text-stroke', enabled ? '1.2px #4aa8ff' : '1.2px #000000');
    el.style.setProperty('text-stroke', enabled ? '1.2px #4aa8ff' : '1.2px #000000');
  });
}

function syncCritterBoards() {
  const isDark = document.body.classList.contains('dark-theme');
  document.querySelectorAll('.critter-board').forEach((board) => {
    if (isDark) {
      board.style.background = 'rgba(18, 10, 24, 0.92)';
      board.style.borderColor = 'rgba(255, 185, 218, 0.42)';
      board.style.color = '#4aa8ff';
    } else {
      board.style.background = 'rgba(255, 255, 255, 0.8)';
      board.style.borderColor = 'var(--gold)';
      board.style.color = 'var(--cryo-deep)';
    }
  });
}

themeBtn.addEventListener('click', ()=>{
  darkMode = !darkMode;
  document.body.classList.toggle('dark-theme', darkMode);
  setDarkStrokeColor(darkMode);
  syncCritterBoards();
  themeIcon.textContent = darkMode ? '☀️' : '🌙';
  themeLabel.textContent = darkMode ? 'Light' : 'Dark';
});

function showSecretNote(message) {
  if (!secretNote) return;
  secretNote.textContent = message;
  secretNote.classList.add('show');
  clearTimeout(secretNote._hideTimer);
  secretNote._hideTimer = setTimeout(() => {
    secretNote.classList.remove('show');
  }, 2200);
}

if (gifContainer) {
  gifContainer.addEventListener('click', () => {
    gifSecretTaps += 1;
    clearTimeout(gifSecretTimer);
    gifSecretTimer = setTimeout(() => {
      gifSecretTaps = 0;
    }, 900);

    if (gifSecretTaps >= 3) {
      gifSecretTaps = 0;
      showSecretNote('Secret sparkle unlocked ✨');
      flash();
      burst();
      launchBalloons();
      setTimeout(triggerFinale, 300);
    }
  });
}

// ---------- A MESSAGE FROM ASHFANTASTIC ----------
const surpriseTriggerBtn = document.getElementById('surpriseTriggerBtn');
const wishText = document.getElementById('wishText');
let surpriseCountdownTimer = null;

surpriseTriggerBtn.addEventListener('click', function() {
  if (surpriseCountdownTimer) return;

  let countdown = 3;
  surpriseTriggerBtn.disabled = true;
  surpriseTriggerBtn.textContent = `✨ Countdown ${countdown}... ✨`;

  surpriseCountdownTimer = setInterval(() => {
    countdown -= 1;
    if (countdown > 0) {
      surpriseTriggerBtn.textContent = `✨ Countdown ${countdown}... ✨`;
    } else {
      clearInterval(surpriseCountdownTimer);
      surpriseCountdownTimer = null;
      surpriseTriggerBtn.classList.add('hidden');
      wishText.classList.add('show');
      surpriseTriggerBtn.disabled = false;
      surpriseTriggerBtn.textContent = '✨ A message from AshFantastic ✨';

      launchBalloons();
      burst();
      flash();
      popTitle();
      setTimeout(triggerFinale, 600);
    }
  }, 1000);
});

function burst(){
  const gif = document.querySelector('.gif-container');
  const rect = gif.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  for(let i=0;i<34;i++){
    const p = document.createElement('div');
    const angle = Math.random()*Math.PI*2;
    const dist = 60 + Math.random()*160;
    p.style.position='fixed';
    p.style.left = cx+'px';
    p.style.top = cy+'px';
    p.style.width = p.style.height = (Math.random()*4+2)+'px';
    p.style.borderRadius='50%';
    p.style.background = Math.random()>0.5 ? '#ffe4ed' : '#ffd1dc';
    p.style.boxShadow = '0 0 8px 2px rgba(255,142,181,0.9)';
    p.style.zIndex = 6;
    p.style.pointerEvents='none';
    document.body.appendChild(p);
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist;
    p.animate([
      {transform:'translate(0,0)', opacity:1},
      {transform:`translate(${dx}px, ${dy}px)`, opacity:0}
    ], {duration: 900+Math.random()*500, easing:'cubic-bezier(.2,.6,.3,1)'});
    setTimeout(()=>p.remove(), 1500);
  }
}

function flash(){
  const f = document.createElement('div');
  f.className = 'flash';
  f.style.animation = 'flashPop 900ms ease-out forwards';
  document.body.appendChild(f);
  setTimeout(()=>f.remove(), 950);
}

function popTitle(){
  const t = document.createElement('div');
  t.className = 'burst-title';
  t.textContent = 'HAPPY BIRTHDAY 🎀';
  t.style.animation = 'burstPop 2600ms cubic-bezier(.2,.7,.3,1) forwards';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2700);
}

function triggerFinale(){
  const finale = document.getElementById('surpriseFinale');
  if (!finale) return;
  finale.classList.add('open');
  finale.setAttribute('aria-hidden', 'false');

  const hearts = ['💖', '✨', '🎀', '🌸'];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const char = document.createElement('div');
    const chosen = hearts[i % hearts.length];
    const dx = (Math.random() * 220 - 110).toFixed(1);
    const top = 30 + Math.random() * 45;
    const left = 18 + Math.random() * 64;
    char.className = i % 2 === 0 ? 'finale-heart' : 'finale-sparkle';
    char.textContent = chosen;
    char.style.left = left + 'vw';
    char.style.top = top + 'vh';
    char.style.setProperty('--dx', dx + 'px');
    document.body.appendChild(char);
    setTimeout(() => char.remove(), 1600);
  }

  setTimeout(() => {
    finale.classList.remove('open');
    finale.setAttribute('aria-hidden', 'true');
  }, 2600);
}

function launchBalloons(){
  const colors = [
    'radial-gradient(circle at 32% 28%, #ffe4ed, #ff8eb5 55%, #b34a6e 100%)',
    'radial-gradient(circle at 32% 28%, #fff2cf, #ffd1dc 55%, #c97a92 100%)',
    'radial-gradient(circle at 32% 28%, #ffe4ed, #f8c8d8 55%, #b34a6e 100%)',
    'radial-gradient(circle at 32% 28%, #ffffff, #ffd1dc 55%, #c97a92 100%)'
  ];
  const count = 14;
  for(let i=0;i<count;i++){
    const b = document.createElement('div');
    b.className = 'balloon';
    const left = 4 + Math.random()*92;
    const color = colors[i % colors.length];
    const size = 38 + Math.random()*22;
    const duration = 5200 + Math.random()*2600;
    const delay = Math.random()*700;
    const sway = 20 + Math.random()*40;
    b.style.left = left + 'vw';
    b.style.width = size + 'px';
    b.style.height = (size*1.25) + 'px';
    b.style.background = color;
    b.style.color = color.match(/#[0-9a-fA-F]{6}/g)[1];
    document.body.appendChild(b);

    b.animate([
      { transform:`translate(0px, 0px) rotate(0deg)`, offset:0 },
      { transform:`translate(${sway}px, -45vh) rotate(6deg)`, offset:0.5 },
      { transform:`translate(${-sway}px, -95vh) rotate(-6deg)`, offset:0.9 },
      { transform:`translate(${sway*0.4}px, -115vh) rotate(0deg)`, offset:1 }
    ], { duration, delay, easing:'ease-in-out', fill:'forwards' });

    setTimeout(()=> b.remove(), duration + delay + 100);
  }
}

// ---------- MEMORIES GALLERY ----------
const memoriesBtn = document.getElementById('memoriesBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const galleryGrid = document.getElementById('galleryGrid');
const addTile = document.getElementById('addTile');
const fileInput = document.getElementById('fileInput');
const emptyNote = document.getElementById('emptyNote');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let memories = [
  { url: "images/photos/photos1.jpg" },
  { url: "images/photos/photos2.jpg" },
  { url: "images/photos/photos3.png" },
  { url: "images/photos/photos4.jpg" },
  { url: "images/photos/photos5.jpg" },
  { url: "images/photos/photos6.jpg" }
]; 
let lbIndex = 0;

function openModal(){
  modalOverlay.classList.add('open');
}
function closeModalFn(){
  modalOverlay.classList.remove('open');
}
memoriesBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFn);
modalOverlay.addEventListener('click', (e)=>{
  if(e.target === modalOverlay) closeModalFn();
});

addTile.addEventListener('click', ()=> fileInput.click());

fileInput.addEventListener('change', (e)=>{
  const files = Array.from(e.target.files || []);
  files.forEach(file=>{
    if(!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      memories.push({ url: ev.target.result });
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
  fileInput.value = '';
});

function renderGallery(){
  Array.from(galleryGrid.querySelectorAll('.mem-tile')).forEach(t=>t.remove());

  memories.forEach((m, i)=>{
    const tile = document.createElement('div');
    tile.className = 'mem-tile';
    tile.innerHTML = `<img src="${m.url}" alt="Memory ${i+1}"><div class="remove-x">✕</div>`;
    tile.querySelector('img').addEventListener('click', ()=> openLightbox(i));
    tile.querySelector('.remove-x').addEventListener('click', (e)=>{
      e.stopPropagation();
      memories.splice(i,1);
      renderGallery();
    });
    galleryGrid.insertBefore(tile, addTile);
  });

  emptyNote.style.display = memories.length ? 'none' : 'block';
}

function openLightbox(i){
  if(!memories.length) return;
  lbIndex = i;
  lbImg.src = memories[lbIndex].url;
  lightbox.classList.add('open');
}
function closeLightbox(){
  lightbox.classList.remove('open');
}
function stepLightbox(dir){
  lbIndex = (lbIndex + dir + memories.length) % memories.length;
  lbImg.src = memories[lbIndex].url;
}
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', ()=> stepLightbox(-1));
lbNext.addEventListener('click', ()=> stepLightbox(1));
lightbox.addEventListener('click', (e)=>{
  if(e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e)=>{
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') stepLightbox(-1);
  if(e.key === 'ArrowRight') stepLightbox(1);
});

renderGallery();

// CRITTER PARADE (cat / dog / frog)
function spawnParade(emoji){
  const parade = document.createElement('div');
  parade.className = 'critter-parade';
  parade.innerHTML = `
    <span class="critter-emoji">${emoji}</span>
    <div class="critter-board">🎉 Happy Birthday Ikramoni 🎉</div>
    <span class="critter-emoji critter-right">${emoji}</span>
  `;
  document.body.appendChild(parade);

  const board = parade.querySelector('.critter-board');
  const isDark = document.body.classList.contains('dark-theme');
  if (isDark) {
    board.style.background = 'rgba(18, 10, 24, 0.92)';
    board.style.borderColor = 'rgba(255, 185, 218, 0.42)';
    board.style.color = '#4aa8ff';
  } else {
    board.style.background = 'rgba(255, 255, 255, 0.8)';
    board.style.borderColor = 'var(--gold)';
    board.style.color = 'var(--cryo-deep)';
  }

  parade.addEventListener('animationend', ()=> parade.remove());
}
document.getElementById('catBtn').addEventListener('click', ()=> spawnParade('🐱'));
document.getElementById('dogBtn').addEventListener('click', ()=> spawnParade('🐶'));
document.getElementById('frogBtn').addEventListener('click', ()=> spawnParade('🐸'));

// ---------- CAKE SCREEN ----------
const cakeOpenBtn = document.getElementById('cakeOpenBtn');
const cakeScreen = document.getElementById('cakeScreen');
const cakeClose = document.getElementById('cakeClose');
const candleLayer = document.getElementById('candleLayer');
const addCandleBtn = document.getElementById('addCandleBtn');
const cutCakeBtn = document.getElementById('cutCakeBtn');
const cakeWrap = document.getElementById('cakeWrap');
const cakeMain = document.getElementById('cakeMain');
const cakeHalfLeft = document.getElementById('cakeHalfLeft');
const cakeHalfRight = document.getElementById('cakeHalfRight');
const knife = document.getElementById('knife');
const congratsOverlay = document.getElementById('congratsOverlay');
const cakeHint = document.getElementById('cakeHint');

const candleSlots = ['34%','40%','47%','53%','60%','66%'];
let candleCount = 0;
let cakeCut = false;
let knifeAnim = null;

function resetCakeScreen(){
  candleLayer.innerHTML = '';
  candleCount = 0;
  cakeCut = false;
  addCandleBtn.disabled = false;
  addCandleBtn.innerHTML = '<span class="diamond"></span> Add Candle';
  cutCakeBtn.disabled = false;
  cutCakeBtn.innerHTML = '<span class="diamond"></span> Cut the Cake';
  cakeHint.textContent = 'light the candles, then cut the cake';
  cakeMain.classList.remove('cut');
  cakeHalfLeft.classList.remove('show','split');
  cakeHalfRight.classList.remove('show','split');
  congratsOverlay.classList.remove('show');
  if(knifeAnim){ knifeAnim.cancel(); knifeAnim = null; }
  knife.style.opacity = 0;
  knife.style.transform = 'translate(0,0) rotate(-38deg)';
  if(typeof resetEnvelope === 'function') resetEnvelope();
}

function openCakeScreen(){
  resetCakeScreen();
  cakeScreen.classList.add('open');
}
function closeCakeScreen(){
  cakeScreen.classList.remove('open');
}
cakeOpenBtn.addEventListener('click', openCakeScreen);
cakeClose.addEventListener('click', closeCakeScreen);
cakeScreen.addEventListener('click', (e)=>{
  if(e.target === cakeScreen) closeCakeScreen();
});

addCandleBtn.addEventListener('click', ()=>{
  if(candleCount >= candleSlots.length){ return; }
  const candle = document.createElement('div');
  candle.className = 'candle';
  candle.style.left = candleSlots[candleCount];
  candleLayer.appendChild(candle);
  candleCount++;
  if(candleCount >= candleSlots.length){
    addCandleBtn.disabled = true;
    addCandleBtn.innerHTML = '<span class="diamond"></span> All Lit ✨';
    cakeHint.textContent = 'make a wish, then cut the cake';
  }
});

function animateKnifeCut(){
  const w = cakeWrap.offsetWidth;
  const h = cakeWrap.offsetHeight;
  const frames = [
    { transform:`translate(${0.30*w}px, ${-0.18*h}px) rotate(-38deg)`, opacity:0,   offset:0    },
    { transform:`translate(${0.34*w}px, ${-0.06*h}px) rotate(-38deg)`, opacity:1,   offset:0.15 },
    { transform:`translate(${0.60*w}px, ${0.52*h}px) rotate(-38deg)`,  opacity:1,   offset:0.55 },
    { transform:`translate(${0.82*w}px, ${1.00*h}px) rotate(-38deg)`,  opacity:1,   offset:0.8  },
    { transform:`translate(${0.98*w}px, ${1.18*h}px) rotate(-38deg)`,  opacity:0,   offset:1    }
  ];
  knifeAnim = knife.animate(frames, { duration:850, easing:'ease-in-out', fill:'forwards' });
  return knifeAnim.finished.catch(()=>{});
}

cutCakeBtn.addEventListener('click', ()=>{
  if(cakeCut) return;
  cakeCut = true;
  cutCakeBtn.disabled = true;
  addCandleBtn.disabled = true;
  cakeHint.textContent = 'slicing the cake...';

  animateKnifeCut().then(()=>{
    cakeMain.classList.add('cut');
    cakeHalfLeft.classList.add('show');
    cakeHalfRight.classList.add('show');

    requestAnimationFrame(()=>{
      cakeHalfLeft.classList.add('split');
      cakeHalfRight.classList.add('split');
    });

    setTimeout(()=>{
      congratsOverlay.classList.add('show');
      cakeHint.textContent = 'happy birthday, Ikra!';

      setTimeout(()=>{
        congratsOverlay.classList.remove('show');
        cutCakeBtn.innerHTML = '<span class="diamond"></span> Cake Cut 🎂';

        setTimeout(()=>{
          openEnvelopeOverlay();
        }, 2000);
      }, 2000);
    }, 350);
  });
});

// ---------- ENVELOPE & LETTER ----------
const envelopeOverlay = document.getElementById('envelopeOverlay');
const envelopeClose = document.getElementById('envelopeClose');
const envelopeStage = document.getElementById('envelopeStage');
const envelopeEl = document.getElementById('envelopeEl');
const envelopeHint = document.getElementById('envelopeHint');
const letterCard = document.getElementById('letterCard');
const letterFlipInner = document.getElementById('letterFlipInner');
const letterNavLeft = document.getElementById('letterNavLeft');
const letterNavRight = document.getElementById('letterNavRight');

function resetEnvelope(){
  envelopeOverlay.classList.remove('open');
  envelopeEl.classList.remove('open');
  envelopeStage.classList.remove('hidden');
  letterCard.classList.remove('show');
  letterFlipInner.classList.remove('flipped');
  envelopeHint.textContent = 'tap the envelope';
}

function openEnvelopeOverlay(){
  resetEnvelope();
  envelopeOverlay.classList.add('open');
}
function closeEnvelopeOverlay(){
  envelopeOverlay.classList.remove('open');
}
envelopeClose.addEventListener('click', closeEnvelopeOverlay);
envelopeOverlay.addEventListener('click', (e)=>{
  if(e.target === envelopeOverlay) closeEnvelopeOverlay();
});

envelopeEl.addEventListener('click', ()=>{
  if(envelopeEl.classList.contains('open')) return;
  envelopeEl.classList.add('open');
  envelopeHint.textContent = 'opening...';
  setTimeout(()=>{
    envelopeStage.classList.add('hidden');
    letterCard.classList.add('show');
  }, 550);
});

function flipLetter(){
  letterFlipInner.classList.toggle('flipped');
}
letterNavLeft.addEventListener('click', flipLetter);
letterNavRight.addEventListener('click', flipLetter);

let letterTouchStartX = null;
let letterTouchStartY = null;
letterCard.addEventListener('touchstart', (e)=>{
  letterTouchStartX = e.touches[0].clientX;
  letterTouchStartY = e.touches[0].clientY;
}, {passive:true});
letterCard.addEventListener('touchend', (e)=>{
  if(letterTouchStartX === null) return;
  const dx = e.changedTouches[0].clientX - letterTouchStartX;
  const dy = e.changedTouches[0].clientY - letterTouchStartY;
  if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
    flipLetter();
  }
  letterTouchStartX = null;
  letterTouchStartY = null;
});

// ========== SHOOTING ARROW GAME ==========
const gameOverlay = document.getElementById('gameOverlay');
const gameBtn = document.getElementById('gameBtn');
const gameClose = document.getElementById('gameClose');
const gameCanvas = document.getElementById('gameCanvas');
const gameScore = document.getElementById('gameScore');
const gameArrows = document.getElementById('gameArrows');
const prizeOverlay = document.getElementById('prizeOverlay');
const prizeQuestion = document.getElementById('prizeQuestion');
const prizeOptions = document.getElementById('prizeOptions');
const prizePromptImage = document.getElementById('prizePromptImage');
const prizeResult = document.getElementById('prizeResult');
const resultImage = document.getElementById('resultImage');
const resultLabel = document.getElementById('resultLabel');
const prizeYes = document.getElementById('prizeYes');
const prizeNo = document.getElementById('prizeNo');
const prizeResultClose = document.getElementById('prizeResultClose');
const oneLastOverlay = document.getElementById('oneLastOverlay');
const giftBoxBtn = document.getElementById('giftBoxBtn');
const finalSurpriseOverlay = document.getElementById('finalSurpriseOverlay');
const finalSurpriseReplay = document.getElementById('finalSurpriseReplay');

let gameRunning = false;
let gameAnimId = null;
let arrows = [];
let targets = [];
let score = 0;
let arrowCount = 10;
let gameOver = false;
let targetSpawnTimer = null;

function resizeGameCanvas() {
  const rect = gameCanvas.parentElement.getBoundingClientRect();
  gameCanvas.width = rect.width;
  gameCanvas.height = rect.height;
}

function openGame() {
  resetGame();
  gameOverlay.classList.add('open');
  resizeGameCanvas();
  setTimeout(() => {
    gameRunning = true;
    gameLoop();
    spawnTargets();
  }, 300);
}

function closeGame() {
  gameOverlay.classList.remove('open');
  gameRunning = false;
  if (gameAnimId) cancelAnimationFrame(gameAnimId);
  if (targetSpawnTimer) clearInterval(targetSpawnTimer);
}

gameBtn.addEventListener('click', openGame);
gameClose.addEventListener('click', closeGame);
gameOverlay.addEventListener('click', (e) => {
  if (e.target === gameOverlay) closeGame();
});

function resetGame() {
  arrows = [];
  targets = [];
  score = 0;
  arrowCount = 10;
  gameOver = false;
  gameScore.textContent = '0';
  gameArrows.textContent = '10';
  if (gameAnimId) cancelAnimationFrame(gameAnimId);
  if (targetSpawnTimer) clearInterval(targetSpawnTimer);
  const ctx = gameCanvas.getContext('2d');
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function spawnTargets() {
  if (targetSpawnTimer) clearInterval(targetSpawnTimer);
  targetSpawnTimer = setInterval(() => {
    if (!gameRunning || gameOver || arrowCount <= 0) return;
    const ctx = gameCanvas.getContext('2d');
    const x = 30 + Math.random() * (gameCanvas.width - 60);
    const y = 40 + Math.random() * (gameCanvas.height - 80);
    const radius = 22 + Math.random() * 14;
    const speed = 0.4 + Math.random() * 0.6;
    const dir = Math.random() > 0.5 ? 1 : -1;
    targets.push({
      x, y, radius,
      vx: speed * dir * 0.5,
      vy: (Math.random() - 0.5) * 0.4,
      color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`
    });
  }, 800);
}

gameCanvas.addEventListener('click', (e) => {
  if (!gameRunning || gameOver || arrowCount <= 0) return;
  const rect = gameCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  shootArrow(mx, my);
});

gameCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameRunning || gameOver || arrowCount <= 0) return;
  const rect = gameCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const mx = touch.clientX - rect.left;
  const my = touch.clientY - rect.top;
  shootArrow(mx, my);
}, { passive: false });

function shootArrow(mx, my) {
  if (arrowCount <= 0) return;
  arrowCount--;
  gameArrows.textContent = arrowCount;
  
  const startX = gameCanvas.width / 2;
  const startY = gameCanvas.height - 20;
  const dx = mx - startX;
  const dy = my - startY;
  const angle = Math.atan2(dy, dx);
  const speed = 6 + Math.random() * 2;
  
  arrows.push({
    x: startX,
    y: startY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    angle: angle,
    trail: []
  });
  
  if (arrowCount === 0 && !gameOver) {
    setTimeout(() => endGame(), 600);
  }
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  gameRunning = false;
  if (targetSpawnTimer) clearInterval(targetSpawnTimer);
  gameScore.textContent = score;
  
  setTimeout(() => {
    closeGame();
    setTimeout(() => {
      openPrizeBox();
    }, 400);
  }, 1000);
}

function gameLoop() {
  if (!gameRunning) return;
  const ctx = gameCanvas.getContext('2d');
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  targets.forEach(t => {
    t.x += t.vx;
    t.y += t.vy;
    if (t.x - t.radius < 0 || t.x + t.radius > gameCanvas.width) t.vx *= -1;
    if (t.y - t.radius < 20 || t.y + t.radius > gameCanvas.height - 10) t.vy *= -1;
    
    ctx.shadowColor = t.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fillStyle = t.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * 0.75, 0, Math.PI * 2);
    ctx.stroke();
  });
  
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];
    a.x += a.vx;
    a.y += a.vy;
    a.vx *= 0.99;
    a.vy *= 0.99;
    
    let hit = false;
    for (let j = targets.length - 1; j >= 0; j--) {
      const t = targets[j];
      const dx = a.x - t.x;
      const dy = a.y - t.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < t.radius + 6) {
        score++;
        gameScore.textContent = score;
        targets.splice(j, 1);
        hit = true;
        break;
      }
    }
    
    if (hit) {
      arrows.splice(i, 1);
      continue;
    }
    
    if (a.x < -20 || a.x > gameCanvas.width + 20 ||
        a.y < -20 || a.y > gameCanvas.height + 20 ||
        (Math.abs(a.vx) < 0.1 && Math.abs(a.vy) < 0.1)) {
      arrows.splice(i, 1);
      continue;
    }
    
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.angle);
    
    ctx.shadowColor = 'rgba(255,142,181,0.6)';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#ffe4ed';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-18, 0);
    ctx.stroke();
    
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ff8eb5';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, -5);
    ctx.lineTo(-8, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-24, -4);
    ctx.lineTo(-24, 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
    ctx.shadowBlur = 0;
  }
  
  if (arrowCount > 0) {
    ctx.fillStyle = 'rgba(255,142,181,0.2)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏹 ${arrowCount} arrows left`, gameCanvas.width/2, 24);
  }
  
  if (!gameOver || arrows.length > 0 || targets.length > 0) {
    gameAnimId = requestAnimationFrame(gameLoop);
  }
}

// ========== PRIZE BOX ==========
function openPrizeBox() {
  prizeOptions.style.display = 'flex';
  prizePromptImage.style.display = 'block';
  prizeResult.classList.remove('show');
  prizeResult.style.display = 'none';
  prizeQuestion.textContent = 'Will you marry me?';
  prizeOverlay.classList.add('open');
}

function closePrizeBox() {
  prizeOverlay.classList.remove('open');
  oneLastOverlay.classList.add('open');
  oneLastOverlay.setAttribute('aria-hidden', 'false');
}

function handlePrizeAnswer(answer) {
  prizeOptions.style.display = 'none';
  prizePromptImage.style.display = 'none';
  prizeResult.style.display = 'flex';
  
  if (answer === 'yes') {
    resultLabel.textContent = '💍 YES! 💍';
    resultImage.src = 'images/photos/eyesopen.jpg';
    resultImage.alt = 'Eyes open';
    prizeQuestion.textContent = '❤️ কামের বুয়া বানাইয়া রাখমু তোরে 😁 ❤️';
  } else {
    resultLabel.textContent = '😜 Maybe next time...';
    resultImage.src = 'images/photos/tongueout.jpg';
    resultImage.alt = 'Tongue out';
    prizeQuestion.textContent = 'শয়তান বেডি একটা 😒!';
  }
  
  setTimeout(() => {
    prizeResult.classList.add('show');
  }, 100);
}

prizeYes.addEventListener('click', () => handlePrizeAnswer('yes'));
prizeNo.addEventListener('click', () => handlePrizeAnswer('no'));
prizeResultClose.addEventListener('click', closePrizeBox);
prizeOverlay.addEventListener('click', (e) => {
  if (e.target === prizeOverlay) closePrizeBox();
});

giftBoxBtn.addEventListener('click', () => {
  oneLastOverlay.classList.remove('open');
  oneLastOverlay.setAttribute('aria-hidden', 'true');
  finalSurpriseOverlay.classList.add('open');
  finalSurpriseOverlay.setAttribute('aria-hidden', 'false');
});

finalSurpriseReplay.addEventListener('click', () => {
  finalSurpriseOverlay.classList.remove('open');
  finalSurpriseOverlay.setAttribute('aria-hidden', 'true');
});

finalSurpriseOverlay.addEventListener('click', (e) => {
  if (e.target === finalSurpriseOverlay) {
    finalSurpriseOverlay.classList.remove('open');
    finalSurpriseOverlay.setAttribute('aria-hidden', 'true');
  }
});

window.addEventListener('resize', () => {
  if (gameOverlay.classList.contains('open')) {
    resizeGameCanvas();
  }
});

document.getElementById('gameBtn').style.opacity = '0';
document.getElementById('gameBtn').style.animation = 'fadeIn 1s ease 1.9s forwards';
document.getElementById('themeBtn').style.opacity = '0';
document.getElementById('themeBtn').style.animation = 'fadeIn 1s ease 1.9s forwards';
