// ============================================================
// CTF SECRETS - SERVER-ONLY (never import in 'use client' files)
// Pre-computed SHA-256 hashes - no raw flags in source
// ============================================================

// Pre-computed hashes - flags are NOT stored in plaintext
const FLAG_HASHES = {
    easy: '3d752eaf2e2c3ffbb5bc9454ab110fae42aaa6502925f929a686954bd21bb7b5',
    medium: 'b9b51fd88d07cd7277fc975b2b28403f1be42c1f58eed98be9e63b41c747ba40',
};

// 1 hint per challenge, served only via API
const HINTS = {
    easy: ['Not all user IDs are listed. Check the audit logs for clues.'],
    medium: ['Bruteforcing is not always wrong (rockyou.txt)'],
};

const POINTS = { easy: 200, medium: 400 };

export function getSecrets(challengeId) {
    if (!FLAG_HASHES[challengeId]) return null;
    return {
        flagHash: FLAG_HASHES[challengeId],
        hints: HINTS[challengeId] || [],
    };
}

export function validateFlag(challengeId, submittedFlag) {
    const hash = FLAG_HASHES[challengeId];
    if (!hash) return { valid: false, error: 'Challenge not found' };

    // Hash the submitted flag and compare
    const { createHash } = require('crypto');
    const submittedHash = createHash('sha256').update(submittedFlag.trim()).digest('hex');
    const valid = submittedHash === hash;

    return {
        valid,
        points: valid ? (POINTS[challengeId] || 0) : 0,
        message: valid
            ? '✅ Flag accepted! Well done, operative.'
            : '❌ Invalid flag. Keep digging.',
    };
}
