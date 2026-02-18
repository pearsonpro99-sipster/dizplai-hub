// components/Block.tsx — High-fidelity mobile card component
// 60/40 vertical split · vignette image · action icon · 4:5 aspect
"use client";

// ─── TYPES ───────────────────────────────────────────────────────────
export interface BlockData {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    href: string;
    aspectRatio: "1:1" | "16:9" | "9:16";
    badge?: string;
    accentColor?: string;
}

// ─── ARROW ICON ──────────────────────────────────────────────────────
function ArrowIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
        </svg>
    );
}

// ─── BLOCK COMPONENT ─────────────────────────────────────────────────
export function Block({ block }: { block: BlockData }) {
    const accent = block.accentColor || "#FF10A8";
    const cardBg = "#111118";

    return (
        <a
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-[16px] overflow-hidden border border-white/[0.10] transition-all duration-200 active:scale-[0.98] hover:border-white/[0.18] hover:shadow-lg"
            style={{
                aspectRatio: "4 / 5",
            }}
        >
            <div className="relative w-full h-full flex flex-col">
                {/* ── TOP 60% — IMAGE ── */}
                <div className="relative flex-[3] min-h-0 overflow-hidden">
                    {block.imageUrl ? (
                        <img
                            src={block.imageUrl}
                            alt={block.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${accent}15, ${accent}05)`,
                            }}
                        >
                            <span className="text-sm text-gray-600 font-medium">No image</span>
                        </div>
                    )}

                    {/* Vignette overlay — darker edges for depth */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `
                radial-gradient(ellipse at center, transparent 40%, ${cardBg}40 100%),
                linear-gradient(to bottom, transparent 50%, ${cardBg} 100%)
              `,
                        }}
                    />

                    {/* Badge */}
                    {block.badge && (
                        <span
                            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-xl"
                            style={{
                                backgroundColor: accent + "20",
                                color: accent,
                                border: `1px solid ${accent}30`,
                                boxShadow: `0 2px 8px ${accent}15`,
                            }}
                        >
                            {block.badge}
                        </span>
                    )}
                </div>

                {/* ── BOTTOM 40% — CONTENT ── */}
                <div
                    className="relative flex-[2] flex flex-col justify-center px-5 py-4"
                    style={{ backgroundColor: cardBg }}
                >
                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-white leading-snug group-hover:text-[#FF10A8] transition-colors">
                        {block.title}
                    </h3>

                    {/* Subtitle */}
                    {block.description && (
                        <p className="text-[13px] text-white/50 mt-1.5 leading-relaxed line-clamp-2 font-light">
                            {block.description}
                        </p>
                    )}

                    {/* Action icon — bottom right */}
                    <div className="absolute bottom-4 right-4 text-white">
                        <ArrowIcon />
                    </div>
                </div>
            </div>
        </a>
    );
}