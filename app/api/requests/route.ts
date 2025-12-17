import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, code, title, artist, spotifyId } = body;

        const normalizedCode =
            typeof code === 'string' ? code.trim().toUpperCase() : '';

        if (!eventId || !normalizedCode || !title || !artist) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event || !event.isActive) {
            return NextResponse.json(
                { error: 'Event not found or inactive' },
                { status: 404 }
            );
        }

        const request = await prisma.request.create({
            data: {
                eventId: event.id,
                title,
                artist,
                spotifyId
            },
        });

        return NextResponse.json(request, { status: 201 });
    } catch (err) {
        console.error('POST /api/requests error:', err);
        return NextResponse.json(
            { error: 'Failed to create request' },
            { status: 500 }
        );
    }
}