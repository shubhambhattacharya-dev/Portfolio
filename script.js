// ==================== UTILITY FUNCTIONS ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== CURSOR GLOW ====================
class CursorGlow {
  constructor() {
    this.glow = document.createElement('div');
    this.glow.className = 'cursor-glow';
    document.body.appendChild(this.glow);
    this.active = false;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      if (!this.active) {
        this.active = true;
        this.glow.classList.add('active');
      }
      requestAnimationFrame(() => {
        this.glow.style.left = e.clientX + 'px';
        this.glow.style.top = e.clientY + 'px';
      });
    });

    document.addEventListener('mouseleave', () => {
      this.active = false;
      this.glow.classList.remove('active');
    });
  }
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
  constructor(element, phrases, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000, loop = true) {
    this.element = element;
    this.phrases = phrases;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.pauseTime = pauseTime;
    this.loop = loop;
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;
    
    if (!this.element) return;
    this.tick();
  }

  tick() {
    const currentPhrase = this.phrases[this.phraseIndex];
    
    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = currentPhrase.substring(0, this.charIndex);

    let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      speed = 400;
    }

    this.timeoutId = setTimeout(() => this.tick(), speed);
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

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
    let savedTheme;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      savedTheme = null;
    }
    savedTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
    
    this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    });
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('LocalStorage not available');
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
      80, 40, 600, false
    );
    
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
    if (this.typingEffect) this.typingEffect.destroy();
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.style.display = 'none';
      }
    }, 600);
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
    this.menuToggle.addEventListener('click', () => this.toggleMenu());
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = $(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        this.closeMenu();
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebar.classList.contains('active')) {
        this.closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (this.sidebar.classList.contains('active') && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('.menu-toggle')) {
        this.closeMenu();
      }
    });

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
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -20% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

// ==================== SCROLL ANIMATIONS ====================
class ScrollAnimations {
  constructor() {
    this.revealSelector = [
      '.hero-greeting',
      '.hero-title',
      '.hero-subtitle',
      '.hero-description',
      '.hero-cta',
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

    if (!('IntersectionObserver' in window)) {
      sections.forEach(el => el.classList.add('visible'));
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    sections.forEach(el => observer.observe(el));
  }

  prepareRevealItems(section) {
    const items = Array.from(section.querySelectorAll(this.revealSelector));
    items.forEach((item, index) => {
      item.classList.add('reveal-item');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 80, 640)}ms`);
    });
  }
}

// ==================== SMOOTH SCROLL POLYFILL ====================
function smoothScrollPolyfill() {
  if ('scrollBehavior' in document.documentElement.style) return;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
  try {
    new ThemeManager();
    new LoadingScreen();
    new Navigation();
    new ScrollAnimations();
    new CursorGlow();
    
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
        100, 50, 2000, true
      );
    }
    
    smoothScrollPolyfill();
    
    console.log('Portfolio v2.0 initialized');
  } catch (error) {
    console.error('Error initializing portfolio:', error);
  }
});

// ==================== NETWORK STATUS ====================
window.addEventListener('online', () => console.log('Connection restored'));
window.addEventListener('offline', () => console.log('Connection lost'));
