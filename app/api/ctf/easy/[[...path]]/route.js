import { NextResponse } from 'next/server';
import { logRequest } from '@/lib/ctf-utils';
import { ctfHtmlPage } from '@/lib/ctf-html';

// ============================================================
// EASY CHALLENGE - The Phantom Directory
// Full HTML interfaces with portfolio-matching theme
// ============================================================

const ENCRYPTED_FLAG = 'RVhGe3ZRMEUrcTNwMGw1XzVlM19wZTVtbGxsfQ==';

const users = {
    '1': { id: 1, username: 'agent_null', role: 'analyst', clearance: 'LOW', department: 'cyber-ops', joined: '2024-03-15', notes: 'Standard analyst. Handles daily threat reports.', activity: { lastLogin: '2025-12-01T09:14:00Z', sessionsThisMonth: 23 } },
    '2': { id: 2, username: 'cipher_ghost', role: 'field_ops', clearance: 'MEDIUM', department: 'intel', joined: '2023-11-22', notes: 'Field operative. Active in sector 7.', activity: { lastLogin: '2025-12-14T22:05:00Z', sessionsThisMonth: 8 } },
    '3': { id: 3, username: 'root_shadow', role: 'admin', clearance: 'HIGH', department: 'infrastructure', joined: '2023-01-10', notes: 'System administrator. Responsible for infrastructure maintenance.', activity: { lastLogin: '2025-12-15T03:30:00Z', sessionsThisMonth: 45 } },
    '4': { id: 4, username: 'packet_wraith', role: 'analyst', clearance: 'LOW', department: 'cyber-ops', joined: '2024-08-01', notes: 'Network traffic analyst. Junior position.', activity: { lastLogin: '2025-12-10T11:20:00Z', sessionsThisMonth: 15 } },
    '5': { id: 5, username: 'zero_day', role: 'researcher', clearance: 'MEDIUM', department: 'intel', joined: '2024-01-05', notes: 'Vulnerability researcher. Published 3 advisories this quarter.', activity: { lastLogin: '2025-12-14T16:45:00Z', sessionsThisMonth: 31 } },
};

const hiddenUser88 = {
    id: 88, username: '[CLASSIFIED]', role: 'shadow_operative', clearance: 'OMEGA',
    department: '[REDACTED]', joined: '2022-??-??',
    notes: 'This profile is not listed in any public directory.',
    classified_data: { encryption: 'MULTI-LAYER', layers: ['Base64', 'ROT13'], payload: ENCRYPTED_FLAG, warning: 'Decrypt at your own risk. Access has been logged.' },
};

const departments = {
    'cyber-ops': { name: 'Cyber Operations', head: 'agent_null', members: 2 },
    'intel': { name: 'Intelligence', head: 'cipher_ghost', members: 2 },
    'infrastructure': { name: 'Infrastructure', head: 'root_shadow', members: 1 },
};

const auditLog = [
    { timestamp: '2025-12-14T23:59:59Z', action: 'LOGIN', userId: 3, ip: '10.0.0.15', detail: 'Standard admin login' },
    { timestamp: '2025-12-15T00:01:12Z', action: 'PRIVILEGE_ESCALATION', userId: 88, ip: '10.0.0.1', detail: 'Shadow operative session initiated' },
    { timestamp: '2025-12-15T00:02:30Z', action: 'FILE_ACCESS', userId: 88, ip: '10.0.0.1', detail: '/vault/classified_omega.enc' },
    { timestamp: '2025-12-15T00:03:45Z', action: 'DATA_EXPORT', userId: 88, ip: '10.0.0.1', detail: 'encrypted_payload_exported' },
    { timestamp: '2025-12-15T00:05:00Z', action: 'LOGOUT', userId: 88, ip: '10.0.0.1', detail: 'Session terminated' },
];

function nav(active) {
    const links = [
        { href: '/api/ctf/easy', label: 'DIRECTORY', id: '' },
        { href: '/api/ctf/easy/users', label: 'USERS', id: 'users' },
        { href: '/api/ctf/easy/departments', label: 'DEPARTMENTS', id: 'departments' },
        { href: '/api/ctf/easy/audit', label: 'AUDIT LOG', id: 'audit' },
    ];
    return `<div class="nav">${links.map(l => `<a href="${l.href}" class="${l.id === active ? 'active' : ''}">${l.label}</a>`).join('')}</div>`;
}

function badgeFor(clearance) {
    const map = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high', OMEGA: 'badge-omega' };
    return `<span class="badge ${map[clearance] || 'badge-low'}">${clearance}</span>`;
}

export async function GET(request, { params }) {
    const pathSegments = params?.path || [];
    const fullPath = pathSegments.join('/');
    logRequest('easy', 'GET', `/api/ctf/easy/${fullPath}`);

    // ── Root: Directory dashboard ──
    if (fullPath === '' || pathSegments.length === 0) {
        return ctfHtmlPage('Directory', `<div class="container animate-slide-up">
            <h1>PHANTOM DIRECTORY</h1>
            <p class="subtitle">PERSONNEL LOOKUP SERVICE v4.1.2</p>
            ${nav('')}
            <div class="card">
                <h2>System Overview</h2>
                <table>
                    <tr><td style="color:#555;width:180px">Service</td><td class="status-online">● ONLINE</td></tr>
                    <tr><td style="color:#555">Personnel Records</td><td>${Object.keys(users).length} active profiles</td></tr>
                    <tr><td style="color:#555">Departments</td><td>${Object.keys(departments).length} active units</td></tr>
                    <tr><td style="color:#555">Access Level</td><td><span class="badge badge-low">PUBLIC</span></td></tr>
                    <tr><td style="color:#555">Last Updated</td><td>2025-12-15 03:30 UTC</td></tr>
                </table>
            </div>
            <div class="card">
                <h2>Available Endpoints</h2>
                <table>
                    <tr><td><a href="/api/ctf/easy/users">/users</a></td><td>Browse personnel directory</td></tr>
                    <tr><td><a href="/api/ctf/easy/users/:id">/users/:id</a></td><td>View individual profile by ID</td></tr>
                    <tr><td><a href="/api/ctf/easy/departments">/departments</a></td><td>Department overview</td></tr>
                    <tr><td><a href="/api/ctf/easy/audit">/audit</a></td><td>System activity log</td></tr>
                </table>
                <!-- TODO: clean up internal refs. See: /api/ctf/easy/audit -->
            </div>
        </div>`);
    }

    // ── Users list ──
    if (fullPath === 'users') {
        const rows = Object.values(users).map(u => `<tr>
            <td><a href="/api/ctf/easy/users/${u.id}">${u.id}</a></td>
            <td style="color:var(--c-green)">${u.username}</td>
            <td>${u.role}</td>
            <td>${u.department}</td>
            <td>${badgeFor(u.clearance)}</td>
            <td style="color:#444">${u.joined}</td>
        </tr>`).join('');

        return ctfHtmlPage('Users', `<div class="container animate-slide-up">
            <h1>PHANTOM DIRECTORY</h1>
            <p class="subtitle">PERSONNEL DIRECTORY</p>
            ${nav('users')}
            <div class="card">
                <h2>Active Personnel - ${Object.keys(users).length} Records</h2>
                <table>
                    <thead><tr><th>ID</th><th>USERNAME</th><th>ROLE</th><th>DEPT</th><th>CLEARANCE</th><th>JOINED</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <p class="hint">Showing all PUBLIC profiles. Some records may not be listed here.</p>
            <!-- TODO: clean up internal refs. See: /api/ctf/easy/audit -->
        </div>`);
    }

    // ── Single user profile ──
    if (pathSegments[0] === 'users' && pathSegments[1]) {
        const userId = pathSegments[1];

        // Normal user
        if (users[userId]) {
            const u = users[userId];
            return ctfHtmlPage(`User ${u.username}`, `<div class="container animate-slide-up">
                <h1>PHANTOM DIRECTORY</h1>
                <p class="subtitle">USER PROFILE - ${u.username.toUpperCase()}</p>
                ${nav('users')}
                <div class="card">
                    <h2>Profile Details</h2>
                    <table>
                        <tr><td style="color:#555;width:160px">User ID</td><td>${u.id}</td></tr>
                        <tr><td style="color:#555">Username</td><td style="color:var(--c-green)">${u.username}</td></tr>
                        <tr><td style="color:#555">Role</td><td>${u.role}</td></tr>
                        <tr><td style="color:#555">Department</td><td>${u.department}</td></tr>
                        <tr><td style="color:#555">Clearance</td><td>${badgeFor(u.clearance)}</td></tr>
                        <tr><td style="color:#555">Joined</td><td>${u.joined}</td></tr>
                    </table>
                </div>
                <div class="card">
                    <h2>Notes</h2>
                    <p style="font-family:var(--font-mono);font-size:12px;color:#888">${u.notes}</p>
                </div>
                <div class="card">
                    <h2>Activity</h2>
                    <table>
                        <tr><td style="color:#555">Last Login</td><td>${u.activity.lastLogin}</td></tr>
                        <tr><td style="color:#555">Sessions (month)</td><td>${u.activity.sessionsThisMonth}</td></tr>
                    </table>
                </div>
                <div style="margin-top:16px"><a href="/api/ctf/easy/users" style="font-family:var(--font-display);font-size:10px;letter-spacing:2px">← ALL USERS</a></div>
            </div>`);
        }

        // ═══ HIDDEN USER 88 ═══
        if (userId === '88') {
            return ctfHtmlPage('CLASSIFIED', `<div class="container animate-slide-up">
                <h1 style="color:var(--c-magenta)">⚠ CLASSIFIED PROFILE</h1>
                <p class="subtitle">UNAUTHORIZED ACCESS - THIS RECORD IS OMEGA LEVEL</p>
                ${nav('users')}
                <div class="card classified">
                    <h2 style="color:var(--c-magenta)">Profile Details</h2>
                    <table>
                        <tr><td style="color:#555;width:160px">User ID</td><td style="color:var(--c-magenta)">${hiddenUser88.id}</td></tr>
                        <tr><td style="color:#555">Username</td><td style="color:var(--c-magenta)">${hiddenUser88.username}</td></tr>
                        <tr><td style="color:#555">Role</td><td>${hiddenUser88.role}</td></tr>
                        <tr><td style="color:#555">Department</td><td>${hiddenUser88.department}</td></tr>
                        <tr><td style="color:#555">Clearance</td><td>${badgeFor(hiddenUser88.clearance)}</td></tr>
                        <tr><td style="color:#555">Joined</td><td>${hiddenUser88.joined}</td></tr>
                    </table>
                </div>
                <div class="card classified">
                    <h2 style="color:var(--c-magenta)">Classified Data</h2>
                    <table>
                        <tr><td style="color:#555;width:160px">Encryption</td><td style="color:var(--c-amber)">${hiddenUser88.classified_data.encryption}</td></tr>
                        <tr><td style="color:#555">Layers</td><td style="color:var(--c-cyan)">${hiddenUser88.classified_data.layers.join(' → ')}</td></tr>
                    </table>
                    <div class="result" style="margin-top:16px;border-color:rgba(255,45,85,0.15)">
                        <p style="color:var(--c-magenta);font-size:10px;letter-spacing:1px;margin-bottom:8px;font-family:var(--font-display)">ENCRYPTED PAYLOAD</p>
                        <pre style="color:var(--c-amber);font-size:14px;word-break:break-all">${hiddenUser88.classified_data.payload}</pre>
                    </div>
                    <p style="color:var(--c-magenta);font-size:10px;margin-top:12px;font-family:var(--font-mono)">${hiddenUser88.classified_data.warning}</p>
                </div>
                <div style="margin-top:16px"><a href="/api/ctf/easy/users" style="font-family:var(--font-display);font-size:10px;letter-spacing:2px">← ALL USERS</a></div>
            </div>`);
        }

        return ctfHtmlPage('404', `<div class="container animate-slide-up">
            <h1>USER NOT FOUND</h1>
            <p class="subtitle">NO RECORD FOR ID: ${userId}</p>
            ${nav('users')}
            <div class="card"><p class="error">✗ User ID "${userId}" does not exist in the public directory.</p>
            <p class="hint" style="margin-top:12px">Available IDs: ${Object.keys(users).join(', ')}. Or are there more?</p></div>
            <div style="margin-top:16px"><a href="/api/ctf/easy/users" style="font-family:var(--font-display);font-size:10px;letter-spacing:2px">← ALL USERS</a></div>
        </div>`);
    }

    // ── Departments ──
    if (fullPath === 'departments') {
        const rows = Object.entries(departments).map(([id, d]) => `<tr>
            <td style="color:var(--c-green)">${id}</td>
            <td>${d.name}</td>
            <td><a href="/api/ctf/easy/users">${d.head}</a></td>
            <td>${d.members}</td>
        </tr>`).join('');

        return ctfHtmlPage('Departments', `<div class="container animate-slide-up">
            <h1>PHANTOM DIRECTORY</h1>
            <p class="subtitle">DEPARTMENT OVERVIEW</p>
            ${nav('departments')}
            <div class="card">
                <h2>Active Departments</h2>
                <table>
                    <thead><tr><th>UNIT ID</th><th>NAME</th><th>HEAD</th><th>MEMBERS</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <p class="hint">Some departments have been redacted from public listings.</p>
        </div>`);
    }

    // ── Audit log ──
    if (fullPath === 'audit') {
        const rows = auditLog.map(e => {
            const isHidden = e.userId === 88;
            const color = isHidden ? 'var(--c-magenta)' : '#777';
            const actionColor = e.action === 'PRIVILEGE_ESCALATION' ? 'var(--c-magenta)' :
                               e.action === 'FILE_ACCESS' ? 'var(--c-amber)' :
                               e.action === 'DATA_EXPORT' ? 'var(--c-cyan)' : '#777';
            return `<tr>
                <td style="color:#555">${e.timestamp.replace('T', ' ').replace('Z', '')}</td>
                <td style="color:${actionColor};font-weight:${isHidden ? '600' : '400'}">${e.action}</td>
                <td style="color:${color};font-weight:${isHidden ? '700' : '400'}">${e.userId}${isHidden ? ' ⚠' : ''}</td>
                <td style="color:#555">${e.ip}</td>
                <td>${e.detail}</td>
            </tr>`;
        }).join('');

        return ctfHtmlPage('Audit Log', `<div class="container animate-slide-up">
            <h1>PHANTOM DIRECTORY</h1>
            <p class="subtitle">SYSTEM ACTIVITY LOG - INTERNAL</p>
            ${nav('audit')}
            <div class="card" style="border-color:rgba(255,176,0,0.15)">
                <h2 style="color:var(--c-amber)">⚠ Classification: INTERNAL - DO NOT DISTRIBUTE</h2>
                <p style="color:var(--c-amber);font-family:var(--font-mono);font-size:11px;margin-bottom:16px">This log should not be publicly accessible.</p>
                <table>
                    <thead><tr><th>TIMESTAMP</th><th>ACTION</th><th>USER ID</th><th>IP</th><th>DETAIL</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <p class="hint">Notice any unusual user IDs in the log entries?</p>
        </div>`);
    }

    // ── Vault (decoy #2) ──
    if (fullPath === 'vault') {
        return ctfHtmlPage('Vault', `<div class="container animate-slide-up">
            <h1 style="color:var(--c-amber)">CLASSIFIED VAULT</h1>
            <p class="subtitle">RESTRICTED ACCESS AREA</p>
            ${nav('')}
            <div class="card classified">
                <h2 style="color:var(--c-amber)">Vault Contents</h2>
                <table>
                    <tr><td style="color:#555;width:120px">File</td><td>classified_omega.enc</td></tr>
                    <tr><td style="color:#555">Key</td><td style="color:var(--c-amber);font-weight:600">7f3a9b2c4e1d6h8k0m5n... [CORRUPTED]</td></tr>
                    <tr><td style="color:#555">Status</td><td><span class="badge badge-high">RESTRICTED</span></td></tr>
                </table>
                <p style="color:#555;font-family:var(--font-mono);font-size:11px;margin-top:12px">Vault key extracted. Is this what you were looking for?</p>
            </div>
        </div>`);
    }

    // ── robots.txt ──
    if (fullPath === 'robots.txt') {
        return new Response(
            `# Ghost Protocol Directory Service\nUser-agent: *\nDisallow: /api/ctf/easy/audit\nDisallow: /api/ctf/easy/users/88\nDisallow: /api/ctf/easy/vault\n# Nothing to see here, operative.`,
            { headers: { 'Content-Type': 'text/plain' } }
        );
    }

    return ctfHtmlPage('404', `<div class="container animate-slide-up">
        <h1>NOT FOUND</h1>
        <p class="subtitle">ENDPOINT DOES NOT EXIST</p>
        ${nav('')}
        <div class="card"><p class="error">✗ /${fullPath} is not a valid endpoint.</p></div>
    </div>`);
}
