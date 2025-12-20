import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
        },
    });

    if (!event) {
        return NextResponse.json(
            { error: 'Event not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(event);
}