'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skills = [
    { name: 'Pentesting', value: 85, fullMark: 100 },
    { name: 'Networking', value: 90, fullMark: 100 },
    { name: 'Forensics', value: 82, fullMark: 100 },
    { name: 'Cryptography', value: 78, fullMark: 100 },
    { name: 'Web Security', value: 88, fullMark: 100 },
    { name: 'Red Teaming', value: 80, fullMark: 100 },
];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function getPolygonPoints(centerX, centerY, radius, sides) {
    const points = [];
    for (let i = 0; i < sides; i++) {
        const angle = (360 / sides) * i;
        const point = polarToCartesian(centerX, centerY, radius, angle);
        points.push(`${point.x},${point.y}`);
    }
    return points.join(' ');
}

function getSkillPoints(centerX, centerY, maxRadius, values, sides) {
    const points = [];
    for (let i = 0; i < sides; i++) {
        const angle = (360 / sides) * i;
        const value = (values[i] / 100) * maxRadius;
        const point = polarToCartesian(centerX, centerY, value, angle);
        points.push(`${point.x},${point.y}`);
    }
    return points.join(' ');
}

export default function SkillRadar() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const cx = 150, cy = 150, maxR = 110;
    const sides = skills.length;
    const values = skills.map(s => s.value);

    // Grid rings
    const rings = [0.25, 0.5, 0.75, 1.0];

    return (
        <div ref={ref} className="flex flex-col lg:flex-row items-center gap-10">
            <div className="relative w-[300px] h-[300px] shrink-0">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Grid rings */}
                    {rings.map((scale, i) => (
                        <polygon
                            key={i}
                            points={getPolygonPoints(cx, cy, maxR * scale, sides)}
                            fill="none"
                            stroke="rgba(0,255,65,0.08)"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Axis lines */}
                    {skills.map((_, i) => {
                        const point = polarToCartesian(cx, cy, maxR, (360 / sides) * i);
                        return (
                            <line key={i} x1={cx} y1={cy} x2={point.x} y2={point.y}
                                stroke="rgba(0,255,65,0.06)" strokeWidth="0.5" />
                        );
                    })}

                    {/* Skill polygon */}
                    <motion.polygon
                        points={isInView ? getSkillPoints(cx, cy, maxR, values, sides) : getPolygonPoints(cx, cy, 0, sides)}
                        fill="rgba(0,255,65,0.08)"
                        stroke="rgba(0,255,65,0.6)"
                        strokeWidth="1.5"
                        initial={false}
                        animate={{
                            points: isInView ? getSkillPoints(cx, cy, maxR, values, sides) : getPolygonPoints(cx, cy, 0, sides),
                        }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />

                    {/* Skill dots + labels */}
                    {skills.map((skill, i) => {
                        const labelPoint = polarToCartesian(cx, cy, maxR + 20, (360 / sides) * i);
                        const dotPoint = polarToCartesian(cx, cy, (skill.value / 100) * maxR, (360 / sides) * i);
                        return (
                            <g key={skill.name}>
                                <motion.circle
                                    cx={isInView ? dotPoint.x : cx}
                                    cy={isInView ? dotPoint.y : cy}
                                    r="3"
                                    fill="#00ff41"
                                    initial={false}
                                    animate={{
                                        cx: isInView ? dotPoint.x : cx,
                                        cy: isInView ? dotPoint.y : cy,
                                        opacity: isInView ? 1 : 0,
                                    }}
                                    transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                                >
                                    <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
                                </motion.circle>
                                <text
                                    x={labelPoint.x}
                                    y={labelPoint.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-gray-500 text-[9px] font-mono tracking-wider"
                                >
                                    {skill.name.toUpperCase()}
                                </text>
                            </g>
                        );
                    })}

                    {/* Center pulse */}
                    <circle cx={cx} cy={cy} r="2" fill="#00ff41" opacity="0.6">
                        <animate attributeName="r" values="2;5;2" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                    </circle>
                </svg>
            </div>

            {/* Legend */}
            <div className="space-y-3 w-full max-w-xs">
                <h4 className="font-mono text-[10px] tracking-[0.3em] text-gray-600 mb-4">THREAT_PROFICIENCY</h4>
                {skills.map((skill, i) => (
                    <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center justify-between group"
                    >
                        <span className="font-mono text-xs text-gray-500 group-hover:text-cyber-green transition-colors">{skill.name}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-gray-900 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: `${skill.value}%` } : {}}
                                    transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                                    className="h-full bg-cyber-green/50"
                                />
                            </div>
                            <span className="font-mono text-[10px] text-cyber-green/60">{skill.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
