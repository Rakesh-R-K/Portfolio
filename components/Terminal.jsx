'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { profile, projects } from '@/data/profile';

export default function Terminal({ onHack, onGhostnet, onKnockSequence, onDissolve }) {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [cmdHistory, setCmdHistory] = useState([]);
    const [cmdIndex, setCmdIndex] = useState(-1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [knockMode, setKnockMode] = useState(false);
    const [sshMode, setSshMode] = useState(false);
    const inputRef = useRef(null);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [history]);

    useEffect(() => {
        setHistory([
            { type: 'system', content: '[BOOT] Ghost Protocol v3.0.0' },
            { type: 'system', content: '[BOOT] Stealth systems: OPERATIONAL' },
            { type: 'system', content: '[BOOT] Encryption: AES-256-GCM' },
            { type: 'success', content: '[READY] Welcome, Operative. Type "help" for commands.' },
            { type: 'output', content: '' },
        ]);
    }, []);

    const addOutput = useCallback((lines) => {
        setHistory(prev => [
            ...prev,
            ...(Array.isArray(lines) ? lines : [lines]).map(l =>
                typeof l === 'string' ? { type: 'output', content: l } : l
            ),
        ]);
    }, []);

    const commands = {
        help: () => [
            { type: 'output', content: '' },
            { type: 'system', content: '  AVAILABLE COMMANDS' },
            { type: 'system', content: '  ==================' },
            { type: 'output', content: '' },
            { type: 'output', content: '  whoami               Operator identity' },
            { type: 'output', content: '  cat about.txt        Read dossier file' },
            { type: 'output', content: '  ssh guest@rakesh.dev SSH session' },
            { type: 'output', content: '  ghostnet --init      Tunnel to GhostNet' },
            { type: 'output', content: '  knock --sequence     Port knocking challenge' },
            { type: 'output', content: '  stock-trade --live   MERN stock dashboard' },
            { type: 'output', content: '  ls                   List modules' },
            { type: 'output', content: '  nmap                 Quick scan' },
            { type: 'output', content: '  nmap portfolio...    Full port scan' },
            { type: 'output', content: '  ping                 Test connectivity' },
            { type: 'output', content: '  ifconfig             Network interfaces' },
            { type: 'output', content: '  uname -a             Kernel info' },
            { type: 'output', content: '  uptime               System uptime' },
            { type: 'output', content: '  neofetch             System info' },
            { type: 'output', content: '  cat /etc/passwd      User listing' },
            { type: 'output', content: '  cat /etc/shadow      Shadow hashes' },
            { type: 'output', content: '  fortune              Random hacker quote' },
            { type: 'output', content: '  banner               ASCII art' },
            { type: 'output', content: '  hack                 ??? (try it)' },
            { type: 'output', content: '  matrix               Enter the matrix' },
            { type: 'output', content: '  coffee               Brew some coffee' },
            { type: 'output', content: '  rickroll             You know the rules' },
            { type: 'output', content: '  sudo rm -rf /        Nice try' },
            { type: 'output', content: '  history              Command history' },
            { type: 'output', content: '  clear                Clear terminal' },
            { type: 'output', content: '' },
        ],

        whoami: () => [
            { type: 'output', content: '' },
            { type: 'success', content: `  >> ${profile.name}` },
            { type: 'output', content: `  |  ${profile.semester} CSE @ ${profile.university}` },
            { type: 'output', content: `  |  Focus: ${profile.focus}` },
            { type: 'output', content: `  |  Typing: ${profile.typingSpeed} WPM` },
            { type: 'output', content: `  |  Location: ${profile.location.city}, ${profile.location.country}` },
            { type: 'output', content: '  |  Role: Vulnerability Researcher / CTF' },
            { type: 'output', content: '  |  Status: Building stealth systems' },
            { type: 'output', content: '' },
            { type: 'system', content: `  ${profile.philosophy}` },
            { type: 'output', content: '' },
        ],

        'cat about.txt': () => [
            { type: 'output', content: '' },
            { type: 'system', content: '  ─── about.txt ───' },
            { type: 'output', content: '' },
            { type: 'output', content: `  Name:     ${profile.name}` },
            { type: 'output', content: `  Handle:   @${profile.handle.toLowerCase()}` },
            { type: 'output', content: `  Uni:      ${profile.university}` },
            { type: 'output', content: `  Program:  B.Tech CSE (${profile.semester})` },
            { type: 'output', content: `  GPA:      ${profile.gpa}` },
            { type: 'output', content: `  Focus:    ${profile.focus}` },
            { type: 'output', content: `  City:     ${profile.location.city}` },
            { type: 'output', content: `  WPM:      ${profile.typingSpeed}` },
            { type: 'output', content: '' },
            { type: 'success', content: `  "${profile.philosophy}"` },
            { type: 'output', content: '' },
        ],

        'ssh guest@rakesh.dev': () => {
            setSshMode(true);
            setIsAnimating(true);
            const lines = [
                { type: 'system', content: '[SSH] Connecting to rakesh.dev:22...' },
                { type: 'system', content: '[SSH] Host key fingerprint: SHA256:a3f8c...' },
                { type: 'success', content: '[SSH] Authenticated as guest@rakesh.dev' },
                { type: 'output', content: '' },
                { type: 'success', content: '  Welcome to rakesh.dev' },
                { type: 'output', content: '  ─────────────────────' },
                { type: 'output', content: '  You are logged in as: guest (read-only)' },
                { type: 'output', content: '' },
                { type: 'output', content: '  /home/rakesh/' },
                { type: 'output', content: '  ├── projects/   (5 items)' },
                { type: 'output', content: '  ├── research/   (classified)' },
                { type: 'output', content: '  ├── ctf/        (writeups)' },
                { type: 'output', content: '  ├── .ssh/       (access denied)' },
                { type: 'output', content: '  └── about.txt   (public)' },
                { type: 'output', content: '' },
                { type: 'system', content: '  Type "exit" to disconnect.' },
            ];

            lines.forEach((line, i) => {
                setTimeout(() => {
                    addOutput(line);
                    if (i === lines.length - 1) {
                        setIsAnimating(false);
                        setSshMode(false);
                    }
                }, (i + 1) * 300);
            });
            return [{ type: 'system', content: '[SSH] Initiating handshake...' }];
        },

        'ghostnet --init': () => {
            if (onGhostnet) onGhostnet();
            return [
                { type: 'system', content: '[GHOSTNET] Initializing DNS tunnel...' },
                { type: 'system', content: '[GHOSTNET] Establishing covert channel...' },
                { type: 'success', content: '[GHOSTNET] Tunneling to target. Scrolling...' },
            ];
        },

        'knock --sequence': () => {
            setKnockMode(true);
            return [
                { type: 'system', content: '[PORT_KNOCK] Port Knocking Initiated.' },
                { type: 'output', content: 'Enter 3-port sequence (space-separated):' },
                { type: 'output', content: '[HINT] Try: 7000 8000 9000' },
            ];
        },

        'stock-trade --live': () => [
            { type: 'output', content: '' },
            { type: 'success', content: '  LIVE STOCK DASHBOARD' },
            { type: 'success', content: '  --------------------' },
            { type: 'output', content: '  TICKER   PRICE      CHANGE' },
            { type: 'output', content: '  AAPL     $189.43    +2.31 (+1.2%)' },
            { type: 'output', content: '  GOOGL    $141.80    +0.95 (+0.7%)' },
            { type: 'error', content: '  TSLA     $248.42    -3.12 (-1.2%)' },
            { type: 'output', content: '  MSFT     $378.91    +1.67 (+0.4%)' },
            { type: 'error', content: '  AMZN     $178.25    -0.88 (-0.5%)' },
            { type: 'output', content: '' },
            { type: 'system', content: '  [MERN] MongoDB + Express + React + Node' },
            { type: 'output', content: '' },
        ],

        ls: () => projects.map(p => ({
            type: 'output',
            content: `  drwxr-xr-x  ${p.status.padEnd(12)} ${p.name}/`,
        })),

        nmap: () => [
            { type: 'system', content: '[NMAP] Starting scan...' },
            { type: 'output', content: '' },
            { type: 'output', content: '  PORT     STATE    SERVICE' },
            { type: 'output', content: '  22/tcp   open     ssh' },
            { type: 'output', content: '  80/tcp   open     http' },
            { type: 'output', content: '  443/tcp  open     https' },
            { type: 'output', content: '  3000/tcp open     node' },
            { type: 'output', content: '  8080/tcp filtered proxy' },
            { type: 'output', content: '' },
            { type: 'system', content: '[NMAP] 4 open, 1 filtered. Done.' },
        ],

        ping: () => {
            setIsAnimating(true);
            const lines = [
                '[PING] Sending ICMP packets...',
                '64 bytes: seq=1 ttl=64 time=0.042ms',
                '64 bytes: seq=2 ttl=64 time=0.038ms',
                '64 bytes: seq=3 ttl=64 time=0.041ms',
                '3 packets, 0% loss',
            ];
            lines.forEach((line, i) => {
                setTimeout(() => {
                    addOutput({ type: i === lines.length - 1 ? 'success' : 'output', content: line });
                    if (i === lines.length - 1) setIsAnimating(false);
                }, (i + 1) * 400);
            });
            return [{ type: 'system', content: '[PING] Testing connectivity...' }];
        },

        neofetch: () => [
            { type: 'output', content: '' },
            { type: 'success', content: '  rakesh@ghost' },
            { type: 'success', content: '  -----------' },
            { type: 'output', content: '  OS:      Ghost Protocol v3.0' },
            { type: 'output', content: '  Host:    Cybersecurity Portfolio' },
            { type: 'output', content: '  Kernel:  Next.js 14 + Tailwind' },
            { type: 'output', content: '  Shell:   bash 5.1' },
            { type: 'output', content: `  Uptime:  Since ${profile.year.split('–')[0]}` },
            { type: 'output', content: '  Theme:   CyberPunk-Neon [dark]' },
            { type: 'output', content: '  Memory:  100% Encrypted' },
            { type: 'output', content: '' },
        ],

        banner: () => [
            { type: 'output', content: '' },
            { type: 'success', content: '  ____       _              _     ' },
            { type: 'success', content: ' |  _ \\ __ _| | _____  ___ | |__  ' },
            { type: 'success', content: ' | |_) / _` | |/ / _ \\/ __|| \'_ \\ ' },
            { type: 'success', content: ' |  _ < (_| |   <  __/\\__ \\| | | |' },
            { type: 'success', content: ' |_| \\_\\__,_|_|\\_\\___||___/|_| |_|' },
            { type: 'output', content: '' },
            { type: 'output', content: '  Offensive Architect | PES University' },
            { type: 'output', content: '  Built with: Next.js + Three.js + GSAP' },
            { type: 'output', content: '' },
        ],

        matrix: () => {
            if (onHack) onHack();
            return [
                { type: 'system', content: '[MATRIX] Following the white rabbit...' },
                { type: 'success', content: '[MATRIX] The Matrix has you. (5s)' },
            ];
        },

        hack: () => {
            if (onHack) onHack();
            return [
                { type: 'error', content: '' },
                { type: 'error', content: '  !! SYSTEM OVERRIDDEN !!' },
                { type: 'error', content: '  All access points compromised.' },
                { type: 'error', content: '' },
            ];
        },

        coffee: () => [
            { type: 'output', content: '' },
            { type: 'output', content: '      (  (  (  ' },
            { type: 'output', content: '       )  )  ) ' },
            { type: 'output', content: '      (  (  (  ' },
            { type: 'output', content: '      _________ ' },
            { type: 'output', content: '     |  COFFEE | ' },
            { type: 'output', content: '     |_________| ' },
            { type: 'output', content: '' },
            { type: 'success', content: '  Brew complete. Ready to hack.' },
            { type: 'output', content: '' },
        ],

        clear: () => {
            setTimeout(() => setHistory([]), 0);
            return null;
        },

        history: () => {
            if (cmdHistory.length === 0) return [{ type: 'output', content: 'No commands yet.' }];
            return cmdHistory.slice(-15).map((c, i) => ({
                type: 'output', content: `  ${i + 1}  ${c}`,
            }));
        },

        'sudo rm -rf /': () => {
            // Trigger the dissolve effect
            if (onDissolve) onDissolve();
            return [
                { type: 'error', content: '' },
                { type: 'error', content: '  ██ FATAL: SYSTEM DESTRUCTION INITIATED ██' },
                { type: 'error', content: '  Deleting all files...' },
                { type: 'error', content: '  Removing /usr/bin...' },
                { type: 'error', content: '  Removing /home/rakesh...' },
                { type: 'error', content: '  Removing /var/www...' },
                { type: 'error', content: '' },
                { type: 'error', content: '  KERNEL PANIC - not syncing' },
                { type: 'error', content: '  System will reboot in 5 seconds...' },
            ];
        },

        sudo: () => [
            { type: 'error', content: '  [sudo] password for guest: ********' },
            { type: 'error', content: '  guest is not in the sudoers file.' },
            { type: 'error', content: '  This incident will be reported.' },
            { type: 'system', content: '  📧 Admin notification sent to rakesh@ghost.dev' },
        ],

        'cat /etc/shadow': () => [
            { type: 'error', content: '' },
            { type: 'error', content: '  ⚠ ACCESS DENIED ⚠' },
            { type: 'error', content: '  Nice try. That file contains hashed passwords.' },
            { type: 'output', content: '  Permission: -rw-r----- root:shadow' },
            { type: 'output', content: '' },
            { type: 'system', content: '  Your IP has been flagged. 🚨' },
            { type: 'system', content: '  Just kidding... or am I?' },
            { type: 'output', content: '' },
        ],

        'cat /etc/passwd': () => [
            { type: 'output', content: '' },
            { type: 'output', content: '  root:x:0:0:root:/root:/bin/bash' },
            { type: 'output', content: '  rakesh:x:1000:1000:Rakesh RK:/home/rakesh:/bin/zsh' },
            { type: 'output', content: '  guest:x:1001:1001:Guest:/home/guest:/bin/rbash' },
            { type: 'output', content: '  nginx:x:33:33:nginx:/var/www:/usr/sbin/nologin' },
            { type: 'output', content: '  postgres:x:70:70:PostgreSQL:/var/lib/pgsql:/bin/bash' },
            { type: 'output', content: '' },
            { type: 'system', content: '  Nothing juicy here. Try /etc/shadow 😏' },
            { type: 'output', content: '' },
        ],

        'nmap portfolio.rakesh.dev': () => {
            setIsAnimating(true);
            const lines = [
                { type: 'system', content: '[NMAP] Starting Nmap 7.94 at 2025-02-20 IST' },
                { type: 'output', content: '  Scanning portfolio.rakesh.dev (13.37.42.0)...' },
                { type: 'output', content: '' },
                { type: 'output', content: '  PORT      STATE    SERVICE        VERSION' },
                { type: 'output', content: '  22/tcp    open     ssh            OpenSSH 9.0' },
                { type: 'output', content: '  80/tcp    open     http           nginx 1.24' },
                { type: 'output', content: '  443/tcp   open     https          Next.js 14.2' },
                { type: 'output', content: '  3000/tcp  open     node           Express 4.18' },
                { type: 'output', content: '  5432/tcp  filtered postgresql     --' },
                { type: 'output', content: '  6379/tcp  filtered redis          --' },
                { type: 'output', content: '  8080/tcp  open     http-proxy     traefik' },
                { type: 'output', content: '  9090/tcp  closed   zeus-admin     --' },
                { type: 'output', content: '' },
                { type: 'system', content: '  OS: Ghost Protocol v3.0 (Linux 6.x)' },
                { type: 'system', content: '  Firewall: iptables + fail2ban active' },
                { type: 'success', content: '  [NMAP] 5 open, 2 filtered, 1 closed. Scan done.' },
            ];
            lines.forEach((line, i) => {
                setTimeout(() => {
                    addOutput(line);
                    if (i === lines.length - 1) setIsAnimating(false);
                }, (i + 1) * 200);
            });
            return [{ type: 'system', content: '[NMAP] Initiating SYN stealth scan...' }];
        },

        ifconfig: () => [
            { type: 'output', content: '' },
            { type: 'output', content: '  eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>' },
            { type: 'output', content: '      inet 10.13.37.42  netmask 255.255.255.0' },
            { type: 'output', content: '      inet6 fe80::1337:dead:beef:cafe' },
            { type: 'output', content: '      ether 00:DE:AD:BE:EF:42' },
            { type: 'output', content: '      RX bytes: 42.0 GB  TX bytes: 13.37 GB' },
            { type: 'output', content: '' },
            { type: 'output', content: '  tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP>' },
            { type: 'output', content: '      inet 10.10.14.2  netmask 255.255.254.0' },
            { type: 'system', content: '      (VPN tunnel active)' },
            { type: 'output', content: '' },
        ],

        'uname -a': () => [
            { type: 'output', content: '  GhostOS 3.0.0-security #42-PES SMP x86_64 GNU/Linux' },
        ],

        uptime: () => {
            const now = new Date();
            const start = new Date('2023-08-01');
            const days = Math.floor((now - start) / 86400000);
            return [
                { type: 'output', content: `  up ${days} days, load average: 0.42, 1.33, 0.87` },
                { type: 'output', content: `  ${days} days of hacking and counting...` },
            ];
        },

        fortune: () => {
            const quotes = [
                '"The only truly secure system is one that is powered off." - Gene Spafford',
                '"There are two types of companies: those that have been hacked, and those that don\'t know they\'ve been hacked." - John Chambers',
                '"Passwords are like underwear: change them often, keep them private." - Unknown',
                '"Security is not a product, but a process." - Bruce Schneier',
                '"The quieter you become, the more you are able to hear." - Kali Linux',
                '"Hack the planet!" - Hackers (1995)',
                '"In God we trust. All others we monitor." - NSA',
                '"Behind every great hacker is a sleep-deprived human being." - Anonymous',
            ];
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            return [
                { type: 'output', content: '' },
                { type: 'system', content: `  ${q}` },
                { type: 'output', content: '' },
            ];
        },

        rickroll: () => [
            { type: 'output', content: '' },
            { type: 'success', content: '  ♫ Never gonna give you up ♫' },
            { type: 'success', content: '  ♫ Never gonna let you down ♫' },
            { type: 'success', content: '  ♫ Never gonna run around and desert you ♫' },
            { type: 'output', content: '' },
            { type: 'error', content: '  You just got rickrolled in a terminal. 🕺' },
            { type: 'output', content: '' },
        ],

        exit: () => [
            { type: 'system', content: '[SSH] Connection closed.' },
        ],
    };

    const executeCommand = (cmd) => {
        const trimmed = cmd.trim().toLowerCase();
        const newEntry = { type: 'input', content: `rakesh@ghost:~$ ${cmd}` };

        if (trimmed === '') {
            setHistory(prev => [...prev, newEntry]);
            return;
        }

        setCmdHistory(prev => [...prev, trimmed]);

        if (knockMode) {
            setKnockMode(false);
            const ports = trimmed.split(/\s+/);
            if (ports.join(' ') === '7000 8000 9000') {
                setHistory(prev => [
                    ...prev, newEntry,
                    { type: 'success', content: '[PORT_KNOCK] Sequence accepted!' },
                    { type: 'success', content: '[PORT_KNOCK] ACCESS GRANTED - Object unlocked!' },
                ]);
                if (onKnockSequence) onKnockSequence(true);
            } else {
                setHistory(prev => [
                    ...prev, newEntry,
                    { type: 'error', content: `[PORT_KNOCK] Invalid: ${trimmed}` },
                    { type: 'output', content: 'Try "knock --sequence" again.' },
                ]);
                if (onKnockSequence) onKnockSequence(false);
            }
            return;
        }

        const handler = commands[trimmed];
        if (handler) {
            const result = handler();
            if (result === null) {
                setHistory([newEntry]);
                return;
            }
            setHistory(prev => [...prev, newEntry, ...result]);
        } else {
            setHistory(prev => [
                ...prev, newEntry,
                { type: 'error', content: `Command not found: ${trimmed}. Type "help".` },
            ]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAnimating) return;
        executeCommand(input);
        setInput('');
        setCmdIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0 && cmdIndex < cmdHistory.length - 1) {
                const newIdx = cmdIndex + 1;
                setCmdIndex(newIdx);
                setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (cmdIndex > 0) {
                const newIdx = cmdIndex - 1;
                setCmdIndex(newIdx);
                setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
            } else {
                setCmdIndex(-1);
                setInput('');
            }
        }
    };

    const getLineClass = (type) => {
        switch (type) {
            case 'input': return 'text-gray-300';
            case 'system': return 'text-cyber-cyan';
            case 'success': return 'text-cyber-green';
            case 'error': return 'text-cyber-magenta';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="terminal-window w-full max-w-2xl shadow-[0_0_40px_rgba(0,255,65,0.06)]" id="terminal">
            <div className="terminal-header">
                <div className="terminal-dot bg-[#ff5f57]" />
                <div className="terminal-dot bg-[#febc2e]" />
                <div className="terminal-dot bg-[#28c840]" />
                <span className="ml-3 font-mono text-[11px] text-gray-500 tracking-wider">
                    rakesh@ghost: ~/portfolio
                </span>
            </div>

            <div
                ref={bodyRef}
                className="p-4 h-[350px] overflow-y-auto overflow-x-hidden font-mono text-[12px] leading-[1.7] space-y-0.5"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((entry, i) => (
                    <div key={i} className={`${getLineClass(entry.type)} whitespace-pre break-all`}>
                        {entry.content}
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-1">
                    <span className="text-cyber-green shrink-0">rakesh@ghost:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-gray-200 font-mono text-[12px] caret-cyber-green"
                        spellCheck={false}
                        autoComplete="off"
                        disabled={isAnimating}
                    />
                </form>
            </div>
        </div>
    );
}
