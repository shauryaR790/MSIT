(function initSignalWidget() {
  const widget = document.getElementById('signal-widget');
  const recordBtn = document.getElementById('signal-recordBtn');
  const statusText = document.getElementById('signal-statusText');
  const timeCode = document.getElementById('signal-timeCode');
  const radialCanvas = document.getElementById('signal-radial-canvas');

  if (!widget || !radialCanvas) return;

  const rCtx = radialCanvas.getContext('2d');
  let isRecording = true;
  let startTime;
  let timerInterval;

  const tickCount = 120;
  const cx = 140;
  const cy = 140;
  const baseRadius = 88;
  const baseTickLength = 4;

  function drawRadialTicks() {
    rCtx.clearRect(0, 0, 280, 280);
    const time = Date.now() * 0.002;

    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2;
      let noise = 0;

      if (isRecording) {
        noise = Math.sin(i * 0.2 + time) * Math.cos(i * 0.1 - time * 2) * 32;
        noise += Math.random() * 10;
      } else {
        noise = Math.sin(i * 0.1 + time) * 5;
      }

      const tickLength = baseTickLength + Math.max(0, noise);

      rCtx.save();
      rCtx.translate(cx, cy);
      rCtx.rotate(angle);
      rCtx.beginPath();
      rCtx.moveTo(0, -baseRadius);
      rCtx.lineTo(0, -baseRadius - tickLength);
      rCtx.strokeStyle = isRecording ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.35)';
      rCtx.lineWidth = 1.5;
      rCtx.stroke();
      rCtx.restore();
    }
  }

  function updateViz() {
    drawRadialTicks();
    requestAnimationFrame(updateViz);
  }

  function updateTimer() {
    const diff = Date.now() - startTime;
    const ms = Math.floor((diff % 1000) / 10);
    const s = Math.floor((diff / 1000) % 60);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const h = Math.floor(diff / (1000 * 60 * 60));
    const pad = (n) => n.toString().padStart(2, '0');
    timeCode.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(ms)}`;
  }

  updateViz();

  widget.classList.add('is-recording');
  statusText.innerHTML = 'Build pipeline live.<br>Deploying project...';
  startTime = Date.now();
  updateTimer();
  timerInterval = setInterval(updateTimer, 10);

  recordBtn.addEventListener('click', () => {
    isRecording = !isRecording;

    if (isRecording) {
      widget.classList.add('is-recording');
      statusText.innerHTML = 'Build pipeline live.<br>Deploying project...';
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 10);
    } else {
      widget.classList.remove('is-recording');
      statusText.innerHTML = 'Deploy paused.<br>Build saved locally.';
      clearInterval(timerInterval);
    }
  });
})();
