document.addEventListener('DOMContentLoaded', () => {
  initHeroSearch();
  initCounters();
  initTestimonialCarousel();
  initPopularDestinations();
  initFeaturedPackages();
});

function initHeroSearch() {
  const form = document.getElementById('heroSearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = form.querySelector('input').value;
      window.location.href = `./destinations.html?q=${encodeURIComponent(query)}`;
    });
  }
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.counter);
        if (window.Utils && window.Utils.animateCounter) {
          window.Utils.animateCounter(e.target, target);
        } else {
          e.target.innerText = target;
        }
        obs.unobserve(e.target);
      }
    });
  });
  counters.forEach(c => obs.observe(c));
}

function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  let index = 0;
  setInterval(() => {
    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    index = (index + 1) % cards.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 5000);
}

function initPopularDestinations() {
  const container = document.getElementById('popularDestinations');
  if (!container || !window.DESTINATIONS) return;
  const popular = window.DESTINATIONS.filter(d => d.featured).slice(0, 6);
  container.innerHTML = popular.map(d => `
    <div class="dest-card">
      <img src="${d.image}" alt="${d.name}" class="dest-card-img" />
      <div class="dest-card-body">
        <h3>${d.name}, ${d.country}</h3>
        <p>${window.Utils ? window.Utils.truncate(d.description, 60) : d.description}</p>
        <div class="dest-card-footer">
          <span>${window.Utils ? window.Utils.getStarsHTML(d.rating) : d.rating}</span>
          <strong>${window.Utils ? window.Utils.formatPrice(d.price) : '$'+d.price}</strong>
        </div>
      </div>
    </div>
  `).join('');
}

function initFeaturedPackages() {
  const container = document.getElementById('featuredPackages');
  if (!container || !window.PACKAGES) return;
  const featured = window.PACKAGES.filter(p => p.featured).slice(0, 3);
  container.innerHTML = featured.map(p => `
    <div class="pkg-card">
      <img src="${p.image}" alt="${p.title}" class="pkg-card-img" />
      <div class="pkg-card-body">
        <h3>${p.title}</h3>
        <p>${p.duration} Days | ${p.difficulty}</p>
        <div class="pkg-card-footer">
          <a href="./package-detail.html?id=${p.id}" class="btn btn-outline btn-sm">View Details</a>
          <strong>${window.Utils ? window.Utils.formatPrice(p.price) : '$'+p.price}</strong>
        </div>
      </div>
    </div>
  `).join('');
}
