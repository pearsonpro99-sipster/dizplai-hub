// app/api/upload/route.ts — Image upload handler (local storage for POC)
// Swap to Vercel Blob or Supabase Storage for production

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: PNG, JPG, SVG, WebP, GIF" },
                { status: 400 }
            );
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Max 5MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "png";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        // Ensure upload directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url, filename });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}