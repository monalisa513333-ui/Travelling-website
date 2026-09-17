window.HOTELS = (function() {
  const amenitiesPool = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Beach Access', 'Airport Shuttle', 'Room Service'];
  return Array.from({ length: 20 }, (_, i) => {
    const destId = 'd' + ((i % 20) + 1);
    const category = ['luxury', 'boutique', 'budget', 'resort'][i % 4];
    return {
      id: 'h' + (i + 1),
      name: `Grand Hotel ${i + 1}`,
      destinationId: destId,
      location: 'City Center',
      description: 'A premium stay offering exceptional comfort, world-class amenities, and stunning views of the surrounding area.',
      images: Array.from({ length: 5 }, (_, j) => `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`),
      stars: 3 + (i % 3),
      rating: +(3.8 + (Math.random() * 1.2)).toFixed(1),
      reviewCount: 50 + (i * 20),
      pricePerNight: 100 + (i * 50),
      originalPrice: 150 + (i * 60),
      amenities: amenitiesPool.slice(0, 4 + (i % 5)),
      category: category,
      rooms: [
        {
          id: `r${i}_1`, type: 'Standard Room', description: 'Cozy and comfortable with essential amenities.',
          price: 100 + (i * 50), capacity: 2, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
          amenities: ['WiFi', 'TV', 'Air Conditioning'], available: true
        },
        {
          id: `r${i}_2`, type: 'Deluxe Suite', description: 'Spacious suite with a beautiful view and premium services.',
          price: 200 + (i * 50), capacity: 4, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
          amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service'], available: true
        }
      ],
      checkIn: '14:00',
      checkOut: '11:00',
      featured: i < 6,
      coordinates: { lat: 40.7128 + i, lng: -74.0060 + i }
    };
  });
})();
