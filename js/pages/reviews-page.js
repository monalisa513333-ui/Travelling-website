document.addEventListener('DOMContentLoaded', () => {
  if (window.ReviewsModule) {
    window.ReviewsModule.init('reviewsList');
    const reviews = window.ReviewsModule.getReviews();
    window.ReviewsModule.renderRatingBreakdown(reviews, 'ratingBreakdown');
    window.ReviewsModule.renderStarInput('starRatingContainer', 'rating');
  }
  
  const form = document.getElementById('reviewForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!window.Auth || !window.Auth.isLoggedIn()) {
        if(window.Utils) window.Utils.showToast('Please log in to submit a review', 'error');
        return;
      }
      
      const formData = new FormData(form);
      const data = {
        title: formData.get('title'),
        body: formData.get('body'),
        rating: parseInt(formData.get('rating')) || 5,
        destinationId: formData.get('destinationId')
      };
      
      const res = window.ReviewsModule.submitReview(data);
      if (res.success) {
        if(window.Utils) window.Utils.showToast(res.message, 'success');
        form.reset();
        document.querySelectorAll('.star').forEach(s => s.style.color = 'gold');
        window.ReviewsModule.init('reviewsList');
      } else {
        if(window.Utils) window.Utils.showToast(res.message, 'error');
      }
    });
  }
  
  // Filters
  const sortSelect = document.getElementById('sortReviews');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      let reviews = window.ReviewsModule.getReviews();
      if (sortSelect.value === 'recent') reviews.sort((a,b) => new Date(b.date) - new Date(a.date));
      if (sortSelect.value === 'highest') reviews.sort((a,b) => b.rating - a.rating);
      if (sortSelect.value === 'lowest') reviews.sort((a,b) => a.rating - b.rating);
      window.ReviewsModule.renderReviews(reviews, 'reviewsList');
    });
  }
});
