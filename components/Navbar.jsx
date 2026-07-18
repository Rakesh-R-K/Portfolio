'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '@/data/profile';

const links = [
    { index: '01', label: 'ABOUT', href: '#about' },
    { index: '02', label: 'OPERATIONS', href: '#projects' },
    { index: '03', label: 'CTF LOG', href: '#ctf-history' },
    { index: '04', label: 'WRITEUPS', href: '#writeups' },
    { index: '05', label: 'SKILLS', href: '#skills' },
    { index: '06', label: 'CONTACT', href: '#contact' },
    { index: '07', label: 'LAB', href: '/ctf', external: true },
];

export default function Navbar({ mockIP = '127.0.0.1' }) {
    const [time, setTime] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track active section
    useEffect(() => {
        const sectionIds = ['hero', 'about', 'projects', 'ctf-history', 'writeups', 'skills', 'contact'];
        const observers = [];

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, []);

    const handleNavClick = (e, href) => {
        setMobileOpen(false);
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const el = document.getElementById(href.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${scrolled
            ? 'bg-cyber-black/90 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent border-b border-transparent'
            }`}>
            <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between gap-6">
                {/* Brand */}
                <a
                    href="#hero"
                    onClick={(e) => handleNavClick(e, '#hero')}
                    className="magnetic flex items-center gap-3 shrink-0 group"
                >
                    <span className="w-2 h-2 bg-cyber-green shadow-[0_0_10px_rgba(0,255,65,0.7)] group-hover:rotate-45 transition-transform duration-300" />
                    <span className="font-display text-sm tracking-[0.25em] text-gray-200 group-hover:text-cyber-green transition-colors">
                        RAKESH<span className="text-cyber-green">_</span>RK
                    </span>
                </a>

                {/* Nav links */}
                <div className="hidden lg:flex items-center gap-7">
                    {links.map((link) => {
                        const isActive = activeSection === link.href.replace('#', '');
                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`magnetic group relative font-mono text-[11px] tracking-[0.18em] transition-colors duration-300 pb-1 ${isActive ? 'text-cyber-green' : 'text-gray-500 hover:text-gray-200'
                                    }`}
                            >
                                <span className={`mr-1.5 text-[9px] transition-colors duration-300 ${isActive ? 'text-cyber-green/60' : 'text-gray-700 group-hover:text-cyber-green/50'}`}>
                                    {link.index}
                                </span>
                                {link.label}
                                {link.external && <span className="ml-1 text-gray-700">↗</span>}
                                <span className={`absolute -bottom-1 left-0 right-0 h-[2px] bg-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`} />
                            </a>
                        );
                    })}
                </div>

                {/* Status cluster */}
                <div className="hidden md:flex items-center gap-4 font-mono text-[10px] tracking-[0.12em] shrink-0">
                    <span className="text-gray-600 hidden xl:inline">
                        SRC <span className="text-gray-400">{mockIP}</span>
                    </span>
                    <span className="hidden xl:inline w-px h-3 bg-white/10" />
                    {time && <span className="text-gray-500 tabular-nums">{time} IST</span>}
                    <button
                        onClick={() => window.dispatchEvent(new Event('open-resume-preview'))}
                        className="magnetic px-3.5 py-1.5 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green hover:text-cyber-black transition-all duration-300 tracking-[0.2em]"
                    >
                        RESUME
                    </button>
                </div>

                {/* Mobile toggle */}
                <button
                    className="lg:hidden magnetic font-mono text-xs text-gray-400 hover:text-cyber-green tracking-[0.2em]"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? '[ CLOSE ]' : '[ MENU ]'}
                </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden overflow-hidden bg-cyber-black/95 backdrop-blur-xl border-b border-white/[0.06]"
                    >
                        <div className="px-6 py-5 space-y-1">
                            {links.map((link) => {
                                const isActive = activeSection === link.href.replace('#', '');
                                return (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className={`flex items-center gap-3 font-mono text-sm tracking-[0.18em] py-2.5 border-b border-white/[0.04] last:border-0 ${isActive ? 'text-cyber-green' : 'text-gray-400'
                                            }`}
                                    >
                                        <span className="text-[10px] text-gray-700">{link.index}</span>
                                        {link.label}
                                        {link.external && <span className="text-gray-700">↗</span>}
                                    </a>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    window.dispatchEvent(new Event('open-resume-preview'));
                                }}
                                className="inline-block mt-3 px-4 py-2 border border-cyber-green/30 text-cyber-green font-mono text-xs tracking-[0.2em] text-left"
                            >
                                PREVIEW RESUME
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
