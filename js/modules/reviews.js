window.ReviewsModule = {
  init: (containerId) => {
    window.ReviewsModule.containerId = containerId;
    window.ReviewsModule.renderReviews(window.ReviewsModule.getReviews(), containerId);
  },
  getReviews: (filter = {}) => {
    const localReviews = JSON.parse(localStorage.getItem('tv_reviews') || '[]');
    let allReviews = [...(window.REVIEWS_DATA || []), ...localReviews];
    if (filter.destinationId) allReviews = allReviews.filter(r => r.destinationId === filter.destinationId);
    if (filter.hotel) allReviews = allReviews.filter(r => r.hotel === filter.hotel);
    if (filter.rating) allReviews = allReviews.filter(r => r.rating === parseInt(filter.rating));
    return allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  submitReview: (data) => {
    const user = window.Auth.getCurrentUser();
    if (!user) return { success: false, message: 'Must be logged in to review' };
    const review = {
      id: window.Utils.generateId(),
      userId: user.userId,
      userName: user.name,
      userAvatar: user.avatar || '',
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: true,
      ...data
    };
    const localReviews = JSON.parse(localStorage.getItem('tv_reviews') || '[]');
    localReviews.push(review);
    localStorage.setItem('tv_reviews', JSON.stringify(localReviews));
    return { success: true, message: 'Review submitted', review };
  },
  renderReviews: (reviews, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!reviews.length) {
      container.innerHTML = '<p>No reviews yet.</p>';
      return;
    }
    container.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-user">
            <div class="user-avatar">${r.userAvatar ? `<img src="${r.userAvatar}" />` : r.userName.charAt(0)}</div>
            <div>
              <strong>${r.userName}</strong>
              ${r.verified ? '<span class="badge badge-success badge-sm">Verified</span>' : ''}
            </div>
          </div>
          <div class="review-date">${window.Utils.formatDateShort(r.date)}</div>
        </div>
        <div class="review-rating">${window.Utils.getStarsHTML(r.rating)}</div>
        <h4 class="review-title">${r.title}</h4>
        <p class="review-body">${r.body}</p>
        <button class="btn btn-sm btn-ghost" onclick="window.ReviewsModule.updateHelpful('${r.id}')">
          Helpful (${r.helpful})
        </button>
      </div>
    `).join('');
  },
  renderRatingBreakdown: (reviews, containerId) => {
    const container = document.getElementById(containerId);
    if (!container || !reviews.length) return;
    const total = reviews.length;
    const counts = [0,0,0,0,0];
    reviews.forEach(r => counts[Math.floor(r.rating) - 1]++);
    let html = '<div class="rating-breakdown">';
    for (let i = 5; i >= 1; i--) {
      const p = (counts[i-1] / total) * 100;
      html += `
        <div class="rating-bar-row">
          <span>${i} Star</span>
          <div class="progress-bar"><div class="progress-fill" style="width:${p}%"></div></div>
          <span>${counts[i-1]}</span>
        </div>
      `;
    }
    html += '</div>';
    container.innerHTML = html;
  },
  updateHelpful: (reviewId) => {
    let localReviews = JSON.parse(localStorage.getItem('tv_reviews') || '[]');
    let idx = localReviews.findIndex(r => r.id === reviewId);
    if (idx > -1) {
      localReviews[idx].helpful++;
      localStorage.setItem('tv_reviews', JSON.stringify(localReviews));
    }
    if (window.ReviewsModule.containerId) {
      window.ReviewsModule.renderReviews(window.ReviewsModule.getReviews(), window.ReviewsModule.containerId);
    }
  },
  renderStarInput: (containerId, inputName) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = `<div class="star-rating-input">
      <input type="hidden" name="${inputName}" id="${inputName}" value="5" required />`;
    for(let i=1; i<=5; i++) {
      html += `<span class="star" data-val="${i}" onclick="document.getElementById('${inputName}').value=${i}; this.parentElement.querySelectorAll('.star').forEach(s=>s.style.color=s.dataset.val<=${i}?'gold':'#ccc')">★</span>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    // Set initial styles
    setTimeout(() => {
      container.querySelectorAll('.star').forEach(s => s.style.color = 'gold');
    }, 0);
  }
};
