import './globals.css';
import { Orbitron, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

const orbitron = Orbitron({
    subsets: ['latin'],
    variable: '--font-orbitron',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800', '900'],
});

const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
});

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#00ff41',
};

export const metadata = {
    title: 'RAKESH R K - Offensive Architect',
    description: 'Cybersecurity portfolio of Rakesh R K. Vulnerability researcher, CTF player, and creative developer at PES University specializing in offensive security, AI-driven pentesting, and stealth systems.',
    keywords: ['cybersecurity', 'portfolio', 'penetration testing', 'CTF', 'Rakesh R K', 'PES University', 'offensive security', 'red team', 'Next.js'],
    authors: [{ name: 'Rakesh R K', url: 'https://github.com/Rakesh-R-K' }],
    creator: 'Rakesh R K',
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.svg',
    },
    openGraph: {
        title: 'RAKESH R K - Offensive Architect',
        description: 'Cybersecurity portfolio. 25+ projects from AI pentesting to DNS tunneling. PES University, 6th Sem CSE.',
        type: 'website',
        locale: 'en_US',
        siteName: 'Rakesh R K Portfolio',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RAKESH R K - Offensive Architect',
        description: 'Cybersecurity portfolio. Vulnerability researcher & creative developer building offensive security tools.',
        creator: '@RakeshR71871260',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${orbitron.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
            <body className="bg-cyber-black text-gray-200 antialiased">
                {/* Ambient overlays - kept deliberately quiet so content leads */}
                <div className="noise-overlay" aria-hidden="true" />
                <div className="scanline-overlay" aria-hidden="true" />
                <div className="grid-bg" aria-hidden="true" />
                <div className="vignette" aria-hidden="true" />

                {/* Main content */}
                <div className="relative z-10">
                    {children}
                </div>
            </body>
        </html>
    );
}
