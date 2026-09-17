document.addEventListener('DOMContentLoaded', () => {
  if (window.Admin) window.Admin.init();
  renderDashboard();
});

function renderDashboard() {
  if (!window.Admin) return;
  const stats = window.Admin.getStats();
  
  const elUsers = document.getElementById('statUsers');
  const elBookings = document.getElementById('statBookings');
  const elRevenue = document.getElementById('statRevenue');
  const elPending = document.getElementById('statPending');
  
  if (elUsers && window.Utils) window.Utils.animateCounter(elUsers, stats.users);
  if (elBookings && window.Utils) window.Utils.animateCounter(elBookings, stats.bookings);
  if (elRevenue && window.Utils) window.Utils.animateCounter(elRevenue, stats.revenue);
  if (elPending && window.Utils) window.Utils.animateCounter(elPending, stats.pending);
  
  // Recent Bookings
  const container = document.getElementById('recentBookings');
  if (container) {
    const bookings = window.Booking.getAllBookings().slice(-5).reverse();
    if (!bookings.length) {
      container.innerHTML = '<p>No recent bookings.</p>';
      return;
    }
    container.innerHTML = `
      <table class="table">
        <thead>
          <tr><th>ID</th><th>Type</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr>
              <td>${b.id.substring(0,8)}</td>
              <td class="capitalize">${b.type}</td>
              <td>${window.Utils ? window.Utils.formatPrice(b.amount) : '$'+b.amount}</td>
              <td><span class="badge badge-${b.status === 'confirmed' ? 'success' : (b.status === 'cancelled' ? 'danger' : 'warning')}">${b.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}
