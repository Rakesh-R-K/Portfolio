'use client';

import { useState, useEffect } from 'react';

export default function VisitorCounter() {
    const [count, setCount] = useState(null);
    const [recentVisitors, setRecentVisitors] = useState(0);

    useEffect(() => {
        // Simulate visitor count from localStorage + random
        const stored = localStorage.getItem('visitor_count');
        const base = stored ? parseInt(stored) : Math.floor(Math.random() * 200) + 847;
        const newCount = base + 1;
        localStorage.setItem('visitor_count', newCount.toString());
        setCount(newCount);

        // Simulate "live" visitors (1-5 random)
        setRecentVisitors(Math.floor(Math.random() * 4) + 1);

        // Randomly update live count
        const interval = setInterval(() => {
            setRecentVisitors(Math.floor(Math.random() * 5) + 1);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    if (count === null) return null; // SSR safe

    return (
        <div className="fixed bottom-14 left-4 z-[9980] font-mono text-[10px] tracking-wider">
            <div className="bg-cyber-dark/90 backdrop-blur-sm border border-gray-800/30 px-3 py-2 space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse shadow-[0_0_6px_rgba(0,255,65,0.5)]" />
                    <span>
                        <span className="text-cyber-green">{recentVisitors}</span> operator{recentVisitors !== 1 ? 's' : ''} online
                    </span>
                </div>
                <div className="text-gray-700">
                    Total visits: <span className="text-gray-500">{count.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
