// lib/hub-store.ts — Hub data layer backed by Supabase
import { supabase } from "./supabase";
import type { HubConfig, ContentBlock } from "./types";

// ─── HELPERS ──────────────────────────────────────────────────────────
function dbToHub(row: any, blocks: any[] = []): HubConfig {
    return {
        slug: row.slug,
        eventName: row.event_name,
        logoUrl: row.logo_url || "",
        heroImageUrl: row.homepage_image_url || "",
        blockColor: row.primary_color || "#FF10A8",
        backgroundColor: row.background_color || "#0A0A0F",
        headerFont: row.header_font || row.font_family || "Outfit",
        bodyFont: row.body_font || row.font_family || "Outfit",
        customFontUrl: row.custom_font_url || "",
        heroTagline: row.hero_tagline || "",
        heroSubtext: row.hero_subtext || "",
        socialLinks: row.social_links || [],
        blocks: blocks
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((b) => ({
                id: b.id,
                title: b.title,
                description: b.description || "",
                imageUrl: b.image_url || "",
                url: b.url || "",
                aspectRatio: b.aspect_ratio || "1:1",
                accentColor: b.accent_color || "#FF10A8",
                badge: b.badge || undefined,
                isVisible: b.is_visible ?? true,
                sortOrder: b.sort_order,
            })),
        isPublished: row.is_published,
        updatedAt: row.updated_at,
    };
}

// ─── GET ALL HUBS ─────────────────────────────────────────────────────
export async function getAllHubs(): Promise<HubConfig[]> {
    const { data: hubs, error } = await supabase
        .from("hubs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!hubs || hubs.length === 0) return [];

    const hubIds = hubs.map((h) => h.id);
    const { data: allBlocks } = await supabase
        .from("blocks")
        .select("*")
        .in("hub_id", hubIds)
        .order("sort_order");

    return hubs.map((hub) => {
        const blocks = (allBlocks || []).filter((b) => b.hub_id === hub.id);
        return dbToHub(hub, blocks);
    });
}

// ─── GET HUB BY SLUG ──────────────────────────────────────────────────
export async function getHubBySlug(slug: string): Promise<HubConfig | null> {
    const { data: hub, error } = await supabase
        .from("hubs")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !hub) return null;

    const { data: blocks } = await supabase
        .from("blocks")
        .select("*")
        .eq("hub_id", hub.id)
        .order("sort_order");

    return dbToHub(hub, blocks || []);
}

// ─── CREATE HUB ───────────────────────────────────────────────────────
export async function createHub(hubData: HubConfig): Promise<HubConfig> {
    const { data: org } = await supabase
        .from("organisations")
        .select("id")
        .eq("slug", "dizplai")
        .single();

    const { data: hub, error } = await supabase
        .from("hubs")
        .insert({
            org_id: org?.id || null,
            slug: hubData.slug,
            event_name: hubData.eventName,
            logo_url: hubData.logoUrl || "",
            homepage_image_url: hubData.heroImageUrl || "",
            primary_color: hubData.blockColor || "#FF10A8",
            background_color: hubData.backgroundColor || "#0A0A0F",
            header_font: hubData.headerFont || "Outfit",
            body_font: hubData.bodyFont || "Outfit",
            custom_font_url: hubData.customFontUrl || "",
            hero_tagline: hubData.heroTagline || "",
            hero_subtext: hubData.heroSubtext || "",
            social_links: hubData.socialLinks || [],
            is_published: hubData.isPublished || false,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return dbToHub(hub, []);
}

// ─── UPDATE HUB ───────────────────────────────────────────────────────
export async function updateHub(
    slug: string,
    updates: Partial<HubConfig>
): Promise<HubConfig | null> {
    const { data: existing } = await supabase
        .from("hubs")
        .select("id")
        .eq("slug", slug)
        .single();

    if (!existing) return null;

    const { data: hub, error } = await supabase
        .from("hubs")
        .update({
            event_name: updates.eventName,
            slug: updates.slug || slug,
            logo_url: updates.logoUrl,
            homepage_image_url: updates.heroImageUrl,
            primary_color: updates.blockColor,
            background_color: updates.backgroundColor,
            header_font: updates.headerFont,
            body_font: updates.bodyFont,
            custom_font_url: updates.customFontUrl,
            hero_tagline: updates.heroTagline,
            hero_subtext: updates.heroSubtext,
            social_links: updates.socialLinks,
            is_published: updates.isPublished,
            updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    // Sync blocks
    if (updates.blocks !== undefined) {
        await supabase.from("blocks").delete().eq("hub_id", existing.id);

        if (updates.blocks && updates.blocks.length > 0) {
            const blockRows = updates.blocks.map((b, i) => ({
                hub_id: existing.id,
                title: b.title,
                description: b.description || "",
                image_url: b.imageUrl || "",
                url: b.url || "",
                aspect_ratio: b.aspectRatio || "1:1",
                accent_color: b.accentColor || "#FF10A8",
                badge: b.badge || "",
                is_visible: (b as any).isVisible ?? true,
                sort_order: b.sortOrder ?? i,
            }));

            const { error: blockError } = await supabase
                .from("blocks")
                .insert(blockRows);

            if (blockError) throw new Error(blockError.message);
        }
    }

    const { data: blocks } = await supabase
        .from("blocks")
        .select("*")
        .eq("hub_id", existing.id)
        .order("sort_order");

    return dbToHub(hub, blocks || []);
}

// ─── DELETE HUB ───────────────────────────────────────────────────────
export async function deleteHub(slug: string): Promise<boolean> {
    const { error } = await supabase.from("hubs").delete().eq("slug", slug);
    return !error;
}