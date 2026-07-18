'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { challenges, CTF_CONFIG } from '@/data/ctf';
import CTFTerminal from '@/components/ctf/CTFTerminal';

// ═══════════════════════════════════════════════
// CTF LAB - Main Tactical Command Page
// ═══════════════════════════════════════════════

const diffColors = {
    EASY: { border: 'border-green-500/30', text: 'text-green-400', bg: 'bg-green-500/5', glow: 'shadow-[0_0_25px_rgba(0,255,65,0.12)]', accent: '#00ff41' },
    MEDIUM: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/5', glow: 'shadow-[0_0_25px_rgba(255,176,0,0.12)]', accent: '#ffb000' },
    HARD: { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/5', glow: 'shadow-[0_0_25px_rgba(255,45,85,0.12)]', accent: '#ff2d55' },
};

function getProgress() {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('ctf_progress') || '{}'); } catch { return {}; }
}
function saveProgress(data) {
    localStorage.setItem('ctf_progress', JSON.stringify(data));
}

// Timer hook
function useTimer(active) {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(id);
    }, [active]);
    const fmt = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    return { seconds, formatted: fmt, reset: () => setSeconds(0) };
}

// A simple local particle canvas background just for the CTF lab
function LocalParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let particles = [];
        const count = 40;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Init particles
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: Math.random() * 0.4 + 0.1,
                opacity: Math.random() * 0.4 + 0.1,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                // Loop edges
                if (p.y > canvas.height) {
                    p.y = 0;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < 0 || p.x > canvas.width) {
                    p.speedX = -p.speedX;
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
}

export default function CTFPage() {
    const [selected, setSelected] = useState(null);
    const [flagInput, setFlagInput] = useState('');
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [hints, setHints] = useState({});
    const [progress, setProgress] = useState({});
    const [loadingHint, setLoadingHint] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [missionTime, setMissionTime] = useState('00:00:00 UTC');
    const timer = useTimer(!!selected && !progress[selected?.id]?.solved);

    // Live clock update
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toISOString().split('T')[1].slice(0, 8);
            setMissionTime(`${timeStr} UTC`);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => { setProgress(getProgress()); }, []);

    const totalPoints = Object.values(progress).reduce((sum, p) => sum + (p.points || 0), 0);
    const totalPenalty = Object.values(progress).reduce((sum, p) => sum + (p.hintPenalty || 0), 0);
    const solvedCount = Object.values(progress).filter(p => p.solved).length;

    const submitFlag = useCallback(async () => {
        if (!flagInput.trim() || !selected) return;
        setSubmitting(true);
        setResult(null);
        try {
            const res = await fetch('/api/ctf/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challengeId: selected.id, flag: flagInput.trim() }),
            });
            const data = await res.json();
            setResult(data);
            if (data.valid) {
                const penalty = progress[selected.id]?.hintPenalty || 0;
                const updated = { ...progress, [selected.id]: { solved: true, points: data.points - penalty, hintPenalty: penalty, solvedAt: new Date().toISOString(), time: timer.formatted } };
                setProgress(updated);
                saveProgress(updated);
            }
        } catch { setResult({ valid: false, message: 'Network error. Try again.' }); }
        setSubmitting(false);
    }, [flagInput, selected, progress, timer.formatted]);

    const requestHint = useCallback(async (challengeId, hintIndex) => {
        setLoadingHint(true);
        try {
            const res = await fetch('/api/ctf/hint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ challengeId, hintIndex }) });
            const data = await res.json();
            setHints(prev => ({ ...prev, [challengeId]: [...(prev[challengeId] || []), data.hint] }));
            const penalty = progress[challengeId]?.hintPenalty || 0;
            const updated = { ...progress, [challengeId]: { ...progress[challengeId], hintPenalty: penalty + data.penalty } };
            setProgress(updated);
            saveProgress(updated);
        } catch { }
        setLoadingHint(false);
    }, [progress]);

    const selectChallenge = (c) => {
        setSelected(c);
        setResult(null);
        setFlagInput('');
        setShowTerminal(false);
        timer.reset();
    };

    return (
        <div className="min-h-screen bg-[#030303] text-gray-300 relative select-none">
            {/* Visual background layers */}
            <div className="grid-bg fixed inset-0 opacity-20" aria-hidden="true" />
            <div className="vignette fixed inset-0" aria-hidden="true" />
            <LocalParticleCanvas />

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
                
                {/* ═══ TOP UTILITY BAR (WAR ROOM MODE) ═══ */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-10 font-mono text-[9px] tracking-widest text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="text-cyber-green flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                            SECURE CORE
                        </span>
                        <span className="hidden sm:inline">COORDINATES: 12.9716°N / 77.5946°E</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>SYS_CLOCK: <span className="text-cyber-cyan">{missionTime}</span></span>
                    </div>
                </div>

                {/* ═══ HEADER ═══ */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="flex items-end justify-between flex-wrap gap-6">
                        <div>
                            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-wider mb-2 text-gray-100 flex items-center gap-2">
                                <span className="text-cyber-green">//</span> TACTICAL <span className="bg-gradient-to-r from-cyber-green to-cyber-cyan bg-clip-text text-transparent">CTF_LAB</span>
                            </h1>
                            <p className="font-mono text-[10px] tracking-wide text-gray-500 max-w-lg">
                                Covert sandbox environment containing vulnerabilities. Intercept payloads, bypass validation, recover flags.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowRules(!showRules)}
                            className="font-mono text-[9px] tracking-widest px-4 py-2 border border-white/10 hover:border-cyber-green/40 hover:text-cyber-green transition-all"
                        >
                            {showRules ? '[ COLLAPSE RULES ]' : '[ DECLASSIFY RULES ]'}
                        </button>
                    </div>

                    {/* Rules panel */}
                    <AnimatePresence>
                        {showRules && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }} 
                                className="overflow-hidden"
                            >
                                <div className="mt-6 border border-white/[0.05] bg-[#070707] p-5 grid sm:grid-cols-2 gap-6 font-mono text-xs text-gray-500">
                                    <div>
                                        <h4 className="text-cyber-green tracking-wider mb-2 font-display text-[10px]">// ENGAGEMENT RULES</h4>
                                        <ul className="space-y-1.5 text-[11px]">
                                            <li>• Flag format header: <span className="text-cyber-green font-bold">RKS{'{'} ... {'}'}</span></li>
                                            <li>• Retain payload parameters. Keep targeting dynamic.</li>
                                            <li>• Do not exhaust rate limitations (limit = 5 attempts/min).</li>
                                            <li>• Browser cache saves local credentials locally.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-cyber-cyan tracking-wider mb-2 font-display text-[10px]">// SCORING SYSTEM</h4>
                                        <ul className="space-y-1.5 text-[11px]">
                                            <li>• Easy Unit: <span className="text-cyber-green">200 pts</span></li>
                                            <li>• Medium Unit: <span className="text-cyber-amber">400 pts</span></li>
                                            <li>• Hint Deduction: <span className="text-cyber-magenta">-{CTF_CONFIG.hintPenalty} pts</span> per attempt</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ═══ SCOREBOARD HUD ═══ */}
                    <div className="mt-8 flex items-center gap-4 sm:gap-6 flex-wrap">
                        {[
                            { label: 'SCORE', value: Math.max(0, totalPoints - totalPenalty), color: 'text-cyber-green' },
                            { label: 'SOLVED', value: `${solvedCount}/${challenges.length}`, color: 'text-gray-300' },
                            { label: 'HINTS', value: Object.values(hints).reduce((s, h) => s + h.length, 0), color: 'text-cyber-amber' },
                            { label: 'PENALTY', value: `-${totalPenalty}`, color: 'text-cyber-magenta' },
                        ].map(stat => (
                            <div key={stat.label} className="border border-white/5 bg-white/[0.01] px-4 py-2 min-w-[100px] hud-panel--static relative overflow-hidden">
                                <p className="font-mono text-[8px] tracking-[0.2em] text-gray-600 mb-0.5">{stat.label}</p>
                                <p className={`font-display text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" />
                            </div>
                        ))}

                        {/* Circular ring gauges showing completion */}
                        <div className="flex items-center gap-3 ml-auto sm:border-l sm:border-white/5 sm:pl-6">
                            <span className="font-mono text-[9px] tracking-wider text-gray-600 uppercase">COMPLETION STATE:</span>
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.03)" strokeWidth="3" fill="transparent" />
                                    <circle 
                                        cx="20" 
                                        cy="20" 
                                        r="16" 
                                        stroke="#00ff41" 
                                        strokeWidth="3" 
                                        fill="transparent" 
                                        strokeDasharray={2 * Math.PI * 16}
                                        strokeDashoffset={(2 * Math.PI * 16) * (1 - solvedCount / challenges.length)}
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <span className="absolute font-mono text-[9px] text-gray-400 font-bold">{Math.round((solvedCount / challenges.length) * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ═══ CHALLENGE DOSSIERS ═══ */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {challenges.map((challenge, i) => {
                        const cols = diffColors[challenge.difficulty];
                        const solved = progress[challenge.id]?.solved;
                        const isSelected = selected?.id === challenge.id;

                        return (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => selectChallenge(challenge)}
                                className={`group relative border ${cols.border} ${cols.bg} p-6 cursor-pointer transition-all duration-500 overflow-hidden
                                    ${isSelected ? `${cols.glow} border-white/20` : 'hover:border-white/10'}
                                    ${solved ? 'opacity-40' : ''}`}
                            >
                                {/* Holographic header bar */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />

                                {/* Solved stamp watermark */}
                                {solved && (
                                    <div className="absolute top-4 right-4 rotate-12 z-20">
                                        <span className="font-display text-[9px] tracking-[0.25em] text-cyber-green border border-cyber-green bg-cyber-black px-2 py-0.5 font-bold uppercase shadow-[0_0_8px_rgba(0,255,65,0.2)]">
                                            SOLVED
                                        </span>
                                    </div>
                                )}

                                {/* Dossier metadata */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-[8px] text-gray-500">UNIT {String(i + 1).padStart(2, '0')} // LOCAL_TARGET</span>
                                    <span className={`font-mono text-[8px] tracking-[0.2em] ${cols.text} border border-current/10 px-2 py-0.5`}>
                                        {challenge.points} PTS
                                    </span>
                                </div>

                                <h3 className="font-display text-base tracking-wider text-gray-200 mb-2 font-bold group-hover:text-cyber-green transition-colors">
                                    {challenge.name}
                                </h3>

                                <div className="font-mono text-[9px] tracking-wider text-cyber-cyan/60 mb-4 flex items-center gap-2">
                                    <span>CATEGORY:</span>
                                    <span className="text-gray-400">[{challenge.category}]</span>
                                </div>

                                {/* Challenge description */}
                                <div className="relative font-body text-xs text-gray-400 leading-relaxed mb-4 h-12 overflow-hidden">
                                    <p className="block text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                                        {challenge.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                    {challenge.tags.map(t => (
                                        <span key={t} className="sys-chip cursor-default text-[9px] py-0.5">{t}</span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ═══ CHALLENGE DETAIL PANEL ═══ */}
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="border border-white/5 bg-white/[0.01] p-6 sm:p-8 mb-10 relative overflow-hidden"
                        >
                            {/* Accent indicator */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.4)]" />

                            {/* Header */}
                            <div className="flex items-start justify-between mb-8 pl-2">
                                <div>
                                    <h2 className="font-display text-lg tracking-wider text-gray-100 font-bold uppercase">{selected.name}</h2>
                                    <p className="font-mono text-[9px] text-gray-500 mt-1">OPERATIVE ENGAGEMENT INTERFACE</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {!progress[selected.id]?.solved && (
                                        <span className="font-mono text-xs text-cyber-cyan border border-cyber-cyan/20 bg-cyber-cyan/5 px-2.5 py-1 animate-pulse tracking-widest font-bold">
                                            ELAPSED: {timer.formatted}
                                        </span>
                                    )}
                                    <button 
                                        onClick={() => setSelected(null)} 
                                        className="font-mono text-[10px] text-gray-600 hover:text-cyber-magenta transition-colors"
                                    >
                                        [ DISCONNECT ]
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8 pl-2">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Briefing */}
                                    <div>
                                        <h4 className="font-mono text-[9px] tracking-[0.25em] text-gray-600 mb-2">// INTEL DOSSIER</h4>
                                        <div className="space-y-2 border-l border-white/5 pl-3">
                                            {selected.briefing.map((line, i) => (
                                                <p key={i} className="font-body text-xs text-gray-400">
                                                    <span className="text-cyber-cyan mr-1.5">»</span> {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Connection points */}
                                    <div>
                                        <h4 className="font-mono text-[9px] tracking-[0.25em] text-gray-600 mb-2">// VULNERABLE TARGET ENDPOINTS</h4>
                                        <div className="bg-[#070707] border border-white/5 p-3.5 font-mono text-[11px]">
                                            {selected.endpoints.map(ep => (
                                                <div key={ep} className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-cyber-green">$</span>
                                                    <span className="text-gray-500">endpoint_dialer --url</span>
                                                    <a href={ep} target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">{ep}</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hints */}
                                    <div>
                                        <h4 className="font-mono text-[9px] tracking-[0.25em] text-gray-600 mb-2">
                                            DECRYPTION ASSISTANCE ({hints[selected.id]?.length || 0}/{selected.hintCount})
                                        </h4>
                                        {hints[selected.id]?.map((hint, i) => (
                                            <div key={i} className="bg-cyber-amber/[0.03] border border-cyber-amber/10 p-3 mb-2 font-mono text-[11px] text-cyber-amber/80">
                                                <span className="text-gray-500 font-bold">DECRYPTED DATA #{i + 1}:</span> {hint}
                                            </div>
                                        ))}
                                        {(hints[selected.id]?.length || 0) < selected.hintCount && !progress[selected.id]?.solved && (
                                            <button
                                                onClick={() => requestHint(selected.id, hints[selected.id]?.length || 0)}
                                                disabled={loadingHint}
                                                className="font-mono text-[9px] tracking-widest px-3 py-1.5 border border-cyber-amber/20 text-cyber-amber/50 hover:text-cyber-amber hover:border-cyber-amber/40 transition-all disabled:opacity-30"
                                            >
                                                {loadingHint ? 'RECOVERING...' : `ACQUIRE INTEL INTENSITY (+ penalty)`}
                                            </button>
                                        )}
                                    </div>

                                    {/* Submit Flag */}
                                    <div>
                                        <h4 className="font-mono text-[9px] tracking-[0.25em] text-gray-600 mb-2">// CAPTURED FLAGS</h4>
                                        {progress[selected.id]?.solved ? (
                                            <div className="bg-cyber-green/[0.04] border border-cyber-green/10 p-3.5 font-mono text-xs text-cyber-green">
                                                STATUS: EXPLOIT COMPLETE // SECURED {progress[selected.id].points} PTS in {progress[selected.id].time}
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={flagInput}
                                                    onChange={e => setFlagInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && submitFlag()}
                                                    placeholder="RKS{flag_here}"
                                                    className="flex-1 bg-[#070707] border border-white/5 px-3 py-2 font-mono text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-cyber-cyan/30 transition-colors"
                                                />
                                                <button
                                                    onClick={submitFlag}
                                                    disabled={submitting || !flagInput.trim()}
                                                    className="px-5 py-2 border border-cyber-green/30 text-cyber-green font-mono text-[10px] tracking-widest hover:bg-cyber-green/5 transition-all disabled:opacity-30"
                                                >
                                                    {submitting ? '...' : 'SUBMIT_KEY'}
                                                </button>
                                            </div>
                                        )}
                                        <AnimatePresence>
                                            {result && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className={`mt-2 p-2.5 font-mono text-[11px] border ${result.valid ? 'border-cyber-green/20 bg-cyber-green/5 text-cyber-green' : 'border-cyber-magenta/20 bg-cyber-magenta/5 text-cyber-magenta'}`}>
                                                    {result.message}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Right Column (Terminal Console) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-mono text-[9px] tracking-[0.25em] text-gray-600">// HOST INTERFACE TERMINAL</h4>
                                        <button
                                            onClick={() => setShowTerminal(!showTerminal)}
                                            className="font-mono text-[9px] text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showTerminal ? '[ DEACTIVATE CONSOLE ]' : '[ ACTIVATE CONSOLE ]'}
                                        </button>
                                    </div>
                                    {showTerminal ? (
                                        <CTFTerminal challengeId={selected.id} />
                                    ) : (
                                        <div
                                            onClick={() => setShowTerminal(true)}
                                            className="border border-white/5 bg-[#070707] p-5 cursor-pointer hover:border-white/10 transition-colors flex flex-col justify-center min-h-[220px]"
                                        >
                                            <p className="font-mono text-[10px] text-gray-500 mb-2 text-center">[ UPLINK CONSOLE OFFLINE ]</p>
                                            <p className="font-mono text-[9px] text-cyber-cyan/50 text-center animate-pulse">Click here to establish connection</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ BACK LINK ═══ */}
                <div className="text-center pt-8 pb-4">
                    <a href="/" className="font-mono text-[9px] tracking-widest text-gray-600 hover:text-cyber-green transition-colors">
                        [ ESCAPE_TO_ROOT ]
                    </a>
                </div>
            </div>
        </div>
    );
}
