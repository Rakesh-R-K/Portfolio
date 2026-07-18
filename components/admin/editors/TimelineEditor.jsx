'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function TimelineEditor({ data, onSave, saving }) {
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
            year: new Date().getFullYear().toString(),
            title: '',
            description: '',
            tags: [],
            icon: '📌',
            color: 'border-cyber-green/40',
        }]);
    };

    const removeItem = (index) => setForm(prev => prev.filter((_, i) => i !== index));

    const moveItem = (index, direction) => {
        setForm(prev => {
            const arr = [...prev];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= arr.length) return prev;
            [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
            return arr;
        });
    };

    return (
        <div className="space-y-6">
            {form.map((item, i) => (
                <Section key={i} title={`${item.icon} ${item.year} - ${item.title || 'UNTITLED'}`}>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="font-mono text-xs text-gray-600 hover:text-emerald-400 disabled:opacity-20 px-2">▲</button>
                        <button onClick={() => moveItem(i, 1)} disabled={i === form.length - 1} className="font-mono text-xs text-gray-600 hover:text-emerald-400 disabled:opacity-20 px-2">▼</button>
                        <div className="flex-1" />
                        <button onClick={() => removeItem(i)} className="font-mono text-[10px] text-red-400/60 hover:text-red-400 px-3 py-1 border border-red-500/15">DELETE</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <InputField label="Year" value={item.year} onChange={v => updateItem(i, 'year', v)} />
                        <InputField label="Icon (Emoji)" value={item.icon} onChange={v => updateItem(i, 'icon', v)} />
                        <InputField label="Border Color" value={item.color} onChange={v => updateItem(i, 'color', v)} />
                    </div>
                    <InputField label="Title" value={item.title} onChange={v => updateItem(i, 'title', v)} />
                    <TextArea label="Description" value={item.description} onChange={v => updateItem(i, 'description', v)} />
                    <InputField label="Tags (comma-separated)" value={(item.tags || []).join(', ')} onChange={v => updateItem(i, 'tags', v.split(',').map(t => t.trim()).filter(Boolean))} />
                </Section>
            ))}

            <button onClick={addItem} className="w-full py-3 border border-dashed border-emerald-500/20 text-emerald-400/60 font-mono text-xs tracking-wider hover:bg-emerald-500/5 hover:text-emerald-400 transition-all">
                + ADD MILESTONE
            </button>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
