'use client';

import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/portfolio/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (data.success) {
                onLogin(data.token);
            } else {
                setError(data.error || 'Authentication failed');
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
        } catch {
            setError('Connection failed');
            setShake(true);
            setTimeout(() => setShake(false), 600);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            {/* Background grid */}
            <div className="fixed inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <div className={`relative w-full max-w-md ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                {/* Terminal window */}
                <div className="border border-emerald-500/15 bg-[#0d0d0d]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,65,0.05)]">
                    {/* Title bar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-500/10 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                        </div>
                        <span className="font-mono text-[10px] tracking-widest text-gray-600">
                            ADMIN_PORTAL
                        </span>
                        <div className="w-16" />
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 border border-emerald-500/20 bg-emerald-500/5 mx-auto">
                                <span className="font-mono text-2xl text-emerald-500">⌘</span>
                            </div>
                            <h1 className="font-mono text-lg tracking-[0.2em] text-gray-200">
                                CONTROL PANEL
                            </h1>
                            <p className="font-mono text-[10px] tracking-wider text-gray-600">
                                PORTFOLIO CONTENT MANAGEMENT SYSTEM
                            </p>
                        </div>

                        {/* Login log */}
                        <div className="font-mono text-[11px] text-gray-600 space-y-1.5 bg-[#080808] border border-gray-800/30 p-4">
                            <p>$ ssh admin@portfolio.local</p>
                            <p className="text-gray-500">Connected to portfolio backend</p>
                            <p className="text-emerald-500/50">Requesting authentication...</p>
                            <p className="text-gray-700">Protocol: JWT-HMAC-SHA256</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-mono text-[10px] tracking-[0.2em] text-gray-500 mb-2">
                                    ACCESS_KEY
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#080808] border border-gray-800/50 px-4 py-3 font-mono text-sm text-emerald-400 outline-none focus:border-emerald-500/30 transition-colors placeholder:text-gray-700 tracking-wider"
                                        placeholder="••••••••••"
                                        required
                                        autoFocus
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <span className="font-mono text-[10px] text-gray-700">🔒</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="font-mono text-[11px] text-red-400/80 bg-red-500/5 border border-red-500/15 px-4 py-2.5 flex items-center gap-2">
                                    <span>✗</span> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 border border-emerald-500/25 text-emerald-400 font-mono text-xs tracking-[0.2em] hover:bg-emerald-500/5 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(0,255,65,0.08)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed relative group overflow-hidden"
                            >
                                <span className="relative z-10">
                                    {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
                                </span>
                                <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        </form>

                        {/* Footer info */}
                        <div className="font-mono text-[9px] text-gray-700 text-center space-y-1">
                            <p>ENCRYPTED CHANNEL • 256-BIT AES</p>
                            <p>SESSION TIMEOUT: 24 HOURS</p>
                        </div>
                    </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-emerald-500/20" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-emerald-500/20" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-emerald-500/20" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-emerald-500/20" />
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 50%, 90% { transform: translateX(-4px); }
                    30%, 70% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
}
