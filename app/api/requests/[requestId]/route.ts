import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ requestId: string }> }
) {
    try {
        const { requestId } = await params;
        const body = await req.json();
        const { status } = body;

        if (!requestId) {
            return NextResponse.json(
                { error: 'Missing requestId' },
                { status: 400 }
            );
        }

        if (!status || !['PENDING','PLAYED', 'SKIPPED'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const updatedRequest = await prisma.request.update({
            where: { id: requestId },
            data: {
                status: status as RequestStatus,
            },
        });

        return NextResponse.json(updatedRequest);
    } catch (err: any) {
        if (err.code === 'P2025') {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        console.error('PATCH /api/requests error:', err);
        return NextResponse.json(
            { error: 'Failed to update request' },
            { status: 500 }
        );
    }
}