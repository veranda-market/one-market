/* ===================================
   SHOP BY CATALOGUE 
   =================================== */

// ===================================
// 1. CATALOGUE MODULE V2
// ===================================
const CatalogueV2 = (function() {
  'use strict';

  // ===================================
  // 2. MODULE CONFIGURATION
  // ===================================
  const config = {
    productsPerLoad: 12,
    currency: 'CFA ',
    animations: {
      duration: 300,
      easing: 'ease'
    }
  };

  // ===================================
  // 3. MODULE STATE
  // ===================================
  const state = {
    currentPage: 1,
    isLoading: false,
    products: [],
    hasMoreProducts: true
  };

  // ===================================
  // 4. MOCK DATA - Extended product list with IDs
  // ===================================
  const mockData = {
    catalogues: {
      products: {
        title: 'Products & Shopping',
        description: 'Browse thousands of products from local sellers',
        itemCount: 15234
      },
      pharmacy: {
        title: 'Pharmacy & Health',
        description: 'Order medicines and health products',
        itemCount: 3456
      },
      services: {
        title: 'Professional Services',
        description: 'Find trusted service providers',
        itemCount: 892
      },
      rental: {
        title: 'Rental Properties',
        description: 'Discover homes and spaces for rent',
        itemCount: 567
      },
      jobs: {
        title: 'Jobs & Careers',
        description: 'Explore career opportunities',
        itemCount: 234
      },
      lost: {
        title: 'Lost & Found',
        description: 'Help reunite items with owners',
        itemCount: 89
      },
      bus: {
        title: 'Bus Tickets',
        description: 'Book inter-city travel',
        itemCount: 45
      }
    },
    
    // Extended product list for pagination WITH IDs
    moreProducts: [
      {
        id: 'prod-s001',
        title: 'Wireless Bluetooth Headphones with Noise Cancellation',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 2341
      },
      {
        id: 'prod-s002',
        title: 'Smart Watch with Health Tracking Features',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: 4.8,
        sold: 1856
      },
      {
        id: 'prod-s003',
        title: 'Premium Leather Handbag - Designer Collection',
        price: 125000,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
        rating: 4.9,
        sold: 567
      },
      {
        id: 'prod-s004',
        title: 'Modern Coffee Maker with Grinder',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 892
      },
      {
        id: 'prod-s005',
        title: 'Professional Camera Lens 50mm f/1.8',
        price: 180000,
        image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae4?w=300&h=300&fit=crop',
        rating: 4.9,
        sold: 234
      },
      {
        id: 'prod-s006',
        title: 'Ergonomic Office Chair with Lumbar Support',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&h=300&fit=crop',
        rating: 4.5,
        sold: 1234
      },
      {
        id: 'prod-s007',
        title: 'Portable Power Bank 20000mAh Fast Charging',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop',
        rating: 4.4,
        sold: 3456
      },
      {
        id: 'prod-s008',
        title: 'Yoga Mat Premium Non-Slip 6mm',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 789
      },
      {
        id: 'prod-s009',
        title: 'Stainless Steel Water Bottle 1L Insulated',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 2134
      },
      {
        id: 'prod-s010',
        title: 'Wireless Gaming Mouse RGB Lighting',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop',
        rating: 4.8,
        sold: 1567
      },
      {
        id: 'prod-s011',
        title: 'Plant-Based Protein Powder 2kg Vanilla',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop',
        rating: 4.5,
        sold: 432
      },
      {
        id: 'prod-s012',
        title: 'Smart LED Light Bulbs Color Changing 4-Pack',
        price: 42000,
        image: 'https://images.unsplash.com/photo-1565636192335-f2c41380a7a2?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 891
      },
      {
        id: 'prod-s013',
        title: 'Organic Cotton Bedding Set - Queen Size',
        price: 75000,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop',
        rating: 4.8,
        sold: 342
      },
      {
        id: 'prod-s014',
        title: 'Kitchen Knife Set Professional Grade',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=300&h=300&fit=crop',
        rating: 4.9,
        sold: 178
      },
      {
        id: 'prod-s015',
        title: 'Air Purifier HEPA Filter for Large Rooms',
        price: 185000,
        image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 892
      },
      {
        id: 'prod-s016',
        title: 'Running Shoes Cushioned Support',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 2341
      },
      {
        id: 'prod-s017',
        title: 'Laptop Backpack Water Resistant',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
        rating: 4.5,
        sold: 1234
      },
      {
        id: 'prod-s018',
        title: 'Electric Toothbrush with Timer',
        price: 42000,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 567
      },
      {
        id: 'prod-s019',
        title: 'Smartphone Tripod with Remote',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop',
        rating: 4.4,
        sold: 891
      },
      {
        id: 'prod-s020',
        title: 'Aromatherapy Essential Oils Set',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
        rating: 4.8,
        sold: 432
      },
      {
        id: 'prod-s021',
        title: 'Ceramic Dinnerware Set 16-Piece',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1525974160448-038dacadcc71?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 234
      },
      {
        id: 'prod-s022',
        title: 'Fitness Resistance Bands Set',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=300&fit=crop',
        rating: 4.5,
        sold: 1567
      },
      {
        id: 'prod-s023',
        title: 'Indoor Plants Collection with Pots',
        price: 48000,
        image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 678
      },
      {
        id: 'prod-s024',
        title: 'Bluetooth Speaker Waterproof',
        price: 58000,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
        rating: 4.8,
        sold: 2891
      }
    ],
    
    // Featured products data with IDs
    featuredProducts: [
      {
        id: 'prod-f001',
        price: 45000,
        originalPrice: 65000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
        rating: 4.7,
        sold: 2000
      },
      {
        id: 'prod-f002',
        price: 28000,
        originalPrice: 35000,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
        rating: 4.5,
        sold: 1500
      },
      {
        id: 'prod-f003',
        price: 85000,
        originalPrice: 120000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        rating: 4.8,
        sold: 900
      }
    ]
  };

  // ===================================
  // 5. INITIALIZATION
  // ===================================
  function init() {
    console.log('Initializing Shop by Catalogue V2...');
    
    // Check if section exists
    const section = document.querySelector('.shop-by-catalogue');
    if (!section) {
      console.log('Shop by catalogue section not found');
      return;
    }
    
    // Initialize components
    initCatalogueCards();
    initFeaturedSection();
    initMoreProducts();
    initLoadMore();
    
    console.log('Shop by Catalogue V2 initialized successfully');
  }

  // ===================================
  // 6. CATALOGUE CARDS
  // ===================================
  function initCatalogueCards() {
    const cards = document.querySelectorAll('.catalogue-card');
    
    cards.forEach(card => {
      card.addEventListener('click', handleCatalogueClick);
      
      // Add hover effect
      card.addEventListener('mouseenter', handleCardHover);
      card.addEventListener('mouseleave', handleCardLeave);
    });
  }
  
  function handleCatalogueClick(e) {
    const card = e.currentTarget;
    const catalogueType = card.dataset.catalogue;
    
    console.log(`Opening ${catalogueType} catalogue`);
    
    // Animate click
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 200);
    
    // Show notification
    showNotification(`Opening ${mockData.catalogues[catalogueType]?.title || catalogueType}...`);
    
    // In production, redirect to catalogue page
    // window.location.href = `/catalogue/${catalogueType}`;
  }
  
  function handleCardHover(e) {
    const card = e.currentTarget;
    // Subtle lift effect handled by CSS
  }
  
  function handleCardLeave(e) {
    const card = e.currentTarget;
    // Reset handled by CSS
  }

  // ===================================
  // 7. FEATURED SECTION - UPDATED
  // ===================================
  function initFeaturedSection() {
    const featuredCard = document.querySelector('.featured-catalogue-card');
    const featuredCta = document.querySelector('.featured-cta');
    const featuredProducts = document.querySelectorAll('.featured-product-card');
    
    if (featuredCard) {
      featuredCard.addEventListener('click', (e) => {
        // Don't trigger if clicking on products or CTA
        if (e.target.closest('.featured-product-card') || e.target.closest('.featured-cta')) {
          return;
        }
        handleFeaturedClick();
      });
    }
    
    if (featuredCta) {
      featuredCta.addEventListener('click', (e) => {
        e.stopPropagation();
        handleFeaturedClick();
      });
    }
    
    // Featured product cards - make them clickable
    featuredProducts.forEach((card, index) => {
      // product data attributes
      const productData = mockData.featuredProducts[index];
      if (productData) {
        card.dataset.productId = productData.id;
      }
      
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = card.dataset.productId || `featured-${index + 1}`;
        window.location.href = `product-detail.html?id=${productId}`;
      });
    });
  }
  
  function handleFeaturedClick() {
    console.log('Featured section clicked');
    showNotification('Opening featured products...');
    
    // Animate
    const featuredCard = document.querySelector('.featured-catalogue-card');
    if (featuredCard) {
      featuredCard.style.transform = 'scale(0.99)';
      setTimeout(() => {
        featuredCard.style.transform = '';
      }, 200);
    }
  }

  // ===================================
  // 8. MORE PRODUCTS SECTION
  // ===================================
  function initMoreProducts() {
    const grid = document.getElementById('moreProductsGrid');
    if (!grid) {
      console.log('More products grid not found');
      return;
    }
    
    // Load initial products
    console.log('Loading initial products...');
    loadMoreProducts(true);
  }
  
  function loadMoreProducts(initial = false) {
    if (state.isLoading) return;
    
    state.isLoading = true;
    const grid = document.getElementById('moreProductsGrid');
    if (!grid) return;
    
    // Show loading state
    if (initial) {
      grid.innerHTML = createLoadingSkeletons(config.productsPerLoad);
    }
    
    // Simulate API call
    setTimeout(() => {
      const startIndex = initial ? 0 : state.products.length;
      const endIndex = startIndex + config.productsPerLoad;
      const productsToLoad = mockData.moreProducts.slice(startIndex, endIndex);
      
      console.log(`Loading products ${startIndex} to ${endIndex}`, productsToLoad.length);
      
      if (productsToLoad.length === 0) {
        // No more products
        state.hasMoreProducts = false;
        hideLoadMoreButton();
        state.isLoading = false;
        showNotification('All products loaded!', 'info');
        return;
      }
      
      // Add to state
      state.products = [...state.products, ...productsToLoad];
      
      // Render products
      const productsHTML = productsToLoad.map(product => createProductCard(product)).join('');
      
      if (initial) {
        grid.innerHTML = productsHTML;
      } else {
        // Remove any skeletons first
        const skeletons = grid.querySelectorAll('.product-skeleton');
        skeletons.forEach(skeleton => skeleton.remove());
        
        grid.insertAdjacentHTML('beforeend', productsHTML);
      }
      
      // click handlers to new products
      const newCards = grid.querySelectorAll('.more-product-card:not([data-initialized])');
      newCards.forEach(card => {
        card.setAttribute('data-initialized', 'true');
        card.addEventListener('click', handleProductClick);
      });
      
      // Animate entrance
      animateProductsEntrance(newCards);
      
      state.isLoading = false;
      updateLoadMoreButton();
      
      // Check if we need to hide the button
      if (state.products.length >= mockData.moreProducts.length) {
        state.hasMoreProducts = false;
        hideLoadMoreButton();
      }
    }, 800);
  }
  
  function createProductCard(product) {
    return `
      <div class="more-product-card" data-product-id="${product.id}" style="cursor: pointer;">
        <div class="more-product-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="more-product-info">
          <h4 class="more-product-title">${product.title}</h4>
          <p class="more-product-price">${formatPrice(product.price)}</p>
          <div class="more-product-meta">
            <div class="more-product-rating">
              <span class="rating-star">★</span>
              <span>${product.rating}</span>
            </div>
            <span class="more-product-sold">${formatSold(product.sold)} sold</span>
          </div>
        </div>
      </div>
    `;
  }
  
  function createLoadingSkeletons(count) {
    return Array(count).fill('').map(() => `
      <div class="product-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    `).join('');
  }
  
  // UPDATED handleProductClick function
  function handleProductClick(e) {
    const card = e.currentTarget;
    const productId = card.dataset.productId;
    
    console.log(`Product ${productId} clicked`);
    
    // Animate click
    card.style.transform = 'scale(0.98)';
    card.style.opacity = '0.8';
    setTimeout(() => {
      card.style.transform = '';
      card.style.opacity = '';
    }, 200);
    
    // Navigate to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
  }
  
  function animateProductsEntrance(cards) {
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  // ===================================
  // 9. LOAD MORE FUNCTIONALITY
  // ===================================
  function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    if (!loadMoreBtn) {
      console.log('Load more button not found');
      return;
    }
    
    // Make sure button is visible initially
    if (loadMoreContainer) {
      loadMoreContainer.style.display = 'block';
    }
    loadMoreBtn.style.display = 'inline-flex';
    
    console.log('Load more button initialized');
    
    loadMoreBtn.addEventListener('click', handleLoadMore);
  }
  
  function handleLoadMore() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn || state.isLoading || !state.hasMoreProducts) return;
    
    console.log('Load more clicked');
    
    // Update button state
    btn.innerHTML = `
      <span>Loading...</span>
      <i class="fas fa-spinner fa-spin"></i>
    `;
    btn.disabled = true;
    
    // loading skeletons to grid
    const grid = document.getElementById('moreProductsGrid');
    if (grid) {
      const skeletons = createLoadingSkeletons(config.productsPerLoad);
      grid.insertAdjacentHTML('beforeend', skeletons);
    }
    
    // Load more products
    loadMoreProducts();
  }
  
  function updateLoadMoreButton() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;
    
    btn.innerHTML = `
      <span>Show more</span>
      <i class="fas fa-chevron-down"></i>
    `;
    btn.disabled = false;
    
    console.log(`Products loaded: ${state.products.length} / ${mockData.moreProducts.length}`);
  }
  
  function hideLoadMoreButton() {
    const container = document.querySelector('.load-more-container');
    if (container) {
      console.log('Hiding load more button - all products loaded');
      container.style.opacity = '0';
      setTimeout(() => {
        container.style.display = 'none';
      }, 300);
    }
  }

  // ===================================
  // 10. UTILITY FUNCTIONS
  // ===================================
  function formatPrice(price) {
    return `${config.currency}${price.toLocaleString('fr-CM')}`;
  }
  
  function formatSold(count) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return `${count}+`;
  }
  
  function showNotification(message, type = 'info') {
    // Use main app's notification if available
    if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification(message, type);
    } else {
      console.log(message);
      
      // Fallback notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? '#3b82f6' : '#10b981'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  // ===================================
  // 11. PUBLIC API
  // ===================================
  return {
    init: init,
    loadMore: loadMoreProducts,
    getState: () => state,
    resetProducts: () => {
      state.products = [];
      state.hasMoreProducts = true;
      const grid = document.getElementById('moreProductsGrid');
      if (grid) grid.innerHTML = '';
      initMoreProducts();
    }
  };
})();

// ===================================
// 12. AUTO-INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  CatalogueV2.init();
});

// Export for global access
window.CatalogueV2 = CatalogueV2;



/* ===================================
   MODERN FOOTER - JAVASCRIPT
   =================================== */

const ModernFooter = (function() {
  'use strict';

  // Configuration
  const config = {
    scrollThreshold: 300,
    animationDuration: 300,
    newsletterDelay: 2000,
    observerThreshold: 0.1
  };

  // State
  const state = {
    isNewsletterSubmitting: false,
    lastScrollPosition: 0,
    isFooterVisible: false
  };

  // Cache DOM elements
  let elements = {};

  // Initialize footer functionality
  function init() {
    console.log('Initializing Modern Footer...');
    
    // Cache elements
    cacheElements();
    
    // Initialize components
    initBackToTop();
    initNewsletter();
    initAnimations();
    initSocialLinks();
    initLanguageCurrency();
    initMobileInteractions();
    
    console.log('Modern Footer initialized successfully');
  }

  // Cache DOM elements
  function cacheElements() {
    elements = {
      backToTop: document.getElementById('backToTop'),
      newsletterForm: document.getElementById('newsletterForm'),
      newsletterInput: document.querySelector('.newsletter-input'),
      newsletterBtn: document.querySelector('.newsletter-btn'),
      socialLinks: document.querySelectorAll('.social-link'),
      footerColumns: document.querySelectorAll('.footer-column'),
      featureItems: document.querySelectorAll('.feature-item'),
      paymentMethods: document.querySelectorAll('.payment-method'),
      langSelect: document.querySelector('.lang-select'),
      currencySelect: document.querySelector('.currency-select'),
      footer: document.querySelector('.modern-footer')
    };
  }

  // ===================================
  // BACK TO TOP FUNCTIONALITY
  // ===================================
  function initBackToTop() {
    if (!elements.backToTop) return;

    // Show/hide on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateBackToTopVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Click handler
    elements.backToTop.addEventListener('click', () => {
      scrollToTop();
    });

    // Keyboard support
    elements.backToTop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
      }
    });
  }

  // Update back to top visibility
  function updateBackToTopVisibility() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollPosition > config.scrollThreshold) {
      elements.backToTop.classList.add('visible');
    } else {
      elements.backToTop.classList.remove('visible');
    }
    
    state.lastScrollPosition = scrollPosition;
  }

  // Smooth scroll to top
  function scrollToTop() {
    // Add click animation
    elements.backToTop.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      elements.backToTop.style.transform = '';
    }, 200);

    // Smooth scroll
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Focus management for accessibility
    document.body.focus();
  }

  // ===================================
  // NEWSLETTER FUNCTIONALITY
  // ===================================
  function initNewsletter() {
    if (!elements.newsletterForm) return;

    elements.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    // Input validation
    elements.newsletterInput.addEventListener('input', validateEmail);
    
    // Enter key support
    elements.newsletterInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && validateEmail()) {
        elements.newsletterForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  // Handle newsletter form submission
  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    if (state.isNewsletterSubmitting) return;
    
    const email = elements.newsletterInput.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
      showNewsletterError('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    setNewsletterLoading(true);     
    
    try {
      // Simulate API call
      await subscribeNewsletter(email);
      
      // Show success
      showNewsletterSuccess('Successfully subscribed! Check your email for confirmation.');
      
      // Clear form
      elements.newsletterForm.reset();
      
      // Update subscriber count
      updateSubscriberCount();    
      
    } catch (error) {
      showNewsletterError('Something went wrong. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  }

  // Email validation
  function validateEmail() {
    const email = elements.newsletterInput.value.trim();
    const isValid = isValidEmail(email);
    
    if (email && !isValid) {
      elements.newsletterInput.style.borderColor = '#e74c3c';
    } else {
      elements.newsletterInput.style.borderColor = '';
    }
    
    return isValid;
  }

  // Check if email is valid
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // newsletter loading state
  function setNewsletterLoading(loading) {
    state.isNewsletterSubmitting = loading;
    
    if (loading) {
      elements.newsletterBtn.classList.add('loading');
      elements.newsletterBtn.disabled = true;
      elements.newsletterInput.disabled = true;
    } else {
      elements.newsletterBtn.classList.remove('loading');
      elements.newsletterBtn.disabled = false;
      elements.newsletterInput.disabled = false;
    }
  }

  // Simulate newsletter subscription API call
  async function subscribeNewsletter(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random success (90% success rate)
    if (Math.random() > 0.1) {
      console.log(`Newsletter subscribed: ${email}`);
      return { success: true };
    } else {
      throw new Error('Subscription failed');
    }
  }

  // Show newsletter success message
  function showNewsletterSuccess(message) {
    const successEl = createNotification(message, 'success');
    elements.newsletterForm.parentElement.appendChild(successEl);
    
    // animation
    elements.newsletterForm.classList.add('newsletter-success');
    
    setTimeout(() => {
      successEl.remove();
      elements.newsletterForm.classList.remove('newsletter-success');
    }, 5000);
  }

  // Show newsletter error message
  function showNewsletterError(message) {
    const errorEl = createNotification(message, 'error');
    elements.newsletterForm.parentElement.appendChild(errorEl);
    
    // Shake animation
    elements.newsletterInput.style.animation = 'shake 0.5s ease';
    
    setTimeout(() => {
      errorEl.remove();
      elements.newsletterInput.style.animation = '';
    }, 3000);
  }

  // Create notification element
  function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `newsletter-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    // styles
    notification.style.cssText = `
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#10b981' : '#e74c3c'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideUp 0.3s ease;
      z-index: 10;
    `;
    
    return notification;
  }

  // Update subscriber count with animation
  function updateSubscriberCount() {
    const countEl = document.querySelector('.subscriber-count');
    if (!countEl) return;
    
    // Get current count
    const currentText = countEl.textContent;
    const match = currentText.match(/(\d+,?\d*)\+/);
    if (!match) return;
    
    const currentCount = parseInt(match[1].replace(',', ''));
    const newCount = currentCount + 1;
    
    // Animate count update
    animateCountUp(countEl, currentCount, newCount);
  }

  // Animate count increment
  function animateCountUp(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeProgress);
      
      element.innerHTML = `
        <i class="fas fa-users"></i>
        Join ${current.toLocaleString()}+ subscribers
      `;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // ===================================
  // ANIMATIONS
  // ===================================
  function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: config.observerThreshold,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !state.isFooterVisible) {
          state.isFooterVisible = true;
          animateFooterElements();
          observer.disconnect();
        }
      });
    }, observerOptions);
    
    // Observe footer
    if (elements.footer) {
      observer.observe(elements.footer);
    }
  }

  // Animate footer elements on scroll into view
  function animateFooterElements() {
   
    console.log('Footer is now visible');
    
    // Add any additional animation triggers
    elements.footerColumns.forEach((column, index) => {
      column.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // ===================================
  // SOCIAL LINKS
  // ===================================
  function initSocialLinks() {
    elements.socialLinks.forEach(link => {
      // Add hover sound effect 
      link.addEventListener('mouseenter', () => {
        // Play subtle hover sound if enabled
        playHoverSound();
      });
      
      // Track social clicks
      link.addEventListener('click', (e) => {
        const platform = getPlatformFromClass(link.className);
        trackSocialClick(platform);
      });
    });
  }

  // Get platform name from class
  function getPlatformFromClass(className) {
    const classes = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
    return classes.find(c => className.includes(c)) || 'unknown';
  }

  // Track social media clicks
  function trackSocialClick(platform) {
    console.log(`Social click: ${platform}`);
   
  }

  // Play hover sound (optional)
  function playHoverSound() {
  
  }

  // ===================================
  // LANGUAGE & CURRENCY
  // ===================================
  function initLanguageCurrency() {
    // Language selector
    if (elements.langSelect) {
      elements.langSelect.addEventListener('click', showLanguageMenu);
    }
    
    // Currency selector
    if (elements.currencySelect) {
      elements.currencySelect.addEventListener('click', showCurrencyMenu);
    }
  }

  // Show language selection menu
  function showLanguageMenu() {
    const languages = [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
    
    showDropdownMenu(elements.langSelect, languages, 'language');
  }

  // Show currency selection menu
  function showCurrencyMenu() {
    const currencies = [
      { code: 'XAF', name: 'CFA Franc', symbol: 'FCFA' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'USD', name: 'US Dollar', symbol: '$' }
    ];
    
    showDropdownMenu(elements.currencySelect, currencies, 'currency');
  }

  // Show dropdown menu
  function showDropdownMenu(trigger, items, type) {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.footer-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
      return;
    }
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'footer-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 0;
      margin-bottom: 8px;
      background: var(--footer-bg-light);
      border: 1px solid var(--footer-border);
      border-radius: 12px;
      padding: 8px;
      min-width: 150px;
      box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
      z-index: 100;
    `;
    
    // Add items
    items.forEach(item => {
      const option = document.createElement('button');
      option.className = 'dropdown-option';
      option.style.cssText = `
        display: block;
        width: 100%;
        padding: 8px 12px;
        text-align: left;
        background: transparent;
        border: none;
        color: var(--footer-text);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
      `;
      
      if (type === 'language') {
        option.innerHTML = `${item.flag} ${item.name}`;
      } else {
        option.innerHTML = `${item.symbol} ${item.name}`;
      }
      
      option.addEventListener('mouseenter', () => {
        option.style.background = 'rgba(255, 255, 255, 0.1)';
        option.style.color = 'var(--footer-heading)';
      });
      
      option.addEventListener('mouseleave', () => {
        option.style.background = 'transparent';
        option.style.color = 'var(--footer-text)';
      });
      
      option.addEventListener('click', () => {
        if (type === 'language') {
          setLanguage(item);
        } else {
          setCurrency(item);
        }
        dropdown.remove();
      });
      
      dropdown.appendChild(option);
    });
    
    // Position and add to DOM
    trigger.style.position = 'relative';
    trigger.appendChild(dropdown);
    
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!trigger.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 0);
  }

  // Set language
  function setLanguage(language) {
    console.log(`Language changed to: ${language.name}`);
    elements.langSelect.innerHTML = `
      <i class="fas fa-globe"></i>
      ${language.name}
      <i class="fas fa-chevron-down"></i>
    `;
    
    // language change logic 
    if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification(`Language changed to ${language.name}`, 'info');
    }
  }

  // Set currency
  function setCurrency(currency) {
    console.log(`Currency changed to: ${currency.name}`);
    elements.currencySelect.innerHTML = `
      <i class="fas fa-money-bill"></i>
      ${currency.code}
      <i class="fas fa-chevron-down"></i>
    `;
    
    // currency change logic 
    if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification(`Currency changed to ${currency.name}`, 'info');
    }
  }

  // ===================================
  // MOBILE INTERACTIONS
  // ===================================
  function initMobileInteractions() {
    // Touch feedback for mobile
    if ('ontouchstart' in window) {
      addTouchFeedback();
    }
    
    // mobile form experience
    improveMobileForm();
  }

  // touch feedback
  function addTouchFeedback() {
    const touchElements = [
      ...elements.socialLinks,
      ...document.querySelectorAll('.footer-links a'),
      ...elements.paymentMethods
    ];
    
    touchElements.forEach(el => {
      el.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
      });
      
      el.addEventListener('touchend', function() {
        this.style.opacity = '';
      });
    });
  }

  // Improve mobile form experience
  function improveMobileForm() {
    if (elements.newsletterInput) {
      // Auto-capitalize off for email
      elements.newsletterInput.setAttribute('autocapitalize', 'off');
      
      // Show email keyboard on mobile
      elements.newsletterInput.setAttribute('inputmode', 'email');
    }
  }

  // ===================================
  // UTILITY FUNCTIONS 
  // ===================================
  
  // Debounce function
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

  // Throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // shake animation CSS
  function addShakeAnimation() {
    if (document.getElementById('footer-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'footer-animations';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translate(-50%, 10px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ===================================
  // PUBLIC API
  // ===================================
  return {
    init: init,
    scrollToTop: scrollToTop,
    subscribeNewsletter: handleNewsletterSubmit
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ModernFooter.init();
});

// Export 
window.ModernFooter = ModernFooter;