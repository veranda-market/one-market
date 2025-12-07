// ===================================
// SERVICES PAGE JAVASCRIPT
// ===================================

// API Configuration (align with jobs page)
const API_BASE_URL =
  'https://jobs-and-services.etahclinton506.workers.dev/api/v1';
const SERVICES_PER_PAGE = 12;

// Global state for Services
let svcCurrentPage = 0;
let svcCurrentSearch = '';
let svcCurrentCategoryId = '';
let svcIsLoading = false;
let svcAllCategories = [];

// Services API
class ServicesAPI {
  static async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      if (!data.success) throw new Error('Failed to fetch categories');
      return data.data || [];
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  }

  static async fetchServices(
    page = 0,
    limit = SERVICES_PER_PAGE,
    search = '',
    categoryId = ''
  ) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      if (categoryId) params.append('categoryId', categoryId);

      const response = await fetch(`${API_BASE_URL}/services?${params}`);
      const data = await response.json();
      if (!response.ok || data.success === false)
        throw new Error(data.message || 'Failed to fetch services');
      console.log(data);
      return data.data || [];
    } catch (err) {
      console.error('Error fetching services:', err);
      return [];
    }
  }

  static async submitServiceBooking(booking) {
    try {
      const response = await fetch(`${API_BASE_URL}/service-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Failed to create booking');
      return data;
    } catch (err) {
      console.error('Error submitting booking:', err);
      throw err;
    }
  }
}

// Render helpers
function createCategoryCard(category) {
  return `
        <div class="category-card" data-category-id="${category.id}">
            <div class="category-icon">
                <i class="fas fa-th"></i>
            </div>
            <h3 class="category-name">${category.name}</h3>
            <p class="category-description">Explore ${category.name} services</p>
            <span class="category-count">&nbsp;</span>
        </div>
    `;
}

function createServiceCard(service) {
  const name = service.fullName;
  const city = service.location || service.city || 'Cameroon';
  const desc =
    service.description || 'Professional service at your convenience.';
  const price = service.minWage ? `${service.minWage + ' XAF'}` : 'Discuss';
  const rating = service.rating || 'New';
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;
  return `
        <div class="professional-card" data-category="all" data-service-id="${
          service.id || ''
        }">
            <div class="pro-badge">
                <i class="fas fa-shield-alt"></i> ${
                  typeof rating === 'number' ? rating.toFixed(1) : rating
                }
            </div>
            <div class="pro-header">
                <div class="pro-avatar">
                    <img src="${avatar}" alt="${name}">
                    <span class="availability-status online"></span>
                </div>
                <div class="pro-info">
                    <h3 class="pro-name">${name}</h3>
                    <p class="pro-title">${
                      service.category.name || 'Professional Service'
                    }</p>
                    <div class="pro-location">
                        <i class="fas fa-map-marker-alt"></i> ${city}
                    </div>
                </div>
            </div>
            <div class="pro-description">
                <p>${desc}</p>
            </div>
            <div class="pro-pricing">
                <span class="price-label">Starting at</span>
                <span class="price-value">${price}</span>
            </div>
            <div class="pro-skills">
                ${
                  service.serviceSkill && service.serviceSkill.length > 0
                    ? service.serviceSkill
                        .slice(0, 5)
                        .map(
                          (skill) =>
                            `<span class="skill-bubble">${skill.skill.name}</span>`
                        )
                        .join('')
                    : ''
                }
            </div>
            <div class="pro-actions">
                <button class="btn-contact"><i class="fas fa-comment"></i> Contact</button>
                <button class="btn-book"><i class="fas fa-calendar-check"></i> Book Now</button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
  // ===================================
  // PRELOADER
  // ===================================
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', function () {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    }, 500);
  });

  // ===================================
  // HERO SEARCH FUNCTIONALITY
  // ===================================
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchBtn = document.querySelector('.hero-search-btn');
  const serviceTags = document.querySelectorAll('.service-tag');

  // Handle search
  async function handleSearch() {
    const searchTerm = heroSearchInput.value.trim();
    svcCurrentSearch = searchTerm;
    svcCurrentPage = 0;
    await loadServices();
    const section = document.querySelector('.featured-professionals');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Search event listeners
  heroSearchBtn.addEventListener('click', handleSearch);
  heroSearchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Service tag clicks
  serviceTags.forEach((tag) => {
    tag.addEventListener('click', function () {
      const service = this.getAttribute('data-service');
      heroSearchInput.value = service;
      handleSearch();
    });
  });

  // ===================================
  // LOCATION DROPDOWN
  // ===================================
  const deliverLocation = document.getElementById('deliverLocation');
  const locationDropdown = document.querySelector('.location-dropdown');
  const locationItems = locationDropdown.querySelectorAll('li');

  locationItems.forEach((item) => {
    item.addEventListener('click', function () {
      const city = this.textContent;
      deliverLocation.textContent = city;
      localStorage.setItem('selectedLocation', city);
    });
  });

  // Load saved location
  const savedLocation = localStorage.getItem('selectedLocation');
  if (savedLocation) {
    deliverLocation.textContent = savedLocation;
  }

  // ===================================
  // CATEGORY CARDS (Dynamic load and click to filter)
  // ===================================
  async function loadCategories() {
    const grid = document.querySelector('.service-categories .categories-grid');
    if (!grid) return;
    grid.innerHTML = '';
    try {
      svcAllCategories = await ServicesAPI.fetchCategories();
      if (!svcAllCategories.length) {
        grid.innerHTML =
          '<div class="error-message">Failed to load categories</div>';
        return;
      }
      svcAllCategories.slice(0, 8).forEach((cat) => {
        grid.insertAdjacentHTML('beforeend', createCategoryCard(cat));
      });
      grid
        .querySelectorAll('.category-card[data-category-id]')
        .forEach((card) => {
          card.addEventListener('click', function () {
            const id = this.getAttribute('data-category-id');
            svcCurrentCategoryId = id;
            svcCurrentPage = 0;
            loadServices();
            const section = document.querySelector('.featured-professionals');
            if (section)
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
    } catch (e) {
      grid.innerHTML =
        '<div class="error-message">Failed to load categories</div>';
    }
  }

  // ===================================
  // PROFESSIONALS LOADING & FILTERING
  // ===================================
  const filterPills = document.querySelectorAll('.filter-pill');
  const professionalsGrid = document.querySelector('.professionals-grid');

  async function loadServices(append = false) {
    if (!professionalsGrid || svcIsLoading) return;
    svcIsLoading = true;
    if (!append) {
      professionalsGrid.innerHTML =
        '<div class="loading-spinner">Loading services...</div>';
    }
    try {
      const services = await ServicesAPI.fetchServices(
        svcCurrentPage,
        SERVICES_PER_PAGE,
        svcCurrentSearch,
        svcCurrentCategoryId
      );
      if (!append) professionalsGrid.innerHTML = '';
      if (!services.length && !append) {
        professionalsGrid.innerHTML = `
                    <div class="no-jobs-found">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No services found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>`;
      } else {
        services.forEach((svc) =>
          professionalsGrid.insertAdjacentHTML(
            'beforeend',
            createServiceCard(svc)
          )
        );
        attachCardEventListeners();
      }
    } catch (e) {
      professionalsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to load services</h3>
                    <p>Please try again later.</p>
                </div>`;
    } finally {
      svcIsLoading = false;
    }
  }

  // Filter pill clicks -> map to simple search presets
  filterPills.forEach((pill) => {
    pill.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');
      filterPills.forEach((p) => p.classList.remove('active'));
      this.classList.add('active');
      svcCurrentCategoryId = '';
      svcCurrentPage = 0;
      svcCurrentSearch = filter === 'all' ? '' : filter;
      loadServices();
    });
  });

  // ===================================
  // PROFESSIONAL CARD INTERACTIONS
  // ===================================
  function wireInitialCards() {
    const contactBtns = document.querySelectorAll('.btn-contact');
    const bookBtns = document.querySelectorAll('.btn-book');
    contactBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const card = this.closest('.professional-card');
        const proName = card.querySelector('.pro-name').textContent;
        showNotification(`Opening chat with ${proName}...`);
      });
    });
    bookBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const card = this.closest('.professional-card');
        const proName = card.querySelector('.pro-name').textContent;
        const serviceId = card.getAttribute('data-service-id') || '';
        showBookingModal(proName, serviceId);
      });
    });
  }
  wireInitialCards();

  // ===================================
  // BOOKING MODAL
  // ===================================
  function showBookingModal(proName, serviceId = '') {
    // Create modal HTML
    const modalHTML = `
            <div class="booking-modal" id="bookingModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Book ${proName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="bookingForm">
                            <div class="form-group">
                                <label>Select Date</label>
                                <input type="date" required min="${
                                  new Date().toISOString().split('T')[0]
                                }">
                            </div>
                            <div class="form-group">
                                <label>Select Time</label>
                                <select required>
                                    <option value="">Choose time slot</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                    <option value="16:00">04:00 PM</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Describe your needs</label>
                                <textarea name="description" rows="3" placeholder="Please describe the service you need..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label>Full Name (optional)</label>
                                <input type="text" name="fullName" placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label>Email (optional)</label>
                                <input type="email" name="email" placeholder="john@example.com">
                            </div>
                            <div class="form-group">
                                <label>Phone (optional)</label>
                                <input type="tel" name="phone" placeholder="+237 6XX XXX XXX">
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-confirm" id="bookingSubmitBtn">
                                    <span class="btn-text">Confirm Booking</span>
                                    <span class="btn-loading" style="display:none;"><i class="fas fa-spinner fa-spin"></i> Submitting...</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('bookingModal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const form = modal.querySelector('#bookingForm');

    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);

    // Close modal function
    function closeModal() {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }

    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    // Form submission -> API
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = modal.querySelector('#bookingSubmitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      const formData = new FormData(form);
      const description = formData.get('description');
      const fullName = formData.get('fullName') || undefined;
      const email = formData.get('email') || undefined;
      const phone = formData.get('phone') || undefined;
      const dateVal = form.querySelector('input[type="date"]').value;
      const timeVal = form.querySelector('select').value || '09:00';
      const preferredDate = new Date(`${dateVal}T${timeVal}:00`).toISOString();

      const payload = {
        serviceId: serviceId || undefined,
        fullName,
        email,
        phone,
        description,
        status: 'pending',
        preferredDate,
      };

      try {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        await ServicesAPI.submitServiceBooking(payload);
        showNotification(`Booking request sent to ${proName}!`, 'success');
        closeModal();
      } catch (err) {
        showNotification(
          err.message || 'Failed to submit booking. Please try again.',
          'error'
        );
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
    });
  }

  // ===================================
  // NOTIFICATION SYSTEM
  // ===================================
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === 'success' ? 'check-circle' : 'info-circle'
            }"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===================================
  // SMOOTH SCROLL FOR ANCHORS
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ===================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll('.category-card, .professional-card, .step')
    .forEach((el) => {
      observer.observe(el);
    });

  // ===================================
  // LOAD MORE SERVICES
  // ===================================
  const viewAllBtn = document.querySelector('.view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', async function () {
      if (svcIsLoading) return;
      svcCurrentPage++;
      await loadServices(true);
    });
  }

  function generateProfessionalCards(count) {
    const professionals = [
      {
        name: 'Paul Mbarga',
        title: 'Professional Plumber',
        location: 'Douala, Akwa',
        rating: '4.7',
      },
      {
        name: 'Fatima Aisha',
        title: 'House Cleaner',
        location: 'Yaoundé, Mfandena',
        rating: '4.9',
      },
      {
        name: 'Michel Tagne',
        title: 'Auto Mechanic',
        location: 'Bafoussam, Centre',
        rating: '4.8',
      },
    ];

    let html = '';
    for (let i = 0; i < count; i++) {
      const pro = professionals[i % professionals.length];
      html += `
                <div class="professional-card" data-category="all">
                    <div class="pro-badge">
                        <i class="fas fa-shield-alt"></i> New Pro
                    </div>
                    <div class="pro-header">
                        <div class="pro-avatar">
                            <img src="https://randomuser.me/api/portraits/${
                              Math.random() > 0.5 ? 'men' : 'women'
                            }/${Math.floor(Math.random() * 90)}.jpg" alt="${
        pro.name
      }">
                            <span class="availability-status online"></span>
                        </div>
                        <div class="pro-info">
                            <h3 class="pro-name">${pro.name}</h3>
                            <p class="pro-title">${pro.title}</p>
                            <div class="pro-location">
                                <i class="fas fa-map-marker-alt"></i> ${
                                  pro.location
                                }
                            </div>
                        </div>
                    </div>
                    <div class="pro-stats">
                        <div class="stat">
                            <span class="stat-value">${pro.rating}</span>
                            <span class="stat-label">Rating</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Jobs</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">New</span>
                            <span class="stat-label">Member</span>
                        </div>
                    </div>
                    <div class="pro-pricing">
                        <span class="price-label">Starting at</span>
                        <span class="price-value">Discuss</span>
                    </div>
                    <div class="pro-actions">
                        <button class="btn-contact">
                            <i class="fas fa-comment"></i> Contact
                        </button>
                        <button class="btn-book">
                            <i class="fas fa-calendar-check"></i> Book Now
                        </button>
                    </div>
                </div>
            `;
    }
    return html;
  }

  function attachCardEventListeners() {
    // Re-attach event listeners to newly added cards
    document
      .querySelectorAll(
        '.professional-card .btn-contact:not([data-initialized])'
      )
      .forEach((btn) => {
        btn.setAttribute('data-initialized', 'true');
        btn.addEventListener('click', function () {
          const card = this.closest('.professional-card');
          const proName = card.querySelector('.pro-name').textContent;
          showNotification(`Opening chat with ${proName}...`);
        });
      });

    document
      .querySelectorAll('.professional-card .btn-book:not([data-initialized])')
      .forEach((btn) => {
        btn.setAttribute('data-initialized', 'true');
        btn.addEventListener('click', function () {
          const card = this.closest('.professional-card');
          const proName = card.querySelector('.pro-name').textContent;
          const serviceId = card.getAttribute('data-service-id') || '';
          showBookingModal(proName, serviceId);
        });
      });
  }

  // Initial dynamic load
  loadCategories();
  loadServices();

  // ===================================
  // MOBILE MENU TOGGLE
  // ===================================
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  mobileNavItems.forEach((item) => {
    item.addEventListener('click', function () {
      mobileNavItems.forEach((nav) => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ===================================
  // CTA BUTTON
  // ===================================
  const ctaBtn = document.querySelector('.cta-btn');

  ctaBtn.addEventListener('click', function () {
    showNotification('Redirecting to Pro registration...');
    // Here you would redirect to the registration page
    setTimeout(() => {
      console.log('Redirect to pro registration');
    }, 1500);
  });
});

// ===================================
// ADDITIONAL STYLES FOR MODAL & NOTIFICATIONS
// ===================================
const additionalStyles = `
<style>
/* Booking Modal */
.booking-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 1rem;
}

.booking-modal.show {
    opacity: 1;
}

.modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.booking-modal.show .modal-content {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #111827;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f3f4f6;
    color: #111827;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #1a8917;
    box-shadow: 0 0 0 3px rgba(26, 137, 23, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

.btn-cancel,
.btn-confirm {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn-cancel {
    background: #f3f4f6;
    color: #6b7280;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-confirm {
    background: #1a8917;
    color: white;
}

.btn-confirm:hover {
    background: #146812;
}

/* Notifications */
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10001;
    max-width: 350px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #10b981;
}

.notification.success i {
    color: #10b981;
}

.notification.info {
    border-left: 4px solid #3b82f6;
}

.notification.info i {
    color: #3b82f6;
}

/* Animation Classes */
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

/* Mobile Responsive */
@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
