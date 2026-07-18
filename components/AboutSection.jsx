'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import SectionHeader from './SectionHeader';

const dossierFields = [
    { label: 'CALLSIGN', value: '@rakesh_rk', accent: 'text-cyber-cyan' },
    { label: 'INSTITUTION', value: 'PES University, Bengaluru' },
    { label: 'PROGRAM', value: 'B.Tech CSE - 6th Semester' },
    { label: 'FOCUS', value: 'Cybersecurity & Networking' },
    { label: 'GPA', value: '7.57 / 10', accent: 'text-cyber-green' },
    { label: 'COORDINATES', value: '12.9716°N, 77.5946°E' },
    { label: 'STATUS', value: 'HUNTING', accent: 'text-cyber-green' },
];

export default function AboutSection() {
    return (
        <section id="about" className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    index="01"
                    code="IDENTITY"
                    title="ABOUT ME"
                    lede={
                        <>
                            Computer Science undergraduate at{' '}
                            <span className="text-gray-300">{profile.university}</span>, specializing in
                            offensive security, network forensics, and AI-assisted security tooling.
                        </>
                    }
                />

                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-stretch">
                    {/* ── Left: narrative dossier ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Bio panel */}
                        <div className="hud-panel p-7 sm:p-9">
                            <div>
                                <div className="flex items-center gap-5 mb-7">
                                    <div className="w-16 h-16 border border-cyber-green/25 bg-cyber-green/5 flex items-center justify-center font-display text-xl text-cyber-green tracking-widest shrink-0">
                                        RK
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg tracking-[0.15em] text-gray-100">{profile.name}</h3>
                                        <p className="sys-label mt-1.5">{profile.tagline}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {profile.bio.map((paragraph, i) => (
                                        <p key={i} className="font-body text-sm sm:text-[15px] text-gray-400 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <blockquote className="mt-7 pl-5 border-l-2 border-cyber-green/40 font-mono text-sm text-cyber-cyan/70 italic">
                                {profile.philosophy}
                            </blockquote>
                        </div>

                        {/* Focus areas */}
                        <div className="hud-panel hud-panel--cyan p-6 sm:p-7">
                            <p className="sys-label mb-4">FOCUS_AREAS</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.focusAreas.map((area) => (
                                    <span key={area} className="sys-chip cursor-default">{area}</span>
                                ))}
                            </div>
                        </div>

                    </motion.div>

                    {/* ── Right: data column ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="space-y-6 flex flex-col h-full justify-between"
                    >
                        {/* Subject dossier readout */}
                        <div className="hud-panel hud-panel--static flex-1 flex flex-col justify-between">
                            <div>
                                <div className="px-6 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                                    <span className="sys-label">SUBJECT_DOSSIER</span>
                                    <span className="sys-label text-cyber-green/60">DECLASSIFIED</span>
                                </div>
                                <div className="p-6 space-y-3.5 flex-1 flex flex-col justify-center">
                                    {dossierFields.map((field) => (
                                        <div key={field.label} className="sys-readout">
                                            <span className="text-gray-600">{field.label}</span>
                                            <span className={`text-right ${field.accent || 'text-gray-300'}`}>{field.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Resume */}
                        <button
                            onClick={() => window.dispatchEvent(new Event('open-resume-preview'))}
                            className="hud-panel group flex items-center justify-between p-6 w-full text-left cursor-pointer"
                        >
                            <div>
                                <p className="font-display text-sm tracking-[0.2em] text-gray-200 group-hover:text-cyber-green transition-colors">
                                    DOWNLOAD RESUME
                                </p>
                                <p className="sys-label mt-1.5">PDF // 58 KB</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-600 group-hover:text-cyber-green group-hover:translate-y-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>

                        {/* Availability */}
                        <AvailabilityWidget />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function AvailabilityWidget() {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        const h = new Date().getHours();
        setIsOnline(h >= 8 && h < 24);
    }, []);

    if (isOnline === null) return null; // SSR-safe

    return (
        <div className="hud-panel hud-panel--static p-6">
            <div className="flex items-center justify-between">
                <span className="sys-label">LIVE_STATUS</span>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 ${isOnline
                        ? 'bg-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.6)] animate-pulse'
                        : 'bg-gray-600'
                        }`} />
                    <span className={`font-mono text-[11px] tracking-[0.15em] ${isOnline ? 'text-cyber-green' : 'text-gray-500'}`}>
                        {isOnline ? 'ONLINE' : 'STEALTH'}
                    </span>
                </div>
            </div>
            <p className="font-mono text-[11px] text-gray-500 mt-3">
                {profile.location.timezone} • {profile.location.city}, {profile.location.country}
            </p>
            <p className="font-mono text-[10px] text-gray-600 mt-1">
                If <span className="text-cyber-green">ONLINE</span>, probably hacking something.
            </p>
        </div>
    );
}
