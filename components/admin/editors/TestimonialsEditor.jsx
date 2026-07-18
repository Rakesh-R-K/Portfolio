'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function TestimonialsEditor({ data, onSave, saving }) {
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
            from: '',
            role: '',
            message: '',
            classification: 'INTERCEPTED',
            signal: 'STRONG',
        }]);
    };

    const removeItem = (index) => setForm(prev => prev.filter((_, i) => i !== index));

    return (
        <div className="space-y-6">
            {form.map((item, i) => (
                <Section key={i} title={`${item.from || 'NEW'} - [${item.classification}]`}>
                    <div className="flex justify-end mb-2">
                        <button onClick={() => removeItem(i)} className="font-mono text-[10px] text-red-400/60 hover:text-red-400 px-3 py-1 border border-red-500/15">DELETE</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="From (Codename)" value={item.from} onChange={v => updateItem(i, 'from', v)} />
                        <InputField label="Role" value={item.role} onChange={v => updateItem(i, 'role', v)} />
                    </div>
                    <TextArea label="Message" value={item.message} onChange={v => updateItem(i, 'message', v)} rows={4} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Classification" value={item.classification} onChange={v => updateItem(i, 'classification', v)} />
                        <InputField label="Signal" value={item.signal} onChange={v => updateItem(i, 'signal', v)} />
                    </div>
                </Section>
            ))}

            <button onClick={addItem} className="w-full py-3 border border-dashed border-emerald-500/20 text-emerald-400/60 font-mono text-xs tracking-wider hover:bg-emerald-500/5 hover:text-emerald-400 transition-all">
                + ADD TESTIMONIAL
            </button>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
