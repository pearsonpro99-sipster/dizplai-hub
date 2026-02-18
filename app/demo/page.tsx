// app/demo/page.tsx — Block component demo with mock data
"use client";

import { Block, type BlockData } from "@/components/Block";

// ─── MOCK DATA ───────────────────────────────────────────────────────
const MOCK_DATA: BlockData[] = [
    {
        id: "1",
        title: "Join the WhatsApp Community",
        description:
            "Get live updates, vote on player of the match, and chat with other fans in real time.",
        imageUrl:
            "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop",
        href: "https://wa.me/447700000000",
        aspectRatio: "1:1",
        badge: "LIVE",
        accentColor: "#25D366",
    },
    {
        id: "2",
        title: "Vote: Player of the Match",
        description:
            "Who stood out today? Cast your vote and see the live results on the big screen.",
        imageUrl:
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop",
        href: "https://example.com/poll",
        aspectRatio: "16:9",
        badge: "POLL",
        accentColor: "#FF10A8",
    },
    {
        id: "3",
        title: "Exclusive Merch Drop",
        description:
            "Limited edition event kit — only available to fans in the arena today.",
        imageUrl:
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
        href: "https://example.com/shop",
        aspectRatio: "1:1",
        badge: "NEW",
        accentColor: "#FF6020",
    },
    {
        id: "4",
        title: "Share Your Matchday Moment",
        description:
            "Upload your best photo or video from today for a chance to feature on the broadcast.",
        imageUrl:
            "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=450&fit=crop",
        href: "https://example.com/upload",
        aspectRatio: "16:9",
        accentColor: "#7628FE",
    },
];

// ─── DEMO PAGE ───────────────────────────────────────────────────────
export default function DemoPage() {
    return (
        <>
            <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap");
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0A0A0F;
          font-family: 'Outfit', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

            <div className="min-h-dvh flex justify-center bg-[#0A0A0F]">
                <div className="w-full max-w-[430px] px-4 pt-8 pb-20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF10A8] to-[#7628FE] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF10A8]/20">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7L8 5z" fill="white" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">
                            Block Component Demo
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            2× side-by-side (1:1) · 2× stacked (16:9)
                        </p>
                    </div>

                    {/* Blocks */}
                    <div className="space-y-3">
                        {MOCK_DATA.map((block) => (
                            <Block key={block.id} block={block} />
                        ))}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest mt-10">
                        Powered by Dizplai
                    </p>
                </div>
            </div>
        </>
    );
}