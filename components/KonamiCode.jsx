'use client';

import { useEffect, useState, useCallback } from 'react';

export default function KonamiCode({ onActivate }) {
    const [active, setActive] = useState(false);
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        let index = 0;
        let timeout;

        const handleKey = (e) => {
            if (e.key === sequence[index]) {
                index++;
                clearTimeout(timeout);
                timeout = setTimeout(() => { index = 0; }, 2000);

                if (index === sequence.length) {
                    index = 0;
                    setActive(prev => !prev);
                    if (onActivate) onActivate();
                }
            } else {
                index = 0;
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
            clearTimeout(timeout);
        };
    }, [onActivate]);

    useEffect(() => {
        if (active) {
            document.body.style.fontFamily = '"Comic Sans MS", "Comic Sans", cursive';
            // Add rainbow background
            const el = document.createElement('div');
            el.id = 'konami-overlay';
            el.style.cssText = 'position:fixed;inset:0;z-index:20000;pointer-events:none;background:linear-gradient(45deg,rgba(255,0,0,0.05),rgba(0,255,0,0.05),rgba(0,0,255,0.05));animation:rainbow 2s linear infinite;';
            document.body.appendChild(el);

            // Show notification
            const notif = document.createElement('div');
            notif.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[20001] bg-yellow-500 text-black font-bold px-6 py-3 text-sm rounded shadow-xl';
            notif.style.fontFamily = '"Comic Sans MS", cursive';
            notif.textContent = '🎮 KONAMI CODE ACTIVATED! Everything is Comic Sans now. Press ↑↑↓↓←→←→BA again to revert.';
            document.body.appendChild(notif);
            setTimeout(() => notif?.remove(), 5000);

            return () => {
                document.body.style.fontFamily = '';
                document.getElementById('konami-overlay')?.remove();
            };
        }
    }, [active]);

    return null;
}
