// app/admin/layout.tsx — Admin shell with auth guard and logout
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";

function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#0D0D15] text-gray-100">
            <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0D0D15]/95 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF10A8] to-[#7628FE] flex items-center justify-center shadow-lg shadow-[#FF10A8]/20 group-hover:shadow-[#FF10A8]/30 transition-shadow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7L8 5z" fill="white" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] font-extrabold tracking-tight text-white">Dizplai</span>
                            <span className="text-[10px] font-semibold text-[#FF10A8]/70 uppercase tracking-[0.15em] -mt-0.5">Hub Manager</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-8 px-4 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF10A8] animate-pulse" />
                            <span className="text-[11px] text-gray-400 font-medium">Interaction Hub Admin</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="h-8 px-3 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center gap-2 hover:bg-white/[0.08] transition-colors text-gray-400 hover:text-white"
                            title="Sign out"
                        >
                            <LogOut size={13} />
                            <span className="text-[11px] font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
            <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF10A8]/20 to-transparent pointer-events-none" />
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <AdminShell>{children}</AdminShell>
        </AuthGuard>
    );
}