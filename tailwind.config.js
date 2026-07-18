/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    black: '#050505',
                    dark: '#0a0f0a',
                    surface: '#111611',
                    green: '#00ff41',
                    cyan: '#00f0ff',
                    magenta: '#ff2d55',
                    amber: '#ffb000',
                    purple: '#b900ff',
                    muted: '#1a1a2e',
                },
            },
            fontFamily: {
                display: ['var(--font-orbitron)', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
                body: ['var(--font-space)', 'sans-serif'],
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'scan-line': 'scan-line 8s linear infinite',
                'flicker': 'flicker 0.15s infinite',
                'blink': 'blink 1s step-end infinite',
                'float': 'float 6s ease-in-out infinite',
                'glitch': 'glitch 3s infinite',
                'data-stream': 'data-stream 4s linear infinite',
                'decrypt': 'decrypt 0.05s linear',
                'slide-up': 'slide-up 0.6s ease-out',
                'fade-in': 'fade-in 0.8s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,65,0.3), 0 0 10px rgba(0,255,65,0.2)' },
                    '50%': { boxShadow: '0 0 15px rgba(0,255,65,0.5), 0 0 30px rgba(0,255,65,0.3), 0 0 45px rgba(0,240,255,0.1)' },
                },
                'scan-line': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'flicker': {
                    '0%': { opacity: '0.97' },
                    '50%': { opacity: '1' },
                    '100%': { opacity: '0.98' },
                },
                'blink': {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'glitch': {
                    '0%, 90%, 100%': { transform: 'translate(0)', textShadow: '2px 0 #ff2d55, -2px 0 #00f0ff' },
                    '91%': { transform: 'translate(-2px, 1px)', textShadow: '-2px 0 #ff2d55, 2px 0 #00f0ff' },
                    '93%': { transform: 'translate(2px, -1px)', textShadow: '2px 0 #ff2d55, -2px 0 #00f0ff' },
                    '95%': { transform: 'translate(-1px, 2px)', textShadow: '-1px 0 #ff2d55, 1px 0 #00f0ff' },
                },
                'data-stream': {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { transform: 'translateY(100vh)', opacity: '0' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            backgroundImage: {
                'grid-pattern': `linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), 
                         linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)`,
                'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            },
            backgroundSize: {
                'grid': '60px 60px',
            },
        },
    },
    plugins: [],
};
