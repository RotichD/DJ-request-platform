import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
    });

    if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const event = await prisma.event.create({
            data: {
                name,
                code: normalizedCode,
                userId: dbUser.id,
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