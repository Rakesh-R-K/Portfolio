'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/profile';
import ProjectCard from './ProjectCard';
import SectionHeader from './SectionHeader';

const filters = [
    { id: 'ALL', label: 'ALL UNITS' },
    { id: 'RED_TEAM', label: 'RED TEAM' },
    { id: 'BLUE_TEAM', label: 'BLUE TEAM' },
    { id: 'OTHER', label: 'SUPPORT' },
];

export default function ProjectsSection({ onHoverIP }) {
    const [filter, setFilter] = useState('ALL');

    const visible = useMemo(() => {
        if (filter === 'ALL') return projects;
        if (filter === 'OTHER') return projects.filter(p => p.team !== 'RED_TEAM' && p.team !== 'BLUE_TEAM');
        return projects.filter(p => p.team === filter);
    }, [filter]);

    const counts = useMemo(() => ({
        ALL: projects.length,
        RED_TEAM: projects.filter(p => p.team === 'RED_TEAM').length,
        BLUE_TEAM: projects.filter(p => p.team === 'BLUE_TEAM').length,
        OTHER: projects.filter(p => p.team !== 'RED_TEAM' && p.team !== 'BLUE_TEAM').length,
    }), []);

    const showFeatured = filter === 'ALL';

    return (
        <section id="projects" className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20 scroll-mt-24">
            <div className="max-w-7xl mx-auto">
                <SectionHeader
                    index="03"
                    code="OPERATIONS"
                    title="PROJECTS"
                    status="DEPLOYED"
                    lede="Operations in the field - from AI pentesting frameworks to DNS tunneling tools. Built to solve real-world security challenges."
                />

                {/* Filter rail */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap items-center gap-2 mb-10"
                >
                    <span className="sys-label mr-3 hidden sm:inline">FILTER //</span>
                    {filters.map((f) => {
                        const isActive = filter === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`magnetic font-mono text-[11px] tracking-[0.18em] px-4 py-2 border transition-all duration-300 ${isActive
                                    ? 'border-cyber-green/50 text-cyber-green bg-cyber-green/[0.06] shadow-[0_0_16px_rgba(0,255,65,0.08)]'
                                    : 'border-white/[0.08] text-gray-500 hover:text-gray-200 hover:border-white/20'
                                    }`}
                            >
                                {f.label}
                                <span className={`ml-2 text-[9px] ${isActive ? 'text-cyber-green/60' : 'text-gray-700'}`}>
                                    {String(counts[f.id]).padStart(2, '0')}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
                    >
                        {visible.map((project, i) => {
                            const featured = showFeatured && i === 0;
                            return (
                                <div key={project.id} className={featured ? 'md:col-span-2' : ''}>
                                    <ProjectCard
                                        project={project}
                                        index={i}
                                        featured={featured}
                                        onHoverIP={project.scrambleIP ? onHoverIP : undefined}
                                    />
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Console readout */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-8 font-mono text-[11px] text-gray-600 tracking-wide"
                >
                    <span className="text-gray-700">$ ls /operations --filter={filter.toLowerCase()}</span>
                    <span className="text-cyber-green/70 ml-3">→ {visible.length} unit{visible.length === 1 ? '' : 's'} returned</span>
                </motion.p>
            </div>
        </section>
    );
}
