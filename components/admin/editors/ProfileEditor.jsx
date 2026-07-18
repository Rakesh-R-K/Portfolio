'use client';

import { useState, useEffect } from 'react';

export default function ProfileEditor({ data, onSave, saving }) {
    const [form, setForm] = useState(data || {});

    useEffect(() => { if (data) setForm(data); }, [data]);

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const updateNested = (parent, field, value) => setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value },
    }));
    const updateArrayItem = (field, index, value) => setForm(prev => {
        const arr = [...(prev[field] || [])];
        arr[index] = value;
        return { ...prev, [field]: arr };
    });
    const addArrayItem = (field, value = '') => setForm(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value],
    }));
    const removeArrayItem = (field, index) => setForm(prev => ({
        ...prev,
        [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));

    if (!form) return <div className="font-mono text-sm text-gray-500">Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Basic Info */}
            <Section title="IDENTITY">
                <InputField label="Name" value={form.name} onChange={v => updateField('name', v)} />
                <InputField label="Handle" value={form.handle} onChange={v => updateField('handle', v)} />
                <InputField label="Title" value={form.title} onChange={v => updateField('title', v)} />
                <TextArea label="Subtitle" value={form.subtitle} onChange={v => updateField('subtitle', v)} />
                <InputField label="Tagline" value={form.tagline} onChange={v => updateField('tagline', v)} />
                <InputField label="Email" value={form.email} onChange={v => updateField('email', v)} type="email" />
            </Section>

            {/* Education */}
            <Section title="EDUCATION">
                <InputField label="University" value={form.university} onChange={v => updateField('university', v)} />
                <InputField label="Degree" value={form.degree} onChange={v => updateField('degree', v)} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Year" value={form.year} onChange={v => updateField('year', v)} />
                    <InputField label="Semester" value={form.semester} onChange={v => updateField('semester', v)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="GPA" value={form.gpa} onChange={v => updateField('gpa', v)} />
                    <InputField label="Focus" value={form.focus} onChange={v => updateField('focus', v)} />
                </div>
                <InputField label="Typing Speed (WPM)" value={form.typingSpeed} onChange={v => updateField('typingSpeed', parseInt(v) || 0)} type="number" />
            </Section>

            {/* Location */}
            <Section title="LOCATION">
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" value={form.location?.city} onChange={v => updateNested('location', 'city', v)} />
                    <InputField label="Country" value={form.location?.country} onChange={v => updateNested('location', 'country', v)} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <InputField label="Latitude" value={form.location?.lat} onChange={v => updateNested('location', 'lat', v)} />
                    <InputField label="Longitude" value={form.location?.lng} onChange={v => updateNested('location', 'lng', v)} />
                    <InputField label="Timezone" value={form.location?.timezone} onChange={v => updateNested('location', 'timezone', v)} />
                </div>
            </Section>

            {/* Links */}
            <Section title="SOCIAL_LINKS">
                {form.links && Object.entries(form.links).map(([key, val]) => (
                    <InputField key={key} label={key.toUpperCase()} value={val} onChange={v => updateNested('links', key, v)} />
                ))}
            </Section>

            {/* Bio */}
            <Section title="BIO_PARAGRAPHS">
                {(form.bio || []).map((para, i) => (
                    <div key={i} className="flex gap-2">
                        <TextArea label={`Paragraph ${i + 1}`} value={para} onChange={v => updateArrayItem('bio', i, v)} className="flex-1" />
                        <button onClick={() => removeArrayItem('bio', i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs mt-6 px-2">✕</button>
                    </div>
                ))}
                <button onClick={() => addArrayItem('bio', '')} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                    + ADD PARAGRAPH
                </button>
            </Section>

            {/* Philosophy */}
            <Section title="PHILOSOPHY">
                <InputField label="Quote" value={form.philosophy} onChange={v => updateField('philosophy', v)} />
            </Section>

            {/* Focus Areas */}
            <Section title="FOCUS_AREAS">
                {(form.focusAreas || []).map((area, i) => (
                    <div key={i} className="flex gap-2">
                        <InputField label={`Area ${i + 1}`} value={area} onChange={v => updateArrayItem('focusAreas', i, v)} className="flex-1" />
                        <button onClick={() => removeArrayItem('focusAreas', i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs mt-6 px-2">✕</button>
                    </div>
                ))}
                <button onClick={() => addArrayItem('focusAreas', '')} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                    + ADD FOCUS AREA
                </button>
            </Section>

            {/* Career Goals */}
            <Section title="CAREER_GOALS">
                {(form.careerGoals || []).map((goal, i) => (
                    <div key={i} className="flex gap-2">
                        <InputField label={`Goal ${i + 1}`} value={goal} onChange={v => updateArrayItem('careerGoals', i, v)} className="flex-1" />
                        <button onClick={() => removeArrayItem('careerGoals', i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs mt-6 px-2">✕</button>
                    </div>
                ))}
                <button onClick={() => addArrayItem('careerGoals', '')} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                    + ADD GOAL
                </button>
            </Section>

            {/* Save */}
            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}

// ---- Shared sub-components ----

export function Section({ title, children }) {
    return (
        <div className="border border-gray-800/30 bg-[#0d0d0d]/50 p-6 space-y-4">
            <h3 className="font-mono text-xs tracking-[0.2em] text-gray-500 pb-3 border-b border-gray-800/30">{title}</h3>
            {children}
        </div>
    );
}

export function InputField({ label, value, onChange, type = 'text', className = '', placeholder = '' }) {
    return (
        <div className={className}>
            <label className="block font-mono text-[10px] tracking-wider text-gray-600 mb-1.5">{label}</label>
            <input
                type={type}
                value={value ?? ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || label}
                className="w-full bg-[#080808] border border-gray-800/40 px-3 py-2 font-mono text-xs text-gray-300 outline-none focus:border-emerald-500/30 transition-colors placeholder:text-gray-800"
            />
        </div>
    );
}

export function TextArea({ label, value, onChange, className = '', rows = 3 }) {
    return (
        <div className={className}>
            <label className="block font-mono text-[10px] tracking-wider text-gray-600 mb-1.5">{label}</label>
            <textarea
                value={value ?? ''}
                onChange={e => onChange(e.target.value)}
                rows={rows}
                className="w-full bg-[#080808] border border-gray-800/40 px-3 py-2 font-mono text-xs text-gray-300 outline-none focus:border-emerald-500/30 transition-colors resize-none placeholder:text-gray-800"
            />
        </div>
    );
}

export function SaveButton({ onClick, saving, label = 'SAVE CHANGES' }) {
    return (
        <div className="flex justify-end pt-4">
            <button
                onClick={onClick}
                disabled={saving}
                className="px-8 py-3 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-[0.15em] hover:bg-emerald-500/5 hover:shadow-[0_0_20px_rgba(0,255,65,0.08)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {saving ? 'SAVING...' : label}
            </button>
        </div>
    );
}
