# RAKESH R K - Offensive Architect

<div align="center">

**Personal portfolio built for a cybersecurity enthusiast, creative developer, and CTF competitor.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## ⚡ Overview

A cyberpunk-themed portfolio featuring 18+ interactive sections, a persistent hacker terminal, 3D visuals, and enough Easter eggs to keep recruiters clicking. Built with **Next.js 14**, **React**, **Tailwind CSS**, **Framer Motion**, **Three.js**, and **GSAP**.

## 🎯 Key Features

| Category | Features |
|----------|----------|
| **Core** | Boot sequence, 3D wireframe scene, Matrix code rain, stock ticker, magnetic cursor |
| **Interactive** | Persistent terminal (25 commands), port knocking, DNS tunnel viz, typing challenges |
| **Data** | GitHub stats dashboard, contribution heatmap, skill radar chart, code showcase |
| **Sections** | About, Timeline, Projects (9 detailed), Credentials, Testimonials, Contact |
| **Polish** | Command Palette (⌘K), visitor counter, ambient sound, page transitions, back-to-top |
| **SEO/PWA** | Sitemap, robots.txt, OG/Twitter cards, PWA manifest, viewport meta |

## 🛠️ Tech Stack

```
Frontend      → Next.js 14, React 18, Tailwind CSS
Animation     → Framer Motion, GSAP
3D Graphics   → Three.js, React Three Fiber
Audio         → Web Audio API
Build         → 15 pages, ~76 kB main, 0 errors
```

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Rakesh-R-K/Portfolio.git
cd Portfolio

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build && npm start
```

## 📁 Project Structure

```
├── app/
│   ├── page.js              # Main page (18+ sections)
│   ├── layout.js             # Root layout + metadata
│   ├── not-found.js           # Animated 404
│   ├── sitemap.js             # Auto-generated sitemap
│   ├── robots.js              # Crawler config
│   └── projects/[slug]/       # Dynamic project pages
├── components/
│   ├── HeroSection.jsx        # Hero + 3D scene
│   ├── Terminal.jsx           # Interactive terminal (25 cmds)
│   ├── ProjectCard.jsx        # 3D tilt cards
│   ├── SkillRadar.jsx         # SVG radar chart
│   ├── CodeShowcase.jsx       # Fake IDE with real code
│   ├── CommandPalette.jsx     # ⌘K quick navigation
│   └── ... (34 components)
├── data/
│   └── profile.js             # All content data
└── public/
    └── manifest.json           # PWA config
```

## 🎮 Terminal Commands

Open the terminal and try: `help`, `whoami`, `ls`, `cat about.txt`, `nmap portfolio.rakesh.dev`, `cat /etc/shadow`, `fortune`, `rickroll`, `uptime`, `ifconfig`, `uname -a`, and more.

## 🔑 Hidden Features

- **Konami Code** → ↑↑↓↓←→←→BA
- **Ghost Mode** → Toggle site visibility
- **Command Palette** → Ctrl/Cmd + K
- **Port Knocking** → Find the right sequence
- **Dissolve** → Type `dissolve` in terminal

## 📄 License

MIT © [Rakesh R K](https://github.com/Rakesh-R-K)
