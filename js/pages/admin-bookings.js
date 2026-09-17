document.addEventListener('DOMContentLoaded', () => {
  if (window.Admin) {
    window.Admin.init();
    window.Admin.renderBookingsTable('bookingsTableContainer');
  }
  
  const searchInput = document.getElementById('searchBookings');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if(window.Admin) window.Admin.searchTable(e.target.value, 'bookingsTableContainer');
    });
  }
  
  const exportBtn = document.getElementById('exportBookings');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if(window.Admin) window.Admin.exportCSV(window.Booking.getAllBookings(), 'bookings.csv');
    });
  }
});
