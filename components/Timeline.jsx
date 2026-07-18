'use client';

import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const milestones = [
    {
        year: '2021',
        title: 'FIRST LINE OF CODE',
        description: 'Started learning Python and fell in love with problem-solving. Built small automation scripts and explored how things work under the hood.',
        tags: ['Python', 'Basics'],
        accent: 'text-gray-400',
    },
    {
        year: '2022',
        title: 'DISCOVERED CYBERSECURITY',
        description: 'Attended my first CTF competition and got hooked. Started exploring Kali Linux, Wireshark, and the world of ethical hacking. No turning back.',
        tags: ['CTF', 'Kali Linux', 'Wireshark'],
        accent: 'text-cyber-green',
    },
    {
        year: '2023',
        title: 'JOINED PES UNIVERSITY',
        description: 'Started B.Tech in Computer Science & Engineering. Deep dive into networking, data structures, and system internals. Built first full-stack projects.',
        tags: ['B.Tech CSE', 'PES University', 'MERN Stack'],
        accent: 'text-cyber-cyan',
    },
    {
        year: '2024',
        title: 'BUILDING OFFENSIVE TOOLS',
        description: 'Created GhostNet (DNS tunneling framework), ForenScope (forensics toolkit), and the Port Knocking Authentication system. Started contributing to offensive security.',
        tags: ['GhostNet', 'ForenScope', 'Port Knocking'],
        accent: 'text-cyber-amber',
    },
    {
        year: '2025',
        title: 'AI MEETS SECURITY',
        description: 'Built KALP_AI (SLM-driven pentesting) and SentinelHunt (AI threat hunting with SHAP). Bridging the gap between AI/ML and offensive security. Active CTF player and open-source contributor.',
        tags: ['KALP_AI', 'SentinelHunt', 'AI4Kali', 'SHAP'],
        accent: 'text-cyber-magenta',
    },
];

export default function Timeline() {
    return (
        <section className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20">
            <div className="max-w-5xl mx-auto">
                <SectionHeader
                    index="02"
                    code="TRAJECTORY"
                    title="THE JOURNEY"
                    accent="cyan"
                    status="LOG.REPLAY"
                    lede="From a first Python script to AI-powered offensive security tooling - every waypoint on the route so far."
                />

                <div className="relative">
                    {/* Spine */}
                    <div className="absolute left-[52px] sm:left-[68px] top-2 bottom-2 w-px bg-gradient-to-b from-cyber-green/25 via-cyber-cyan/15 to-transparent" aria-hidden="true" />

                    <div className="space-y-10">
                        {milestones.map((milestone, i) => (
                            <motion.div
                                key={milestone.year}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex gap-6 sm:gap-10 group"
                            >
                                {/* Year node */}
                                <div className="relative z-10 shrink-0 w-[104px] sm:w-[136px] flex justify-center">
                                    <div className="hud-panel hud-panel--static px-3 py-2 bg-cyber-black">
                                        <span className={`font-mono text-xs sm:text-sm font-bold tracking-[0.2em] ${milestone.accent}`}>
                                            {milestone.year}
                                        </span>
                                    </div>
                                </div>

                                {/* Entry */}
                                <div className="flex-1 pb-2 pt-1">
                                    <h3 className="font-display text-base sm:text-lg tracking-[0.12em] text-gray-200 mb-2 group-hover:text-cyber-green transition-colors">
                                        {milestone.title}
                                    </h3>
                                    <p className="font-body text-sm text-gray-500 leading-relaxed mb-3 max-w-2xl">
                                        {milestone.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {milestone.tags.map((tag) => (
                                            <span key={tag} className="sys-chip cursor-default">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
