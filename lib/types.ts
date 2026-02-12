// lib/types.ts — Shared types for Dizplai Interaction Hub

export interface ActionCard {
    id: string;
    icon: string;
    title: string;
    description: string;
    link: string;
    linkType: "external" | "whatsapp" | "modal";
    accentColor: string;
    badge?: string;
    sortOrder: number;
}

export interface HubConfig {
    // Identity
    slug: string;
    eventName: string;

    // Branding
    logoUrl: string;
    sponsorBannerUrl: string;
    sponsorLink: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    heroTagline: string;
    heroSubtext: string;

    // Cards
    actionCards: ActionCard[];

    // Layout — order of sections on the fan hub
    sectionOrder: string[];

    // Meta
    isPublished: boolean;
    updatedAt: string;
}

// Default config for new hubs
export const DEFAULT_HUB: HubConfig = {
    slug: "",
    eventName: "New Event",
    logoUrl: "",
    sponsorBannerUrl: "",
    sponsorLink: "",
    primaryColor: "#7C3AED",
    secondaryColor: "#F59E0B",
    backgroundColor: "#0A0A0F",
    heroTagline: "Your Game. Your Voice.",
    heroSubtext: "Join the conversation and get involved.",
    actionCards: [],
    sectionOrder: ["sponsor", "hero", "cards"],
    isPublished: false,
    updatedAt: new Date().toISOString(),
};

export const DEFAULT_CARD: Omit<ActionCard, "id" | "sortOrder"> = {
    icon: "MessageCircle",
    title: "New Card",
    description: "Tap to interact",
    link: "https://example.com",
    linkType: "external",
    accentColor: "#7C3AED",
};

// Available icons operators can pick from
export const AVAILABLE_ICONS = [
    { value: "MessageCircle", label: "Chat Bubble" },
    { value: "BarChart3", label: "Poll / Chart" },
    { value: "Camera", label: "Camera" },
    { value: "Trophy", label: "Trophy" },
    { value: "Zap", label: "Lightning" },
    { value: "Radio", label: "Live / Radio" },
    { value: "Gift", label: "Prize / Gift" },
    { value: "Heart", label: "Heart" },
    { value: "Star", label: "Star" },
    { value: "ShoppingBag", label: "Shop" },
    { value: "Ticket", label: "Ticket" },
    { value: "Users", label: "Community" },
    { value: "Play", label: "Play / Video" },
    { value: "Music", label: "Music" },
    { value: "Globe", label: "Website" },
] as const;

export const LINK_TYPES = [
    { value: "external", label: "External Link" },
    { value: "whatsapp", label: "WhatsApp Deep Link" },
    { value: "modal", label: "In-App Modal" },
] as const;