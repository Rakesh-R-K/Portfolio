'use client';

import { motion } from 'framer-motion';

export default function AvailabilityBanner() {
    return (
        <section className="relative py-8 px-6 sm:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="border border-cyber-green/15 bg-gradient-to-r from-cyber-green/[0.03] via-transparent to-cyber-cyan/[0.03] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
                >
                    {/* Left: status info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-cyber-green shadow-[0_0_12px_rgba(0,255,65,0.6)] animate-pulse" />
                            <h3 className="font-display text-xl sm:text-2xl tracking-wider text-gray-200">
                                OPEN TO OPPORTUNITIES
                            </h3>
                        </div>
                        <p className="font-body text-sm text-gray-500 max-w-lg leading-relaxed">
                            Currently seeking internships and collaborations in offensive security,
                            red teaming, and AI-driven security research. Available for remote &amp; Bengaluru-based roles.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {['Internship', 'Red Team', 'Security Research', 'Full-Stack', 'Remote'].map((tag) => (
                                <span
                                    key={tag}
                                    className="font-mono text-[9px] tracking-wider px-2.5 py-1 border border-cyber-green/10 text-gray-500"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <a
                        href="#contact"
                        className="magnetic shrink-0 px-8 py-3.5 border border-cyber-green/30 text-cyber-green font-mono text-xs tracking-[0.2em] hover:bg-cyber-green/5 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all duration-300 group relative overflow-hidden"
                    >
                        <span className="relative z-10">LET&apos;S CONNECT →</span>
                        <div className="absolute inset-0 bg-cyber-green/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </a>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-cyber-green/10" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-cyber-green/10" />

                    {/* Scan line */}
                    <motion.div
                        className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyber-green/30 to-transparent"
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
