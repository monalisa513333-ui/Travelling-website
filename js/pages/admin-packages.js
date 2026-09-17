document.addEventListener('DOMContentLoaded', () => {
  if (window.Admin) {
    window.Admin.init();
    window.Admin.renderPackagesTable('packagesTableContainer');
  }
  
  const form = document.getElementById('packageForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('pkgId').value;
      const data = {
        title: form.querySelector('[name="title"]').value,
        price: parseInt(form.querySelector('[name="price"]').value),
        description: form.querySelector('[name="description"]').value,
      };
      
      if (id) {
        window.Admin.updatePackage(id, data);
        if(window.Utils) window.Utils.showToast('Package updated', 'success');
      } else {
        window.Admin.createPackage(data);
        if(window.Utils) window.Utils.showToast('Package created', 'success');
      }
      
      form.reset();
      document.getElementById('pkgId').value = '';
      if(window.Utils) window.Utils.closeModal(document.getElementById('packageModal'));
      window.Admin.renderPackagesTable('packagesTableContainer');
    });
  }
});

function openAddPackageModal() {
  document.getElementById('packageForm').reset();
  document.getElementById('pkgId').value = '';
  if(window.Utils) window.Utils.openModal(document.getElementById('packageModal'));
}
