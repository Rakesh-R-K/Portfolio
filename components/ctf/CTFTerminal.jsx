'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// Embedded API Terminal - curl-like interface for CTF challenges
// Players can make API requests directly from the CTF page
// ============================================================

export default function CTFTerminal({ challengeId }) {
    const [history, setHistory] = useState([
        { type: 'system', text: 'CONNECTING TO TARGET ENDPOINT...' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // Boot sequence effect
    useEffect(() => {
        let isMounted = true;
        const sequence = [
            'STABLIZING ENCRYPTED TUNNEL...',
            'RESOLVING ROUTE PATHS...',
            `HANDSHAKE ESTABLISHED // CLIENT: ghost@ctf // TARGET: /api/ctf/${challengeId}`,
            'Type a URL path (e.g. /users) or POST:{"key":"value"} /path'
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (!isMounted) return;
            if (index < sequence.length) {
                setHistory(prev => [
                    ...prev,
                    { type: 'system', text: sequence[index] }
                ]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [challengeId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    async function handleCommand(cmd) {
        if (!cmd.trim()) return;

        const newHistory = [...history, { type: 'input', text: `ghost@ctf:~$ ${cmd}` }];

        // Parse command
        let method = 'GET';
        let url = cmd.trim();
        let body = null;

        // POST:{"query":"test"} /api/ctf/medium/search
        const postMatch = cmd.match(/^POST:(\{.*?\})\s+(.+)$/i);
        if (postMatch) {
            method = 'POST';
            try {
                body = JSON.parse(postMatch[1]);
            } catch {
                setHistory([...newHistory, { type: 'error', text: 'Invalid JSON body' }]);
                return;
            }
            url = postMatch[2].trim();
        }

        // Ensure URL starts with /
        if (!url.startsWith('/')) url = '/' + url;
        // Prefix /api/ctf if not present
        if (!url.startsWith('/api/ctf')) url = `/api/ctf/${challengeId}${url.startsWith('/') ? url : '/' + url}`;

        setLoading(true);
        setHistory(newHistory);

        try {
            const opts = { method };
            if (body) {
                opts.headers = { 'Content-Type': 'application/json' };
                opts.body = JSON.stringify(body);
            }

            const res = await fetch(url, opts);
            const contentType = res.headers.get('content-type') || '';

            let responseText;
            if (contentType.includes('application/json')) {
                const json = await res.json();
                responseText = JSON.stringify(json, null, 2);
            } else {
                responseText = await res.text();
            }

            // Collect interesting headers
            const interestingHeaders = [];
            for (const [key, value] of res.headers.entries()) {
                if (key.startsWith('x-')) {
                    interestingHeaders.push(`${key}: ${value}`);
                }
            }

            const responseLines = [
                { type: 'status', text: `HTTP ${res.status} ${res.statusText}` },
            ];
            if (interestingHeaders.length > 0) {
                responseLines.push({ type: 'header', text: '─── Headers ───' });
                interestingHeaders.forEach(h => responseLines.push({ type: 'header', text: h }));
            }
            responseLines.push({ type: 'response', text: responseText });

            setHistory(prev => [...prev, ...responseLines]);
        } catch (err) {
            setHistory(prev => [...prev, { type: 'error', text: `Error: ${err.message}` }]);
        }

        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !loading) {
            handleCommand(input);
            setInput('');
        }
    }

    const colorMap = {
        system: 'text-gray-600',
        input: 'text-cyber-cyan',
        status: 'text-cyber-amber',
        header: 'text-cyber-magenta',
        response: 'text-gray-400',
        error: 'text-red-500',
    };

    return (
        <div className="border border-gray-800/30 bg-[#0a0a0a] overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800/20">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-gray-600 ml-2">
                    api_terminal - {challengeId || 'ctf'}
                </span>
            </div>

            {/* Terminal body */}
            <div className="h-72 overflow-y-auto p-4 font-mono text-xs leading-relaxed scrollbar-thin">
                {history.map((line, i) => (
                    <div key={i} className={`${colorMap[line.type] || 'text-gray-500'} whitespace-pre-wrap break-all`}>
                        {line.text}
                    </div>
                ))}
                {loading && (
                    <div className="text-cyber-green animate-pulse">Fetching...</div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-gray-800/20 px-4 py-2 bg-gray-900/30">
                <span className="text-cyber-green font-mono text-xs mr-2">$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={loading ? 'Processing...' : 'Type URL path or POST:{json} path'}
                    disabled={loading}
                    className="flex-1 bg-transparent font-mono text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none"
                />
            </div>
        </div>
    );
}
