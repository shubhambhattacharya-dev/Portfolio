# Portfolio Website

Personal portfolio showcasing backend development projects and skills.

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- Font Awesome 6.4
- Google Fonts (Space Grotesk, Fira Code)

## Features

- Fully responsive design
- Dark/light theme toggle with localStorage
- Smooth scroll animations
- Single page navigation
- SEO optimized with meta tags and structured data
- Accessibility compliant (WCAG 2.1)
- Zero dependencies

## Quick Start

```bash
# Clone the repo
git clone https://github.com/shubhambhattacharya-dev/portfolio.git

# Open index.html in browser
```

Or run a local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

## File Structure

```
portfolio/
├── index.html          # Main HTML
├── style.css           # Styles
├── script.js           # JavaScript
├── img/                # Images
└── resume/             # Resume PDF
```

## Customization

**Update personal info** in `index.html`:
- Meta tags (title, description)
- Hero section (name, bio)
- Projects
- Contact email

**Change colors** in `style.css`:
```css
:root {
  --bg-primary-dark: #121212;
  --accent-primary-dark: #FFFFFF;
}
```

**Modify typing text** in `script.js`:
```javascript
new TypingEffect($('#hero-subtitle-text'), [
  'Your text here.',
  'Another line.'
]);
```

## Deployment

**GitHub Pages:**
1. Push code to GitHub
2. Settings → Pages → Select branch → Save

**Netlify:**
1. Connect GitHub repo
2. Deploy

**Vercel:**
```bash
vercel --prod
```

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

MIT License - feel free to use for your own portfolio.

## Contact

- Email: shubhambhattacharya107@gmail.com
- GitHub: [shubhambhattacharya-dev](https://github.com/shubhambhattacharya-dev)
- LinkedIn: [shubhambhattadev](https://www.linkedin.com/in/shubhambhattadev/)
- Twitter: [@Shubham_level](https://x.com/Shubham_level)
