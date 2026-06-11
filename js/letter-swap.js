function buildLetterSwap(el, text) {
  el.textContent = '';
  el.classList.add('letter-swap');
  el.setAttribute('aria-label', text);

  const inner = document.createElement('span');
  inner.className = 'letter-swap__inner';
  inner.setAttribute('aria-hidden', 'true');

  [...text].forEach((char, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'letter-wrap';
    wrap.style.setProperty('--i', i);

    const primary = document.createElement('span');
    primary.className = 'letter letter-primary';
    primary.textContent = char;

    const secondary = document.createElement('span');
    secondary.className = 'letter letter-secondary';
    secondary.textContent = char;

    wrap.append(primary, secondary);
    inner.appendChild(wrap);
  });

  el.appendChild(inner);
}

function initLetterSwap() {
  document.querySelectorAll('[data-letter-swap]').forEach((el) => {
    const text = el.getAttribute('data-letter-swap') || el.textContent.trim();
    buildLetterSwap(el, text);

    el.addEventListener('mouseenter', () => el.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => el.classList.remove('is-hovered'));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLetterSwap);
} else {
  initLetterSwap();
}
