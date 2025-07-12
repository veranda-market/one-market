// ===================================
// JOBS PAGE JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // VIEW TOGGLE FUNCTIONALITY
    // ===================================
    const toggleJobsBtn = document.getElementById('toggle-jobs');
    const toggleTalentBtn = document.getElementById('toggle-talent');
    const jobsView = document.getElementById('jobs-view');
    const talentView = document.getElementById('talent-view');

    if (toggleJobsBtn && toggleTalentBtn && jobsView && talentView) {
        toggleJobsBtn.addEventListener('click', () => {
            toggleTalentBtn.classList.remove('active');
            toggleJobsBtn.classList.add('active');
            talentView.style.display = 'none';
            jobsView.style.display = 'block';
            showNotification('Switched to Jobs view');
        });

        toggleTalentBtn.addEventListener('click', () => {
            toggleJobsBtn.classList.remove('active');
            toggleTalentBtn.classList.add('active');
            jobsView.style.display = 'none';
            talentView.style.display = 'block';
            showNotification('Switched to Talent Marketplace');
        });
    }

    // ===================================
    // HERO SEARCH FUNCTIONALITY
    // ===================================
    const heroJobSearch = document.getElementById('heroJobSearch');
    const searchButton = document.querySelector('.search-button');
    const heroOptionLinks = document.querySelectorAll('.hero-option-link');
    
    // Handle hero search
    function handleHeroSearch() {
        const searchTerm = heroJobSearch.value.trim();
        if (searchTerm) {
            showNotification(`Searching for "${searchTerm}"...`);
            // Scroll to job listings
            document.querySelector('.featured-jobs').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    // Search event listeners
    if (searchButton) {
        searchButton.addEventListener('click', handleHeroSearch);
    }
    
    if (heroJobSearch) {
        heroJobSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleHeroSearch();
            }
        });
    }
    
    // Hero option links
    heroOptionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const optionText = this.querySelector('.option-text').textContent;
            
            switch(optionText) {
                case 'Find your next opportunity':
                    showNotification('Showing all available jobs...');
                    document.querySelector('.featured-jobs').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'Connect with local employers':
                    showNotification('Viewing top companies...');
                    document.querySelector('.top-companies').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'Post a job or find talent':
                    showPostJobModal();
                    break;
                case 'Build your professional profile':
                    showNotification('Opening profile builder...');
                    break;
            }
        });
    });

    // ===================================
    // LOCATION DROPDOWN
    // ===================================
    const deliverLocation = document.getElementById('deliverLocation');
    const locationDropdown = document.querySelector('.location-dropdown');
    const locationItems = locationDropdown.querySelectorAll('li');

    locationItems.forEach(item => {
        item.addEventListener('click', function() {
            const city = this.textContent;
            deliverLocation.textContent = city;
            localStorage.setItem('jobLocation', city);
            showNotification(`Showing jobs in ${city}`);
        });
    });

    // Load saved location
    const savedLocation = localStorage.getItem('jobLocation');
    if (savedLocation) {
        deliverLocation.textContent = savedLocation;
    }

    // ===================================
    // CATEGORY CARDS
    // ===================================
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                filterJobsByCategory(category);
                showNotification(`Showing ${category} jobs...`);
            }
        });
    });

    function filterJobsByCategory(category) {
        // Scroll to featured jobs section
        document.querySelector('.featured-jobs').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Update filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
        });
    }

    // ===================================
    // JOB FILTER TABS
    // ===================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const jobCards = document.querySelectorAll('.job-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterJobCards(filter);
        });
    });

    function filterJobCards(filter) {
        jobCards.forEach(card => {
            const cardTypes = card.getAttribute('data-type').split(',');
            
            if (filter === 'all' || cardTypes.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // ===================================
    // SAVE JOB FUNCTIONALITY
    // ===================================
    const saveJobBtns = document.querySelectorAll('.save-job-btn');
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

    saveJobBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            const company = jobCard.querySelector('.company-name').textContent;
            const jobId = `${jobTitle}-${company}`.replace(/\s+/g, '-').toLowerCase();
            
            if (this.classList.contains('saved')) {
                // Remove from saved
                this.classList.remove('saved');
                this.innerHTML = '<i class="far fa-heart"></i>';
                savedJobs = savedJobs.filter(id => id !== jobId);
                showNotification('Job removed from saved list');
            } else {
                // Add to saved
                this.classList.add('saved');
                this.innerHTML = '<i class="fas fa-heart"></i>';
                savedJobs.push(jobId);
                showNotification('Job saved successfully!');
            }
            
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            updateSavedJobsCount();
        });
    });

    function updateSavedJobsCount() {
        const savedCount = document.querySelector('.saved-count');
        if (savedCount) {
            savedCount.textContent = savedJobs.length;
        }
    }

    // Initialize saved jobs count
    updateSavedJobsCount();

    // ===================================
    // QUICK APPLY FUNCTIONALITY
    // ===================================
    const quickApplyBtns = document.querySelectorAll('.quick-apply-btn');
    
    quickApplyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            const company = jobCard.querySelector('.company-name').textContent;
            
            showApplicationModal(jobTitle, company);
        });
    });

    function showApplicationModal(jobTitle, company) {
        const modalHTML = `
            <div class="application-modal" id="applicationModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Quick Apply - ${jobTitle}</h3>
                        <p class="company-info">${company}</p>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="quickApplyForm">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" required placeholder="john@example.com">
                            </div>
                            <div class="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" required placeholder="+237 6XX XXX XXX">
                            </div>
                            <div class="form-group">
                                <label>Resume/CV *</label>
                                <div class="file-upload">
                                    <input type="file" id="resumeFile" accept=".pdf,.doc,.docx" required>
                                    <label for="resumeFile">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span>Choose file or drag here</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Cover Letter (Optional)</label>
                                <textarea rows="4" placeholder="Tell us why you're a great fit for this role..."></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit">Submit Application</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('applicationModal');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const form = modal.querySelector('#quickApplyForm');
        const fileInput = modal.querySelector('#resumeFile');
        const fileLabel = modal.querySelector('.file-upload label span');

        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);

        // File upload handling
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileLabel.textContent = this.files[0].name;
            }
        });

        // Close modal function
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }

        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification(`Application submitted for ${jobTitle}!`, 'success');
            closeModal();
        });
    }

    // ===================================
    // POST JOB FUNCTIONALITY
    // ===================================
    const postJobBtn = document.querySelector('.post-job-btn');
    const floatingPostJobBtn = document.querySelector('.floating-post-job-btn');
    
    [postJobBtn, floatingPostJobBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                showPostJobModal();
            });
        }
    });

    function showPostJobModal() {
        showNotification('Opening job posting form...', 'info');
        // open the job posting modal or redirect to posting page
    }

    // ===================================
    // COMPANIES SLIDER
    // ===================================
    const companiesSwiper = new Swiper('.companies-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        }
    });

    // ===================================
    // VIEW COMPANY JOBS
    // ===================================
    const viewCompanyBtns = document.querySelectorAll('.view-company-btn');
    
    viewCompanyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const companyCard = this.closest('.company-card');
            const companyName = companyCard.querySelector('.company-name').textContent;
            
            showNotification(`Viewing jobs from ${companyName}...`);
            // Filter jobs by company
            jobSearchInput.value = companyName;
            handleJobSearch();
        });
    });

    // ===================================
    // NEWSLETTER SUBSCRIPTION
    // ===================================
    const alertsForm = document.querySelector('.alerts-form');
    
    if (alertsForm) {
        alertsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            showNotification(`Subscribed! Job alerts will be sent to ${email}`, 'success');
            this.reset();
            
            // Save to localStorage 
            localStorage.setItem('jobAlertsEmail', email);
        });
    }

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
    // SMOOTH SCROLL
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
    // INTERSECTION OBSERVER
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.category-card, .job-card, .resource-card').forEach(el => {
        observer.observe(el);
    });

    // ===================================
    // VIEW JOB DETAILS
    // ===================================
    const viewJobBtns = document.querySelectorAll('.view-job-btn');
    const jobTitles = document.querySelectorAll('.job-title');
    
    [...viewJobBtns, ...jobTitles].forEach(element => {
        element.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            const company = jobCard.querySelector('.company-name').textContent;
            
            showNotification(`Opening details for ${jobTitle} at ${company}...`);
            
        });
    });

    // ===================================
    // MOBILE NAVIGATION
    // ===================================
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===================================
    // EMPLOYER CTA
    // ===================================
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            showNotification('Redirecting to employer dashboard...', 'info');
            // Redirect to employer registration/dashboard
        });
    }

    // ===================================
    // RESOURCE LINKS
    // ===================================
    const resourceLinks = document.querySelectorAll('.resource-link');
    
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
            showNotification(`Opening ${resourceTitle}...`, 'info');
        });
    });

    // ===================================
    // TALENT MARKETPLACE FUNCTIONALITY
    // ===================================
    
    // Talent Filter Tabs
    const talentFilterTabs = document.querySelectorAll('#talent-filter-tabs .filter-tab');
    const talentCards = document.querySelectorAll('.talent-card');

    talentFilterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            talentFilterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterTalentCards(filter);
        });
    });

    function filterTalentCards(filter) {
        talentCards.forEach(card => {
            const cardCategories = card.getAttribute('data-category').split(',');
            
            if (filter === 'all' || cardCategories.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // View Profile Buttons
    const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const talentCard = this.closest('.talent-card');
            const talentName = talentCard.querySelector('.talent-name').textContent;
            showNotification(`Opening ${talentName}'s full profile...`, 'info');
        });
    });

    // Save Talent Buttons
    const saveTalentBtns = document.querySelectorAll('.save-talent-btn');
    let savedTalents = JSON.parse(localStorage.getItem('savedTalents')) || [];

    saveTalentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const talentCard = this.closest('.talent-card');
            const talentName = talentCard.querySelector('.talent-name').textContent;
            const talentId = talentName.replace(/\s+/g, '-').toLowerCase();
            
            if (this.classList.contains('saved')) {
                // Remove from saved
                this.classList.remove('saved');
                this.innerHTML = '<i class="far fa-bookmark"></i>';
                savedTalents = savedTalents.filter(id => id !== talentId);
                showNotification('Profile removed from saved list');
            } else {
                // Add to saved
                this.classList.add('saved');
                this.innerHTML = '<i class="fas fa-bookmark"></i>';
                savedTalents.push(talentId);
                showNotification('Profile saved successfully!', 'success');
            }
            
            localStorage.setItem('savedTalents', JSON.stringify(savedTalents));
        });
    });

    // Contact Talent Buttons
    const talentActionBtns = document.querySelectorAll('.talent-action-btn');
    talentActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const talentCard = this.closest('.talent-card');
            const talentName = talentCard.querySelector('.talent-name').textContent;
            showContactModal(talentName);
        });
    });

    function showContactModal(talentName) {
        const modalHTML = `
            <div class="contact-modal" id="contactModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Contact ${talentName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="contactTalentForm">
                            <div class="form-group">
                                <label>Your Name *</label>
                                <input type="text" required placeholder="Your full name">
                            </div>
                            <div class="form-group">
                                <label>Company Name *</label>
                                <input type="text" required placeholder="Your company">
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" required placeholder="your@email.com">
                            </div>
                            <div class="form-group">
                                <label>Message *</label>
                                <textarea rows="5" required placeholder="Tell ${talentName} about the opportunity..."></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('contactModal');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const form = modal.querySelector('#contactTalentForm');

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
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification(`Message sent to ${talentName}!`, 'success');
            closeModal();
        });
    }

    // Create Profile Button
    const createProfileBtn = document.querySelector('.create-profile-btn');
    if (createProfileBtn) {
        createProfileBtn.addEventListener('click', function() {
            showProfileCreationModal();
        });
    }

    function showProfileCreationModal() {
        const modalHTML = `
            <div class="profile-modal" id="profileModal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h3>Create Your Professional Profile</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="createProfileForm">
                            <div class="form-section">
                                <h4>Basic Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Full Name *</label>
                                        <input type="text" required placeholder="John Doe">
                                    </div>
                                    <div class="form-group">
                                        <label>Professional Title *</label>
                                        <input type="text" required placeholder="e.g. Senior Software Engineer">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Email *</label>
                                        <input type="email" required placeholder="john@example.com">
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number *</label>
                                        <input type="tel" required placeholder="+237 6XX XXX XXX">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Location *</label>
                                        <select required>
                                            <option value="">Select city</option>
                                            <option>Yaoundé</option>
                                            <option>Douala</option>
                                            <option>Buea</option>
                                            <option>Bafoussam</option>
                                            <option>Bamenda</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Years of Experience *</label>
                                        <select required>
                                            <option value="">Select experience</option>
                                            <option>0-2 years</option>
                                            <option>2-5 years</option>
                                            <option>5-10 years</option>
                                            <option>10+ years</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Professional Summary</h4>
                                <div class="form-group">
                                    <label>About You *</label>
                                    <textarea rows="4" required placeholder="Briefly describe your professional background and what you're looking for..."></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Skills & Expertise</h4>
                                <div class="form-group">
                                    <label>Key Skills *</label>
                                    <input type="text" placeholder="e.g. JavaScript, Project Management, Marketing (separate with commas)">
                                    <small>Add your top skills separated by commas</small>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Availability</h4>
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="availableNow">
                                        <span>I am currently available for new opportunities</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-cancel">Cancel</button>
                                <button type="submit" class="btn-submit">Create Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('profileModal');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const form = modal.querySelector('#createProfileForm');

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
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Profile created successfully! You can now be discovered by employers.', 'success');
            closeModal();
            
        });
    }

    // Load More Profiles
    const loadMoreBtn = document.querySelector('.talent-marketplace .load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            showNotification('Loading more profiles...', 'info');
           
        });
    }

});

// ===================================
// ADDITIONAL STYLES FOR MODALS
// ===================================
const additionalStyles = `
<style>
/* Modal Styles */
.application-modal,
.contact-modal,
.profile-modal {
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

.application-modal.show,
.contact-modal.show,
.profile-modal.show {
    opacity: 1;
}

.modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.application-modal.show .modal-content,
.contact-modal.show .modal-content,
.profile-modal.show .modal-content {
    transform: scale(1);
}

.modal-content.large {
    max-width: 800px;
}

.modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
    color: #111827;
}

.modal-header .company-info {
    color: #6b7280;
    margin: 0;
}

.modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
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
    padding: 2rem;
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
.form-group textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #1a8917;
    box-shadow: 0 0 0 3px rgba(26, 137, 23, 0.1);
}

.form-group select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    cursor: pointer;
}

.form-group small {
    display: block;
    margin-top: 0.25rem;
    color: #6b7280;
    font-size: 0.875rem;
}

.form-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.form-section h4 {
    font-size: 1.125rem;
    color: #111827;
    margin-bottom: 1rem;
    font-weight: 600;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 400;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
    cursor: pointer;
}

.file-upload {
    position: relative;
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.file-upload:hover {
    border-color: #1a8917;
    background: rgba(26, 137, 23, 0.02);
}

.file-upload input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.file-upload label {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    cursor: pointer;
    color: #6b7280;
}

.file-upload label i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #9ca3af;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
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

.btn-submit {
    background: #1a8917;
    color: white;
}

.btn-submit:hover {
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

.notification.error {
    border-left: 4px solid #ef4444;
}

.notification.error i {
    color: #ef4444;
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
    
    .modal-header {
        padding: 1.5rem 1.5rem 1rem;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);