'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { profile, typingTestSentences } from '@/data/profile';

export default function TypingChallenge() {
    const [state, setState] = useState('idle'); // idle | active | done
    const [sentence, setSentence] = useState('');
    const [typed, setTyped] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const inputRef = useRef(null);

    const startTest = () => {
        const s = typingTestSentences[Math.floor(Math.random() * typingTestSentences.length)];
        setSentence(s);
        setTyped('');
        setStartTime(null);
        setState('active');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleInput = (e) => {
        const val = e.target.value;
        if (!startTime && val.length === 1) {
            setStartTime(Date.now());
        }
        setTyped(val);

        // Check completion
        if (val === sentence) {
            const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
            const words = sentence.split(' ').length;
            const calculatedWpm = Math.round(words / elapsed);
            setWpm(calculatedWpm);
            setState('done');
        }
    };

    const getMessage = () => {
        if (wpm >= profile.typingSpeed) {
            return {
                text: `${wpm} WPM! Impressive. You might be worthy of the inner circle.`,
                color: 'text-cyber-green',
            };
        } else if (wpm >= profile.typingSpeed * 0.8) {
            return {
                text: `${wpm} WPM. Not bad, but Rakesh types at ${profile.typingSpeed} WPM. Close...`,
                color: 'text-cyber-amber',
            };
        }
        return {
            text: `${wpm} WPM. ACCESS DENIED: Connection too slow for a real operator. (${profile.typingSpeed} WPM required)`,
            color: 'text-cyber-magenta',
        };
    };

    // Character-by-character comparison for coloring
    const renderSentence = () => {
        return sentence.split('').map((char, i) => {
            let color = 'text-gray-600'; // not typed yet
            if (i < typed.length) {
                color = typed[i] === char ? 'text-cyber-green' : 'text-cyber-magenta bg-cyber-magenta/10';
            }
            return (
                <span key={i} className={`${color} font-mono text-sm`}>
                    {char}
                </span>
            );
        });
    };

    return (
        <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
                <div className="border border-cyber-green/10 bg-cyber-dark/30 backdrop-blur-sm p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-display text-lg tracking-wider text-gray-300">
                                SKILL_TEST
                            </h3>
                            <p className="font-mono text-[10px] tracking-wider text-gray-600 mt-1">
                                Can you match Rakesh&apos;s {profile.typingSpeed} WPM?
                            </p>
                        </div>
                        <div className="font-mono text-[10px] text-gray-600 text-right">
                            <p>TARGET: <span className="text-cyber-green">{profile.typingSpeed} WPM</span></p>
                            <p>STATUS: <span className={state === 'active' ? 'text-cyber-amber' : 'text-gray-500'}>
                                {state === 'idle' ? 'STANDBY' : state === 'active' ? 'ACTIVE' : 'COMPLETE'}
                            </span></p>
                        </div>
                    </div>

                    {state === 'idle' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                            <p className="font-mono text-sm text-gray-500 mb-6">
                                Type the sentence as fast as you can. Your WPM will be compared to the operator&apos;s speed.
                            </p>
                            <button
                                onClick={startTest}
                                className="magnetic font-mono text-xs tracking-widest px-6 py-3 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/5 transition-all uppercase"
                            >
                                [INITIATE TEST]
                            </button>
                        </motion.div>
                    )}

                    {state === 'active' && (
                        <div>
                            <div className="p-4 bg-cyber-black/50 border border-cyber-green/5 mb-4 leading-relaxed">
                                {renderSentence()}
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={typed}
                                onChange={handleInput}
                                className="w-full bg-transparent border border-cyber-green/10 p-3 font-mono text-sm text-gray-200 outline-none focus:border-cyber-green/30 transition-colors"
                                placeholder="Start typing..."
                                spellCheck={false}
                                autoComplete="off"
                            />
                            <p className="font-mono text-[10px] text-gray-700 mt-2">
                                {typed.length}/{sentence.length} characters
                            </p>
                        </div>
                    )}

                    {state === 'done' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                            <p className={`font-mono text-sm ${getMessage().color} mb-4`}>
                                {getMessage().text}
                            </p>
                            <button
                                onClick={startTest}
                                className="magnetic font-mono text-xs tracking-widest px-6 py-2 border border-gray-700 text-gray-400 hover:border-cyber-green/30 hover:text-cyber-green transition-all"
                            >
                                [RETRY]
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
