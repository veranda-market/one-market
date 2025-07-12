// ===================================
// SHOP TEMPLATE JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const shopNav = document.querySelector('.shop-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            shopNav.classList.toggle('menu-open');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // ===================================
    // STICKY HEADER
    // ===================================
    const header = document.querySelector('.shop-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===================================
    // PRODUCT QUICK VIEW
    // ===================================
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Here you would load product details via AJAX
            quickViewModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            quickViewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            quickViewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===================================
    // FAVORITE TOGGLE
    // ===================================
    const favoriteBtns = document.querySelectorAll('.favorite');
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            this.classList.toggle('active');
            
            // Show notification
            showNotification('Product ' + (icon.classList.contains('fas') ? 'added to' : 'removed from') + ' favorites!');
        });
    });
    
    // ===================================
    // GALLERY TABS
    // ===================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // ===================================
    // GALLERY LIGHTBOX
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryLightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            galleryLightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeLightbox) {
        closeLightbox.addEventListener('click', function() {
            galleryLightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close lightbox when clicking outside
    galleryLightbox?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===================================
    // LOAD MORE PRODUCTS
    // ===================================
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const productsGrid = document.querySelector('.products-grid');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more products
            this.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            setTimeout(() => {
                // Here you would load more products via AJAX
                // For demo, we'll just show a message
                this.innerHTML = '<span>Load More Products</span> <i class="fas fa-chevron-down"></i>';
                this.disabled = false;
                showNotification('More products loaded!');
            }, 1500);
        });
    }
    
    // ===================================
    // ADD TO CART FUNCTIONALITY
    // ===================================
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product title
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            // Animate button
            this.disabled = true;
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            
            // Show notification
            showNotification(`"${productTitle}" has been added to your cart!`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 2000);
            
            // Update cart count (you would integrate with actual cart logic)
            updateCartCount();
        });
    });
    
    // ===================================
    // BUY NOW FUNCTIONALITY
    // ===================================
    const buyNowBtns = document.querySelectorAll('.buy-now-btn');
    
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            // Show loading state
            this.disabled = true;
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Simulate redirect to checkout
            setTimeout(() => {
                showNotification(`Redirecting to checkout for "${productTitle}"...`, 'info');
                // In real implementation, redirect to checkout page
                // window.location.href = '/checkout?product=' + productId;
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 1500);
        });
    });
    
    // ===================================
    // UPDATE CART COUNT
    // ===================================
    function updateCartCount() {
        // This would integrate with your actual cart system
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
            
            // Add animation
            cartCount.classList.add('bounce');
            setTimeout(() => {
                cartCount.classList.remove('bounce');
            }, 500);
        }
    }
    
    // ===================================
    // INQUIRY FORM
    // ===================================
    const inquiryForm = document.querySelector('.inquiry-form');
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Disable submit button
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                // Reset form
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Your message has been sent successfully!', 'success');
            }, 2000);
        });
    }
    
    // ===================================
    // SEARCH FUNCTIONALITY
    // ===================================
    const shopSearchInput = document.querySelector('.shop-search-input');
    const shopSearchBtn = document.querySelector('.shop-search-btn');
    
    if (shopSearchBtn) {
        shopSearchBtn.addEventListener('click', function() {
            const searchTerm = shopSearchInput.value.trim();
            if (searchTerm) {
                // Perform search
                console.log('Searching for:', searchTerm);
                showNotification(`Searching for "${searchTerm}"...`);
            }
        });
    }
    
    if (shopSearchInput) {
        shopSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                shopSearchBtn.click();
            }
        });
    }
    
    // ===================================
    // PRODUCT SORTING
    // ===================================
    const sortDropdown = document.querySelector('.sort-dropdown');
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            showNotification(`Sorting products by ${sortValue}`);
            // Here you would implement actual sorting logic
        });
    }
    
    // ===================================
    // VIEW TOGGLE (Grid/List)
    // ===================================
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            viewToggles.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const isGridView = this.classList.contains('grid-view');
            productsGrid?.classList.toggle('list-view', !isGridView);
            
            showNotification(`Switched to ${isGridView ? 'grid' : 'list'} view`);
        });
    });
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
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
    // NOTIFICATION FUNCTION
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
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas ${iconClass}"></i>
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
    // LAZY LOADING IMAGES
    // ===================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // ===================================
    // CONTACT SUPPLIER BUTTON
    // ===================================
    const contactSupplierBtn = document.querySelector('.contact-supplier-btn');
    
    if (contactSupplierBtn) {
        contactSupplierBtn.addEventListener('click', function() {
            // Scroll to contact section
            const contactSection = document.querySelector('.shop-contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===================================
    // NEWSLETTER FORM
    // ===================================
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const submitBtn = this.querySelector('.newsletter-btn');
            const originalText = submitBtn.innerHTML;
            
            // Validate email
            const email = emailInput.value.trim();
            if (!email || !email.includes('@')) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                emailInput.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Successfully subscribed to our newsletter!', 'success');
            }, 1500);
        });
    }
    
    // ===================================
    // INITIALIZE SWIPER (if needed)
    // ===================================
    if (typeof Swiper !== 'undefined') {
        // Initialize any Swiper sliders here
        // Example:
        // const heroSwiper = new Swiper('.hero-swiper', {
        //     loop: true,
        //     autoplay: {
        //         delay: 5000,
        //     },
        //     pagination: {
        //         el: '.swiper-pagination',
        //         clickable: true,
        //     },
        // });
    }
});

// ===================================
// NOTIFICATION STYLES (Add to CSS)
// ===================================
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
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

.notification.error {
    border-left: 4px solid #ef4444;
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

.notification.error i {
    color: #ef4444;
}

/* Sticky header styles */
.shop-header.scroll-down {
    transform: translateY(-100%);
}

.shop-header.scroll-up {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* List view styles */
.products-grid.list-view {
    grid-template-columns: 1fr;
}

.products-grid.list-view .product-card {
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: center;
}

.products-grid.list-view .product-image {
    height: 200px;
}

.products-grid.list-view .product-info {
    padding: 1.5rem 2rem;
}

/* Active favorite button */
.action-btn.favorite.active {
    color: #ef4444;
    background: #fee2e2;
}

/* Cart count bounce animation */
.cart-count.bounce {
    animation: cartBounce 0.5s ease;
}

@keyframes cartBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
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
    
    .products-grid.list-view .product-card {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', notificationStyles);