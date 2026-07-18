// ============================================================
// AUTH - JWT-based admin authentication for VPS deployment
// ============================================================

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-admin-secret-change-me-in-production';
const ADMIN_PASSWORD = process.env.PORTFOLIO_ADMIN_PASSWORD || 'admin123';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify admin password and generate a signed token
 */
function authenticateAdmin(password) {
    if (password !== ADMIN_PASSWORD) {
        return { success: false, error: 'Invalid password' };
    }

    const payload = {
        role: 'admin',
        iat: Date.now(),
        exp: Date.now() + TOKEN_EXPIRY,
    };

    const token = signToken(payload);
    return { success: true, token, expiresIn: TOKEN_EXPIRY };
}

/**
 * Validate an admin token from request headers
 */
function validateAdminToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, error: 'Missing authorization header' };
    }

    const token = authHeader.slice(7);
    try {
        const payload = verifyToken(token);
        if (payload.exp < Date.now()) {
            return { valid: false, error: 'Token expired' };
        }
        if (payload.role !== 'admin') {
            return { valid: false, error: 'Insufficient permissions' };
        }
        return { valid: true, payload };
    } catch (err) {
        return { valid: false, error: 'Invalid token' };
    }
}

/**
 * Simple HMAC-based token signing (no dependency needed)
 */
function signToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');
    return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode a signed token
 */
function verifyToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');

    const [header, body, signature] = parts;
    const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');

    if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
    }

    return JSON.parse(Buffer.from(body, 'base64url').toString());
}

module.exports = { authenticateAdmin, validateAdminToken };
