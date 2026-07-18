import { projects } from '@/data/profile';
import Link from 'next/link';

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }) {
    const project = projects.find(p => p.id === params.slug);
    if (!project) return { title: 'Project Not Found' };
    return {
        title: `${project.name} - RAKESH R K`,
        description: project.description,
        openGraph: {
            title: `${project.name} - RAKESH R K`,
            description: project.description,
        },
    };
}

const technicalApproach = {
    'kalp-ai': 'KALP_AI is built with Tauri (Rust backend) and React+TypeScript frontend, creating a lightweight cross-platform desktop application. The core innovation is using Small Language Models (SLMs) instead of cloud-based LLMs for privacy-first pentesting. The framework adapts its attack strategies based on discovered vulnerabilities, creating intelligent attack chains that mimic real-world adversary behavior. Each test generates structured reports with CVSS scoring and remediation guidance.',
    'sentinelhunt': 'SentinelHunt uses a multi-language pipeline: Go for high-performance packet capture, Python for feature engineering and ML detection, and Node.js+React+TypeScript for the dashboard. The detection engine analyses behavioral patterns - DNS query entropy for tunneling, inter-arrival time variability for C2 beaconing, destination port diversity for scanning, and byte transfer rates for exfiltration. SHAP (SHapley Additive exPlanations) provides per-alert feature attribution, generating human-readable narratives explaining why each alert was triggered.',
    'ghostnet': 'GhostNet implements ChaCha20-Poly1305 for authenticated encryption, ensuring data integrity and confidentiality. The framework supports protocol diversification over A and TXT records, with a randomized mode that interleaves query types to bypass signature-based detection. Micro-delays with configurable jitter break traffic analysis patterns. The Session Reaper thread handles lifecycle management, cleaning up orphan transfers and preventing memory exhaustion. Full Docker deployment with structlog JSON logging for ELK/Prometheus integration.',
    'forenscope': 'ForenScope uses a dual-language approach - fast Bash scripts for initial triage (file type detection, string extraction, hash computation) and Python modules for advanced analysis (steganography detection, metadata extraction, payload carving). The master script orchestrates both layers, automatically identifying the most promising analysis path. Flag patterns are configurable via regex, supporting any CTF format. Reports include cryptographic hash verification for evidence integrity.',
    'ai4kali': 'AI4Kali bridges the gap between natural language intent and complex security tool syntax. Using API calls to language models, it translates queries like "scan the network for open ports" into properly formatted nmap commands with appropriate flags. The tool maintains context awareness across sessions and supports chaining commands for multi-step operations.',
    'portknock': 'Port Knocking uses knockd to listen for connection attempts on a specific sequence of closed ports. Upon correct sequence detection, iptables rules are dynamically modified to whitelist the source IP. The system implements auto-lock with configurable timeouts, generating audit logs for every access attempt. Integration with fail2ban provides additional brute-force protection against sequence guessing attacks.',
    'stockerx': 'StockerX is built on the MERN stack - React+Vite frontend with GSAP animations for smooth transitions, Express.js API layer, and MongoDB for persistent storage. Real-time stock data is fetched via market APIs, with interactive charting for technical analysis. The responsive UI adapts seamlessly between desktop and mobile form factors, with search and filtering across market data.',
    'campus-network': 'The University Campus Network was designed in Cisco Packet Tracer with 50+ nodes spanning multiple departments. VLAN segmentation isolates department traffic, with inter-VLAN routing configured on Layer 3 switches. DNS, DHCP, and HTTPS services run on dedicated servers, with SMTP email provisioned for administrative nodes. The design demonstrates enterprise-grade network architecture with proper security boundaries.',
    'ipchanger': 'The IP Changer leverages the Tor SOCKS proxy to cycle through exit nodes at configurable intervals. Each rotation event is cryptographically logged with timestamps, enabling post-incident auditing while maintaining operational security. Verification checks confirm the IP change before proceeding, with fallback retry logic for failed rotations.',
};

// Architecture diagrams per project
const architectureLayers = {
    'kalp-ai': [
        { layer: 'UI Layer', desc: 'React + TypeScript', color: 'text-cyber-cyan' },
        { layer: 'Bridge', desc: 'Tauri IPC Commands', color: 'text-cyber-amber' },
        { layer: 'Core Engine', desc: 'Rust Backend + SLM Integration', color: 'text-cyber-green' },
        { layer: 'Analysis', desc: 'CVSS Scoring + Report Generation', color: 'text-cyber-magenta' },
    ],
    'sentinelhunt': [
        { layer: 'Dashboard', desc: 'React + TypeScript + Node.js', color: 'text-cyber-cyan' },
        { layer: 'SHAP Engine', desc: 'Explainable AI Narratives', color: 'text-cyber-amber' },
        { layer: 'ML Detection', desc: 'Python Feature Engineering', color: 'text-cyber-green' },
        { layer: 'Capture', desc: 'Go Packet Processor', color: 'text-cyber-magenta' },
    ],
    'ghostnet': [
        { layer: 'Client CLI', desc: 'Python + argparse', color: 'text-cyber-cyan' },
        { layer: 'Encryption', desc: 'ChaCha20-Poly1305', color: 'text-cyber-amber' },
        { layer: 'Protocol', desc: 'A/TXT Record Diversification', color: 'text-cyber-green' },
        { layer: 'Server', desc: 'DNS Server + Session Reaper', color: 'text-cyber-magenta' },
    ],
};

export default function ProjectPage({ params }) {
    const project = projects.find(p => p.id === params.slug);

    if (!project) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center font-mono text-cyber-magenta">
                <div className="text-center">
                    <p className="text-8xl mb-6 font-display font-bold">404</p>
                    <p className="text-base tracking-wider mb-4">ACCESS DENIED - Project not found</p>
                    <Link href="/" className="text-cyber-green text-sm mt-4 inline-block hover:underline tracking-wider">
                        ← Return to base
                    </Link>
                </div>
            </div>
        );
    }

    const currentIndex = projects.findIndex(p => p.id === params.slug);
    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
    const layers = architectureLayers[project.id];

    return (
        <div className="min-h-screen bg-cyber-black text-gray-200">
            {/* Overlays */}
            <div className="noise-overlay" aria-hidden="true" />
            <div className="scanline-overlay" aria-hidden="true" />
            <div className="vignette" aria-hidden="true" />

            {/* Top nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-black/95 backdrop-blur-xl border-b border-cyber-green/5 px-6 sm:px-10 lg:px-20 h-16 flex items-center">
                <Link href="/" className="font-mono text-xs tracking-wider text-gray-500 hover:text-cyber-green transition-colors">
                    ← BACK TO BASE
                </Link>
                <span className="mx-4 text-gray-800">|</span>
                <span className="font-display text-base tracking-wider text-gray-400">
                    {project.name}
                </span>
                <div className="ml-auto flex items-center gap-4">
                    <span className={`font-mono text-xs tracking-wider px-2.5 py-1 border rounded-sm ${project.status === 'ACTIVE' ? 'text-cyber-green border-cyber-green/20' :
                        project.status === 'OPERATIONAL' ? 'text-cyber-cyan border-cyber-cyan/20' :
                            'text-gray-400 border-gray-700'
                        }`}>
                        {project.status}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-gray-700 hidden sm:block">
                        {project.classification}
                    </span>
                </div>
            </nav>

            <main className="pt-28 pb-20 px-6 sm:px-10 lg:px-20">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-mono text-xs tracking-widest text-cyber-cyan/60">{project.type}</span>
                            <span className="text-gray-800">•</span>
                            <span className="font-mono text-xs tracking-wider text-gray-600">{project.team}</span>
                        </div>

                        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-200 mb-6">
                            {project.name}
                        </h1>
                        <p className="font-body text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl">
                            {project.description}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_0.4fr] gap-12 lg:gap-20">
                        {/* Left column: Main content */}
                        <div className="space-y-12">
                            {/* Tech stack */}
                            <div>
                                <h2 className="font-mono text-xs tracking-[0.3em] text-gray-600 mb-5 pb-2 border-b border-gray-800/30">PAYLOADS_DEPLOYED</h2>
                                <div className="flex flex-wrap gap-2.5">
                                    {project.tech.map((t) => (
                                        <span key={t} className="font-mono text-xs tracking-wider px-4 py-2 border border-cyber-green/12 text-gray-400 hover:text-cyber-green hover:border-cyber-green/30 transition-all bg-cyber-green/[0.02]">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Capabilities */}
                            <div>
                                <h2 className="font-mono text-xs tracking-[0.3em] text-gray-600 mb-5 pb-2 border-b border-gray-800/30">CAPABILITIES</h2>
                                <div className="border border-cyber-green/8 divide-y divide-cyber-green/5">
                                    {project.features.map((feat, i) => (
                                        <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-cyber-green/[0.02] transition-colors group">
                                            <span className="text-cyber-green/40 font-mono text-xs mt-0.5 shrink-0 group-hover:text-cyber-green/70 transition-colors">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className="font-body text-sm text-gray-400 leading-relaxed">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Approach */}
                            <div>
                                <h2 className="font-mono text-xs tracking-[0.3em] text-gray-600 mb-5 pb-2 border-b border-gray-800/30">TECHNICAL_APPROACH</h2>
                                <div className="border border-gray-800/40 bg-cyber-dark/20 p-6 sm:p-8">
                                    <p className="font-body text-sm sm:text-base text-gray-400 leading-relaxed">
                                        {technicalApproach[project.id] || project.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right column: Sidebar */}
                        <div className="space-y-8">
                            {/* Architecture */}
                            {layers && (
                                <div className="border border-gray-800/40 bg-cyber-dark/20 p-5">
                                    <h3 className="font-mono text-[10px] tracking-[0.3em] text-gray-600 mb-5">ARCHITECTURE</h3>
                                    <div className="space-y-0">
                                        {layers.map((l, i) => (
                                            <div key={i}>
                                                <div className="flex items-center justify-between py-3 px-3 border border-gray-800/20 bg-cyber-black/40">
                                                    <span className={`font-mono text-xs tracking-wider ${l.color}`}>{l.layer}</span>
                                                    <span className="font-mono text-[10px] text-gray-600">{l.desc}</span>
                                                </div>
                                                {i < layers.length - 1 && (
                                                    <div className="text-center text-gray-700 text-xs py-0.5">↓</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick stats */}
                            <div className="border border-gray-800/40 bg-cyber-dark/20 p-5 space-y-3">
                                <h3 className="font-mono text-[10px] tracking-[0.3em] text-gray-600 mb-3">PROJECT_INFO</h3>
                                <div className="flex justify-between font-mono text-xs">
                                    <span className="text-gray-600">Status</span>
                                    <span className={project.status === 'ACTIVE' ? 'text-cyber-green' : 'text-cyber-cyan'}>{project.status}</span>
                                </div>
                                <div className="flex justify-between font-mono text-xs">
                                    <span className="text-gray-600">Team</span>
                                    <span className="text-gray-400">{project.team}</span>
                                </div>
                                <div className="flex justify-between font-mono text-xs">
                                    <span className="text-gray-600">Type</span>
                                    <span className="text-gray-400">{project.type}</span>
                                </div>
                                <div className="flex justify-between font-mono text-xs">
                                    <span className="text-gray-600">Stack</span>
                                    <span className="text-gray-400">{project.tech.length} technologies</span>
                                </div>
                                <div className="flex justify-between font-mono text-xs">
                                    <span className="text-gray-600">Features</span>
                                    <span className="text-gray-400">{project.features.length} capabilities</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-3">
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full font-mono text-sm tracking-wider px-5 py-3.5 border border-cyber-green/20 text-cyber-green hover:bg-cyber-green/5 hover:border-cyber-green/40 transition-all text-center"
                                >
                                    VIEW SOURCE ↗
                                </a>
                                <Link
                                    href="/"
                                    className="block w-full font-mono text-sm tracking-wider px-5 py-3.5 border border-gray-700/30 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-all text-center"
                                >
                                    ← ALL OPERATIONS
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Previous / Next navigation */}
                    <div className="mt-20 pt-8 border-t border-gray-800/20 grid grid-cols-2 gap-6">
                        {prevProject ? (
                            <Link
                                href={`/projects/${prevProject.id}`}
                                className="group border border-gray-800/20 p-5 hover:border-cyber-green/15 transition-all"
                            >
                                <span className="font-mono text-[10px] text-gray-700 tracking-wider block mb-2">← PREVIOUS</span>
                                <span className="font-display text-base text-gray-400 tracking-wider group-hover:text-cyber-green transition-colors">
                                    {prevProject.name}
                                </span>
                                <span className="font-mono text-[10px] text-gray-700 tracking-wider block mt-1">{prevProject.type}</span>
                            </Link>
                        ) : <div />}
                        {nextProject ? (
                            <Link
                                href={`/projects/${nextProject.id}`}
                                className="group border border-gray-800/20 p-5 hover:border-cyber-green/15 transition-all text-right"
                            >
                                <span className="font-mono text-[10px] text-gray-700 tracking-wider block mb-2">NEXT →</span>
                                <span className="font-display text-base text-gray-400 tracking-wider group-hover:text-cyber-green transition-colors">
                                    {nextProject.name}
                                </span>
                                <span className="font-mono text-[10px] text-gray-700 tracking-wider block mt-1">{nextProject.type}</span>
                            </Link>
                        ) : <div />}
                    </div>
                </div>
            </main>

            <footer className="border-t border-gray-800/20 py-8 px-6 sm:px-10 lg:px-20">
                <p className="font-mono text-xs text-gray-700 tracking-wider text-center">
                    © 2025 {'{'}RAKESH R K{'}'} - GHOST PROTOCOL v3.0
                </p>
            </footer>
        </div>
    );
}
