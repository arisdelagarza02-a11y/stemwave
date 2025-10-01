
/**
 * STEMWave Site JavaScript
 * Handles mobile navigation, accessibility, and user interactions
 */

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Mobile Navigation Module
const MobileNav = {
  init() {
    this.burger = document.querySelector('.hamburger');
    this.nav = document.querySelector('.nav-links'); // Fixed selector to match HTML
    this.navLinks = document.querySelectorAll('.nav-links a');
    
    if (!this.burger || !this.nav) {
      console.warn('Navigation elements not found');
      return;
    }
    
    this.setupEventListeners();
    this.injectMobileStyles();
    this.setupKeyboardNavigation();
  },
  
  setupEventListeners() {
    // Toggle navigation on burger click
    this.burger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleNav();
    });
    
    // Close navigation when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 720) {
          this.closeNav();
        }
      });
    });
    
    // Close navigation on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isNavOpen()) {
        this.closeNav();
        this.burger.focus();
      }
    });
    
    // Close navigation when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isNavOpen() && 
          !this.nav.contains(e.target) && 
          !this.burger.contains(e.target)) {
        this.closeNav();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth >= 720) {
        this.closeNav();
      }
    }, 250));
  },
  
  setupKeyboardNavigation() {
    // Make hamburger button keyboard accessible
    this.burger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleNav();
      }
    });
    
    // Tab navigation within open mobile menu
    this.nav.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = this.nav.querySelectorAll('a[href]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },
  
  toggleNav() {
    const isExpanded = this.burger.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.closeNav();
    } else {
      this.openNav();
    }
  },
  
  openNav() {
    this.burger.setAttribute('aria-expanded', 'true');
    this.nav.classList.add('mobile-open');
    this.burger.classList.add('active');
    
    // Focus first navigation link for keyboard users
    setTimeout(() => {
      const firstLink = this.nav.querySelector('a[href]');
      if (firstLink) firstLink.focus();
    }, 100);
  },
  
  closeNav() {
    this.burger.setAttribute('aria-expanded', 'false');
    this.nav.classList.remove('mobile-open');
    this.burger.classList.remove('active');
  },
  
  isNavOpen() {
    return this.burger.getAttribute('aria-expanded') === 'true';
  },
  
  injectMobileStyles() {
    // Enhanced mobile navigation styles
    const style = document.createElement('style');
    style.id = 'mobile-nav-styles';
    style.textContent = `
      @media (max-width: 719px) {
        .nav-links {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg);
          border-bottom: 1px solid var(--line);
          flex-direction: column;
          align-items: stretch;
          padding: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 50;
          display: none;
        }
        
        .nav-links.mobile-open {
          display: flex !important;
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .nav-links a {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--line);
          transition: background-color 0.2s ease;
        }
        
        .nav-links a:last-child {
          border-bottom: none;
        }
        
        .nav-links a:hover,
        .nav-links a:focus {
          background-color: #f8fafc;
          outline: none;
        }
        
        .nav-links .btn {
          margin: 0.5rem 1rem 0;
          text-align: center;
        }
        
        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .hamburger span {
          transition: all 0.3s ease;
        }
        
        .site-header {
          position: relative;
        }
      }
      
      @media (min-width: 720px) {
        .nav-links {
          display: flex !important;
          position: static;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          flex-direction: row !important;
          padding: 0 !important;
        }
      }
    `;
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('mobile-nav-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  }
};

// Smooth Scrolling Module
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
};

// Form Enhancement Module
const FormEnhancements = {
  init() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => this.enhanceForm(form));
  },
  
  enhanceForm(form) {
    // Add loading states and validation feedback
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        
        // Re-enable after 3 seconds (adjust based on your form handling)
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 3000);
      }
    });
  }
};

// Performance and Accessibility Utilities
const Utils = {
  // Lazy load images
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  },
  
  // Add focus indicators for keyboard navigation
  enhanceAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    MobileNav.init();
    SmoothScroll.init();
    FormEnhancements.init();
    Utils.initLazyLoading();
    Utils.enhanceAccessibility();
    
    console.log('STEMWave site scripts loaded successfully');
  } catch (error) {
    console.error('Error initializing site scripts:', error);
  }
});

// Add global CSS for keyboard navigation
const globalStyles = document.createElement('style');
globalStyles.textContent = `
  .keyboard-nav *:focus {
    outline: 2px solid var(--brand) !important;
    outline-offset: 2px;
  }
  
  img.lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  img.lazy.loaded {
    opacity: 1;
  }
`;
document.head.appendChild(globalStyles);
