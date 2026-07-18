'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1.5, delay = 0 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView) return;

        const timer = setTimeout(() => {
            let start = 0;
            const end = parseInt(value);
            const increment = end / (duration * 60);
            const counter = setInterval(() => {
                start += increment;
                if (start >= end) {
                    clearInterval(counter);
                    setCount(end);
                } else {
                    setCount(Math.floor(start));
                }
            }, 1000 / 60);
            return () => clearInterval(counter);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [isInView, value, duration, delay]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{count}{suffix}
        </span>
    );
}

// Verified numbers only - credibility beats inflation
const stats = [
    { value: 25, suffix: '+', label: 'Public Repositories', color: 'text-cyber-green' },
    { value: 13, suffix: '+', label: 'CTFs Competed', color: 'text-cyber-cyan' },
    { value: 5, suffix: '%', prefix: 'TOP ', label: 'TryHackMe Global', color: 'text-cyber-amber' },
    { value: 4, suffix: '+', label: 'Years Writing Code', color: 'text-cyber-magenta' },
];

export default function StatsCounter() {
    return (
        <div className="hud-panel hud-panel--static grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.05] divide-y lg:divide-y-0">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="group px-6 py-8 text-center"
                >
                    <div className={`font-display text-3xl sm:text-4xl font-bold ${stat.color} mb-2.5`}>
                        <AnimatedCounter
                            value={stat.value}
                            suffix={stat.suffix}
                            prefix={stat.prefix || ''}
                            delay={i * 0.12}
                        />
                    </div>
                    <p className="sys-label">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
