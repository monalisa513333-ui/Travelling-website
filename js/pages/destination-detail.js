// destination-detail.js

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id || !window.DESTINATIONS) return;
    
    const destination = window.DESTINATIONS.find(d => d.id === id) || window.DESTINATIONS[0];
    if (!destination) return;
    
    // Populate simple fields
    document.title = `${destination.name} | TravelVerse`;
    document.getElementById('destBreadcrumb').textContent = destination.name;
    document.getElementById('destName').textContent = destination.name;
    document.getElementById('destCountry').textContent = destination.country;
    document.getElementById('destRatingStars').textContent = '⭐'.repeat(Math.round(destination.rating || 4));
    document.getElementById('destRatingNum').textContent = destination.rating || '4.5';
    document.getElementById('destDuration').textContent = 'Recommended: 3-7 Days';
    document.getElementById('destPrice').textContent = `$${destination.price}`;
    document.getElementById('sidebarPrice').textContent = `$${destination.price}`;
    document.getElementById('destDescription').innerHTML = `<p>${destination.description || 'A beautiful destination.'}</p>`;
    
    if (destination.image) {
        document.getElementById('destHero').style.backgroundImage = `url('${destination.image}')`;
    }
    
    // Tabs logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.style.display = 'none');
            
            btn.classList.add('active');
            document.getElementById(`tab${btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)}`).style.display = 'block';
        });
    });

    // Booking Logic
    const bookCheckin = document.getElementById('bookCheckin');
    const bookCheckout = document.getElementById('bookCheckout');
    const bookTravelers = document.getElementById('bookTravelers');
    const basePriceEl = document.getElementById('basePrice');
    const taxPriceEl = document.getElementById('taxPrice');
    const totalPriceEl = document.getElementById('totalPrice');
    const bookingForm = document.getElementById('destBookingForm');
    
    function updatePrice() {
        const travelers = parseInt(bookTravelers.value) || 1;
        const basePrice = destination.price * travelers;
        const tax = basePrice * 0.1;
        const total = basePrice + tax;
        
        basePriceEl.textContent = `$${basePrice.toFixed(2)}`;
        taxPriceEl.textContent = `$${tax.toFixed(2)}`;
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
    }
    
    bookTravelers.addEventListener('change', updatePrice);
    updatePrice();
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!Auth.isAuthenticated()) {
            window.location.href = './auth.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        
        if(!bookCheckin.value || !bookCheckout.value) {
            alert('Please select check-in and check-out dates.');
            return;
        }
        
        const travelers = parseInt(bookTravelers.value) || 1;
        const basePrice = destination.price * travelers;
        const total = basePrice * 1.1;
        
        const bookingId = 'BKG' + Math.floor(Math.random() * 1000000);
        
        const booking = {
            id: bookingId,
            userId: Auth.getCurrentUser().id,
            type: 'destination',
            status: 'confirmed',
            details: {
                destinationId: destination.id,
                destinationName: destination.name,
                checkIn: bookCheckin.value,
                checkOut: bookCheckout.value,
                travelers: travelers
            },
            amount: total,
            createdAt: new Date().toISOString()
        };
        
        let bookings = JSON.parse(localStorage.getItem('tv_bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('tv_bookings', JSON.stringify(bookings));
        
        document.getElementById('bookingRefId').textContent = bookingId;
        document.getElementById('bookingModal').showModal();
    });
    
    document.getElementById('addWishlist').addEventListener('click', () => {
        Utils.toggleWishlist(destination.id, 'destination', destination.name, destination.image);
    });
});
