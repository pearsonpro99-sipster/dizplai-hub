// app/login/page.tsx — Dizplai Hub login with Supabase Auth
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        router.push("/admin");
    };

    return (
        <div className="min-h-dvh bg-[#0D0D15] flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF10A8]/[0.06] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7628FE]/[0.04] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-[#FF6020]/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "64px 64px",
                }}
            />

            <div className="relative z-10 w-full max-w-[420px] px-6">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF10A8] to-[#7628FE] flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-[#FF10A8]/20">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M8 5v14l11-7L8 5z" fill="white" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                        Dizplai
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Interaction Hub Manager
                    </p>
                </div>

                {/* Login card */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8">
                    <h2 className="text-lg font-bold text-white mb-1">Welcome back</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Sign in to manage your interactive hubs
                    </p>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@dizplai.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-[#FF10A8]/50 focus:ring-2 focus:ring-[#FF10A8]/10 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-[#FF10A8]/50 focus:ring-2 focus:ring-[#FF10A8]/10 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF10A8] to-[#D00E8C] hover:from-[#FF2DB8] hover:to-[#FF10A8] text-sm font-bold text-white transition-all shadow-lg shadow-[#FF10A8]/20 hover:shadow-[#FF10A8]/30 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-[11px] text-gray-600">
                        Powered by{" "}
                        <span className="font-bold text-gray-500">Dizplai</span>
                        <span className="mx-2 text-gray-700">·</span>
                        <span className="text-[#FF10A8]/40">Making attention mean more</span>
                    </p>
                </div>
            </div>
        </div>
    );
}