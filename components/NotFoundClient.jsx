'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function GlitchText({ text }) {
    const [glitched, setGlitched] = useState(text);

    useEffect(() => {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
        let iteration = 0;
        const interval = setInterval(() => {
            setGlitched(
                text
                    .split('')
                    .map((char, i) => {
                        if (i < iteration) return text[i];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );
            iteration += 0.5;
            if (iteration >= text.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{glitched}</span>;
}

function TypingLine({ text, delay = 0, prefix = '$' }) {
    const [displayed, setDisplayed] = useState('');
    const [showCursor, setShowCursor] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCursor(true);
            let i = 0;
            const typingInterval = setInterval(() => {
                setDisplayed(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(typingInterval);
                    setTimeout(() => setShowCursor(false), 500);
                }
            }, 30);
            return () => clearInterval(typingInterval);
        }, delay);
        return () => clearTimeout(timer);
    }, [text, delay]);

    return (
        <p className="text-gray-500">
            <span className="text-cyber-green/60">{prefix} </span>
            {displayed}
            {showCursor && <span className="animate-pulse text-cyber-green">▌</span>}
        </p>
    );
}

export default function NotFoundClient() {
    const [showLog, setShowLog] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowLog(true), 1500);
    }, []);

    return (
        <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 relative overflow-hidden">
            {/* Noise */}
            <div className="noise-overlay" />
            <div className="scanline-overlay" />
            <div className="vignette" />

            {/* Floating error codes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute font-mono text-[10px] text-cyber-magenta/10"
                        initial={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: 0,
                        }}
                        animate={{
                            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                            opacity: [0, 0.3, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    >
                        ERR_0x{Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}
                    </motion.div>
                ))}
            </div>

            <div className="text-center relative z-10 max-w-lg">
                {/* Big 404 */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="font-display text-[120px] sm:text-[180px] font-black leading-none tracking-tighter relative mb-2"
                >
                    <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,45,85,0.4)' }}>
                        <GlitchText text="404" />
                    </span>
                    {/* Glitch layers */}
                    <motion.div
                        className="absolute inset-0 text-cyber-magenta/15"
                        animate={{ x: [0, -3, 3, 0], y: [0, 2, -2, 0] }}
                        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                    >
                        404
                    </motion.div>
                    <motion.div
                        className="absolute inset-0 text-cyber-cyan/10"
                        animate={{ x: [0, 3, -3, 0], y: [0, -2, 2, 0] }}
                        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2, delay: 0.15 }}
                    >
                        404
                    </motion.div>
                </motion.div>

                {/* Access denied */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-mono text-sm tracking-widest text-cyber-magenta mb-8"
                >
                    ACCESS_DENIED
                </motion.div>

                {/* Terminal-style log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="border border-cyber-magenta/10 bg-cyber-dark/50 p-5 text-left font-mono text-[11px] space-y-1.5 mb-8"
                >
                    <TypingLine text="curl -X GET /unknown" delay={800} />
                    {showLog && (
                        <>
                            <p className="text-cyber-magenta">HTTP/1.1 404 Not Found</p>
                            <p className="text-gray-600">Content-Type: text/html</p>
                            <p className="text-gray-600">Server: ghost-protocol/3.0</p>
                            <p className="text-gray-700 mt-2">---</p>
                            <TypingLine text="The requested resource does not exist" delay={2200} prefix="!" />
                            <TypingLine text="or has been classified beyond your clearance." delay={2800} prefix="!" />
                            <p className="text-gray-700 mt-2">---</p>
                            <p className="text-cyber-amber/60 mt-1">⚠ Incident logged. IP recorded. Authorities notified.</p>
                        </>
                    )}
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <Link
                        href="/"
                        className="font-mono text-xs tracking-wider px-6 py-3 border border-cyber-green/20 text-cyber-green hover:bg-cyber-green/5 hover:border-cyber-green/40 transition-all group"
                    >
                        ← RETURN TO BASE
                        <span className="inline-block group-hover:-translate-x-1 transition-transform ml-1">⌂</span>
                    </Link>
                    <Link
                        href="/#terminal"
                        className="font-mono text-xs tracking-wider px-6 py-3 border border-gray-700/30 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-all"
                    >
                        OPEN TERMINAL ▶
                    </Link>
                </motion.div>

                {/* Fun footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="font-mono text-[9px] text-gray-800 mt-10 tracking-wider"
                >
                    GHOST_PROTOCOL v3.0 • This incident will be reported to /dev/null
                </motion.p>
            </div>
        </div>
    );
}
