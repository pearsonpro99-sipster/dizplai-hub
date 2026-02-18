
// components/Block.tsx — Responsive content block for hub UI
// Supports 1:1 (side-by-side) and 16:9/9:16 (stacked) layouts
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

// ─── BLOCK COMPONENT ─────────────────────────────────────────────────
export function Block({ block }: { block: BlockData }) {
    const accent = block.accentColor || "#FF10A8";
    const isSquare = block.aspectRatio === "1:1";

    if (isSquare) {
        // ── 1:1 SIDE-BY-SIDE ──────────────────────────────────────────
        return (
            <a
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-stretch gap-0 rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all active:scale-[0.98]"
            >
                {/* Image — fixed 1/3 width, square aspect */}
                <div className="w-1/3 flex-shrink-0 relative">
                    <div className="aspect-square w-full">
                        {block.imageUrl ? (
                            <img
                                src={block.imageUrl}
                                alt={block.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/[0.04]">
                                <span className="text-[10px] text-gray-600">No image</span>
                            </div>
                        )}
                    </div>
                    {block.badge && (
                        <span
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
                            style={{
                                backgroundColor: accent + "25",
                                color: accent,
                                border: `1px solid ${accent}30`,
                            }}
                        >
                            {block.badge}
                        </span>
                    )}
                </div>

                {/* Text — right side */}
                <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-[#FF10A8] transition-colors">
                        {block.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {block.description}
                    </p>
                    <span
                        className="text-[10px] font-semibold mt-2 flex items-center gap-1"
                        style={{ color: accent }}
                    >
                        Open
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="group-hover:translate-x-0.5 transition-transform"
                        >
                            <path
                                d="M9 18l6-6-6-6"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </div>
            </a>
        );
    }

    // ── 16:9 / 9:16 STACKED ──────────────────────────────────────────
    return (
        <a
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all active:scale-[0.98]"
        >
            {/* Image — full width, 16:9 aspect */}
            <div className="relative w-full">
                <div
                    className={
                        block.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
                    }
                >
                    {block.imageUrl ? (
                        <img
                            src={block.imageUrl}
                            alt={block.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/[0.04]">
                            <span className="text-xs text-gray-600">No image</span>
                        </div>
                    )}
                </div>

                {/* Gradient overlay at bottom of image */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

                {block.badge && (
                    <span
                        className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
                        style={{
                            backgroundColor: accent + "25",
                            color: accent,
                            border: `1px solid ${accent}30`,
                        }}
                    >
                        {block.badge}
                    </span>
                )}
            </div>

            {/* Text — below image */}
            <div className="px-4 py-3">
                <h3 className="text-sm font-bold text-white group-hover:text-[#FF10A8] transition-colors">
                    {block.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {block.description}
                </p>
                <span
                    className="text-[10px] font-semibold mt-2 flex items-center gap-1 inline-flex"
                    style={{ color: accent }}
                >
                    Open
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="group-hover:translate-x-0.5 transition-transform"
                    >
                        <path
                            d="M9 18l6-6-6-6"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
        </a>
    );
}