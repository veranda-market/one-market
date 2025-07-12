/* ===================================
  CTA SECTION INTERACTIONS
   =================================== */

// Initialize CTA section animations
function initCTASection() {
  const ctaSection = document.querySelector('.cta-section');
  if (!ctaSection) return;
  
  // Animate stats on scroll
  initStatsAnimation();
  
  // Button interactions
  initCTAButtons();
  
  // Parallax effect for floating icons
  initFloatingIcons();
}

// Animate statistics numbers
function initStatsAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;
  
  function animateStats() {
    if (animated) return;
    
    const statsContainer = document.querySelector('.cta-stats');
    if (!statsContainer) return;
    
    const rect = statsContainer.getBoundingClientRect();
    const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
    
    if (inView) {
      animated = true;
      stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.includes('K') ? 'K' : '';
        animateNumber(stat, 0, target, 2000, suffix);
      });
    }
  }
  
  // Check on scroll and initial load
  window.addEventListener('scroll', animateStats);
  window.addEventListener('load', animateStats);
  animateStats();
}

// Animate number counting
function animateNumber(element, start, end, duration, suffix = '') {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    
    if (suffix === 'K') {
      element.textContent = Math.floor(current) + 'K+';
    } else {
      element.textContent = Math.floor(current).toLocaleString() + '+';
    }
  }, 16);
}

// Initialize CTA button interactions
function initCTAButtons() {
  const ctaButtons = document.querySelectorAll('.cta-btn');
  
  ctaButtons.forEach(button => {
    // ripple effect on click
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
      
      // Handle button actions
      if (this.classList.contains('primary')) {
        console.log('Navigate to seller registration');
        // window.location.href = '/seller-registration';
      } else if (this.classList.contains('secondary')) {
        console.log('Navigate to seller information');
        // window.location.href = '/seller-info';
      }
    });
  });
}

// Parallax effect for floating icons
function initFloatingIcons() {
  const floatingIcons = document.querySelectorAll('.floating-icon');
  
  if (floatingIcons.length === 0) return;
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    
    floatingIcons.forEach((icon, index) => {
      const yPos = rate * (index + 1) * 0.3;
      icon.style.transform = `translateY(${yPos}px)`;
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

// ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCTASection);

// Export
window.initCTASection = initCTASection;