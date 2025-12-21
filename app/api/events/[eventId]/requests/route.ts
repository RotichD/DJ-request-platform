import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ eventId: string}> }
) {
    const { eventId } = await params;

    const requests = await prisma.request.findMany({
        where: { eventId },
        orderBy: [
            { status: 'asc'},
            { createdAt: 'asc'},
        ],
    });

    return NextResponse.json(requests);
}