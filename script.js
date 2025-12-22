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
        const savedTheme = localStorage.getItem('theme') || 'light-theme';
        this.setTheme(savedTheme);
        
        // Add event listener with passive option for better performance
        this.themeToggle.addEventListener('click', () => this.toggleTheme(), { passive: true });
    }

    setTheme(theme) {
        this.body.className = theme;
        this.updateIcon();
    }

    toggleTheme() {
        const isDark = this.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light-theme' : 'dark-theme';
        
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        this.animateToggle();
    }

    updateIcon() {
        const isDark = this.body.classList.contains('dark-theme');
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
        const shouldShow = window.scrollY > 300;
        this.button.classList.toggle('visible', shouldShow);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ==================== PARTICLES ANIMATION ====================
class ParticlesAnimation {
    constructor() {
        this.container = $('#particles');
        this.particles = [];
        this.particleCount = 30; // Reduced for better performance
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        this.init();
    }

    init() {
        if (!this.container || window.innerWidth < 768) return;

        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        this.container.appendChild(particle);
        return particle;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                element: this.createParticle(),
                x: parseFloat(this.container.style.left) || 0,
                y: parseFloat(this.container.style.top) || 0,
                size: Math.random() * 3 + 1
            });
        }
    }

    setupEventListeners() {
        // Throttle mousemove events
        let mouseMoveTimeout;
        this.container.addEventListener('mousemove', (e) => {
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                const rect = this.container.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            }, 16); // ~60fps
        }, { passive: true });

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animationId);
            } else {
                this.animate();
            }
        });
    }

    animate() {
        this.particles.forEach(particle => {
            const particleX = parseFloat(particle.element.style.left) * this.container.offsetWidth / 100;
            const particleY = parseFloat(particle.element.style.top) * this.container.offsetHeight / 100;
            
            const distance = Math.sqrt(
                Math.pow(this.mouseX - particleX, 2) +
                Math.pow(this.mouseY - particleY, 2)
            );

            if (distance < 150) {
                const scale = 1 + (150 - distance) / 150;
                particle.element.style.transform = `scale(${scale})`;
            } else {
                particle.element.style.transform = 'scale(1)';
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ==================== SCROLL REVEAL ANIMATION ====================
class ScrollReveal {
    constructor() {
        this.elements = $$('.project-card, .skill-card, .stat-box, .contact-item, .section-title');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observeElements();
        } else {
            // Fallback for older browsers
            this.showAllElements();
        }
    }

    observeElements() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.elements.forEach(element => {
            element.classList.add('scroll-reveal');
            observer.observe(element);
        });
    }

    showAllElements() {
        this.elements.forEach(element => {
            element.classList.add('revealed');
        });
    }
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.timeoutId = null;
        this.init();
    }

    init() {
        if (!this.element) return;
        this.type();
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

        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed = this.speed / 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 1500; // Pause at end of typing
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

// ==================== COUNTER ANIMATION ====================
class CounterAnimation {
    constructor() {
        this.counters = $$('.stat-number');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observeCounters();
        }
    }

    observeCounters() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = counter.textContent.trim();
        
        // Handle different counter types
        if (target.includes('/')) {
            // Time format (e.g., "24/7")
            return;
        }

        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/\D/g, '')) || 0;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * numericValue);
            
            let displayValue = current.toString();
            if (isPlus) displayValue += '+';
            if (isPercentage) displayValue += '%';
            
            counter.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                let finalValue = numericValue.toString();
                if (isPlus) finalValue += '+';
                if (isPercentage) finalValue += '%';
                counter.textContent = finalValue;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// ==================== PROJECT CARD TILT EFFECT ====================
class CardTiltEffect {
    constructor() {
        this.cards = $$('.project-card, .skill-card');
        this.init();
    }

    init() {
        // Only enable on non-touch devices
        if ('ontouchstart' in window) return;
        
        this.cards.forEach(card => {
            card.addEventListener('mousemove', this.handleMouseMove.bind(this));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }

    handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25; // Reduced sensitivity
        const rotateY = (centerX - x) / 25;
        
        // Use CSS variables for better performance
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
        card.style.setProperty('--scale', '1.02');
    }

    handleMouseLeave(e) {
        const card = e.currentTarget;
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
        card.style.setProperty('--scale', '1');
    }
}

// ==================== CURSOR EFFECT ====================
class CursorEffect {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        // Only enable on desktop and non-touch devices
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return;
        
        this.createCursor();
        this.setupEventListeners();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursorFollower = document.createElement('div');
        
        this.cursor.className = 'custom-cursor';
        this.cursorFollower.className = 'cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    }

    setupEventListeners() {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        
        // Use requestAnimationFrame for smooth animation
        const animate = () => {
            // Smooth follower movement
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            this.cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            this.cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            requestAnimationFrame(animate);
        };
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - 5;
            mouseY = e.clientY - 5;
        }, { passive: true });
        
        // Handle interactive elements
        const interactiveElements = $$('a, button, .btn, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            });
        });
        
        animate();
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

// ==================== EASTER EGG ====================
class EasterEgg {
    constructor() {
        this.clickCount = 0;
        this.lastClickTime = 0;
        this.init();
    }
    
    init() {
        const logo = $('.logo');
        if (!logo) return;
        
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogoClick();
        });
    }
    
    handleLogoClick() {
        const now = Date.now();
        const timeDiff = now - this.lastClickTime;
        
        // Reset if too much time between clicks
        if (timeDiff > 1000) {
            this.clickCount = 0;
        }
        
        this.clickCount++;
        this.lastClickTime = now;
        
        if (this.clickCount === 5) {
            this.activateEasterEgg();
            this.clickCount = 0;
        }
    }
    
    activateEasterEgg() {
        // Create a fun confetti effect
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                top: -20px;
                left: ${Math.random() * 100}vw;
                z-index: 9999;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
        
        // Show message
        setTimeout(() => {
            alert('🎉 You found the easter egg! Thanks for exploring!');
        }, 500);
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
            new ParticlesAnimation(),
            new ScrollReveal(),
            new CounterAnimation(),
            new CardTiltEffect(),
            new CursorEffect(),
            new EasterEgg()
        ];
        
        // Initialize typing effect if element exists
        const heroRole = $('.hero-role');
        if (heroRole) {
            const roles = [
                'Senior Backend Developer & API Specialist',
                'Full Stack Engineer',
                'Database Architect',
                'Cloud Solutions Expert'
            ];
            this.components.push(new TypingEffect(heroRole, roles, 100));
        }
        
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
    
    .custom-cursor {
        width: 10px;
        height: 10px;
        background: var(--accent-primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        transform: translate(-50%, -50%);
    }
    
    .custom-cursor.hover {
        transform: translate(-50%, -50%) scale(1.5);
    }
    
    .cursor-follower {
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent-primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease;
        transform: translate(-50%, -50%);
        opacity: 0.5;
    }
    
    .cursor-follower.hover {
        transform: translate(-50%, -50%) scale(1.5);
    }
    
    @media (max-width: 1023px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
        
        body {
            cursor: auto !important;
        }
    }
    
    .particle {
        position: absolute;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.4));
        border-radius: 50%;
        pointer-events: none;
        animation: float 20s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(20px, -20px) scale(1.1); }
        50% { transform: translate(-15px, 15px) scale(0.9); }
        75% { transform: translate(10px, -10px) scale(1.05); }
    }
`;
document.head.appendChild(style);