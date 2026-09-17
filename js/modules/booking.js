window.Booking = {
  createBooking: (type, details, amount) => {
    const user = window.Auth.getCurrentUser();
    if (!user) {
      window.Utils.showToast('Please login to book.', 'error');
      return null;
    }
    const bookings = JSON.parse(localStorage.getItem('tv_bookings') || '[]');
    const booking = {
      id: window.Utils.generateId(),
      userId: user.userId,
      type: type, // 'hotel'|'flight'|'package'
      status: 'pending', // pending, confirmed, cancelled
      details: details,
      amount: amount,
      createdAt: new Date().toISOString()
    };
    bookings.push(booking);
    localStorage.setItem('tv_bookings', JSON.stringify(bookings));
    return booking;
  },
  getUserBookings: (userId) => {
    return JSON.parse(localStorage.getItem('tv_bookings') || '[]').filter(b => b.userId === userId);
  },
  getAllBookings: () => {
    return JSON.parse(localStorage.getItem('tv_bookings') || '[]');
  },
  cancelBooking: (bookingId, userId) => {
    let bookings = window.Booking.getAllBookings();
    const idx = bookings.findIndex(b => b.id === bookingId && (b.userId === userId || window.Auth.isAdmin()));
    if (idx > -1) {
      bookings[idx].status = 'cancelled';
      localStorage.setItem('tv_bookings', JSON.stringify(bookings));
      return true;
    }
    return false;
  },
  updateBookingStatus: (bookingId, status) => {
    if (!window.Auth.isAdmin()) return false;
    let bookings = window.Booking.getAllBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx > -1) {
      bookings[idx].status = status;
      localStorage.setItem('tv_bookings', JSON.stringify(bookings));
      return true;
    }
    return false;
  },
  getBookingStats: () => {
    const bookings = window.Booking.getAllBookings();
    return bookings.reduce((stats, b) => {
      stats.total++;
      if (b.type === 'hotel') stats.hotels++;
      if (b.type === 'flight') stats.flights++;
      if (b.type === 'package') stats.packages++;
      if (b.status === 'pending') stats.pending++;
      if (b.status === 'confirmed') stats.confirmed++;
      if (b.status === 'cancelled') stats.cancelled++;
      if (b.status !== 'cancelled') stats.revenue += b.amount;
      return stats;
    }, { total: 0, hotels: 0, flights: 0, packages: 0, revenue: 0, pending: 0, confirmed: 0, cancelled: 0 });
  }
};
