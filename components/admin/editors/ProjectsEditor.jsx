'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function ProjectsEditor({ data, onSave, saving }) {
    const [form, setForm] = useState(data || { projects: [], additionalProjects: [] });
    const [activeTab, setActiveTab] = useState('main');

    useEffect(() => { if (data) setForm(data); }, [data]);

    const updateProject = (index, field, value) => {
        const list = activeTab === 'main' ? 'projects' : 'additionalProjects';
        setForm(prev => {
            const arr = [...(prev[list] || [])];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [list]: arr };
        });
    };

    const addProject = () => {
        const list = activeTab === 'main' ? 'projects' : 'additionalProjects';
        const template = activeTab === 'main'
            ? { id: `proj-${Date.now()}`, name: '', type: '', classification: '', team: '', status: 'ACTIVE', description: '', tech: [], features: [], github: '', icon: 'code' }
            : { name: '', description: '', tech: [], github: '' };
        setForm(prev => ({
            ...prev,
            [list]: [...(prev[list] || []), template],
        }));
    };

    const removeProject = (index) => {
        const list = activeTab === 'main' ? 'projects' : 'additionalProjects';
        setForm(prev => ({
            ...prev,
            [list]: (prev[list] || []).filter((_, i) => i !== index),
        }));
    };

    const moveProject = (index, direction) => {
        const list = activeTab === 'main' ? 'projects' : 'additionalProjects';
        setForm(prev => {
            const arr = [...(prev[list] || [])];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= arr.length) return prev;
            [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
            return { ...prev, [list]: arr };
        });
    };

    const projects = activeTab === 'main' ? (form.projects || []) : (form.additionalProjects || []);

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2">
                {[
                    { id: 'main', label: `MAIN PROJECTS (${(form.projects || []).length})` },
                    { id: 'additional', label: `ADDITIONAL (${(form.additionalProjects || []).length})` },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-mono text-[10px] tracking-wider border transition-all ${activeTab === tab.id
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                            : 'border-gray-800/30 text-gray-600 hover:text-gray-400'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Project list */}
            {projects.map((project, i) => (
                <Section key={project.id || project.name || i} title={`${project.name || 'NEW PROJECT'} ${project.status ? `[${project.status}]` : ''}`}>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => moveProject(i, -1)} disabled={i === 0} className="font-mono text-xs text-gray-600 hover:text-emerald-400 disabled:opacity-20 px-2">▲</button>
                        <button onClick={() => moveProject(i, 1)} disabled={i === projects.length - 1} className="font-mono text-xs text-gray-600 hover:text-emerald-400 disabled:opacity-20 px-2">▼</button>
                        <div className="flex-1" />
                        <button onClick={() => removeProject(i)} className="font-mono text-[10px] text-red-400/60 hover:text-red-400 px-3 py-1 border border-red-500/15 hover:border-red-500/30">DELETE</button>
                    </div>

                    {activeTab === 'main' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="ID" value={project.id} onChange={v => updateProject(i, 'id', v)} />
                                <InputField label="Name" value={project.name} onChange={v => updateProject(i, 'name', v)} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <InputField label="Type" value={project.type} onChange={v => updateProject(i, 'type', v)} />
                                <InputField label="Team" value={project.team} onChange={v => updateProject(i, 'team', v)} />
                                <InputField label="Status" value={project.status} onChange={v => updateProject(i, 'status', v)} />
                            </div>
                            <InputField label="Classification" value={project.classification} onChange={v => updateProject(i, 'classification', v)} />
                            <TextArea label="Description" value={project.description} onChange={v => updateProject(i, 'description', v)} />
                            <InputField label="GitHub URL" value={project.github} onChange={v => updateProject(i, 'github', v)} />
                            <InputField label="Icon" value={project.icon} onChange={v => updateProject(i, 'icon', v)} />
                            <InputField label="Tech (comma-separated)" value={(project.tech || []).join(', ')} onChange={v => updateProject(i, 'tech', v.split(',').map(t => t.trim()).filter(Boolean))} />
                            <TextArea label="Features (one per line)" value={(project.features || []).join('\n')} onChange={v => updateProject(i, 'features', v.split('\n').filter(Boolean))} rows={4} />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 font-mono text-xs text-gray-500">
                                    <input type="checkbox" checked={project.invisible || false} onChange={e => updateProject(i, 'invisible', e.target.checked)} className="accent-emerald-500" />
                                    Invisible (hidden by default)
                                </label>
                                <label className="flex items-center gap-2 font-mono text-xs text-gray-500">
                                    <input type="checkbox" checked={project.scrambleIP || false} onChange={e => updateProject(i, 'scrambleIP', e.target.checked)} className="accent-emerald-500" />
                                    Scramble IP on hover
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <InputField label="Name" value={project.name} onChange={v => updateProject(i, 'name', v)} />
                            <TextArea label="Description" value={project.description} onChange={v => updateProject(i, 'description', v)} />
                            <InputField label="GitHub URL" value={project.github} onChange={v => updateProject(i, 'github', v)} />
                            <InputField label="Tech (comma-separated)" value={(project.tech || []).join(', ')} onChange={v => updateProject(i, 'tech', v.split(',').map(t => t.trim()).filter(Boolean))} />
                        </>
                    )}
                </Section>
            ))}

            <button onClick={addProject} className="w-full py-3 border border-dashed border-emerald-500/20 text-emerald-400/60 font-mono text-xs tracking-wider hover:bg-emerald-500/5 hover:text-emerald-400 transition-all">
                + ADD {activeTab === 'main' ? 'PROJECT' : 'ADDITIONAL PROJECT'}
            </button>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
