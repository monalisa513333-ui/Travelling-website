window.Gallery = {
  images: [],
  currentIndex: 0,
  init: (containerId, images) => {
    window.Gallery.images = images;
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = images.map((img, i) => `
        <div class="gallery-item" data-category="${img.category}">
          <img src="${img.src}" data-src="${img.src}" alt="Gallery image" class="gallery-img" onclick="window.Gallery.openLightbox(${i})" />
        </div>
      `).join('');
      window.Gallery.initLazyLoad();
    }
    window.Gallery.setupKeyboard();
  },
  openLightbox: (index) => {
    window.Gallery.currentIndex = index;
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('dialog');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      document.body.appendChild(lightbox);
    }
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="window.Gallery.closeLightbox()">&times;</button>
        <button class="lightbox-prev" onclick="window.Gallery.prevImage()">&lt;</button>
        <img src="${window.Gallery.images[index].src}" class="lightbox-img" alt="Lightbox" />
        <button class="lightbox-next" onclick="window.Gallery.nextImage()">&gt;</button>
      </div>
    `;
    window.Utils.openModal(lightbox);
  },
  closeLightbox: () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) window.Utils.closeModal(lightbox);
  },
  nextImage: () => {
    window.Gallery.currentIndex = (window.Gallery.currentIndex + 1) % window.Gallery.images.length;
    window.Gallery.openLightbox(window.Gallery.currentIndex);
  },
  prevImage: () => {
    window.Gallery.currentIndex = (window.Gallery.currentIndex - 1 + window.Gallery.images.length) % window.Gallery.images.length;
    window.Gallery.openLightbox(window.Gallery.currentIndex);
  },
  setupKeyboard: () => {
    document.addEventListener('keydown', (e) => {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.hasAttribute('open')) {
        if (e.key === 'ArrowRight') window.Gallery.nextImage();
        if (e.key === 'ArrowLeft') window.Gallery.prevImage();
        if (e.key === 'Escape') window.Gallery.closeLightbox();
      }
    });
  },
  filterGallery: (category) => {
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  },
  initLazyLoad: () => {
    window.Utils.lazyLoadImages();
  }
};
