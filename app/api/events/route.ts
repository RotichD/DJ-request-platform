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

    if (!name || !code) {
        return NextResponse.json(
            { error: 'Missing name or code' },
            { status: 400 }
        )
    }

    try {
        const event = await prisma.event.create({
            data: {
                name,
                code,
                userId: DJ_USER_ID,
            },
        });

        return NextResponse.json(event, { status: 201 });

    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}