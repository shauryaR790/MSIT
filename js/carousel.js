function buildImages(start, count) {
  return Array.from({ length: count }, (_, i) => {
    const num = String(start + i).padStart(2, '0');
    return {
      src: `screenshots/site-${num}.png`,
      tag: `SITE_${num}`,
      alt: `Site screenshot ${num}`,
    };
  });
}

const CAROUSEL_SETS = {
  top: buildImages(1, 7),
  bottom: buildImages(8, 8),
};

const DEFAULT_SPEED = 0.65;

function createCard(image, index) {
  const card = document.createElement('article');
  card.className = 'carousel-card';
  card.innerHTML = `
    <span class="carousel-card__index label">${String(index + 1).padStart(3, '0')}</span>
    <div class="carousel-card__frame">
      <img src="${image.src}" alt="${image.alt}" loading="lazy" draggable="false" />
    </div>
    <div class="carousel-card__foot">
      <span class="carousel-card__tag label">${image.tag}</span>
      <span class="carousel-card__mark label">■</span>
    </div>
  `;
  return card;
}

function initCarousel(row) {
  const viewport = row.querySelector('.carousel-viewport');
  const track = row.querySelector('.carousel-track');
  if (!viewport || !track) return;

  const direction = parseInt(row.dataset.direction, 10) || 1;
  const autoSpeed = parseFloat(row.dataset.speed) || DEFAULT_SPEED;
  const setKey = row.dataset.images || 'top';
  const images = CAROUSEL_SETS[setKey] || CAROUSEL_SETS.top;

  images.forEach((image, index) => {
    track.appendChild(createCard(image, index));
  });
  images.forEach((image, index) => {
    track.appendChild(createCard(image, index));
  });

  function measureSetWidth() {
    const card = track.querySelector('.carousel-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return images.length * (card.offsetWidth + gap);
  }

  let setWidth = measureSetWidth();
  let offset = 0;
  let targetOffset = 0;
  let velocity = 0;
  let isDragging = false;
  let lastX = 0;
  let activeViewport = null;

  function normalize(value) {
    let next = value;
    while (next >= setWidth) next -= setWidth;
    while (next < 0) next += setWidth;
    return next;
  }

  function applyOffset(value) {
    track.style.transform = `translate3d(${-value}px, 0, 0)`;
  }

  function animate() {
    if (!isDragging) {
      targetOffset += velocity;
      velocity *= 0.92;
      targetOffset += autoSpeed * direction;
    }

    targetOffset = normalize(targetOffset);
    offset += (targetOffset - offset) * 0.12;

    if (Math.abs(targetOffset - offset) > setWidth / 2) {
      offset += targetOffset > offset ? setWidth : -setWidth;
    }

    applyOffset(offset);
    requestAnimationFrame(animate);
  }

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    activeViewport = viewport;
    lastX = e.clientX;
    velocity = 0;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    activeViewport = null;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || activeViewport !== viewport) return;
    const delta = e.clientX - lastX;
    lastX = e.clientX;
    targetOffset = normalize(targetOffset - delta * 1.4);
    velocity = -delta * 0.45;
  });

  viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    activeViewport = viewport;
    lastX = e.touches[0].clientX;
    velocity = 0;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
    activeViewport = null;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || activeViewport !== viewport) return;
    const x = e.touches[0].clientX;
    const delta = x - lastX;
    lastX = x;
    targetOffset = normalize(targetOffset - delta * 1.4);
    velocity = -delta * 0.45;
  }, { passive: true });

  if (direction < 0) {
    targetOffset = setWidth * 0.35;
    offset = setWidth * 0.35;
  }

  window.addEventListener('resize', () => {
    const ratio = setWidth > 0 ? targetOffset / setWidth : 0;
    setWidth = measureSetWidth();
    targetOffset = ratio * setWidth;
    offset = ratio * setWidth;
  });

  animate();
}

function initCarousels() {
  document.querySelectorAll('.weaverine .carousel-row').forEach(initCarousel);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}
