'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function MatrixRain({ active, onComplete }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const startTime = useRef(null);

    const DURATION = 5000; // 5 seconds

    const draw = useCallback((ctx, cols, drops, fontSize, w, h) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        const chars = 'アカサタナハマヤラワ0123456789ABCDEF@#$%^&*';

        for (let i = 0; i < drops.length; i++) {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Subtle color variation
            if (Math.random() < 0.02) {
                ctx.fillStyle = '#00f0ff';
            } else if (Math.random() < 0.01) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = `rgba(0, 255, 65, ${0.6 + Math.random() * 0.4})`;
            }

            ctx.fillText(ch, x, y);

            if (y > h && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, []);

    useEffect(() => {
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        const fontSize = 14;
        const cols = Math.floor(w / fontSize);
        const drops = Array(cols).fill(1);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        startTime.current = Date.now();

        const loop = () => {
            const elapsed = Date.now() - startTime.current;
            if (elapsed > DURATION) {
                if (onComplete) onComplete();
                return;
            }
            draw(ctx, cols, drops, fontSize, w, h);
            animRef.current = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animRef.current);
    }, [active, draw, onComplete]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-[20000]">
            <canvas ref={canvasRef} className="w-full h-full" />
            {/* Overlay text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <p className="font-display text-4xl md:text-6xl text-cyber-green glow-green tracking-widest mb-4">
                        SYSTEM OVERRIDDEN
                    </p>
                    <p className="font-mono text-sm text-cyber-green/60 tracking-wider">
                        [ALL ACCESS POINTS COMPROMISED]
                    </p>
                </div>
            </div>
        </div>
    );
}
