document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Swipe Slider de Causa30 cargado con éxito.');

  const btnReject = document.getElementById('btnReject');
  const btnAccept = document.getElementById('btnAccept');
  const cardStack = document.getElementById('cardStack');

  // Función para reordenar las tarjetas en la pila tras un deslizado
  function updateStack() {
    const cards = Array.from(cardStack.querySelectorAll('.swipe-card:not(.swipe-right):not(.swipe-left)'));
    cards.forEach((card, idx) => {
      card.setAttribute('data-index', idx);
    });

    // Si ya no quedan tarjetas activas, las reinicia todas para mantener el loop
    if (cards.length === 0) {
      setTimeout(() => {
        const allCards = cardStack.querySelectorAll('.swipe-card');
        allCards.forEach(card => {
          card.classList.remove('swipe-right', 'swipe-left');
        });
        updateStack();
      }, 500);
    }
  }

  // Deslizar la tarjeta superior hacia la derecha (Check / Aceptar)
  btnAccept.addEventListener('click', () => {
    const topCard = cardStack.querySelector('.swipe-card[data-index="0"]');
    if (topCard) {
      topCard.classList.add('swipe-right');
      setTimeout(updateStack, 300);
    }
  });

  // Deslizar la tarjeta superior hacia la izquierda (X / Rechazar)
  btnReject.addEventListener('click', () => {
    const topCard = cardStack.querySelector('.swipe-card[data-index="0"]');
    if (topCard) {
      topCard.classList.add('swipe-left');
      setTimeout(updateStack, 300);
    }
  });

  // Soporte de Arrastre (Drag / Touch Swipe) en pantalla táctil o mouse
  let isDragging = false;
  let startX = 0;
  let currentCard = null;

  cardStack.addEventListener('pointerdown', (e) => {
    currentCard = cardStack.querySelector('.swipe-card[data-index="0"]');
    if (!currentCard) return;
    isDragging = true;
    startX = e.clientX;
    currentCard.style.transition = 'none';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.clientX - startX;
    const rotate = deltaX * 0.08;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDragging || !currentCard) return;
    isDragging = false;
    currentCard.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

    const deltaX = e.clientX - startX;
    if (deltaX > 100) {
      currentCard.classList.add('swipe-right');
      setTimeout(updateStack, 300);
    } else if (deltaX < -100) {
      currentCard.classList.add('swipe-left');
      setTimeout(updateStack, 300);
    } else {
      currentCard.style.transform = '';
    }
    currentCard = null;
  });
});
