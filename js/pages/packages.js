document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  renderPackages(window.PACKAGES || []);
  initSearchForm();
  initFilters();
}

function renderPackages(packages) {
  const container = document.getElementById('packagesGrid');
  if (!container) return;
  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.innerText = `${packages.length} packages found`;
  
  if (!packages.length) {
    container.innerHTML = '<div class="no-results">No packages found matching your criteria.</div>';
    return;
  }
  
  container.innerHTML = packages.map(p => `
    <div class="pkg-card">
      <div class="pkg-img-wrap">
        <img src="${p.image}" alt="${p.title}" />
        <span class="badge badge-primary">${p.category}</span>
      </div>
      <div class="pkg-card-body">
        <h3>${p.title}</h3>
        <p class="dest"><small>📍 ${p.destination}</small></p>
        <div class="pkg-meta">
          <span>🕒 ${p.duration} Days</span>
          <span>👥 Max ${p.groupSize}</span>
          <span>⚡ ${p.difficulty}</span>
        </div>
        <p class="desc">${window.Utils ? window.Utils.truncate(p.description, 80) : p.description}</p>
        <div class="pkg-footer">
          <div class="price-box">
            <small>From</small>
            <div class="price">${window.Utils ? window.Utils.formatPrice(p.price) : '$'+p.price}</div>
          </div>
          <a href="./package-detail.html?id=${p.id}" class="btn btn-primary">View Details</a>
        </div>
      </div>
    </div>
  `).join('');
}

function searchPackages() {
  let filtered = window.PACKAGES || [];
  
  const q = document.getElementById('pkgSearch')?.value.toLowerCase();
  if (q) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q));
  }
  
  const maxPrice = document.getElementById('priceFilter')?.value;
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  }
  
  const diff = document.getElementById('difficultyFilter')?.value;
  if (diff) {
    filtered = filtered.filter(p => p.difficulty === diff);
  }
  
  const cat = document.getElementById('categoryFilter')?.value;
  if (cat) {
    filtered = filtered.filter(p => p.category === cat);
  }
  
  renderPackages(filtered);
}

function initSearchForm() {
  const form = document.getElementById('pkgSearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      searchPackages();
    });
  }
}

function initFilters() {
  const filters = document.querySelectorAll('.filter-select, .filter-range');
  filters.forEach(f => f.addEventListener('change', searchPackages));
  const priceRange = document.getElementById('priceFilter');
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      const d = document.getElementById('priceDisplay');
      if(d) d.innerText = window.Utils ? window.Utils.formatPrice(e.target.value) : '$'+e.target.value;
    });
  }
}
