// ==================== THEME ====================
(function initTheme() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  const ICONS = {
    sun: '<svg class="icon icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    moon: '<svg class="icon icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bars: '<svg class="icon icon-bars" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    close: '<svg class="icon icon-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
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
    try { localStorage.setItem('theme', theme); } catch (e) {}
    updateIcons(theme);
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

    navLinks.querySelectorAll('.nav-link, .nav-resume').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = ICONS.bars;
        document.body.style.overflow = '';
      });
    });

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
            const isActive = link.getAttribute('href') === '#' + id;
            link.style.color = isActive ? 'var(--text-1)' : '';
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

  // ==================== REVEAL ANIMATIONS ====================
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // ==================== MOBILE CTA BAR ====================
  const mobileCta = document.getElementById('mobileCtaBar');
  const heroSection = document.getElementById('home');
  const contactSection = document.getElementById('contact');

  if (mobileCta && heroSection && contactSection) {
    let heroPassed = false;
    let contactVisible = false;

    function updateCtaVisibility() {
      if (heroPassed && !contactVisible) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroPassed = !entry.isIntersecting;
      updateCtaVisibility();
    }, { threshold: 0 });
    heroObserver.observe(heroSection);

    const contactObserver = new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      updateCtaVisibility();
    }, { threshold: 0.2 });
    contactObserver.observe(contactSection);
  }

  // ==================== EASTER EGG TERMINAL ====================
  const overlay = document.getElementById('easterEggOverlay');
  const eeBody = document.getElementById('easterEggBody');
  const eeInput = document.getElementById('easterEggInput');
  const eeClose = document.getElementById('easterEggClose');

  if (overlay && eeBody && eeInput) {
    // Konami code sequence
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          openTerminal();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = e.keyCode === konamiCode[0] ? 1 : 0;
      }
    });

    function openTerminal() {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      eeInput.focus();
    }

    function closeTerminal() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      eeInput.value = '';
    }

    if (eeClose) eeClose.addEventListener('click', closeTerminal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTerminal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeTerminal();
    });

    const COMMANDS = {
      help: function() {
        return [
          'Available commands:',
          '  whoami      — who I am',
          '  skills      — tech stack',
          '  projects    — what I\'ve built',
          '  philosophy  — engineering values',
          '  contact     — how to reach me',
          '  secret      — ???',
          '  clear       — clear terminal',
          '  exit        — close terminal'
        ].join('\n');
      },
      whoami: function() {
        return 'Shubham Bhattacharya\nAgentic AI & Backend Engineer — Vadodara, India\nBuilding autonomous agents, retrieval pipelines, and production APIs.';
      },
      skills: function() {
        return [
          'Runtime      Node.js, Python',
          'Language     TypeScript, JavaScript',
          'AI/Agents    LangGraph.js, Multi-Provider LLM, Tool Calling',
          'Retrieval    pgvector, RAG, Semantic Search, Reranking',
          'Database     PostgreSQL, Redis, MongoDB',
          'Queue        BullMQ, Redis Streams',
          'Observ.      Langfuse, OpenTelemetry, Sentry, Pino',
          'Auth         Clerk, JWT, Zod',
          'Infra        Docker, AWS, Vercel'
        ].join('\n');
      },
      projects: function() {
        return [
          '1. Gigi AI Ops       — Production agentic AI backend (LangGraph.js)',
          '   github.com/shubhambhattacharya-dev/Agentic_Project',
          '',
          '2. Medo Copilot      — Multi-provider AI auditor with vision',
          '3. DocNow            — Telemedicine platform with video & payments',
          '4. Session-Secure    — HMAC-signed context injection middleware'
        ].join('\n');
      },
      philosophy: function() {
        return '"Treat every AI output as untrusted input."\n\nDeterministic agent control. Multi-provider resilience.\nValidation at boundaries. CPU safety. Budget guards. Human-in-the-loop.';
      },
      contact: function() {
        return [
          'Email     shubhambhattacharya107@gmail.com',
          'GitHub    github.com/shubhambhattacharya-dev',
          'LinkedIn  linkedin.com/in/shubhambhattadev',
          'X         @Shubham_level'
        ].join('\n');
      },
      secret: function() {
        return 'You found the secret terminal. Most visitors never get here.\nThat curiosity is exactly what makes a good engineer.';
      },
      clear: function() {
        eeBody.innerHTML = '';
        return null;
      },
      exit: function() {
        closeTerminal();
        return null;
      }
    };

    function handleCommand(input) {
      const cmd = input.trim().toLowerCase();

      // Echo the command
      const echoEl = document.createElement('div');
      echoEl.className = 'easter-egg-output';
      echoEl.innerHTML = '<span class="ee-prompt">visitor@shubham:~$</span> <span class="ee-cmd">' + escapeHtml(input) + '</span>';
      eeBody.appendChild(echoEl);

      if (!cmd) return;

      let output;
      if (COMMANDS[cmd]) {
        output = COMMANDS[cmd]();
      } else {
        output = 'Command not found: ' + escapeHtml(cmd) + '\nType "help" for available commands.';
        const outputEl = document.createElement('div');
        outputEl.className = 'easter-egg-output ee-error';
        outputEl.textContent = output;
        eeBody.appendChild(outputEl);
        return;
      }

      if (output !== null) {
        const outputEl = document.createElement('div');
        outputEl.className = 'easter-egg-output';
        outputEl.textContent = output;
        eeBody.appendChild(outputEl);
      }

      eeBody.scrollTop = eeBody.scrollHeight;
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    eeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleCommand(eeInput.value);
        eeInput.value = '';
      }
    });
  }
});