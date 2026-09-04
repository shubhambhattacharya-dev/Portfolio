# Portfolio Website

Personal portfolio showcasing GenAI, LLM application engineering, and TypeScript systems.

**Live:** [shubhambhattacharya.dev](https://shubhambhattacharya.dev)

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- Google Fonts (IBM Plex Sans, JetBrains Mono)
- Inline SVGs (no icon libraries)

## Features

- Fully responsive design (mobile, tablet, desktop)
- Dark/light theme toggle with localStorage persistence
- Scroll-triggered reveal animations
- Active section highlighting via IntersectionObserver
- SEO optimized with Open Graph, Twitter Cards, JSON-LD structured data
- Accessibility compliant (skip link, ARIA attributes, reduced motion support)
- Easter egg terminal (Konami code)
- Mobile CTA bar
- Zero dependencies

## Quick Start

```bash
# Clone the repo
git clone https://github.com/shubhambhattacharya-dev/Portfolio.git

# Open index.html in browser
```

Or run a local server:
```bash
npx serve .
# Visit http://localhost:3000
```

## File Structure

```
Portfolio/
├── index.html          # Main HTML (single page)
├── style.css           # All styles (CSS variables, responsive)
├── script.js           # Theme, nav, animations, easter egg
├── robots.txt          # Crawler directives
├── sitemap.xml         # Sitemap for search engines
├── img/                # Images (profile, project previews)
├── resume/             # Resume PDF
└── .github/workflows/  # GitHub Pages deployment
```

## Customization

**Update personal info** in `index.html`:
- Meta tags (title, description, OG image)
- Hero section (name, tagline, status)
- Projects, stack, journey sections
- Contact email and social links

**Change colors** in `style.css`:
```css
:root {
  --accent: #D4A853;
  --accent-hover: #E0B96A;
  --success: #3ECF8E;
}
```

**Change fonts** in `style.css`:
```css
:root {
  --font-body: 'IBM Plex Sans', system-ui, sans-serif;
  --font-heading: 'JetBrains Mono', ui-monospace, monospace;
}
```

## Deployment

**GitHub Pages (auto-deploy):**
Push to `main` branch — GitHub Actions deploys automatically.

**Manual setup:**
1. Settings → Pages → Source: GitHub Actions
2. Push to `main` branch

**Netlify / Vercel:**
Connect the GitHub repo and deploy.

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

MIT License - feel free to use for your own portfolio.

## Contact

- Email: shubhambhattacharya107@gmail.com
- GitHub: [shubhambhattacharya-dev](https://github.com/shubhambhattacharya-dev)
- LinkedIn: [shubhambhattadev](https://www.linkedin.com/in/shubhambhattadev/)
- X: [@Shubham_level](https://x.com/Shubham_level)
