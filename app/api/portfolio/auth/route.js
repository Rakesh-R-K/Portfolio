// ============================================================
// POST /api/portfolio/auth - Admin login
// GET  /api/portfolio/auth - Verify token validity
// ============================================================

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        const { authenticateAdmin } = require('@/lib/auth');
        const result = authenticateAdmin(password);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            token: result.token,
            expiresIn: result.expiresIn,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { validateAdminToken } = require('@/lib/auth');
        const auth = validateAdminToken(request);

        if (!auth.valid) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            role: auth.payload.role,
            expiresAt: new Date(auth.payload.exp).toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
