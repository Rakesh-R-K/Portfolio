'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BootSequence({ onComplete }) {
    const [lines, setLines] = useState([]);
    const [done, setDone] = useState(false);
    const [progress, setProgress] = useState(0);

    // Skip boot if already booted this session
    useEffect(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('booted')) {
            onComplete?.();
            setDone(true);
        }
    }, [onComplete]);

    const bootLines = [
        { text: 'GHOST PROTOCOL BIOS v3.0.0', delay: 0, color: 'white' },
        { text: '═══════════════════════════════════════════', delay: 50, color: 'dim' },
        { text: '[BIOS] Booting secure kernel...', delay: 150 },
        { text: '[BIOS] Checking integrity... OK', delay: 300, color: 'green' },
        { text: '[NET]  WireGuard tunnel...   OK', delay: 450, color: 'green' },
        { text: '[TOR]  Tor routing...        OK', delay: 600, color: 'green' },
        { text: '[SYS]  Asset decryption...   DONE', delay: 750, color: 'green' },
        { text: '[SYS]  Subsystems online.', delay: 900, color: 'green' },
        { text: '', delay: 1000 },
        { text: 'ACCESS GRANTED. Welcome, Operative.', delay: 1150, color: 'bright' },
    ];

    useEffect(() => {
        if (done) return;

        const timeouts = [];

        bootLines.forEach(({ text, delay, color }) => {
            const t = setTimeout(() => {
                setLines(prev => [...prev, { text, color }]);
                setProgress(Math.min(100, Math.round((delay / 1150) * 100)));
            }, delay);
            timeouts.push(t);
        });

        const tProgress = setTimeout(() => {
            setProgress(100);
        }, 1250);
        timeouts.push(tProgress);

        const tDone = setTimeout(() => {
            setDone(true);
            if (typeof window !== 'undefined') sessionStorage.setItem('booted', '1');
            setTimeout(() => onComplete?.(), 250);
        }, 1500);
        timeouts.push(tDone);

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [done]);

    if (done && lines.length === 0) return null;

    const getColor = (color) => {
        switch (color) {
            case 'green': return 'text-cyber-green';
            case 'white': return 'text-gray-200';
            case 'bright': return 'text-cyber-green text-sm font-bold';
            case 'dim': return 'text-gray-700';
            default: return 'text-gray-500';
        }
    };

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[30000] bg-black flex items-center justify-center"
                >
                    <div className="w-full max-w-2xl px-8">
                        {/* BIOS header bar */}
                        <div className="mb-4 flex items-center justify-between font-mono text-[9px] text-gray-700 tracking-wider">
                            <span>GHOST PROTOCOL UNIFIED BOOT INTERFACE</span>
                            <span>MEM: 32768 MB OK</span>
                        </div>

                        {/* Boot log */}
                        <div className="font-mono text-[11px] space-y-0.5 max-h-[60vh] overflow-hidden">
                            {lines.map((line, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.12 }}
                                    className={`${getColor(line.color)} tracking-wider whitespace-pre`}
                                >
                                    {line.text}
                                </motion.p>
                            ))}
                            <span className="inline-block w-2 h-4 bg-cyber-green animate-blink" />
                        </div>

                        {/* Progress bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-1 font-mono text-[9px] text-gray-600 tracking-wider">
                                <span>BOOT PROGRESS</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1 bg-gray-900 overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.5)]"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
