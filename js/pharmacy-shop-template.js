/* ===================================
   PHARMACY SHOP TEMPLATE JAVASCRIPT
   =================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const shopMenu = document.querySelector('.shop-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            shopMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !shopMenu.contains(e.target)) {
                shopMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // ===================================
    // SMOOTH SCROLLING FOR MENU LINKS
    // ===================================
    document.querySelectorAll('.shop-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                shopMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // ===================================
    // MODAL FUNCTIONALITY
    // ===================================
    
    // Prescription Upload Modal
    const prescriptionModal = document.getElementById('prescriptionModal');
    const uploadPrescriptionBtns = document.querySelectorAll('.upload-prescription-btn, .fixed-action-btn.prescription');
    const closePrescriptionModal = prescriptionModal?.querySelector('.close-modal');
    
    uploadPrescriptionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (prescriptionModal) {
                prescriptionModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (closePrescriptionModal) {
        closePrescriptionModal.addEventListener('click', function() {
            prescriptionModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === prescriptionModal) {
            prescriptionModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // File Upload Handling
    const uploadArea = document.querySelector('.upload-area');
    const browseBtn = document.querySelector('.browse-btn');
    const fileInput = document.getElementById('prescriptionFile');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        if (browseBtn) {
            browseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
        }
        
        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        // File input change
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid file format (JPG, PNG, or PDF)');
                return;
            }
            
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Update UI to show file name
            const uploadArea = document.querySelector('.upload-area p');
            if (uploadArea) {
                uploadArea.textContent = `Selected: ${file.name}`;
            }
        }
    }
    
    // Upload Submit Button
    const uploadSubmitBtn = document.querySelector('.upload-submit-btn');
    if (uploadSubmitBtn) {
        uploadSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Here you would handle the actual upload
            alert('Prescription uploaded successfully! We will review it shortly.');
            prescriptionModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // ===================================
    // GALLERY FUNCTIONALITY
    // ===================================
    const galleryTabs = document.querySelectorAll('.gallery-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            galleryTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const closeLightbox = lightbox?.querySelector('.close-lightbox');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img && lightbox && lightboxImage) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (closeLightbox) {
        closeLightbox.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===================================
    // PRODUCT FILTER TABS
    // ===================================
    const filterTabs = document.querySelectorAll('.filter-tabs .tab-btn');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you would filter products based on the selected tab
            const filterType = this.textContent.trim();
            filterProducts(filterType);
        });
    });
    
    function filterProducts(filterType) {
        // This is where you'd implement product filtering logic
        console.log('Filtering products by:', filterType);
        // For now, we'll just show all products
    }
    
    // ===================================
    // CART FUNCTIONALITY
    // ===================================
    let cartItems = [];
    const cartCount = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn:not(:disabled)');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Skip if prescription required
            if (this.classList.contains('prescription-required')) {
                alert('Prescription required for this medicine. Please upload your prescription first.');
                document.querySelector('.upload-prescription-btn').click();
                return;
            }
            
            // Get product info
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            // Add to cart
            cartItems.push({
                name: productName,
                price: productPrice
            });
            
            // Update cart count
            updateCartCount();
            
            // Show success message
            showNotification('Product added to cart!');
            
            // Animate button
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    });
    
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cartItems.length;
            cartCount.classList.add('updated');
            setTimeout(() => {
                cartCount.classList.remove('updated');
            }, 300);
        }
    }
    
    // ===================================
    // SEARCH FUNCTIONALITY
    // ===================================
    const searchInputs = document.querySelectorAll('.shop-search-input, .medicine-search-input');
    const searchBtns = document.querySelectorAll('.shop-search-btn, .medicine-search-btn');
    
    searchInputs.forEach((input, index) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        if (searchBtns[index]) {
            searchBtns[index].addEventListener('click', function() {
                performSearch(input.value);
            });
        }
    });
    
    function performSearch(query) {
        if (query.trim() === '') {
            alert('Please enter a search term');
            return;
        }
        console.log('Searching for:', query);
        // Implement search functionality here
    }
    
    // ===================================
    // FORM HANDLING
    // ===================================
    const inquiryForm = document.querySelector('.inquiry-form');
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Submit form (in real app, this would be an API call)
            console.log('Form submitted:', data);
            showNotification('Your inquiry has been submitted. Our pharmacist will contact you soon.');
            this.reset();
        });
    }
    
    function validateForm(data) {
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    // ===================================
    // FIXED ACTION BUTTONS
    // ===================================
    const consultationBtn = document.querySelector('.fixed-action-btn.consultation');
    const emergencyBtn = document.querySelector('.fixed-action-btn.emergency');
    
    if (consultationBtn) {
        consultationBtn.addEventListener('click', function() {
            // Scroll to consultation section
            const consultSection = document.getElementById('consultation');
            if (consultSection) {
                consultSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            // Call emergency number
            window.location.href = 'tel:+237987654321';
        });
    }
    
    // ===================================
    // SWIPER INITIALIZATION
    // ===================================
    if (typeof Swiper !== 'undefined') {
        // Customer Reviews Slider
        const reviewsSlider = new Swiper('.reviews-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }
    
    // ===================================
    // UTILITY FUNCTIONS
    // ===================================
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ===================================
    // PAGE LOAD ANIMATIONS
    // ===================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.category-card, .product-card, .service-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run on load
    animateOnScroll();
    
    // ===================================
    // CONTACT BUTTONS
    // ===================================
    const contactSupplierBtn = document.querySelector('.contact-supplier-btn');
    const consultPharmacistBtns = document.querySelectorAll('.consultation-btn');
    
    if (contactSupplierBtn) {
        contactSupplierBtn.addEventListener('click', function() {
            // Scroll to contact section
            const contactSection = document.getElementById('consultation');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    consultPharmacistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const consultSection = document.getElementById('consultation');
            if (consultSection) {
                consultSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // ===================================
    // POPULAR SEARCHES
    // ===================================
    const popularSearchLinks = document.querySelectorAll('.popular-searches a');
    
    popularSearchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.textContent;
            const searchInput = document.querySelector('.medicine-search-input');
            if (searchInput) {
                searchInput.value = searchTerm;
                performSearch(searchTerm);
            }
        });
    });
    
    // ===================================
    // QUICK ACTION CARDS
    // ===================================
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('href').substring(1);
            
            switch(action) {
                case 'upload-prescription':
                    document.querySelector('.upload-prescription-btn').click();
                    break;
                case 'book-consultation':
                    document.getElementById('consultation').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'health-checkup':
                    alert('Health checkup booking coming soon!');
                    break;
                case 'medicine-reminder':
                    alert('Medicine reminder feature coming soon!');
                    break;
                case 'refill-prescription':
                    alert('Prescription refill feature coming soon!');
                    break;
            }
        });
    });
    
    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
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
    // ESCAPE KEY HANDLING
    // ===================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all modals
            document.querySelectorAll('.modal.active, .lightbox.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
    
});

// ===================================
// CSS FOR ANIMATIONS (Add to CSS file)
// ===================================
const animationStyles = `
<style>
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.cart-count.updated {
    animation: cartBounce 0.3s ease;
}

@keyframes cartBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
}

.add-to-cart-btn.added {
    animation: buttonSuccess 0.5s ease;
}

@keyframes buttonSuccess {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); background: #27ae60; }
    100% { transform: scale(1); }
}

.upload-area.dragover {
    background: rgba(22, 160, 133, 0.1);
    border-color: var(--secondary-color);
}

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
</style>
`;

// Inject animation styles
document.head.insertAdjacentHTML('beforeend', animationStyles);