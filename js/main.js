document.addEventListener('DOMContentLoaded', () => {
  if (window.Auth) window.Auth.init();
  initNavbar();
  initTheme();
  initBackToTop();
  if (window.Utils && window.Utils.lazyLoadImages) window.Utils.lazyLoadImages();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navAuth = document.getElementById('navAuth');
  const navUser = document.getElementById('navUser');
  const userAvatarNav = document.getElementById('userAvatarNav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu a');

  // Handle scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenu.setAttribute('aria-hidden', expanded);
    });
  }

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('active') && !navbar.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Active link marking
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href').includes(path)) {
      link.classList.add('active');
    }
    // close mobile menu on link click
    link.addEventListener('click', () => {
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        hamburger.click();
      }
    });
  });

  // Auth UI state
  if (window.Auth && window.Auth.isLoggedIn()) {
    if (navAuth) navAuth.classList.add('d-none');
    if (navUser) {
      navUser.classList.remove('d-none');
      const user = window.Auth.getCurrentUser();
      if (userAvatarNav && user.avatar) userAvatarNav.innerHTML = `<img src="${user.avatar}" alt="User">`;
      else if (userAvatarNav) userAvatarNav.innerText = user.name.charAt(0).toUpperCase();
    }
  }
}

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const theme = window.Utils ? window.Utils.getTheme() : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  
  if (toggle) {
    toggle.innerText = theme === 'dark' ? '☀️' : '🌙';
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      if (window.Utils) window.Utils.setTheme(next);
      toggle.innerText = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top btn-icon';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  });

  btn.addEventListener('click', () => {
    if (window.Utils) window.Utils.scrollToTop();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('input[type="email"]');
  if (input.value && window.Utils) {
    window.Utils.showToast('Thank you for subscribing!', 'success');
    form.reset();
  }
}
