// app/admin/layout.tsx — Admin shell with Dizplai branding
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0c0c14] text-gray-100">
            {/* Top bar */}
            <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0c0c14]/90 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        {/* Dizplai logo mark */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7L8 5z" fill="white" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold tracking-tight text-white">
                                Dizplai
                            </span>
                            <span className="text-[10px] font-medium text-purple-400/80 uppercase tracking-widest -mt-0.5">
                                Hub Manager
                            </span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-8 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center">
                            <span className="text-[11px] text-gray-500 font-medium">
                                Interaction Hub Admin
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </div>
    );
}