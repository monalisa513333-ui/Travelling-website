window.Utils = {
  formatPrice: (amount, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount),
  formatDate: (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  formatDateShort: (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  getDaysBetween: (date1, date2) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24)),
  generateId: () => Math.random().toString(36).substr(2, 9),
  debounce: (fn, delay) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; },
  throttle: (fn, limit) => { let wait = false; return (...args) => { if (!wait) { fn(...args); wait = true; setTimeout(() => wait = false, limit); } }; },
  slugify: (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  capitalize: (str) => String(str).charAt(0).toUpperCase() + String(str).slice(1),
  truncate: (str, length) => str.length > length ? str.substring(0, length) + '...' : str,
  getStarsHTML: (rating, max = 5) => '★'.repeat(Math.round(rating)) + '☆'.repeat(max - Math.round(rating)),
  getRatingLabel: (rating) => rating >= 4.5 ? 'Excellent' : rating >= 4.0 ? 'Very Good' : rating >= 3.0 ? 'Good' : rating >= 2.0 ? 'Fair' : 'Poor',
  createToastContainer: () => {
    let c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    return c;
  },
  showToast: (message, type = 'info', duration = 3500) => {
    const c = window.Utils.createToastContainer();
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = message;
    c.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, duration);
  },
  openModal: (dialogEl) => { if (dialogEl && typeof dialogEl.showModal === 'function') dialogEl.showModal(); },
  closeModal: (dialogEl) => { if (dialogEl && typeof dialogEl.close === 'function') dialogEl.close(); },
  animateCounter: (el, target, duration = 2000) => {
    let start = 0; const increment = target / (duration / 16);
    const update = () => { start += increment; if (start < target) { el.innerText = Math.ceil(start); requestAnimationFrame(update); } else el.innerText = target; };
    update();
  },
  lazyLoadImages: () => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { const img = e.target; img.src = img.dataset.src; obs.unobserve(img); } });
    });
    document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
  },
  scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  setTheme: (theme) => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('tv_theme', theme); },
  getTheme: () => localStorage.getItem('tv_theme') || 'light',
  isLoggedIn: () => !!localStorage.getItem('tv_session'),
  getCurrentUser: () => JSON.parse(localStorage.getItem('tv_session') || 'null')
};
