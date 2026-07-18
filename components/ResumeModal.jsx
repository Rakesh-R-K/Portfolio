'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-resume-preview', handleOpen);
        return () => window.removeEventListener('open-resume-preview', handleOpen);
    }, []);

    const handleClose = () => setIsOpen(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative w-full max-w-4xl bg-cyber-black border border-cyber-green/30 shadow-[0_0_50px_rgba(0,255,65,0.15)] flex flex-col z-10"
                    >
                        {/* Title Bar */}
                        <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                            <span className="font-mono text-xs tracking-[0.2em] text-cyber-green flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                                RESUME_PREVIEW // RAKESH_RK.PDF
                            </span>
                            <button
                                onClick={handleClose}
                                className="font-mono text-xs text-gray-500 hover:text-cyber-magenta transition-colors"
                            >
                                [ ESCAPE ]
                            </button>
                        </div>

                        {/* PDF Frame */}
                        <div className="relative bg-black/40 p-4 flex-1">
                            <iframe
                                src="/resume.pdf"
                                className="w-full h-[65vh] border border-white/5"
                                title="Rakesh R K Resume"
                            />
                        </div>

                        {/* Footer Bar */}
                        <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.01] flex flex-wrap items-center justify-between gap-4">
                            <span className="font-mono text-[10px] text-gray-500">
                                FILE SIZE: ~58 KB // FORMAT: PDF
                            </span>
                            <div className="flex gap-4">
                                <a
                                    href="/resume.pdf"
                                    download="RAKESH_RK_RESUME.pdf"
                                    onClick={handleClose}
                                    className="px-4 py-2 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/5 font-mono text-xs tracking-wider transition-all"
                                >
                                    [ DOWNLOAD RESUME ]
                                </a>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 border border-white/10 text-gray-400 hover:border-white/20 hover:text-white font-mono text-xs tracking-wider transition-all"
                                >
                                    [ CLOSE ]
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
