const CAROUSEL_IMAGE_IDS = [
  '1493246507139-91e8fad9978e',
  '1516035069371-29a1b244cc32',
  '1507643179173-39db30be83d3',
  '1519750783826-e2420f4d687f',
  '1494438639946-1ebd1d20bf85',
  '1500462918059-b1a0cb512f1d',
  '1486718448742-1643916ef44d',
  '1493514789931-5f7514745154',
  '1530099486328-e021101a494a',
  '1496747611176-843222e1e57c',
  '1491895200230-24e84424a737',
  '1520698115663-8a9d060f606e',
  '1449247709948-96350937c885',
  '1462331940187-285b04fb854f',
  '1464822759023-fed622ff2c3b',
];

const AUTO_SPEED = 0.65;

function createCard(id, index) {
  const card = document.createElement('article');
  card.className = 'carousel-card';
  card.innerHTML = `
    <span class="carousel-card__index label">${String(index + 1).padStart(3, '0')}</span>
    <div class="carousel-card__frame">
      <img src="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=675&q=80" alt="Website preview" loading="lazy" draggable="false" />
    </div>
    <div class="carousel-card__foot">
      <span class="carousel-card__tag label">REF_${id.slice(0, 4)}</span>
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

  CAROUSEL_IMAGE_IDS.forEach((id, index) => {
    track.appendChild(createCard(id, index));
  });
  CAROUSEL_IMAGE_IDS.forEach((id, index) => {
    track.appendChild(createCard(id, index));
  });

  function measureSetWidth() {
    const card = track.querySelector('.carousel-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return CAROUSEL_IMAGE_IDS.length * (card.offsetWidth + gap);
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
      targetOffset += AUTO_SPEED * direction;
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
    targetOffset = setWidth / 2;
    offset = setWidth / 2;
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
