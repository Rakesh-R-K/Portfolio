'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function MiscEditor({ data, onSave, saving }) {
    const [form, setForm] = useState(data || {});

    useEffect(() => { if (data) setForm(data); }, [data]);

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    // - Typewriter Roles -
    const updateRole = (i, v) => {
        setForm(prev => {
            const arr = [...(prev.typewriterRoles || [])];
            arr[i] = v;
            return { ...prev, typewriterRoles: arr };
        });
    };
    const addRole = () => setForm(prev => ({ ...prev, typewriterRoles: [...(prev.typewriterRoles || []), ''] }));
    const removeRole = (i) => setForm(prev => ({ ...prev, typewriterRoles: (prev.typewriterRoles || []).filter((_, idx) => idx !== i) }));

    // - Stats -
    const updateStat = (i, field, value) => {
        setForm(prev => {
            const arr = [...(prev.stats || [])];
            arr[i] = { ...arr[i], [field]: field === 'value' ? (parseInt(value) || 0) : value };
            return { ...prev, stats: arr };
        });
    };
    const addStat = () => setForm(prev => ({
        ...prev, stats: [...(prev.stats || []), { value: 0, suffix: '+', label: '', color: 'text-cyber-green' }],
    }));
    const removeStat = (i) => setForm(prev => ({ ...prev, stats: (prev.stats || []).filter((_, idx) => idx !== i) }));

    // - About Stats -
    const updateAboutStat = (i, field, value) => {
        setForm(prev => {
            const arr = [...(prev.aboutStats || [])];
            arr[i] = { ...arr[i], [field]: value };
            return { ...prev, aboutStats: arr };
        });
    };

    // - Typing sentences -
    const updateSentence = (i, v) => {
        setForm(prev => {
            const arr = [...(prev.typingTestSentences || [])];
            arr[i] = v;
            return { ...prev, typingTestSentences: arr };
        });
    };
    const addSentence = () => setForm(prev => ({ ...prev, typingTestSentences: [...(prev.typingTestSentences || []), ''] }));
    const removeSentence = (i) => setForm(prev => ({ ...prev, typingTestSentences: (prev.typingTestSentences || []).filter((_, idx) => idx !== i) }));

    // - Availability Banner -
    const updateAvailability = (field, value) => {
        setForm(prev => ({
            ...prev,
            availabilityBanner: { ...(prev.availabilityBanner || {}), [field]: value },
        }));
    };
    const updateAvailabilityTag = (i, v) => {
        setForm(prev => {
            const tags = [...((prev.availabilityBanner || {}).tags || [])];
            tags[i] = v;
            return { ...prev, availabilityBanner: { ...(prev.availabilityBanner || {}), tags } };
        });
    };
    const addAvailabilityTag = () => {
        setForm(prev => ({
            ...prev, availabilityBanner: { ...(prev.availabilityBanner || {}), tags: [...((prev.availabilityBanner || {}).tags || []), ''] },
        }));
    };
    const removeAvailabilityTag = (i) => {
        setForm(prev => ({
            ...prev, availabilityBanner: { ...(prev.availabilityBanner || {}), tags: ((prev.availabilityBanner || {}).tags || []).filter((_, idx) => idx !== i) },
        }));
    };

    if (!form) return null;

    return (
        <div className="space-y-8">
            {/* Typewriter Roles */}
            <Section title="TYPEWRITER_ROLES">
                <p className="font-mono text-[10px] text-gray-600 mb-3">
                    The cycling roles displayed in the hero section: &quot;$ whoami → ...&quot;
                </p>
                {(form.typewriterRoles || []).map((role, i) => (
                    <div key={i} className="flex gap-2">
                        <InputField label={`Role ${i + 1}`} value={role} onChange={v => updateRole(i, v)} className="flex-1" />
                        <button onClick={() => removeRole(i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs mt-6 px-2">✕</button>
                    </div>
                ))}
                <button onClick={addRole} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                    + ADD ROLE
                </button>
            </Section>

            {/* Stats Counter */}
            <Section title="STATS_COUNTER">
                <p className="font-mono text-[10px] text-gray-600 mb-3">
                    Animated stats displayed between About and Timeline sections.
                </p>
                {(form.stats || []).map((stat, i) => (
                    <div key={i} className="flex items-end gap-3 border-b border-gray-800/20 pb-3 mb-3">
                        <InputField label="Value" value={stat.value} onChange={v => updateStat(i, 'value', v)} type="number" className="w-24" />
                        <InputField label="Suffix" value={stat.suffix} onChange={v => updateStat(i, 'suffix', v)} className="w-20" />
                        <InputField label="Label" value={stat.label} onChange={v => updateStat(i, 'label', v)} className="flex-1" />
                        <InputField label="Color" value={stat.color} onChange={v => updateStat(i, 'color', v)} className="w-40" />
                        <button onClick={() => removeStat(i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs pb-2">✕</button>
                    </div>
                ))}
                <button onClick={addStat} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                    + ADD STAT
                </button>
            </Section>

            {/* About Section Quick Stats */}
            <Section title="ABOUT_QUICK_STATS">
                <p className="font-mono text-[10px] text-gray-600 mb-3">
                    Quick stat cards in the About section (REPOS, LANGUAGES, CTFs, WPM).
                </p>
                {(form.aboutStats || []).map((stat, i) => (
                    <div key={i} className="flex items-end gap-3 border-b border-gray-800/20 pb-3 mb-3">
                        <InputField label="Label" value={stat.label} onChange={v => updateAboutStat(i, 'label', v)} className="w-32" />
                        <InputField label="Value" value={stat.value} onChange={v => updateAboutStat(i, 'value', v)} className="w-24" />
                        <InputField label="Color" value={stat.color} onChange={v => updateAboutStat(i, 'color', v)} className="flex-1" />
                    </div>
                ))}
            </Section>

            {/* Availability Banner */}
            <Section title="AVAILABILITY_BANNER">
                <InputField label="Title" value={form.availabilityBanner?.title} onChange={v => updateAvailability('title', v)} />
                <TextArea label="Description" value={form.availabilityBanner?.description} onChange={v => updateAvailability('description', v)} />
                <label className="flex items-center gap-2 font-mono text-xs text-gray-500">
                    <input
                        type="checkbox"
                        checked={form.availabilityBanner?.isAvailable || false}
                        onChange={e => updateAvailability('isAvailable', e.target.checked)}
                        className="accent-emerald-500"
                    />
                    Currently Available
                </label>
                <div className="space-y-2">
                    <label className="block font-mono text-[10px] tracking-wider text-gray-600">Tags</label>
                    {(form.availabilityBanner?.tags || []).map((tag, i) => (
                        <div key={i} className="flex gap-2">
                            <InputField label="" value={tag} onChange={v => updateAvailabilityTag(i, v)} className="flex-1" />
                            <button onClick={() => removeAvailabilityTag(i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs px-2">✕</button>
                        </div>
                    ))}
                    <button onClick={addAvailabilityTag} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                        + ADD TAG
                    </button>
                </div>
            </Section>

            {/* Typing Test Sentences */}
            <Section title="TYPING_TEST_SENTENCES">
                <p className="font-mono text-[10px] text-gray-600 mb-3">
                    Sentences used in the typing speed challenge.
                </p>
                {(form.typingTestSentences || []).map((sentence, i) => (
                    <div key={i} className="flex gap-2">
                        <InputField label={`Sentence ${i + 1}`} value={sentence} onChange={v => updateSentence(i, v)} className="flex-1" />
                        <button onClick={() => removeSentence(i)} className="text-red-400/60 hover:text-red-400 font-mono text-xs mt-6 px-2">✕</button>
                    </div>
                ))}
                <button onClick={addSentence} className="font-mono text-xs text-emerald-400/60 hover:text-emerald-400 border border-dashed border-emerald-500/20 px-4 py-2 hover:bg-emerald-500/5 transition-all">
                    + ADD SENTENCE
                </button>
            </Section>

            {/* Stock Ticker (simplified - show as JSON) */}
            <Section title="STOCK_TICKER">
                <p className="font-mono text-[10px] text-gray-600 mb-3">
                    Cyber-stock ticker data shown below the navbar.
                </p>
                <TextArea
                    label="Ticker Data (JSON Array)"
                    value={JSON.stringify(form.stockTicker || [], null, 2)}
                    onChange={v => {
                        try {
                            updateField('stockTicker', JSON.parse(v));
                        } catch { /* ignore invalid JSON while typing */ }
                    }}
                    rows={10}
                />
            </Section>

            {/* Code Snippets (advanced - JSON editor) */}
            <Section title="CODE_SNIPPETS">
                <p className="font-mono text-[10px] text-gray-600 mb-3">
                    Code showcase tab data. Edit as JSON for full control over line types and content.
                </p>
                <TextArea
                    label="Snippets Data (JSON Array)"
                    value={JSON.stringify(form.codeSnippets || [], null, 2)}
                    onChange={v => {
                        try {
                            updateField('codeSnippets', JSON.parse(v));
                        } catch { /* ignore invalid JSON while typing */ }
                    }}
                    rows={15}
                />
            </Section>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
