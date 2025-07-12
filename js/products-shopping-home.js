// ===================================
// SHOPS LISTING JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // SMOOTH SCROLL
    // ===================================
    const heroCtaBtn = document.querySelector('.hero-cta');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#shops');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ===================================
    // FLOATING CREATE SHOP BUTTON
    // ===================================
    const floatingBtn = document.querySelector('#floatingCreateShop');
    let lastScrollTop = 0;
    let scrollTimeout;
    
    if (floatingBtn) {
        // Add click handler
        floatingBtn.addEventListener('click', function() {
            // Show loading state
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Simulate navigation to create shop page
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.disabled = false;
                
                // Show notification
                showNotification('Redirecting to Create Shop page...', 'success');
                
                // In real implementation, redirect to create shop page
                // window.location.href = '/create-shop';
            }, 1000);
        });
        
        // Hide/show on scroll for better UX
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide button when scrolling down
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                floatingBtn.style.transform = 'translateX(200px)';
            } else {
                floatingBtn.style.transform = 'translateX(0)';
            }
            
            // Show button again after scrolling stops
            scrollTimeout = setTimeout(() => {
                floatingBtn.style.transform = 'translateX(0)';
            }, 1000);
            
            lastScrollTop = scrollTop;
        });
        
        // Add hover effect for mobile tooltip
        floatingBtn.addEventListener('mouseenter', function() {
            if (window.innerWidth <= 768) {
                const text = this.querySelector('.floating-btn-text');
                if (text && text.style.display === 'none') {
                    // Mobile hover shows text
                }
            }
        });
    }
    
    // ===================================
    // FILTER FUNCTIONALITY
    // ===================================
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const ratingFilters = document.querySelectorAll('.rating-filter input');
    const locationSelect = document.querySelector('.location-select');
    const sortDropdown = document.querySelector('#sortShops');
    
    // Handle filter changes
    function applyFilters() {
        // Get all filter values
        const filters = {
            verified: document.querySelector('#verifiedShops')?.checked || false,
            freeDelivery: document.querySelector('#freeDelivery')?.checked || false,
            rating: document.querySelector('input[name="rating"]:checked')?.value || null,
            location: locationSelect?.value || ''
        };
        
        console.log('Applying filters:', filters);
        
        // Here you would typically make an API call to fetch filtered results
        // For now, we'll just show a notification
        showNotification('Filters applied');
        
        // Update results count
        updateResultsCount();
    }
    
    // Add event listeners to filters
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    ratingFilters.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    if (locationSelect) {
        locationSelect.addEventListener('change', applyFilters);
    }
    
    // ===================================
    // SORT FUNCTIONALITY
    // ===================================
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            
            // Here you would typically sort the shops
            showNotification(`Sorting shops by ${sortValue}`);
            
            // Simulate sorting animation
            const shopCards = document.querySelectorAll('.shop-card');
            shopCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }
    
    // ===================================
    // CHAT FUNCTIONALITY
    // ===================================
    const chatBtns = document.querySelectorAll('.chat-btn');
    
    chatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const shopCard = this.closest('.shop-card');
            const shopName = shopCard.querySelector('.shop-name').textContent;
            
            // Show loading state
            this.disabled = true;
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate opening chat
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showNotification(`Opening chat with ${shopName}`, 'success');
                
                // In real implementation, open chat widget or redirect
                // openChatWidget(shopId);
            }, 1000);
        });
    });
    
    // ===================================
    // PRODUCT PREVIEW HOVER
    // ===================================
    const productPreviews = document.querySelectorAll('.product-preview');
    
    productPreviews.forEach(preview => {
        preview.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            img.style.transform = 'scale(1.1)';
        });
        
        preview.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            img.style.transform = 'scale(1)';
        });
        
        preview.addEventListener('click', function() {
            const shopCard = this.closest('.shop-card');
            const shopName = shopCard.querySelector('.shop-name').textContent;
            showNotification(`Please visit ${shopName} to view this product`);
        });
    });
    
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
            
            // Simulate loading more shops
            setTimeout(() => {
                // Here you would load more shops from API
                currentPage++;
                console.log('Loading page:', currentPage);
                
                // For demo, we'll clone existing shops
                const shopsGrid = document.querySelector('.shops-grid');
                const existingShops = document.querySelectorAll('.shop-card');
                
                existingShops.forEach((shop, index) => {
                    if (index < 2) { // Clone only first 2 for demo
                        const clone = shop.cloneNode(true);
                        clone.style.opacity = '0';
                        clone.style.transform = 'translateY(20px)';
                        shopsGrid.appendChild(clone);
                        
                        // Animate in
                        setTimeout(() => {
                            clone.style.opacity = '1';
                            clone.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
                
                // Reset button
                this.disabled = false;
                this.innerHTML = '<span>Load More Shops</span> <i class="fas fa-chevron-down"></i>';
                
                // Update results count
                updateResultsCount();
                
                // Show notification
                showNotification('More shops loaded successfully');
                
                // Hide button if no more shops (example: after 5 pages)
                if (currentPage >= 5) {
                    this.style.display = 'none';
                    showNotification('All shops loaded');
                }
            }, 1500);
        });
    }
    
    // ===================================
    // UPDATE RESULTS COUNT
    // ===================================
    function updateResultsCount() {
        const resultsCount = document.querySelector('.results-count');
        const shopCards = document.querySelectorAll('.shop-card');
        
        if (resultsCount) {
            resultsCount.textContent = `${shopCards.length} shops found`;
        }
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
            
            // Here you would implement actual search
            // filterShopsBySearch(searchTerm);
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
    // RESPONSIVE FILTERS TOGGLE (Mobile)
    // ===================================
    const filtersToggle = document.createElement('button');
    filtersToggle.className = 'filters-toggle-mobile';
    filtersToggle.innerHTML = '<i class="fas fa-filter"></i> Filters';
    filtersToggle.style.display = 'none';
    
    const filtersSidebar = document.querySelector('.filters-sidebar');
    
    if (filtersSidebar) {
        filtersSidebar.parentNode.insertBefore(filtersToggle, filtersSidebar);
        
        filtersToggle.addEventListener('click', function() {
            filtersSidebar.classList.toggle('mobile-open');
            document.body.classList.toggle('filters-open');
        });
        
        // Show/hide toggle based on screen size
        function checkScreenSize() {
            if (window.innerWidth <= 992) {
                filtersToggle.style.display = 'block';
            } else {
                filtersToggle.style.display = 'none';
                filtersSidebar.classList.remove('mobile-open');
                document.body.classList.remove('filters-open');
            }
        }
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
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
    
    // Add smooth transitions to all shop cards
    const shopCards = document.querySelectorAll('.shop-card');
    shopCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
    });
    
    // Add hover effects to product images
    const productImages = document.querySelectorAll('.product-preview img');
    productImages.forEach(img => {
        img.style.transition = 'transform 0.3s ease';
    });
    
    // Initialize tooltips for response times
    const responseTimes = document.querySelectorAll('.response-time');
    responseTimes.forEach(time => {
        time.title = 'Average response time to customer inquiries';
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
    border-left: 4px solid #10b981;
}

.notification.info {
    border-left: 4px solid #3b82f6;
}

.notification i {
    font-size: 1.2rem;
}

.notification.success i {
    color: #10b981;
}

.notification.info i {
    color: #3b82f6;
}

/* Mobile Filters Toggle */
.filters-toggle-mobile {
    display: none;
    width: 100%;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filters-toggle-mobile:hover {
    background: var(--primary-dark);
}

/* Floating button adjustments */
.floating-create-shop-btn {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (max-width: 992px) {
    .filters-sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        width: 300px;
        height: 100vh;
        background: white;
        z-index: 1000;
        transition: left 0.3s ease;
        overflow-y: auto;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .filters-sidebar.mobile-open {
        left: 0;
    }
    
    body.filters-open::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
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