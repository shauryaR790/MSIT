(function () {
  const text = 'welcome to my portfolio. full stack · ui/ux · cyber. scroll down — i ship live sites.';
  const speed = 100;
  let i = 0;
  const target = document.getElementById('figmint-typewriter');
  if (!target) return;

  function typeWriter() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i += 1;
      setTimeout(typeWriter, speed + Math.random() * 50);
    } else {
      setTimeout(() => {
        target.textContent = '';
        i = 0;
        typeWriter();
      }, 3000);
    }
  }

  typeWriter();
})();
