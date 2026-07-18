// ============================================================
// CTF UTILITIES - Rate limiter, whitespace stego, JWT helpers
// ============================================================

// In-memory rate limiter
const rateLimitMap = new Map();

export function rateLimit(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const record = rateLimitMap.get(key) || { attempts: 0, resetAt: now + windowMs };

    // Reset window if expired
    if (now > record.resetAt) {
        record.attempts = 0;
        record.resetAt = now + windowMs;
    }

    record.attempts++;
    rateLimitMap.set(key, record);

    if (record.attempts > maxAttempts) {
        const retryAfter = Math.ceil((record.resetAt - now) / 1000);
        return {
            limited: true,
            retryAfter,
            message: `Rate limited. Too many attempts. Try again in ${retryAfter}s.`,
        };
    }

    return { limited: false, remaining: maxAttempts - record.attempts };
}

// Request logger - tracks player attempts per challenge
const requestLogs = new Map();

export function logRequest(challengeId, method, path, body = null) {
    const key = challengeId;
    const logs = requestLogs.get(key) || [];
    logs.push({
        timestamp: new Date().toISOString(),
        method,
        path,
        body: body ? JSON.stringify(body).substring(0, 200) : null,
    });
    // Keep last 50 entries per challenge
    if (logs.length > 50) logs.shift();
    requestLogs.set(key, logs);
}

export function getRequestLogs(challengeId) {
    return requestLogs.get(challengeId) || [];
}

// Whitespace steganography encoder/decoder
// Encodes text into zero-width characters hidden in a carrier string
const ZERO_WIDTH = {
    ZERO: '\u200B',    // Zero-width space (0)
    ONE: '\u200C',     // Zero-width non-joiner (1)
    SEP: '\u200D',     // Zero-width joiner (separator)
    MARK: '\uFEFF',    // BOM marker (start/end)
};

export function encodeWhitespace(text) {
    const binary = Array.from(text)
        .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');

    const encoded = ZERO_WIDTH.MARK +
        binary.split('').map(b => b === '0' ? ZERO_WIDTH.ZERO : ZERO_WIDTH.ONE).join('') +
        ZERO_WIDTH.MARK;

    return encoded;
}

export function decodeWhitespace(encoded) {
    // Strip the markers
    const stripped = encoded.replace(new RegExp(`[${ZERO_WIDTH.MARK}${ZERO_WIDTH.SEP}]`, 'g'), '');

    // Convert zero-width chars back to binary
    const binary = stripped.split('').map(c => {
        if (c === ZERO_WIDTH.ZERO) return '0';
        if (c === ZERO_WIDTH.ONE) return '1';
        return '';
    }).join('');

    // Convert binary to text
    const text = binary.match(/.{8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2))).join('') || '';

    return text;
}

// Simple JWT-like token generator (for the hard challenge)
export function generateCTFToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    // Intentionally weak signature for CTF purposes
    const signature = Buffer.from('ctf_challenge_signature_not_real').toString('base64url');
    return `${header}.${body}.${signature}`;
}

export function decodeCTFToken(token) {
    try {
        const [header, body] = token.split('.');
        return {
            header: JSON.parse(Buffer.from(header, 'base64url').toString()),
            payload: JSON.parse(Buffer.from(body, 'base64url').toString()),
        };
    } catch {
        return null;
    }
}
