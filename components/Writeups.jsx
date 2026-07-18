'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';

// ── Writeup data - populate with your favorite writeups later ──
// Structure: { title, ctfName, category, date, tags, difficulty }
const writeups = [
    // Example entry (uncomment and duplicate when ready):
    // {
    //     title: 'Exploiting IDOR in a User Directory',
    //     ctfName: 'Enigma CTF 2025',
    //     category: 'Web Exploitation',
    //     date: '2025-03',
    //     tags: ['IDOR', 'Web', 'Crypto'],
    //     difficulty: 'MEDIUM',
    // },
];

const diffBadge = {
    EASY: 'border-cyber-green/30 text-cyber-green bg-cyber-green/[0.06]',
    MEDIUM: 'border-cyber-amber/30 text-cyber-amber bg-cyber-amber/[0.06]',
    HARD: 'border-cyber-magenta/30 text-cyber-magenta bg-cyber-magenta/[0.06]',
};

function SignalBars({ date }) {
    // More recent = more bars lit
    const now = new Date();
    const writeupDate = new Date(date);
    const monthsAgo = (now.getFullYear() - writeupDate.getFullYear()) * 12 + (now.getMonth() - writeupDate.getMonth());
    const bars = monthsAgo <= 1 ? 4 : monthsAgo <= 3 ? 3 : monthsAgo <= 6 ? 2 : 1;

    return (
        <div className="flex items-end gap-0.5" title={`${bars}/4 signal strength`}>
            {[1, 2, 3, 4].map(i => (
                <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className={`w-[3px] origin-bottom ${i <= bars ? 'bg-cyber-cyan' : 'bg-white/[0.06]'}`}
                    style={{ height: `${6 + i * 3}px` }}
                />
            ))}
        </div>
    );
}

function WriteupCard({ writeup, index }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.5 }}
            className="hud-panel hud-panel--cyan group"
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left px-5 py-4 flex items-center gap-4"
                aria-expanded={expanded}
            >
                {/* Signal strength */}
                <SignalBars date={writeup.date} />

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <span className="block font-display text-sm sm:text-[15px] tracking-[0.08em] text-gray-200 group-hover:text-cyber-cyan transition-colors truncate">
                        {writeup.title}
                    </span>
                    <span className="block font-mono text-[10px] tracking-[0.12em] text-gray-600 mt-1">
                        {writeup.ctfName} • {writeup.date}
                    </span>
                </div>

                {/* Difficulty badge */}
                <span className={`hidden sm:inline-block font-mono text-[9px] tracking-[0.18em] px-2.5 py-1 border ${diffBadge[writeup.difficulty] || diffBadge.MEDIUM}`}>
                    {writeup.difficulty}
                </span>

                {/* Category */}
                <span className="hidden md:block font-mono text-[10px] tracking-[0.12em] text-gray-500 min-w-[100px] text-right">
                    {writeup.category}
                </span>

                {/* Expand glyph */}
                <span className={`font-mono text-xs text-gray-600 transition-transform duration-300 ${expanded ? 'rotate-90 text-cyber-cyan' : ''}`}>
                    ▸
                </span>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/[0.05] px-5 py-5">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {writeup.tags.map(tag => (
                                    <span key={tag} className="sys-chip cursor-default">{tag}</span>
                                ))}
                            </div>
                            <p className="font-mono text-[11px] text-gray-500 leading-relaxed">
                                <span className="text-cyber-cyan/60">▸</span> Full writeup coming soon - content is being declassified.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function IncomingTransmission() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden"
        >
            {/* Animated border card */}
            <div className="animated-border rounded-none p-px">
                <div className="bg-cyber-black/90 backdrop-blur-sm px-8 py-14 sm:py-20 text-center relative">
                    {/* Scan line */}
                    <motion.div
                        className="absolute inset-y-0 left-0 w-full"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.04), transparent)' }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                    />

                    {/* Icon */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="mb-6 inline-flex items-center justify-center w-16 h-16 border border-cyber-cyan/20 bg-cyber-cyan/[0.03]"
                    >
                        <svg className="w-7 h-7 text-cyber-cyan/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                    </motion.div>

                    <h3 className="font-display text-lg sm:text-xl tracking-[0.2em] text-gray-300 mb-3">
                        TRANSMISSION INCOMING
                    </h3>
                    <p className="font-mono text-[11px] tracking-[0.15em] text-gray-600 max-w-md mx-auto leading-relaxed">
                        Writeups are being declassified. Field notes from CTF engagements,
                        vulnerability deep-dives, and security research will appear here.
                    </p>

                    {/* Blinking cursor */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-cyber-cyan/40 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.3)]" />
                        <span className="font-mono text-[10px] tracking-[0.2em] text-cyber-cyan/50">
                            STANDBY FOR INTEL
                        </span>
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyber-cyan/20" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyber-cyan/20" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyber-cyan/20" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-cyber-cyan/20" />
                </div>
            </div>
        </motion.div>
    );
}

export default function Writeups() {
    const hasWriteups = writeups.length > 0;

    return (
        <section id="writeups" className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    index="05"
                    code="FIELD_NOTES"
                    title="WRITEUPS"
                    accent="cyan"
                    status={hasWriteups ? `${writeups.length} DECLASSIFIED` : 'PENDING'}
                    lede="CTF challenge breakdowns, vulnerability deep-dives, and security research notes - dissecting the flags one exploit at a time."
                />

                {hasWriteups ? (
                    <div className="space-y-2">
                        {writeups.map((writeup, i) => (
                            <WriteupCard key={writeup.title} writeup={writeup} index={i} />
                        ))}

                        {/* Console readout */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-6 font-mono text-[11px] text-gray-600 tracking-wide"
                        >
                            <span className="text-gray-700">$ cat /var/log/field_notes.log | wc -l</span>
                            <span className="text-cyber-cyan/70 ml-3">
                                → {writeups.length} report{writeups.length === 1 ? '' : 's'} declassified
                            </span>
                        </motion.p>
                    </div>
                ) : (
                    <IncomingTransmission />
                )}
            </div>
        </section>
    );
}
