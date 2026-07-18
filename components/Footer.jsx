'use client';

import { profile } from '@/data/profile';

const nav = [
    { label: 'ABOUT', href: '#about' },
    { label: 'OPERATIONS', href: '#projects' },
    { label: 'CTF LOG', href: '#ctf-history' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'CONTACT', href: '#contact' },
];

const social = [
    { label: 'GITHUB', url: profile.links.github },
    { label: 'LINKEDIN', url: profile.links.linkedin },
    { label: 'MEDIUM', url: profile.links.medium },
    { label: 'X / TWITTER', url: profile.links.twitter },
];

export default function Footer() {
    return (
        <footer className="relative border-t border-white/[0.06] px-6 sm:px-10 lg:px-20 pt-16 pb-8">
            <div className="max-w-6xl mx-auto">
                {/* Top: wordmark + nav */}
                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 mb-14">
                    <div>
                        <p className="font-display text-3xl sm:text-4xl font-black tracking-tight text-gray-100">
                            RAKESH<span className="text-cyber-green">_</span>RK
                        </p>
                        <p className="font-body text-sm text-gray-500 leading-relaxed mt-4 max-w-sm">
                            Offensive architect - building stealth systems and breaking things
                            to make them stronger. PES University, Bengaluru.
                        </p>
                        <p className="sys-label mt-6">
                            EST. 2023 // GHOST PROTOCOL v4.0
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <p className="sys-label mb-5">NAVIGATION</p>
                            <div className="space-y-3">
                                {nav.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block font-mono text-xs tracking-[0.15em] text-gray-500 hover:text-cyber-green hover:translate-x-1 transition-all duration-300"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="sys-label mb-5">CHANNELS</p>
                            <div className="space-y-3">
                                {social.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block font-mono text-xs tracking-[0.15em] text-gray-500 hover:text-cyber-green hover:translate-x-1 transition-all duration-300"
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="rule-h mb-6" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-gray-600">
                        © {new Date().getFullYear()} {profile.name}. ALL SYSTEMS NOMINAL.
                    </p>
                    <div className="flex items-center gap-5">
                        <span className="sys-label flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-cyber-green shadow-[0_0_6px_rgba(0,255,65,0.6)] animate-pulse" />
                            UPLINK ACTIVE
                        </span>
                        <span className="sys-label text-gray-700">
                            NEXT.JS // TAILWIND // FRAMER
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
