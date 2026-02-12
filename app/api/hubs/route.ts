// app/api/hubs/route.ts — List all hubs + create new hub

import { NextRequest, NextResponse } from "next/server";
import { getAllHubs, createHub } from "@/lib/hub-store";
import { DEFAULT_HUB } from "@/lib/types";

export async function GET() {
    const hubs = await getAllHubs();
    return NextResponse.json(hubs);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const slug = (body.slug || body.eventName || "new-hub")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const hub = {
            ...DEFAULT_HUB,
            ...body,
            slug,
            updatedAt: new Date().toISOString(),
        };

        const created = await createHub(hub);
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}