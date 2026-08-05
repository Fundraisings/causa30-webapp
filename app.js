// ==========================================================================
// Causa30 v0.1 — Lógica Base e Interactividad
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Causa30 v0.1 inicializado correctamente.');

  // Animación simple para el contador de la hero section
  const daysCounter = document.getElementById('days-counter');
  
  if (daysCounter) {
    let count = 0;
    const target = 30;
    const duration = 1000; // 1 segundo
    const intervalTime = duration / target;

    const timer = setInterval(() => {
      count++;
      daysCounter.textContent = count;
      if (count >= target) {
        clearInterval(timer);
      }
    }, intervalTime);
  }
});
