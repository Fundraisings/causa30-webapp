document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Causa30 con diseño estilo PRAY cargado correctamente.');

  // Animación suave de los contadores
  const unitsEl = document.getElementById('units-counter');
  const fundsEl = document.getElementById('funds-counter');

  if (unitsEl && fundsEl) {
    let units = 0;
    const targetUnits = 6450;
    const step = targetUnits / 40;

    const timer = setInterval(() => {
      units += step;
      if (units >= targetUnits) {
        units = targetUnits;
        clearInterval(timer);
      }
      unitsEl.textContent = Math.floor(units).toLocaleString('es-DO');
      fundsEl.textContent = Math.floor(units * 25).toLocaleString('es-DO');
    }, 30);
  }
});
