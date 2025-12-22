// ==================== UTILITY FUNCTIONS ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== THEME MANAGEMENT ====================
class ThemeManager {
    constructor() {
        this.body = document.body;
        this.themeToggle = $('#themeToggle');
        this.themeIcon = $('#themeIcon');
        this.init();
    }

    init() {
        // Load saved theme from localStorage or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Add event listener with passive option for better performance
        this.themeToggle.addEventListener('click', () => this.toggleTheme(), { passive: true });
    }

    setTheme(theme) {
        this.body.setAttribute('data-theme', theme);
        this.updateIcon();
    }

    toggleTheme() {
        const isDark = this.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        this.animateToggle();
    }

    updateIcon() {
        const isDark = this.body.getAttribute('data-theme') === 'dark';
        this.themeIcon.className = `fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
    }

    animateToggle() {
        this.themeToggle.style.transform = 'rotate(360deg)';
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.themeToggle.style.transform = '';
            }, 300);
        });
    }
}

// ==================== LOADING SCREEN ====================
class LoadingScreen {
    constructor() {
        this.overlay = $('#loadingOverlay');
        this.init();
    }

    init() {
        // Use DOMContentLoaded for faster loading
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.hide());
        } else {
            this.hide();
        }
    }

    hide() {
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.overlay.classList.add('hidden');
                setTimeout(() => {
                    this.overlay.style.display = 'none';
                }, 500);
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
        this.init();
    }

    init() {
        // Throttle scroll event
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking a link
        $$('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside or pressing ESC
        document.addEventListener('click', (e) => {
            if (this.navLinks.classList.contains('active') && 
                !this.navLinks.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    handleScroll() {
        const shouldAddScrolled = window.scrollY > 50;
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            if (shouldAddScrolled) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    toggleMobileMenu() {
        const isOpening = !this.navLinks.classList.contains('active');
        this.navLinks.classList.toggle('active');
        this.animateHamburger(isOpening);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.animateHamburger(false);
        document.body.style.overflow = '';
    }

    animateHamburger(isOpening) {
        const spans = this.menuToggle.querySelectorAll('span');
        if (isOpening) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
}

// ==================== SMOOTH SCROLLING ====================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip empty or special hrefs
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                this.scrollToTarget(href);
            });
        });
    }

    scrollToTarget(targetId) {
        const target = $(targetId);
        if (!target) return;

        const navbarHeight = $('#navbar').offsetHeight || 80;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ==================== BACK TO TOP BUTTON ====================
class BackToTop {
    constructor() {
        this.button = $('#backToTop');
        this.init();
    }

    init() {
        // Throttle scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        const shouldShow = window.scrollY > 100;
        this.button.classList.toggle('visible', shouldShow);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}






// ==================== PERFORMANCE OPTIMIZATION ====================
class PerformanceOptimizer {
    static init() {
        // Debounce function for scroll/resize events
        this.setupDebouncedEvents();
        
        // Use passive event listeners where possible
        this.setupPassiveListeners();
        
        // Handle visibility changes
        this.setupVisibilityHandler();
    }
    
    static setupDebouncedEvents() {
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };
        
        window.addEventListener('resize', debounce(() => {
            // Handle resize events
        }, 250), { passive: true });
    }
    
    static setupPassiveListeners() {
        // Mark scroll events as passive
        const events = ['touchstart', 'touchmove', 'wheel'];
        events.forEach(event => {
            document.addEventListener(event, () => {}, { passive: true });
        });
    }
    
    static setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, reduce animations
                document.body.classList.add('page-hidden');
            } else {
                document.body.classList.remove('page-hidden');
            }
        });
    }
}


// ==================== CONTACT FORM HANDLER ====================
class ContactForm {
    constructor() {
        this.form = $('#contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        // Simple form handling - in real app, send to backend
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Simulate sending
        alert('Thank you for your message! I will get back to you soon.');
        this.form.reset();
    }
}

// ==================== INITIALIZE ALL COMPONENTS ====================
class App {
    constructor() {
        this.components = [];
        this.init();
    }

    init() {
        // Initialize performance optimizations first
        PerformanceOptimizer.init();

        // Initialize all components
        this.components = [
            new LoadingScreen(),
            new ThemeManager(),
            new Navigation(),
            new SmoothScroll(),
            new BackToTop(),
            new ContactForm()
        ];

        // Handle cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    cleanup() {
        // Clean up any resources
        this.components.forEach(component => {
            if (typeof component.cleanup === 'function') {
                component.cleanup();
            }
        });
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Add CSS for scroll reveal animations
const style = document.createElement('style');
style.textContent = `
    .scroll-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
`;
document.head.appendChild(style);