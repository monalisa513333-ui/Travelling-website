document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        if(window.Utils) window.Utils.showToast('Message sent successfully. We will contact you soon.', 'success');
        form.reset();
        btn.innerText = origText;
        btn.disabled = false;
      }, 1000);
    });
  }
  
  // FAQ Accordion
  const faqs = document.querySelectorAll('.faq-header');
  faqs.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });
});
