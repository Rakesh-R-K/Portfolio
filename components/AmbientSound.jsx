'use client';

import { useState, useEffect, useRef } from 'react';

export default function AmbientSound() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.15);
    const audioRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Create oscillator-based ambient sound (no external files needed)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        gainNode.gain.value = 0;

        // Create dark ambient drone using multiple oscillators
        const oscillators = [];

        // Deep bass drone
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 55; // A1
        const gain1 = ctx.createGain();
        gain1.gain.value = 0.3;
        osc1.connect(gain1).connect(gainNode);
        oscillators.push(osc1);

        // Mid harmonic
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 82.5; // E2
        const gain2 = ctx.createGain();
        gain2.gain.value = 0.15;
        osc2.connect(gain2).connect(gainNode);
        oscillators.push(osc2);

        // High shimmer
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = 220; // A3
        const gain3 = ctx.createGain();
        gain3.gain.value = 0.05;
        osc3.connect(gain3).connect(gainNode);
        oscillators.push(osc3);

        // Noise for texture
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.02;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 200;
        noise.connect(noiseFilter).connect(noiseGain).connect(gainNode);

        // Slow LFO modulation on bass
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 3;
        lfo.connect(lfoGain).connect(osc1.frequency);

        audioRef.current = { ctx, gainNode, oscillators, noise, lfo, started: false };

        // Restore persisted state
        try {
            const saved = localStorage.getItem('ambient_sound_enabled');
            if (saved === 'true') {
                // Auto-resume requires user interaction first, so we just set the flag
                // The sound will start on the next user interaction
            }
        } catch {}

        return () => {
            if (audioRef.current?.started) {
                oscillators.forEach(o => { try { o.stop(); } catch (e) { } });
                try { noise.stop(); } catch (e) { }
                try { lfo.stop(); } catch (e) { }
            }
            ctx.close();
        };
    }, [mounted]);

    const toggleSound = () => {
        if (!audioRef.current) return;
        const { ctx, gainNode, oscillators, noise, lfo, started } = audioRef.current;

        if (ctx.state === 'suspended') ctx.resume();

        if (!started) {
            oscillators.forEach(o => o.start());
            noise.start();
            lfo.start();
            audioRef.current.started = true;
        }

        if (!isPlaying) {
            gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);
            setIsPlaying(true);
            try { localStorage.setItem('ambient_sound_enabled', 'true'); } catch {}
        } else {
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            setIsPlaying(false);
            try { localStorage.setItem('ambient_sound_enabled', 'false'); } catch {}
        }
    };

    const handleVolume = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current && isPlaying) {
            audioRef.current.gainNode.gain.linearRampToValueAtTime(v, audioRef.current.ctx.currentTime + 0.1);
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9980] font-mono text-[10px] tracking-wider">
            <div className="bg-cyber-dark/90 backdrop-blur-sm border border-gray-800/30 px-3 py-2 flex items-center gap-3">
                <button
                    data-sound-toggle
                    onClick={toggleSound}
                    className={`flex items-center gap-1.5 transition-colors ${isPlaying ? 'text-cyber-green' : 'text-gray-600 hover:text-gray-400'}`}
                    title={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
                >
                    {isPlaying ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                    )}
                    <span>AMBIENT</span>
                </button>
                {isPlaying && (
                    <input
                        type="range"
                        min="0"
                        max="0.4"
                        step="0.01"
                        value={volume}
                        onChange={handleVolume}
                        className="w-16 h-1 appearance-none bg-gray-800 rounded cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber-green"
                    />
                )}
            </div>
        </div>
    );
}
