// CAUSA30 DESCUBRE — el banner visible dispara el visor de Publuu (elemento oculto)
document.getElementById('magCardVisible').addEventListener('click', () => {
  document.getElementById('publuuHiddenTrigger').click();
});

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpavpkp';

const products = [
  {biz:"Empresa X · Chocolate", name:"Chocolate X · Dark, Coco & Jengibre", price:"RD$ 250", aporte:"RD$ 15 por compra", img:"images/producto-chocolate.jpg",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"212", donacion:"RD$3,180",
   detail:"Este producto puedes comprarlo en: Empresa X. La oferta de venta es de RD$250 pesos por unidad. Aporte: RD$15 por compra."},
  {biz:"Empresa X · Heladería", name:"Pinta de Helado X", price:"RD$ 320", aporte:"RD$ 25 por compra", img:"images/producto-helado.jpg",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"157", donacion:"RD$3,925",
   detail:"Este producto puedes comprarlo en: Empresa X. La oferta de venta es de RD$320 pesos por unidad. Aporte: RD$25 por compra."},
  {biz:"Supermercados La Sirena", name:"Combo Solidario · 4 Botellas de Agua", price:"RD$ 100", aporte:"RD$ 10 por compra", img:"images/producto-agua.png",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"98", donacion:"RD$980",
   detail:"Este producto puedes comprarlo en: Supermercados La Sirena. La oferta de venta es de RD$100 pesos por 4 botellas (combo solidario). Aporte: 10 pesos por compra."},
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
        <div class="art" style="background-image:url('${p.img}')"><span class="badge">18 días restantes</span></div>
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

// CARRUSEL "CÓMO FUNCIONA" — puntos sincronizados con el deslizamiento
const mecanismoCarousel = document.getElementById('mecanismoCarousel');
const mecanismoDots = document.getElementById('mecanismoDots');
const mecanismoSlideCount = mecanismoCarousel.querySelectorAll('img').length;
for(let i = 0; i < mecanismoSlideCount; i++){
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  mecanismoDots.appendChild(d);
}
mecanismoCarousel.addEventListener('scroll', () => {
  const index = Math.round(mecanismoCarousel.scrollLeft / mecanismoCarousel.clientWidth);
  mecanismoDots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
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
progressModal.addEventListener('click', (e) => { if(e.target === progressModal) closeModal(progressModal); });
progressModal.querySelector('.btn-ghost').addEventListener('click', () => {
  closeModal(progressModal);
  carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// CONTADOR REGRESIVO — fecha de ejemplo, reemplazar por el cierre real de campaña al lanzar
// Formato: new Date('AAAA-MM-DDTHH:mm:ss')
const CAMPAIGN_END = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000); // placeholder: 18 días desde ahora

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
  document.getElementById('detailAporte').textContent = 'Aporte: ' + p.aporte;
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

// PATROCINADOR OFICIAL DEL MES — click para voltear y ver info del anunciante
document.getElementById('sponsorFlip').addEventListener('click', function(){
  this.classList.toggle('flipped');
});

// VIDEO — lightbox reutilizable con YouTube, a pantalla completa
// ⚠️ REEMPLAZAR con el ID real del video principal (la parte después de "shorts/" o "watch?v=")
const YOUTUBE_VIDEO_ID = 'TU_ID_DE_YOUTUBE';

const videoLightbox = document.getElementById('videoLightbox');
const ytFrameWrap = document.getElementById('ytFrameWrap');

function openVideoLightbox(videoId){
  videoLightbox.classList.add('open');
  ytFrameWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0" title="Causa30" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}
function closeVideoLightbox(){
  videoLightbox.classList.remove('open');
  ytFrameWrap.innerHTML = ''; // vaciar el iframe detiene la reproducción
}

// Cualquier botón con class="video-trigger" abre el lightbox.
// Usa data-yt-id="ID_DEL_VIDEO" para un video específico; si no lo tiene, usa el principal.
document.querySelectorAll('.video-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    openVideoLightbox(btn.dataset.ytId || YOUTUBE_VIDEO_ID);
  });
});

document.getElementById('videoLightboxClose').addEventListener('click', closeVideoLightbox);
videoLightbox.addEventListener('click', (e) => {
  if(e.target === videoLightbox) closeVideoLightbox();
});

document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-overlay')));
});
[causeModal, whereModal].forEach(m=>{
  m.addEventListener('click', (e)=>{ if(e.target === m) closeModal(m); });
});

// FORMULARIOS: Sugerir producto + Mi empresa quiere participar
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
      body: JSON.stringify({ tipo: 'Sugerencia de producto', producto })
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

// PROMO DE BIENVENIDA — se muestra una sola vez por dispositivo, elige 1 de 3 al azar
const ads = [
  {title:"📣 Este espacio puede ser tuyo", text:"Anuncia tu marca frente a una audiencia que ya está lista para comprar con propósito.", img:"images/1a1.png"},
  {title:"✨ Espacio publicitario disponible", text:"Combina tu promoción con causa social — visibilidad y buena reputación de marca.", img:"images/2b.png"},
  {title:"🍦 Espacio publicitario disponible", text:"Anúnciate en Causa30 y llega a personas que prefieren marcas con impacto.", img:"images/3c.png"},
];

const promoModal = document.getElementById('promoModal');
const PROMO_KEY = 'causa30_promo_seen';

if(!localStorage.getItem(PROMO_KEY)){
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
    localStorage.setItem(PROMO_KEY, 'true');
  }
});
promoModal.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(promoModal);
    localStorage.setItem(PROMO_KEY, 'true');
  });
});

// GALERÍA DE PROMOCIONES — navegable a propósito, vía botón "Ver promociones activas"
const adsModal = document.getElementById('adsModal');
let adsIndex = 0;

function renderAds(){
  const ad = ads[adsIndex];
  document.getElementById('adsArt').style.backgroundImage = `url('${ad.img}')`;
  document.getElementById('adsTitle').textContent = ad.title;
  document.getElementById('adsText').textContent = ad.text;
  const dotsWrap = document.getElementById('adsDots');
  dotsWrap.innerHTML = '';
  ads.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === adsIndex ? ' active' : '');
    dotsWrap.appendChild(d);
  });
}

document.getElementById('adsTrigger').addEventListener('click', () => {
  adsIndex = 0;
  renderAds();
  openModal(adsModal);
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
