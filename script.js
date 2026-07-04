/* ============================================================
   Portfolio JS — Shubham Bhattacharya, Backend Developer Intern
   ============================================================ */

/* ---------- 1. THEME IIFE (runs before DOMContentLoaded) ---------- */
(() => {
  const saved = localStorage.getItem('theme');
  const preferred = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', preferred);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', preferred === 'dark' ? '#0B0D10' : '#fafafa');
})();

/* ---------- Everything else waits for DOM ---------- */
document.addEventListener('DOMContentLoaded', () => {

  /* -------- SVG icon helpers -------- */
  const icons = {
    sun:   '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon:  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    bars:  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };

  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     2. THEME TOGGLE
     ============================================================ */
  const themeDesktop = document.getElementById('themeToggle');
  const themeMobile  = document.getElementById('themeToggleMobile');
  const themeMeta    = document.querySelector('meta[name="theme-color"]');

  const setThemeIcon = (btn, theme) => {
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? icons.sun : icons.moon;
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0B0D10' : '#fafafa');
    setThemeIcon(themeDesktop, theme);
    setThemeIcon(themeMobile, theme);
  };

  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  // Initialise icons for current theme
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  if (themeDesktop) themeDesktop.addEventListener('click', toggleTheme);
  if (themeMobile)  themeMobile.addEventListener('click', toggleTheme);

  /* ============================================================
     3. MOBILE NAVIGATION
     ============================================================ */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks     = document.getElementById('navLinks');

  const openNav = () => {
    if (!navLinks || !mobileToggle) return;
    navLinks.classList.add('open');
    mobileToggle.innerHTML = icons.close;
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    if (!navLinks || !mobileToggle) return;
    navLinks.classList.remove('open');
    mobileToggle.innerHTML = icons.bars;
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.innerHTML = icons.bars;
    mobileToggle.addEventListener('click', () => {
      navLinks?.classList.contains('open') ? closeNav() : openNav();
    });
  }

  // Close on link click
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('open')) closeNav();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle?.contains(e.target)) {
      closeNav();
    }
  });

  /* ============================================================
     4. ACTIVE SECTION HIGHLIGHTING
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (sections.length && allNavLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const id = target.getAttribute('id');
        allNavLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
          link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ============================================================
     5. SCROLL PROGRESS BAR
     ============================================================ */
  const scrollProgress = document.getElementById('scrollProgress');

  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      scrollProgress.style.width = `${Math.min(pct, 100)}%`;
    }, { passive: true });
  }

  /* ============================================================
     6. REVEAL ANIMATIONS
     ============================================================ */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          // Stagger siblings
          const parent = target.parentElement;
          const siblings = parent ? [...parent.querySelectorAll('.reveal')] : [target];
          const idx = siblings.indexOf(target);
          setTimeout(() => target.classList.add('revealed'), idx * 80);
          obs.unobserve(target);
        });
      }, { threshold: 0.1 });

      reveals.forEach(el => revealObserver.observe(el));
    }
  }

  /* ============================================================
     7. MOBILE CTA BAR
     ============================================================ */
  const mobileCtaBar  = document.getElementById('mobileCtaBar');
  const homeSection   = document.getElementById('home');
  const contactSection = document.getElementById('contact');

  if (mobileCtaBar) {
    let pastHome = false, inContact = false;
    const updateCta = () => mobileCtaBar.classList.toggle('visible', pastHome && !inContact);

    if (homeSection) {
      new IntersectionObserver(([e]) => { pastHome = !e.isIntersecting; updateCta(); },
        { threshold: 0 }).observe(homeSection);
    }
    if (contactSection) {
      new IntersectionObserver(([e]) => { inContact = e.isIntersecting; updateCta(); },
        { threshold: 0.2 }).observe(contactSection);
    }
  }

  /* ============================================================
     8. HERO TERMINAL TYPING EFFECT
     ============================================================ */
  const heroTerminal = document.querySelector('.hero-terminal');

  if (heroTerminal) {
    const lines = heroTerminal.querySelectorAll('.terminal-line');
    let started = false;

    const animateTerminal = () => {
      if (started) return;
      started = true;

      let delay = 0;
      lines.forEach((line) => {
        const output = line.nextElementSibling?.classList.contains('terminal-output')
          ? line.nextElementSibling : null;

        // Hide initially
        line.style.opacity = '0';
        if (output) output.style.opacity = '0';

        const typeDelay = 300 + Math.random() * 400;

        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transition = 'opacity 0.3s ease';
          if (output) {
            setTimeout(() => {
              output.style.opacity = '1';
              output.style.transition = 'opacity 0.4s ease';
            }, typeDelay);
          }
        }, delay);

        delay += typeDelay + 500;
      });
    };

    if (prefersReducedMotion) {
      lines.forEach(l => { l.style.opacity = '1'; const o = l.nextElementSibling; if (o?.classList.contains('terminal-output')) o.style.opacity = '1'; });
    } else {
      new IntersectionObserver(([e], obs) => {
        if (e.isIntersecting) { animateTerminal(); obs.unobserve(heroTerminal); }
      }, { threshold: 0.3 }).observe(heroTerminal);
    }
  }

  /* ============================================================
     9. EASTER EGG TERMINAL (Konami Code)
     ============================================================ */
  const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIdx = 0;

  const overlay  = document.getElementById('easterEggOverlay');
  const eeInput  = document.getElementById('easterEggInput');
  const eeBody   = document.getElementById('easterEggBody');
  const eeClose  = document.getElementById('easterEggClose');

  const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const commands = {
    help: () =>
      `Available commands:\n  help        — Show this message\n  whoami      — About me\n  skills      — Tech stack\n  projects    — Featured work\n  philosophy  — Engineering values\n  contact     — Get in touch\n  secret      — ???\n  clear       — Clear terminal\n  exit        — Close terminal`,
    whoami: () =>
      `Shubham Bhattacharya\nBackend Developer Intern — Vadodara, India\nBCA Final Year at Parul University (CGPA 8.13)\nBuilding agentic backend systems with Node.js, TypeScript, PostgreSQL, and Python.`,
    skills: () =>
      `Languages    TypeScript, JavaScript (Node.js), Python, SQL\nBackend      Express.js, Next.js, FastAPI, REST APIs, Middleware, SSE, WebSockets, Rate Limiting, Clerk Auth\nAI/LLM       Custom ReAct Loops, Tool Registry, Multi-Model Routing, Prompt Injection Protection, LangGraph, MCP, tiktoken Cost Estimation, LLM Observability\nDatabase     PostgreSQL, Prisma ORM, Redis, BullMQ, MongoDB\nObserv.      Zod Schema Validation, Sentry Error Tracking, Pino Structured Logging\nTesting      Vitest, Supertest, Playwright, GitHub Actions\nInfra        Docker Compose, Vercel`,
    projects: () =>
      `1. Gigi AI Ops       — Agentic E-commerce Backend\n   github.com/shubhambhattacharya-dev/Agentic_Project\n\n2. Medo Copilot      — Multi-Provider AI Audit Platform\n   github.com/shubhambhattacharya-dev/Medo_Copilot\n\n3. DocNow            — Telemedicine SaaS Platform\n   github.com/shubhambhattacharya-dev/health`,
    philosophy: () =>
      `"Treat every AI output as untrusted input."\n\nSchema validation at every boundary. Multi-provider resilience.\nStructured logging. Cost governance. Human-in-the-loop safeguards.`,
    contact: () =>
      `Email     shubhambhattacharya107@gmail.com\nGitHub    github.com/shubhambhattacharya-dev\nLinkedIn  linkedin.com/in/shubhambhattadev\nX         x.com/Shubham_level`,
    secret: () =>
      `🎉 You found the hidden terminal!\nYou clearly have the curiosity of a great developer.\nHere's a cookie: 🍪  (it's not tracked, I promise)`,
    clear: () => '__CLEAR__',
    exit:  () => '__EXIT__',
  };

  const appendOutput = (text, isCmd = false) => {
    if (!eeBody) return;
    const div = document.createElement('div');
    div.style.whiteSpace = 'pre-wrap';
    div.style.marginBottom = '0.5rem';
    if (isCmd) {
      div.innerHTML = `<span style="color:var(--accent)">❯</span> ${escapeHtml(text)}`;
    } else {
      div.textContent = text;
      div.style.color = 'var(--text-secondary, #9ca3af)';
    }
    eeBody.appendChild(div);
    eeBody.scrollTop = eeBody.scrollHeight;
  };

  const handleCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    appendOutput(raw, true);

    if (commands[cmd]) {
      const result = commands[cmd]();
      if (result === '__CLEAR__') { if (eeBody) eeBody.innerHTML = ''; return; }
      if (result === '__EXIT__')  { closeEasterEgg(); return; }
      appendOutput(result);
    } else {
      appendOutput(`Command not found: ${cmd}. Type "help" for available commands.`);
    }
  };

  const openEasterEgg = () => {
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (eeBody) eeBody.innerHTML = '';
    appendOutput('Welcome to the secret terminal. Type "help" to begin.');
    setTimeout(() => eeInput?.focus(), 100);
  };

  const closeEasterEgg = () => {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    konamiIdx = 0;
  };

  // Konami listener
  document.addEventListener('keydown', (e) => {
    if (overlay?.classList.contains('active')) return;          // ignore while open
    if (e.keyCode === KONAMI[konamiIdx]) { konamiIdx++; } else { konamiIdx = 0; }
    if (konamiIdx === KONAMI.length) { konamiIdx = 0; openEasterEgg(); }
  });

  // Input handler
  eeInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { handleCommand(eeInput.value); eeInput.value = ''; }
    if (e.key === 'Escape') closeEasterEgg();
  });

  // Close handlers
  eeClose?.addEventListener('click', closeEasterEgg);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeEasterEgg(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('active')) closeEasterEgg();
  });

  /* ============================================================
     10. SMOOTH SCROLL (anchor edge-case fallback)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ============================================================
     11. COUNTER ANIMATION (stat numbers)
     ============================================================ */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    const animateCounter = (el) => {
      const end = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(end)) return;
      const duration = 1500;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);           // ease-out cubic
        el.textContent = Math.round(eased * end);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        animateCounter(target);
        obs.unobserve(target);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

}); /* end DOMContentLoaded */
