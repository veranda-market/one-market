/* ===================================
   FLOATING SUPPLIER PANEL 
   =================================== */

// ===================================
// 1. SUPPLIER PANEL MODULE
// ===================================
const SupplierPanel = (function() {
  'use strict';

  // ===================================
  // 2. MODULE STATE
  // ===================================
  const state = {
    isOpen: false,
    currentSupplier: null,
    savedSuppliers: []
  };

  // ===================================
  // 3. MOCK SUPPLIER DATA
  // ===================================
  const mockSuppliers = {
    'supplier1': {
      id: 'supplier1',
      name: 'TECHPRO ELECTRONICS LTD.',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
      rating: 4.8,
      verified: true,
      years: 5,
      trusted: true,
      manager: {
        name: 'Ms. Amina Ngassa',
        title: 'Sales Manager',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
        online: true
      },
      stats: {
        responseTime: '≤2h',
        responseRate: '98%',
        transactions: '5.2K+',
        repeatBuyers: '85%'
      },
      info: {
        mainProducts: 'Electronics, Smartphones, Laptops, Audio Equipment, Gaming Accessories',
        address: '1/F, Building 11, Tech Park, Douala Economic Zone, Cameroon',
        markets: 'marche central, mokolo, Bonapriso, Akwa',
        employees: '5-10',
        annualRevenue: 'xaf 5-10 Million',
        established: '2019',
        certifications: ['ISO9001:2008', 'CE', 'RoHS', 'FCC'],
        tradeCapacity: {
          exportPercentage: '65%',
          mainMarkets: [
            { market: 'marche mokolo', percentage: '35%' },
            { market: 'marche central', percentage: '30%' },
            { market: 'bonapriso', percentage: '20%' },
            { market: 'akwa', percentage: '15%' }
          ],
          terms: 'FOB, EXW, CIF',
          payment: 'WU, Mobile Money, Orange Money, EE'
        }
      }
    },
    'supplier2': {
      id: 'supplier2',
      name: 'HOME APPLIANCES PLUS',
      logo: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=200&h=200&fit=crop',
      rating: 4.7,
      verified: true,
      years: 8,
      trusted: true,
      manager: {
        name: 'Mr. Jean Kamga',
        title: 'General Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        online: false
      },
      stats: {
        responseTime: '≤4h',
        responseRate: '95%',
        transactions: '3.8K+',
        repeatBuyers: '78%'
      },
      info: {
        mainProducts: 'Home Appliances, Kitchen Equipment, TVs, Refrigerators',
        address: 'Zone Industrielle, Bassa, Douala, Cameroon',
        markets: 'Cameroon, Gabon, Equatorial Guinea',
        employees: '100-200',
        annualRevenue: 'US$ 10-20 Million',
        established: '2016',
        certifications: ['ISO9001:2015', 'CE', 'Energy Star'],
        tradeCapacity: {
          exportPercentage: '40%',
          mainMarkets: [
            { market: 'Domestic Market', percentage: '60%' },
            { market: 'Gabon', percentage: '20%' },
            { market: 'Equatorial Guinea', percentage: '10%' },
            { market: 'Chad', percentage: '10%' }
          ],
          terms: 'FOB, CIF, DDP',
          payment: 'T/T, L/C, Cash'
        }
      }
    }
  };

  // ===================================
  // 4. INITIALIZATION
  // ===================================
  function init() {
    // Create panel HTML if it doesn't exist
    if (!document.getElementById('supplierPanel')) {
      createPanelHTML();
    }
    
    // Create floating trigger button
    if (!document.getElementById('supplierFloatTrigger')) {
      createFloatingTrigger();
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Load saved suppliers
    loadSavedSuppliers();
    
    console.log('Supplier Panel initialized');
  }

  // ===================================
  // 5. CREATE PANEL HTML
  // ===================================
  function createPanelHTML() {
    const panelHTML = `
      <!-- Overlay -->
      <div id="supplierPanelOverlay" class="supplier-panel-overlay"></div>
      
      <!-- Supplier Panel -->
      <div id="supplierPanel" class="supplier-panel">
        <div class="supplier-panel-header">
          <button class="panel-close" onclick="SupplierPanel.close()">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="company-header">
            <div class="company-main-info">
              <h2 class="company-name" id="companyName">Loading...</h2>
              <div class="company-rating">
                <span class="rating-score" id="ratingScore">0.0</span>
                <span class="rating-stars" id="ratingStars">★</span>
              </div>
              <div class="manager-section">
                <div class="manager-info">
                  <div class="manager-avatar">
                    <img src="" alt="Manager" id="managerAvatar">
                  </div>
                  <div class="manager-details">
                    <div class="manager-name" id="managerName">Loading...</div>
                    <div class="manager-title" id="managerTitle">Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="supplier-actions">
          <button class="btn-start-order" onclick="SupplierPanel.startOrder()">
            Start Order Request
          </button>
          <button class="btn-contact-supplier" onclick="SupplierPanel.visitShop()">
            <i class="fas fa-store"></i>
            Visit Shop
          </button>
          <button class="btn-chat" onclick="SupplierPanel.startChat()">
            <i class="fas fa-comment-alt"></i>
            Chat
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  // ===================================
  // 6. CREATE FLOATING TRIGGER
  // ===================================
  function createFloatingTrigger() {
    const triggerHTML = `
      <button id="supplierFloatTrigger" class="supplier-float-trigger" 
              onclick="SupplierPanel.toggle()"
              title="View Supplier Info">
        <i class="fas fa-store"></i>
      </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', triggerHTML);
  }

  // ===================================
  // 7. SHOW/HIDE FLOATING TRIGGER
  // ===================================
  function showFloatingTrigger() {
    const trigger = document.getElementById('supplierFloatTrigger');
    if (trigger) {
      trigger.classList.add('show');
      // Add pulse animation for first time
      setTimeout(() => {
        trigger.classList.add('pulse');
        setTimeout(() => {
          trigger.classList.remove('pulse');
        }, 4000);
      }, 1000);
    }
  }

  function hideFloatingTrigger() {
    const trigger = document.getElementById('supplierFloatTrigger');
    if (trigger) {
      trigger.classList.remove('show');
    }
  }

  // ===================================
  // 8. OPEN/CLOSE PANEL
  // ===================================
  function open(supplierId) {
    // Load supplier data
    const supplier = supplierId ? mockSuppliers[supplierId] : mockSuppliers['supplier1'];
    state.currentSupplier = supplier;
    
    // Update panel content
    updatePanelContent(supplier);
    
    // Show panel
    const panel = document.getElementById('supplierPanel');
    const overlay = document.getElementById('supplierPanelOverlay');
    
    if (panel && overlay) {
      panel.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      state.isOpen = true;
      
      // Hide floating trigger when panel is open
      hideFloatingTrigger();
    }
  }

  function close() {
    const panel = document.getElementById('supplierPanel');
    const overlay = document.getElementById('supplierPanelOverlay');
    
    if (panel && overlay) {
      panel.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      state.isOpen = false;
      
      // Show floating trigger again
      showFloatingTrigger();
    }
  }

  function toggle() {
    if (state.isOpen) {
      close();
    } else {
      open();
    }
  }

  // ===================================
  // 9. UPDATE PANEL CONTENT
  // ===================================
  function updatePanelContent(supplier) {
    // Update company info
    document.getElementById('companyName').textContent = supplier.name;
    document.getElementById('ratingScore').textContent = supplier.rating.toFixed(1);
    
    // Update rating stars
    const fullStars = Math.floor(supplier.rating);
    const hasHalfStar = supplier.rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    document.getElementById('ratingStars').textContent = stars;
    
    // Update manager info
    document.getElementById('managerAvatar').src = supplier.manager.avatar;
    document.getElementById('managerName').textContent = supplier.manager.name;
    document.getElementById('managerTitle').textContent = supplier.manager.title;
  }

  // ===================================
  // 10. ACTION HANDLERS
  // ===================================
  function startOrder() {
    if (!state.currentSupplier) return;
    
    console.log('Starting order with:', state.currentSupplier.name);
    close();
    
    // Show notification
    showNotification('Redirecting to order form...', 'success');
    
    // In production, redirect to order page
    // window.location.href = `/order/new?supplier=${state.currentSupplier.id}`;
  }

  function visitShop() {
    if (!state.currentSupplier) return;
    
    console.log('Visiting shop:', state.currentSupplier.name);
    close();
    
    // Navigate to supplier's shop page
    showNotification('Opening supplier shop...', 'info');
    
    // Navigate to supplier's shop page
  window.location.href = `shop-template.html?supplier=${encodeURIComponent(state.currentSupplier.name)}`;
  }

  function startChat() {
    if (!state.currentSupplier) return;
    
    console.log('Starting chat with:', state.currentSupplier.manager.name);
    
    // Open chat interface
    showNotification(`Connecting to ${state.currentSupplier.manager.name}...`, 'info');
  }

  function saveSupplier() {
    if (!state.currentSupplier) return;
    
    // Check if already saved
    const isSaved = state.savedSuppliers.some(s => s.id === state.currentSupplier.id);
    
    if (!isSaved) {
      state.savedSuppliers.push({
        id: state.currentSupplier.id,
        name: state.currentSupplier.name,
        savedAt: Date.now()
      });
      
      // Save to localStorage
      localStorage.setItem('savedSuppliers', JSON.stringify(state.savedSuppliers));
      
      // Update button
      const saveBtn = document.querySelector('.btn-save-supplier');
      if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
        saveBtn.style.background = '#10b981';
        saveBtn.style.color = 'white';
        
        setTimeout(() => {
          saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
          saveBtn.style.background = '';
          saveBtn.style.color = '';
        }, 2000);
      }
      
      showNotification('Supplier saved!', 'success');
    } else {
      showNotification('Already saved', 'info');
    }
  }

  // ===================================
  // 11. EVENT LISTENERS
  // ===================================
  function initEventListeners() {
    // Close on overlay click
    const overlay = document.getElementById('supplierPanelOverlay');
    if (overlay) {
      overlay.addEventListener('click', close);
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        close();
      }
    });
    
    // Show trigger on product pages
    if (window.location.pathname.includes('product-detail')) {
      setTimeout(showFloatingTrigger, 2000);
    }
  }

  // ===================================
  // 12. UTILITIES
  // ===================================
  function loadSavedSuppliers() {
    const saved = localStorage.getItem('savedSuppliers');
    if (saved) {
      state.savedSuppliers = JSON.parse(saved);
    }
  }

  function showNotification(message, type = 'info') {
    // Use main app's notification if available
    if (window.VerandaMarket && window.VerandaMarket.showNotification) {
      window.VerandaMarket.showNotification(message, type);
    } else {
      console.log(`${type}: ${message}`);
    }
  }

  // ===================================
  // 13. PUBLIC API
  // ===================================
  return {
    init,
    open,
    close,
    toggle,
    showFloatingTrigger,
    hideFloatingTrigger,
    startOrder,
    visitShop,
    startChat,
    saveSupplier,
    loadSupplier: open // Alias for opening with specific supplier
  };
})();

// ===================================
// 14. AUTO-INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  SupplierPanel.init();
});

// Export for global access
window.SupplierPanel = SupplierPanel;