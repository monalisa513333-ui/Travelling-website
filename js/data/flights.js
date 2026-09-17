window.FLIGHTS = (function() {
  const routes = [
    { from: ['New York', 'NYC', 'JFK'], to: ['Paris', 'PAR', 'CDG'] },
    { from: ['Dubai', 'DXB', 'DXB'], to: ['Bali', 'DPS', 'DPS'] },
    { from: ['Tokyo', 'TYO', 'HND'], to: ['Singapore', 'SIN', 'SIN'] },
    { from: ['London', 'LON', 'LHR'], to: ['New York', 'NYC', 'JFK'] },
    { from: ['Paris', 'PAR', 'CDG'], to: ['Tokyo', 'TYO', 'NRT'] }
  ];
  return Array.from({ length: 30 }, (_, i) => {
    const route = routes[i % routes.length];
    return {
      id: 'f' + (i + 1),
      airline: 'AeroTravel Airlines',
      airlineCode: 'AT',
      logo: '✈️',
      from: { city: route.from[0], code: route.from[1], airport: route.from[2] + ' Intl' },
      to: { city: route.to[0], code: route.to[1], airport: route.to[2] + ' Intl' },
      departure: `2024-12-${10 + (i % 20)}T08:00:00`,
      arrival: `2024-12-${10 + (i % 20)}T16:00:00`,
      duration: (6 + (i % 6)) + 'h 30m',
      stops: i % 3 === 0 ? 1 : 0,
      class: ['economy', 'business', 'first'][i % 3],
      price: 300 + (i * 45),
      originalPrice: 400 + (i * 55),
      seats: 5 + i,
      amenities: ['In-flight Meals', 'Entertainment', 'WiFi', 'Extra Legroom'].slice(0, 2 + (i % 3)),
      aircraft: 'Boeing ' + (737 + (i % 50))
    };
  });
})();
