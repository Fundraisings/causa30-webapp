// CICLO AUTOMÁTICO DE 30 DÍAS — nunca hay que tocar esto a mano otra vez
const REFERENCE_START = new Date('2026-09-01T00:00:00'); // fecha del primer ciclo oficial
const CYCLE_MS = 30 * 24 * 60 * 60 * 1000;

function getCurrentCycleEnd(){
  const now = new Date();
  let elapsed = now - REFERENCE_START;
  if(elapsed < 0) elapsed = 0;
  const cyclesPassed = Math.floor(elapsed / CYCLE_MS);
  return new Date(REFERENCE_START.getTime() + (cyclesPassed + 1) * CYCLE_MS - 60000);
}
const CAMPAIGN_END = getCurrentCycleEnd();

function getDaysRemainingText(){
  const now = new Date();
  let diff = CAMPAIGN_END - now;
  if(diff < 0) diff = 0;
  const days = Math.ceil(diff / (1000*60*60*24));
  return `${days} día${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`;
}

// COVER DE BIENVENIDA — pantalla completa, una vez por sesión (distinto del pop-up de anuncios)
const welcomeCover = document.getElementById('welcomeCover');
const WELCOME_KEY = 'causa30_welcome_seen';
let welcomeFlowActive = false;

function finishWelcomeCover(){
  welcomeCover.classList.add('closing');
  sessionStorage.setItem(WELCOME_KEY, 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    welcomeCover.classList.add('hidden');
  }, 700);
}

if(sessionStorage.getItem(WELCOME_KEY)){
  welcomeCover.classList.add('hidden');
} else {
  document.body.style.overflow = 'hidden';
  document.getElementById('wcCta').addEventListener('click', () => {
    welcomeFlowActive = true;
    openVideoLightbox(YOUTUBE_VIDEO_ID);
  });
}

// PWA — registra el service worker para que la app sea instalable
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpavpkp';

const products = [
  {biz:"Empresa X · Chocolate", name:"Chocolate X · Dark, Coco & Jengibre", price:"RD$ 250", aporte:"RD$ 15 por compra", img:"images/producto-chocolate.png",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"212", donacion:"RD$3,180",
   detail:"Adquiere este producto en <b>Empresa X</b> por RD$250. Al hacerlo, desbloqueas automáticamente un impacto de <b>RD$15</b>."},
  {biz:"Empresa X · Alimento para Mascotas", name:"Alimento para Perros X", price:"RD$ 320", aporte:"RD$ 25 por compra", img:"images/producto-petfood.png",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"157", donacion:"RD$3,925",
   detail:"Adquiere este producto en <b>Empresa X</b> por RD$320. Al hacerlo, desbloqueas automáticamente un impacto de <b>RD$25</b>."},
  {biz:"Supermercados La Sirena", name:"Combo Solidario · 4 Botellas de Agua", price:"RD$ 100", aporte:"RD$ 10 por compra", img:"images/producto-agua.png",
   address:"Supermercados La Sirena — Sucursal [NOMBRE DE LA SUCURSAL ACTIVA ESTA SEMANA]", hours:"Horario pendiente de confirmar",
   compras:"98", donacion:"RD$980",
   detail:"Adquiere este producto en <b>Supermercados La Sirena — Sucursal [NOMBRE DE LA SUCURSAL ACTIVA ESTA SEMANA]</b> por RD$100 (combo solidario, 4 botellas). Al hacerlo, desbloqueas automáticamente un impacto de <b>RD$10</b>."},
];
let active = 0;
const carousel = document.getElementById('carousel');
const dotsWrap = document.getElementById('dots');

function updateResults(){
  const p = products[active];
  document.getElementById('resBiz').textContent = p.biz;
  document.getElementById('resProd').textContent = p.name;
  document.getElementById('resAporte').textContent = p.aporte;
  document.getElementById('resCompras').textContent = p.compras;
  document.getElementById('resDonacion').textContent = p.donacion;
}

function render(){
  carousel.innerHTML = '';
  dotsWrap.innerHTML = '';
  products.forEach((p, i) => {
    const card = document.createElement('div');
    const diff = (i - active + products.length) % products.length;
    let posClass = 'hidden';
    if(diff === 0) posClass = 'center';
    else if(diff === 1) posClass = 'right';
    else if(diff === products.length - 1) posClass = 'left';
    card.className = 'p-card ' + posClass;
    card.innerHTML = `
      <div class="p-card-inner">
        <div class="art" style="background-image:url('${p.img}')"><span class="badge">${getDaysRemainingText()}</span></div>
        <div class="info">
          <div class="biz">${p.biz}</div>
          <div class="name">${p.name}</div>
          <div class="price-row"><span class="price">${p.price}</span><span class="aporte">Aporte: ${p.aporte}</span></div>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      if(justDragged){ justDragged = false; return; }
      if(i === active){
        openDetail(p);
      } else {
        active = i;
        render();
        resetAutoplay();
      }
    });
    carousel.appendChild(card);
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === active ? ' active' : '');
    dotsWrap.appendChild(dot);
  });
  updateResults();
}
render();

let autoplayTimer;
function startAutoplay(){
  autoplayTimer = setInterval(() => {
    active = (active + 1) % products.length;
    render();
  }, 4500);
}
function resetAutoplay(){
  clearInterval(autoplayTimer);
  startAutoplay();
}
startAutoplay();

// DESLIZAR CON EL DEDO (o mouse en escritorio)
let dragStartX = null, dragDeltaX = 0, isDragging = false, justDragged = false;
const DRAG_THRESHOLD = 40;

carousel.addEventListener('pointerdown', (e) => {
  isDragging = true;
  dragStartX = e.clientX;
  dragDeltaX = 0;
  clearInterval(autoplayTimer);
});
carousel.addEventListener('pointermove', (e) => {
  if(!isDragging) return;
  dragDeltaX = e.clientX - dragStartX;
});
carousel.addEventListener('pointerup', () => {
  if(!isDragging) return;
  isDragging = false;
  if(Math.abs(dragDeltaX) > DRAG_THRESHOLD){
    active = dragDeltaX < 0
      ? (active + 1) % products.length
      : (active - 1 + products.length) % products.length;
    render();
    justDragged = true;
  }
  dragStartX = null;
  dragDeltaX = 0;
  startAutoplay();
});
carousel.addEventListener('pointerleave', () => {
  if(isDragging){ isDragging = false; startAutoplay(); }
});

// ¿CÓMO FUNCIONA? — cinta animada nativa (sin imágenes), fusionada con el acceso al video
const flowSteps = [
  {num:"01", title:"Descubre", desc:"Encuentra productos y promociones que te interesan."},
  {num:"02", title:"Elige", desc:"Compra directamente con la empresa que ofrece la promoción."},
  {num:"03", title:"Genera impacto", desc:"Tu compra activa una acción que beneficia a una causa."},
  {num:"04", title:"Transparencia", desc:"El dinero no pasa por Causa30. La empresa realiza directamente el aporte a la causa.", final:true},
];

const flowTrack = document.getElementById('flowTrack');
function renderFlowStep(s){
  return `
    <div class="flow-step">
      <div class="flow-node${s.final ? ' final' : ''}"><span>${s.num}</span></div>
      <div>
        <div class="flow-title">${s.title}</div>
        <div class="flow-desc">${s.desc}</div>
      </div>
    </div>
    <div class="flow-connector"></div>`;
}
// se duplica la secuencia completa para que el loop sea perfectamente continuo
flowTrack.innerHTML = flowSteps.map(renderFlowStep).join('') + flowSteps.map(renderFlowStep).join('');

const tickerWrap = document.getElementById('tickerWrap');
const funcionaHide = document.getElementById('funcionaHide');
const funcionaShowAgain = document.getElementById('funcionaShowAgain');
const tickerPause = document.getElementById('tickerPause');

funcionaHide.addEventListener('click', () => {
  tickerWrap.classList.remove('open');
  funcionaShowAgain.classList.add('visible');
});
funcionaShowAgain.addEventListener('click', () => {
  tickerWrap.classList.add('open');
  funcionaShowAgain.classList.remove('visible');
});
tickerPause.addEventListener('click', () => {
  const paused = flowTrack.classList.toggle('paused');
  tickerPause.textContent = paused ? '▶ Continuar' : '⏸ Pausar';
});
// pausa mientras el usuario toca la cinta para leer con calma, y sigue al soltar
flowTrack.addEventListener('pointerdown', () => flowTrack.classList.add('paused'));
flowTrack.addEventListener('pointerup', () => {
  if(tickerPause.textContent.includes('Continuar')) return; // respeta si el usuario la pausó a propósito
  flowTrack.classList.remove('paused');
});

// MASCOTAS
const pets = [
  {name:"Lobo", meta:"3 años · Macho · Pequeño", desc:"Cariñoso y juguetón, disfruta del contacto humano.",
   story:"Lobo llegó a la fundación hace un año, después de vivir mucho tiempo en la calle. Al principio era desconfiado, pero hoy es de los más juguetones del refugio. Le encanta correr y busca compañía humana constantemente.",
   img:"images/lobo.jpg", phone:"18098845044"},
  {name:"Shakira", meta:"2 años · Hembra · Pequeño", desc:"Tranquila, de mirada dulce.",
   story:"Shakira fue rescatada junto a su camada cuando apenas tenía semanas de nacida. Es tranquila y observadora, y se acerca despacio hasta ganar confianza — una vez la gana, no se separa de tu lado.",
   img:"images/shakira.jpg", phone:"18098845044"},
  {name:"Fi", meta:"4 años · Macho · Grande", desc:"Noble y atento, ideal para espacios con patio.",
   story:"Fi es el más veterano del grupo. Pasó varios años en la calle antes de llegar a la fundación, y a pesar de todo, es un perro noble y agradecido. Se lleva bien con otros animales y adora los espacios abiertos.",
   img:"images/fi.jpg", phone:"18098845044"},
];
const petScroll = document.getElementById('petScroll');
pets.forEach((p, idx) => {
  const card = document.createElement('div');
  card.className = 'pet-card';
  const phoneDisplay = p.phone.replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
  card.innerHTML = `
    <div class="flip-scene" data-flipped="false">
      <div class="flip-inner">
        <div class="flip-front"><img src="${p.img}" alt="${p.name}"></div>
        <div class="flip-back"><p>${p.story}</p></div>
      </div>
    </div>
    <div class="pet-info">
      <div class="pname">${p.name} <span class="tap-hint">(toca la foto)</span></div>
      <div class="pmeta">${p.meta} · Disponible</div>
      <div class="pdesc">${p.desc}</div>
      <div class="pet-actions">
        <div class="adopt-flip" data-flipped="false">
          <div class="adopt-flip-inner">
            <button class="adopt-front">Clic aquí para conocer más →</button>
            <a class="adopt-back" href="tel:+${p.phone}">📞 ${phoneDisplay}</a>
          </div>
        </div>
        <button class="share">Clic aquí para compartir con tus amigos →</button>
      </div>
    </div>`;

  const scene = card.querySelector('.flip-scene');
  scene.addEventListener('click', () => {
    const flipped = scene.getAttribute('data-flipped') === 'true';
    scene.setAttribute('data-flipped', String(!flipped));
    scene.classList.toggle('flipped');
  });

  const adoptFlip = card.querySelector('.adopt-flip');
  adoptFlip.querySelector('.adopt-front').addEventListener('click', () => {
    adoptFlip.classList.add('flipped');
  });

  card.querySelector('.share').addEventListener('click', () => {
    const shareText = `Conoce a ${p.name} 🐾 está buscando un hogar. Descúbrelo en Causa30:`;
    const shareUrl = window.location.origin + window.location.pathname;
    if(navigator.share){
      navigator.share({ title: 'Causa30', text: shareText, url: shareUrl }).catch(()=>{});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      window.open(waUrl, '_blank');
    }
  });

  petScroll.appendChild(card);
});

// MODALS
function openModal(el){ el.classList.add('open'); }
function closeModal(el){ el.classList.remove('open'); }

const causeModal = document.getElementById('causeModal');
const whereModal = document.getElementById('whereModal');
const progressModal = document.getElementById('progressModal');
document.getElementById('causeChip').addEventListener('click', () => openModal(causeModal));
document.getElementById('receiptBtn').addEventListener('click', () => openModal(progressModal));

// Dentro del modal "campaña en marcha" — tocar la foto voltea y muestra los datos
const progressFlip = document.getElementById('progressFlip');
document.getElementById('progressArt').addEventListener('click', () => {
  progressFlip.classList.toggle('flipped');
});
document.getElementById('progressBack').addEventListener('click', () => {
  progressFlip.classList.remove('flipped');
});

progressModal.addEventListener('click', (e) => { if(e.target === progressModal) closeModal(progressModal); });
progressModal.querySelector('.btn-ghost').addEventListener('click', () => {
  closeModal(progressModal);
  carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function updateCountdown(){
  const now = new Date();
  let diff = CAMPAIGN_END - now;
  if(diff < 0) diff = 0;

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  setCdValue('cdDays', days);
  setCdValue('cdHours', hours);
  setCdValue('cdMins', mins);
  setCdValue('cdSecs', secs);

  setCdValue('cdDays2', days);
  setCdValue('cdHours2', hours);
  setCdValue('cdMins2', mins);
  setCdValue('cdSecs2', secs);
}

function setCdValue(id, value){
  const el = document.getElementById(id);
  const padded = String(value).padStart(2, '0');
  if(el.textContent !== padded){
    el.textContent = padded;
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 200);
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

function openDetail(p){
  document.getElementById('detailPhoto').style.backgroundImage = `url('${p.img}')`;
  document.getElementById('whereTitle').textContent = p.name;
  document.getElementById('detailPrice').textContent = p.price;
  document.getElementById('detailAporte').textContent = 'Tu impacto directo: ' + p.aporte;
  document.getElementById('storyCause').textContent = p.fundacion || 'Fundación De Blanck';
  document.getElementById('whereBody').innerHTML = p.detail
    ? `<p style="font-size:12.5px;color:var(--ink);line-height:1.6;">${p.detail}</p>`
    : '';

  // Reinicia y dispara la mini-historia (fade + slide-up escalonado)
  const label = document.getElementById('storyLabel');
  const cause = document.getElementById('storyCause');
  label.classList.remove('show');
  cause.classList.remove('show');
  void label.offsetWidth; // fuerza reflow para que la transición se repita cada vez
  setTimeout(() => label.classList.add('show'), 200);
  setTimeout(() => cause.classList.add('show'), 450);

  openModal(whereModal);
}

// DESLIZAR DENTRO DE LA FICHA AMPLIADA — cambia de producto sin cerrar el modal
const detailPhoto = document.getElementById('detailPhoto');
let detailDragStartX = null, detailDragDeltaX = 0, detailDragging = false;
const DETAIL_DRAG_THRESHOLD = 50;

detailPhoto.addEventListener('pointerdown', (e) => {
  detailDragging = true;
  detailDragStartX = e.clientX;
  detailDragDeltaX = 0;
});
detailPhoto.addEventListener('pointermove', (e) => {
  if(!detailDragging) return;
  detailDragDeltaX = e.clientX - detailDragStartX;
});
detailPhoto.addEventListener('pointerup', () => {
  if(!detailDragging) return;
  detailDragging = false;
  if(Math.abs(detailDragDeltaX) > DETAIL_DRAG_THRESHOLD){
    active = detailDragDeltaX < 0
      ? (active + 1) % products.length
      : (active - 1 + products.length) % products.length;
    render();
    openDetail(products[active]);
  }
  detailDragStartX = null;
  detailDragDeltaX = 0;
});
detailPhoto.addEventListener('pointerleave', () => {
  detailDragging = false;
});

// VIDEO — lightbox reutilizable con YouTube, a pantalla completa
// Cada botón con class="video-trigger" puede tener su propio data-yt-id en el HTML (intro, patrocinador, cómo funciona, Objetivo 90).
// Si no tiene data-yt-id, usa este video por defecto:
const YOUTUBE_VIDEO_ID = 'SOEV44XM6cs';

const videoLightbox = document.getElementById('videoLightbox');
const ytFrameWrap = document.getElementById('ytFrameWrap');

function openVideoLightbox(videoId){
  videoLightbox.classList.add('open');
  ytFrameWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0" title="Causa30" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}
function closeVideoLightbox(){
  videoLightbox.classList.remove('open');
  ytFrameWrap.innerHTML = ''; // vaciar el iframe detiene la reproducción
  if(welcomeFlowActive){
    welcomeFlowActive = false;
    finishWelcomeCover();
  }
}

document.querySelectorAll('.video-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    openVideoLightbox(btn.dataset.ytId || YOUTUBE_VIDEO_ID);
  });
});

document.getElementById('videoLightboxClose').addEventListener('click', closeVideoLightbox);
document.getElementById('videoLightboxSkip').addEventListener('click', closeVideoLightbox);
videoLightbox.addEventListener('click', (e) => {
  if(e.target === videoLightbox) closeVideoLightbox();
});

document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-overlay')));
});
[causeModal, whereModal].forEach(m=>{
  m.addEventListener('click', (e)=>{ if(e.target === m) closeModal(m); });
});

// FORMULARIOS: Sugerir causa + Sumar mi empresa
const suggestModal = document.getElementById('suggestModal');
const bizModal = document.getElementById('bizModal');

document.getElementById('openSuggestForm').addEventListener('click', () => {
  document.getElementById('suggestForm').style.display = 'flex';
  document.getElementById('suggestSuccess').classList.remove('show');
  openModal(suggestModal);
});
document.getElementById('openBizForm').addEventListener('click', () => {
  document.getElementById('bizForm').style.display = 'flex';
  document.getElementById('bizSuccess').classList.remove('show');
  openModal(bizModal);
});
[suggestModal, bizModal].forEach(m => {
  m.addEventListener('click', (e) => { if(e.target === m) closeModal(m); });
});

document.getElementById('suggestForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const producto = e.target.producto.value;

  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ tipo: 'Sugerencia de causa', producto })
    });
  } catch (err) {
    console.error('Error enviando sugerencia:', err);
  }

  e.target.style.display = 'none';
  document.getElementById('suggestSuccess').classList.add('show');
});

document.getElementById('bizForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    tipo: 'Solicitud de empresa',
    empresa: e.target.empresa.value,
    producto: e.target.producto.value,
    contacto: e.target.contacto.value
  };

  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Error enviando solicitud:', err);
  }

  e.target.style.display = 'none';
  document.getElementById('bizSuccess').classList.add('show');
});

// LIBRO DEL MES — toggle que revela la portada; tocar la portada voltea a "dónde comprarlo"
// ✏️ EDITAR CADA MES: fundación y las 4 librerías donde se vende el libro
const libroDelMes = {
  fundacion: "Happy Animal Rescue RD",
  descripcion: "Dedicada al rescate, rehabilitación y adopción de animales callejeros.",
  link: "https://www.instagram.com/happyanimalsrescuerd/",
  librerias: [
    {nombre:"Librería 1", direccion:"Dirección pendiente de confirmar", telefono:"Teléfono pendiente de confirmar"},
    {nombre:"Librería 2", direccion:"Dirección pendiente de confirmar", telefono:"Teléfono pendiente de confirmar"},
    {nombre:"Librería 3", direccion:"Dirección pendiente de confirmar", telefono:"Teléfono pendiente de confirmar"},
    {nombre:"Librería 4", direccion:"Dirección pendiente de confirmar", telefono:"Teléfono pendiente de confirmar"},
  ]
};
document.getElementById('libroFundName').textContent = libroDelMes.fundacion;
document.getElementById('libroFundDesc').textContent = libroDelMes.descripcion;
document.getElementById('libroFundLink').href = libroDelMes.link;

document.getElementById('libroWhereList').innerHTML = libroDelMes.librerias.map((l, i) => `
  ${i > 0 ? '<div class="libro-store-divider"></div>' : ''}
  <div class="libro-store">
    <div class="libro-store-name">✦ ${l.nombre}</div>
    <div class="libro-store-detail">Dirección: ${l.direccion}</div>
    <div class="libro-store-detail">Teléfono: ${l.telefono}</div>
  </div>
`).join('');

const libroReveal = document.getElementById('libroReveal');
const libroToggleText = document.getElementById('libroToggleText');
const libroToggleIcon = document.getElementById('libroToggleIcon');
document.getElementById('libroToggle').addEventListener('click', () => {
  const isOpen = libroReveal.classList.toggle('open');
  libroToggleText.textContent = isOpen ? 'Libro descubierto' : '✦ Ver libro y apoyar';
  libroToggleIcon.textContent = isOpen ? '✓' : '↓';
});

const libroFlip = document.getElementById('libroFlip');
libroFlip.addEventListener('click', () => {
  libroFlip.classList.toggle('flipped');
});

// COMPARTIR PROMOCIÓN — componente reutilizable, funciona para cualquier producto abierto en la ficha
const shareAnimOverlay = document.getElementById('shareAnimOverlay');
const shareAnimProduct = document.getElementById('shareAnimProduct');
const productEmojis = { "Chocolate X · Dark, Coco & Jengibre":"🍫", "Alimento para Perros X":"🐾", "Combo Solidario · 4 Botellas de Agua":"💧" };

function shareProductViaWhatsApp(product){
  const shareUrl = window.location.origin + window.location.pathname;
  const message = `Encontré esta promoción en Causa30. ❤️\n\nCreo que este producto podría interesarte. Además, al elegirlo también apoyas una causa.\n\n${product.name}\n\nTu compra tiene doble propósito.\n\nMira la promoción aquí:\n${shareUrl}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  if(prefersReducedMotion){
    window.open(waUrl, '_blank');
    return;
  }

  shareAnimProduct.textContent = productEmojis[product.name] || '🛍️';
  shareAnimOverlay.classList.add('active');
  setTimeout(() => {
    shareAnimOverlay.classList.remove('active');
    window.open(waUrl, '_blank');
  }, 900);
}

document.getElementById('sharePromoBtn').addEventListener('click', () => {
  shareProductViaWhatsApp(products[active]);
});

// PROMO DE BIENVENIDA — reaparece cada X días (no solo una vez para siempre)
const ads = [
  {title:"❤️ Esta promoción también genera impacto", text:"Al elegirla, tu compra tiene doble valor....", img:"images/ad1a.png"},
  {title:"✨ Espacio publicitario disponible", text:"Combina tu promoción con causa social — visibilidad y buena reputación de marca.", img:"images/ad2.png"},
  {title:"🍦 Espacio publicitario disponible", text:"Anúnciate en Causa30 y llega a personas que prefieren marcas con impacto.", img:"images/ad3.png"},
];

const promoModal = document.getElementById('promoModal');
const PROMO_KEY = 'causa30_promo_last_shown';
const PROMO_REPEAT_DAYS = 3; // ✏️ cada cuántos días puede volver a aparecer

const lastShown = localStorage.getItem(PROMO_KEY);
const daysSinceShown = lastShown ? (Date.now() - Number(lastShown)) / (1000*60*60*24) : Infinity;

if(daysSinceShown >= PROMO_REPEAT_DAYS){
  setTimeout(() => {
    const pick = ads[Math.floor(Math.random() * ads.length)];
    document.getElementById('promoArt').style.backgroundImage = `url('${pick.img}')`;
    document.getElementById('promoTitle').textContent = pick.title;
    document.getElementById('promoText').textContent = pick.text;
    openModal(promoModal);
  }, 800);
}
promoModal.addEventListener('click', (e) => {
  if(e.target === promoModal) {
    closeModal(promoModal);
    localStorage.setItem(PROMO_KEY, String(Date.now()));
  }
});
promoModal.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(promoModal);
    localStorage.setItem(PROMO_KEY, String(Date.now()));
  });
});

// GALERÍA DE PROMOCIONES — navegable, se abre al tocar la imagen que rota en "Descubre más"
const adsModal = document.getElementById('adsModal');
let adsIndex = 0;

function renderAds(){
  const ad = ads[adsIndex];
  document.getElementById('adsArt').style.backgroundImage = `url('${ad.img}')`;
  document.getElementById('adsTitle').textContent = ad.title;
  document.getElementById('adsText').textContent = ad.text;
  const dotsWrap2 = document.getElementById('adsDots');
  dotsWrap2.innerHTML = '';
  ads.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === adsIndex ? ' active' : '');
    dotsWrap2.appendChild(d);
  });
}

document.getElementById('adInviteLink').addEventListener('click', () => {
  document.getElementById('bizForm').style.display = 'flex';
  document.getElementById('bizSuccess').classList.remove('show');
  openModal(bizModal);
});
document.getElementById('adsPrev').addEventListener('click', () => {
  adsIndex = (adsIndex - 1 + ads.length) % ads.length;
  renderAds();
});
document.getElementById('adsNext').addEventListener('click', () => {
  adsIndex = (adsIndex + 1) % ads.length;
  renderAds();
});
document.getElementById('adsGo').addEventListener('click', () => {
  closeModal(adsModal);
  document.getElementById('bizForm').style.display = 'flex';
  document.getElementById('bizSuccess').classList.remove('show');
  openModal(bizModal);
});
adsModal.addEventListener('click', (e) => { if(e.target === adsModal) closeModal(adsModal); });

// DESCUBRE MÁS — texto rotativo + las 3 imágenes de anuncio VISIBLES, rotando solas cada 4s, con texto sincronizado debajo
const discoverPhrases = ["una nueva marca.", "una oferta diferente.", "algo que necesitas.", "una compra con doble propósito."];
const discoverDynamic = document.getElementById('discoverDynamic');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let discoverIndex = 0;
let discoverTimer = null;

function cycleDiscoverPhrase(){
  discoverDynamic.classList.add('fade-out');
  setTimeout(() => {
    discoverIndex = (discoverIndex + 1) % discoverPhrases.length;
    discoverDynamic.textContent = discoverPhrases[discoverIndex];
    discoverDynamic.classList.remove('fade-out');
    discoverDynamic.classList.add('fade-in-start');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => discoverDynamic.classList.remove('fade-in-start'));
    });
  }, 350);
}

if(!prefersReducedMotion && discoverDynamic){
  const discoverObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        if(!discoverTimer) discoverTimer = setInterval(cycleDiscoverPhrase, 2200);
      } else {
        clearInterval(discoverTimer);
        discoverTimer = null;
      }
    });
  }, { threshold: 0.3 });
  discoverObserver.observe(document.getElementById('adsTrigger'));
}

// Imágenes de anuncios visibles, rotando solas (reutiliza el mismo array "ads" de arriba)
const adSlideImgs = [
  document.getElementById('adSlideImg0'),
  document.getElementById('adSlideImg1'),
  document.getElementById('adSlideImg2')
];
const adCaptionTitleMain = document.getElementById('adCaptionTitle');
const adCaptionTextMain = document.getElementById('adCaptionText');
let mainAdIndex = 0;

adSlideImgs.forEach((el, i) => {
  el.style.backgroundImage = `url('${ads[i].img}')`;
});
adCaptionTitleMain.textContent = ads[0].title;
adCaptionTextMain.textContent = ads[0].text;
adCaptionTitleMain.classList.add('active');
adCaptionTextMain.classList.add('active');

setInterval(() => {
  adSlideImgs[mainAdIndex].classList.remove('active');
  adCaptionTitleMain.classList.remove('active');
  adCaptionTextMain.classList.remove('active');
  mainAdIndex = (mainAdIndex + 1) % adSlideImgs.length;
  adSlideImgs[mainAdIndex].classList.add('active');
  setTimeout(() => {
    adCaptionTitleMain.textContent = ads[mainAdIndex].title;
    adCaptionTextMain.textContent = ads[mainAdIndex].text;
    adCaptionTitleMain.classList.add('active');
    adCaptionTextMain.classList.add('active');
  }, 150);
}, 4000);
