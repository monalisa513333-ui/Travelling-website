window.PACKAGES = (function() {
  return Array.from({ length: 15 }, (_, i) => {
    return {
      id: 'pkg' + (i + 1),
      title: `Ultimate Adventure Package ${i + 1}`,
      destinationId: 'd' + ((i % 20) + 1),
      destination: 'Multiple Locations',
      country: 'Global',
      image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
      images: Array.from({length: 4}, () => 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80'),
      description: 'An amazing all-inclusive travel package that covers everything you need.',
      longDescription: 'Enjoy a fully planned itinerary with premium accommodations, selected flights, and exclusive guided activities. Perfect for those who want a stress-free travel experience.',
      duration: 5 + (i % 10),
      groupSize: 10 + (i % 10),
      price: 1000 + (i * 150),
      originalPrice: 1200 + (i * 150),
      rating: +(4.5 + (Math.random() * 0.5)).toFixed(1),
      reviewCount: 80 + i,
      difficulty: ['easy', 'moderate', 'challenging'][i % 3],
      inclusions: ['Accommodation', 'Daily Meals', 'Expert Guide', 'Transport'],
      exclusions: ['Personal Expenses', 'Travel Insurance', 'International Flights'],
      itinerary: [
        { day: 1, title: 'Arrival & Welcome', activities: ['Airport Transfer', 'Check-in', 'Welcome Dinner'], meals: ['Dinner'], accommodation: 'Premium Hotel' },
        { day: 2, title: 'Explore the City', activities: ['Guided City Tour', 'Museum Visit', 'Free Time'], meals: ['Breakfast', 'Lunch'], accommodation: 'Premium Hotel' },
        { day: 3, title: 'Adventure Day', activities: ['Hiking/Nature Walk', 'Local Cultural Show'], meals: ['Breakfast', 'Dinner'], accommodation: 'Premium Hotel' }
      ],
      highlights: ['VIP Guided Tours', 'Premium Stays', 'Authentic Local Experiences'],
      category: ['adventure', 'relax', 'cultural'][i % 3],
      featured: i < 5,
      tags: ['tour', 'all-inclusive', 'guided']
    };
  });
})();
