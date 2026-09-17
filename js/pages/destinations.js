document.addEventListener('DOMContentLoaded', () => {
  init();
});

let currentDestinations = [];

function init() {
  currentDestinations = window.DESTINATIONS || [];
  
  // check URL params
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const input = document.getElementById('searchInput');
    if(input) input.value = q;
    currentDestinations = currentDestinations.filter(d => 
      d.name.toLowerCase().includes(q.toLowerCase()) || 
      d.country.toLowerCase().includes(q.toLowerCase())
    );
  }

  renderDestinations(currentDestinations);
  initFilters();
  initSearch();
  initSort();
}

function renderDestinations(data) {
  const container = document.getElementById('destinationsGrid');
  if (!container) return;
  updateResultCount(data.length);
  
  if (!data.length) {
    container.innerHTML = '<div class="no-results">No destinations found matching your criteria.</div>';
    return;
  }

  container.innerHTML = data.map(d => {
    const isWishlisted = getWishlist().includes(d.id);
    return `
    <div class="dest-card">
      <div class="dest-card-img-wrap">
        <img src="${d.image}" alt="${d.name}" loading="lazy" />
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${d.id}', this)" aria-label="Add to wishlist">❤️</button>
      </div>
      <div class="dest-card-content">
        <h3>${d.name}, ${d.country}</h3>
        <div class="dest-meta">
          <span>${d.duration} Days</span>
          <span>${window.Utils ? window.Utils.getStarsHTML(d.rating) : d.rating} (${d.reviewCount})</span>
        </div>
        <p>${d.description}</p>
        <div class="dest-footer">
          <span class="price">From <strong>${window.Utils ? window.Utils.formatPrice(d.price) : '$'+d.price}</strong></span>
          <button class="btn btn-primary btn-sm">Explore</button>
        </div>
      </div>
    </div>
  `}).join('');
}

function applyFilters() {
  let filtered = window.DESTINATIONS || [];
  
  // Category
  const category = document.getElementById('categoryFilter')?.value;
  if (category) filtered = filtered.filter(d => d.category === category);
  
  // Continent
  const continent = document.getElementById('continentFilter')?.value;
  if (continent) filtered = filtered.filter(d => d.continent === continent);
  
  // Price
  const maxPrice = document.getElementById('priceFilter')?.value;
  if (maxPrice) filtered = filtered.filter(d => d.price <= parseInt(maxPrice));

  // Search
  const q = document.getElementById('searchInput')?.value.toLowerCase();
  if (q) filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q));

  currentDestinations = filtered;
  
  // Re-apply sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.dispatchEvent(new Event('change'));
  else renderDestinations(currentDestinations);
}

function initFilters() {
  const filters = document.querySelectorAll('.filter-select, .filter-range');
  filters.forEach(f => f.addEventListener('change', applyFilters));
  const priceRange = document.getElementById('priceFilter');
  const priceDisplay = document.getElementById('priceDisplay');
  if (priceRange && priceDisplay) {
    priceRange.addEventListener('input', (e) => {
      priceDisplay.innerText = window.Utils ? window.Utils.formatPrice(e.target.value) : '$'+e.target.value;
    });
  }
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput && window.Utils) {
    searchInput.addEventListener('input', window.Utils.debounce(() => {
      applyFilters();
    }, 300));
  } else if (searchInput) {
    searchInput.addEventListener('change', applyFilters);
  }
}

function initSort() {
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'price_asc') currentDestinations.sort((a,b) => a.price - b.price);
      else if (val === 'price_desc') currentDestinations.sort((a,b) => b.price - a.price);
      else if (val === 'rating') currentDestinations.sort((a,b) => b.rating - a.rating);
      renderDestinations(currentDestinations);
    });
  }
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('tv_wishlist') || '[]').map(w => w.itemId);
}

function toggleWishlist(destId, btn) {
  if (!window.Auth || !window.Auth.isLoggedIn()) {
    if(window.Utils) window.Utils.showToast('Please login to use wishlist', 'error');
    return;
  }
  const user = window.Auth.getCurrentUser();
  let wishlist = JSON.parse(localStorage.getItem('tv_wishlist') || '[]');
  const idx = wishlist.findIndex(w => w.itemId === destId && w.userId === user.userId);
  
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
  } else {
    const dest = window.DESTINATIONS.find(d => d.id === destId);
    wishlist.push({ userId: user.userId, itemId: destId, itemType: 'destination', name: dest.name, image: dest.image });
    btn.classList.add('active');
    if(window.Utils) window.Utils.showToast('Added to wishlist', 'success');
  }
  localStorage.setItem('tv_wishlist', JSON.stringify(wishlist));
}

function updateResultCount(count) {
  const el = document.getElementById('resultCount');
  if (el) el.innerText = `${count} destinations found`;
}
