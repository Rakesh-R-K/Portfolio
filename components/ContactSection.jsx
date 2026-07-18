'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import SectionHeader from './SectionHeader';

const channels = [
    { label: 'GITHUB', url: 'https://github.com/Rakesh-R-K', tag: 'CODE' },
    { label: 'LINKEDIN', url: 'https://www.linkedin.com/in/rakesh-r-k-33a116330/', tag: 'PROFESSIONAL' },
    { label: 'X / TWITTER', url: 'https://x.com/RakeshR71871260', tag: 'PUBLIC' },
    { label: 'MEDIUM', url: 'https://medium.com/@8055.rakeshrk', tag: 'WRITEUPS' },
];

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
        window.location.href = `mailto:${profile.email || 'rakeshrk.pes@gmail.com'}?subject=${subject}&body=${body}`;
        setTimeout(() => {
            setStatus('sent');
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    const fieldClass =
        'w-full bg-transparent border border-white/[0.08] px-4 py-3.5 font-mono text-sm text-gray-200 outline-none focus:border-cyber-green/50 focus:shadow-[0_0_16px_rgba(0,255,65,0.06)] transition-all placeholder:text-gray-700';

    return (
        <section id="contact" className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    index="08"
                    code="UPLINK"
                    title="OPEN A CHANNEL"
                    accent="magenta"
                    status="LISTENING"
                    lede="Got a project, a security question, or an opportunity? Transmission reaches me directly - response time is usually under 24 hours."
                />

                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
                    {/* ── Transmission form ── */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="hud-panel hud-panel--static p-7 sm:p-9 space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <span className="sys-label">NEW_TRANSMISSION</span>
                            <span className="sys-label text-cyber-green/60">ENCRYPTED // MAILTO</span>
                        </div>

                        <div>
                            <label htmlFor="contact-name" className="sys-label block mb-2">
                                <span className="text-cyber-green mr-1">&gt;</span> IDENT
                            </label>
                            <input
                                id="contact-name"
                                type="text"
                                placeholder="your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="contact-email" className="sys-label block mb-2">
                                <span className="text-cyber-green mr-1">&gt;</span> RETURN_ADDRESS
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                placeholder="you@domain.tld"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="contact-message" className="sys-label block mb-2">
                                <span className="text-cyber-green mr-1">&gt;</span> PAYLOAD
                            </label>
                            <textarea
                                id="contact-message"
                                placeholder="type your message…"
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                rows={5}
                                className={`${fieldClass} resize-none`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="magnetic btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'idle' && 'TRANSMIT'}
                            {status === 'sending' && 'ENCRYPTING…'}
                            {status === 'sent' && '✓ TRANSMITTED'}
                            {status === 'error' && '✗ FAILED - RETRY'}
                        </button>
                    </motion.form>

                    {/* ── Channels & coordinates ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Direct mail */}
                        <a
                            href={`mailto:${profile.links.email}`}
                            className="magnetic hud-panel group flex items-center justify-between p-6"
                        >
                            <div className="min-w-0">
                                <p className="sys-label mb-1.5">DIRECT_FREQUENCY</p>
                                <p className="font-mono text-sm text-gray-200 group-hover:text-cyber-green transition-colors truncate">
                                    {profile.links.email}
                                </p>
                            </div>
                            <span className="font-mono text-gray-600 group-hover:text-cyber-green group-hover:translate-x-1 transition-all shrink-0 ml-4">→</span>
                        </a>

                        {/* Social channels */}
                        <div className="hud-panel hud-panel--static">
                            <div className="px-6 py-3.5 border-b border-white/[0.06]">
                                <span className="sys-label">COMM_CHANNELS</span>
                            </div>
                            <div>
                                {channels.map((link, i) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`magnetic group flex items-center justify-between px-6 py-4 hover:bg-cyber-green/[0.03] transition-colors ${i < channels.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                                    >
                                        <span className="font-mono text-xs tracking-[0.18em] text-gray-300 group-hover:text-cyber-green transition-colors">
                                            {link.label}
                                        </span>
                                        <span className="sys-label group-hover:text-gray-400 transition-colors">
                                            {link.tag} <span className="ml-1">↗</span>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="hud-panel hud-panel--static p-6">
                            <p className="sys-label mb-4">BASE_COORDINATES</p>
                            <div className="space-y-2.5">
                                <div className="sys-readout">
                                    <span className="text-gray-600">LOCATION</span>
                                    <span className="text-gray-300">{profile.location.city}, {profile.location.country}</span>
                                </div>
                                <div className="sys-readout">
                                    <span className="text-gray-600">GRID</span>
                                    <span className="text-gray-300">{profile.location.lat}°N / {profile.location.lng}°E</span>
                                </div>
                                <div className="sys-readout">
                                    <span className="text-gray-600">TIMEZONE</span>
                                    <span className="text-gray-300">{profile.location.timezone} (UTC+5:30)</span>
                                </div>
                                <div className="sys-readout">
                                    <span className="text-gray-600">CHANNEL_STATE</span>
                                    <span className="text-cyber-green">ESTABLISHED</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
