// ============================================================
// SYNC PROFILE - Regenerate data/profile.js from JSON content
// Called after admin saves to keep existing imports working
// ============================================================

const fs = require('fs');
const path = require('path');
const { readSection } = require('./content-store');

/**
 * Regenerate data/profile.js from the JSON content files.
 * This ensures all existing `import { profile } from '@/data/profile'`
 * statements continue to work after admin edits.
 */
function syncProfileJS() {
    try {
        const profileData = readSection('profile');
        const projectsData = readSection('projects');
        const skillsData = readSection('skills');
        const miscData = readSection('misc');

        const output = `// ============================================================
// PROFILE DATA - Auto-generated from admin panel
// DO NOT EDIT DIRECTLY - Use /admin to make changes
// Last synced: ${new Date().toISOString()}
// ============================================================

export const profile = ${JSON.stringify(profileData, null, 4)};

// ============================================================
// PROJECTS - Real repos from github.com/Rakesh-R-K
// ============================================================

export const projects = ${JSON.stringify(projectsData.projects, null, 4)};

// ============================================================
// ADDITIONAL PROJECTS (smaller / academic)
// ============================================================

export const additionalProjects = ${JSON.stringify(projectsData.additionalProjects, null, 4)};

// ============================================================
// CERTIFICATIONS & ACHIEVEMENTS
// ============================================================

export const certifications = ${JSON.stringify(
            readSection('certifications').map(c => ({
                name: c.title,
                issuer: c.statLabel,
                detail: c.detail,
            })),
            null, 4
        )};

// ============================================================
// SKILLS
// ============================================================

export const skills = ${JSON.stringify(skillsData, null, 4)};

// ============================================================
// TYPING TEST
// ============================================================

export const typingTestSentences = ${JSON.stringify(miscData.typingTestSentences, null, 4)};
`;

        const profilePath = path.join(process.cwd(), 'data', 'profile.js');
        fs.writeFileSync(profilePath, output, 'utf-8');

        return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
        console.error('Sync profile.js error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { syncProfileJS };
