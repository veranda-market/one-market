/* ===================================
   MULTI-SERVICE SHOWCASE - JAVASCRIPT
   =================================== */

const MultiServiceShowcase = (function() {
  'use strict';

  // Configuration
  const config = {
    animationDuration: 600,
    productLoadDelay: 100,
    autoRotateInterval: 10000,
    currency: 'CFA ',
    mobileBreakpoint: 768
  };

  // State management
  const state = {
    currentCategory: 'pharmacy',
    isAutoRotating: true,
    autoRotateTimer: null,
    currentView: 'carousel',
    isLoading: false,
    sliderPosition: 0
  };

  // Mock data for different service categories
  const serviceData = {
    pharmacy: {
      title: 'Health & Pharmacy',
      subtitle: 'Get medicines delivered | Same day delivery available',
      icon: 'fas fa-pills',
      color: '#16a085',
      bannerImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=400&fit=crop',
      products: [
        {
          id: 1,
          name: 'Paracetamol 500mg - Pack of 20',
          price: 2500,
          originalPrice: 3125,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
          rating: 4.8,
          sold: '1,200+',
          badge: '-20%'
        },
        {
          id: 2,
          name: 'Vitamin C 1000mg - Immune Support',
          price: 8500,
          originalPrice: 10000,
          image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=300&fit=crop',
          rating: 4.6,
          sold: '890+',
          badge: '-15%'
        },
        {
          id: 3,
          name: 'First Aid Kit Complete',
          price: 15000,
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&h=300&fit=crop',
          rating: 4.9,
          sold: '450+',
          badge: 'New'
        },
        {
          id: 4,
          name: 'Digital Thermometer',
          price: 12000,
          originalPrice: 15000,
          image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&h=300&fit=crop',
          rating: 4.7,
          sold: '2,100+',
          badge: '-20%'
        },
        {
          id: 5,
          name: 'Hand Sanitizer 500ml',
          price: 3500,
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=300&h=300&fit=crop',
          rating: 4.5,
          sold: '3,400+',
          badge: null
        },
        {
          id: 6,
          name: 'Blood Pressure Monitor',
          price: 45000,
          originalPrice: 55000,
          image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=300&fit=crop',
          rating: 4.8,
          sold: '780+',
          badge: '-18%'
        }
      ]
    },
    rentals: {
      title: 'Rental Properties',
      subtitle: 'Find your perfect home | Verified listings only',
      icon: 'fas fa-home',
      color: '#f39c12',
      bannerImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop',
      cta: 'Browse homes',
      products: [
        {
          id: 1,
          name: 'Modern 2BR Apartment in Bastos',
          price: 150000,
          priceUnit: '/mo',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop',
          rating: 4.7,
          sold: '15 views today',
          badge: 'Featured',
          features: { beds: 2, baths: 1, parking: 1 }
        },
        {
          id: 2,
          name: 'Studio Apartment - Bonapriso',
          price: 75000,
          priceUnit: '/mo',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=300&fit=crop',
          rating: 4.5,
          sold: '23 views today',
          badge: null,
          features: { beds: 1, baths: 1, parking: 0 }
        },
        {
          id: 3,
          name: 'Luxury Villa with Pool',
          price: 450000,
          priceUnit: '/mo',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=300&fit=crop',
          rating: 4.9,
          sold: '8 views today',
          badge: 'Premium',
          features: { beds: 4, baths: 3, parking: 2 }
        },
        {
          id: 4,
          name: '3BR Family House - Ngousso',
          price: 200000,
          priceUnit: '/mo',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=300&fit=crop',
          rating: 4.6,
          sold: '12 views today',
          badge: null,
          features: { beds: 3, baths: 2, parking: 1 }
        }
      ]
    },
    jobs: {
      title: 'Job Opportunities',
      subtitle: 'Connect with top employers | New jobs daily',
      icon: 'fas fa-briefcase',
      color: '#9b59b6',
      bannerImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&h=400&fit=crop',
      cta: 'Find jobs',
      products: [
        {
          id: 1,
          name: 'Software Developer - TechCorp',
          price: '500k-800k',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
          rating: null,
          sold: 'Full-time • Douala',
          badge: 'New',
          company: 'TechCorp Cameroon'
        },
        {
          id: 2,
          name: 'Marketing Manager - Creative Agency',
          price: '400k-600k',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
          rating: null,
          sold: 'Full-time • Yaoundé',
          badge: null,
          company: 'Creative Agency'
        },
        {
          id: 3,
          name: 'Sales Representative',
          price: '200k-300k',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop',
          rating: null,
          sold: 'Part-time • Remote',
          badge: 'Remote',
          company: 'Global Trade Co.'
        }
      ]
    },
    transport: {
      title: 'Bus Tickets',
      subtitle: 'Book your journey | Safe & comfortable travel',
      icon: 'fas fa-bus',
      color: '#1a8917',
      bannerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=400&fit=crop',
      cta: 'Book tickets',
      products: [
        {
          id: 1,
          name: 'Yaoundé to Douala - Express',
          price: 5000,
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=300&fit=crop',
          rating: 4.6,
          sold: '200+ booked today',
          badge: null,
          departure: '06:00 AM',
          duration: '3h 30min'
        },
        {
          id: 2,
          name: 'Douala to Buea - Comfort',
          price: 3500,
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=300&h=300&fit=crop',
          rating: 4.8,
          sold: '150+ booked today',
          badge: 'Popular',
          departure: '08:00 AM',
          duration: '1h 30min'
        },
        {
          id: 3,
          name: 'Yaoundé to Bamenda - VIP',
          price: 8000,
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&h=300&fit=crop',
          rating: 4.9,
          sold: '80+ booked today',
          badge: 'VIP',
          departure: '07:00 AM',
          duration: '5h 00min'
        }
      ]
    },
    services: {
      title: 'Professional Services',
      subtitle: 'Trusted professionals | Quality guaranteed',
      icon: 'fas fa-tools',
      color: '#3498db',
      bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=400&fit=crop',
      cta: 'Find services',
      products: [
        {
          id: 1,
          name: 'Professional Plumbing Service',
          price: 'From 15000',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=300&fit=crop',
          rating: 4.8,
          sold: '340+ hired',
          badge: null
        },
        {
          id: 2,
          name: 'House Cleaning Service',
          price: 'From 25000',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop',
          rating: 4.9,
          sold: '560+ hired',
          badge: 'Top Rated'
        },
        {
          id: 3,
          name: 'Electrical Repair Service',
          price: 'From 20000',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop',
          rating: 4.7,
          sold: '280+ hired',
          badge: null
        }
      ]
    },
    'lost-found': {
      title: 'Lost & Found',
      subtitle: 'Help reunite items | Community support',
      icon: 'fas fa-search-location',
      color: '#e74c3c',
      bannerImage: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500&h=400&fit=crop',
      cta: 'View items',
      products: [
        {
          id: 1,
          name: 'iPhone 13 Pro - Found at Carrefour',
          price: 'Found 2 days ago',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=300&h=300&fit=crop',
          rating: null,
          sold: 'Bastos area',
          badge: 'Found',
          type: 'found'
        },
        {
          id: 2,
          name: 'Car Keys - Toyota',
          price: 'Lost 1 day ago',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
          rating: null,
          sold: 'University area',
          badge: 'Lost',
          type: 'lost'
        },
        {
          id: 3,
          name: 'Wallet with ID Cards',
          price: 'Found 3 days ago',
          originalPrice: null,
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop',
          rating: null,
          sold: 'Mokolo market',
          badge: 'Found',
          type: 'found'
        }
      ]
    }
  };

  // Initialize the showcase
  function init() {
    console.log('Initializing Multi-Service Showcase...');
    
    // Check if section exists
    const section = document.querySelector('.multi-service-showcase');
    if (!section) {
      console.log('Multi-service showcase section not found');
      return;
    }
    
    // Initialize components
    initSelectorCards();
    initCategorySlider();
    initViewControls();
    initBannerInteractions();
    initAutoRotate();
    
    // Generate all category displays
    generateCategoryDisplays();
    
    // Show initial category
    showCategory(state.currentCategory);
    
    console.log('Multi-Service Showcase initialized successfully');
  }

  // Generate category display HTML for all categories
  function generateCategoryDisplays() {
    const displaySection = document.querySelector('.category-display-section');
    if (!displaySection) return;
    
    // Clear existing content
    displaySection.innerHTML = '';
    
    // Generate displays for each category
    Object.keys(serviceData).forEach(category => {
      const data = serviceData[category];
      const displayHTML = createCategoryDisplay(category, data);
      displaySection.insertAdjacentHTML('beforeend', displayHTML);
    });
  }

  // Create category display HTML
  function createCategoryDisplay(category, data) {
    const gradientColors = {
      pharmacy: 'linear-gradient(135deg, #16a085 0%, #128a6f 100%)',
      rentals: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      jobs: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      transport: 'linear-gradient(135deg, #1a8917 0%, #27ae60 100%)',
      services: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      'lost-found': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    };
    
    // Map categories to their respective page URLs
    const categoryUrls = {
      pharmacy: 'pharmacy-health.html',
      rentals: 'rental-services.html',
      jobs: 'jobs.html',
      transport: 'bus-tickets.html',
      services: 'services.html',
      'lost-found': 'lost-found.html'
    };
    
    return `
      <div class="category-display ${category === state.currentCategory ? 'active' : ''}" data-category="${category}">
        <div class="display-banner" style="background: ${gradientColors[category]};">
          <div class="banner-content">
            <h3 class="banner-title">${data.title}</h3>
            <p class="banner-subtitle">${data.subtitle}</p>
            <a href="${categoryUrls[category]}" class="banner-cta">${data.cta || 'Shop now'}</a>
          </div>
          <div class="banner-image">
            <img src="${data.bannerImage}" alt="${data.title}">
          </div>
        </div>
        <div class="category-products">
          <div class="products-track">
            <!-- Products will be dynamically loaded -->
          </div>
        </div>
      </div>
    `;
  }

  // Initialize selector card interactions
  function initSelectorCards() {
    const selectorCards = document.querySelectorAll('.selector-card');
    
    selectorCards.forEach(card => {
      card.addEventListener('click', function(e) {
        const category = this.dataset.category;
        
        // Stop auto-rotate when user interacts
        stopAutoRotate();
        
        // Update active states
        selectorCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        // Show selected category with animation
        showCategory(category);
        
        // ripple effect
        createRippleEffect(this, e);
      });
      
      // Add hover effect
      card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
          this.style.transform = 'translateY(-2px)';
        }
      });
      
      card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
          this.style.transform = 'translateY(0)';
        }
      });
    });
  }

  // Initialize category slider
  function initCategorySlider() {
    const prevBtn = document.getElementById('categoryPrev');
    const nextBtn = document.getElementById('categoryNext');
    const selectorGrid = document.getElementById('selectorGrid');
    const container = document.querySelector('.service-selector-container');
    
    if (!prevBtn || !nextBtn || !selectorGrid || !container) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // Calculate visible cards
    function getVisibleCards() {
      const containerWidth = container.offsetWidth;
      const cardWidth = 160 + 16; // card width + gap
      return Math.floor(containerWidth / cardWidth);
    }
    
    // Check if scrolling is needed
    function checkScrollNeeded() {
      const cards = selectorGrid.querySelectorAll('.selector-card');
      const visibleCards = getVisibleCards();
      const needsScroll = cards.length > visibleCards;
      
      // Show/hide navigation buttons based on need
      if (prevBtn && nextBtn) {
        prevBtn.style.display = needsScroll ? 'flex' : 'none';
        nextBtn.style.display = needsScroll ? 'flex' : 'none';
      }
      
      return needsScroll;
    }
    
    // Update slider position
    function updateSlider(index) {
      if (isAnimating) return;
      isAnimating = true;
      
      const cards = selectorGrid.querySelectorAll('.selector-card');
      const cardWidth = cards[0]?.offsetWidth || 160;
      const gap = 16;
      const visibleCards = getVisibleCards();
      const maxIndex = Math.max(0, cards.length - visibleCards);
      
      // Clamp index
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      state.sliderPosition = currentIndex;
      
      // Calculate transform
      const translateX = -(currentIndex * (cardWidth + gap));
      selectorGrid.style.transform = `translateX(${translateX}px)`;
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
      
      // Update scroll indicators
      const wrapper = document.querySelector('.service-selector-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('has-scroll-left', currentIndex > 0);
        wrapper.classList.toggle('has-scroll-right', currentIndex < maxIndex);
      }
      
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
    
    // Navigation button handlers
    prevBtn.addEventListener('click', () => {
      updateSlider(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
      updateSlider(currentIndex + 1);
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    selectorGrid.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    selectorGrid.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next
          updateSlider(currentIndex + 1);
        } else {
          // Swipe right - previous
          updateSlider(currentIndex - 1);
        }
      }
    }
    
    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkScrollNeeded();
        updateSlider(currentIndex);
      }, 250);
    });
    
    // Initialize slider position
    checkScrollNeeded();
    updateSlider(0);
    
    // Store reference for auto-rotate
    if (container) {
      container._updateSlider = updateSlider;
    }
  }

  // Initialize view controls
  function initViewControls() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    viewToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const view = toggle.dataset.view;
        
        // Update active toggle
        viewToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');
        
        // Update view
        state.currentView = view;
        updateViewDisplay();
      });
    });
  }

  // Initialize banner interactions
  function initBannerInteractions() {
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('banner-cta')) {
        // Don't prevent default - let the link work naturally
        
        const category = state.currentCategory;
        console.log(`Navigating to ${category} page`);
        
        // Add click animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
          e.target.style.transform = '';
        }, 100);
        
        // Show notification before navigation
        if (window.VerandaMarket && window.VerandaMarket.showNotification) {
          window.VerandaMarket.showNotification(`Loading ${category} section...`, 'info');
        }
      }
    });
  }

  // Show category with animation
  function showCategory(category) {
    state.currentCategory = category;
    
    // Hide all displays
    const displays = document.querySelectorAll('.category-display');
    displays.forEach(display => {
      if (display.classList.contains('active')) {
        display.style.opacity = '0';
        display.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          display.classList.remove('active');
        }, 300);
      }
    });
    
    // Show new category after delay
    setTimeout(() => {
      const activeDisplay = document.querySelector(`.category-display[data-category="${category}"]`);
      if (activeDisplay) {
        activeDisplay.classList.add('active');
        
        // Load products for this category
        loadCategoryProducts(category);
        
        // Trigger reflow and animate
        void activeDisplay.offsetWidth;
        activeDisplay.style.opacity = '1';
        activeDisplay.style.transform = 'translateY(0)';
      }
    }, 350);
  }

  // Load products for category
  function loadCategoryProducts(category) {
    const productsTrack = document.querySelector(`.category-display[data-category="${category}"] .products-track`);
    if (!productsTrack || state.isLoading) return;
    
    state.isLoading = true;
    
    // Show loading state
    productsTrack.innerHTML = '<div class="products-loading">Loading products</div>';
    
    // Simulate API call
    setTimeout(() => {
      const data = serviceData[category];
      const products = data?.products || [];
      
      // Generate product cards
      const productsHTML = products.map((product, index) => 
        createProductCard(product, index, category)
      ).join('');
      
      productsTrack.innerHTML = productsHTML;
      
      // Animate products in
      const productCards = productsTrack.querySelectorAll('.product-card');
      productCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * config.productLoadDelay);
      });
      
      // Add click handlers
      productCards.forEach(card => {
        card.addEventListener('click', function() {
          handleProductClick(this.dataset.productId, category);
        });
      });
      
      state.isLoading = false;
    }, 500);
  }

  // Create product card HTML
  function createProductCard(product, index, category) {
    const isJob = category === 'jobs';
    const isLostFound = category === 'lost-found';
    const isRental = category === 'rentals';
    const isTransport = category === 'transport';
    
    let priceDisplay = '';
    if (isJob || isLostFound) {
      priceDisplay = product.price;
    } else if (typeof product.price === 'string') {
      priceDisplay = product.price;
    } else {
      priceDisplay = config.currency + product.price.toLocaleString();
      if (product.priceUnit) {
        priceDisplay += product.priceUnit;
      }
    }
    
    return `
      <div class="product-card" data-product-id="${product.id}" style="opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.05}s;">
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h4 class="product-name">${product.name}</h4>
          ${product.company ? `<p style="font-size: 0.875rem; color: #64748b; margin: -8px 0 8px;">${product.company}</p>` : ''}
          ${isRental && product.features ? `
            <div style="display: flex; gap: 12px; margin: 8px 0; font-size: 0.875rem; color: #64748b;">
              <span><i class="fas fa-bed"></i> ${product.features.beds}</span>
              <span><i class="fas fa-bath"></i> ${product.features.baths}</span>
              <span><i class="fas fa-car"></i> ${product.features.parking}</span>
            </div>
          ` : ''}
          ${isTransport && product.departure ? `
            <div style="display: flex; gap: 12px; margin: 8px 0; font-size: 0.875rem; color: #64748b;">
              <span><i class="fas fa-clock"></i> ${product.departure}</span>
              <span><i class="fas fa-route"></i> ${product.duration}</span>
            </div>
          ` : ''}
          <div class="product-price">
            <span class="price-current">${priceDisplay}</span>
            ${product.originalPrice ? `<span class="price-original">${config.currency}${product.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="product-meta">
            ${product.rating ? `<span class="rating">★ ${product.rating}</span>` : '<span></span>'}
            <span class="sold">${product.sold}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Handle product click
  function handleProductClick(productId, category) {
    console.log(`Product clicked: ${productId} in ${category}`);
    
    // Add to cart for pharmacy products
    if (category === 'pharmacy' && window.VerandaMarket && window.VerandaMarket.addToCart) {
      window.VerandaMarket.addToCart(productId);
    } else if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification('Opening details...', 'info');
    }
  }

  // Initialize auto-rotate functionality
  function initAutoRotate() {
    if (!state.isAutoRotating) return;
    
    const categories = Object.keys(serviceData);
    let currentIndex = categories.indexOf(state.currentCategory);
    
    state.autoRotateTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % categories.length;
      const nextCategory = categories[currentIndex];
      
      // Update selector card
      const selectorCards = document.querySelectorAll('.selector-card');
      selectorCards.forEach(card => {
        card.classList.toggle('active', card.dataset.category === nextCategory);
      });
      
      // Auto-scroll to active category if needed
      const activeCard = document.querySelector('.selector-card.active');
      if (activeCard) {
        const container = document.querySelector('.service-selector-container');
        const grid = document.getElementById('selectorGrid');
        if (container && grid) {
          const cardIndex = Array.from(selectorCards).indexOf(activeCard);
          const containerWidth = container.offsetWidth;
          const cardWidth = activeCard.offsetWidth + 16;
          const visibleCards = Math.floor(containerWidth / cardWidth);
          
          // If active card is not fully visible, scroll to it
          if (cardIndex >= state.sliderPosition + visibleCards || cardIndex < state.sliderPosition) {
            const targetIndex = Math.max(0, cardIndex - Math.floor(visibleCards / 2));
            // Trigger slider update if function exists
            const updateSliderFn = container._updateSlider;
            if (updateSliderFn) {
              updateSliderFn(targetIndex);
            }
          }
        }
      }
      
      showCategory(nextCategory);
    }, config.autoRotateInterval);
  }

  // Stop auto-rotate
  function stopAutoRotate() {
    if (state.autoRotateTimer) {
      clearInterval(state.autoRotateTimer);
      state.autoRotateTimer = null;
      state.isAutoRotating = false;
    }
  }

  // Create ripple effect
  function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: var(--accent-color);
      border-radius: 50%;
      transform: scale(0);
      opacity: 0.3;
      pointer-events: none;
      animation: rippleAnimation 0.6s ease-out;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  // Update view display
  function updateViewDisplay() {
    console.log(`Switching to ${state.currentView} view`);
    const productsTrack = document.querySelectorAll('.products-track');
    
    productsTrack.forEach(track => {
      if (state.currentView === 'grid') {
        track.style.display = 'grid';
      } else {
        track.style.display = 'grid'; // Keep grid for now
      }
    });
  }

  // Utility: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public API
  return {
    init: init,
    showCategory: showCategory,
    stopAutoRotate: stopAutoRotate,
    startAutoRotate: initAutoRotate
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MultiServiceShowcase.init();
});

// Export for global access
window.MultiServiceShowcase = MultiServiceShowcase;