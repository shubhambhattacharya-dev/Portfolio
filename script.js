// ==================== THEME INITIALIZATION ====================
(function initTheme() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const ICONS = {
    sun: '<svg class="icon icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    moon: '<svg class="icon icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bars: '<svg class="icon icon-bars" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    close: '<svg class="icon icon-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
  };

  function updateIcons(theme) {
    const icon = theme === 'dark' ? ICONS.sun : ICONS.moon;
    const targetLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    const desktopBtn = document.getElementById('themeToggle');
    const mobileBtn = document.getElementById('themeToggleMobile');
    if (desktopBtn) {
      desktopBtn.innerHTML = icon;
      desktopBtn.setAttribute('aria-label', targetLabel);
    }
    if (mobileBtn) {
      mobileBtn.innerHTML = icon;
      mobileBtn.setAttribute('aria-label', targetLabel);
    }
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    updateIcons(theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0f0f0f' : '#fafafa';
  }

  function toggle() {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  const desktopBtn = document.getElementById('themeToggle');
  const mobileBtn = document.getElementById('themeToggleMobile');
  if (desktopBtn) desktopBtn.addEventListener('click', toggle);
  if (mobileBtn) mobileBtn.addEventListener('click', toggle);
  updateIcons(html.getAttribute('data-theme'));

  // ==================== SMART STICKY NAV ====================
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (!nav) return;

    if (currentScrollY > 100 && currentScrollY > lastScrollY) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  // ==================== MOBILE NAV TOGGLE ====================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    const closeMobileNav = () => {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = ICONS.bars;
      document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? ICONS.close : ICONS.bars;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link, .nav-resume').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // ==================== 1. CURSOR-FOLLOWING RADIAL GLOW (HERO) ====================
  const hero = document.querySelector('.hero');
  if (hero && !isTouchDevice) {
    let ticking = false;

    hero.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          hero.style.setProperty('--mouse-x', `${x}px`);
          hero.style.setProperty('--mouse-y', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ==================== 2. 3D CARD TILT ON HOVER ====================
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (tiltCards.length && !isTouchDevice) {
    tiltCards.forEach(card => {
      let ticking = false;

      card.addEventListener('mousemove', (e) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
            ticking = false;
          });
          ticking = true;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==================== 3. HERO TYPING EFFECT ====================
  const typedEl = document.getElementById('heroTyped');
  if (typedEl) {
    const fullText = "Backend Engineer (Node.js / TypeScript)";
    let charIndex = 0;

    function typeChar() {
      if (charIndex < fullText.length) {
        typedEl.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 45 + Math.random() * 20);
      }
    }
    typedEl.textContent = '';
    setTimeout(typeChar, 300);
  }

  // ==================== 4. MAGNETIC BUTTONS ====================
  const magneticEls = document.querySelectorAll('.btn-magnetic');
  if (magneticEls.length && !isTouchDevice) {
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ==================== 5. ACTIVE SECTION & SCROLL REVEALS ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  if (sections.length && navLinkEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + id;
            if (isActive) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  // ==================== SCROLL PROGRESS BAR ====================
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }, { passive: true });
  }

  // ==================== STAGGERED REVEAL ANIMATIONS ====================
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }
});
