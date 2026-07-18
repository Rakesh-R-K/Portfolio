'use client';

import { useState, useEffect } from 'react';

const roles = [
    'Penetration Tester',
    'Security Researcher',
    'CTF Player',
    'Full-Stack Developer',
    'Network Architect',
    'AI/ML Enthusiast',
];

export default function TypewriterRoles({ className = '' }) {
    const [currentRole, setCurrentRole] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const text = roles[currentRole];
        let timeout;

        if (!isDeleting && displayed === text) {
            // Pause at full text
            timeout = setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && displayed === '') {
            // Move to next role
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
        } else if (isDeleting) {
            // Delete character
            timeout = setTimeout(() => {
                setDisplayed(text.slice(0, displayed.length - 1));
            }, 30);
        } else {
            // Type character
            timeout = setTimeout(() => {
                setDisplayed(text.slice(0, displayed.length + 1));
            }, 60);
        }

        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, currentRole]);

    return (
        <span className={className}>
            {displayed}
            <span className="animate-pulse text-cyber-green ml-0.5">|</span>
        </span>
    );
}
