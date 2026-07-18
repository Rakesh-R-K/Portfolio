import { NextResponse } from 'next/server';
import { validateFlag } from '@/data/ctf-secrets';
import { rateLimit, logRequest } from '@/lib/ctf-utils';

export async function POST(request) {
    try {
        const { challengeId, flag } = await request.json();

        if (!challengeId || !flag) {
            return NextResponse.json(
                { error: 'Missing challengeId or flag' },
                { status: 400 }
            );
        }

        // Rate limit: 5 attempts per minute per challenge
        const ip = request.headers.get('x-forwarded-for') || 'localhost';
        const limitKey = `flag_${ip}_${challengeId}`;
        const limit = rateLimit(limitKey, 5, 60000);

        if (limit.limited) {
            return NextResponse.json({
                error: 'RATE_LIMITED',
                message: limit.message,
                retryAfter: limit.retryAfter,
            }, { status: 429 });
        }

        // Log the attempt (truncate flag for security)
        logRequest(challengeId, 'POST', '/api/ctf/validate', { flag: flag.substring(0, 30) + '...' });

        const result = validateFlag(challengeId, flag);

        return NextResponse.json({
            ...result,
            attemptsRemaining: limit.remaining,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}
