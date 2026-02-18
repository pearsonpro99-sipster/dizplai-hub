// lib/types.ts — Simplified Dizplai Interaction Hub types

export interface ContentBlock {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    url: string;
    aspectRatio: "1:1" | "16:9" | "9:16";
    accentColor: string;
    badge?: string;
    sortOrder: number;
}

export interface HubConfig {
    slug: string;
    eventName: string;
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
    heroTagline: string;
    heroSubtext: string;
    blocks: ContentBlock[];
    isPublished: boolean;
    updatedAt: string;
}

export const DEFAULT_HUB: HubConfig = {
    slug: "",
    eventName: "New Event",
    logoUrl: "",
    primaryColor: "#FF10A8",
    backgroundColor: "#0A0A0F",
    heroTagline: "Your Game. Your Voice.",
    heroSubtext: "Join the conversation and get involved.",
    blocks: [],
    isPublished: false,
    updatedAt: new Date().toISOString(),
};

export const DEFAULT_BLOCK: Omit<ContentBlock, "id" | "sortOrder"> = {
    title: "New Block",
    description: "Tap to interact",
    imageUrl: "",
    url: "https://example.com",
    aspectRatio: "1:1",
    accentColor: "#FF10A8",
};

export const ASPECT_RATIOS = [
    { value: "1:1", label: "Square (Side-by-side)" },
    { value: "16:9", label: "Wide (Stacked)" },
    { value: "9:16", label: "Tall (Stacked)" },
] as const;

// Normalize any legacy hub data into current shape
export function normalizeHub(hub: any): HubConfig {
    const blocks = (hub.blocks || hub.actionCards || []).map((b: any, i: number) => ({
        id: b.id || `block_${i}`,
        title: b.title || "Untitled",
        description: b.description || "",
        imageUrl: b.imageUrl || "",
        url: b.url || b.link || "",
        aspectRatio: b.aspectRatio || "1:1",
        accentColor: b.accentColor || "#FF10A8",
        badge: b.badge,
        sortOrder: b.sortOrder ?? i,
    }));

    return {
        slug: hub.slug || "",
        eventName: hub.eventName || "Untitled Hub",
        logoUrl: hub.logoUrl || "",
        primaryColor: hub.primaryColor || "#FF10A8",
        backgroundColor: hub.backgroundColor || "#0A0A0F",
        heroTagline: hub.heroTagline || "",
        heroSubtext: hub.heroSubtext || "",
        blocks,
        isPublished: hub.isPublished ?? false,
        updatedAt: hub.updatedAt || new Date().toISOString(),
    };
}