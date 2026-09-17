window.Admin = {
  init: () => {
    window.Auth.requireAdmin();
  },
  getStats: () => {
    const users = JSON.parse(localStorage.getItem('tv_users') || '[]');
    const bookings = window.Booking.getBookingStats();
    return {
      users: users.length,
      bookings: bookings.total,
      revenue: bookings.revenue,
      pending: bookings.pending
    };
  },
  renderUsersTable: (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const users = JSON.parse(localStorage.getItem('tv_users') || '[]');
    let html = '<table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>';
    users.forEach(u => {
      html += `<tr>
        <td>${u.name}</td><td>${u.email}</td><td>${u.role}</td>
        <td><button class="btn btn-sm btn-outline" onclick="window.Admin.deleteUser('${u.id}')">Delete</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  },
  renderBookingsTable: (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const bookings = window.Booking.getAllBookings();
    let html = '<table class="table"><thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    bookings.forEach(b => {
      html += `<tr>
        <td>${b.id}</td><td>${b.type}</td><td>${window.Utils.formatPrice(b.amount)}</td><td>${b.status}</td>
        <td>
          <select onchange="window.Admin.updateBookingStatus('${b.id}', this.value)">
            <option value="pending" ${b.status==='pending'?'selected':''}>Pending</option>
            <option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option>
            <option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled</option>
          </select>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  },
  renderPackagesTable: (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const packages = JSON.parse(localStorage.getItem('tv_packages_custom') || JSON.stringify(window.PACKAGES || []));
    let html = '<table class="table"><thead><tr><th>Title</th><th>Price</th><th>Actions</th></tr></thead><tbody>';
    packages.forEach(p => {
      html += `<tr>
        <td>${p.title}</td><td>${window.Utils.formatPrice(p.price)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="window.Admin.deletePackage('${p.id}')">Delete</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  },
  deleteUser: (userId) => {
    if(!confirm('Are you sure?')) return;
    let users = JSON.parse(localStorage.getItem('tv_users') || '[]');
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('tv_users', JSON.stringify(users));
    window.location.reload();
  },
  updateBookingStatus: (bookingId, status) => {
    window.Booking.updateBookingStatus(bookingId, status);
    window.Utils.showToast('Booking status updated', 'success');
  },
  createPackage: (data) => {
    const packages = JSON.parse(localStorage.getItem('tv_packages_custom') || JSON.stringify(window.PACKAGES || []));
    packages.push({ id: window.Utils.generateId(), ...data });
    localStorage.setItem('tv_packages_custom', JSON.stringify(packages));
    return true;
  },
  updatePackage: (id, data) => {
    let packages = JSON.parse(localStorage.getItem('tv_packages_custom') || JSON.stringify(window.PACKAGES || []));
    const idx = packages.findIndex(p => p.id === id);
    if (idx > -1) {
      packages[idx] = { ...packages[idx], ...data };
      localStorage.setItem('tv_packages_custom', JSON.stringify(packages));
      return true;
    }
    return false;
  },
  deletePackage: (id) => {
    if(!confirm('Delete package?')) return;
    let packages = JSON.parse(localStorage.getItem('tv_packages_custom') || JSON.stringify(window.PACKAGES || []));
    packages = packages.filter(p => p.id !== id);
    localStorage.setItem('tv_packages_custom', JSON.stringify(packages));
    window.location.reload();
  },
  exportCSV: (data, filename) => {
    if(!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [
      keys.join(','),
      ...data.map(row => keys.map(k => `"${row[k]}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    window.URL.revokeObjectURL(url);
  },
  searchTable: (query, tableId) => {
    const table = document.getElementById(tableId);
    if(!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const q = query.toLowerCase();
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  },
  sortTable: (colIndex, tableId) => {
    // Simple table sort implementation
    const table = document.getElementById(tableId);
    if(!table) return;
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = table.dataset.sortDir !== 'asc';
    table.dataset.sortDir = isAsc ? 'asc' : 'desc';
    rows.sort((a, b) => {
      const aVal = a.children[colIndex].innerText;
      const bVal = b.children[colIndex].innerText;
      return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    rows.forEach(r => tbody.appendChild(r));
  },
  renderPagination: (data, page, perPage, containerId, renderFn) => {
    // Basic pagination logic placeholder
  }
};
