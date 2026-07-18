// ============================================================
// Shared HTML template for CTF endpoint interfaces
// Matches the main portfolio's design system:
//   Fonts: Orbitron (display), JetBrains Mono (code), Space Grotesk (body)
//   Colors: cyber-black #050505, green #00ff41, cyan #00f0ff, 
//           magenta #ff2d55, amber #ffb000, purple #b900ff
//   FX: noise overlay, scanlines, grid, vignette, glitch, pulse glow
// ============================================================

const CTF_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

:root {
  --c-black: #050505;
  --c-dark: #0a0f0a;
  --c-surface: #111611;
  --c-green: #00ff41;
  --c-cyan: #00f0ff;
  --c-magenta: #ff2d55;
  --c-amber: #ffb000;
  --c-purple: #b900ff;
  --c-muted: #1a1a2e;
  --font-display: 'Orbitron', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Space Grotesk', sans-serif;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--c-black);
  color: #c0c0c0;
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* ── Overlays matching main portfolio ── */
.noise-overlay {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
}
.scanline-overlay {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px);
}
.grid-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
.vignette {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%);
}
.scan-line-moving {
  position: fixed; left: 0; right: 0; height: 2px; z-index: 2; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(0,255,65,0.15), transparent);
  animation: scan-move 8s linear infinite;
}
@keyframes scan-move { 0% { top: -2px; } 100% { top: 100vh; } }

/* ── Content ── */
.page-content { position: relative; z-index: 5; }
.container { max-width: 960px; margin: 0 auto; padding: 48px 24px 72px; }

/* ── Typography ── */
h1 {
  font-family: var(--font-display);
  font-size: 28px; font-weight: 800;
  letter-spacing: 4px;
  color: var(--c-green);
  text-shadow: 0 0 20px rgba(0,255,65,0.3), 0 0 40px rgba(0,255,65,0.1);
  animation: glitch 3s infinite;
}
.subtitle {
  font-family: var(--font-mono);
  color: #444; font-size: 11px;
  letter-spacing: 3px; margin-bottom: 32px;
}
h2 {
  font-family: var(--font-display);
  font-size: 11px; font-weight: 600;
  color: #666; letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

/* ── Cards ── */
.card {
  background: rgba(17,22,17,0.8);
  border: 1px solid rgba(0,255,65,0.08);
  padding: 24px; margin-bottom: 16px;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s;
}
.card:hover { border-color: rgba(0,255,65,0.2); }
.card.classified {
  background: rgba(30,5,5,0.9);
  border-color: rgba(255,45,85,0.25);
}
.card.classified:hover { border-color: rgba(255,45,85,0.5); }

/* ── Navigation ── */
.nav { display: flex; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; }
.nav a {
  font-family: var(--font-display);
  color: #555; text-decoration: none;
  font-size: 10px; letter-spacing: 2px; font-weight: 600;
  padding: 8px 16px;
  border: 1px solid #1a1a1a;
  transition: all 0.3s;
}
.nav a:hover { color: var(--c-green); border-color: var(--c-green); box-shadow: 0 0 10px rgba(0,255,65,0.1); }
.nav a.active { color: var(--c-green); border-color: var(--c-green); background: rgba(0,255,65,0.05); }

/* ── Forms ── */
label {
  display: block; font-family: var(--font-display);
  color: #555; font-size: 10px;
  letter-spacing: 2px; font-weight: 600;
  margin-bottom: 8px; text-transform: uppercase;
}
input[type="text"], input[type="password"] {
  width: 100%; background: rgba(5,5,5,0.8);
  border: 1px solid rgba(0,255,65,0.1);
  color: #e0e0e0; padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: 13px; margin-bottom: 18px;
  outline: none; transition: all 0.3s;
}
input:focus { border-color: var(--c-green); box-shadow: 0 0 15px rgba(0,255,65,0.1); }
input::placeholder { color: #333; }
select {
  width: 100%; background: rgba(5,5,5,0.8);
  border: 1px solid rgba(0,255,65,0.1);
  color: #e0e0e0; padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: 13px; margin-bottom: 18px;
  outline: none; cursor: pointer;
}
button, .btn {
  display: inline-block; background: transparent;
  border: 1px solid var(--c-green);
  color: var(--c-green); padding: 10px 28px;
  font-family: var(--font-display);
  font-size: 10px; font-weight: 700;
  letter-spacing: 3px; cursor: pointer;
  text-transform: uppercase; text-decoration: none;
  transition: all 0.3s;
}
button:hover, .btn:hover {
  background: var(--c-green); color: var(--c-black);
  box-shadow: 0 0 20px rgba(0,255,65,0.3), 0 0 40px rgba(0,255,65,0.1);
}

/* ── Tables ── */
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left; font-family: var(--font-display);
  color: #555; font-size: 9px;
  letter-spacing: 2px; font-weight: 600;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(0,255,65,0.08);
}
td {
  font-family: var(--font-mono);
  color: #777; font-size: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

/* ── Status indicators ── */
.status { font-family: var(--font-mono); font-size: 12px; }
.status-online { color: var(--c-green); }
.status-warning { color: var(--c-amber); }
.status-error { color: var(--c-magenta); }
.error { color: var(--c-magenta); font-family: var(--font-mono); }
.success { color: var(--c-green); font-family: var(--font-mono); }
.warning { color: var(--c-amber); font-family: var(--font-mono); }

/* ── Badges ── */
.badge {
  display: inline-block; font-family: var(--font-display);
  font-size: 8px; font-weight: 700;
  padding: 3px 10px; letter-spacing: 2px;
  border: 1px solid;
}
.badge-omega { color: var(--c-magenta); border-color: var(--c-magenta); background: rgba(255,45,85,0.05); }
.badge-high { color: var(--c-amber); border-color: var(--c-amber); background: rgba(255,176,0,0.05); }
.badge-medium { color: var(--c-cyan); border-color: var(--c-cyan); background: rgba(0,240,255,0.05); }
.badge-low { color: var(--c-green); border-color: var(--c-green); background: rgba(0,255,65,0.05); }
.badge-public { color: var(--c-green); border-color: var(--c-green); background: rgba(0,255,65,0.05); }

/* ── Hints & subtle text ── */
.hint { color: #2a2a2a; font-family: var(--font-mono); font-size: 10px; margin-top: 10px; }
.meta { color: #333; font-family: var(--font-mono); font-size: 10px; }

/* ── Result blocks ── */
.result {
  background: rgba(5,5,5,0.6);
  border: 1px solid rgba(0,255,65,0.06);
  padding: 16px; margin-top: 12px;
  font-family: var(--font-mono); font-size: 12px;
}
.result pre { white-space: pre-wrap; word-break: break-all; color: #666; }

/* ── Links ── */
a { color: var(--c-green); transition: all 0.3s; }
a:hover { color: #fff; text-shadow: 0 0 10px rgba(0,255,65,0.3); }
a.link-amber { color: var(--c-amber); }
a.link-amber:hover { color: #ffd060; text-shadow: 0 0 10px rgba(255,176,0,0.3); }
a.link-magenta { color: var(--c-magenta); }
a.link-magenta:hover { color: #ff6080; text-shadow: 0 0 10px rgba(255,45,85,0.3); }

/* ── Footer ── */
.footer {
  margin-top: 48px; padding-top: 24px;
  border-top: 1px solid rgba(0,255,65,0.05);
  text-align: center;
}
.footer a {
  color: #333; font-family: var(--font-display);
  font-size: 9px; letter-spacing: 3px;
  text-decoration: none; font-weight: 600;
}
.footer a:hover { color: var(--c-green); }

/* ── Animations ── */
@keyframes glitch {
  0%, 90%, 100% { text-shadow: 2px 0 var(--c-magenta), -2px 0 var(--c-cyan); }
  91% { text-shadow: -2px 0 var(--c-magenta), 2px 0 var(--c-cyan); transform: translate(-1px, 1px); }
  93% { text-shadow: 2px 0 var(--c-magenta), -2px 0 var(--c-cyan); transform: translate(1px, -1px); }
  95% { text-shadow: -1px 0 var(--c-magenta), 1px 0 var(--c-cyan); transform: translate(-1px, 1px); }
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.5s ease-out; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.blink { animation: blink 1s step-end infinite; }

/* ── Data stream accent ── */
.data-stream {
  position: fixed; width: 1px; height: 100px;
  background: linear-gradient(transparent, var(--c-green), transparent);
  opacity: 0.06; z-index: 0;
  animation: data-fall 4s linear infinite;
}
@keyframes data-fall { 0% { top: -100px; } 100% { top: 100vh; } }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--c-black); }
::-webkit-scrollbar-thumb { background: rgba(0,255,65,0.15); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,255,65,0.3); }
<!-- Bruteforcing is not always wrong(rockyou.txt) -->
`;

/**
 * Wraps content in a full HTML page with portfolio-matching theme
 * @param {string} title - Page title
 * @param {string} body - HTML body content
 * @param {object} [opts] - Options 
 * @param {string} [opts.accentColor] - Override accent color (green/amber/magenta/cyan)
 * @param {object} [opts.headers] - Extra response headers
 */
export function ctfHtmlPage(title, body, opts = {}) {
    const dataStreams = [8, 22, 38, 55, 72, 88].map((left, i) =>
        `<div class="data-stream" style="left:${left}%;animation-delay:${i * 0.6}s"></div>`
    ).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${title} - GhostOps</title>
    <style>${CTF_CSS}</style>
</head>
<body>
    <div class="noise-overlay"></div>
    <div class="scanline-overlay"></div>
    <div class="scan-line-moving"></div>
    <div class="grid-bg"></div>
    <div class="vignette"></div>
    ${dataStreams}
    <div class="page-content">
        ${body}
    </div>
</body>
</html>`;

    const responseHeaders = {
        'Content-Type': 'text/html; charset=utf-8',
        ...(opts.headers || {}),
    };

    return new Response(html, { headers: responseHeaders });
}
