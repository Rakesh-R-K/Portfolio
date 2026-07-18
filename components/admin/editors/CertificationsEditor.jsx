'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function CertificationsEditor({ data, onSave, saving }) {
    const [form, setForm] = useState(data || []);

    useEffect(() => { if (data) setForm(data); }, [data]);

    const updateItem = (index, field, value) => {
        setForm(prev => {
            const arr = [...prev];
            arr[index] = { ...arr[index], [field]: value };
            return arr;
        });
    };

    const addItem = () => {
        setForm(prev => [...prev, {
            icon: '🏅',
            title: '',
            detail: '',
            stat: '',
            statLabel: '',
            color: 'text-cyber-green',
            borderColor: 'border-cyber-green/15',
        }]);
    };

    const removeItem = (index) => setForm(prev => prev.filter((_, i) => i !== index));

    const colorOptions = [
        { label: 'Green', value: 'text-cyber-green', border: 'border-cyber-green/15' },
        { label: 'Cyan', value: 'text-cyber-cyan', border: 'border-cyber-cyan/15' },
        { label: 'Amber', value: 'text-cyber-amber', border: 'border-cyber-amber/15' },
        { label: 'Magenta', value: 'text-cyber-magenta', border: 'border-cyber-magenta/15' },
        { label: 'Purple', value: 'text-purple-400', border: 'border-purple-400/15' },
        { label: 'Teal', value: 'text-teal-400', border: 'border-teal-400/15' },
    ];

    return (
        <div className="space-y-6">
            {form.map((item, i) => (
                <Section key={i} title={`${item.icon} ${item.title || 'NEW ACHIEVEMENT'}`}>
                    <div className="flex justify-end mb-2">
                        <button onClick={() => removeItem(i)} className="font-mono text-[10px] text-red-400/60 hover:text-red-400 px-3 py-1 border border-red-500/15">DELETE</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Icon (Emoji)" value={item.icon} onChange={v => updateItem(i, 'icon', v)} />
                        <InputField label="Title" value={item.title} onChange={v => updateItem(i, 'title', v)} />
                    </div>
                    <TextArea label="Detail" value={item.detail} onChange={v => updateItem(i, 'detail', v)} rows={2} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Stat Value" value={item.stat} onChange={v => updateItem(i, 'stat', v)} />
                        <InputField label="Stat Label" value={item.statLabel} onChange={v => updateItem(i, 'statLabel', v)} />
                    </div>
                    <div>
                        <label className="block font-mono text-[10px] tracking-wider text-gray-600 mb-1.5">Color Theme</label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { updateItem(i, 'color', opt.value); updateItem(i, 'borderColor', opt.border); }}
                                    className={`px-3 py-1 font-mono text-[10px] border transition-all ${item.color === opt.value
                                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                        : 'border-gray-800/30 text-gray-600 hover:text-gray-400'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Section>
            ))}

            <button onClick={addItem} className="w-full py-3 border border-dashed border-emerald-500/20 text-emerald-400/60 font-mono text-xs tracking-wider hover:bg-emerald-500/5 hover:text-emerald-400 transition-all">
                + ADD ACHIEVEMENT
            </button>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
