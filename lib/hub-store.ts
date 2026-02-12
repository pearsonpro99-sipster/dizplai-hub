// lib/hub-store.ts — JSON file-based hub storage (swap for Supabase later)

import { promises as fs } from "fs";
import path from "path";
import type { HubConfig } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const HUBS_FILE = path.join(DATA_DIR, "hubs.json");

// Ensure data directory and file exist
async function ensureStore(): Promise<HubConfig[]> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const raw = await fs.readFile(HUBS_FILE, "utf-8");
        return JSON.parse(raw) as HubConfig[];
    } catch {
        // File doesn't exist yet — create with empty array
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(HUBS_FILE, "[]", "utf-8");
        return [];
    }
}

async function saveAll(hubs: HubConfig[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(HUBS_FILE, JSON.stringify(hubs, null, 2), "utf-8");
}

// ─── PUBLIC API ──────────────────────────────────────────────────────

export async function getAllHubs(): Promise<HubConfig[]> {
    return ensureStore();
}

export async function getHubBySlug(slug: string): Promise<HubConfig | null> {
    const hubs = await ensureStore();
    return hubs.find((h) => h.slug === slug) || null;
}

export async function createHub(hub: HubConfig): Promise<HubConfig> {
    const hubs = await ensureStore();

    // Ensure unique slug
    if (hubs.some((h) => h.slug === hub.slug)) {
        throw new Error(`Hub with slug "${hub.slug}" already exists`);
    }

    hub.updatedAt = new Date().toISOString();
    hubs.push(hub);
    await saveAll(hubs);
    return hub;
}

export async function updateHub(
    slug: string,
    updates: Partial<HubConfig>
): Promise<HubConfig | null> {
    const hubs = await ensureStore();
    const index = hubs.findIndex((h) => h.slug === slug);
    if (index === -1) return null;

    // If slug is changing, check uniqueness
    if (updates.slug && updates.slug !== slug) {
        if (hubs.some((h) => h.slug === updates.slug)) {
            throw new Error(`Hub with slug "${updates.slug}" already exists`);
        }
    }

    hubs[index] = {
        ...hubs[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    await saveAll(hubs);
    return hubs[index];
}

export async function deleteHub(slug: string): Promise<boolean> {
    const hubs = await ensureStore();
    const filtered = hubs.filter((h) => h.slug !== slug);
    if (filtered.length === hubs.length) return false;
    await saveAll(filtered);
    return true;
}