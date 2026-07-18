'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/profile';
import SectionHeader from './SectionHeader';
import SkillRadar from './SkillRadar';

const SEGMENTS = 20;

function SegmentMeter({ name, level, tone = '', delay = 0 }) {
    const lit = Math.round((level / 100) * SEGMENTS);

    return (
        <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.45 }}
            className="group"
        >
            <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs tracking-[0.1em] text-gray-400 group-hover:text-gray-100 transition-colors">
                    {name}
                </span>
                <span className="font-mono text-[10px] text-gray-600 tabular-nums">
                    {level}<span className="text-gray-700">/100</span>
                </span>
            </div>
            <div className={`seg-meter ${tone}`} role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={name}>
                {Array.from({ length: SEGMENTS }, (_, i) => (
                    <motion.span
                        key={i}
                        className={i < lit ? 'on' : ''}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: delay + i * 0.02, duration: 0.2 }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export default function SkillsSection() {
    return (
        <section id="skills" className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    index="06"
                    code="CAPABILITIES"
                    title="SKILL SET"
                    accent="cyan"
                    status="CALIBRATED"
                    lede="Languages, frameworks, and security tooling in daily rotation - from Python exploits to React dashboards."
                />

                {/* Radar */}
                <div className="hud-panel hud-panel--cyan hud-panel--static mb-8 p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <span className="sys-label">SECURITY_RADAR</span>
                        <span className="sys-label text-cyber-cyan/60">LIVE SCAN</span>
                    </div>
                    <SkillRadar />
                </div>

                {/* Capability columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Offensive / security */}
                    <div className="hud-panel p-7">
                        <p className="sys-label !text-cyber-green/70 mb-6">CYBERSECURITY</p>
                        <div className="space-y-5">
                            {skills.cybersecurity.map((skill, i) => (
                                <SegmentMeter key={skill.name} name={skill.name} level={skill.level} delay={i * 0.04} />
                            ))}
                        </div>
                    </div>

                    {/* Programming + web */}
                    <div className="hud-panel hud-panel--cyan p-7">
                        <p className="sys-label !text-cyber-cyan/70 mb-6">PROGRAMMING</p>
                        <div className="space-y-5">
                            {skills.programming.map((skill, i) => (
                                <SegmentMeter key={skill.name} name={skill.name} level={skill.level} tone="seg-meter--cyan" delay={i * 0.04} />
                            ))}
                        </div>

                        <div className="rule-h my-7" />

                        <p className="sys-label !text-cyber-magenta/70 mb-6">WEB &amp; CREATIVE</p>
                        <div className="space-y-5">
                            {skills.web.map((skill, i) => (
                                <SegmentMeter key={skill.name} name={skill.name} level={skill.level} tone="seg-meter--magenta" delay={i * 0.04} />
                            ))}
                        </div>
                    </div>

                    {/* Arsenal */}
                    <div className="hud-panel hud-panel--amber p-7">
                        <p className="sys-label !text-cyber-amber/70 mb-6">FIELD_ARSENAL</p>
                        <div className="flex flex-wrap gap-2">
                            {skills.tools.map((tool, i) => (
                                <motion.span
                                    key={tool}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.025, duration: 0.3 }}
                                    className="sys-chip cursor-default"
                                >
                                    {tool}
                                </motion.span>
                            ))}
                        </div>

                        <div className="rule-h my-7" />

                        <p className="sys-label mb-4">CERTIFICATION_TRACK</p>
                        <div className="space-y-2.5">
                            <div className="sys-readout">
                                <span className="text-gray-600">TryHackMe</span>
                                <span className="text-cyber-green">TOP 5% GLOBAL</span>
                            </div>
                            <div className="sys-readout">
                                <span className="text-gray-600">Corizo Cybersecurity</span>
                                <span className="text-gray-300">CERTIFIED</span>
                            </div>
                            <div className="sys-readout">
                                <span className="text-gray-600">Distinction Scholarship</span>
                                <span className="text-gray-300">SGPA 8.58</span>
                            </div>
                            <div className="sys-readout">
                                <span className="text-gray-600">OSCP</span>
                                <span className="text-cyber-amber">IN PURSUIT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
