import { logRequest } from '@/lib/ctf-utils';
import { ctfHtmlPage } from '@/lib/ctf-html';

// ============================================================
// MEDIUM CHALLENGE - Injection Protocol
// Full HTML interfaces with portfolio-matching theme
// ============================================================

const personnel = [
    { id: 1, username: 'admin', password: 'X#k9$mP!vR2@nL', role: 'administrator', email: 'admin@ghostops.local', clearance: 'LEVEL_5', department: 'HQ', notes: 'Primary system administrator' },
    { id: 2, username: 'analyst_k', password: 'p4ck3t_sn1ff3r', role: 'analyst', email: 'k.patel@ghostops.local', clearance: 'LEVEL_2', department: 'cyber-ops', notes: 'Handles threat intelligence reports' },
    { id: 3, username: 'field_agent_7', password: 'r3c0n_m1ss10n', role: 'operative', email: 'agent7@ghostops.local', clearance: 'LEVEL_3', department: 'field', notes: 'Currently deployed in sector 9' },
    { id: 4, username: 'guest', password: 'guest2025', role: 'viewer', email: 'guest@ghostops.local', clearance: 'LEVEL_1', department: 'public', notes: 'Read-only access. Nothing to see here.' },
    { id: 5, username: 'sys_monitor', password: 'n0d3_w4tch3r', role: 'system', email: 'monitor@ghostops.local', clearance: 'LEVEL_4', department: 'infrastructure', notes: 'Automated monitoring system' },
    { id: 6, username: 'intel_lead', password: 'th3_br13f1ng', role: 'intelligence', email: 'intel@ghostops.local', clearance: 'LEVEL_3', department: 'intel', notes: 'Intelligence lead. Handles classified briefings.' },
];

const classifiedVault = [
    { key: 'operation_blackout_report', value: 'See physical archives, Room B-12', level: 'LEVEL_5' },
    { key: 'asset_file_alpha', value: 'https://drive.google.com/file/d/16HNnNxjDD71ujcl1qzfKX3mGwNUBV7zC/view?usp=drive_link', level: 'OMEGA' },
    { key: 'decoy_bait', value: 'FLAG{n0t_th3_r3al_fl4g}', level: 'LEVEL_2' },
    { key: 'extraction_coordinates', value: 'Coordinates encrypted. Key held by admin only.', level: 'LEVEL_5' },
];

function checkWAF(query) {
    const blocked = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'EXEC', 'TRUNCATE', 'ATTACH', 'DETACH'];
    const upper = query.toUpperCase();
    for (const word of blocked) {
        if (upper.includes(word)) return { blocked: true, keyword: word };
    }
    return { blocked: false };
}

function simulateSearch(query, field) {
    const validFields = ['username', 'email', 'department', 'role', 'notes'];
    const searchField = validFields.includes(field) ? field : 'username';
    const sql = `SELECT id, username, role, email, clearance, department, notes FROM personnel WHERE ${searchField} LIKE '%${query}%'`;

    const hasInjection = query.includes("'") && (
        query.toUpperCase().includes('AND') || query.toUpperCase().includes('OR') ||
        query.toUpperCase().includes('UNION') || query.includes('--') || query.includes('=')
    );
    const singleQuoteCount = (query.match(/'/g) || []).length;
    const hasComment = query.includes('--');
    const hasTautology = /['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/.test(query);

    if (query.includes("'") && !hasComment && !hasTautology && singleQuoteCount % 2 !== 0) {
        return { error: true, message: `near "${query.substring(0, 30)}": syntax error`, debug: sql };
    }

    if (hasInjection && (hasTautology || hasComment)) {
        return { error: false, rows: personnel.map(p => ({ id: p.id, username: p.username, role: p.role, email: p.email, clearance: p.clearance, department: p.department, notes: p.notes })), injected: true, sql };
    }

    if (query.toUpperCase().includes('UNION') && query.toUpperCase().includes('SELECT')) {
        const upper = query.toUpperCase();
        if (upper.includes('CLASSIFIED_VAULT') || upper.includes('CLASSIFIED') || upper.includes('VAULT')) {
            return { error: false, rows: classifiedVault.map(v => ({ id: '-', username: v.key, role: v.value, email: v.level, clearance: '-', department: '-', notes: '-' })), injected: true, sql };
        }
        return { error: false, rows: personnel.map(p => ({ id: p.id, username: p.username, role: p.role, email: p.email, clearance: p.clearance, department: p.department, notes: p.notes })), injected: true, sql };
    }

    const results = personnel.filter(p => String(p[searchField] || '').toLowerCase().includes(query.toLowerCase()));
    return { error: false, rows: results.map(p => ({ id: p.id, username: p.username, role: p.role, email: p.email, clearance: p.clearance, department: p.department, notes: p.notes })), injected: false, sql };
}

function nav(active) {
    const links = [
        { href: '/api/ctf/medium', label: 'DASHBOARD', id: '' },
        { href: '/api/ctf/medium/login', label: 'LOGIN', id: 'login' },
        { href: '/api/ctf/medium/search', label: 'SEARCH', id: 'search' },
        { href: '/api/ctf/medium/schema', label: 'SCHEMA', id: 'schema' },
    ];
    return `<div class="nav">${links.map(l => `<a href="${l.href}" class="${l.id === active ? 'active' : ''}">${l.label}</a>`).join('')}</div>`;
}

export async function GET(request, { params }) {
    const pathSegments = params?.path || [];
    const fullPath = pathSegments.join('/');
    logRequest('medium', 'GET', `/api/ctf/medium/${fullPath}`);

    // Dashboard
    if (fullPath === '' || pathSegments.length === 0) {
        return ctfHtmlPage('Dashboard', `<div class="container animate-slide-up">
            <h1>GHOST PROTOCOL</h1>
            <p class="subtitle">PERSONNEL MANAGEMENT SYSTEM v3.2.1</p>
            ${nav('')}
            <div class="card">
                <h2>System Status</h2>
                <table>
                    <tr><td style="color:#555;width:200px">Database</td><td><span class="status-online">● ONLINE</span> - SQLite 3</td></tr>
                    <tr><td style="color:#555">Personnel</td><td>6 active records</td></tr>
                    <tr><td style="color:#555">Auth Module</td><td><span class="status-online">● SECURE</span> - Parameterized</td></tr>
                    <tr><td style="color:#555">Search Module</td><td><span class="status-warning">● LEGACY</span> - Pending security review</td></tr>
                    <tr><td style="color:#555">WAF</td><td>GhostWAF v2.1 - <span class="status-online">Active</span></td></tr>
                </table>
            </div>
            <div class="card">
                <h2>Available Endpoints</h2>
                <table>
                    <tr><td><a href="/api/ctf/medium/login">/login</a></td><td>Personnel authentication</td></tr>
                    <tr><td><a href="/api/ctf/medium/search">/search</a></td><td>Personnel search interface</td></tr>
                    <tr><td><a href="/api/ctf/medium/schema">/schema</a></td><td>Public database schema</td></tr>
                </table>
            </div>
            <p class="hint">Two endpoints accept input. One is secure. The other... isn't.</p>
        </div>`);
    }

    // Login page
    if (fullPath === 'login') {
        return ctfHtmlPage('Login', `<div class="container animate-slide-up">
            <h1>GHOST PROTOCOL</h1>
            <p class="subtitle">PERSONNEL AUTHENTICATION</p>
            ${nav('login')}
            <div class="card">
                <h2>Login</h2>
                <form method="POST" action="/api/ctf/medium/login">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter username..." autocomplete="off" />
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter password..." />
                    <button type="submit">AUTHENTICATE</button>
                </form>
                <p class="hint">Authorized personnel only. All access is logged.</p>
            </div>
        </div>`);
    }

    // Search page
    if (fullPath === 'search') {
        return ctfHtmlPage('Search', `<div class="container animate-slide-up">
            <h1>GHOST PROTOCOL</h1>
            <p class="subtitle">PERSONNEL SEARCH</p>
            ${nav('search')}
            <div class="card">
                <h2>Search Personnel Database</h2>
                <form method="POST" action="/api/ctf/medium/search">
                    <label>Search Query</label>
                    <input type="text" name="query" placeholder="Enter search term..." autocomplete="off" />
                    <label>Search Field</label>
                    <select name="field">
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                        <option value="department">Department</option>
                        <option value="role">Role</option>
                        <option value="notes">Notes</option>
                    </select>
                    <button type="submit">SEARCH</button>
                </form>
                <p class="hint">Search across personnel records. Results filtered by GhostWAF v2.1.</p>
            </div>
        </div>`);
    }

    // Schema
    if (fullPath === 'schema') {
        return ctfHtmlPage('Schema', `<div class="container animate-slide-up">
            <h1>GHOST PROTOCOL</h1>
            <p class="subtitle">DATABASE SCHEMA</p>
            ${nav('schema')}
            <div class="card">
                <h2>Public Tables</h2>
                <table>
                    <thead><tr><th>TABLE</th><th>COLUMNS</th><th>ROWS</th><th>ACCESS</th></tr></thead>
                    <tbody>
                        <tr>
                            <td style="color:var(--c-green)">personnel</td>
                            <td>id, username, role, email, clearance, department, notes</td>
                            <td>6</td>
                            <td><span class="badge badge-public">PUBLIC</span></td>
                        </tr>
                    </tbody>
                </table>
                <p class="hint" style="margin-top:16px">Password column excluded from public schema. Only public tables are shown.</p>
            </div>
            <div class="card">
                <h2>Database Engine</h2>
                <table>
                    <tr><td style="color:#555;width:180px">Type</td><td>SQLite 3</td></tr>
                    <tr><td style="color:#555">Query Method</td><td style="color:var(--c-amber)">Direct string concatenation (search)</td></tr>
                    <tr><td style="color:#555">Auth Method</td><td style="color:var(--c-green)">Parameterized (auth)</td></tr>
                    <tr><td style="color:#555">WAF Blocks</td><td style="color:var(--c-magenta)">DROP, DELETE, INSERT, UPDATE, ALTER, CREATE</td></tr>
                    <tr><td style="color:#555">WAF Allows</td><td style="color:var(--c-green)">SELECT, UNION, AND, OR, LIKE</td></tr>
                </table>
            </div>
            <div class="card">
                <h2>Internal Notes</h2>
                <p style="color:#333;font-family:var(--font-mono);font-size:11px">[ CLASSIFIED ] Additional tables may exist but require elevated clearance. Query carefully.</p>
            </div>
        </div>`);
    }

    return ctfHtmlPage('404', `<div class="container animate-slide-up">
        <h1>NOT FOUND</h1><p class="subtitle">Use POST for login/search endpoints</p>
        ${nav('')}<div class="card"><p class="error">✗ Endpoint not found.</p></div>
    </div>`);
}

export async function POST(request, { params }) {
    const pathSegments = params?.path || [];
    const fullPath = pathSegments.join('/');

    let body = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        body = await request.json();
    } else if (contentType.includes('form')) {
        const formData = await request.formData();
        for (const [k, v] of formData.entries()) body[k] = v;
    } else {
        try { body = await request.json(); } catch {
            try { const fd = await request.formData(); for (const [k, v] of fd.entries()) body[k] = v; } catch {}
        }
    }

    // POST /login - DECOY (secure)
    if (fullPath === 'login') {
        const { username, password } = body;
        logRequest('medium', 'POST', '/api/ctf/medium/login', { username });

        if (!username || !password) {
            return ctfHtmlPage('Login - Error', `<div class="container animate-slide-up">
                <h1>GHOST PROTOCOL</h1><p class="subtitle">AUTHENTICATION</p>${nav('login')}
                <div class="card"><p class="error">✗ Username and password are required.</p>
                <br><a href="/api/ctf/medium/login" class="btn" style="margin-top:12px">← TRY AGAIN</a></div></div>`);
        }

        const user = personnel.find(p => p.username === username && p.password === password);

        if (user) {
            return ctfHtmlPage('Login - Authenticated', `<div class="container animate-slide-up">
                <h1>GHOST PROTOCOL</h1><p class="subtitle">AUTHENTICATION</p>${nav('login')}
                <div class="card">
                    <p class="success" style="font-size:14px;margin-bottom:16px">✓ AUTHENTICATED SUCCESSFULLY</p>
                    <table>
                        <tr><td style="color:#555;width:140px">User</td><td style="color:var(--c-green)">${user.username}</td></tr>
                        <tr><td style="color:#555">Role</td><td>${user.role}</td></tr>
                        <tr><td style="color:#555">Clearance</td><td>${user.clearance}</td></tr>
                    </table>
                    <p class="hint" style="margin-top:16px;color:#555">This endpoint uses parameterized queries - it's properly secured. The vulnerability is elsewhere.</p>
                </div></div>`);
        }

        return ctfHtmlPage('Login - Denied', `<div class="container animate-slide-up">
            <h1>GHOST PROTOCOL</h1><p class="subtitle">AUTHENTICATION</p>${nav('login')}
            <div class="card">
                <p class="error" style="font-size:14px;margin-bottom:12px">✗ ACCESS DENIED</p>
                <p style="color:#555;font-family:var(--font-mono);font-size:12px">Invalid credentials for user "${username}".</p>
                <p class="hint" style="margin-top:12px;color:#444">This endpoint is properly secured. Maybe try the search interface?</p>
                <br><a href="/api/ctf/medium/login" class="btn">← TRY AGAIN</a>
            </div></div>`);
    }

    // POST /search - VULNERABLE
    if (fullPath === 'search') {
        const { query, field } = body;
        logRequest('medium', 'POST', '/api/ctf/medium/search', { query, field });

        if (!query) {
            return ctfHtmlPage('Search - Error', `<div class="container animate-slide-up">
                <h1>GHOST PROTOCOL</h1><p class="subtitle">SEARCH</p>${nav('search')}
                <div class="card"><p class="error">✗ Search query is required.</p>
                <br><a href="/api/ctf/medium/search" class="btn">← TRY AGAIN</a></div></div>`);
        }

        const waf = checkWAF(query);
        if (waf.blocked) {
            return ctfHtmlPage('Search - Blocked', `<div class="container animate-slide-up">
                <h1>GHOST PROTOCOL</h1><p class="subtitle">SEARCH</p>${nav('search')}
                <div class="card classified">
                    <h2 style="color:var(--c-magenta)">⚠ GhostWAF v2.1 - BLOCKED</h2>
                    <p style="color:var(--c-magenta);font-family:var(--font-mono);font-size:12px;margin-bottom:8px">Keyword <span style="color:#fff">"${waf.keyword}"</span> is not allowed.</p>
                    <p class="hint" style="color:#444">Destructive SQL operations are blocked. But not everything is...</p>
                    <br><a href="/api/ctf/medium/search" class="btn" style="border-color:var(--c-magenta);color:var(--c-magenta)">← TRY AGAIN</a>
                </div></div>`);
        }

        const result = simulateSearch(query, field);

        if (result.error) {
            return ctfHtmlPage('Search - Error', `<div class="container animate-slide-up">
                <h1>GHOST PROTOCOL</h1><p class="subtitle">SEARCH</p>${nav('search')}
                <div class="card">
                    <h2 style="color:var(--c-magenta)">Database Error</h2>
                    <div class="result" style="border-color:rgba(255,45,85,0.15)">
                        <pre style="color:var(--c-magenta)">${result.message}</pre>
                    </div>
                    <p style="color:#555;font-family:var(--font-mono);font-size:10px;margin-top:12px">Debug: ${result.debug}</p>
                    <p class="hint" style="color:#444">Check your SQL syntax. The query is being concatenated directly.</p>
                    <br><a href="/api/ctf/medium/search" class="btn">← TRY AGAIN</a>
                </div></div>`);
        }

        // Results table
        let resultsHtml = '';
        if (result.rows.length > 0) {
            const rows = result.rows.map(r => `<tr>
                <td>${r.id}</td><td style="color:var(--c-green)">${r.username}</td><td>${r.role}</td>
                <td>${r.email}</td><td>${r.clearance}</td><td>${r.department}</td>
                <td style="color:#555;font-size:10px;max-width:160px;overflow:hidden;text-overflow:ellipsis">${r.notes}</td>
            </tr>`).join('');
            resultsHtml = `<table><thead><tr><th>ID</th><th>USERNAME</th><th>ROLE</th><th>EMAIL</th><th>CLEARANCE</th><th>DEPT</th><th>NOTES</th></tr></thead><tbody>${rows}</tbody></table>`;
        } else {
            resultsHtml = '<p style="color:#555;font-family:var(--font-mono);font-size:12px;margin-top:12px">No results found.</p>';
        }

        // Vault leak
        let leakHtml = '';
        if (result.injected && result.rows.length >= 6) {
            const vaultRows = classifiedVault.map(v => {
                const isLink = v.value.startsWith('http');
                const bclass = v.level === 'OMEGA' ? 'badge-omega' : v.level === 'LEVEL_5' ? 'badge-high' : 'badge-medium';
                return `<tr>
                    <td style="color:#888">${v.key}</td>
                    <td style="${v.level === 'OMEGA' ? 'font-weight:700' : ''}">${isLink ? `<a href="${v.value}" target="_blank" class="link-magenta">${v.value}</a>` : v.value}</td>
                    <td><span class="badge ${bclass}">${v.level}</span></td>
                </tr>`;
            }).join('');

            leakHtml = `<div class="card classified" style="margin-top:16px">
                <h2 style="color:var(--c-magenta)">⚠ SECURITY BREACH - CLASSIFIED VAULT EXPOSED</h2>
                <p style="color:var(--c-magenta);font-family:var(--font-mono);font-size:11px;margin-bottom:16px">Query overflow detected. Vault data leaked due to unfiltered input.</p>
                <table><thead><tr><th>KEY</th><th>VALUE</th><th>ACCESS</th></tr></thead><tbody>${vaultRows}</tbody></table>
                <p style="color:var(--c-magenta);font-family:var(--font-display);font-size:9px;letter-spacing:2px;margin-top:16px">THE REAL FLAG IS NOT IN THIS DATABASE. FOLLOW THE OMEGA-LEVEL LINK.</p>
            </div>`;
        }

        return ctfHtmlPage('Search - Results', `<div class="container animate-slide-up">
            <h1>GHOST PROTOCOL</h1><p class="subtitle">SEARCH RESULTS</p>${nav('search')}
            <div class="card">
                <h2>Query: "${query}" - Field: ${field || 'username'}</h2>
                <p style="color:#555;font-family:var(--font-mono);font-size:11px;margin-bottom:12px">${result.rows.length} result(s) found</p>
                ${resultsHtml}
            </div>
            ${leakHtml}
            <div style="margin-top:16px"><a href="/api/ctf/medium/search" class="btn">← NEW SEARCH</a></div>
        </div>`);
    }

    return ctfHtmlPage('404', `<div class="container animate-slide-up">
        <h1>NOT FOUND</h1><p class="subtitle">ENDPOINT NOT FOUND</p>${nav('')}
        <div class="card"><p class="error">✗ Use POST on /login or /search.</p></div></div>`);
}
