// app/api/hubs/[slug]/route.ts — Get, update, delete a single hub

import { NextRequest, NextResponse } from "next/server";
import { getHubBySlug, updateHub, deleteHub } from "@/lib/hub-store";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const hub = await getHubBySlug(slug);
    if (!hub) {
        return NextResponse.json({ error: "Hub not found" }, { status: 404 });
    }
    return NextResponse.json(hub);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await req.json();
        const updated = await updateHub(slug, body);
        if (!updated) {
            return NextResponse.json({ error: "Hub not found" }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const deleted = await deleteHub(slug);
    if (!deleted) {
        return NextResponse.json({ error: "Hub not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
}