// components/Block.tsx — Content block card
// 16:9 image with gradient overlay · header + subheader only · no "Open" link
// Block colour controls text area background
"use client";

// ─── TYPES ───────────────────────────────────────────────────────────
export interface BlockData {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    href: string;
    badge?: string;
    accentColor?: string;
}

// ─── BLOCK COMPONENT ─────────────────────────────────────────────────
export function Block({ block }: { block: BlockData }) {
    const blockColor = block.accentColor || "#FF10A8";

    const content = (
        <div className="rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98] border border-white/[0.10] hover:border-white/[0.18]">
            {/* ── IMAGE — 16:9 with gradient overlay ── */}
            <div className="relative w-full aspect-video overflow-hidden">
                {block.imageUrl ? (
                    <img
                        src={block.imageUrl}
                        alt={block.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${blockColor}15, ${blockColor}05)` }}
                    >
                        <span className="text-sm text-gray-600 font-medium">No image</span>
                    </div>
                )}

                {/* Bottom-up dark gradient for text legibility */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
                    }}
                />

                {/* Badge */}
                {block.badge && (
                    <span
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-xl"
                        style={{
                            backgroundColor: blockColor + "20",
                            color: blockColor,
                            border: `1px solid ${blockColor}30`,
                        }}
                    >
                        {block.badge}
                    </span>
                )}
            </div>

            {/* ── CONTENT — block colour background ── */}
            {(block.title || block.description) && (
                <div className="px-8 py-6" style={{ backgroundColor: blockColor }}>
                    {block.title && (
                        <h3 className="text-[15px] font-bold text-white leading-snug">
                            {block.title}
                        </h3>
                    )}
                    {block.description && (
                        <p className="text-[13px] text-white/70 mt-2 leading-relaxed line-clamp-2 font-light">
                            {block.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    if (block.href) {
        return (
            <a href={block.href} target="_blank" rel="noopener noreferrer" className="group block">
                {content}
            </a>
        );
    }

    return content;
}