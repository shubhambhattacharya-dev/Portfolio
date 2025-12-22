// ==================== UTILITY FUNCTIONS ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== THEME MANAGER ====================
class ThemeManager {
  constructor() {
    this.html = document.documentElement;
    this.toggleBtn = $('#themeToggle');
    this.icon = $('#themeIcon');
    
    if (!this.toggleBtn || !this.icon) return;
    
    this.init();
  }

  init() {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    // Add click event listener
    this.toggleBtn.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }

  toggleTheme() {
    const currentTheme = this.html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateIcon(theme) {
    this.icon.className = `fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
  }
}

// ==================== LOADING SCREEN ====================
class LoadingScreen {
  constructor() {
    this.overlay = $('#loadingOverlay');
    if (!this.overlay) return;
    
    this.init();
  }

  init() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoading();
      }, 500);
    });
  }

  hideLoading() {
    this.overlay.classList.add('hidden');
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 400);
  }
}

// ==================== NAVIGATION ====================
class Navigation {
  constructor() {
    this.navbar = $('#navbar');
    this.menuToggle = $('#menuToggle');
    this.navLinks = $('#navLinks');
    this.navLinkItems = $$('#navLinks a');
    
    if (!this.navbar || !this.menuToggle || !this.navLinks) return;
    
    this.init();
  }

  init() {
    // Handle scroll for navbar styling
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    // Mobile menu toggle
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking nav links
    this.navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
        this.setActiveLink(link);
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
        this.closeMenu();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.navLinks.classList.contains('active') && 
          !this.navLinks.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Set active link on scroll
    this.handleActiveSection();
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  toggleMenu() {
    const isActive = this.navLinks.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    this.menuToggle.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  closeMenu() {
    this.navLinks.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  setActiveLink(activeLink) {
    this.navLinkItems.forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  handleActiveSection() {
    const sections = $$('section[id]');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          const activeLink = $(`#navLinks a[href="#${sectionId}"]`);
          if (activeLink) {
            this.navLinkItems.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
          }
        }
      });
    }, { passive: true });
  }
}

// ==================== SMOOTH SCROLL ====================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Handle all anchor links with smooth scrolling
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Skip if href is just '#'
        if (targetId === '#' || targetId.length <= 1) return;
        
        const target = $(targetId);
        if (!target) return;
        
        e.preventDefault();
        
        const navbarHeight = $('#navbar')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      });
    });
  }
}

// ==================== BACK TO TOP BUTTON ====================
class BackToTop {
  constructor() {
    this.button = $('#backToTop');
    if (!this.button) return;
    
    this.init();
  }

  init() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    }, { passive: true });
    
    // Scroll to top when clicked
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ==================== CONTACT FORM ====================
class ContactForm {
  constructor() {
    this.form = $('#contactForm');
    if (!this.form) return;
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Add real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
      this.showError(field, 'This field is required');
      return false;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    this.clearError(field);
    return true;
  }

  showError(field, message) {
    this.clearError(field);
    
    field.style.borderColor = 'var(--error)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }

  clearError(field) {
    field.style.borderColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  async handleSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showNotification('Please fill in all required fields correctly.', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate sending (replace with actual API call)
    try {
      await this.simulateApiCall(data);
      
      this.showNotification('Thank you! Your message has been sent successfully.', 'success');
      this.form.reset();
    } catch (error) {
      this.showNotification('Oops! Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  simulateApiCall(data) {
    return new Promise((resolve) => {
      console.log('Form data:', data);
      setTimeout(resolve, 1500);
    });
  }

  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotif = $('.notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
      color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="font-size: 1.25rem;"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// ==================== ANIMATIONS ON SCROLL ====================
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = $$('.project-card, .skill-category, .timeline-item, .stat-item');
    
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
  constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    
    if (this.element) {
      this.type();
    }
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// ==================== INITIALIZE APP ====================
class App {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize all components
    new LoadingScreen();
    new ThemeManager();
    new Navigation();
    new SmoothScroll();
    new BackToTop();
    new ContactForm();
    new ScrollAnimations();
    
    // Optional: Add typing effect to hero subtitle
    // Uncomment if you want this feature
    // const subtitleElement = $('.hero-subtitle');
    // if (subtitleElement) {
    //   new TypingEffect(
    //     subtitleElement,
    //     [
    //       'Backend Developer Specializing in Node.js & MongoDB',
    //       'Building Scalable REST APIs',
    //       'Creating Real-time Applications'
    //     ]
    //   );
    // }
    
    // Add CSS for notification animations
    this.addNotificationStyles();
    
    // Log initialization
    console.log('Portfolio initialized successfully! 🚀');
  }

  addNotificationStyles() {
    if ($('#notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
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
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// ==================== START APPLICATION ====================
new App();

// ==================== PERFORMANCE MONITORING ====================
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
      }
    }, 0);
  });
}

// ==================== SERVICE WORKER REGISTRATION (Optional) ====================
// Uncomment to enable offline support
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}
*/