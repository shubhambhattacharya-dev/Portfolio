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
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
    this.toggleBtn.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }

  toggleTheme() {
    const newTheme = this.html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
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
    this.loaderText = $('#loaderText');
    if (!this.overlay) return;
    
    this.init();
  }
  
  init() {
    new TypingEffect(this.loaderText, ['Initializing portfolio...', 'Loading assets...', 'Building DOM...', 'Done.'], 80, 40, 600, false);
    window.addEventListener('load', () => {
      setTimeout(() => this.hide(), 3000); // Give typing effect time to finish
    });
  }

  hide() {
    this.overlay.classList.add('hidden');
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
      link.addEventListener('click', () => this.closeMenu());
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebar.classList.contains('active')) {
        this.closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
        if (this.sidebar.classList.contains('active') && !e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const activeLink = $(`a[href="#${sectionId}"]`);
                
                this.navLinks.forEach(link => link.classList.remove('active'));
                if(activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(section => observer.observe(section));
  }
}

// ==================== EXPERIENCE TABS ====================
class ExperienceTabs {
    constructor() {
        this.tabsContainer = $('.experience-tabs');
        if(!this.tabsContainer) return;

        this.tabLinks = $$('.tab-link');
        this.tabPanels = $$('.tab-panel');

        this.init();
    }

    init() {
        this.tabsContainer.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-link');
            if(!clickedTab) return;
            
            e.preventDefault();
            this.activateTab(clickedTab);
        });
    }

    activateTab(activeTab) {
        const targetPanelId = activeTab.dataset.tab;
        
        this.tabLinks.forEach(tab => {
            tab.classList.toggle('active', tab === activeTab);
        });

        this.tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === targetPanelId);
        });
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
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// ==================== ANIMATIONS ON SCROLL ====================
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    $$('.section').forEach(el => observer.observe(el));
  }
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new LoadingScreen();
    new Navigation();
    new ExperienceTabs();
    new ScrollAnimations();

    new TypingEffect(
        $('#hero-subtitle-text'),
        [
            'I build things for the web.',
            'Backend Developer.',
            'Node.js & MongoDB Expert.'
        ]
    );

    console.log("Portfolio Initialized.");
});