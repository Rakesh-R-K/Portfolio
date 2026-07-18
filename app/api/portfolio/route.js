// ============================================================
// GET /api/portfolio - Fetch all content sections
// PUT /api/portfolio - Bulk update all sections (admin)
// ============================================================

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { readAllSections, getContentMeta } = require('@/lib/content-store');
        const sections = readAllSections();
        const meta = getContentMeta();

        return NextResponse.json({
            success: true,
            data: sections,
            meta,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { validateAdminToken } = require('@/lib/auth');
        const auth = validateAdminToken(request);
        if (!auth.valid) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: 401 }
            );
        }

        const { writeSection, VALID_SECTIONS } = require('@/lib/content-store');
        const { syncProfileJS } = require('@/lib/sync-profile');
        const body = await request.json();

        const results = {};
        for (const section of VALID_SECTIONS) {
            if (body[section] !== undefined) {
                try {
                    writeSection(section, body[section]);
                    results[section] = { success: true };
                } catch (err) {
                    results[section] = { success: false, error: err.message };
                }
            }
        }

        // Sync profile.js after bulk update
        const syncResult = syncProfileJS();

        return NextResponse.json({
            success: true,
            results,
            sync: syncResult,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
