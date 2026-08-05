// ==========================================================================
// Causa30 — Lógica e Interactividad
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Causa30 cargado con éxito.');

    // Animación de contadores al cargar la página
    const unitsElement = document.getElementById('units-counter');
    const fundsElement = document.getElementById('funds-counter');

    if (unitsElement && fundsElement) {
        let currentUnits = 0;
        const targetUnits = 6450;
        const duration = 1500; // 1.5 segundos
        const steps = 50;
        const increment = targetUnits / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            currentUnits += increment;
            if (currentUnits >= targetUnits) {
                currentUnits = targetUnits;
                clearInterval(timer);
            }
            
            // Actualizar unidades
            unitsElement.textContent = Math.floor(currentUnits).toLocaleString('es-DO');
            
            // Calculamos fondos en base a un promedio de RD$25 por unidad
            const currentFunds = Math.floor(currentUnits * 25);
            fundsElement.textContent = currentFunds.toLocaleString('es-DO');
        }, stepTime);
    }
});
