window.REVIEWS_DATA = (function() {
  return Array.from({ length: 30 }, (_, i) => {
    return {
      id: 'rev' + (i + 1),
      userId: 'u' + ((i % 5) + 1),
      userName: `Traveler ${i + 1}`,
      userAvatar: '',
      destination: 'Amazing Destination',
      destinationId: 'd' + ((i % 20) + 1),
      hotel: i % 2 === 0 ? 'h' + ((i % 20) + 1) : null,
      package: i % 2 !== 0 ? 'pkg' + ((i % 15) + 1) : null,
      rating: 4 + (i % 2),
      title: ['Incredible experience!', 'Highly recommended', 'Beautiful views', 'Great value', 'Unforgettable trip'][i % 5],
      body: 'We had a wonderful time. The service was excellent, and the locations were breathtaking. I would definitely book this again and recommend it to all my friends and family.',
      date: `2024-02-${10 + (i % 18)}`,
      helpful: i * 3,
      verified: true,
      tags: ['couple', 'holiday', 'family', 'solo'][i % 4]
    };
  });
})();
