'use client';

import { useState, useEffect } from 'react';
import { Section, InputField, TextArea, SaveButton } from './ProfileEditor';

export default function CTFParticipationsEditor({ data, onSave, saving }) {
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
            id: `ctf-${Date.now()}`,
            name: '',
            platform: '',
            date: '',
            placement: '',
            teamName: 'Solo',
            teamSize: 1,
            totalPoints: 0,
            solvedChallenges: 0,
            totalChallenges: 0,
            categories: [],
            highlights: [],
            writeupUrl: '',
            difficulty: 'INTERMEDIATE',
            status: 'COMPLETED',
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

    const difficultyOptions = ['BEGINNER', 'BEGINNER-INTERMEDIATE', 'INTERMEDIATE', 'INTERMEDIATE-HARD', 'HARD', 'EXPERT'];
    const statusOptions = ['COMPLETED', 'ONGOING', 'UPCOMING'];

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="border border-emerald-500/10 bg-emerald-500/5 p-4 font-mono text-xs text-emerald-400/80 space-y-1">
                <p>TOTAL CTFs: <span className="text-emerald-400">{form.length}</span></p>
                <p>CHALLENGES SOLVED: <span className="text-emerald-400">{form.reduce((s, c) => s + (c.solvedChallenges || 0), 0)}</span></p>
                <p>TOTAL POINTS: <span className="text-emerald-400">{form.reduce((s, c) => s + (c.totalPoints || 0), 0).toLocaleString()}</span></p>
            </div>

            {form.map((item, i) => (
                <Section key={item.id || i} title={`🚩 ${item.name || 'NEW CTF'} - [${item.status}]`}>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="font-mono text-xs text-gray-600 hover:text-emerald-400 disabled:opacity-20 px-2">▲</button>
                        <button onClick={() => moveItem(i, 1)} disabled={i === form.length - 1} className="font-mono text-xs text-gray-600 hover:text-emerald-400 disabled:opacity-20 px-2">▼</button>
                        <div className="flex-1" />
                        <button onClick={() => removeItem(i)} className="font-mono text-[10px] text-red-400/60 hover:text-red-400 px-3 py-1 border border-red-500/15">DELETE</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Name" value={item.name} onChange={v => updateItem(i, 'name', v)} />
                        <InputField label="Platform" value={item.platform} onChange={v => updateItem(i, 'platform', v)} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <InputField label="Date (YYYY-MM)" value={item.date} onChange={v => updateItem(i, 'date', v)} />
                        <InputField label="Placement" value={item.placement} onChange={v => updateItem(i, 'placement', v)} />
                        <InputField label="Team Name" value={item.teamName} onChange={v => updateItem(i, 'teamName', v)} />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <InputField label="Team Size" value={item.teamSize} onChange={v => updateItem(i, 'teamSize', parseInt(v) || 1)} type="number" />
                        <InputField label="Total Points" value={item.totalPoints} onChange={v => updateItem(i, 'totalPoints', parseInt(v) || 0)} type="number" />
                        <InputField label="Solved" value={item.solvedChallenges} onChange={v => updateItem(i, 'solvedChallenges', parseInt(v) || 0)} type="number" />
                        <InputField label="Total Challs" value={item.totalChallenges} onChange={v => updateItem(i, 'totalChallenges', parseInt(v) || 0)} type="number" />
                    </div>

                    <InputField
                        label="Categories (comma-separated)"
                        value={(item.categories || []).join(', ')}
                        onChange={v => updateItem(i, 'categories', v.split(',').map(t => t.trim()).filter(Boolean))}
                    />

                    <TextArea
                        label="Highlights (one per line)"
                        value={(item.highlights || []).join('\n')}
                        onChange={v => updateItem(i, 'highlights', v.split('\n').filter(Boolean))}
                        rows={3}
                    />

                    <InputField label="Writeup URL" value={item.writeupUrl} onChange={v => updateItem(i, 'writeupUrl', v)} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-mono text-[10px] tracking-wider text-gray-600 mb-1.5">Difficulty</label>
                            <select
                                value={item.difficulty}
                                onChange={e => updateItem(i, 'difficulty', e.target.value)}
                                className="w-full bg-[#080808] border border-gray-800/40 px-3 py-2 font-mono text-xs text-gray-300 outline-none focus:border-emerald-500/30"
                            >
                                {difficultyOptions.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] tracking-wider text-gray-600 mb-1.5">Status</label>
                            <select
                                value={item.status}
                                onChange={e => updateItem(i, 'status', e.target.value)}
                                className="w-full bg-[#080808] border border-gray-800/40 px-3 py-2 font-mono text-xs text-gray-300 outline-none focus:border-emerald-500/30"
                            >
                                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </Section>
            ))}

            <button onClick={addItem} className="w-full py-3 border border-dashed border-emerald-500/20 text-emerald-400/60 font-mono text-xs tracking-wider hover:bg-emerald-500/5 hover:text-emerald-400 transition-all">
                + ADD CTF PARTICIPATION
            </button>

            <SaveButton onClick={() => onSave(form)} saving={saving} />
        </div>
    );
}
