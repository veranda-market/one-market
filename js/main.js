/* ===================================
   VERANDA MARKET - MAIN JAVASCRIPT 
   =================================== */

// ===================================
// 1. GLOBAL VARIABLES & CONFIGURATION
// ===================================
const config = {
  animationDuration: 300,
  debounceDelay: 300,
  scrollOffset: 100,
  productsPerPage: 12,
  currency: 'XAF',
  api: {
    baseUrl: '/api/v1',
    endpoints: {
      products: '/products',
      categories: '/categories',
      search: '/search',
      cart: '/cart',
      user: '/user'
    }
  }
};

// State Management
const state = {
  cart: [],
  user: null,
  location: 'Select Location',
  language: 'en',
  searchHistory: [],
  favorites: [],
  recentlyViewed: []
};

// ===================================
// 2. UTILITY FUNCTIONS
// ===================================
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Generate random ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Local storage helpers
  storage: {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing from localStorage:', e);
      }
    }
  },

  // Animation helper
  animate(element, animation, duration = 300) {
    if (!element) return;
    element.style.animation = `${animation} ${duration}ms ease`;
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  },

  // Smooth scroll to element
  scrollToElement(element, offset = config.scrollOffset) {
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// ===================================
// 3. ERROR HANDLER
// ===================================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Ensure preloader is hidden if there's an error
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }
});

// ===================================
// 4. INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Veranda Market...');
  
  try {
    initPreloader();
    initNavigation();
    initSearch();
    initHeroSlider();
    initProducts();
    initCart();
    initUserAccount();
    initLocationSelector();
    initLanguageSwitcher();
    initScrollEffects();
    initMobileNavigation();
    loadStateFromStorage();
    trackPageView();
    initKeyboardShortcuts();
    
    console.log('Initialization complete');
  } catch (error) {
    console.error('Error during initialization:', error);
    // Hide preloader if initialization fails
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }
});

// ===================================
// 5. PRELOADER
// ===================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  // Hide preloader after a short delay
  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }, 1000);
}

// ===================================
// 6. NAVIGATION
// ===================================
function initNavigation() {
  const header = document.getElementById('header');
  if (!header) return;
  
  let lastScrollTop = 0;
  let ticking = false;

  // Sticky header with hide/show on scroll
  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // Categories dropdown
  const categoriesBtn = document.querySelector('.categories-btn');
  const categoriesDropdown = document.querySelector('.categories-dropdown');
  
  if (categoriesBtn && categoriesDropdown) {
    categoriesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      categoriesDropdown.classList.toggle('active');
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.categories-menu') && categoriesDropdown) {
      categoriesDropdown.classList.remove('active');
    }
  });

  // Navigation links hover effects
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// ===================================
// 7. SEARCH FUNCTIONALITY
// ===================================
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  const searchCategory = document.getElementById('searchCategory');
  const dropdownIndicator = document.querySelector('.dropdown-indicator');
  const searchWrapper = document.querySelector('.search-wrapper');
  
  if (!searchInput) return;
  
  // Create search suggestions dropdown
  const suggestionsDropdown = document.createElement('div');
  suggestionsDropdown.className = 'search-suggestions';
  searchInput.parentElement.appendChild(suggestionsDropdown);

  // Add recent searches on focus
  searchInput.addEventListener('focus', () => {
    if (!searchInput.value) {
      showRecentSearches(suggestionsDropdown);
    }
  });

  // Animate dropdown indicator on category change
  if (searchCategory) {
    searchCategory.addEventListener('change', function(e) {
      if (dropdownIndicator) {
        dropdownIndicator.classList.add('rotate');
        setTimeout(() => {
          dropdownIndicator.classList.remove('rotate');
        }, 300);
      }
      
      // Update placeholder based on selected category
      const placeholders = {
        products: 'Search for products...',
        sellers: 'Search for sellers or stores...',
        locations: 'Search for locations or areas...'
      };
      
      searchInput.placeholder = placeholders[this.value] || 'Search...';
      
      // ripple effect to dropdown
      createRipple(this, e);
    });
    
    // Dropdown focus animations
    searchCategory.addEventListener('focus', function() {
      if (dropdownIndicator) {
        dropdownIndicator.style.transform = 'rotate(180deg)';
      }
    });
    
    searchCategory.addEventListener('blur', function() {
      if (dropdownIndicator) {
        dropdownIndicator.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Search input handler
  const handleSearch = utils.debounce(async (query) => {
    if (query.length < 2) {
      if (!query) {
        showRecentSearches(suggestionsDropdown);
      } else {
        suggestionsDropdown.style.display = 'none';
      }
      return;
    }

    // searching state
    if (searchWrapper) {
      searchWrapper.classList.add('searching');
    }
    
    // Show loading state
    suggestionsDropdown.innerHTML = '<div class="suggestions-loading">Searching...</div>';
    suggestionsDropdown.style.display = 'block';

    // Simulate API call for search suggestions
    const suggestions = await getSearchSuggestions(query, searchCategory?.value || 'products');
    displaySearchSuggestions(suggestions, suggestionsDropdown);
    
    // Remove searching state
    if (searchWrapper) {
      searchWrapper.classList.remove('searching');
    }
  }, config.debounceDelay);

  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  // Search button click with animation
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      createRipple(e.target, e);
      performSearch(searchInput.value, searchCategory?.value || 'products');
    });
  }

  // Enter key search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      if (searchBtn) {
        searchBtn.classList.add('active');
        setTimeout(() => searchBtn.classList.remove('active'), 300);
      }
      performSearch(searchInput.value, searchCategory?.value || 'products');
    }
  });
  
  // Focus effects
  searchInput.addEventListener('focus', () => {
    if (searchCategory && searchCategory.parentElement) {
      searchCategory.parentElement.classList.add('focused');
    }
  });
  
  searchInput.addEventListener('blur', () => {
    if (searchCategory && searchCategory.parentElement) {
      searchCategory.parentElement.classList.remove('focused');
    }
    // Hide suggestions after a delay
    setTimeout(() => {
      suggestionsDropdown.style.display = 'none';
    }, 200);
  });
  
  // Voice search functionality
  const voiceSearchBtn = document.querySelector('.voice-search-btn');
  
  if (voiceSearchBtn) {
    voiceSearchBtn.addEventListener('click', () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = state.language === 'fr' ? 'fr-FR' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        voiceSearchBtn.classList.add('listening');
        
        recognition.start();
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          searchInput.value = transcript;
          handleSearch(transcript);
        };
        
        recognition.onerror = () => {
          voiceSearchBtn.classList.remove('listening');
          showNotification('Voice search failed. Please try again.', 'error');
        };
        
        recognition.onend = () => {
          voiceSearchBtn.classList.remove('listening');
        };
      } else {
        showNotification('Voice search is not supported in your browser.', 'info');
      }
    });
  }
  
  // Click outside to close suggestions
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsDropdown.style.display = 'none';
    }
  });
}

// ===================================
// 8. KEYBOARD SHORTCUTS
// ===================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-input');
      const searchWrapper = document.querySelector('.search-wrapper');
      
      if (searchInput) {
        searchInput.focus();
        
        // glow effect when focused via keyboard
        if (searchWrapper) {
          searchWrapper.classList.add('keyboard-focus');
          setTimeout(() => {
            searchWrapper.classList.remove('keyboard-focus');
          }, 2000);
        }
      }
    }
  });
}

// ===================================
// 9. SEARCH HELPER FUNCTIONS
// ===================================
function showRecentSearches(container) {
  if (!container || state.searchHistory.length === 0) return;
  
  let html = '<div class="search-suggestions-header">Recent Searches</div>';
  html += state.searchHistory.slice(0, 5).map(search => `
    <div class="suggestion-item recent-search" data-query="${search.query}">
      <i class="fas fa-history"></i>
      <span>${search.query}</span>
    </div>
  `).join('');
  
  container.innerHTML = html;
  container.style.display = 'block';
  
  // click handlers
  container.querySelectorAll('.recent-search').forEach(item => {
    item.addEventListener('click', () => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.value = item.dataset.query;
        container.style.display = 'none';
        performSearch(item.dataset.query);
      }
    });
  });
}

function createRipple(element, event) {
  if (!element || !event) return;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

async function getSearchSuggestions(query, category) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock suggestions
  const suggestions = [
    { id: 1, text: `${query} in Electronics`, category: 'electronics' },
    { id: 2, text: `${query} in Fashion`, category: 'fashion' },
    { id: 3, text: `${query} near me`, category: 'location' },
    { id: 4, text: `Best ${query} deals`, category: 'deals' }
  ];
  
  return suggestions;
}

function displaySearchSuggestions(suggestions, container) {
  if (!container) return;
  
  container.innerHTML = suggestions.map(suggestion => `
    <div class="suggestion-item" data-id="${suggestion.id}">
      <i class="fas fa-search"></i>
      <span>${suggestion.text}</span>
    </div>
  `).join('');
  
  container.style.display = 'block';
  
  // click handlers
  container.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.value = item.querySelector('span').textContent;
        container.style.display = 'none';
        performSearch(searchInput.value);
      }
    });
  });
}

function performSearch(query, category) {
  if (!query.trim()) return;
  
  // Add to search history
  state.searchHistory.unshift({ query, category, timestamp: Date.now() });
  state.searchHistory = state.searchHistory.slice(0, 10); // Keep last 10 searches
  utils.storage.set('searchHistory', state.searchHistory);
  
  // Log search (in production, redirect to search results page)
  console.log(`Searching for: ${query} in ${category}`);
  // window.location.href = `/search?q=${encodeURIComponent(query)}&cat=${category}`;
}

// ===================================
// 10. HERO SLIDER
// ===================================
function initHeroSlider() {
  // Check if Swiper is loaded
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper library not loaded, skipping hero slider initialization');
    return;
  }
  
  const heroSliderElement = document.querySelector('.hero-slider');
  if (!heroSliderElement) return;
  
  try {
    const heroSlider = new Swiper('.hero-slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className}"><span class="progress"></span></span>`;
        }
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      on: {
        slideChange: function() {
          animateSlideContent(this.slides[this.activeIndex]);
        }
      }
    });

    // Animate first slide on load
    setTimeout(() => {
      animateSlideContent(document.querySelector('.swiper-slide-active'));
    }, 100);
  } catch (error) {
    console.error('Error initializing hero slider:', error);
  }
}

function animateSlideContent(slide) {
  if (!slide) return;
  
  const content = slide.querySelector('.hero-content');
  const image = slide.querySelector('.hero-image');
  
  if (content) {
    content.style.animation = 'slideInLeft 0.8s ease forwards';
  }
  
  if (image) {
    image.style.animation = 'slideInRight 0.8s ease forwards';
  }
}

// ===================================
// 11. PRODUCTS FUNCTIONALITY
// ===================================

// Define fetchProducts first (UPDATED WITH PRODUCT IDs)
async function fetchProducts(type, limit) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock product data with realistic names and IDs
  const popularProducts = [
    {
      id: 'prod-001',
      name: 'iPhone 15 Pro Max',
      price: 650000,
      originalPrice: 750000,
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop',
      rating: '4.8',
      reviews: 1250,
      badge: 'New'
    },
    {
      id: 'prod-002',
      name: 'Samsung 65" 4K QLED',
      price: 450000,
      originalPrice: 550000,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
      rating: '4.6',
      reviews: 856,
      badge: null
    },
    {
      id: 'prod-003',
      name: 'Nike Air Max 270',
      price: 45000,
      originalPrice: 52000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      rating: '4.7',
      reviews: 2341,
      badge: 'Sale'
    },
    {
      id: 'prod-004',
      name: 'Apple MacBook Air M2',
      price: 850000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      rating: '4.9',
      reviews: 567,
      badge: 'New'
    },
    {
      id: 'prod-005',
      name: 'Sony WH-1000XM5 Headphones',
      price: 180000,
      originalPrice: 220000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: '4.7',
      reviews: 3456,
      badge: null
    },
    {
      id: 'prod-006',
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
      price: 35000,
      originalPrice: 45000,
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&h=400&fit=crop',
      rating: '4.5',
      reviews: 892,
      badge: 'Sale'
    },
    {
      id: 'prod-007',
      name: 'Canon EOS R6 Mirrorless Camera Body',
      price: 1200000,
      originalPrice: 1400000,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
      rating: '4.8',
      reviews: 234,
      badge: null
    },
    {
      id: 'prod-008',
      name: 'Dyson V15 Detect Cordless Vacuum',
      price: 320000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      rating: '4.6',
      reviews: 1567,
      badge: 'New'
    },
    {
      id: 'prod-009',
      name: 'ASUS ROG Gaming Laptop - RTX 4070',
      price: 980000,
      originalPrice: 1150000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
      rating: '4.7',
      reviews: 445,
      badge: null
    },
    {
      id: 'prod-010',
      name: 'Fitbit Charge 5 Advanced Fitness Tracker',
      price: 65000,
      originalPrice: 75000,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
      rating: '4.4',
      reviews: 2789,
      badge: 'Sale'
    },
    {
      id: 'prod-011',
      name: 'LG French Door Refrigerator 28 Cu. Ft.',
      price: 780000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
      rating: '4.5',
      reviews: 156,
      badge: null
    },
    {
      id: 'prod-012',
      name: 'PlayStation 5 Console - Digital Edition',
      price: 280000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
      rating: '4.9',
      reviews: 5678,
      badge: 'New'
    }
  ];
  
  const newArrivals = [
    {
      id: 'prod-013',
      name: 'Organic Cotton Bed Sheet Set - Queen Size',
      price: 25000,
      originalPrice: 32000,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
      rating: '4.6',
      reviews: 432,
      badge: 'New'
    },
    {
      id: 'prod-014',
      name: 'Vitamix Professional Blender',
      price: 180000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop',
      rating: '4.8',
      reviews: 123,
      badge: 'New'
    },
    {
      id: 'prod-015',
      name: 'Adidas Ultraboost 22 Running Shoes',
      price: 55000,
      originalPrice: 65000,
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
      rating: '4.7',
      reviews: 891,
      badge: null
    },
    {
      id: 'prod-016',
      name: 'Kindle Oasis E-reader - 32GB',
      price: 85000,
      originalPrice: 95000,
      image: 'https://images.unsplash.com/photo-1592434134753-7c5fd3d83d89?w=400&h=400&fit=crop',
      rating: '4.5',
      reviews: 2345,
      badge: 'Sale'
    }
  ];
  
  const recommendedProducts = [
    {
      id: 'prod-017',
      name: 'Bose QuietComfort 45 Headphones',
      price: 150000,
      originalPrice: 180000,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
      rating: '4.6',
      reviews: 1789,
      badge: null
    },
    {
      id: 'prod-018',
      name: 'GoPro HERO11 Black Action Camera',
      price: 220000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop',
      rating: '4.8',
      reviews: 567,
      badge: 'New'
    },
    {
      id: 'prod-019',
      name: 'Ninja Foodi Air Fryer - 6.5 Qt',
      price: 42000,
      originalPrice: 48000,
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
      rating: '4.7',
      reviews: 3421,
      badge: null
    },
    {
      id: 'prod-020',
      name: 'Samsung Galaxy Watch 5 Pro',
      price: 125000,
      originalPrice: 145000,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
      rating: '4.5',
      reviews: 892,
      badge: 'Sale'
    }
  ];
  
  // Return appropriate products based on type
  if (type === 'popular') {
    return popularProducts.slice(0, limit);
  } else if (type === 'new-arrivals') {
    return newArrivals.concat(popularProducts.slice(0, Math.max(0, limit - newArrivals.length)));
  } else if (type === 'recommended') {
    return recommendedProducts.concat(popularProducts.slice(4, Math.max(4, limit - recommendedProducts.length + 4)));
  } else {
    // Default: return mixed products
    return popularProducts.slice(0, limit);
  }
}

function initProducts() {
  try {
    loadPopularNowProducts();
    loadNewArrivals();
    loadRecommendedProducts();
    initProductInteractions();
    initPopularCarousel();
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

async function loadPopularNowProducts() {
  const container = document.getElementById('popularProducts');
  if (!container) return;
  
  try {
    // Show loading state
    container.innerHTML = createCarouselSkeleton(8);
    
    // Simulate API call
    const products = await fetchProducts('popular', 12);
    
    // Render products
    container.innerHTML = products.map((product, index) => createPopularProductCard(product, index)).join('');
    
    // Initialize indicators
    createCarouselIndicators(products.length);
    
    // entrance animations
    container.querySelectorAll('.popular-product-card').forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });
    
    // Set first item as active
    const firstCard = container.querySelector('.popular-product-card');
    if (firstCard) {
      firstCard.classList.add('active');
    }
  } catch (error) {
    console.error('Error loading popular products:', error);
    container.innerHTML = '<p>Error loading products</p>';
  }
}

function createPopularProductCard(product, index) {
  const isNew = index < 3;
  const isTrending = product.rating >= 4.5;
  
  return `
    <div class="popular-product-card" data-id="${product.id}" data-index="${index}">
      ${isNew ? '<span class="product-label new">NEW</span>' : ''}
      ${isTrending ? '<span class="product-label trending">HOT</span>' : ''}
      <div class="product-glow"></div>
      <div class="product-inner">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-overlay">
            <button class="overlay-btn quick-view-btn" data-id="${product.id}">
              <i class="fas fa-eye"></i>
              <span>Quick View</span>
            </button>
          </div>
        </div>
        <div class="product-details">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-footer">
            <div class="price-section">
              <div class="price-tag">
                <span class="price-current">${utils.formatCurrency(product.price)}</span>
                ${product.originalPrice ? `<span class="price-original">${utils.formatCurrency(product.originalPrice)}</span>` : ''}
              </div>
              <div class="product-rating">
                <span class="rating-stars">★ ${product.rating}</span>
                <span class="rating-count">(${product.reviews})</span>
              </div>
            </div>
            <button class="add-cart-btn" data-id="${product.id}">
              <i class="fas fa-plus"></i>
              <span>Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createCarouselSkeleton(count) {
  return Array(count).fill('').map(() => `
    <div class="popular-product-card skeleton">
      <div class="skeleton-inner">
        <div class="skeleton-image shimmer"></div>
        <div class="skeleton-content">
          <div class="skeleton-title shimmer"></div>
          <div class="skeleton-price shimmer"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function createCompactStars(rating) {
  const stars = Math.round(rating);
  return `${'★'.repeat(stars)}${'☆'.repeat(5-stars)}`;
}

function createCarouselIndicators(count) {
  const indicators = document.getElementById('popularIndicators');
  if (!indicators) return;
  
  const totalPages = Math.ceil(count / 4); // 4 items per view
  indicators.innerHTML = Array(totalPages).fill('').map((_, i) => 
    `<span class="indicator ${i === 0 ? 'active' : ''}" data-page="${i}"></span>`
  ).join('');
}

function initPopularCarousel() {
  const carousel = document.getElementById('popularCarousel');
  const track = document.getElementById('popularProducts');
  const prevBtn = document.getElementById('popularPrev');
  const nextBtn = document.getElementById('popularNext');
  const indicators = document.getElementById('popularIndicators');
  
  if (!carousel || !track) return;
  
  let currentIndex = 0;
  let isAnimating = false;
  
  function updateCarousel(index, direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;
    
    const cards = track.querySelectorAll('.popular-product-card');
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 20;
    const visibleCards = 4;
    const maxIndex = Math.max(0, cards.length - visibleCards);
    
    // Clamp index
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    
    // Update transform
    const translateX = -(currentIndex * (cardWidth + gap));
    track.style.transform = `translateX(${translateX}px)`;
    
    // Update active states
    cards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next');
      if (i === currentIndex) {
        card.classList.add('active');
      } else if (i < currentIndex) {
        card.classList.add('prev');
      } else {
        card.classList.add('next');
      }
    });
    
    // Update indicators
    const currentPage = Math.floor(currentIndex / visibleCards);
    indicators?.querySelectorAll('.indicator').forEach((ind, i) => {
      ind.classList.toggle('active', i === currentPage);
    });
    
    // Update button states
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
  
  // Button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 4, 'prev');
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 4, 'next');
    });
  }
  
  // Indicator handlers
  if (indicators) {
    indicators.addEventListener('click', (e) => {
      if (e.target.classList.contains('indicator')) {
        const page = parseInt(e.target.dataset.page);
        updateCarousel(page * 4);
      }
    });
  }
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left
        updateCarousel(currentIndex + 1);
      } else {
        // Swipe right
        updateCarousel(currentIndex - 1);
      }
    }
  }
  
  // Auto-rotate 
  let autoRotateInterval;
  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      const cards = track.querySelectorAll('.popular-product-card');
      const maxIndex = Math.max(0, cards.length - 4);
      if (currentIndex >= maxIndex) {
        updateCarousel(0);
      } else {
        updateCarousel(currentIndex + 1);
      }
    }, 5000);
  }
  
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }
  
  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);
  
  // Start auto-rotate
  startAutoRotate();
}

async function loadNewArrivals() {
  const container = document.getElementById('newArrivals');
  if (!container) return;
  
  try {
    // Show loading skeleton
    container.innerHTML = createProductSkeleton(8);
    
    // Simulate API call
    const products = await fetchProducts('new-arrivals', 8);
    
    // Render products
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // animations
    container.querySelectorAll('.product-card').forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = 'fadeInUp 0.6s ease forwards';
      }, index * 100);
    });
  } catch (error) {
    console.error('Error loading new arrivals:', error);
    container.innerHTML = '<p>Error loading products</p>';
  }
}

async function loadRecommendedProducts() {
  const container = document.getElementById('recommendedProducts');
  if (!container) return;
  
  try {
    // Show loading skeleton
    container.innerHTML = createProductSkeleton(8);
    
    // Get recommendations based on user history
    const products = await fetchProducts('recommended', 8);
    
    // Render products
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // animations
    container.querySelectorAll('.product-card').forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = 'fadeInUp 0.6s ease forwards';
      }, index * 100);
    });
  } catch (error) {
    console.error('Error loading recommended products:', error);
    container.innerHTML = '<p>Error loading products</p>';
  }
}

function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn favorite-btn" data-id="${product.id}">
            <i class="far fa-heart"></i>
          </button>
          <button class="action-btn quick-view-btn" data-id="${product.id}">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          ${createStarRating(product.rating)}
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${utils.formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">${utils.formatCurrency(product.originalPrice)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function createProductSkeleton(count) {
  return Array(count).fill('').map(() => `
    <div class="product-card skeleton">
      <div class="product-image shimmer"></div>
      <div class="product-info">
        <div class="skeleton-text shimmer"></div>
        <div class="skeleton-price shimmer"></div>
        <div class="skeleton-rating shimmer"></div>
      </div>
    </div>
  `).join('');
}

function createStarRating(rating) {
  const fullStars = Math.floor(parseFloat(rating));
  const halfStar = parseFloat(rating) % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return `
    ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
    ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
    ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
  `;
}

// ===================================
// UPDATED PRODUCT INTERACTIONS
// ===================================
function initProductInteractions() {
  // Delegate event handling for dynamically loaded products
  document.addEventListener('click', (e) => {
    // Handle buttons first to prevent navigation
    if (e.target.closest('.add-to-cart-btn') || e.target.closest('.add-cart-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.add-to-cart-btn') || e.target.closest('.add-cart-btn');
      const productId = btn.dataset.id;
      addToCart(productId);
      return;
    }
    
    // Add to favorites - prevent navigation
    if (e.target.closest('.favorite-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.favorite-btn');
      const productId = btn.dataset.id;
      toggleFavorite(productId, btn);
      return;
    }
    
    // Quick view - prevent navigation
    if (e.target.closest('.quick-view-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest('.quick-view-btn');
      const productId = btn.dataset.id;
      showQuickView(productId);
      return;
    }
    
    // Product card click - Navigate to product detail page
    const productCard = e.target.closest('.product-card, .popular-product-card, .more-product-card, .featured-product-card');
    if (productCard && !e.target.closest('button')) {
      e.preventDefault();
      const productId = productCard.dataset.id || productCard.dataset.productId;
      if (productId) {
        navigateToProduct(productId);
      }
    }
  });
}

// ===================================
// NEW NAVIGATION FUNCTION
// ===================================
function navigateToProduct(productId) {
  // loading animation to the clicked card
  const card = document.querySelector(`[data-id="${productId}"], [data-product-id="${productId}"]`);
  if (card) {
    card.style.transform = 'scale(0.98)';
    card.style.opacity = '0.8';
  }
  
  // Navigate to product detail page
  window.location.href = `product-detail.html?id=${productId}`;
}

// ===================================
// 12. CART FUNCTIONALITY
// ===================================
function initCart() {
  updateCartUI();
  
  // Cart icon click
  const cartIcon = document.querySelector('.cart-container');
  if (cartIcon) {
    cartIcon.addEventListener('click', toggleCartDrawer);
  }
}

function addToCart(productId) {
  // Find or create cart item
  const existingItem = state.cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: productId,
      quantity: 1,
      addedAt: Date.now()
    });
  }
  
  // Save to storage
  utils.storage.set('cart', state.cart);
  
  // Update UI
  updateCartUI();
  
  // Show success notification
  showNotification('Product added to cart!', 'success');
  
  // Animate cart icon
  const cartIcon = document.querySelector('.cart-container');
  utils.animate(cartIcon, 'bounce');
}

function updateCartUI() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

function toggleCartDrawer() {
  // Implementation for cart drawer
  console.log('Toggle cart drawer');
}

// ===================================
// 13. USER ACCOUNT
// ===================================
function initUserAccount() {
  const signInBtn = document.querySelector('.btn-signin');
  const registerBtn = document.querySelector('.btn-register');
  
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      showAuthModal('signin');
    });
  }
  
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      showAuthModal('register');
    });
  }
}

function showAuthModal(type) {
  // Create and show authentication modal
  const modal = createAuthModal(type);
  document.body.appendChild(modal);
  
  // Animate modal entrance
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
}

function createAuthModal(type) {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2>${type === 'signin' ? 'Sign In' : 'Create Account'}</h2>
      <form class="auth-form">
        ${type === 'register' ? '<input type="text" placeholder="Full Name" required>' : ''}
        <input type="email" placeholder="Email Address" required>
        <input type="password" placeholder="Password" required>
        ${type === 'register' ? '<input type="password" placeholder="Confirm Password" required>' : ''}
        <button type="submit" class="submit-btn">
          ${type === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      <div class="auth-divider">OR</div>
      <button class="social-auth google">
        <i class="fab fa-google"></i>
        Continue with Google
      </button>
      <button class="social-auth facebook">
        <i class="fab fa-facebook"></i>
        Continue with Facebook
      </button>
      <p class="auth-switch">
        ${type === 'signin' 
          ? "Don't have an account? <a href='#' data-action='register'>Sign Up</a>"
          : "Already have an account? <a href='#' data-action='signin'>Sign In</a>"
        }
      </p>
    </div>
  `;
  
  // event listeners
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    });
  }
  
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    });
  }
  
  return modal;
}

// ===================================
// 14. LOCATION SELECTOR
// ===================================
function initLocationSelector() {
  const locationDisplay = document.getElementById('deliverLocation');
  const locationDropdown = document.querySelector('.location-dropdown');
  
  if (!locationDropdown) return;
  
  // Handle location selection
  locationDropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      const city = item.dataset.city;
      const cityName = item.textContent;
      
      state.location = cityName;
      utils.storage.set('location', state.location);
      
      if (locationDisplay) {
        locationDisplay.textContent = cityName;
      }
      
      // Update delivery estimates
      updateDeliveryEstimates(city);
      
      showNotification(`Delivery location set to ${cityName}`, 'success');
    });
  });
}

function updateDeliveryEstimates(city) {
  // Update delivery times based on location
  console.log(`Updating delivery estimates for ${city}`);
}

// ===================================
// 15. LANGUAGE SWITCHER
// ===================================
function initLanguageSwitcher() {
  const langBtn = document.querySelector('.lang-btn');
  const langDropdown = document.querySelector('.lang-dropdown');
  const currentLang = document.getElementById('currentLang');
  
  if (!langDropdown) return;
  
  langDropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = link.dataset.lang;
      
      state.language = lang;
      utils.storage.set('language', lang);
      
      if (currentLang) {
        currentLang.textContent = lang.toUpperCase();
      }
      
      // Reload page with new language
      // window.location.href = `?lang=${lang}`;
      showNotification(`Language changed to ${link.textContent}`, 'info');
    });
  });
}

// ===================================
// 16. SCROLL EFFECTS
// ===================================
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
  
  // Parallax effect
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// ===================================
// 17. MOBILE NAVIGATION
// ===================================
function initMobileNavigation() {
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  
  mobileNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all items
      mobileNavItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Handle navigation
      const icon = this.querySelector('i');
      if (!icon) return;
      
      const iconClass = icon.className;
      if (iconClass.includes('home')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (iconClass.includes('th-large')) {
        const categoriesBtn = document.querySelector('.categories-btn');
        if (categoriesBtn) categoriesBtn.click();
      } else if (iconClass.includes('shopping-cart')) {
        toggleCartDrawer();
      } else if (iconClass.includes('user')) {
        const userAccount = document.querySelector('.user-account');
        if (userAccount) userAccount.click();
      }
    });
  });
}


// ===================================
// FEATURED CATEGORIES CAROUSEL
// ===================================

function initFeaturedCategoriesCarousel() {
  const carousel = document.querySelector('.featured-carousel');
  const track = document.getElementById('featuredTrack');
  const prevBtn = document.getElementById('featuredPrev');
  const nextBtn = document.getElementById('featuredNext');
  
  if (!carousel || !track) return;
  
  let currentIndex = 0;
  let isAnimating = false;
  
  // Calculate visible cards
  function getVisibleCards() {
    const containerWidth = carousel.offsetWidth;
    const cardWidth = 140 + 24; // card width + gap
    return Math.floor(containerWidth / cardWidth);
  }
  
  // Update carousel position
  function updateCarousel(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    const cards = track.querySelectorAll('.featured-category-card');
    const cardWidth = cards[0]?.offsetWidth || 140;
    const gap = 24;
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visibleCards);
    
    // Clamp index
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    
    // Calculate transform
    const translateX = -(currentIndex * (cardWidth + gap));
    track.style.transform = `translateX(${translateX}px)`;
    
    // Update button states
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    
    // active state to middle visible card
    cards.forEach((card, i) => {
      card.classList.remove('active');
      const middleIndex = currentIndex + Math.floor(visibleCards / 2);
      if (i === middleIndex) {
        card.classList.add('active');
      }
    });
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
  
  // Navigation button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      updateCarousel(currentIndex - Math.floor(visibleCards / 2));
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      updateCarousel(currentIndex + Math.floor(visibleCards / 2));
    });
  }
  
  // Category card click handler
  track.addEventListener('click', (e) => {
    const card = e.target.closest('.featured-category-card');
    if (card) {
      const category = card.dataset.category;
      handleCategoryClick(category);
    }
  });
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        nextBtn?.click();
      } else {
        // Swipe right - previous
        prevBtn?.click();
      }
    }
  }
  
  // Handle category click
  function handleCategoryClick(category) {
    console.log(`Navigate to category: ${category}`);
    // Add your navigation logic here
    // window.location.href = `/category/${category}`;
    
    // Visual feedback
    showNotification(`Exploring ${category} category`, 'info');
  }
  
  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(currentIndex);
    }, 250);
  });
  
  // Initialize
  updateCarousel(0);
  
  // Auto-rotate 
  
  let autoRotateInterval;
  
  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      const cards = track.querySelectorAll('.featured-category-card');
      const visibleCards = getVisibleCards();
      const maxIndex = Math.max(0, cards.length - visibleCards);
      
      if (currentIndex >= maxIndex) {
        updateCarousel(0);
      } else {
        updateCarousel(currentIndex + 1);
      }
    }, 4000);
  }
  
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }
  
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);
  
  // Start auto-rotation
  startAutoRotate();
  
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedCategoriesCarousel();

});

//  smooth loading animation
function loadFeaturedCategories() {
  const cards = document.querySelectorAll('.featured-category-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

// Call on page load
window.addEventListener('load', loadFeaturedCategories);

// Helper function for notifications 
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
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
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// required animations
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);


// ===================================
// 18. HELPER FUNCTIONS
// ===================================
function loadStateFromStorage() {
  try {
    // Load cart
    const savedCart = utils.storage.get('cart');
    if (savedCart) {
      state.cart = savedCart;
      updateCartUI();
    }
    
    // Load location
    const savedLocation = utils.storage.get('location');
    if (savedLocation) {
      state.location = savedLocation;
      const locationDisplay = document.getElementById('deliverLocation');
      if (locationDisplay) {
        locationDisplay.textContent = savedLocation;
      }
    }
    
    // Load language
    const savedLanguage = utils.storage.get('language');
    if (savedLanguage) {
      state.language = savedLanguage;
      const currentLang = document.getElementById('currentLang');
      if (currentLang) {
        currentLang.textContent = savedLanguage.toUpperCase();
      }
    }
    
    // Load favorites
    const savedFavorites = utils.storage.get('favorites');
    if (savedFavorites) {
      state.favorites = savedFavorites;
    }
    
    // Load search history
    const savedSearchHistory = utils.storage.get('searchHistory');
    if (savedSearchHistory) {
      state.searchHistory = savedSearchHistory;
    }
  } catch (error) {
    console.error('Error loading state from storage:', error);
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function toggleFavorite(productId, button) {
  if (!button) return;
  
  const index = state.favorites.indexOf(productId);
  const icon = button.querySelector('i');
  
  if (!icon) return;
  
  if (index > -1) {
    state.favorites.splice(index, 1);
    icon.className = 'far fa-heart';
    showNotification('Removed from favorites', 'info');
  } else {
    state.favorites.push(productId);
    icon.className = 'fas fa-heart';
    showNotification('Added to favorites', 'success');
  }
  
  utils.storage.set('favorites', state.favorites);
  utils.animate(button, 'pulse');
}

function showQuickView(productId) {
  console.log(`Opening quick view for product: ${productId}`);
  
  // Use the QuickViewModal module
  if (window.QuickViewModal) {
    window.QuickViewModal.open(productId);
  } else {
    console.error('QuickViewModal not loaded');
    showNotification('Quick view is not available', 'error');
  }
}

function viewProduct(productId) {
  // recently viewed
  if (!state.recentlyViewed.includes(productId)) {
    state.recentlyViewed.unshift(productId);
    state.recentlyViewed = state.recentlyViewed.slice(0, 10);
    utils.storage.set('recentlyViewed', state.recentlyViewed);
  }
  
  console.log(`View product: ${productId}`);
  // window.location.href = `/product/${productId}`;
}

function trackPageView() {
  // Analytics tracking
  console.log('Page view tracked');
}

// ===================================
// 19. PERFORMANCE MONITORING
// ===================================
window.addEventListener('load', () => {
  // Log performance metrics
  if ('performance' in window && window.performance.timing) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // Only log if we have valid timing data
    if (pageLoadTime > 0) {
      console.log(`Page load time: ${pageLoadTime}ms`);
    }
  }
});

// ===================================
// 20. EXPORT FOR USE IN OTHER MODULES
// ===================================
window.VerandaMarket = {
  utils,
  state,
  config,
  addToCart,
  showNotification,
  toggleFavorite
};
