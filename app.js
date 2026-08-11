const products = [
  {biz:"Empresa X · Chocolate", name:"Chocolate X · Dark, Coco & Jengibre", price:"RD$ 250", aporte:"RD$ 15 por compra", img:"images/producto-chocolate.jpg",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"212", donacion:"RD$3,180"},
  {biz:"Empresa X · Heladería", name:"Pinta de Helado X", price:"RD$ 320", aporte:"RD$ 25 por compra", img:"images/producto-helado.jpg",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"157", donacion:"RD$3,925"},
  {biz:"Empresa X · Miel", name:"Miel Pura X 500ml", price:"RD$ 480", aporte:"RD$ 30 por compra", img:"images/producto-miel.jpg",
   address:"Dirección pendiente de confirmar", hours:"Horario pendiente de confirmar",
   compras:"98", donacion:"RD$2,940"},
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

// MASCOTAS
const pets = [
  {name:"Lobo", meta:"3 años · Macho · Pequeño", desc:"Cariñoso y juguetón, disfruta del contacto humano.",
   story:"Lobo llegó a la fundación hace un año, después de vivir mucho tiempo en la calle. Al principio era desconfiado, pero hoy es de los más juguetones del refugio. Le encanta correr y busca compañía humana constantemente.",
   img:"images/lobo.jpg"},
  {name:"Shakira", meta:"2 años · Hembra · Pequeño", desc:"Tranquila, de mirada dulce.",
   story:"Shakira fue rescatada junto a su camada cuando apenas tenía semanas de nacida. Es tranquila y observadora, y se acerca despacio hasta ganar confianza — una vez la gana, no se separa de tu lado.",
   img:"images/shakira.jpg"},
  {name:"Fi", meta:"4 años · Macho · Grande", desc:"Noble y atento, ideal para espacios con patio.",
   story:"Fi es el más veterano del grupo. Pasó varios años en la calle antes de llegar a la fundación, y a pesar de todo, es un perro noble y agradecido. Se lleva bien con otros animales y adora los espacios abiertos.",
   img:"images/fi.jpg"},
];
const petScroll = document.getElementById('petScroll');
pets.forEach((p, idx) => {
  const card = document.createElement('div');
  card.className = 'pet-card';
  card.innerHTML = `
    <div class="flip-scene" data-flipped="false">
      <div class="flip-inner">
        <div class="flip-front"><img src="${p.img}" alt="${p.name}"></div>
        <div class="flip-back"><p>${p.story}</p></div>
      </div>
    </div>
    <div class="pet-info">
      <div class="pname">${p.name}</div>
      <div class="pmeta">${p.meta} · Disponible</div>
      <div class="pdesc">${p.desc}</div>
      <div class="pet-actions"><button class="adopt">Quiero conocerlo/a</button><button class="share">Voy a compartir</button></div>
    </div>`;
  const scene = card.querySelector('.flip-scene');
  scene.addEventListener('click', () => {
    const flipped = scene.getAttribute('data-flipped') === 'true';
    scene.setAttribute('data-flipped', String(!flipped));
    scene.classList.toggle('flipped');
  });
  petScroll.appendChild(card);
});

// MODALS
function openModal(el){ el.classList.add('open'); }
function closeModal(el){ el.classList.remove('open'); }

const causeModal = document.getElementById('causeModal');
const whereModal = document.getElementById('whereModal');
document.getElementById('causeChip').addEventListener('click', () => openModal(causeModal));

function openDetail(p){
  document.getElementById('detailPhoto').style.backgroundImage = `url('${p.img}')`;
  document.getElementById('whereTitle').textContent = p.name;
  document.getElementById('detailPrice').textContent = p.price;
  document.getElementById('detailAporte').textContent = 'Aporte: ' + p.aporte;
  document.getElementById('storyCause').textContent = p.fundacion || 'Fundación Huellas Felices';
  document.getElementById('whereBody').innerHTML = `
    <div class="where-row"><span class="ic">⏱</span><div><span class="k">Campaña</span><span class="v">18 días restantes</span></div></div>
  `;

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

document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-overlay')));
});
[causeModal, whereModal].forEach(m=>{
  m.addEventListener('click', (e)=>{ if(e.target === m) closeModal(m); });
});
