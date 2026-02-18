// app/h/[slug]/hub-client.tsx — Fan-facing hub renderer using Block component
"use client";

import { useState, useEffect } from "react";
import type { HubConfig } from "@/lib/types";
import { normalizeHub } from "@/lib/types";
import { Block, type BlockData } from "@/components/Block";

export default function HubClient({ hub: rawHub }: { hub: HubConfig }) {
    const [isReady, setIsReady] = useState(false);
    const hub = normalizeHub(rawHub);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const sortedBlocks = [...(hub.blocks || [])].sort(
        (a, b) => a.sortOrder - b.sortOrder
    );

    const sectionOrder = hub.sectionOrder?.length
        ? hub.sectionOrder
        : ["sponsor", "hero", "blocks"];

    // Convert ContentBlock to BlockData for the Block component
    const toBlockData = (block: (typeof sortedBlocks)[0]): BlockData => ({
        id: block.id,
        title: block.title,
        description: block.description,
        imageUrl: block.imageUrl || "",
        href: block.linkType === "whatsapp"
            ? block.link.includes("wa.me")
                ? block.link
                : `https://wa.me/${block.link}`
            : block.link,
        aspectRatio: block.aspectRatio || "1:1",
        badge: block.badge,
        accentColor: block.accentColor,
    });

    return (
        <>
            <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap");
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
                        {sectionOrder.map((sectionId, sectionIndex) => {
                            switch (sectionId) {
                                case "sponsor":
                                    if (!hub.sponsorBannerUrl && !hub.sponsorLink) return null;
                                    return (
                                        <div
                                            key="sponsor"
                                            className={`w-full rounded-2xl overflow-hidden mb-6 ${isReady ? "animate-fadeSlideUp" : "opacity-0"}`}
                                            style={{
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                animationDelay: `${sectionIndex * 80}ms`,
                                            }}
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
                                                        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                                                        backdropFilter: "blur(12px)",
                                                    }}
                                                >
                                                    {hub.sponsorBannerUrl ? (
                                                        <img
                                                            src={hub.sponsorBannerUrl}
                                                            alt="Sponsor"
                                                            className="max-h-[60px] w-auto object-contain opacity-90"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            Headline Sponsor
                                                        </span>
                                                    )}
                                                </div>
                                            </a>
                                        </div>
                                    );

                                case "hero":
                                    return (
                                        <div
                                            key="hero"
                                            className={`text-center mb-8 ${isReady ? "animate-fadeSlideUp" : "opacity-0"}`}
                                            style={{ animationDelay: `${sectionIndex * 80 + 80}ms` }}
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
                                    );

                                case "blocks":
                                    return (
                                        <div key="blocks" className="space-y-3 mb-6">
                                            {sortedBlocks.map((block, i) => (
                                                <div
                                                    key={block.id}
                                                    className={isReady ? "animate-fadeSlideUp" : "opacity-0"}
                                                    style={{
                                                        animationDelay: `${sectionIndex * 80 + 160 + i * 80}ms`,
                                                    }}
                                                >
                                                    <Block block={toBlockData(block)} />
                                                </div>
                                            ))}
                                        </div>
                                    );

                                default:
                                    return null;
                            }
                        })}

                        {/* Footer */}
                        <div
                            className={`text-center mt-10 ${isReady ? "animate-fadeSlideUp" : "opacity-0"}`}
                            style={{ animationDelay: `${160 + sortedBlocks.length * 80 + 100}ms` }}
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