document.addEventListener('DOMContentLoaded', () => {
  if (window.Auth) window.Auth.requireAuth();
  initProfile();
});

function initProfile() {
  const user = window.Auth.getCurrentUser();
  if (!user) return;
  
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const avatarEl = document.getElementById('profileAvatar');
  
  if (nameEl) nameEl.innerText = user.name;
  if (emailEl) emailEl.innerText = user.email;
  if (avatarEl) {
    if (user.avatar) avatarEl.src = user.avatar;
    else {
      const p = document.createElement('div');
      p.className = 'avatar-placeholder';
      p.innerText = user.name.charAt(0);
      avatarEl.parentElement.replaceChild(p, avatarEl);
    }
  }
  
  // Fill settings form
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.querySelector('[name="name"]').value = user.name;
    settingsForm.querySelector('[name="email"]').value = user.email;
  }
  
  // Admin link
  if (user.role === 'admin') {
    const link = document.createElement('a');
    link.href = './admin/index.html';
    link.className = 'btn btn-primary mt-3';
    link.innerText = 'Go to Admin Dashboard';
    document.querySelector('.profile-sidebar').appendChild(link);
  }
  
  initTabs();
  renderBookings();
  renderWishlist();
  
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = settingsForm.querySelector('[name="name"]').value;
      if (window.Auth.updateProfile({ name })) {
        if(window.Utils) window.Utils.showToast('Profile updated', 'success');
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.profile-tab');
  const panels = document.querySelectorAll('.profile-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}

function renderBookings() {
  const container = document.getElementById('bookingsList');
  if (!container) return;
  const user = window.Auth.getCurrentUser();
  const bookings = window.Booking.getUserBookings(user.userId);
  
  if (!bookings.length) {
    container.innerHTML = '<p>You have no bookings yet.</p>';
    return;
  }
  
  container.innerHTML = bookings.map(b => `
    <div class="booking-card">
      <div class="booking-header">
        <strong>Booking #${b.id.substring(0,6)}</strong>
        <span class="badge badge-${b.status === 'confirmed' ? 'success' : (b.status==='cancelled'?'danger':'warning')}">${b.status}</span>
      </div>
      <div class="booking-body">
        <p>Type: <span class="capitalize">${b.type}</span></p>
        <p>Amount: ${window.Utils ? window.Utils.formatPrice(b.amount) : '$'+b.amount}</p>
        <p>Date: ${window.Utils ? window.Utils.formatDate(b.createdAt) : b.createdAt}</p>
      </div>
      ${b.status !== 'cancelled' ? `<button class="btn btn-sm btn-outline mt-2" onclick="cancelBooking('${b.id}')">Cancel Booking</button>` : ''}
    </div>
  `).join('');
}

function cancelBooking(id) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    const user = window.Auth.getCurrentUser();
    if (window.Booking.cancelBooking(id, user.userId)) {
      if(window.Utils) window.Utils.showToast('Booking cancelled', 'success');
      renderBookings();
    }
  }
}

function renderWishlist() {
  const container = document.getElementById('wishlistGrid');
  if (!container) return;
  const user = window.Auth.getCurrentUser();
  const wishlist = JSON.parse(localStorage.getItem('tv_wishlist') || '[]').filter(w => w.userId === user.userId);
  
  if (!wishlist.length) {
    container.innerHTML = '<p>Your wishlist is empty.</p>';
    return;
  }
  
  container.innerHTML = wishlist.map(w => `
    <div class="wishlist-item row-card">
      <img src="${w.image}" alt="${w.name}" style="width:100px; height:100px; object-fit:cover;" />
      <div class="info">
        <h4>${w.name}</h4>
        <a href="./${w.itemType}s.html" class="btn btn-sm btn-outline">View</a>
      </div>
    </div>
  `).join('');
}
