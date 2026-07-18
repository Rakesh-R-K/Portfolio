'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, SaveButton } from './ProfileEditor';

export default function SkillsEditor({ data, onSave, saving }) {
    const [form, setForm] = useState(data || {});

    useEffect(() => { if (data) setForm(data); }, [data]);

    const categories = ['cybersecurity', 'programming', 'web'];

    const updateSkill = (category, index, field, value) => {
        setForm(prev => {
            const arr = [...(prev[category] || [])];
            arr[index] = { ...arr[index], [field]: field === 'level' ? parseInt(value) || 0 : value };
            return { ...prev, [category]: arr };
        });
    };

    const addSkill = (category) => {
        setForm(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), { name: '', level: 50 }],
        }));
    };

    const removeSkill = (category, index) => {
        setForm(prev => ({
            ...prev,
            [category]: (prev[category] || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-8">
            {categories.map(cat => (
                <Section key={cat} title={cat.toUpperCase()}>
                    {(form[cat] || []).map((skill, i) => (
                        <div key={i} className="flex items-end gap-3">
                            <InputField label="Skill Name" value={skill.name} onChange={v => updateSkill(cat, i, 'name', v)} className="flex-1" />
                            <div className="w-24">
                                <label className="block font-mono text-[10px] tracking-wider text-gray-600 mb-1.5">Level</label>
                                <input
                                    type="range" min="0" max="100"
                                    value={skill.level}
                                    onChange={e => updateSkill(cat, i, 'level', e.target.value)}
                                    className="w-full accent-emerald-500"
                                />
                            </div>
                            <span className="font-mono text-xs text-emerald-400 w-10 text-center pb-2">{skill.level}%</span>
                            <button onClick={() => removeSkill(cat, i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs pb-2">✕</button>
                        </div>
                    ))}
                    <button onClick={() => addSkill(cat)} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                        + ADD SKILL
                    </button>
                </Section>
            ))}

            {/* Tools */}
            <Section title="TOOLS_&_FRAMEWORKS">
                <InputField
                    label="Tools (comma-separated)"
                    value={(form.tools || []).join(', ')}
                    onChange={v => setForm(prev => ({ ...prev, tools: v.split(',').map(t => t.trim()).filter(Boolean) }))}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {(form.tools || []).map((tool, i) => (
                        <span key={i} className="font-mono text-[10px] px-2 py-1 border border-gray-800/40 text-gray-500">{tool}</span>
                    ))}
                </div>
            </Section>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
