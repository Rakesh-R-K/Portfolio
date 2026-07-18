'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const teamStyles = {
    RED_TEAM: {
        panel: 'hud-panel--magenta',
        text: 'text-cyber-magenta',
        chip: 'border-cyber-magenta/30 text-cyber-magenta bg-cyber-magenta/5',
    },
    BLUE_TEAM: {
        panel: 'hud-panel--cyan',
        text: 'text-cyber-cyan',
        chip: 'border-cyber-cyan/30 text-cyber-cyan bg-cyber-cyan/5',
    },
    DEFAULT: {
        panel: '',
        text: 'text-cyber-green',
        chip: 'border-cyber-green/30 text-cyber-green bg-cyber-green/5',
    },
};

const statusColor = (status) =>
    status === 'ACTIVE' ? 'text-cyber-green' :
        status === 'OPERATIONAL' ? 'text-cyber-cyan' :
            'text-gray-400';

export default function ProjectCard({ project, index, onHoverIP, featured = false }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const router = useRouter();

    const team = teamStyles[project.team] || teamStyles.DEFAULT;
    const isGhost = false;

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (project.invisible) setIsScanned(true);
        if (project.scrambleIP && onHoverIP) onHoverIP(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (project.scrambleIP && onHoverIP) onHoverIP(false);
    };

    return (
        <motion.article
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => router.push(`/projects/${project.id}`)}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: (index % 2) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`magnetic group cursor-pointer transition-all duration-500 ${isGhost ? 'opacity-20 blur-[3px]' : ''}`}
        >
            <div className={`hud-panel mouse-glow-card holo-shimmer ${team.panel} h-full flex flex-col overflow-hidden ${isHovered ? '-translate-y-1' : ''} transition-transform duration-500`}>
                {/* Scan sweep for the ghost project */}
                {project.invisible && isHovered && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-green/10 to-transparent"
                            style={{ animation: 'scan-sweep 1.5s ease-in-out' }}
                        />
                    </div>
                )}

                {/* Header strip */}
                <div className="flex items-center justify-between gap-3 px-6 pt-5">
                    <span className="sys-label">
                        OP.{String(index + 1).padStart(2, '0')}
                        <span className="mx-2 text-gray-800">/</span>
                        {project.type}
                    </span>
                    <span className={`font-mono text-[9px] tracking-[0.15em] px-2 py-1 border ${team.chip}`}>
                        {project.team}
                    </span>
                </div>

                {/* Body */}
                <div className={`px-6 pb-6 pt-4 flex flex-col flex-1 ${featured ? 'lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-10' : ''}`}>
                    <div className="flex flex-col">
                        <h3 className="font-display text-lg sm:text-xl tracking-[0.15em] mb-1.5">
                            <span className={`transition-colors duration-300 ${isHovered ? team.text : 'text-gray-100'}`}>{project.name}</span>
                        </h3>
                        <p className="sys-label mb-4">{project.classification}</p>

                        <p className={`font-body text-sm text-gray-400 leading-relaxed mb-5 ${featured ? '' : 'line-clamp-3'}`}>
                            {project.description}
                        </p>

                        {/* Tech */}
                        <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                            {project.tech.map((tech) => (
                                <span key={tech} className="sys-chip">{tech}</span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                            <span className={`font-mono text-[10px] tracking-[0.18em] ${statusColor(project.status)}`}>
                                <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 bg-current shadow-[0_0_6px_currentColor] align-middle" />
                                {project.status}
                            </span>
                            <span className={`font-mono text-[10px] tracking-[0.18em] transition-colors flex items-center gap-1.5 ${isHovered ? team.text : 'text-gray-600'}`}>
                                OPEN BRIEF
                                <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
                            </span>
                        </div>
                    </div>

                    {/* Featured: capability list */}
                    {featured && (
                        <div className="hidden lg:block border-l border-white/[0.05] pl-8 self-center">
                            <p className="sys-label mb-4">CAPABILITIES</p>
                            <ul className="space-y-2.5">
                                {project.features.slice(0, 5).map((feature) => (
                                    <li key={feature} className="flex items-start gap-2.5 font-mono text-[11px] text-gray-500 leading-relaxed">
                                        <span className={`${team.text} opacity-60 shrink-0 mt-px`}>▸</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
