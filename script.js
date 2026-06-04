// ==================== THEME ====================
(function initTheme() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* noop */ }
  const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // SVG icon templates (replacing Font Awesome)
  const ICONS = {
    sun: `<svg class="icon icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    moon: `<svg class="icon icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bars: `<svg class="icon icon-bars" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    close: `<svg class="icon icon-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
  };

  function updateIcons(theme) {
    const icon = theme === 'dark' ? ICONS.sun : ICONS.moon;
    const desktopBtn = document.getElementById('themeToggle');
    const mobileBtn = document.getElementById('themeToggleMobile');
    if (desktopBtn) desktopBtn.innerHTML = icon;
    if (mobileBtn) mobileBtn.innerHTML = icon;
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* noop */ }
    updateIcons(theme);
    // Update theme-color meta for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0A0A0B' : '#FAFAF9';
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

  // ==================== MOBILE NAV ====================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? ICONS.close : ICONS.bars;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = ICONS.bars;
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = ICONS.bars;
        document.body.style.overflow = '';
      }
    });
  }

  // ==================== ACTIVE SECTION HIGHLIGHT ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  if (sections.length && navLinkEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.style.color = link.getAttribute('href') === '#' + id
              ? 'var(--text-1)'
              : '';
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(s => observer.observe(s));
  }

  // ==================== SCROLL FADE-IN ANIMATION ====================
  const fadeEls = document.querySelectorAll('.system-card, .section-header, .about-text, .experience-item, .contact-text');
  if (fadeEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      fadeObserver.observe(el);
    });
  }
});
