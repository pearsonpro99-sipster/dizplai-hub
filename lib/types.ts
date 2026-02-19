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

export interface SocialLink {
    platform: string;
    url: string;
}

export interface HubConfig {
    slug: string;
    eventName: string;
    logoUrl: string;
    heroImageUrl: string;
    blockColor: string;
    backgroundColor: string;
    headerFont: string;
    bodyFont: string;
    customFontUrl: string;
    heroTagline: string;
    heroSubtext: string;
    socialLinks: SocialLink[];
    blocks: ContentBlock[];
    isPublished: boolean;
    updatedAt: string;
    // Legacy compat
    primaryColor?: string;
    fontFamily?: string;
}

export const DEFAULT_HUB: HubConfig = {
    slug: "",
    eventName: "New Event",
    logoUrl: "",
    heroImageUrl: "",
    blockColor: "#FF10A8",
    backgroundColor: "#0A0A0F",
    headerFont: "Outfit",
    bodyFont: "Outfit",
    customFontUrl: "",
    heroTagline: "Your Game. Your Voice.",
    heroSubtext: "Join the conversation and get involved.",
    socialLinks: [],
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

export const GOOGLE_FONTS = [
    "Outfit",
    "Inter",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Lato",
    "Poppins",
    "Raleway",
    "Oswald",
    "Nunito",
    "Playfair Display",
    "Bebas Neue",
    "Anton",
    "Barlow Condensed",
    "DM Sans",
    "Space Grotesk",
    "Sora",
    "Archivo",
    "Plus Jakarta Sans",
    "Clash Display",
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
        heroImageUrl: hub.heroImageUrl || "",
        blockColor: hub.blockColor || hub.primaryColor || "#FF10A8",
        backgroundColor: hub.backgroundColor || "#0A0A0F",
        headerFont: hub.headerFont || hub.fontFamily || "Outfit",
        bodyFont: hub.bodyFont || hub.fontFamily || "Outfit",
        customFontUrl: hub.customFontUrl || "",
        heroTagline: hub.heroTagline || "",
        heroSubtext: hub.heroSubtext || "",
        socialLinks: hub.socialLinks || [],
        blocks,
        isPublished: hub.isPublished ?? false,
        updatedAt: hub.updatedAt || new Date().toISOString(),
    };
}