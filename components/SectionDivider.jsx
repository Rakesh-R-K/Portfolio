'use client';

import { motion } from 'framer-motion';

/**
 * One divider, used everywhere - a hairline with a travelling pulse and
 * hex markers. The `variant` prop is kept for backwards compatibility but
 * every variant renders the same refined rule so the page stays coherent.
 */
export default function SectionDivider({ variant = 'default', className = '' }) {
    return (
        <div className={`relative py-6 ${className}`} aria-hidden="true">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
                <div className="relative h-px overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    <motion.div
                        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent"
                        animate={{ left: ['-10%', '110%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="font-mono text-[8px] tracking-[0.3em] text-gray-800 select-none">0x00</span>
                    <span className="font-mono text-[8px] tracking-[0.3em] text-gray-800 select-none">//</span>
                    <span className="font-mono text-[8px] tracking-[0.3em] text-gray-800 select-none">0xFF</span>
                </div>
            </div>
        </div>
    );
}
