'use client';

import { useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!?><[]{}|/\\~`';

export default function DecryptText({
    text,
    as: Tag = 'span',
    className = '',
    speed = 30,
    delay = 0,
    trigger = 'scroll', // 'scroll' | 'mount' | 'manual'
    active = true,
    onComplete,
    ...props
}) {
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    const runAnimation = useCallback(() => {
        if (!ref.current || hasAnimated.current) return;
        hasAnimated.current = true;

        const el = ref.current;
        const original = text;
        const len = original.length;
        let iteration = 0;

        const interval = setInterval(() => {
            el.textContent = original
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i < iteration) return original[i];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            if (iteration >= len) {
                clearInterval(interval);
                el.textContent = original;
                if (onComplete) onComplete();
            }
            iteration += 1;
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    useEffect(() => {
        if (!active) return;

        if (trigger === 'mount') {
            const timer = setTimeout(runAnimation, delay);
            return () => clearTimeout(timer);
        }

        if (trigger === 'scroll') {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(runAnimation, delay);
                        observer.disconnect();
                    }
                },
                { threshold: 0.3 }
            );

            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }

        if (trigger === 'manual') {
            const timer = setTimeout(runAnimation, delay);
            return () => clearTimeout(timer);
        }
    }, [trigger, delay, active, runAnimation]);

    return (
        <Tag ref={ref} className={className} data-text={text} {...props}>
            {text}
        </Tag>
    );
}
