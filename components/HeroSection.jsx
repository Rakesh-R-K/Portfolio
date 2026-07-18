'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { profile } from '@/data/profile';
import DecryptText from './DecryptText';
import Terminal from './Terminal';
import TypewriterRoles from './TypewriterRoles';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function HeroSection({ onHack, onGhostnet, onKnockSequence, onDissolve }) {
    return (
        <section
            id="hero"
            className="relative min-h-[82vh] flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-14 pb-6 overflow-hidden"
        >
            {/* 3D background - dimmed so the type carries the section */}
            <div className="absolute inset-0 z-0 opacity-50">
                <HeroScene />
            </div>

            {/* Aurora wash */}
            <div
                className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-[1]"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,255,65,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 10%, rgba(0,240,255,0.04) 0%, transparent 50%)',
                }}
            />

            {/* Right-edge vertical coordinates rail */}
            <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-[2] flex-col items-center gap-6 pointer-events-none select-none">
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-cyber-green/25 to-transparent" />
                <span className="sys-label" style={{ writingMode: 'vertical-rl' }}>
                    {profile.location.lat}°N / {profile.location.lng}°E - BLR.IN
                </span>
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-cyber-green/25 to-transparent" />
            </div>

            {/* Main grid */}
            <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-center flex-1">
                {/* ── Left: identity block ── */}
                <div>
                    {/* Status line */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex items-center gap-3 mb-5"
                    >
                        <span className="relative flex w-2.5 h-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full bg-cyber-green/50" />
                            <span className="relative inline-flex w-2.5 h-2.5 bg-cyber-green shadow-[0_0_10px_rgba(0,255,65,0.7)]" />
                        </span>
                        <span className="sys-label !text-gray-500">
                            SECURITY RESEARCHER // <span className="text-cyber-green">UPLINK ACTIVE</span>
                        </span>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-black tracking-tight leading-[1.0] text-[clamp(2.2rem,6.5vw,5rem)] flex flex-wrap gap-x-3"
                    >
                        <span className="text-gray-100">
                            <DecryptText text="RAKESH" trigger="mount" delay={700} speed={35} />
                        </span>
                        <span className="text-gradient-primary">
                            <DecryptText text="R K" trigger="mount" delay={1100} speed={35} />
                        </span>
                    </motion.h1>

                    {/* Role designation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-4 flex items-center gap-4"
                    >
                        <div className="w-10 h-[2px] bg-cyber-green/60" />
                        <p className="font-display text-sm sm:text-base tracking-[0.35em] text-gray-300 uppercase">
                            {profile.title}
                        </p>
                    </motion.div>

                    {/* Live role + subtitle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="mt-4 space-y-4 max-w-xl"
                    >
                        <div className="font-mono text-sm tracking-wide">
                            <span className="text-gray-600">$ whoami</span>
                            <span className="text-gray-700 mx-2">→</span>
                            <TypewriterRoles className="text-cyber-cyan" />
                        </div>
                        <p className="font-body text-base sm:text-lg text-gray-400 leading-relaxed">
                            {profile.subtitle.charAt(0) + profile.subtitle.slice(1).toLowerCase()}{' '}
                            Offensive security, network forensics, and AI-driven tooling - built and battle-tested in CTFs.
                        </p>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.45, duration: 0.6 }}
                        className="mt-6 flex flex-wrap items-center gap-4"
                    >
                        <a href="#projects" className="magnetic btn-primary">
                            VIEW OPERATIONS
                        </a>
                        <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="magnetic btn-ghost"
                        >
                            GITHUB <span aria-hidden="true">↗</span>
                        </a>
                        <a
                            href="#contact"
                            className="magnetic font-mono text-[11px] tracking-[0.2em] text-gray-500 hover:text-cyber-green transition-colors underline decoration-gray-800 underline-offset-8"
                        >
                            OPEN A CHANNEL
                        </a>
                    </motion.div>
                </div>

                {/* ── Right: field terminal ── */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    {/* Frame label */}
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="sys-label">FIELD_TERMINAL // v4.0</span>
                        <span className="sys-label text-cyber-green/60">INTERACTIVE - TRY &quot;help&quot;</span>
                    </div>
                    <Terminal
                        onHack={onHack}
                        onGhostnet={onGhostnet}
                        onKnockSequence={onKnockSequence}
                        onDissolve={onDissolve}
                    />
                </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10"
            >
                <span className="sys-label">SCROLL</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-px h-8 bg-gradient-to-b from-cyber-green/50 to-transparent"
                />
            </motion.div>
        </section>
    );
}
