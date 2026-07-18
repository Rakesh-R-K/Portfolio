'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Context for global activity logging ───
const ActivityContext = createContext(null);

export function useActivity() {
    return useContext(ActivityContext);
}

export function ActivityProvider({ children }) {
    const [logs, setLogs] = useState([]);
    const idRef = useRef(0);

    const log = useCallback((level, message) => {
        const id = idRef.current++;
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev.slice(-30), { id, level, message, timestamp }]);
    }, []);

    const info = useCallback((msg) => log('INFO', msg), [log]);
    const warn = useCallback((msg) => log('WARN', msg), [log]);
    const error = useCallback((msg) => log('ERROR', msg), [log]);
    const success = useCallback((msg) => log('SUCCESS', msg), [log]);

    // Auto-log page events
    useEffect(() => {
        info('System initialized. Welcome, Operative.');

        const handleScroll = () => {
            const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (pct > 0 && pct % 25 === 0) {
                info(`Scroll depth: ${pct}%`);
            }
        };

        const handleVisibility = () => {
            if (document.hidden) {
                warn('User switched tabs. Monitoring...');
            } else {
                info('User returned. Resuming surveillance.');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [info, warn]);

    return (
        <ActivityContext.Provider value={{ logs, info, warn, error, success }}>
            {children}
        </ActivityContext.Provider>
    );
}

// ─── Log Stream UI ───
export default function ActivityLog() {
    const ctx = useActivity();
    const [collapsed, setCollapsed] = useState(true);
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [ctx?.logs]);

    if (!ctx) return null;
    const { logs } = ctx;

    const levelColor = {
        INFO: 'text-gray-500',
        WARN: 'text-cyber-amber',
        ERROR: 'text-cyber-magenta',
        SUCCESS: 'text-cyber-green',
    };

    const levelIcon = {
        INFO: '○',
        WARN: '△',
        ERROR: '✕',
        SUCCESS: '✓',
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9989] font-mono text-[10px]">
            {/* Toggle button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="magnetic mb-1 px-3 py-1.5 bg-cyber-dark/90 backdrop-blur-xl border border-cyber-green/15 text-gray-500 hover:text-cyber-green hover:border-cyber-green/30 transition-all tracking-wider"
            >
                {collapsed ? '▸ ACTIVITY_LOG' : '▾ ACTIVITY_LOG'} [{logs.length}]
            </button>

            {/* Log panel */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 180, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-cyber-dark/95 backdrop-blur-xl border border-cyber-green/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    >
                        <div
                            ref={logRef}
                            className="h-[180px] overflow-y-auto p-3 space-y-0.5"
                        >
                            {logs.map((entry) => (
                                <div
                                    key={entry.id}
                                    className={`${levelColor[entry.level]} flex gap-2 leading-relaxed`}
                                >
                                    <span className="text-gray-700 shrink-0">{entry.timestamp}</span>
                                    <span className="shrink-0">[{levelIcon[entry.level]} {entry.level}]</span>
                                    <span className="truncate">{entry.message}</span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-gray-700">Awaiting activity...</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
