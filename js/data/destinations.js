window.DESTINATIONS = (function() {
  const destNames = [
    "Bali Indonesia", "Paris France", "Maldives", "Tokyo Japan", "Santorini Greece", 
    "Safari Kenya", "New York USA", "Machu Picchu Peru", "Dubai UAE", "Amalfi Coast Italy", 
    "Iceland Reykjavik", "Singapore", "Prague Czech Republic", "Swiss Alps", "Phuket Thailand", 
    "Rio de Janeiro Brazil", "Cairo Egypt", "New Zealand Queenstown", "Barcelona Spain", "Morocco Marrakech"
  ];
  const images = [
    "1537996194471-e657df975ab4", "1502602898657-3e91760cbb34", "1544551763-46a013bb70d5", 
    "1540959733332-eab4deabeeaf", "1570077188670-e3a8d69ac5ff", "1547036967-23d11aacaee0", 
    "1496442226666-8d4d0e62e6e9", "1587595431973-160d0d94add1", "1512453979798-5ea266f8880c", 
    "1570077188670-e3a8d69ac5ff"
  ];
  const categories = ['beach', 'city', 'beach', 'city', 'culture', 'safari', 'city', 'mountain', 'city', 'beach', 'mountain', 'city', 'culture', 'mountain', 'beach', 'city', 'culture', 'mountain', 'culture', 'culture'];
  const continents = ['Asia', 'Europe', 'Asia', 'Asia', 'Europe', 'Africa', 'Americas', 'Americas', 'Asia', 'Europe', 'Europe', 'Asia', 'Europe', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania', 'Europe', 'Africa'];

  return destNames.map((fullName, i) => {
    let parts = fullName.split(" ");
    let country = parts.pop();
    let name = parts.join(" ");
    if (fullName === "Safari Kenya") { name = "Safari"; country = "Kenya"; }
    else if (fullName === "New Zealand Queenstown") { name = "Queenstown"; country = "New Zealand"; }
    else if (fullName === "Amalfi Coast Italy") { name = "Amalfi Coast"; country = "Italy"; }
    
    return {
      id: 'd' + (i + 1),
      name: name || fullName,
      country: country,
      continent: continents[i],
      description: `Discover the breathtaking beauty and rich culture of ${name || fullName}.`,
      longDescription: `Experience the magic of ${name || fullName} with our exclusive travel packages. Discover hidden gems, indulge in local cuisine, and create unforgettable memories in ${country}. Our expertly curated itineraries ensure you get the most out of your journey.`,
      image: `https://images.unsplash.com/photo-${images[i % images.length]}?w=800&q=80`,
      images: Array.from({length: 5}, (_, j) => `https://images.unsplash.com/photo-${images[(i + j) % images.length]}?w=800&q=80`),
      category: categories[i],
      rating: +(4.2 + (Math.random() * 0.8)).toFixed(1),
      reviewCount: 150 + Math.floor(Math.random() * 800),
      price: 800 + (i * 150) % 2000,
      duration: 3 + Math.floor(Math.random() * 10),
      activities: ['Sightseeing', 'Photography', 'Food Tasting', 'Local Tours'],
      highlights: ['Iconic Landmarks', 'Local Markets', 'Nature Reserves'],
      bestTime: 'Spring and Autumn',
      climate: i % 2 === 0 ? 'Tropical' : 'Temperate',
      tags: ['popular', 'scenic', 'adventure'],
      featured: i < 8,
      popular: i % 2 === 0
    };
  });
})();
