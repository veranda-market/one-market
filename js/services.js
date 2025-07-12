// ===================================
// SERVICES PAGE JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // PRELOADER
    // ===================================
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 500);
    });

    // ===================================
    // HERO SEARCH FUNCTIONALITY
    // ===================================
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroSearchBtn = document.querySelector('.hero-search-btn');
    const serviceTags = document.querySelectorAll('.service-tag');
    
    // Service data for search
    const services = [
        { name: 'Plumbing', category: 'home', keywords: ['plumber', 'pipe', 'leak', 'water'] },
        { name: 'Electrical Work', category: 'home', keywords: ['electrician', 'wiring', 'electricity'] },
        { name: 'House Cleaning', category: 'cleaning', keywords: ['clean', 'maid', 'housekeeping'] },
        { name: 'Painting', category: 'home', keywords: ['painter', 'paint', 'wall'] },
        { name: 'Carpentry', category: 'home', keywords: ['carpenter', 'wood', 'furniture'] },
        { name: 'Auto Mechanic', category: 'automotive', keywords: ['mechanic', 'car', 'repair', 'vehicle'] },
        { name: 'Hair Styling', category: 'beauty', keywords: ['hair', 'salon', 'barber', 'haircut'] },
        { name: 'Computer Repair', category: 'tech', keywords: ['computer', 'laptop', 'IT', 'tech'] }
    ];

    // Handle search
    function handleSearch() {
        const searchTerm = heroSearchInput.value.toLowerCase().trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            // Here you would implement actual search functionality
            // For now, we'll just show an alert
            showSearchResults(searchTerm);
        }
    }

    // Show search results (mock implementation)
    function showSearchResults(term) {
        const results = services.filter(service => 
            service.name.toLowerCase().includes(term) ||
            service.keywords.some(keyword => keyword.includes(term))
        );
        
        if (results.length > 0) {
            console.log('Found services:', results);
            // Scroll to categories section
            document.querySelector('.service-categories').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            showNotification('No services found. Try different keywords.');
        }
    }

    // Search event listeners
    heroSearchBtn.addEventListener('click', handleSearch);
    heroSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Service tag clicks
    serviceTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            heroSearchInput.value = service;
            handleSearch();
        });
    });

    // ===================================
    // LOCATION DROPDOWN
    // ===================================
    const deliverLocation = document.getElementById('deliverLocation');
    const locationDropdown = document.querySelector('.location-dropdown');
    const locationItems = locationDropdown.querySelectorAll('li');

    locationItems.forEach(item => {
        item.addEventListener('click', function() {
            const city = this.textContent;
            deliverLocation.textContent = city;
            localStorage.setItem('selectedLocation', city);
        });
    });

    // Load saved location
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
        deliverLocation.textContent = savedLocation;
    }

    // ===================================
    // CATEGORY CARDS INTERACTION
    // ===================================
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                filterProfessionals(category);
            }
        });
    });

    // ===================================
    // PROFESSIONALS FILTERING
    // ===================================
    const filterPills = document.querySelectorAll('.filter-pill');
    const professionalCards = document.querySelectorAll('.professional-card');

    function filterProfessionals(category) {
        // Update active filter
        filterPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.getAttribute('data-filter') === category) {
                pill.classList.add('active');
            }
        });

        // Filter cards
        professionalCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Scroll to professionals section
        document.querySelector('.featured-professionals').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // Filter pill clicks
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProfessionals(filter);
        });
    });

    // ===================================
    // PROFESSIONAL CARD INTERACTIONS
    // ===================================
    const contactBtns = document.querySelectorAll('.btn-contact');
    const bookBtns = document.querySelectorAll('.btn-book');

    contactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.professional-card');
            const proName = card.querySelector('.pro-name').textContent;
            showNotification(`Opening chat with ${proName}...`);
        });
    });

    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.professional-card');
            const proName = card.querySelector('.pro-name').textContent;
            showBookingModal(proName);
        });
    });

    // ===================================
    // BOOKING MODAL
    // ===================================
    function showBookingModal(proName) {
        // Create modal HTML
        const modalHTML = `
            <div class="booking-modal" id="bookingModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Book ${proName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="bookingForm">
                            <div class="form-group">
                                <label>Select Date</label>
                                <input type="date" required min="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-group">
                                <label>Select Time</label>
                                <select required>
                                    <option value="">Choose time slot</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                    <option value="16:00">04:00 PM</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Describe your needs</label>
                                <textarea rows="3" placeholder="Please describe the service you need..." required></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-confirm">Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('bookingModal');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const form = modal.querySelector('#bookingForm');

        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);

        // Close modal function
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }

        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification(`Booking request sent to ${proName}!`);
            closeModal();
        });
    }

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHORS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.category-card, .professional-card, .step').forEach(el => {
        observer.observe(el);
    });

    // ===================================
    // DYNAMIC CONTENT LOADING (MOCK)
    // ===================================
    const viewAllBtn = document.querySelector('.view-all-btn');
    
    viewAllBtn.addEventListener('click', function() {
        showNotification('Loading more professionals...');
        
        // Simulate loading more content
        setTimeout(() => {
            const grid = document.querySelector('.professionals-grid');
            const newCards = generateProfessionalCards(3);
            grid.insertAdjacentHTML('beforeend', newCards);
            
            // Re-attach event listeners to new cards
            attachCardEventListeners();
        }, 1000);
    });

    function generateProfessionalCards(count) {
        const professionals = [
            { name: 'Paul Mbarga', title: 'Professional Plumber', location: 'Douala, Akwa', rating: '4.7' },
            { name: 'Fatima Aisha', title: 'House Cleaner', location: 'Yaoundé, Mfandena', rating: '4.9' },
            { name: 'Michel Tagne', title: 'Auto Mechanic', location: 'Bafoussam, Centre', rating: '4.8' }
        ];

        let html = '';
        for (let i = 0; i < count; i++) {
            const pro = professionals[i % professionals.length];
            html += `
                <div class="professional-card" data-category="all">
                    <div class="pro-badge">
                        <i class="fas fa-shield-alt"></i> New Pro
                    </div>
                    <div class="pro-header">
                        <div class="pro-avatar">
                            <img src="https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90)}.jpg" alt="${pro.name}">
                            <span class="availability-status online"></span>
                        </div>
                        <div class="pro-info">
                            <h3 class="pro-name">${pro.name}</h3>
                            <p class="pro-title">${pro.title}</p>
                            <div class="pro-location">
                                <i class="fas fa-map-marker-alt"></i> ${pro.location}
                            </div>
                        </div>
                    </div>
                    <div class="pro-stats">
                        <div class="stat">
                            <span class="stat-value">${pro.rating}</span>
                            <span class="stat-label">Rating</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Jobs</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">New</span>
                            <span class="stat-label">Member</span>
                        </div>
                    </div>
                    <div class="pro-pricing">
                        <span class="price-label">Starting at</span>
                        <span class="price-value">Discuss</span>
                    </div>
                    <div class="pro-actions">
                        <button class="btn-contact">
                            <i class="fas fa-comment"></i> Contact
                        </button>
                        <button class="btn-book">
                            <i class="fas fa-calendar-check"></i> Book Now
                        </button>
                    </div>
                </div>
            `;
        }
        return html;
    }

    function attachCardEventListeners() {
        // Re-attach event listeners to newly added cards
        document.querySelectorAll('.btn-contact:not([data-initialized])').forEach(btn => {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function() {
                const card = this.closest('.professional-card');
                const proName = card.querySelector('.pro-name').textContent;
                showNotification(`Opening chat with ${proName}...`);
            });
        });

        document.querySelectorAll('.btn-book:not([data-initialized])').forEach(btn => {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function() {
                const card = this.closest('.professional-card');
                const proName = card.querySelector('.pro-name').textContent;
                showBookingModal(proName);
            });
        });
    }

    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===================================
    // CTA BUTTON
    // ===================================
    const ctaBtn = document.querySelector('.cta-btn');
    
    ctaBtn.addEventListener('click', function() {
        showNotification('Redirecting to Pro registration...');
        // Here you would redirect to the registration page
        setTimeout(() => {
            console.log('Redirect to pro registration');
        }, 1500);
    });

});

// ===================================
// ADDITIONAL STYLES FOR MODAL & NOTIFICATIONS
// ===================================
const additionalStyles = `
<style>
/* Booking Modal */
.booking-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 1rem;
}

.booking-modal.show {
    opacity: 1;
}

.modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.booking-modal.show .modal-content {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #111827;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f3f4f6;
    color: #111827;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #1a8917;
    box-shadow: 0 0 0 3px rgba(26, 137, 23, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

.btn-cancel,
.btn-confirm {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-cancel {
    background: #f3f4f6;
    color: #6b7280;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-confirm {
    background: #1a8917;
    color: white;
}

.btn-confirm:hover {
    background: #146812;
}

/* Notifications */
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10001;
    max-width: 350px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #10b981;
}

.notification.success i {
    color: #10b981;
}

.notification.info {
    border-left: 4px solid #3b82f6;
}

.notification.info i {
    color: #3b82f6;
}

/* Animation Classes */
.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);