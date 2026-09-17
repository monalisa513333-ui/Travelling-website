document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  // Generate random images for the gallery based on Unsplash
  const images = [];
  const categories = ['nature', 'city', 'beach', 'culture'];
  const ids = [
    "1537996194471-e657df975ab4", "1502602898657-3e91760cbb34", "1544551763-46a013bb70d5", 
    "1540959733332-eab4deabeeaf", "1570077188670-e3a8d69ac5ff", "1547036967-23d11aacaee0",
    "1496442226666-8d4d0e62e6e9", "1587595431973-160d0d94add1", "1512453979798-5ea266f8880c",
    "1566073771259-6a8506099945", "1513694203232-719a280e022f", "1527631746610-bca00a040d60"
  ];
  
  for(let i=0; i<ids.length * 2; i++) {
    images.push({
      src: `https://images.unsplash.com/photo-${ids[i % ids.length]}?w=1000&q=80`,
      thumb: `https://images.unsplash.com/photo-${ids[i % ids.length]}?w=400&q=80`,
      category: categories[i % categories.length]
    });
  }
  
  if(window.Gallery) {
    window.Gallery.init('galleryGrid', images);
  }
  
  // Filter buttons
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if(window.Gallery) window.Gallery.filterGallery(btn.dataset.filter);
    });
  });
}
