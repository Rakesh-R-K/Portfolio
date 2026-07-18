// ============================================================
// CONTENT STORE - Read/write JSON content files for VPS backend
// ============================================================

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'data', 'content');

const VALID_SECTIONS = [
    'profile',
    'projects',
    'skills',
    'timeline',
    'experience',
    'testimonials',
    'certifications',
    'misc',
    'ctf-participations',
];

/**
 * Read a single content section from JSON file
 */
function readSection(section) {
    if (!VALID_SECTIONS.includes(section)) {
        throw new Error(`Invalid section: ${section}`);
    }

    const filePath = path.join(CONTENT_DIR, `${section}.json`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Content file not found: ${section}.json`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}

/**
 * Write updated data to a content section JSON file
 */
function writeSection(section, data) {
    if (!VALID_SECTIONS.includes(section)) {
        throw new Error(`Invalid section: ${section}`);
    }

    const filePath = path.join(CONTENT_DIR, `${section}.json`);

    // Create backup before writing
    if (fs.existsSync(filePath)) {
        const backupDir = path.join(CONTENT_DIR, '.backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `${section}_${timestamp}.json`);
        fs.copyFileSync(filePath, backupPath);

        // Keep only last 10 backups per section
        cleanOldBackups(backupDir, section, 10);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
}

/**
 * Read all content sections at once
 */
function readAllSections() {
    const all = {};
    for (const section of VALID_SECTIONS) {
        try {
            all[section] = readSection(section);
        } catch (err) {
            console.error(`Error reading section ${section}:`, err.message);
            all[section] = null;
        }
    }
    return all;
}

/**
 * Clean old backup files, keeping only the most recent `keep` files per section
 */
function cleanOldBackups(backupDir, section, keep = 10) {
    try {
        const files = fs.readdirSync(backupDir)
            .filter(f => f.startsWith(`${section}_`) && f.endsWith('.json'))
            .sort()
            .reverse();

        if (files.length > keep) {
            files.slice(keep).forEach(f => {
                fs.unlinkSync(path.join(backupDir, f));
            });
        }
    } catch {
        // Ignore cleanup errors
    }
}

/**
 * Get list of available backup files for a section
 */
function listBackups(section) {
    if (!VALID_SECTIONS.includes(section)) {
        throw new Error(`Invalid section: ${section}`);
    }

    const backupDir = path.join(CONTENT_DIR, '.backups');
    if (!fs.existsSync(backupDir)) return [];

    return fs.readdirSync(backupDir)
        .filter(f => f.startsWith(`${section}_`) && f.endsWith('.json'))
        .sort()
        .reverse()
        .map(f => ({
            filename: f,
            timestamp: f.replace(`${section}_`, '').replace('.json', '').replace(/-/g, ':').slice(0, 19),
        }));
}

/**
 * Restore a section from a specific backup
 */
function restoreBackup(section, backupFilename) {
    const backupDir = path.join(CONTENT_DIR, '.backups');
    const backupPath = path.join(backupDir, backupFilename);

    if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupFilename}`);
    }

    const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    writeSection(section, data);
    return data;
}

/**
 * Get metadata about all content files
 */
function getContentMeta() {
    return VALID_SECTIONS.map(section => {
        const filePath = path.join(CONTENT_DIR, `${section}.json`);
        const exists = fs.existsSync(filePath);
        let stats = null;
        let itemCount = null;

        if (exists) {
            stats = fs.statSync(filePath);
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (Array.isArray(data)) {
                    itemCount = data.length;
                } else if (typeof data === 'object') {
                    itemCount = Object.keys(data).length;
                }
            } catch {}
        }

        return {
            section,
            exists,
            size: stats ? stats.size : 0,
            modified: stats ? stats.mtime.toISOString() : null,
            itemCount,
            backups: exists ? listBackups(section).length : 0,
        };
    });
}

module.exports = {
    readSection,
    writeSection,
    readAllSections,
    listBackups,
    restoreBackup,
    getContentMeta,
    VALID_SECTIONS,
};
