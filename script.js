// ==================== HELPERS ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== THEME MANAGER ====================
class ThemeManager {
  constructor() {
    this.body = document.documentElement;
    this.toggleBtn = $('#themeToggle');
    this.icon = $('#themeIcon');

    if (!this.toggleBtn || !this.icon) return;

    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    this.toggleBtn.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    this.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }

  toggleTheme() {
    const current = this.body.getAttribute('data-theme');
    this.setTheme(current === 'dark' ? 'light' : 'dark');
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
        this.overlay.classList.add('hidden');
        setTimeout(() => {
          this.overlay.style.display = 'none';
        }, 400);
      }, 300);
    });
  }
}

// ==================== NAVIGATION ====================
class Navigation {
  constructor() {
    this.navbar = $('#navbar');
    this.menuToggle = $('#menuToggle');
    this.navLinks = $('#navLinks');

    if (!this.navbar || !this.menuToggle || !this.navLinks) return;

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.menuToggle.addEventListener('click', () => this.toggleMenu());

    $$('#navLinks a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });
  }

  onScroll() {
    this.navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  toggleMenu() {
    this.navLinks.classList.toggle('active');
    document.body.style.overflow =
      this.navLinks.classList.contains('active') ? 'hidden' : '';
  }

  closeMenu() {
    this.navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==================== SMOOTH SCROLL ====================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.length <= 1) return;

        const target = $(targetId);
        if (!target) return;

        e.preventDefault();

        const offset = $('#navbar')?.offsetHeight || 80;
        const top = target.offsetTop - offset;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
}

// ==================== BACK TO TOP ====================
class BackToTop {
  constructor() {
    this.button = $('#backToTop');
    if (!this.button) return;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.button.classList.toggle('visible', window.scrollY > 200);
    }, { passive: true });

    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }

  handleSubmit() {
    const data = Object.fromEntries(new FormData(this.form));

    if (!data.name || !data.email || !data.message) {
      alert('Please fill all required fields.');
      return;
    }

    alert('Thank you! Your message has been sent.');
    this.form.reset();
  }
}

// ==================== APP INIT ====================
class App {
  constructor() {
    this.init();
  }

  init() {
    new LoadingScreen();
    new ThemeManager();
    new Navigation();
    new SmoothScroll();
    new BackToTop();
    new ContactForm();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
