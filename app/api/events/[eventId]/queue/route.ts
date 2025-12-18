import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: Request,
    { params }: { params: { eventId: string } }) {
    const { eventId } =  await params;

    if (!eventId) {
        return NextResponse.json(
            { error: 'Missing eventId' },
            { status: 400 }
        );
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, isActive: true },
    });

    if (!event || !event.isActive) {
        return NextResponse.json(
            { error: 'Event not found or inactive' },
            { status: 404 }
        );
    }

    const queue = await prisma.request.findMany({
        where: {
            eventId,
            status: 'PENDING',
        }, orderBy: {
            createdAt: 'asc'
        }
    });

    return NextResponse.json(queue)
}