document.addEventListener('DOMContentLoaded', () => {
  if (window.Admin) {
    window.Admin.init();
    window.Admin.renderUsersTable('usersTableContainer');
  }
  
  const searchInput = document.getElementById('searchUsers');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if(window.Admin) window.Admin.searchTable(e.target.value, 'usersTableContainer');
    });
  }
});
