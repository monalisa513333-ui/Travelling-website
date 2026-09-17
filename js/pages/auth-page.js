document.addEventListener('DOMContentLoaded', () => {
  if (window.Auth && window.Auth.isLoggedIn()) {
    window.location.href = './profile.html';
    return;
  }
  
  // Tab switching
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
  
  // Hash check
  if (window.location.hash === '#register') {
    document.querySelector('.auth-tab[data-target="registerForm"]').click();
  }
  
  // Forms
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('[name="email"]').value;
      const pass = loginForm.querySelector('[name="password"]').value;
      const res = window.Auth.login(email, pass);
      if (res.success) {
        if(window.Utils) window.Utils.showToast(res.message, 'success');
        const urlParams = new URLSearchParams(window.location.search);
        setTimeout(() => { window.location.href = urlParams.get('redirect') || './profile.html'; }, 1000);
      } else {
        if(window.Utils) window.Utils.showToast(res.message, 'error');
      }
    });
  }
  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('[name="name"]').value;
      const email = registerForm.querySelector('[name="email"]').value;
      const pass = registerForm.querySelector('[name="password"]').value;
      const res = window.Auth.register(name, email, pass);
      if (res.success) {
        if(window.Utils) window.Utils.showToast(res.message, 'success');
        const urlParams = new URLSearchParams(window.location.search);
        setTimeout(() => { window.location.href = urlParams.get('redirect') || './profile.html'; }, 1000);
      } else {
        if(window.Utils) window.Utils.showToast(res.message, 'error');
      }
    });
  }
  
  // Password toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerText = 'Hide';
      } else {
        input.type = 'password';
        btn.innerText = 'Show';
      }
    });
  });
});
