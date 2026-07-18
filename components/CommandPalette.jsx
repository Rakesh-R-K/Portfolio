'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
    { label: 'Home', id: 'hero', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>), shortcut: 'H' },
    { label: 'About', id: 'about', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>), shortcut: 'A' },
    { label: 'Projects', id: 'projects', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>), shortcut: 'P' },
    { label: 'Skills', id: 'skills', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>), shortcut: 'S' },
    { label: 'Terminal', id: 'terminal', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>), shortcut: 'T' },
    { label: 'Contact', id: 'contact', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>), shortcut: 'C' },
];

const quickActions = [
    { label: 'Download Resume', id: 'resume', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>), action: 'resume' },
    { label: 'View GitHub', id: 'github', icon: (<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>), action: 'https://github.com/Rakesh-R-K' },
    { label: 'View LinkedIn', id: 'linkedin', icon: (<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>), action: 'https://www.linkedin.com/in/rakesh-r-k-33a116330/' },
    { label: 'Toggle Sound', id: 'sound', icon: (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>), action: 'sound' },
];

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const allItems = [...sections, ...quickActions];
    const filtered = query
        ? allItems.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
        )
        : allItems;

    // Keyboard shortcut: Ctrl/Cmd + K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const executeItem = useCallback((item) => {
        setOpen(false);
        setQuery('');

        // Section navigation
        if (item.id && !item.action) {
            const el = document.getElementById(item.id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        if (item.action === 'resume') {
            window.dispatchEvent(new Event('open-resume-preview'));
            return;
        }
        if (item.action === 'sound') {
            const soundBtn = document.querySelector('[data-sound-toggle]');
            if (soundBtn) soundBtn.click();
            return;
        }
        if (item.action?.startsWith('http')) {
            window.open(item.action, '_blank');
        }
    }, []);

    const handleKeyNavigation = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        }
        if (e.key === 'Enter' && filtered[selectedIndex]) {
            executeItem(filtered[selectedIndex]);
        }
    };

    return (
        <>
            {/* Trigger hint (bottom bar) */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9960] hidden lg:block">
                <button
                    onClick={() => { setOpen(true); setQuery(''); setSelectedIndex(0); }}
                    className="font-mono text-[10px] tracking-wider text-gray-700 hover:text-gray-500 transition-colors px-3 py-1.5 border border-gray-800/30 bg-cyber-dark/80 backdrop-blur-sm hover:border-gray-700/50"
                >
                    <span className="text-gray-600">Ctrl+K</span> COMMAND PALETTE
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-[10000] bg-cyber-black/70 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />

                        {/* Palette */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[10001] w-[90vw] max-w-xl"
                        >
                            <div className="border border-cyber-green/15 bg-cyber-dark/95 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
                                {/* Search input */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800/30">
                                    <svg className="w-4 h-4 text-cyber-green/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyNavigation}
                                        placeholder="Type a command or search..."
                                        className="flex-1 bg-transparent font-mono text-sm text-gray-300 placeholder-gray-700 outline-none tracking-wider"
                                    />
                                    <kbd className="font-mono text-[9px] text-gray-700 border border-gray-800 px-1.5 py-0.5">ESC</kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-[300px] overflow-y-auto py-2">
                                    {/* Sections */}
                                    {filtered.some(f => !f.action) && (
                                        <div className="px-4 py-1.5">
                                            <span className="font-mono text-[9px] tracking-[0.3em] text-gray-700">NAVIGATE</span>
                                        </div>
                                    )}
                                    {filtered.filter(f => !f.action).map((item, i) => {
                                        const globalIndex = filtered.indexOf(item);
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => executeItem(item)}
                                                className={`w-full flex items-center gap-3 px-5 py-2.5 font-mono text-xs tracking-wider transition-all ${globalIndex === selectedIndex
                                                    ? 'bg-cyber-green/10 text-cyber-green'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
                                                    }`}
                                            >
                                                <span className="w-5 flex items-center justify-center opacity-60">{item.icon}</span>
                                                <span className="flex-1 text-left">{item.label}</span>
                                                {item.shortcut && (
                                                    <kbd className="font-mono text-[9px] text-gray-700 border border-gray-800 px-1.5 py-0.5">{item.shortcut}</kbd>
                                                )}
                                            </button>
                                        );
                                    })}

                                    {/* Actions */}
                                    {filtered.some(f => f.action) && (
                                        <div className="px-4 py-1.5 mt-1 border-t border-gray-800/20">
                                            <span className="font-mono text-[9px] tracking-[0.3em] text-gray-700">ACTIONS</span>
                                        </div>
                                    )}
                                    {filtered.filter(f => f.action).map((item) => {
                                        const globalIndex = filtered.indexOf(item);
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => executeItem(item)}
                                                className={`w-full flex items-center gap-3 px-5 py-2.5 font-mono text-xs tracking-wider transition-all ${globalIndex === selectedIndex
                                                    ? 'bg-cyber-green/10 text-cyber-green'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
                                                    }`}
                                            >
                                                <span className="w-5 flex items-center justify-center opacity-60">{item.icon}</span>
                                                <span className="flex-1 text-left">{item.label}</span>
                                            </button>
                                        );
                                    })}

                                    {/* No results */}
                                    {filtered.length === 0 && (
                                        <div className="px-5 py-6 text-center font-mono text-xs text-gray-700 tracking-wider">
                                            No results found for &quot;{query}&quot;
                                        </div>
                                    )}
                                </div>

                                {/* Footer hints */}
                                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800/20">
                                    <div className="flex items-center gap-3 font-mono text-[9px] text-gray-700">
                                        <span>↑↓ navigate</span>
                                        <span>↵ select</span>
                                        <span>esc close</span>
                                    </div>
                                    <span className="font-mono text-[9px] text-gray-800">GHOST_PROTOCOL</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
