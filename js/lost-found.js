// ===================================
// LOST & FOUND JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('reportModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const cancelBtn = document.querySelector('.btn-cancel');
    const reportForm = document.getElementById('reportForm');
    const successToast = document.getElementById('successToast');
    const itemsGrid = document.getElementById('itemsGrid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const filterChips = document.querySelectorAll('.filter-chip');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const searchInput = document.getElementById('itemSearch');
    const sortSelect = document.getElementById('sortItems');
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const statusRadios = document.querySelectorAll('input[name="status"]');

    // Sample data for additional items
    const additionalItems = [
        {
            status: 'lost',
            category: 'accessories',
            title: 'Gold Wedding Ring',
            location: 'Bamenda - Commercial Ave',
            date: '1 week ago',
            description: 'Lost my wedding ring while shopping. It has an inscription "Forever Love 2018".',
            image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&h=200&fit=crop',
            tags: ['Jewelry', 'Ring', 'Important']
        },
        {
            status: 'found',
            category: 'documents',
            title: 'University Student ID Card',
            location: 'Buea - University of Buea',
            date: '4 days ago',
            description: 'Found a UB student ID card near the library. Name starts with "Marie".',
            image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=300&h=200&fit=crop',
            tags: ['ID Card', 'Student', 'University']
        },
        {
            status: 'lost',
            category: 'electronics',
            title: 'Black Laptop Bag with Dell Laptop',
            location: 'Yaoundé - Hilton Hotel',
            date: '6 days ago',
            description: 'Left my laptop bag in conference room. Contains Dell XPS 15 and chargers.',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
            tags: ['Laptop', 'Bag', 'Electronics', 'Urgent']
        },
        {
            status: 'found',
            category: 'accessories',
            title: 'Designer Sunglasses',
            location: 'Douala - Beach Resort',
            date: '1 week ago',
            description: 'Found Ray-Ban sunglasses at the beach. Black frame with case.',
            image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300&h=200&fit=crop',
            tags: ['Sunglasses', 'Accessories']
        }
    ];

    // Initialize
    init();

    function init() {
        setupEventListeners();
        setupFilterAnimation();
        setupContactButtons();
        setupHowItWorks();
    }

    // Event Listeners
    function setupEventListeners() {
        // Modal triggers - Handle all report buttons
        document.addEventListener('click', (e) => {
            // Report Lost buttons
            if (e.target.closest('.report-lost')) {
                e.preventDefault();
                openModal('lost');
            }
            
            // Report Found buttons
            if (e.target.closest('.report-found')) {
                e.preventDefault();
                openModal('found');
            }
        });
        
        // Modal close
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Form submission
        reportForm.addEventListener('submit', handleFormSubmit);

        // Status radio change
        statusRadios.forEach(radio => {
            radio.addEventListener('change', updateModalHeader);
        });

        // Image upload
        imageInput.addEventListener('change', handleImageUpload);

        // Load more
        loadMoreBtn.addEventListener('click', loadMoreItems);

        // Filters
        filterChips.forEach(chip => {
            chip.addEventListener('click', handleFilter);
        });

        // View toggle
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', handleViewToggle);
        });

        // Search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
            }, 300);
        });

        // Sort
        sortSelect.addEventListener('change', handleSort);
    }

    // Modal Functions
    function openModal(type) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set initial status
        const statusRadio = document.querySelector(`input[name="status"][value="${type}"]`);
        if (statusRadio) {
            statusRadio.checked = true;
            updateModalHeader();
        }

        // Reset form
        reportForm.reset();
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateModalHeader() {
        const selectedStatus = document.querySelector('input[name="status"]:checked').value;
        
        if (selectedStatus === 'lost') {
            modalTitle.textContent = 'Report Lost Item';
            modalSubtitle.textContent = 'Help us help you find your lost item';
        } else {
            modalTitle.textContent = 'Report Found Item';
            modalSubtitle.textContent = 'Thank you for helping reunite items with their owners';
        }
    }

    // Form Handling
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(reportForm);
        const data = Object.fromEntries(formData);
        
        
        console.log('Form submitted:', data);
        
        // Show success message
        closeModal();
        showSuccessToast();
        
        // Add new item to grid 
        addNewItemToGrid(data);
    }

    // Image Upload
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreview.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    }

    // Success Toast
    function showSuccessToast() {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 3000);
    }

    // Load More Items
    function loadMoreItems() {
        const fragment = document.createDocumentFragment();
        
        additionalItems.forEach((item, index) => {
            const itemCard = createItemCard(item);
            itemCard.style.animationDelay = `${index * 0.1}s`;
            fragment.appendChild(itemCard);
        });
        
        itemsGrid.appendChild(fragment);
        
        // Change button text
        loadMoreBtn.innerHTML = '<span>No more items</span>';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.opacity = '0.5';
    }

    // Create Item Card
    function createItemCard(item) {
        const card = document.createElement('div');
        card.className = `item-card ${item.status}`;
        card.setAttribute('data-category', item.category);
        
        card.innerHTML = `
            <div class="item-status ${item.status}">
                <i class="fas fa-${item.status === 'lost' ? 'exclamation-triangle' : 'check-circle'}"></i>
                ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-meta">
                    <span class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </span>
                    <span class="item-date">
                        <i class="fas fa-calendar"></i>
                        ${item.date}
                    </span>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="item-contact-btn">
                    <i class="fas fa-${item.status === 'lost' ? 'phone' : 'user'}"></i>
                    Contact ${item.status === 'lost' ? 'Owner' : 'Finder'}
                </button>
            </div>
        `;
        
        // contact button listener
        const contactBtn = card.querySelector('.item-contact-btn');
        contactBtn.addEventListener('click', () => handleContact(item));
        
        return card;
    }

    // New Item to Grid
    function addNewItemToGrid(formData) {
        const newItem = {
            status: formData.status,
            category: formData.itemCategory || 'others',
            title: formData.itemTitle,
            location: formData.itemLocation,
            date: 'Just now',
            description: formData.itemDescription,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
            tags: [formData.itemCategory || 'Others', 'New']
        };
        
        const itemCard = createItemCard(newItem);
        itemCard.style.animation = 'fadeIn 0.5s ease, slideUp 0.5s ease';
        itemsGrid.insertBefore(itemCard, itemsGrid.firstChild);
    }

    // Filter Handling
    function handleFilter(e) {
        const chip = e.currentTarget;
        const filter = chip.getAttribute('data-filter');
        
        // Update active state
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        // Filter items
        const items = itemsGrid.querySelectorAll('.item-card');
        items.forEach(item => {
            if (filter === 'all') {
                item.style.display = '';
            } else if (filter === 'lost' || filter === 'found') {
                item.style.display = item.classList.contains(filter) ? '' : 'none';
            } else {
                item.style.display = item.getAttribute('data-category') === filter ? '' : 'none';
            }
        });
    }

    // View Toggle
    function handleViewToggle(e) {
        const btn = e.currentTarget;
        const view = btn.getAttribute('data-view');
        
        // Update active state
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Toggle grid/list view
        if (view === 'list') {
            itemsGrid.style.gridTemplateColumns = '1fr';
        } else {
            itemsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        }
    }

    // Search Handling
    function handleSearch(query) {
        const items = itemsGrid.querySelectorAll('.item-card');
        const searchTerm = query.toLowerCase().trim();
        
        items.forEach(item => {
            const title = item.querySelector('.item-title').textContent.toLowerCase();
            const description = item.querySelector('.item-description').textContent.toLowerCase();
            const location = item.querySelector('.item-location').textContent.toLowerCase();
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          location.includes(searchTerm);
            
            item.style.display = matches ? '' : 'none';
        });
    }

    // Sort Handling
    function handleSort() {
        const sortValue = sortSelect.value;
        const items = Array.from(itemsGrid.querySelectorAll('.item-card'));
        
        items.sort((a, b) => {
            switch (sortValue) {
                case 'recent':
                    // In real app, would sort by actual date
                    return 0;
                case 'oldest':
                    // In real app, would sort by actual date
                    return 0;
                case 'category':
                    const catA = a.getAttribute('data-category');
                    const catB = b.getAttribute('data-category');
                    return catA.localeCompare(catB);
                case 'location':
                    const locA = a.querySelector('.item-location').textContent;
                    const locB = b.querySelector('.item-location').textContent;
                    return locA.localeCompare(locB);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted items
        items.forEach(item => itemsGrid.appendChild(item));
    }

    // Contact Handling
    function setupContactButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.item-contact-btn')) {
                e.preventDefault();
                // In real app, would show contact modal or redirect
                alert('Contact feature would be implemented here. This would show the contact information or a contact form.');
            }
        });
    }

    // Filter Animation
    function setupFilterAnimation() {
        const filterSection = document.querySelector('.filters-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });
        
        if (filterSection) {
            observer.observe(filterSection);
        }
    }

    // Handle Contact
    function handleContact(item) {
        // In a real application, this would open a contact modal
        // or redirect to a contact page
        console.log('Contact for item:', item);
    }

    // Smooth Scroll for internal links
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

    // loading state for buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('no-loading')) {
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                
                const ripple = document.createElement('span');
                ripple.className = 'button-ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });

    // ripple animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Setup How It Works Section
    function setupHowItWorks() {
        const toggleOptions = document.querySelectorAll('.toggle-option');
        const processContents = document.querySelectorAll('.process-content');
        
        toggleOptions.forEach(option => {
            option.addEventListener('click', function() {
                const process = this.getAttribute('data-process');
                
                // Update active states
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding process
                processContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetContent = document.getElementById(process + 'Process');
                if (targetContent) {
                    targetContent.classList.add('active');
                    
                    // Animate steps on show
                    const steps = targetContent.querySelectorAll('.process-step');
                    steps.forEach((step, index) => {
                        step.style.animation = 'none';
                        setTimeout(() => {
                            step.style.animation = `slideIn 0.8s ease ${index * 0.1}s backwards`;
                        }, 50);
                    });
                }
            });
        });
        
        // Intersection Observer for step animations
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.process-step').forEach(step => {
            stepObserver.observe(step);
        });
    }
});