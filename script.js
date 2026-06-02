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
    // Check for user preference, system preference, or default to dark
    let savedTheme;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      savedTheme = null;
    }
    savedTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
    
    this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {
        // ignore
      }
    });
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('LocalStorage is not available');
    }
    this.updateIcon(theme);
  }

  toggleTheme() {
    const newTheme = this.html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateIcon(theme) {
    this.icon.className = `fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    this.icon.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

// ==================== LOADING SCREEN ====================
class LoadingScreen {
  constructor() {
    this.overlay = $('#loadingOverlay');
    this.loaderText = $('#loaderText');
    if (!this.overlay) return;
    
    this.init();
  }
  
  init() {
    this.typingEffect = new TypingEffect(
      this.loaderText, 
      ['Booting portfolio...', 'Loading projects...', 'Warming up APIs...', 'Ready.'],
      80, 
      40, 
      600, 
      false
    );
    
    // Hide loading screen when page is fully loaded
    if (document.readyState === 'complete') {
      setTimeout(() => this.hide(), 2500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.hide(), 2500);
      });
    }
  }

  hide() {
    this.overlay.classList.add('hidden');
    if (this.typingEffect) {
      this.typingEffect.destroy();
    }
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.style.display = 'none';
      }
    }, 500);
  }
}

// ==================== NAVIGATION ====================
class Navigation {
  constructor() {
    this.sidebar = $('#sidebar');
    this.menuToggle = $('#menuToggle');
    this.navLinks = $$('.nav-link');
    
    if (!this.sidebar || !this.menuToggle) return;
    
    this.init();
  }

  init() {
    // Menu toggle
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Smooth scroll
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = $(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        this.closeMenu();
      });
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebar.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.sidebar.classList.contains('active') && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('.menu-toggle')) {
        this.closeMenu();
      }
    });

    // Handle active section highlighting
    this.handleActiveSection();
  }

  toggleMenu() {
    const isActive = this.sidebar.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    this.menuToggle.setAttribute('aria-expanded', isActive);
    document.body.classList.toggle('menu-open');
  }

  closeMenu() {
    this.sidebar.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  handleActiveSection() {
    const sections = $$('section[id]');
    
    // Intersection Observer for better performance
    const observerOptions = {
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          const activeLink = $(`.nav-link[href="#${sectionId}"]`);
          
          // Update active state
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
          });
          
          if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
          }
          
          // Update URL without scrolling
          if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
  constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000, loop = true) {
    if (!element) return;
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.loop = loop;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;
    
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      if (this.textIndex === this.texts.length - 1 && !this.loop) {
        return; // Stop if it's the last text and not looping
      }
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }
    
    this.timeoutId = setTimeout(() => this.type(), typeSpeed);
  }
  
  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// ==================== ANIMATIONS ON SCROLL ====================
class ScrollAnimations {
  constructor() {
    this.revealSelector = [
      '.hero-intro',
      '.hero-title',
      '.hero-subtitle',
      '.hero-description',
      '.hero-cta',
      '.section-title',
      '.about-text > *',
      '.about-image',
      '.skill-item',
      '.project-card',
      '.timeline-item',
      '.contact-content > *'
    ].join(', ');

    this.init();
  }

  init() {
    const sections = $$('.section');
    sections.forEach(section => this.prepareRevealItems(section));

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: make all sections visible
      sections.forEach(el => el.classList.add('visible'));
      return;
    }
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    sections.forEach(el => observer.observe(el));
  }

  prepareRevealItems(section) {
    const items = Array.from(section.querySelectorAll(this.revealSelector));
    items.forEach((item, index) => {
      item.classList.add('reveal-item');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 560)}ms`);
    });
  }
}

// ==================== PERFORMANCE MONITORING ====================
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // Log performance metrics in development
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;
          
          console.log('Performance Metrics:');
          console.log(`Page Load Time: ${pageLoadTime}ms`);
          console.log(`Server Connection Time: ${connectTime}ms`);
          console.log(`DOM Render Time: ${renderTime}ms`);
        }, 0);
      });
    }
  }
}

// ==================== SMOOTH SCROLL POLYFILL ====================
function smoothScrollPolyfill() {
  // Check if smooth scroll is supported
  if ('scrollBehavior' in document.documentElement.style) {
    return;
  }
  
  // Add polyfill for older browsers
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
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize all components
    new ThemeManager();
    new LoadingScreen();
    new Navigation();
    new ScrollAnimations();
    
    // Initialize hero typing effect
    const heroSubtitle = $('#hero-subtitle-text');
    if (heroSubtitle) {
      new TypingEffect(
        heroSubtitle,
        [
          'robust backend systems.',
          'scalable REST APIs.',
          'real-time features.',
          'clean TypeScript APIs.'
        ],
        100,
        50,
        2000,
        true
      );
    }
    
    // Initialize smooth scroll polyfill
    smoothScrollPolyfill();
    
    // Initialize performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      new PerformanceMonitor();
    }
    
    console.log('Portfolio initialized successfully');
    
  } catch (error) {
    console.error('Error initializing portfolio:', error);
  }
});

// ==================== SERVICE WORKER REGISTRATION (Optional) ====================
// Uncomment to enable PWA features
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
*/

// ==================== HANDLE NETWORK STATUS ====================
window.addEventListener('online', () => {
  console.log('Connection restored');
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
});

// ==================== PREVENT CONTEXT MENU ON PRODUCTION (Optional) ====================
// Uncomment to disable right-click on production
/*
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}
*/
