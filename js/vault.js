(function () {
  const track = document.querySelector('.vault-ticker__track');
  if (track && track.dataset.duplicated !== 'true') {
    const span = track.querySelector('span');
    if (span) {
      track.appendChild(span.cloneNode(true));
      track.dataset.duplicated = 'true';
    }
  }

  const countEl = document.querySelector('[data-vault-count]');
  const cards = document.querySelectorAll('.vault .vault-card');
  if (countEl && cards.length) {
    countEl.textContent = String(cards.length).padStart(2, '0');
  }
})();
