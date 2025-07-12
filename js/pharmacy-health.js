// ===================================
// PHARMACY & HEALTH JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // SMOOTH SCROLL
    // ===================================
    const heroCtaBtn = document.querySelector('.hero-cta');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#pharmacies');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ===================================
    // FLOATING OPEN PHARMACY BUTTON
    // ===================================
    const floatingBtn = document.querySelector('#floatingOpenPharmacy');
    let lastScrollTop = 0;
    let scrollTimeout;
    
    if (floatingBtn) {
        // Add click handler
        floatingBtn.addEventListener('click', function() {
            // Show loading state
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Simulate opening pharmacy registration
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.disabled = false;
                
                // Show notification
                showNotification('Redirecting to pharmacy registration...', 'success');
                
                // In real implementation, redirect to pharmacy registration
                // window.location.href = '/register-pharmacy';
            }, 1000);
        });
        
        // Hide/show on scroll
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                floatingBtn.style.transform = 'translateX(200px)';
            } else {
                floatingBtn.style.transform = 'translateX(0)';
            }
            
            scrollTimeout = setTimeout(() => {
                floatingBtn.style.transform = 'translateX(0)';
            }, 1000);
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ===================================
    // EMERGENCY BUTTON
    // ===================================
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            // Simulate emergency call
            const confirmation = confirm('This will call the nearest 24/7 pharmacy. Continue?');
            if (confirmation) {
                showNotification('Connecting to emergency pharmacy...', 'success');
                // In real implementation: window.location.href = 'tel:+237600000000';
            }
        });
    }
    
    // ===================================
    // QUICK FILTERS
    // ===================================
    const quickFilters = document.querySelectorAll('.quick-filter');
    
    quickFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active from all
            quickFilters.forEach(f => f.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            applyQuickFilter(filterType);
        });
    });
    
    function applyQuickFilter(filterType) {
        console.log('Applying filter:', filterType);
        showNotification(`Filtering pharmacies: ${filterType}`);
        
        // Animate pharmacy cards
        const pharmacyCards = document.querySelectorAll('.pharmacy-card');
        pharmacyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ===================================
    // DISTANCE SLIDER
    // ===================================
    const distanceRange = document.querySelector('#distanceRange');
    const distanceValue = document.querySelector('#distanceValue');
    
    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', function() {
            distanceValue.textContent = this.value;
            // Apply distance filter
            console.log(`Filtering pharmacies within ${this.value} km`);
        });
    }
    
    // ===================================
    // FILTER CHECKBOXES
    // ===================================
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
        });
    });
    
    function applyFilters() {
        const filters = {
            prescription: document.querySelector('#prescriptionService')?.checked || false,
            consultation: document.querySelector('#consultationService')?.checked || false,
            vaccine: document.querySelector('#vaccineService')?.checked || false,
            orangeMoney: document.querySelector('#orangeMoneyPayment')?.checked || false,
            mobileMoney: document.querySelector('#mobileMoneyPayment')?.checked || false,
            insurance: document.querySelector('#insurancePayment')?.checked || false
        };
        
        console.log('Applying filters:', filters);
        showNotification('Filters applied');
    }
    
    // ===================================
    // PHARMACY ACTIONS
    // ===================================
    
    // Call buttons
    const callBtns = document.querySelectorAll('.action-btn.primary');
    callBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pharmacyCard = this.closest('.pharmacy-card');
            const pharmacyName = pharmacyCard.querySelector('.pharmacy-name').textContent;
            
            showNotification(`Calling ${pharmacyName}...`, 'success');
            // In real implementation: window.location.href = 'tel:+237600000000';
        });
    });
    
    // Direction buttons
    const directionBtns = document.querySelectorAll('.action-btn.secondary');
    directionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pharmacyCard = this.closest('.pharmacy-card');
            const pharmacyName = pharmacyCard.querySelector('.pharmacy-name').textContent;
            
            showNotification(`Opening directions to ${pharmacyName}...`, 'success');
            // In real implementation: open maps app
        });
    });
    
    // ===================================
    // GALLERY PREVIEW
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item:not(.more)');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Simple preview - in real implementation, open lightbox
                const imgSrc = img.src;
                console.log('Opening image:', imgSrc);
                showNotification('Opening gallery preview...');
            }
        });
    });
    
    // More gallery items
    const moreGalleryBtns = document.querySelectorAll('.gallery-item.more');
    moreGalleryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pharmacyCard = this.closest('.pharmacy-card');
            const pharmacyName = pharmacyCard.querySelector('.pharmacy-name').textContent;
            showNotification(`View all photos of ${pharmacyName}`);
        });
    });
    
    // ===================================
    // SORT FUNCTIONALITY
    // ===================================
    const sortDropdown = document.querySelector('#sortPharmacies');
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            
            showNotification(`Sorting pharmacies by ${sortValue}`);
            
            // Animate cards
            const pharmacyCards = document.querySelectorAll('.pharmacy-card');
            pharmacyCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 100);
            });
        });
    }
    
    // ===================================
    // LOAD MORE FUNCTIONALITY
    // ===================================
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentPage = 1;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading more pharmacies
            setTimeout(() => {
                currentPage++;
                console.log('Loading page:', currentPage);
                
                // For demo, clone existing pharmacy
                const pharmaciesGrid = document.querySelector('.pharmacies-grid');
                const firstPharmacy = document.querySelector('.pharmacy-card');
                
                if (firstPharmacy) {
                    const clone = firstPharmacy.cloneNode(true);
                    clone.style.opacity = '0';
                    clone.style.transform = 'translateY(20px)';
                    pharmaciesGrid.appendChild(clone);
                    
                    // Update clone content
                    const cloneName = clone.querySelector('.pharmacy-name');
                    if (cloneName) {
                        cloneName.textContent = `New Pharmacy ${currentPage}`;
                    }
                    
                    // Animate in
                    setTimeout(() => {
                        clone.style.opacity = '1';
                        clone.style.transform = 'translateY(0)';
                    }, 100);
                }
                
                // Reset button
                this.disabled = false;
                this.innerHTML = '<span>Load More Pharmacies</span> <i class="fas fa-chevron-down"></i>';
                
                showNotification('More pharmacies loaded successfully');
                
                // Hide button after 5 pages
                if (currentPage >= 5) {
                    this.style.display = 'none';
                    showNotification('All pharmacies loaded');
                }
            }, 1500);
        });
    }
    
    // ===================================
    // SEARCH FUNCTIONALITY
    // ===================================
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            showNotification(`Searching for "${searchTerm}"...`);
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ===================================
    // INITIALIZE COMPONENTS
    // ===================================
    
    // Add smooth transitions
    const pharmacyCards = document.querySelectorAll('.pharmacy-card');
    pharmacyCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
    });
    
    // Check pharmacy status and update periodically
    function updatePharmacyStatus() {
        const statusElements = document.querySelectorAll('.pharmacy-status');
        const currentHour = new Date().getHours();
        
        statusElements.forEach(status => {
            // This is demo logic - in real app, check actual pharmacy hours
            if (status.classList.contains('open') && (currentHour < 8 || currentHour > 21)) {
                status.classList.remove('open');
                status.classList.add('closed');
                status.innerHTML = '<i class="fas fa-clock"></i> Closed';
            }
        });
    }
    
    // Update status every minute
    setInterval(updatePharmacyStatus, 60000);
    
    // Initialize tooltips
    const infoRows = document.querySelectorAll('.info-row');
    infoRows.forEach(row => {
        row.style.cursor = 'help';
        row.title = 'Click for more information';
    });
});

// ===================================
// NOTIFICATION STYLES
// ===================================
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 80px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #16a085;
}

.notification.info {
    border-left: 4px solid #3498db;
}

.notification i {
    font-size: 1.2rem;
}

.notification.success i {
    color: #16a085;
}

.notification.info i {
    color: #3498db;
}

/* Floating button adjustments */
.floating-pharmacy-btn {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', notificationStyles);