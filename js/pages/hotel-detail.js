document.addEventListener('DOMContentLoaded', () => {
  init();
});

let currentHotel = null;

function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  currentHotel = (window.HOTELS || []).find(h => h.id === id);
  
  if (!currentHotel) {
    const container = document.getElementById('hotelDetailContainer');
    if(container) container.innerHTML = '<div class="container text-center py-5"><h2>Hotel not found</h2><a href="./hotels.html" class="btn btn-primary mt-3">Back to Hotels</a></div>';
    return;
  }
  renderHotel(currentHotel);
  initPhotoCarousel();
}

function renderHotel(hotel) {
  // Update header and info
  const nameEl = document.getElementById('hotelName');
  if (nameEl) nameEl.innerText = hotel.name;
  
  const starsEl = document.getElementById('hotelStars');
  if (starsEl && window.Utils) starsEl.innerHTML = window.Utils.getStarsHTML(hotel.stars);
  
  const locEl = document.getElementById('hotelLocation');
  if (locEl) locEl.innerText = hotel.location;
  
  const ratingEl = document.getElementById('hotelRatingScore');
  if (ratingEl) ratingEl.innerText = hotel.rating;
  
  const reviewCountEl = document.getElementById('hotelReviewCount');
  if (reviewCountEl) reviewCountEl.innerText = `${hotel.reviewCount} Reviews`;

  const descEl = document.getElementById('hotelDescription');
  if (descEl) descEl.innerText = hotel.description;
  
  const amEl = document.getElementById('hotelAmenities');
  if (amEl) {
    amEl.innerHTML = hotel.amenities.map(a => `<div class="amenity-item">✓ ${a}</div>`).join('');
  }

  // Gallery grid
  const gallery = document.getElementById('hotelGallery');
  if (gallery) {
    gallery.innerHTML = hotel.images.slice(0, 5).map((img, i) => `
      <div class="gallery-img-wrap ${i===0?'main-img':''}">
        <img src="${img}" alt="Photo" />
      </div>
    `).join('');
  }

  // Rooms
  const roomsContainer = document.getElementById('hotelRooms');
  if (roomsContainer) {
    roomsContainer.innerHTML = hotel.rooms.map(r => `
      <div class="room-card">
        <img src="${r.image}" alt="${r.type}" class="room-img" />
        <div class="room-info">
          <h4>${r.type}</h4>
          <p>${r.description}</p>
          <p><small>Capacity: ${r.capacity} persons</small></p>
          <div class="room-amenities">
            ${r.amenities.map(a => `<span class="badge badge-outline badge-sm">${a}</span>`).join('')}
          </div>
        </div>
        <div class="room-price-box">
          <div class="price">${window.Utils ? window.Utils.formatPrice(r.price) : '$'+r.price}<span>/night</span></div>
          <button class="btn btn-primary" onclick="openBookingModal('${r.id}')" ${!r.available?'disabled':''}>${r.available ? 'Book Now' : 'Sold Out'}</button>
        </div>
      </div>
    `).join('');
  }
}

function initPhotoCarousel() {
  // Can reuse gallery module if needed
}

function openBookingModal(roomId) {
  if (!window.Auth || !window.Auth.isLoggedIn()) {
    if(window.Utils) window.Utils.showToast('Please log in to book', 'error');
    setTimeout(() => { window.location.href = `./auth.html?redirect=hotel-detail.html?id=${currentHotel.id}`; }, 1500);
    return;
  }
  
  const room = currentHotel.rooms.find(r => r.id === roomId);
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  
  document.getElementById('modalRoomName').innerText = room.type;
  document.getElementById('modalPrice').innerText = window.Utils ? window.Utils.formatPrice(room.price) : '$'+room.price;
  document.getElementById('roomIdInput').value = room.id;
  
  // Calculate total on date change
  const checkIn = document.getElementById('checkInDate');
  const checkOut = document.getElementById('checkOutDate');
  const updatePrice = () => {
    if (checkIn.value && checkOut.value && window.Utils) {
      const days = window.Utils.getDaysBetween(checkIn.value, checkOut.value);
      if (days > 0) {
        document.getElementById('modalTotal').innerText = window.Utils.formatPrice(days * room.price);
      }
    }
  };
  checkIn.addEventListener('change', updatePrice);
  checkOut.addEventListener('change', updatePrice);
  
  window.Utils.openModal(modal);
}

function handleBooking(e) {
  e.preventDefault();
  const roomId = document.getElementById('roomIdInput').value;
  const room = currentHotel.rooms.find(r => r.id === roomId);
  const checkIn = document.getElementById('checkInDate').value;
  const checkOut = document.getElementById('checkOutDate').value;
  
  if (!checkIn || !checkOut) return;
  const days = window.Utils ? window.Utils.getDaysBetween(checkIn, checkOut) : 1;
  const amount = days * room.price;
  
  const details = {
    hotelId: currentHotel.id,
    hotelName: currentHotel.name,
    roomId: room.id,
    roomType: room.type,
    checkIn, checkOut, days
  };
  
  const booking = window.Booking.createBooking('hotel', details, amount);
  if (booking) {
    window.Utils.closeModal(document.getElementById('bookingModal'));
    window.Utils.showToast('Booking successful! Check your profile.', 'success');
  }
}
