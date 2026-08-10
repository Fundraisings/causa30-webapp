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
      active = i;
      render();
      resetAutoplay();
      openDetail(p);
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

// MASCOTAS
const pets = [
  {name:"Lobo", meta:"3 años · Macho · Pequeño", desc:"Cariñoso y juguetón, disfruta del contacto humano.", img:"images/lobo.jpg"},
  {name:"Shakira", meta:"2 años · Hembra · Pequeño", desc:"Tranquila, de mirada dulce.", img:"images/shakira.jpg"},
  {name:"Fi", meta:"4 años · Macho · Grande", desc:"Noble y atento, ideal para espacios con patio.", img:"images/fi.jpg"},
];
const petScroll = document.getElementById('petScroll');
pets.forEach(p => {
  const card = document.createElement('div');
  card.className = 'pet-card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <div class="pet-info">
      <div class="pname">${p.name}</div>
      <div class="pmeta">${p.meta} · Disponible</div>
      <div class="pdesc">${p.desc}</div>
      <div class="pet-actions"><button class="adopt">Quiero adoptar</button><button class="share">Compartir</button></div>
    </div>`;
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
  document.getElementById('detailBiz').textContent = p.biz;
  document.getElementById('whereTitle').textContent = p.name;
  document.getElementById('detailPrice').textContent = p.price;
  document.getElementById('detailAporte').textContent = 'Aporte: ' + p.aporte;
  document.getElementById('whereBody').innerHTML = `
    <div class="where-row"><span class="ic">📍</span><div><span class="k">Dirección</span><span class="v">${p.address}</span></div></div>
    <div class="where-row"><span class="ic">🕒</span><div><span class="k">Horario</span><span class="v">${p.hours}</span></div></div>
    <div class="where-row"><span class="ic">⏱</span><div><span class="k">Campaña</span><span class="v">18 días restantes</span></div></div>
  `;
  openModal(whereModal);
}

document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-overlay')));
});
[causeModal, whereModal].forEach(m=>{
  m.addEventListener('click', (e)=>{ if(e.target === m) closeModal(m); });
});
