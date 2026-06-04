// ==================== THEME ====================
(function initTheme() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* noop */ }
  const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const desktopBtn = document.getElementById('themeToggle');
  const desktopIcon = document.getElementById('themeIcon');
  const mobileBtn = document.getElementById('themeToggleMobile');
  const mobileIcon = document.getElementById('themeIconMobile');

  function updateIcons(theme) {
    const cls = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    if (desktopIcon) desktopIcon.className = 'fas ' + cls;
    if (mobileIcon) mobileIcon.className = 'fas ' + cls;
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

  if (desktopBtn) desktopBtn.addEventListener('click', toggle);
  if (mobileBtn) mobileBtn.addEventListener('click', toggle);

  updateIcons(html.getAttribute('data-theme'));

  // ==================== MOBILE NAV ====================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileIconEl = document.getElementById('mobileIcon');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      if (mobileIconEl) {
        mobileIconEl.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (mobileIconEl) mobileIconEl.className = 'fas fa-bars';
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (mobileIconEl) mobileIconEl.className = 'fas fa-bars';
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
});