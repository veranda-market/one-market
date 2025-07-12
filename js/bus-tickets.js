// Bus Tickets JavaScript -  File
document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // CITIES DATA & AUTOCOMPLETE
    // ===================================
    const cities = [
        'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua',
        'Maroua', 'Ngaoundéré', 'Bertoua', 'Buea', 'Ebolowa',
        'Kribi', 'Limbe', 'Nkongsamba', 'Dschang', 'Foumban',
        'Kumba', 'Kumbo', 'Mbalmayo', 'Edéa', 'Tiko',
        'Mbouda', 'Bafang', 'Foumbot', 'Sangmélima', 'Batouri',
        'Yokadouma', 'Meiganga', 'Mokolo', 'Mora', 'Kousséri'
    ];

    // Get form elements
    const fromInput = document.getElementById('fromCity');
    const toInput = document.getElementById('toCity');
    const fromSuggestions = document.getElementById('fromSuggestions');
    const toSuggestions = document.getElementById('toSuggestions');
    const departureDate = document.getElementById('departureDate');
    const returnDate = document.getElementById('returnDate');
    const swapBtn = document.querySelector('.swap-btn');
    const tripOptions = document.querySelectorAll('.trip-option');
    const returnDateField = document.querySelector('.return-date-field');
    const searchForm = document.querySelector('.bus-search-form');

    // ===================================
    // DATE SETUP
    // ===================================
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    departureDate.min = today;
    departureDate.value = today;
    returnDate.min = today;

    // ===================================
    // TRIP TYPE TOGGLE
    // ===================================
    tripOptions.forEach(option => {
        option.addEventListener('click', function() {
            tripOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const input = this.querySelector('input');
            input.checked = true;
            
            if (input.value === 'roundtrip') {
                returnDateField.style.display = 'block';
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                returnDate.value = tomorrow.toISOString().split('T')[0];
            } else {
                returnDateField.style.display = 'none';
            }
        });
    });

    // ===================================
    // CITY AUTOCOMPLETE
    // ===================================
    function showSuggestions(input, suggestionsContainer, value) {
        const filteredCities = cities.filter(city => 
            city.toLowerCase().includes(value.toLowerCase())
        );

        if (filteredCities.length > 0 && value) {
            suggestionsContainer.innerHTML = filteredCities
                .slice(0, 8) // Limit to 8 suggestions
                .map(city => `<div class="suggestion-item">${city}</div>`)
                .join('');
            suggestionsContainer.style.display = 'block';

            // click handlers to suggestions
            const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
            suggestionItems.forEach(item => {
                item.addEventListener('click', function() {
                    input.value = this.textContent;
                    suggestionsContainer.style.display = 'none';
                    
                    // Validate cities match
                    validateCities();
                });
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // event listeners
    fromInput.addEventListener('input', function() {
        showSuggestions(fromInput, fromSuggestions, this.value);
    });

    toInput.addEventListener('input', function() {
        showSuggestions(toInput, toSuggestions, this.value);
    });

    // Focus events
    fromInput.addEventListener('focus', function() {
        if (this.value) {
            showSuggestions(fromInput, fromSuggestions, this.value);
        }
    });

    toInput.addEventListener('focus', function() {
        if (this.value) {
            showSuggestions(toInput, toSuggestions, this.value);
        }
    });

    // Hide suggestions on click outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.from-field')) {
            fromSuggestions.style.display = 'none';
        }
        if (!e.target.closest('.to-field')) {
            toSuggestions.style.display = 'none';
        }
    });

    // ===================================
    // SWAP CITIES
    // ===================================
    swapBtn.addEventListener('click', function() {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
        
        // Animate the swap
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // ===================================
    // DATE VALIDATION
    // ===================================
    departureDate.addEventListener('change', function() {
        returnDate.min = this.value;
        if (returnDate.value < this.value) {
            returnDate.value = this.value;
        }
    });

    // ===================================
    // FORM VALIDATION
    // ===================================
    function validateCities() {
        if (fromInput.value && toInput.value && fromInput.value === toInput.value) {
            toInput.setCustomValidity('Departure and arrival cities cannot be the same');
        } else {
            toInput.setCustomValidity('');
        }
    }

    fromInput.addEventListener('blur', validateCities);
    toInput.addEventListener('blur', validateCities);

    // ===================================
    // FORM SUBMISSION
    // ===================================
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!fromInput.value || !toInput.value) {
            showNotification('Please select both departure and arrival cities', 'error');
            return;
        }

        if (fromInput.value === toInput.value) {
            showNotification('Departure and arrival cities cannot be the same', 'error');
            return;
        }

        // Collect form data
        const searchData = {
            from: fromInput.value,
            to: toInput.value,
            departure: departureDate.value,
            passengers: document.getElementById('passengers').value,
            tripType: document.querySelector('input[name="tripType"]:checked').value
        };

        if (searchData.tripType === 'roundtrip') {
            searchData.return = returnDate.value;
        }

        // Show loading state
        const submitBtn = this.querySelector('.search-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log('Search data:', searchData);
            
            // Show success message
            showNotification(`Searching for buses from ${searchData.from} to ${searchData.to}`, 'success');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
        }, 1500);
    });

    // ===================================
    // ACTION BUTTONS
    // ===================================
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case 'Manage my reservation':
                    showModal('Reservation Management', 'Enter your booking reference to manage your reservation.');
                    break;
                case 'Follow a route':
                    showModal('Route Tracking', 'Track your bus in real-time. Feature coming soon!');
                    break;
                case 'Help':
                    showModal('Help Center', 'How can we help you today?<br><br>• Booking issues<br>• Route information<br>• Refund requests<br>• General inquiries');
                    break;
            }
        });
    });

    // ===================================
    // ROUTE CARDS
    // ===================================
    document.querySelectorAll('.route-card').forEach(card => {
        card.addEventListener('click', function() {
            const cities = this.querySelector('.route-cities');
            const from = cities.querySelector('.city-from').textContent;
            const to = cities.querySelector('.city-to').textContent;
            
            // Populate search form with route
            fromInput.value = from;
            toInput.value = to;
            
            // Show notification
            showNotification(`Route selected: ${from} to ${to}`, 'info');
            
            // Smooth scroll to search form
            document.querySelector('.bus-search-container').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the search container
            const searchContainer = document.querySelector('.bus-search-container');
            searchContainer.style.boxShadow = '0 10px 40px rgba(26, 137, 23, 0.3)';
            setTimeout(() => {
                searchContainer.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
            }, 2000);
        });
    });

    // ===================================
    // COMPANY CARDS
    // ===================================
    document.querySelectorAll('.company-card').forEach(card => {
        card.addEventListener('click', function() {
            const companyName = this.querySelector('h4').textContent;
            const rating = this.querySelector('.score').textContent;
            
            showModal(
                companyName, 
                `Rating: ${rating}/5<br><br>View all available routes and schedules for ${companyName}.<br><br>Features:<br>• Online booking<br>• Seat selection<br>• Real-time tracking<br>• Mobile tickets`
            );
        });
    });

    // ===================================
    // PREMIUM AGENCIES SHOWCASE
    // ===================================
    const agencyCards = document.querySelectorAll('.agency-card');
    
    // Mouse movement effect for agency cards
    agencyCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
            card.setAttribute('data-mouse-active', 'true');
        });
        
        card.addEventListener('mouseleave', () => {
            card.setAttribute('data-mouse-active', 'false');
        });
        
        // Agency card click handler
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the CTA button
            if (e.target.closest('.agency-cta')) return;
            
            const agencyName = this.querySelector('.agency-name').textContent;
            const features = Array.from(this.querySelectorAll('.feature-item span'))
                .map(span => `• ${span.textContent}`)
                .join('<br>');
            
            showModal(
                agencyName,
                `Premium Features:<br><br>${features}<br><br>Book your journey with ${agencyName} for the best travel experience.`
            );
        });
    });

    // Agency CTA buttons
    document.querySelectorAll('.agency-cta').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const agencyName = this.closest('.agency-card').querySelector('.agency-name').textContent;
            showNotification(`Redirecting to ${agencyName} booking page...`, 'success');
            
         
            setTimeout(() => {
                
            }, 1000);
        });
    });
    
    // Compare button functionality
    const compareBtn = document.querySelector('.compare-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            showModal(
                'Agency Comparison',
                'Compare features, prices, and routes across all our partner agencies.<br><br>Feature coming soon!'
            );
        });
    }
    
    // Scroll animations for agency cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe agency cards
    agencyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // LOCATION DROPDOWN
    // ===================================
    const locationDropdown = document.querySelector('.location-dropdown');
    const deliverLocation = document.getElementById('deliverLocation');
    
    if (locationDropdown) {
        locationDropdown.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', function() {
                const city = this.textContent;
                deliverLocation.textContent = city;
                
                // Update default from city
                if (city !== 'All Cameroon') {
                    fromInput.value = city;
                }
                
                showNotification(`Default travel location set to ${city}`, 'success');
            });
        });
    }

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        //  styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.95rem;
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
    
    // Show modal
    function showModal(title, content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn">Close</button>
                </div>
            </div>
        `;
        
        //  styles
        modal.style.cssText = `
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
            animation: fadeIn 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        `;
        
        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        modalHeader.querySelector('h3').style.cssText = `
            margin: 0;
            font-size: 1.5rem;
            color: #1f2937;
        `;
        
        const modalClose = modal.querySelector('.modal-close');
        modalClose.style.cssText = `
            background: none;
            border: none;
            font-size: 2rem;
            color: #6b7280;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.3s ease;
        `;
        
        modalClose.addEventListener('mouseenter', () => {
            modalClose.style.background = '#f3f4f6';
            modalClose.style.color = '#1f2937';
        });
        
        modalClose.addEventListener('mouseleave', () => {
            modalClose.style.background = 'none';
            modalClose.style.color = '#6b7280';
        });
        
        const modalBody = modal.querySelector('.modal-body');
        modalBody.style.cssText = `
            padding: 20px;
            overflow-y: auto;
            max-height: 400px;
        `;
        
        modalBody.querySelector('p').style.cssText = `
            margin: 0;
            color: #4b5563;
            line-height: 1.6;
        `;
        
        const modalFooter = modal.querySelector('.modal-footer');
        modalFooter.style.cssText = `
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
        `;
        
        const modalBtn = modal.querySelector('.modal-btn');
        modalBtn.style.cssText = `
            background: #1a8917;
            color: white;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        modalBtn.addEventListener('mouseenter', () => {
            modalBtn.style.background = '#16a085';
            modalBtn.style.transform = 'translateY(-2px)';
        });
        
        modalBtn.addEventListener('mouseleave', () => {
            modalBtn.style.background = '#1a8917';
            modalBtn.style.transform = 'translateY(0)';
        });
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            modalContent.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        modalClose.addEventListener('click', closeModal);
        modalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Close on escape key
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    // CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
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
        
        @keyframes slideUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===================================
// NEWSLETTER FORM 
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success
                this.classList.add('newsletter-success');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                
                // Reset after delay
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    this.classList.remove('newsletter-success');
                }, 2000);
            }, 1500);
        });
    }
});