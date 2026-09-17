document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  renderHotels(window.HOTELS || []);
  initSearchForm();
  initFilters();
}

function renderHotels(hotels) {
  const container = document.getElementById('hotelsGrid');
  if (!container) return;
  const countEl = document.getElementById('resultCount');
  if(countEl) countEl.innerText = `${hotels.length} hotels found`;
  
  if (!hotels.length) {
    container.innerHTML = '<div class="no-results">No hotels found matching your criteria.</div>';
    return;
  }

  container.innerHTML = hotels.map(h => `
    <div class="hotel-card row-card">
      <div class="hotel-img-wrap">
        <img src="${h.images[0]}" alt="${h.name}" />
        <span class="badge badge-primary">${h.category}</span>
      </div>
      <div class="hotel-info">
        <div class="hotel-header">
          <h3>${h.name}</h3>
          <div class="stars">${window.Utils ? window.Utils.getStarsHTML(h.stars) : h.stars+' Stars'}</div>
        </div>
        <p class="location">📍 ${h.location}</p>
        <div class="amenities-preview">
          ${h.amenities.slice(0,4).map(a => `<span class="amenity-tag">${a}</span>`).join('')}
        </div>
        <div class="hotel-rating-box">
          <span class="score">${h.rating}</span>
          <div class="rating-text">
            <strong>${window.Utils ? window.Utils.getRatingLabel(h.rating) : 'Good'}</strong>
            <small>${h.reviewCount} reviews</small>
          </div>
        </div>
      </div>
      <div class="hotel-action">
        <div class="price-box">
          <small>Price per night from</small>
          <div class="original-price">${window.Utils ? window.Utils.formatPrice(h.originalPrice) : '$'+h.originalPrice}</div>
          <div class="current-price">${window.Utils ? window.Utils.formatPrice(h.pricePerNight) : '$'+h.pricePerNight}</div>
        </div>
        <a href="./hotel-detail.html?id=${h.id}" class="btn btn-primary btn-full">View Details</a>
      </div>
    </div>
  `).join('');
}

function searchHotels() {
  let filtered = window.HOTELS || [];
  
  // Destination search
  const destInput = document.getElementById('destSearch')?.value.toLowerCase();
  if (destInput && window.DESTINATIONS) {
    const matchingDestIds = window.DESTINATIONS
      .filter(d => d.name.toLowerCase().includes(destInput) || d.country.toLowerCase().includes(destInput))
      .map(d => d.id);
    filtered = filtered.filter(h => matchingDestIds.includes(h.destinationId) || h.name.toLowerCase().includes(destInput));
  }

  // Price range
  const maxPrice = document.getElementById('priceFilter')?.value;
  if (maxPrice) filtered = filtered.filter(h => h.pricePerNight <= parseInt(maxPrice));

  // Stars
  const selectedStars = Array.from(document.querySelectorAll('input[name="stars"]:checked')).map(cb => parseInt(cb.value));
  if (selectedStars.length) {
    filtered = filtered.filter(h => selectedStars.includes(h.stars));
  }
  
  // Amenities
  const selectedAm = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);
  if (selectedAm.length) {
    filtered = filtered.filter(h => selectedAm.every(am => h.amenities.includes(am)));
  }

  renderHotels(filtered);
}

function initSearchForm() {
  const form = document.getElementById('hotelSearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      searchHotels();
    });
  }
}

function initFilters() {
  const filters = document.querySelectorAll('.filter-input, input[type="checkbox"]');
  filters.forEach(f => f.addEventListener('change', searchHotels));
  const priceRange = document.getElementById('priceFilter');
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      const d = document.getElementById('priceDisplay');
      if(d) d.innerText = window.Utils ? window.Utils.formatPrice(e.target.value) : '$'+e.target.value;
    });
  }
}
