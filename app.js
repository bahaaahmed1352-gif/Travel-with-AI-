// =============================================
// مخطط السفر بالذكاء الاصطناعي - Vanilla JS MVP
// =============================================

let map;
let currentItinerary = [];
let currentDestination = '';

// Mock Data for Destinations
const mockData = {
    dubai: {
        name: 'دبي',
        coords: [25.2048, 55.2708],
        activities: {
            morning: ['زيارة برج خليفة', 'نزهة في حديقة زعبيل'],
            afternoon: ['التسوق في مول الإمارات', 'رحلة في نهر دبي'],
            evening: ['عشاء في برج العرب', 'عرض الألعاب النارية']
        },
        hotels: [
            { name: 'فندق أتلانتس', price: 1200, img: 'https://source.unsplash.com/random/400x300/?hotel,dubai' },
            { name: 'برج العرب', price: 2500, img: 'https://source.unsplash.com/random/400x300/?burj,arab' }
        ],
        restaurants: [
            { name: 'مطعم المطافئ', price: 450, img: 'https://source.unsplash.com/random/400x300/?restaurant,dubai' }
        ]
    },
    abudhabi: {
        name: 'أبوظبي',
        coords: [24.4539, 54.3773],
        activities: {
            morning: ['زيارة مسجد الشيخ زايد', 'استكشاف قصر الإمارات'],
            afternoon: ['ياس مارينا', 'عالم فيراري'],
            evening: ['كورنيش أبوظبي', 'عشاء بحري']
        },
        hotels: [
            { name: 'فندق الريتز كارلتون', price: 950, img: 'https://source.unsplash.com/random/400x300/?hotel,abudhabi' }
        ],
        restaurants: [
            { name: 'مطعم لو بيرو', price: 380, img: 'https://source.unsplash.com/random/400x300/?restaurant,abudhabi' }
        ]
    },
    rasalkhaimah: {
        name: 'رأس الخيمة',
        coords: [25.8000, 55.9667],
        activities: {
            morning: ['جبال الحجر', 'مغامرات في الصحراء'],
            afternoon: ['شواطئ رأس الخيمة', 'منتجع الوادي'],
            evening: ['تجربة الطعام المحلي', 'استرخاء في المنتجع']
        },
        hotels: [
            { name: 'منتجع والدورف أستوريا', price: 1100, img: 'https://source.unsplash.com/random/400x300/?resort,rak' }
        ],
        restaurants: [
            { name: 'مطعم الصحراء', price: 320, img: 'https://source.unsplash.com/random/400x300/?restaurant,rak' }
        ]
    }
};

// Initialize Leaflet Map
function initMap(destination) {
    if (map) {
        map.remove();
    }
    
    const destData = mockData[destination];
    map = L.map('map').setView(destData.coords, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    
    // Add marker for main destination
    L.marker(destData.coords).addTo(map)
        .bindPopup(`<b>${destData.name}</b><br>مركز الرحلة`)
        .openPopup();
}

// Generate Dynamic Itinerary
function generateItinerary(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const days = parseInt(document.getElementById('days').value);
    const budget = parseInt(document.getElementById('budget').value);
    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    
    if (!destination) {
        alert('يرجى اختيار الوجهة');
        return;
    }
    
    currentDestination = destination;
    currentItinerary = [];
    
    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    
    // Simulate AI processing delay
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        
        // Generate itinerary
        const destData = mockData[destination];
        const itineraryContainer = document.getElementById('itinerary-list');
        itineraryContainer.innerHTML = '';
        
        for (let day = 1; day <= days; day++) {
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.innerHTML = `
                <div class="day-header">
                    <i class="fas fa-calendar-day"></i>
                    <span>اليوم ${day} - ${destData.name}</span>
                </div>
                <div class="activity">
                    <i class="fas fa-sun"></i>
                    <div>
                        <strong>الصباح:</strong> ${destData.activities.morning[day % destData.activities.morning.length] || destData.activities.morning[0]}
                    </div>
                </div>
                <div class="activity">
                    <i class="fas fa-cloud-sun"></i>
                    <div>
                        <strong>الظهيرة:</strong> ${destData.activities.afternoon[day % destData.activities.afternoon.length] || destData.activities.afternoon[0]}
                    </div>
                </div>
                <div class="activity">
                    <i class="fas fa-moon"></i>
                    <div>
                        <strong>المساء:</strong> ${destData.activities.evening[day % destData.activities.evening.length] || destData.activities.evening[0]}
                    </div>
                </div>
            `;
            itineraryContainer.appendChild(dayCard);
            currentItinerary.push(`يوم ${day}`);
        }
        
        // Initialize Map
        initMap(destination);
        
        // Generate Budget
        generateBudget(budget);
        
        // Generate Booking Cards
        generateBookingCards(destData);
        
        // Smooth scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
    }, 1800);
}

// Budget Distribution
function generateBudget(totalBudget) {
    const tbody = document.querySelector('#budget-table tbody');
    tbody.innerHTML = '';
    
    const categories = [
        { name: 'الفنادق', percent: 35, color: '#0a2540' },
        { name: 'النقل', percent: 25, color: '#ff6b00' },
        { name: 'الأنشطة', percent: 25, color: '#28a745' },
        { name: 'الطعام', percent: 15, color: '#6f42c1' }
    ];
    
    categories.forEach(cat => {
        const amount = Math.round((cat.percent / 100) * totalBudget);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${cat.name}</strong></td>
            <td>${cat.percent}%</td>
            <td style="font-weight:700; color:${cat.color}">${amount.toLocaleString()} درهم</td>
        `;
        tbody.appendChild(row);
    });
    
    // Total row
    const totalRow = document.createElement('tr');
    totalRow.style.fontWeight = 'bold';
    totalRow.innerHTML = `
        <td>الإجمالي</td>
        <td>100%</td>
        <td>${totalBudget.toLocaleString()} درهم</td>
    `;
    tbody.appendChild(totalRow);
}

// Booking Cards
function generateBookingCards(destData) {
    const container = document.getElementById('booking-cards');
    container.innerHTML = '';
    
    // Hotels
    destData.hotels.forEach(hotel => {
        const card = createBookingCard(hotel, 'hotel');
        container.appendChild(card);
    });
    
    // Restaurants
    destData.restaurants.forEach(rest => {
        const card = createBookingCard(rest, 'restaurant');
        container.appendChild(card);
    });
}

function createBookingCard(item, type) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="content">
            <h4>${item.name}</h4>
            <p>${type === 'hotel' ? 'فاخر • 5 نجوم' : 'مطعم مميز'}</p>
            <p style="color: var(--accent-orange); font-weight:700;">${item.price} درهم</p>
            <button onclick="showBookingModal('${item.name}', '${type}')" class="btn-primary" style="width:100%; margin-top:12px;">
                ${type === 'hotel' ? 'احجز الغرفة' : 'احجز الطاولة'}
            </button>
        </div>
    `;
    return card;
}

// Modal
let currentBookingItem = null;

function showBookingModal(name, type) {
    currentBookingItem = { name, type };
    document.getElementById('modal-message').innerHTML = `
        هل تريد تأكيد حجز <strong>${name}</strong>؟
    `;
    document.getElementById('booking-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('booking-modal').classList.add('hidden');
}

function confirmBooking() {
    closeModal();
    
    const toast = document.getElementById('toast');
    toast.textContent = `تم حجز ${currentBookingItem.name} بنجاح! 🎉`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

// Export to PDF
function exportToPDF() {
    if (!currentItinerary.length) {
        alert('يرجى توليد خطة أولاً');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("مخطط السفر - " + mockData[currentDestination].name, 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}`, 20, 35);
    
    let y = 50;
    
    doc.text("البرنامج اليومي:", 20, y);
    y += 10;
    
    currentItinerary.forEach((day, index) => {
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
        doc.text(`• ${day}`, 25, y);
        y += 8;
    });
    
    y += 10;
    doc.text("تم إنشاؤه بواسطة AI Travel Planner", 105, y, { align: "center" });
    
    doc.save(`رحلة_${mockData[currentDestination].name}.pdf`);
}

// Start Planning Helper
function startPlanning() {
    document.getElementById('plan').scrollIntoView({ behavior: 'smooth' });
}

// Form Validation Helper (basic)
document.getElementById('trip-form').addEventListener('submit', function(e) {
    // Additional validation can be added here
});

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById('destination').focus();
    }
});

// Make functions global for inline onclick handlers
window.generateItinerary = generateItinerary;
window.initMap = initMap;
window.showBookingModal = showBookingModal;
window.closeModal = closeModal;
window.confirmBooking = confirmBooking;
window.exportToPDF = exportToPDF;
window.startPlanning = startPlanning;