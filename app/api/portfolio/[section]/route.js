// ============================================================
// GET /api/portfolio/[section] - Fetch a single content section
// PUT /api/portfolio/[section] - Update a single section (admin)
// ============================================================

import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { section } = await params;
        const { readSection, VALID_SECTIONS } = require('@/lib/content-store');

        if (!VALID_SECTIONS.includes(section)) {
            return NextResponse.json(
                { success: false, error: `Invalid section: ${section}. Valid: ${VALID_SECTIONS.join(', ')}` },
                { status: 400 }
            );
        }

        const data = readSection(section);

        return NextResponse.json({
            success: true,
            section,
            data,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { section } = await params;
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

        if (!VALID_SECTIONS.includes(section)) {
            return NextResponse.json(
                { success: false, error: `Invalid section: ${section}` },
                { status: 400 }
            );
        }

        const data = await request.json();
        writeSection(section, data);

        // Sync profile.js when profile, projects, skills, certifications, or misc is updated
        const syncSections = ['profile', 'projects', 'skills', 'certifications', 'misc'];
        let syncResult = null;
        if (syncSections.includes(section)) {
            syncResult = syncProfileJS();
        }

        return NextResponse.json({
            success: true,
            section,
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
