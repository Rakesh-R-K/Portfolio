'use client';

import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const accents = {
    green: { line: 'bg-cyber-green/50', text: 'text-cyber-green' },
    cyan: { line: 'bg-cyber-cyan/50', text: 'text-cyber-cyan' },
    magenta: { line: 'bg-cyber-magenta/50', text: 'text-cyber-magenta' },
    amber: { line: 'bg-cyber-amber/50', text: 'text-cyber-amber' },
};

/**
 * Unified section header - every section on the page uses this exact
 * structure so the whole document reads as one system.
 *
 *   [ 01 / IDENTITY ] ──────────────── SYS.OK
 *   ABOUT ME
 *   lede…
 */
export default function SectionHeader({
    index = '00',
    code = 'SECTION',
    title,
    lede,
    accent = 'green',
    status = 'SYS.OK',
}) {
    const a = accents[accent] || accents.green;

    return (
        <div className="mb-14 sm:mb-16">
            {/* Meta row */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-6"
            >
                <div className="crosshair crosshair-active" aria-hidden="true" />
                <span className="sys-label">
                    <span className={a.text}>{index}</span>
                    <span className="mx-2 text-gray-700">/</span>
                    {code}
                </span>
                <div className="flex-1 relative h-px bg-white/[0.05]">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`absolute inset-0 origin-left ${a.line}`}
                    />
                </div>
                <span className="sys-label hidden sm:block text-gray-700">{status}</span>
            </motion.div>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-100 uppercase flex items-baseline gap-4"
            >
                <span className={`hidden sm:block w-10 h-[3px] ${a.line} translate-y-[-0.35em]`} aria-hidden="true" />
                <DecryptText text={title} speed={40} delay={150} />
            </motion.h2>

            {/* Lede */}
            {lede && (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="font-body text-base sm:text-lg text-gray-500 mt-5 max-w-2xl leading-relaxed sm:pl-14"
                >
                    {lede}
                </motion.p>
            )}
        </div>
    );
}
