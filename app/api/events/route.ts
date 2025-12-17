import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DJ_USER_ID = 'dj1';

export async function GET() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(events);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { name, code } = body;
    const normalizedCode = 
        typeof code === 'string' ? code.trim().toUpperCase() : '';

    if (!name || !normalizedCode) {
        return NextResponse.json(
            { error: 'Missing or invalid name or code' },
            { status: 400 }
        )
    }

    try {
        const event = await prisma.event.create({
            data: {
                name,
                code: normalizedCode,
                userId: DJ_USER_ID,
            },
        });

        return NextResponse.json(event, { status: 201 });

    } catch (err: any) {
        if (err.code === 'P2002') {
            return NextResponse.json(
                { error: 'Event code already exists', },
                { status: 409 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}