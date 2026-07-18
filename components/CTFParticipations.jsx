'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ctfParticipations } from '@/data/profile';
import SectionHeader from './SectionHeader';

const getPlacementNum = (placement) => {
    const match = placement?.match(/#(\d+)/);
    return match ? parseInt(match[1]) : 999;
};

const placementStyle = (num) => {
    if (num <= 3) return 'text-cyber-amber border-cyber-amber/40 bg-cyber-amber/[0.08]';
    if (num <= 10) return 'text-cyber-green border-cyber-green/40 bg-cyber-green/[0.08]';
    if (num <= 25) return 'text-cyber-cyan border-cyber-cyan/40 bg-cyber-cyan/[0.08]';
    return 'text-gray-500 border-white/10 bg-white/[0.02]';
};

export default function CTFParticipations() {
    const ctfs = ctfParticipations;
    const [expandedId, setExpandedId] = useState(null);

    if (ctfs.length === 0) return null;

    return (
        <section id="ctf-history" className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20 scroll-mt-24">
            <div className="max-w-5xl mx-auto">
                <SectionHeader
                    index="04"
                    code="BATTLE_LOG"
                    title="CTF RECORD"
                    accent="magenta"
                    status="VERIFIED"
                    lede="Capture The Flag engagements - skills tested under pressure, flags earned through persistence."
                />

                {/* Compact log */}
                <div className="space-y-1">
                    {ctfs.map((ctf, i) => {
                        const isExpanded = expandedId === ctf.id;
                        const num = getPlacementNum(ctf.placement);

                        return (
                            <motion.div
                                key={ctf.id}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: Math.min(i * 0.03, 0.25), duration: 0.4 }}
                                className={`hud-panel hud-panel--magenta overflow-hidden ${isExpanded ? 'border-cyber-magenta/25' : ''}`}
                            >
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : ctf.id)}
                                    className="w-full text-left px-4 py-3 grid grid-cols-[56px_1fr_24px] gap-3 items-center group/row"
                                    aria-expanded={isExpanded}
                                >
                                    {/* Rank badge */}
                                    <span className={`justify-self-start font-mono text-[10px] font-bold tracking-wider px-2 py-1 border text-center min-w-[44px] ${placementStyle(num)}`}>
                                        {num === 999 ? '-' : `#${num}`}
                                    </span>

                                    {/* Name */}
                                    <span className="min-w-0">
                                        <span className="block font-display text-[13px] sm:text-sm tracking-[0.08em] text-gray-300 group-hover/row:text-cyber-magenta transition-colors truncate">
                                            {ctf.name}
                                        </span>
                                    </span>

                                    {/* Expand glyph */}
                                    <span className={`font-mono text-[10px] text-gray-600 justify-self-end transition-transform duration-300 ${isExpanded ? 'rotate-90 text-cyber-magenta' : ''}`}>
                                        ▸
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-white/[0.05] px-4 py-4 grid sm:grid-cols-2 gap-4">
                                                {/* Stats */}
                                                <div className="space-y-1.5">
                                                    <div className="sys-readout">
                                                        <span className="text-gray-600">Placement</span>
                                                        <span className={num <= 10 ? 'text-cyber-green' : 'text-gray-300'}>{ctf.placement}</span>
                                                    </div>
                                                    <div className="sys-readout">
                                                        <span className="text-gray-600">Year</span>
                                                        <span className="text-gray-300">{ctf.date}</span>
                                                    </div>
                                                    <div className="sys-readout">
                                                        <span className="text-gray-600">Status</span>
                                                        <span className="text-gray-300">{ctf.status}</span>
                                                    </div>
                                                    {ctf.teamName !== '-' && (
                                                        <div className="sys-readout">
                                                            <span className="text-gray-600">Team</span>
                                                            <span className="text-gray-300">{ctf.teamName} ({ctf.teamSize})</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Highlights */}
                                                {(ctf.highlights || []).length > 0 && (
                                                    <div>
                                                        <p className="sys-label mb-2">HIGHLIGHTS</p>
                                                        <ul className="space-y-1.5">
                                                            {ctf.highlights.map((h, j) => (
                                                                <li key={j} className="flex items-start gap-2 font-mono text-[10px] text-gray-400 leading-relaxed">
                                                                    <span className="text-cyber-magenta/60 shrink-0">▸</span>
                                                                    {h}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Console readout */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-6 font-mono text-[11px] text-gray-600 tracking-wide"
                >
                    <span className="text-gray-700">$ grep -c &quot;FLAG_CAPTURED&quot; /var/log/ctf.log</span>
                    <span className="text-cyber-green/70 ml-3">
                        → {ctfs.length} engagements logged
                    </span>
                </motion.p>
            </div>
        </section>
    );
}
