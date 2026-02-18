// components/AuthGuard.tsx — Protects admin routes
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            setAuthenticated(true);
            setChecking(false);
        };

        checkAuth();

        // Listen for auth changes (logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_OUT" || !session) {
                    router.push("/login");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen bg-[#0D0D15] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#FF10A8]/20 border-t-[#FF10A8] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!authenticated) return null;

    return <>{children}</>;
}