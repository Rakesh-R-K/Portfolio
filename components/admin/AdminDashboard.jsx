'use client';

import { useState, useEffect, useCallback } from 'react';
import ProfileEditor from './editors/ProfileEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import SkillsEditor from './editors/SkillsEditor';
import TimelineEditor from './editors/TimelineEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import TestimonialsEditor from './editors/TestimonialsEditor';
import CertificationsEditor from './editors/CertificationsEditor';
import MiscEditor from './editors/MiscEditor';
import CTFParticipationsEditor from './editors/CTFParticipationsEditor';

const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: '👤', component: ProfileEditor },
    { id: 'projects', label: 'Projects', icon: '📦', component: ProjectsEditor },
    { id: 'skills', label: 'Skills', icon: '⚡', component: SkillsEditor },
    { id: 'timeline', label: 'Timeline', icon: '📅', component: TimelineEditor },
    { id: 'experience', label: 'Experience', icon: '💼', component: ExperienceEditor },
    { id: 'testimonials', label: 'Testimonials', icon: '💬', component: TestimonialsEditor },
    { id: 'certifications', label: 'Certifications', icon: '🏆', component: CertificationsEditor },
    { id: 'ctf-participations', label: 'CTF History', icon: '🚩', component: CTFParticipationsEditor },
    { id: 'misc', label: 'Miscellaneous', icon: '⚙️', component: MiscEditor },
];

export default function AdminDashboard({ token, onLogout }) {
    const [activeSection, setActiveSection] = useState('profile');
    const [data, setData] = useState({});
    const [meta, setMeta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/portfolio', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                setMeta(result.meta || []);
            } else {
                showToast(result.error || 'Failed to load data', 'error');
            }
        } catch (err) {
            showToast('Connection error', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async (section, sectionData) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/portfolio/${section}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sectionData),
            });
            const result = await res.json();
            if (result.success) {
                setData(prev => ({ ...prev, [section]: sectionData }));
                showToast(`${section} saved successfully`);
            } else {
                showToast(result.error || 'Save failed', 'error');
            }
        } catch {
            showToast('Connection error', 'error');
        } finally {
            setSaving(false);
        }
    };

    const ActiveEditor = SECTIONS.find(s => s.id === activeSection)?.component;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                    <p className="font-mono text-xs text-gray-500 tracking-wider">LOADING CONTENT DATA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 border border-gray-800 bg-[#0d0d0d] font-mono text-xs text-gray-400"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0d0d0d] border-r border-gray-800/40 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-800/30">
                    <h1 className="font-mono text-sm tracking-[0.2em] text-emerald-400">[ADMIN]</h1>
                    <p className="font-mono text-[9px] text-gray-600 mt-1 tracking-wider">PORTFOLIO CMS v1.0</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {SECTIONS.map((section) => {
                        const sectionMeta = meta.find(m => m.section === section.id);
                        return (
                            <button
                                key={section.id}
                                onClick={() => { setActiveSection(section.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${activeSection === section.id
                                    ? 'bg-emerald-500/5 border-r-2 border-emerald-500 text-emerald-400'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
                                    }`}
                            >
                                <span className="text-base">{section.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <span className="font-mono text-xs tracking-wider block">{section.label}</span>
                                    {sectionMeta && (
                                        <span className="font-mono text-[9px] text-gray-700">
                                            {sectionMeta.itemCount != null ? `${sectionMeta.itemCount} items` : ''}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800/30 space-y-3">
                    <button
                        onClick={onLogout}
                        className="w-full py-2 border border-red-500/20 text-red-400/60 font-mono text-[10px] tracking-wider hover:bg-red-500/5 hover:border-red-500/30 transition-all"
                    >
                        DISCONNECT
                    </button>
                    <div className="font-mono text-[8px] text-gray-700 text-center">
                        SESSION ACTIVE • JWT AUTH
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-h-screen lg:ml-0">
                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800/30 px-6 lg:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 ml-10 lg:ml-0">
                        <span className="text-xl">{SECTIONS.find(s => s.id === activeSection)?.icon}</span>
                        <div>
                            <h2 className="font-mono text-sm tracking-wider text-gray-200">
                                {SECTIONS.find(s => s.id === activeSection)?.label.toUpperCase()}
                            </h2>
                            <p className="font-mono text-[9px] text-gray-600 tracking-wider">
                                SECTION: {activeSection}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {saving && (
                            <span className="font-mono text-[10px] text-emerald-400/60 animate-pulse tracking-wider">
                                SAVING...
                            </span>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(0,255,65,0.5)] animate-pulse" />
                            <span className="font-mono text-[10px] text-gray-600 tracking-wider">CONNECTED</span>
                        </div>
                    </div>
                </div>

                {/* Editor content */}
                <div className="p-6 lg:p-10 max-w-6xl">
                    {ActiveEditor && (
                        <ActiveEditor
                            data={data[activeSection]}
                            onSave={(sectionData) => handleSave(activeSection, sectionData)}
                            saving={saving}
                            token={token}
                        />
                    )}
                </div>
            </main>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 font-mono text-xs px-5 py-3 border shadow-lg transition-all duration-300 ${toast.type === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                    {toast.type === 'error' ? '✗' : '✓'} {toast.message}
                </div>
            )}

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
