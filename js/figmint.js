(function () {
  const text = 'welcome to my portfolio. Here to help you out. reach me at rshaurya790@gmail.com or +91 8849670831. Ciao';
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
