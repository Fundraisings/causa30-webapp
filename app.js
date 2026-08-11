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
    dot.className = 'dot' + (i === active
