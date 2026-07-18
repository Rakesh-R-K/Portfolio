'use client';

import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const education = [
    {
        period: '2023 - 2027',
        degree: 'B.Tech Computer Science & Engineering',
        institution: 'PES University, Bengaluru',
        focus: 'Cybersecurity & Networking',
        gpa: '7.57 CGPA',
        highlights: ['Network Security Lab', 'CTF Club Member', 'Offensive Security Research Group', 'Distinction Scholarship - SGPA 8.58'],
    },
];

const experience = [
    {
        period: '2025 - PRESENT',
        role: 'Independent Security Researcher',
        org: 'Self-directed',
        type: 'RESEARCH',
        description: 'Building open-source offensive security tools. Published GhostNet (DNS tunneling framework), KALP_AI (AI pentesting), and SentinelHunt (threat hunting).',
        tech: ['Python', 'Go', 'Rust', 'React'],
    },
    {
        period: '2024 - PRESENT',
        role: 'Active CTF Competitor',
        org: 'CTFTime / national circuits',
        type: 'COMPETITIONS',
        description: 'Competing across reverse engineering, forensics, web exploitation, and cryptography. 13+ engagements, best finish #2 at IIT Hyderabad’s Enigma CTF.',
        tech: ['RE', 'Forensics', 'Web Exploit', 'Crypto'],
    },
];

export default function ExperienceEducation() {
    return (
        <section className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    index="07"
                    code="SERVICE_RECORD"
                    title="EXPERIENCE"
                    accent="amber"
                    status="ON FILE"
                    lede="Academic foundation and hands-on security work - building, breaking, and researching."
                />

                <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">
                    {/* Field operations */}
                    <div className="hud-panel p-7 sm:p-8">
                        <p className="sys-label mb-7">FIELD_OPERATIONS</p>
                        <div>
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={exp.role}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    className="group relative pl-7 pb-8 last:pb-0 border-l border-white/[0.08] hover:border-cyber-green/30 transition-colors"
                                >
                                    <span className="absolute left-[-4.5px] top-1 w-2 h-2 bg-cyber-black border border-gray-600 group-hover:border-cyber-green group-hover:bg-cyber-green/30 group-hover:shadow-[0_0_8px_rgba(0,255,65,0.4)] transition-all" />

                                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1.5">
                                        <h4 className="font-display text-[15px] tracking-[0.1em] text-gray-200 group-hover:text-cyber-green transition-colors">
                                            {exp.role}
                                        </h4>
                                        <span className="font-mono text-[10px] tracking-[0.15em] text-cyber-green/60 tabular-nums">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className="sys-label mb-3">{exp.org} - {exp.type}</p>
                                    <p className="font-body text-sm text-gray-500 leading-relaxed mb-3">
                                        {exp.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {exp.tech.map((t) => (
                                            <span key={t} className="sys-chip">{t}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Training facility */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        {education.map((edu) => (
                            <motion.div
                                key={edu.degree}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15, duration: 0.55 }}
                                className="hud-panel hud-panel--cyan p-7 sm:p-8"
                            >
                                <p className="sys-label !text-cyber-cyan/70 mb-6">TRAINING_FACILITY</p>

                                <h4 className="font-display text-base tracking-[0.1em] text-gray-100 leading-snug">
                                    {edu.degree}
                                </h4>
                                <p className="font-mono text-[11px] tracking-[0.12em] text-gray-500 mt-1.5 mb-6">
                                    {edu.institution}
                                </p>

                                <div className="space-y-2.5 mb-6">
                                    <div className="sys-readout">
                                        <span className="text-gray-600">PERIOD</span>
                                        <span className="text-gray-300">{edu.period}</span>
                                    </div>
                                    <div className="sys-readout">
                                        <span className="text-gray-600">FOCUS</span>
                                        <span className="text-gray-300">{edu.focus}</span>
                                    </div>
                                    <div className="sys-readout">
                                        <span className="text-gray-600">GPA</span>
                                        <span className="text-cyber-cyan">{edu.gpa}</span>
                                    </div>
                                </div>

                                <div className="rule-h mb-5" />

                                <p className="sys-label mb-3">ACTIVITIES</p>
                                <ul className="space-y-2">
                                    {edu.highlights.map((h) => (
                                        <li key={h} className="flex items-start gap-2.5 font-mono text-[11px] text-gray-400 leading-relaxed">
                                            <span className="text-cyber-cyan/50 shrink-0">▸</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
