'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, filter: 'blur(4px) brightness(0.5)' }}
                animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
                exit={{ opacity: 0, filter: 'blur(4px) brightness(1.5)' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                {/* Glitch overlay on enter */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="fixed inset-0 z-[19998] pointer-events-none"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
                    }}
                />
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
