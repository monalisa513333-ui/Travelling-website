document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  initTabs();
  initSearchForm();
  renderFlights(window.FLIGHTS || []);
}

function initTabs() {
  const tabs = document.querySelectorAll('.flight-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.flight-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // logic to show/hide return date input based on tab.dataset.type
      const returnDateWrapper = document.getElementById('returnDateWrapper');
      if (returnDateWrapper) {
        returnDateWrapper.style.display = tab.dataset.type === 'round' ? 'block' : 'none';
      }
    });
  });
}

function searchFlights() {
  const from = document.getElementById('flightFrom').value.toLowerCase();
  const to = document.getElementById('flightTo').value.toLowerCase();
  const date = document.getElementById('flightDate').value;
  
  let filtered = window.FLIGHTS || [];
  
  if (from) {
    filtered = filtered.filter(f => f.from.city.toLowerCase().includes(from) || f.from.code.toLowerCase().includes(from));
  }
  if (to) {
    filtered = filtered.filter(f => f.to.city.toLowerCase().includes(to) || f.to.code.toLowerCase().includes(to));
  }
  
  // further filtering like class, stops, etc.
  renderFlights(filtered);
}

function initSearchForm() {
  const form = document.getElementById('flightSearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      searchFlights();
    });
  }
}

function renderFlights(flights) {
  const container = document.getElementById('flightsGrid');
  if (!container) return;
  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.innerText = `${flights.length} flights found`;
  
  if (!flights.length) {
    container.innerHTML = '<div class="no-results">No flights found for this route.</div>';
    return;
  }
  
  container.innerHTML = flights.map(f => `
    <div class="flight-card">
      <div class="flight-airline">
        <span class="flight-logo">${f.logo}</span>
        <div>
          <strong>${f.airline}</strong>
          <small>${f.aircraft}</small>
        </div>
      </div>
      <div class="flight-route">
        <div class="flight-time-box">
          <strong>${new Date(f.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
          <span>${f.from.code}</span>
        </div>
        <div class="flight-duration">
          <small>${f.duration}</small>
          <div class="line"></div>
          <small>${f.stops === 0 ? 'Direct' : f.stops + ' Stop(s)'}</small>
        </div>
        <div class="flight-time-box">
          <strong>${new Date(f.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
          <span>${f.to.code}</span>
        </div>
      </div>
      <div class="flight-action">
        <div class="price">${window.Utils ? window.Utils.formatPrice(f.price) : '$'+f.price}</div>
        <button class="btn btn-primary" onclick="selectFlight('${f.id}')">Select</button>
      </div>
    </div>
  `).join('');
}

let selectedFlightId = null;
function selectFlight(id) {
  if (!window.Auth || !window.Auth.isLoggedIn()) {
    if(window.Utils) window.Utils.showToast('Please log in to book', 'error');
    setTimeout(() => { window.location.href = './auth.html?redirect=flights.html'; }, 1500);
    return;
  }
  selectedFlightId = id;
  const flight = (window.FLIGHTS || []).find(f => f.id === id);
  if (!flight) return;
  
  const modal = document.getElementById('flightBookingModal');
  if (modal) {
    document.getElementById('modalFlightRoute').innerText = `${flight.from.city} → ${flight.to.city}`;
    document.getElementById('modalFlightPrice').innerText = window.Utils ? window.Utils.formatPrice(flight.price) : '$'+flight.price;
    window.Utils.openModal(modal);
  }
}

function handleBooking(e) {
  e.preventDefault();
  const flight = (window.FLIGHTS || []).find(f => f.id === selectedFlightId);
  if (!flight) return;
  
  const passCount = parseInt(document.getElementById('passengerCount').value) || 1;
  const amount = flight.price * passCount;
  
  const details = {
    flightId: flight.id,
    route: `${flight.from.city} to ${flight.to.city}`,
    passengers: passCount,
    departure: flight.departure
  };
  
  const booking = window.Booking.createBooking('flight', details, amount);
  if (booking) {
    window.Utils.closeModal(document.getElementById('flightBookingModal'));
    window.Utils.showToast('Flight booked successfully!', 'success');
  }
}
