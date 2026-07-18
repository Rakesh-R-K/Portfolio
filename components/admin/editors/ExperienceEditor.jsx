'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function ExperienceEditor({ data, onSave, saving }) {
    const [form, setForm] = useState(data || { education: [], experience: [] });
    const [tab, setTab] = useState('experience');

    useEffect(() => { if (data) setForm(data); }, [data]);

    const updateItem = (list, index, field, value) => {
        setForm(prev => {
            const arr = [...(prev[list] || [])];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [list]: arr };
        });
    };

    const addExperience = () => {
        setForm(prev => ({
            ...prev,
            experience: [...(prev.experience || []), { period: '', role: '', org: '', type: '', description: '', tech: [] }],
        }));
    };

    const addEducation = () => {
        setForm(prev => ({
            ...prev,
            education: [...(prev.education || []), { period: '', degree: '', institution: '', focus: '', gpa: '', highlights: [] }],
        }));
    };

    const removeItem = (list, index) => {
        setForm(prev => ({
            ...prev,
            [list]: (prev[list] || []).filter((_, i) => i !== index),
        }));
    };

    const items = tab === 'experience' ? (form.experience || []) : (form.education || []);

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {['experience', 'education'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 font-mono text-[10px] tracking-wider border transition-all ${tab === t
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                            : 'border-gray-800/30 text-gray-600 hover:text-gray-400'
                            }`}
                    >
                        {t.toUpperCase()} ({(form[t] || []).length})
                    </button>
                ))}
            </div>

            {items.map((item, i) => (
                <Section key={i} title={tab === 'experience' ? (item.role || 'NEW ROLE') : (item.degree || 'NEW DEGREE')}>
                    <div className="flex justify-end mb-2">
                        <button onClick={() => removeItem(tab, i)} className="font-mono text-[10px] text-red-400/60 hover:text-red-400 px-3 py-1 border border-red-500/15">DELETE</button>
                    </div>

                    {tab === 'experience' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Period" value={item.period} onChange={v => updateItem('experience', i, 'period', v)} />
                                <InputField label="Type" value={item.type} onChange={v => updateItem('experience', i, 'type', v)} />
                            </div>
                            <InputField label="Role" value={item.role} onChange={v => updateItem('experience', i, 'role', v)} />
                            <InputField label="Organization" value={item.org} onChange={v => updateItem('experience', i, 'org', v)} />
                            <TextArea label="Description" value={item.description} onChange={v => updateItem('experience', i, 'description', v)} />
                            <InputField label="Tech (comma-separated)" value={(item.tech || []).join(', ')} onChange={v => updateItem('experience', i, 'tech', v.split(',').map(t => t.trim()).filter(Boolean))} />
                        </>
                    ) : (
                        <>
                            <InputField label="Period" value={item.period} onChange={v => updateItem('education', i, 'period', v)} />
                            <InputField label="Degree" value={item.degree} onChange={v => updateItem('education', i, 'degree', v)} />
                            <InputField label="Institution" value={item.institution} onChange={v => updateItem('education', i, 'institution', v)} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Focus" value={item.focus} onChange={v => updateItem('education', i, 'focus', v)} />
                                <InputField label="GPA" value={item.gpa} onChange={v => updateItem('education', i, 'gpa', v)} />
                            </div>
                            <InputField label="Highlights (comma-separated)" value={(item.highlights || []).join(', ')} onChange={v => updateItem('education', i, 'highlights', v.split(',').map(t => t.trim()).filter(Boolean))} />
                        </>
                    )}
                </Section>
            ))}

            <button
                onClick={tab === 'experience' ? addExperience : addEducation}
                className="w-full py-3 border border-dashed border-emerald-500/20 text-emerald-400/60 font-mono text-xs tracking-wider hover:bg-emerald-500/5 hover:text-emerald-400 transition-all"
            >
                + ADD {tab.toUpperCase()} ENTRY
            </button>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
