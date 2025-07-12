/* ===================================
   QUICK VIEW MODAL - JAVASCRIPT
   Complete functionality for product quick view
   =================================== */

// ===================================
// 1. QUICK VIEW MODULE
// ===================================
const QuickViewModal = (function() {
  'use strict';

  // ===================================
  // 2. MODULE STATE
  // ===================================
  const state = {
    isOpen: false,
    currentProduct: null,
    selectedColor: '',
    selectedQuantity: 1,
    currentImageIndex: 0
  };

  // ===================================
  // 3. MOCK PRODUCT DATA
  // ===================================
  const mockProducts = {
    'prod-001': {
      id: 'prod-001',
      name: 'iPhone 15 Pro Max',
      price: 650000,
      originalPrice: 750000,
      images: [
        'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1696446702983-dcd43bef4b59?w=600&h=600&fit=crop'
      ],
      colors: ['Space Black', 'Silver', 'Gold', 'Deep Purple'],
      rating: 4.8,
      reviews: 1250,
      sold: 5234,
      inStock: true,
      description: 'Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring a stunning 6.7-inch display, A17 Pro chip, and advanced camera system.',
      features: [
        'A17 Pro chip',
        '6.7" Super Retina XDR',
        'Pro camera system',
        'All-day battery life',
        'Titanium design',
        '5G capable'
      ],
      supplier: {
        name: 'TechPro Electronics',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
        verified: true,
        rating: 4.8
      }
    },
    'prod-002': {
      id: 'prod-002',
      name: 'Samsung 65" 4K QLED TV',
      price: 450000,
      originalPrice: 550000,
      images: [
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop'
      ],
      colors: ['Black'],
      rating: 4.6,
      reviews: 856,
      sold: 2341,
      inStock: true,
      description: 'Immerse yourself in stunning 4K visuals with Samsung QLED technology. Experience vibrant colors and deep contrasts.',
      features: [
        '65" 4K Display',
        'QLED Technology',
        'Smart TV Features',
        'HDR10+ Support',
        'Game Mode',
        'Voice Control'
      ],
      supplier: {
        name: 'Home Electronics Plus',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
        verified: true,
        rating: 4.7
      }
    },

    
    'prod-005': {
      id: 'prod-005',
      name: 'Sony WH-1000XM5 Headphones',
      price: 180000,
      originalPrice: 220000,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?w=600&h=600&fit=crop'
      ],
      colors: ['Black', 'Silver', 'Midnight Blue'],
      rating: 4.7,
      reviews: 3456,
      sold: 8921,
      inStock: true,
      description: 'Industry-leading noise cancellation meets exceptional sound quality. Perfect for music lovers and frequent travelers.',
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Multipoint connection',
        'Speak-to-Chat',
        'Touch controls',
        'Premium comfort'
      ],
      supplier: {
        name: 'AudioTech Store',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
        verified: true,
        rating: 4.9
      }
    }
  };

  // ===================================
  // 4. INITIALIZATION
  // ===================================
  function init() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('quickViewModal')) {
      createModalHTML();
    }
    
    // Initialize event listeners
    initEventListeners();
    
    console.log('Quick View Modal initialized');
  }

  // ===================================
  // 5. CREATE MODAL HTML
  // ===================================
  function createModalHTML() {
    const modalHTML = `
      <div id="quickViewModal" class="quick-view-modal">
        <div class="quick-view-overlay" onclick="QuickViewModal.close()"></div>
        <div class="quick-view-content">
          <button class="quick-view-close" onclick="QuickViewModal.close()">
            <i class="fas fa-times"></i>
          </button>
          <div class="quick-view-body">
            <div class="quick-view-loading">
              <i class="fas fa-spinner fa-spin"></i>
              <p>Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // ===================================
  // 6. OPEN MODAL
  // ===================================
  function open(productId) {
    const modal = document.getElementById('quickViewModal');
    const body = modal.querySelector('.quick-view-body');
    
    if (!modal) {
      console.error('Quick View Modal not found');
      return;
    }
    
    // Show modal with loading state
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    state.isOpen = true;
    
    // Reset state
    state.selectedQuantity = 1;
    state.currentImageIndex = 0;
    
    // Show loading
    body.innerHTML = `
      <div class="quick-view-loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading product details...</p>
      </div>
    `;
    
    // Simulate loading product data
    setTimeout(() => {
      loadProductData(productId);
    }, 500);
  }

  // ===================================
  // 7. LOAD PRODUCT DATA
  // ===================================
  function loadProductData(productId) {
    // In production, this would be an API call
    const product = mockProducts[productId] || mockProducts['prod-001'];
    state.currentProduct = product;
    state.selectedColor = product.colors[0];
    
    renderProductContent(product);
    initProductFeatures();
  }

  // ===================================
  // 8. RENDER PRODUCT CONTENT
  // ===================================
  function renderProductContent(product) {
    const body = document.querySelector('.quick-view-body');
    if (!body) return;
    
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    
    body.innerHTML = `
      <div class="quick-view-grid">
        <!-- Images Section -->
        <div class="quick-view-images">
          <div class="quick-view-main-image">
            ${discount > 0 ? `
              <div class="quick-view-badges">
                <span class="qv-badge discount">-${discount}%</span>
              </div>
            ` : ''}
            <img src="${product.images[0]}" alt="${product.name}" id="qvMainImage">
          </div>
          ${product.images.length > 1 ? `
            <div class="quick-view-thumbnails">
              ${product.images.map((img, index) => `
                <div class="qv-thumbnail ${index === 0 ? 'active' : ''}" 
                     data-index="${index}"
                     onclick="QuickViewModal.selectImage(${index})">
                  <img src="${img}" alt="${product.name} ${index + 1}">
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Info Section -->
        <div class="quick-view-info">
          <h2 class="qv-title">${product.name}</h2>
          
          <div class="qv-meta">
            <div class="qv-rating">
              <span class="qv-stars">${createStars(product.rating)}</span>
              <span class="qv-rating-value">${product.rating}</span>
              <span class="qv-reviews">(${product.reviews.toLocaleString()} reviews)</span>
            </div>
            <div class="qv-sold">
              <i class="fas fa-shopping-bag"></i>
              ${formatSold(product.sold)} sold
            </div>
          </div>
          
          <div class="qv-price-section">
            <span class="qv-price">₣${product.price.toLocaleString()}</span>
            ${product.originalPrice ? `
              <span class="qv-original-price">₣${product.originalPrice.toLocaleString()}</span>
              <span class="qv-discount">${discount}% OFF</span>
            ` : ''}
          </div>
          
          <p class="qv-description">${product.description}</p>
          
          ${product.features ? `
            <div class="qv-features">
              <h4>Key Features</h4>
              <ul>
                ${product.features.map(feature => `
                  <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="qv-options">
            ${product.colors.length > 1 ? `
              <div class="qv-option-group">
                <span class="qv-option-label">Color:</span>
                <div class="qv-colors">
                  ${product.colors.map((color, index) => `
                    <button class="qv-color ${index === 0 ? 'active' : ''}" 
                            data-color="${color}"
                            style="background-color: ${getColorHex(color)}"
                            onclick="QuickViewModal.selectColor('${color}', this)"
                            title="${color}">
                      <span class="qv-color-check">
                        <i class="fas fa-check"></i>
                      </span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <div class="qv-option-group">
              <span class="qv-option-label">Quantity:</span>
              <div class="qv-quantity">
                <button class="qv-qty-btn" onclick="QuickViewModal.updateQuantity(-1)">
                  <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="qv-qty-input" value="1" min="1" max="99" 
                       onchange="QuickViewModal.setQuantity(this.value)">
                <button class="qv-qty-btn" onclick="QuickViewModal.updateQuantity(1)">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="qv-actions">
            <button class="qv-btn-cart" onclick="QuickViewModal.addToCart()">
              <i class="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
            <button class="qv-btn-buy" onclick="QuickViewModal.buyNow()">
              <i class="fas fa-shopping-bag"></i>
              Buy Now
            </button>
            <button class="qv-btn-details" onclick="QuickViewModal.viewDetails()">
              <i class="fas fa-eye"></i>
              Full Details
            </button>
          </div>
          
          ${product.supplier ? `
            <div class="qv-supplier">
            <a href="shop-template.html?supplier=${encodeURIComponent(product.supplier.name)}" class="qv-supplier-link" title="View shop">
              <div class="qv-supplier-info">
                <img src="${product.supplier.avatar}" alt="${product.supplier.name}" 
                     class="qv-supplier-avatar">
                <div class="qv-supplier-details">
                  <span class="qv-supplier-name">${product.supplier.name}</span>
                  <div class="qv-supplier-meta">
                    ${product.supplier.verified ? '<i class="fas fa-check-circle qv-verified"></i>' : ''}
                    <span>★ ${product.supplier.rating}</span>
                  </div>
                </div>
              </div>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ===================================
  // 9. PRODUCT INTERACTIONS
  // ===================================
  function selectImage(index) {
    const mainImage = document.getElementById('qvMainImage');
    const thumbnails = document.querySelectorAll('.qv-thumbnail');
    
    if (!mainImage || !state.currentProduct) return;
    
    // Update main image
    mainImage.src = state.currentProduct.images[index];
    state.currentImageIndex = index;
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  function selectColor(color, button) {
    const colorButtons = document.querySelectorAll('.qv-color');
    
    colorButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    state.selectedColor = color;
  }

  function updateQuantity(change) {
    const input = document.querySelector('.qv-qty-input');
    if (!input) return;
    
    let newValue = parseInt(input.value) + change;
    newValue = Math.max(1, Math.min(99, newValue));
    
    input.value = newValue;
    state.selectedQuantity = newValue;
  }

  function setQuantity(value) {
    value = parseInt(value) || 1;
    value = Math.max(1, Math.min(99, value));
    state.selectedQuantity = value;
    
    const input = document.querySelector('.qv-qty-input');
    if (input) input.value = value;
  }

  // ===================================
  // 10. ACTIONS
  // ===================================
  function addToCart() {
    if (!state.currentProduct) return;
    
    const cartItem = {
      productId: state.currentProduct.id,
      name: state.currentProduct.name,
      price: state.currentProduct.price,
      quantity: state.selectedQuantity,
      color: state.selectedColor,
      image: state.currentProduct.images[0]
    };
    
    // Add to cart using main app's function
    if (window.VerandaMarket && window.VerandaMarket.addToCart) {
      // Add multiple times based on quantity
      for (let i = 0; i < state.selectedQuantity; i++) {
        window.VerandaMarket.addToCart(cartItem.productId);
      }
    }
    
    // Show success animation
    const cartBtn = document.querySelector('.qv-btn-cart');
    if (cartBtn) {
      const originalHTML = cartBtn.innerHTML;
      cartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
      cartBtn.style.background = '#10b981';
      cartBtn.style.color = 'white';
      
      setTimeout(() => {
        cartBtn.innerHTML = originalHTML;
        cartBtn.style.background = '';
        cartBtn.style.color = '';
      }, 2000);
    }
    
    showNotification(`${cartItem.name} added to cart!`, 'success');
  }

  function buyNow() {
    if (!state.currentProduct) return;
    
    const orderData = {
      productId: state.currentProduct.id,
      quantity: state.selectedQuantity,
      color: state.selectedColor,
      price: state.currentProduct.price
    };
    
    console.log('Buy Now:', orderData);
    close();
    
    // Redirect to checkout
    showNotification('Redirecting to checkout...', 'success');
    
    // In production, redirect to checkout
    // window.location.href = `/checkout?product=${orderData.productId}&qty=${orderData.quantity}`;
  }

  function viewDetails() {
    if (!state.currentProduct) return;
    
    const productId = state.currentProduct.id;
    close();
    
    // Navigate to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
  }

  // ===================================
  // 11. CLOSE MODAL
  // ===================================
  function close() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    state.isOpen = false;
    
    // Reset state after animation
    setTimeout(() => {
      state.currentProduct = null;
      state.selectedQuantity = 1;
      state.currentImageIndex = 0;
    }, 300);
  }

  // ===================================
  // 12. HELPER FUNCTIONS
  // ===================================
  function createStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    if (hasHalfStar) {
      stars += '☆';
    }
    
    return stars;
  }

  function formatSold(count) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString();
  }

  function getColorHex(colorName) {
    const colors = {
      'Black': '#000000',
      'White': '#ffffff',
      'Silver': '#c0c0c0',
      'Gold': '#ffd700',
      'Deep Purple': '#673ab7',
      'Space Black': '#1a1a1a',
      'Midnight Blue': '#191970',
      'Red': '#ff0000',
      'Blue': '#0000ff'
    };
    
    return colors[colorName] || '#cccccc';
  }

  function showNotification(message, type = 'info') {
    // Use main app's notification if available
    if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification(message, type);
    } else {
      // Fallback notification
      console.log(`${type}: ${message}`);
    }
  }

  // ===================================
  // 13. EVENT LISTENERS
  // ===================================
  function initEventListeners() {
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        close();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', utils.debounce(() => {
      if (state.isOpen && state.currentProduct) {
        // Adjust modal if needed
        console.log('Window resized');
      }
    }, 300));
  }

  function initProductFeatures() {
    // Initialize any additional features after product loads
    console.log('Product features initialized');
  }

  // Utility debounce function
  const utils = {
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
    }
  };

  // ===================================
  // 14. PUBLIC API
  // ===================================
  return {
    init,
    open,
    close,
    selectImage,
    selectColor,
    updateQuantity,
    setQuantity,
    addToCart,
    buyNow,
    viewDetails
  };
})();

// ===================================
// 15. AUTO-INITIALIZE
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  QuickViewModal.init();
});

// Export for global access
window.QuickViewModal = QuickViewModal;