// ============================================================
// CTF CHALLENGE CONFIG - CLIENT-SAFE metadata only
// NO hints, NO flag hashes - those are server-only
// ============================================================

export const CTF_CONFIG = {
    flagFormat: 'RKS{...}',
    maxHintsPerChallenge: 1,
    hintPenalty: 50,
};

export const challenges = [
    {
        id: 'easy',
        name: 'THE PHANTOM DIRECTORY',
        difficulty: 'EASY',
        category: 'IDOR',
        points: 200,
        description: 'A user directory with some interesting profiles. But are you looking at the right one?',
        briefing: [
            'Intel suggests a hidden user profile contains classified data.',
            'The flag is encrypted. You\'ll need to peel back the layers.',
        ],
        hintCount: 1,
        endpoints: ['/api/ctf/easy'],
        tags: ['Web', 'Crypto'],
    },
    {
        id: 'medium',
        name: 'INJECTION PROTOCOL',
        difficulty: 'MEDIUM',
        category: 'SQLi',
        points: 400,
        description: 'A search interface with a backend database. Something doesn\'t look right about the input handling.',
        briefing: [
            'A vulnerable search endpoint has been identified.',
            'Extract the hidden data to locate the classified file.',
        ],
        hintCount: 1,
        endpoints: ['/api/ctf/medium'],
        tags: ['Web', 'SQLi', 'Forensics'],
    },
];
