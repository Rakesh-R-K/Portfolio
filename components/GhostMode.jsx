'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GhostModeContext = createContext(null);

export function useGhostMode() {
    return useContext(GhostModeContext);
}

export function GhostModeProvider({ children }) {
    const [isGhost, setIsGhost] = useState(false);

    const toggle = useCallback(() => {
        setIsGhost(prev => !prev);
    }, []);

    useEffect(() => {
        if (isGhost) {
            document.documentElement.classList.add('ghost-mode');
        } else {
            document.documentElement.classList.remove('ghost-mode');
        }
    }, [isGhost]);

    return (
        <GhostModeContext.Provider value={{ isGhost, toggle }}>
            {children}
        </GhostModeContext.Provider>
    );
}

export default function GhostModeToggle() {
    const ctx = useGhostMode();
    if (!ctx) return null;
    const { isGhost, toggle } = ctx;

    return (
        <div className="fixed bottom-4 left-4 z-[9989]">
            <button
                onClick={toggle}
                className="magnetic group relative font-mono text-[10px] tracking-wider px-4 py-2 border transition-all duration-500"
                style={{
                    borderColor: isGhost ? 'rgba(255,45,85,0.3)' : 'rgba(0,255,65,0.15)',
                    background: isGhost ? 'rgba(255,45,85,0.05)' : 'rgba(0,255,65,0.02)',
                }}
            >
                <span className={isGhost ? 'text-cyber-magenta' : 'text-gray-500 group-hover:text-cyber-green'}>
                    {isGhost ? '◉ GHOST_MODE' : '○ PROFESSIONAL'}
                </span>
            </button>

            {/* Mode transition overlay */}
            <AnimatePresence>
                {isGhost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[20000] pointer-events-none"
                    >
                        <div className="font-mono text-[10px] tracking-widest text-cyber-magenta/60 bg-cyber-dark/80 backdrop-blur-sm px-4 py-2 border border-cyber-magenta/20">
                            GHOST PROTOCOL ENGAGED - UNDERGROUND MODE
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
