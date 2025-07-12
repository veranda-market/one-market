initializeSlidingCategories();// ===================================
// SLIDING CATEGORIES
// ===================================
function initializeSlidingCategories() {
    // The CSS handles the animation, but we can add click handlers
    const categoryCards = document.querySelectorAll('.categories-track .category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.querySelector('h3').textContent;
            console.log('Selected category:', categoryName);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Show category selection
            showCategoryToast(categoryName);
        });
    });
}

// Show category selection toast
function showCategoryToast(category) {
    const toast = document.createElement('div');
    toast.className = 'category-toast';
    toast.innerHTML = `
        <i class="fas fa-check"></i>
        <span>Viewing ${category}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ===================================
// RENTAL SERVICES JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLocationSelector();
    initializeSearch();
    initializeCategoryNavigation();
    initializeCategoryCards();
    initializeSavedProperties();
    initializeReviewsAnimation();
    initializeMobileNavigation();
});

// ===================================
// LOCATION SELECTOR
// ===================================
function initializeLocationSelector() {
    const deliverLocation = document.getElementById('deliverLocation');
    const locationDropdown = document.querySelector('.location-dropdown');
    const locationItems = locationDropdown.querySelectorAll('li');
    const heroLocationText = document.querySelector('.location-text');
    
    // Handle location selection
    locationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedCity = this.getAttribute('data-city');
            const cityName = this.textContent;
            
            // Update main location display
            if (selectedCity === 'all') {
                deliverLocation.textContent = 'All Cameroon';
            } else {
                deliverLocation.textContent = cityName;
            }
            
            // Update hero location if exists
            if (heroLocationText && selectedCity !== 'all') {
                heroLocationText.textContent = cityName;
            }
            
            // Show loading state
            showLocationUpdateToast(cityName);
            
            // Simulate filtering properties
            filterPropertiesByLocation(selectedCity);
        });
    });
}

// Show toast notification for location update
function showLocationUpdateToast(location) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'location-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Showing rental items in ${location}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================
function initializeSearch() {
    const heroSearchInput = document.querySelector('.hero-search-input');
    const heroSearchBtn = document.querySelector('.hero-search-btn');
    const mainSearchInput = document.querySelector('.search-input');
    const mainSearchBtn = document.querySelector('.search-btn');
    
    // Hero search
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        heroSearchBtn.addEventListener('click', function() {
            performSearch(heroSearchInput.value);
        });
    }
    
    // Main search
    if (mainSearchInput) {
        mainSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        mainSearchBtn.addEventListener('click', function() {
            performSearch(mainSearchInput.value);
        });
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    
    // Show loading state
    const searchInputs = document.querySelectorAll('.hero-search-input, .search-input');
    searchInputs.forEach(input => {
        input.style.opacity = '0.5';
        input.disabled = true;
    });
    
    // Simulate search delay
    setTimeout(() => {
        searchInputs.forEach(input => {
            input.style.opacity = '1';
            input.disabled = false;
        });
        
        // Show results (in real app, this would navigate or update the page)
        showSearchResults(query);
    }, 1000);
}

// Show search results notification
function showSearchResults(query) {
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>Search Results</h4>
            <p>Found 24 items matching "${query}"</p>
            <button class="view-results-btn">View Results</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Handle view results button
    notification.querySelector('.view-results-btn').addEventListener('click', function() {
        notification.remove();
        // In real app, navigate to results page
    });
}

// ===================================
// CATEGORY NAVIGATION
// ===================================
function initializeCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('.rental-categories-nav .nav-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get category name
            const categoryName = this.querySelector('span').textContent;
            
            // Update page content based on category
            updateCategoryContent(categoryName);
        });
    });
}

// Update content based on selected category
function updateCategoryContent(category) {
    console.log('Selected category:', category);
    
    // Animate category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s both`;
        }, 10);
    });
}

// ===================================
// CATEGORY CARDS INTERACTION
// ===================================
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            console.log('Clicked category:', categoryName);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            // In real app, navigate to category page
        });
    });
}

// ===================================
// SAVED ITEMS
// ===================================
function initializeSavedProperties() {
    const savedIcon = document.querySelector('.saved-items');
    const savedCount = document.querySelector('.saved-count');
    let count = 0;
    
    if (savedIcon) {
        savedIcon.addEventListener('click', function() {
            // Toggle saved state (demo)
            count = count === 0 ? 3 : 0;
            savedCount.textContent = count;
            
            // Add animation
            savedIcon.style.animation = 'heartBeat 0.5s ease';
            setTimeout(() => {
                savedIcon.style.animation = '';
            }, 500);
        });
    }
}

// ===================================
// REVIEWS ANIMATION
// ===================================
function initializeReviewsAnimation() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.5s ease-out both';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all review cards
    reviewCards.forEach(card => {
        observer.observe(card);
    });
}

// ===================================
// MOBILE NAVIGATION
// ===================================
function initializeMobileNavigation() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            mobileNavItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation
            const itemText = this.querySelector('span').textContent;
            console.log('Mobile nav:', itemText);
        });
    });
}

// ===================================
// HELPER FUNCTIONS
// ===================================

// Filter items by location (simulation)
function filterPropertiesByLocation(location) {
    console.log('Filtering items for:', location);
    
    // In real app, this would make an API call
    // For demo, just animate the category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0.5';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 * index);
    });
}

// ===================================
// CSS ANIMATIONS
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes heartBeat {
        0%, 100% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.3);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.3);
        }
    }
    
    .notification-content h4 {
        margin: 0 0 0.5rem;
        color: var(--gray-900);
        font-size: 1.1rem;
    }
    
    .notification-content p {
        margin: 0 0 1rem;
        color: var(--gray-600);
        font-size: 0.9rem;
    }
    
    .view-results-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
    }
    
    .view-results-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);

// ===================================
// INITIALIZE SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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