// app/api/upload/route.ts — Image upload via Supabase Storage
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "hub-assets";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type: ${file.type}. Allowed: PNG, JPG, SVG, WebP, GIF` },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File too large. Max 5MB." },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "png";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const path = `uploads/${filename}`;

        // Convert to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(data.path);

        return NextResponse.json({
            url: urlData.publicUrl,
            path: data.path,
        });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}