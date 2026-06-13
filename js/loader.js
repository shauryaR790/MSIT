(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.remove();
    return;
  }

  document.body.classList.add('loader-active');

  const decodeEl = document.getElementById('loader-decode');
  const roleEl = document.getElementById('loader-role');
  const scanEl = document.getElementById('loader-scan');
  const stampEl = document.getElementById('loader-stamp');
  const shuttersEl = document.getElementById('loader-shutters');

  const TARGET = 'SHAURYA';
  const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';
  const SHUTTER_COUNT = 13;
  const MIN_MS = 2600;
  const start = performance.now();

  let loaded = false;
  let finished = false;
  let scrambleFrame = 0;

  for (let i = 0; i < SHUTTER_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'loader__shutter';
    bar.style.animationDelay = Math.abs(i - (SHUTTER_COUNT - 1) / 2) * 0.045 + 's';
    shuttersEl.appendChild(bar);
  }

  function scramble() {
    if (!decodeEl || finished) return;

    if (scrambleFrame > 48) {
      decodeEl.textContent = TARGET;
      decodeEl.classList.add('is-locked');
      if (roleEl) roleEl.classList.add('is-visible');
      if (scanEl) scanEl.classList.add('is-active');
      window.setTimeout(() => {
        if (stampEl) stampEl.classList.add('is-hit');
      }, 420);
      maybeFinish();
      return;
    }

    decodeEl.textContent = TARGET.split('')
      .map((char, i) => {
        if (scrambleFrame > i * 4 + 8) return char;
        return POOL[Math.floor(Math.random() * POOL.length)];
      })
      .join('');

    scrambleFrame += 1;
    requestAnimationFrame(scramble);
  }

  function maybeFinish() {
    if (finished || !loaded || scrambleFrame <= 48) return;

    const elapsed = performance.now() - start;
    if (elapsed < MIN_MS) {
      window.setTimeout(maybeFinish, MIN_MS - elapsed);
      return;
    }

    finished = true;
    loader.classList.add('is-exit');

    window.setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.remove('loader-active');
      loader.remove();
    }, 900);
  }

  window.addEventListener('load', () => {
    loaded = true;
    maybeFinish();
  });

  window.setTimeout(() => {
    loaded = true;
    maybeFinish();
  }, 5000);

  requestAnimationFrame(scramble);
})();
