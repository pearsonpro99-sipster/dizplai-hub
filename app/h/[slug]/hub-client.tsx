// app/h/[slug]/hub-client.tsx — Client-side hub renderer
"use client";

import { useState, useEffect } from "react";
import {
    MessageCircle,
    BarChart3,
    Camera,
    Trophy,
    Zap,
    Radio,
    Gift,
    Heart,
    Star,
    ShoppingBag,
    Ticket,
    Users,
    Play,
    Music,
    Globe,
    ChevronRight,
    type LucideIcon,
} from "lucide-react";
import type { HubConfig, ActionCard } from "@/lib/types";

// ─── ICON MAP ────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
    MessageCircle, BarChart3, Camera, Trophy, Zap, Radio, Gift,
    Heart, Star, ShoppingBag, Ticket, Users, Play, Music, Globe,
};

// ─── ACTION CARD ─────────────────────────────────────────────────────
function ActionCardComponent({
    card,
    index,
    primaryColor,
}: {
    card: ActionCard;
    index: number;
    primaryColor: string;
}) {
    const Icon = iconMap[card.icon] || MessageCircle;
    const accent = card.accentColor || primaryColor;

    const handleClick = () => {
        if (card.linkType === "whatsapp") {
            // Ensure it's a proper wa.me link
            const url = card.link.includes("wa.me")
                ? card.link
                : `https://wa.me/${card.link}`;
            window.open(url, "_blank", "noopener");
        } else if (card.linkType === "modal") {
            console.log("Modal action:", card.id);
        } else {
            // External — append UTM if it's a dizplai domain
            let url = card.link;
            try {
                const parsed = new URL(url);
                if (parsed.hostname.includes("dizplai")) {
                    parsed.searchParams.set("utm_source", "dizplai_hub");
                    parsed.searchParams.set("utm_medium", "qr_code");
                    url = parsed.toString();
                }
            } catch { }
            window.open(url, "_blank", "noopener");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="group w-full text-left rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            {/* Accent glow on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 20% 50%, ${accent}15, transparent 70%)`,
                }}
            />

            <div className="relative flex items-center gap-4">
                <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-4deg]"
                    style={{
                        background: `${accent}18`,
                        border: `1px solid ${accent}30`,
                    }}
                >
                    <Icon size={22} style={{ color: accent }} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[15px] truncate text-white">
                            {card.title}
                        </h3>
                        {card.badge && (
                            <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse"
                                style={{
                                    backgroundColor: `${accent}25`,
                                    color: accent,
                                }}
                            >
                                {card.badge}
                            </span>
                        )}
                    </div>
                    <p className="text-[13px] mt-0.5 truncate text-gray-400">
                        {card.description}
                    </p>
                </div>

                <ChevronRight
                    size={18}
                    className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 text-gray-500"
                />
            </div>
        </button>
    );
}

// ─── MAIN HUB CLIENT ─────────────────────────────────────────────────
export default function HubClient({ hub }: { hub: HubConfig }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const sortedCards = [...hub.actionCards].sort(
        (a, b) => a.sortOrder - b.sortOrder
    );

    return (
        <>
            <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap");

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: ${hub.backgroundColor};
          font-family: 'Outfit', sans-serif;
          -webkit-font-smoothing: antialiased;
          overscroll-behavior: none;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp {
          opacity: 0;
          animation: fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

            <div
                className="min-h-dvh flex justify-center"
                style={{ background: hub.backgroundColor }}
            >
                <div className="w-full max-w-[430px] relative">
                    {/* Ambient glow */}
                    <div
                        className="fixed top-0 left-1/2 -translate-x-1/2 w-[430px] h-[500px] pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at 50% 0%, ${hub.primaryColor}20, transparent 70%)`,
                        }}
                    />

                    <div className="relative z-10 px-5 pt-6 pb-20">
                        {/* Sponsor Banner */}
                        {(hub.sponsorBannerUrl || hub.sponsorLink) && (
                            <div
                                className={`w-full rounded-2xl overflow-hidden mb-6 ${isReady ? "animate-fadeSlideUp" : "opacity-0"}`}
                                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <a
                                    href={hub.sponsorLink || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <div
                                        className="w-full h-[100px] flex items-center justify-center"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                                            backdropFilter: "blur(12px)",
                                        }}
                                    >
                                        {hub.sponsorBannerUrl ? (
                                            <img
                                                src={hub.sponsorBannerUrl}
                                                alt="Sponsor"
                                                className="max-h-[60px] w-auto object-contain opacity-90"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-500 font-medium">
                                                Headline Sponsor
                                            </span>
                                        )}
                                    </div>
                                </a>
                            </div>
                        )}

                        {/* Hero */}
                        <div
                            className={`text-center mb-8 ${isReady ? "animate-fadeSlideUp" : "opacity-0"}`}
                            style={{ animationDelay: "80ms" }}
                        >
                            <div
                                className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${hub.primaryColor}30, ${hub.primaryColor}10)`,
                                    border: `1px solid ${hub.primaryColor}25`,
                                }}
                            >
                                {hub.logoUrl ? (
                                    <img
                                        src={hub.logoUrl}
                                        alt={hub.eventName}
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                            (
                                                e.target as HTMLImageElement
                                            ).parentElement!.innerHTML = `<span style="font-size:24px;font-weight:700;color:${hub.primaryColor}">${hub.eventName.charAt(0)}</span>`;
                                        }}
                                    />
                                ) : (
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: hub.primaryColor }}
                                    >
                                        {hub.eventName.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {hub.heroTagline}
                            </h1>
                            {hub.heroSubtext && (
                                <p className="text-sm mt-2 max-w-[280px] mx-auto leading-relaxed text-gray-400">
                                    {hub.heroSubtext}
                                </p>
                            )}
                        </div>

                        {/* Cards */}
                        <div className="space-y-3">
                            {sortedCards.map((card, i) => (
                                <div
                                    key={card.id}
                                    className={isReady ? "animate-fadeSlideUp" : "opacity-0"}
                                    style={{ animationDelay: `${160 + i * 80}ms` }}
                                >
                                    <ActionCardComponent
                                        card={card}
                                        index={i}
                                        primaryColor={hub.primaryColor}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Powered by */}
                        <div
                            className={`text-center mt-10 ${isReady ? "animate-fadeSlideUp" : "opacity-0"}`}
                            style={{
                                animationDelay: `${160 + sortedCards.length * 80 + 100}ms`,
                            }}
                        >
                            <p className="text-xs font-medium tracking-wide uppercase text-gray-600">
                                Powered by Dizplai
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}