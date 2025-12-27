import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';;
import { prisma } from '@/lib/prisma';

export async function POST() {

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

    if (!user || !user.email) {
        return NextResponse.json({ error: 'Not Authenticated' }, { status: 401 })
    }

    const dbUser = await prisma.user.upsert({
        where: { supabaseId: user.id },
        update: {
            email: user.email,
        },
        create: {
            supabaseId: user.id,
            email: user.email,
        },
    });

    return NextResponse.json(dbUser);
}