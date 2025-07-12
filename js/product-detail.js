/* ===================================
   PRODUCT DETAIL PAGE - JAVASCRIPT
   Dynamic functionality for product pages
   =================================== */

// ===================================
// 1. PRODUCT DETAIL MODULE
// ===================================
const ProductDetail = (function() {
  'use strict';

  // ===================================
  // 2. MODULE STATE & CONFIG
  // ===================================
  const state = {
    currentProduct: null,
    selectedColor: 'Black',
    selectedQuantity: 1,
    currentImageIndex: 0,
    relatedProductsPage: 1,
    isLoading: false
  };

  const config = {
    currency: 'CFA ',
    relatedProductsPerPage: 8,
    shopProductsPerSlide: 5
  };

  // ===================================
  // 3. MOCK DATA
  // ===================================
  const mockData = {
    products: {
      '1': {
        id: '1',
        title: 'Premium Wireless Bluetooth Headphones with Active Noise Cancellation',
        price: 45000,
        originalPrice: 60000,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1528148343865-51218c4a13e6?w=600&h=600&fit=crop'
        ],
        colors: ['Black', 'White', 'Blue', 'Red'],
        stock: 234,
        rating: 4.5,
        reviews: 2341,
        sold: 5200,
        views: 12300,
        category: 'Electronics',
        subcategory: 'Headphones',
        supplier: {
          id: 'supplier1',
          name: 'Techno Electronics 237.',
          avatar: 'assets/images/business-cover.png',
          verified: true,
          years: 5,
          rating: 4.8,
          responseRate: 98,
          shipTime: '1-2d',
          location: 'Douala, Cameroon'
        },
        description: {
          main: 'Experience premium sound quality with our Wireless Bluetooth Headphones featuring advanced Active Noise Cancellation technology. These headphones are designed for audiophiles and casual listeners alike, delivering crystal-clear audio across all frequencies.',
          features: [
            'Active Noise Cancellation',
            '30 Hours Battery Life',
            'Premium Sound Quality',
            'Comfortable Over-Ear Design'
          ],
          inBox: [
            '1x Wireless Bluetooth Headphones',
            '1x USB-C Charging Cable',
            '1x 3.5mm Audio Cable',
            '1x Carrying Case',
            '1x User Manual'
          ]
        },
        specifications: {
          'Model Number': 'WH-1000XM5',
          'Connectivity': 'Bluetooth 5.2',
          'Battery Life': '30 Hours (ANC On)',
          'Charging Time': '3 Hours',
          'Driver Size': '40mm',
          'Frequency Response': '20Hz - 20kHz',
          'Weight': '250g',
          'Warranty': '2 months seller Warranty'
        }
      }
    },
    shopProducts: [
      {
        id: '2',
        title: 'Smart Watch with Fitness Tracking',
        price: 35000,
        originalPrice: 45000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 1890
      },
      {
        id: '3',
        title: 'Wireless Earbuds Pro',
        price: 25000,
        originalPrice: 30000,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
        rating: 4.4,
        sold: 3210
      },
      {
        id: '4',
        title: 'Portable Bluetooth Speaker',
        price: 18000,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 2156
      },
      {
        id: '5',
        title: 'USB-C Fast Charger 65W',
        price: 12000,
        originalPrice: 15000,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop',
        rating: 4.5,
        sold: 4532
      },
      {
        id: '6',
        title: 'Laptop Stand Adjustable',
        price: 22000,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
        rating: 4.3,
        sold: 892
      }
    ],
    relatedProducts: [
      {
        id: '7',
        title: 'Sony WH-1000XM4 Wireless Headphones',
        price: 42000,
        originalPrice: 55000,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop',
        rating: 4.6,
        sold: 1567
      },
      {
        id: '8',
        title: 'Bose QuietComfort 45',
        price: 48000,
        originalPrice: 60000,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop',
        rating: 4.7,
        sold: 982
      },
      {
        id: '9',
        title: 'JBL Tune 750BTNC',
        price: 22000,
        originalPrice: 28000,
        image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&h=300&fit=crop',
        rating: 4.3,
        sold: 3421
      },
      {
        id: '10',
        title: 'Sennheiser HD 450BT',
        price: 35000,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop',
        rating: 4.5,
        sold: 1234
      }
    ]
  };

  // ===================================
  // 4. INITIALIZATION
  // ===================================
  function init() {
    // Check if we're on the product detail page
    if (!document.getElementById('productTitle') || !document.getElementById('productBreadcrumb')) {
      console.log('Not on product detail page, skipping initialization');
      return;
    }
    
    console.log('Initializing Product Detail Page...');
    
    // Get product ID from URL
    const productId = getProductIdFromUrl();
    
    // Load product data
    loadProductData(productId);
    
    // Initialize components
    initImageGallery();
    initQuantitySelector();
    initColorSelector();
    initTabs();
    initFAQ();
    initShopProductsSlider();
    initRelatedProducts();
    initProductActions();
    
    console.log('Product Detail Page initialized');
  }

  // ===================================
  // 5. PRODUCT DATA LOADING
  // ===================================
  function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1'; // Default to product 1 for demo
  }

  function loadProductData(productId) {
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
      const product = mockData.products[productId] || mockData.products['1'];
      state.currentProduct = product;
      
      // Update page content
      updatePageContent(product);
      
      // Load shop products
      loadShopProducts(product.supplier.id);
      
      // Load related products
      loadRelatedProducts(product.category);

      if (window.SupplierPanel) {
        setTimeout(() => {
          window.SupplierPanel.showFloatingTrigger();
        }, 1500);
      }
      
      hideLoadingState();
    }, 500);
  }

  function updatePageContent(product) {
    // Update breadcrumb
    updateBreadcrumb(product);
    
    // Update product info
    document.getElementById('productTitle').textContent = product.title;
    
    // Update images
    updateProductImages(product.images);
    
    // Update price
    updatePriceSection(product);
    
    // Update rating
    updateRatingSection(product);
    
    // Update stock
    updateStockInfo(product.stock);
    
    // Update supplier card
    updateSupplierCard(product.supplier);
    
    // Update description
    updateDescription(product.description);
    
    // Update specifications
    updateSpecifications(product.specifications);
    
    // Update meta tags for SEO
    updateMetaTags(product);
  }

  // ===================================
  // 6. IMAGE GALLERY
  // ===================================
  function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainImage = document.getElementById('mainProductImage');
    const prevBtn = document.getElementById('thumbPrev');
    const nextBtn = document.getElementById('thumbNext');
    
    // Thumbnail click
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        setActiveImage(index);
      });
    });
    
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        navigateThumbnails('prev');
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        navigateThumbnails('next');
      });
    }
    
    // Image zoom functionality
    initImageZoom();
  }

  function setActiveImage(index) {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainImage = document.getElementById('mainProductImage');
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[index].classList.add('active');
    
    // Update main image with fade effect
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.src = thumbnails[index].dataset.image;
      mainImage.style.opacity = '1';
    }, 200);
    
    state.currentImageIndex = index;
  }

  function navigateThumbnails(direction) {
    const track = document.getElementById('thumbnailTrack');
    const scrollAmount = 88; // thumbnail width + gap
    
    if (direction === 'prev') {
      track.scrollLeft -= scrollAmount;
    } else {
      track.scrollLeft += scrollAmount;
    }
  }

  function initImageZoom() {
    const container = document.querySelector('.image-zoom-container');
    const image = document.querySelector('.main-product-image');
    const lens = document.querySelector('.image-zoom-lens');
    
    if (!container || !image || !lens) return;
    
    container.addEventListener('mousemove', (e) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      
      // Position lens
      lens.style.left = `${x - lens.offsetWidth / 2}px`;
      lens.style.top = `${y - lens.offsetHeight / 2}px`;
      
      // Keep lens within bounds
      if (lens.offsetLeft < 0) lens.style.left = '0';
      if (lens.offsetTop < 0) lens.style.top = '0';
      if (lens.offsetLeft > container.offsetWidth - lens.offsetWidth) {
        lens.style.left = `${container.offsetWidth - lens.offsetWidth}px`;
      }
      if (lens.offsetTop > container.offsetHeight - lens.offsetHeight) {
        lens.style.top = `${container.offsetHeight - lens.offsetHeight}px`;
      }
    });
  }

  // ===================================
  // 7. QUANTITY SELECTOR
  // ===================================
  function initQuantitySelector() {
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');
    const input = document.getElementById('qtyInput');
    
    if (!minusBtn || !plusBtn || !input) return;
    
    minusBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value) || 1;
      if (currentValue > 1) {
        input.value = currentValue - 1;
        state.selectedQuantity = currentValue - 1;
        updateQuantityButtons();
      }
    });
    
    plusBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value) || 1;
      const maxStock = state.currentProduct?.stock || 999;
      if (currentValue < maxStock) {
        input.value = currentValue + 1;
        state.selectedQuantity = currentValue + 1;
        updateQuantityButtons();
      }
    });
    
    input.addEventListener('change', () => {
      let value = parseInt(input.value) || 1;
      const maxStock = state.currentProduct?.stock || 999;
      
      if (value < 1) value = 1;
      if (value > maxStock) value = maxStock;
      
      input.value = value;
      state.selectedQuantity = value;
      updateQuantityButtons();
    });
  }

  function updateQuantityButtons() {
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');
    const maxStock = state.currentProduct?.stock || 999;
    
    if (minusBtn) {
      minusBtn.disabled = state.selectedQuantity <= 1;
    }
    
    if (plusBtn) {
      plusBtn.disabled = state.selectedQuantity >= maxStock;
    }
  }

  // ===================================
  // 8. COLOR SELECTOR
  // ===================================
  function initColorSelector() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove active from all
        colorOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active to clicked
        option.classList.add('active');
        state.selectedColor = option.dataset.color;
        
        // Could update images based on color here
        console.log(`Selected color: ${state.selectedColor}`);
      });
    });
  }

  // ===================================
  // 9. TABS FUNCTIONALITY
  // ===================================
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Update buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update panes
        tabPanes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === targetTab) {
            pane.classList.add('active');
          }
        });
      });
    });
  }

  // ===================================
  // 10. FAQ ACCORDION
  // ===================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      if (question) {
        question.addEventListener('click', () => {
          // Close other items
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle current item
          item.classList.toggle('active');
        });
      }
    });
  }

  // ===================================
  // 11. SHOP PRODUCTS SLIDER
  // ===================================
  function initShopProductsSlider() {
    // Check if Swiper is available
    if (typeof Swiper === 'undefined') return;
    
    try {
      new Swiper('.shop-products-slider', {
        slidesPerView: 2,
        spaceBetween: 16,
        navigation: {
          nextEl: '.shop-products-slider .swiper-button-next',
          prevEl: '.shop-products-slider .swiper-button-prev',
        },
        pagination: {
          el: '.shop-products-slider .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
        },
      });
    } catch (error) {
      console.error('Error initializing shop products slider:', error);
    }
  }

  function loadShopProducts(supplierId) {
    const wrapper = document.getElementById('shopProductsWrapper');
    if (!wrapper) return;
    
    // Clear existing
    wrapper.innerHTML = '';
    
    // Add products
    mockData.shopProducts.forEach(product => {
      wrapper.appendChild(createProductSlide(product));
    });
  }

  function createProductSlide(product) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-card-content">
          <h4 class="product-card-title">${product.title}</h4>
          <div class="product-card-price">
            <span class="price-current">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <div class="product-card-meta">
            <div class="product-card-rating">
              <i class="fas fa-star"></i>
              <span>${product.rating}</span>
            </div>
            <span class="product-card-sold">${formatSold(product.sold)} sold</span>
          </div>
        </div>
      </div>
    `;
    
    // Add click handler
    slide.querySelector('.product-card').addEventListener('click', () => {
      window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    return slide;
  }

  // ===================================
  // 12. RELATED PRODUCTS
  // ===================================
  function initRelatedProducts() {
    const loadMoreBtn = document.getElementById('loadMoreRelated');
    
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        loadMoreRelatedProducts();
      });
    }
  }

  function loadRelatedProducts(category) {
    const grid = document.getElementById('relatedProductsGrid');
    if (!grid) return;
    
    // Clear existing
    grid.innerHTML = '';
    
    // Load initial products
    const initialProducts = mockData.relatedProducts.slice(0, config.relatedProductsPerPage);
    initialProducts.forEach(product => {
      grid.appendChild(createProductCard(product));
    });
  }

  function loadMoreRelatedProducts() {
    const grid = document.getElementById('relatedProductsGrid');
    const loadMoreBtn = document.getElementById('loadMoreRelated');
    if (!grid || state.isLoading) return;
    
    state.isLoading = true;
    
    // Update button
    loadMoreBtn.innerHTML = `
      <span>Loading...</span>
      <i class="fas fa-spinner fa-spin"></i>
    `;
    loadMoreBtn.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
      // Get more products (in real app, this would be an API call)
      const startIndex = state.relatedProductsPage * config.relatedProductsPerPage;
      const moreProducts = mockData.relatedProducts.slice(startIndex, startIndex + config.relatedProductsPerPage);
      
      if (moreProducts.length === 0) {
        // No more products
        loadMoreBtn.style.display = 'none';
      } else {
        // Add products
        moreProducts.forEach(product => {
          grid.appendChild(createProductCard(product));
        });
        
        state.relatedProductsPage++;
        
        // Reset button
        loadMoreBtn.innerHTML = `
          <span>Show More Related Products</span>
          <i class="fas fa-chevron-down"></i>
        `;
        loadMoreBtn.disabled = false;
      }
      
      state.isLoading = false;
    }, 800);
  }

  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-card-content">
        <h4 class="product-card-title">${product.title}</h4>
        <div class="product-card-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-card-meta">
          <div class="product-card-rating">
            <i class="fas fa-star"></i>
            <span>${product.rating}</span>
          </div>
          <span class="product-card-sold">${formatSold(product.sold)} sold</span>
        </div>
      </div>
    `;
    
    // Add click handler
    card.addEventListener('click', () => {
      window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    // Add entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 50);
    
    return card;
  }

  // ===================================
  // 13. PRODUCT ACTIONS
  // ===================================
  function initProductActions() {
    // Buy Now button
    const buyNowBtn = document.querySelector('.btn-buy-now');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', handleBuyNow);
    }
    
    // Add to Cart button
    const addCartBtn = document.querySelector('.btn-add-cart');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', handleAddToCart);
    }
    
    // Contact Supplier button
    const contactBtn = document.querySelector('.btn-contact-supplier');
    if (contactBtn) {
      contactBtn.addEventListener('click', handleContactSupplier);
    }
  }

  function handleBuyNow() {
    if (!state.currentProduct) return;
    
    const orderData = {
      productId: state.currentProduct.id,
      quantity: state.selectedQuantity,
      color: state.selectedColor,
      price: state.currentProduct.price
    };
    
    console.log('Buy Now:', orderData);
    
    // Show notification
    showNotification('Redirecting to checkout...', 'success');
    
    // In real app, redirect to checkout with order data
    // window.location.href = `/checkout?product=${orderData.productId}&qty=${orderData.quantity}`;
  }

  function handleAddToCart() {
    if (!state.currentProduct) return;
    
    const cartItem = {
      productId: state.currentProduct.id,
      title: state.currentProduct.title,
      price: state.currentProduct.price,
      quantity: state.selectedQuantity,
      color: state.selectedColor,
      image: state.currentProduct.images[0]
    };
    
    // Add to cart (integrate with main app's cart system)
    if (window.VerandaMarket && window.VerandaMarket.addToCart) {
      window.VerandaMarket.addToCart(cartItem.productId);
    }
    
    // Animate button
    const btn = document.querySelector('.btn-add-cart');
    btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
    btn.style.background = '#10b981';
    btn.style.color = 'white';
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
    
    showNotification(`${cartItem.title} added to cart!`, 'success');
  }

  function handleContactSupplier() {
    if (!state.currentProduct) return;
    
    // Open supplier panel
    if (window.SupplierPanel) {
      window.SupplierPanel.open(state.currentProduct.supplier.id || 'supplier1');
    } else {
      console.log('Contact supplier:', state.currentProduct.supplier.name);
      showNotification('Opening supplier info...', 'info');
    }
  }

  // ===================================
  // 14. UPDATE FUNCTIONS
  // ===================================
  function updateBreadcrumb(product) {
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const subcategoryBreadcrumb = document.getElementById('subcategoryBreadcrumb');
    const productBreadcrumb = document.getElementById('productBreadcrumb');
    
    if (categoryBreadcrumb) {
      categoryBreadcrumb.textContent = product.category;
    }
    if (subcategoryBreadcrumb) {
      subcategoryBreadcrumb.textContent = product.subcategory;
    }
    if (productBreadcrumb) {
      productBreadcrumb.textContent = product.title;
    }
  }

  function updateProductImages(images) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailTrack = document.getElementById('thumbnailTrack');
    
    if (mainImage) {
      mainImage.src = images[0];
    }
    
    if (thumbnailTrack) {
      thumbnailTrack.innerHTML = images.map((image, index) => `
        <div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-image="${image}">
          <img src="${image.replace('600x600', '100x100')}" alt="Product ${index + 1}">
        </div>
      `).join('');
      
      // Re-init gallery
      initImageGallery();
    }
  }

  function updatePriceSection(product) {
    const priceRow = document.querySelector('.price-row');
    if (!priceRow) return;
    
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    
    priceRow.innerHTML = `
      <span class="current-price">${formatPrice(product.price)}</span>
      ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
      ${discount > 0 ? `<span class="discount-percent">${discount}% OFF</span>` : ''}
    `;
  }

  function updateRatingSection(product) {
    const ratingSection = document.querySelector('.rating-section');
    if (!ratingSection) return;
    
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      starsHTML += '<i class="far fa-star"></i>';
    }
    
    ratingSection.innerHTML = `
      <div class="rating-stars">${starsHTML}</div>
      <span class="rating-value">${product.rating}</span>
      <span class="rating-count">(${product.reviews.toLocaleString()} reviews)</span>
    `;
    
    // Update stats
    const statsSection = document.querySelector('.product-stats');
    if (statsSection) {
      statsSection.innerHTML = `
        <span class="stat-item">
          <i class="fas fa-shopping-cart"></i>
          ${formatSold(product.sold)} sold
        </span>
        <span class="stat-item">
          <i class="fas fa-eye"></i>
          ${formatViews(product.views)} views
        </span>
      `;
    }
  }

  function updateStockInfo(stock) {
    const stockInfo = document.querySelector('.stock-info');
    if (!stockInfo) return;
    
    if (stock > 0) {
      stockInfo.innerHTML = `
        <i class="fas fa-check-circle"></i>
        In Stock (${stock} available)
      `;
      stockInfo.style.color = '#10b981';
    } else {
      stockInfo.innerHTML = `
        <i class="fas fa-times-circle"></i>
        Out of Stock
      `;
      stockInfo.style.color = '#ef4444';
    }
  }

  function updateSupplierCard(supplier) {
    // Update supplier name
    const supplierName = document.querySelector('.supplier-name');
    if (supplierName) {
      supplierName.textContent = supplier.name;
    }
    
    // Update avatar
    const avatar = document.querySelector('.supplier-avatar');
    if (avatar) {
      avatar.src = supplier.avatar;
    }

      // Update supplier profile link
  const supplierLink = document.getElementById('supplierProfileLink');
  if (supplierLink) {
    supplierLink.href = `shop-template.html?supplier=${encodeURIComponent(supplier.name)}`;
    supplierLink.title = `Visit ${supplier.name} Shop`;
  }
    
    // Update badges
    const badges = document.querySelector('.supplier-badges');
    if (badges) {
      badges.innerHTML = `
        ${supplier.verified ? `
          <span class="verified-badge">
            <i class="fas fa-check-circle"></i>
            Verified
          </span>
        ` : ''}
        <span class="years-badge">
          <i class="fas fa-award"></i>
          ${supplier.years} Years
        </span>
      `;
    }
    
    // Update stats
    const stats = document.querySelector('.supplier-stats');
    if (stats) {
      stats.innerHTML = `
        <div class="stat">
          <span class="stat-value">${supplier.rating}</span>
          <span class="stat-label">Rating</span>
        </div>
        <div class="stat">
          <span class="stat-value">${supplier.responseRate}%</span>
          <span class="stat-label">Response</span>
        </div>
        <div class="stat">
          <span class="stat-value">${supplier.shipTime}</span>
          <span class="stat-label">Ship Time</span>
        </div>
      `;
    }
    
    // Update location
    const location = document.querySelector('.supplier-location span');
    if (location) {
      location.textContent = supplier.location;
    }
  }

  function updateDescription(description) {
    const descContent = document.querySelector('.description-content');
    if (!descContent) return;
    
    let featuresHTML = '';
    if (description.features) {
      featuresHTML = `
        <h4>Key Benefits:</h4>
        <ul>
          ${description.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      `;
    }
    
    let inBoxHTML = '';
    if (description.inBox) {
      inBoxHTML = `
        <h4>What's in the Box:</h4>
        <ul>
          ${description.inBox.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }
    
    descContent.innerHTML = `
      <h3>Product Description</h3>
      <p>${description.main}</p>
      ${inBoxHTML}
      ${featuresHTML}
    `;
  }

  function updateSpecifications(specs) {
    const specsTable = document.querySelector('.specs-table');
    if (!specsTable || !specs) return;
    
    specsTable.innerHTML = Object.entries(specs).map(([key, value]) => `
      <tr>
        <td>${key}</td>
        <td>${value}</td>
      </tr>
    `).join('');
  }

  function updateMetaTags(product) {
    // Update page title
    document.title = `${product.title} - Veranda Market`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = product.description.main.substring(0, 160);
    }
  }

  // ===================================
  // 15. UTILITY FUNCTIONS
  // ===================================
  function formatPrice(price) {
    return `${config.currency}${price.toLocaleString('fr-CM')}`;
  }

  function formatSold(count) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  function formatViews(count) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  function showNotification(message, type = 'info') {
    // Use main app's notification if available
    if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification(message, type);
    } else {
      // Fallback notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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

  function showLoadingState() {
    // Add loading class to body
    document.body.classList.add('loading');
  }

  function hideLoadingState() {
    // Remove loading class
    document.body.classList.remove('loading');
  }

  // ===================================
  // 16. PUBLIC API
  // ===================================
  return {
    init: init,
    loadProduct: loadProductData,
    getState: () => state
  };
})();

// ===================================
// 17. INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  ProductDetail.init();
});

// Export for global access
window.ProductDetail = ProductDetail;