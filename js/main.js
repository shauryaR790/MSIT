function updateTime() {
  const el = document.getElementById('time');
  if (!el) return;

  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  el.textContent = '(' + fmt.format(new Date()) + ')';
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
  });
}

updateTime();
setInterval(updateTime, 30000);
initContactForm();
