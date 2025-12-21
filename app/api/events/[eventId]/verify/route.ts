import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;
    const { code } = await req.json();

    if (!code) {
        return NextResponse.json(
            { error: 'Missing code' },
            { status: 400 }
        );
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { code: true, isActive: true },
    });

    if (!event || !event.isActive) {
        return NextResponse.json(
            { error: 'Event not found or inactive' },
            { status: 404 }
        );
    }

    if (event.code !== code.trim().toUpperCase()) {
        return NextResponse.json(
            { error: 'Invalid code' },
            { status: 403 }
        );
    }

    return NextResponse.json({ ok: true });
}