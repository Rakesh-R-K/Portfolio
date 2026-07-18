// ============================================================
// GET  /api/portfolio/backups?section=xxx - List backups
// POST /api/portfolio/backups - Restore from backup
// ============================================================

import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { validateAdminToken } = require('@/lib/auth');
        const auth = validateAdminToken(request);
        if (!auth.valid) {
            return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');

        if (!section) {
            return NextResponse.json({ success: false, error: 'section parameter required' }, { status: 400 });
        }

        const { listBackups } = require('@/lib/content-store');
        const backups = listBackups(section);

        return NextResponse.json({ success: true, section, backups });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { validateAdminToken } = require('@/lib/auth');
        const auth = validateAdminToken(request);
        if (!auth.valid) {
            return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
        }

        const { section, filename } = await request.json();
        if (!section || !filename) {
            return NextResponse.json({ success: false, error: 'section and filename required' }, { status: 400 });
        }

        const { restoreBackup } = require('@/lib/content-store');
        const { syncProfileJS } = require('@/lib/sync-profile');

        const data = restoreBackup(section, filename);

        // Sync profile.js if relevant section
        const syncSections = ['profile', 'projects', 'skills', 'certifications', 'misc'];
        let syncResult = null;
        if (syncSections.includes(section)) {
            syncResult = syncProfileJS();
        }

        return NextResponse.json({
            success: true,
            section,
            restoredFrom: filename,
            sync: syncResult,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
