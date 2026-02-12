// hub-config.ts — White-Label Configuration for Dizplai Interaction Hub
// Swap this config per client to fully rebrand the experience.

export interface ActionCard {
    id: string;
    icon: string; // Lucide icon name
    title: string;
    description: string;
    link: string;
    linkType: "external" | "internal" | "whatsapp" | "modal";
    accentColor?: string; // Optional per-card accent override
    badge?: string; // e.g. "LIVE", "NEW"
    // WhatsApp-specific: if linkType is "whatsapp", these override the link field
    whatsApp?: {
        phoneNumber: string; // E.164 without +, e.g. "441234567890"
        prefilledMessage: string;
    };
}

export interface HubConfig {
    // Branding
    eventName: string;
    logoUrl: string;
    sponsorBannerUrl: string;
    sponsorLink?: string;

    // Theme
    primaryColor: string;
    primaryColorLight: string; // For gradients/hover states
    secondaryColor: string;
    backgroundColor: string;
    surfaceColor: string; // Card/glass surface base
    textColor: string;
    textMuted: string;
    fontFamily: string;
    fontFamilyHeading?: string;
    borderRadius: string;

    // Content
    heroTagline: string;
    heroSubtext?: string;
    actionCards: ActionCard[];

    // Data capture
    dataCapture: {
        enabled: boolean;
        title: string;
        subtitle: string;
        fields: ("name" | "email" | "phone")[];
        consentText: string;
    };

    // Footer
    poweredByText?: string;
}

// ─── VOLLEYVERSE CONFIG ──────────────────────────────────────────────
export const hubConfig: HubConfig = {
    eventName: "Volleyverse 2026",
    logoUrl: "/logos/volleyverse-logo.svg",
    sponsorBannerUrl: "/sponsors/headline-sponsor.png",
    sponsorLink: "https://sponsor.example.com",

    // Dizplai brand purple palette
    primaryColor: "#7C3AED",
    primaryColorLight: "#A78BFA",
    secondaryColor: "#F59E0B",
    backgroundColor: "#0A0A0F",
    surfaceColor: "rgba(255, 255, 255, 0.06)",
    textColor: "#F8FAFC",
    textMuted: "rgba(248, 250, 252, 0.55)",
    fontFamily: "'Outfit', sans-serif",
    fontFamilyHeading: "'Outfit', sans-serif",
    borderRadius: "16px",

    heroTagline: "Your Game. Your Voice.",
    heroSubtext: "Join the conversation, vote in live polls, and share your moments.",

    actionCards: [
        {
            id: "whatsapp",
            icon: "MessageCircle",
            title: "Join the Chat",
            description: "Send a message to the live WhatsApp wall",
            link: "https://wa.me/441234567890?text=Hello%20Volleyverse!",
            linkType: "whatsapp",
            accentColor: "#25D366",
            badge: "LIVE",
            whatsApp: {
                phoneNumber: "441234567890",
                prefilledMessage: "Hello Volleyverse! 🏐",
            },
        },
        {
            id: "polls",
            icon: "BarChart3",
            title: "Live Polls",
            description: "Vote now — results shown live on screen",
            link: "https://polls.dizplai.com/volleyverse",
            linkType: "external",
            accentColor: "#7C3AED",
            badge: "LIVE",
        },
        {
            id: "media",
            icon: "Camera",
            title: "Share a Moment",
            description: "Upload a photo or video to the fan sandbox",
            link: "/upload",
            linkType: "modal",
            accentColor: "#F59E0B",
        },
        {
            id: "trivia",
            icon: "Trophy",
            title: "Fan Trivia",
            description: "Test your knowledge and win prizes",
            link: "https://trivia.dizplai.com/volleyverse",
            linkType: "external",
            accentColor: "#EC4899",
            badge: "NEW",
        },
    ],

    dataCapture: {
        enabled: true,
        title: "One last thing...",
        subtitle: "Tell us who you are to unlock the full experience",
        fields: ["name", "email"],
        consentText:
            "By continuing, you agree to receive updates from Volleyverse and its partners.",
    },

    poweredByText: "Powered by Dizplai",
};

// ─── EXAMPLE: ASTON VILLA OVERRIDE ──────────────────────────────────
// Export alternative configs for quick switching or dynamic loading
export const astonVillaConfig: Partial<HubConfig> = {
    eventName: "Aston Villa Matchday",
    primaryColor: "#670E36",
    primaryColorLight: "#95264F",
    secondaryColor: "#95BFE5",
    backgroundColor: "#0D0B0E",
    heroTagline: "Up the Villa.",
    heroSubtext: "Your matchday companion — polls, chat, and exclusive content.",
};