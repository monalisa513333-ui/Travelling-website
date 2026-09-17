document.addEventListener('DOMContentLoaded', () => {
  init();
});

let currentPackage = null;

function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  currentPackage = (window.PACKAGES || []).find(p => p.id === id);
  
  if (!currentPackage) {
    const container = document.getElementById('packageDetailContainer');
    if (container) container.innerHTML = '<div class="container text-center py-5"><h2>Package not found</h2><a href="./packages.html" class="btn btn-primary mt-3">Back to Packages</a></div>';
    return;
  }
  renderPackage(currentPackage);
}

function renderPackage(pkg) {
  const title = document.getElementById('pkgTitle');
  if (title) title.innerText = pkg.title;
  
  const price = document.getElementById('pkgPrice');
  if (price) price.innerText = window.Utils ? window.Utils.formatPrice(pkg.price) : '$'+pkg.price;
  
  const desc = document.getElementById('pkgDescription');
  if (desc) desc.innerText = pkg.longDescription || pkg.description;
  
  // Details
  const details = document.getElementById('pkgDetails');
  if (details) {
    details.innerHTML = `
      <div class="detail-item"><strong>Duration:</strong> ${pkg.duration} Days</div>
      <div class="detail-item"><strong>Group Size:</strong> Up to ${pkg.groupSize}</div>
      <div class="detail-item"><strong>Difficulty:</strong> <span class="capitalize">${pkg.difficulty}</span></div>
      <div class="detail-item"><strong>Category:</strong> <span class="capitalize">${pkg.category}</span></div>
    `;
  }
  
  // Gallery
  if (window.Gallery && pkg.images) {
    const images = pkg.images.map(src => ({src, category: 'all'}));
    window.Gallery.init('pkgGallery', images);
  }
  
  // Itinerary Accordion
  const itin = document.getElementById('pkgItinerary');
  if (itin && pkg.itinerary) {
    itin.innerHTML = pkg.itinerary.map((day, i) => `
      <div class="accordion-item">
        <button class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
          Day ${day.day}: ${day.title}
        </button>
        <div class="accordion-body">
          <p><strong>Activities:</strong> ${day.activities.join(', ')}</p>
          <p><strong>Meals:</strong> ${day.meals.join(', ')}</p>
          <p><strong>Accommodation:</strong> ${day.accommodation}</p>
        </div>
      </div>
    `).join('');
  }
}

function openBookingModal() {
  if (!window.Auth || !window.Auth.isLoggedIn()) {
    if (window.Utils) window.Utils.showToast('Please log in to book', 'error');
    setTimeout(() => { window.location.href = `./auth.html?redirect=package-detail.html?id=${currentPackage.id}`; }, 1500);
    return;
  }
  const modal = document.getElementById('bookingModal');
  if (modal) {
    document.getElementById('modalPkgName').innerText = currentPackage.title;
    document.getElementById('modalPrice').innerText = window.Utils ? window.Utils.formatPrice(currentPackage.price) : '$'+currentPackage.price;
    window.Utils.openModal(modal);
  }
}

function handleBooking(e) {
  e.preventDefault();
  const date = document.getElementById('travelDate').value;
  const travelers = parseInt(document.getElementById('travelerCount').value) || 1;
  if (!date) return;
  
  const amount = currentPackage.price * travelers;
  const details = {
    packageId: currentPackage.id,
    packageTitle: currentPackage.title,
    date,
    travelers
  };
  
  const booking = window.Booking.createBooking('package', details, amount);
  if (booking) {
    window.Utils.closeModal(document.getElementById('bookingModal'));
    window.Utils.showToast('Package booked successfully!', 'success');
  }
}
