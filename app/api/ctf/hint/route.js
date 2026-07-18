import { NextResponse } from 'next/server';
import { getSecrets } from '@/data/ctf-secrets';

export async function POST(request) {
    try {
        const { challengeId, hintIndex } = await request.json();

        if (!challengeId || hintIndex === undefined) {
            return NextResponse.json(
                { error: 'Missing challengeId or hintIndex' },
                { status: 400 }
            );
        }

        const secret = getSecrets(challengeId);
        if (!secret) {
            return NextResponse.json(
                { error: 'Challenge not found' },
                { status: 404 }
            );
        }

        if (hintIndex < 0 || hintIndex >= secret.hints.length) {
            return NextResponse.json(
                { error: 'No more hints available' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            hint: secret.hints[hintIndex],
            penalty: 50,
            hintNumber: hintIndex + 1,
            totalHints: secret.hints.length,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}
