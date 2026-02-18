// app/admin/page.tsx — Hub list with Dizplai brand styling
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    ExternalLink,
    Settings,
    Trash2,
    Search,
    LayoutGrid,
    Zap,
} from "lucide-react";
import type { HubConfig } from "@/lib/types";

export default function AdminDashboard() {
    const router = useRouter();
    const [hubs, setHubs] = useState<HubConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchHubs = async () => {
        const res = await fetch("/api/hubs");
        const data = await res.json();
        setHubs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchHubs();
    }, []);

    const filteredHubs = useMemo(() => {
        if (!searchQuery) return hubs;
        return hubs.filter(
            (hub) =>
                hub.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hub.slug.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [hubs, searchQuery]);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setCreating(true);
        const res = await fetch("/api/hubs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventName: newName.trim() }),
        });
        if (res.ok) {
            const hub = await res.json();
            router.push(`/admin/${hub.slug}`);
        }
        setCreating(false);
    };

    const handleDelete = async (slug: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this hub? This cannot be undone.")) return;
        await fetch(`/api/hubs/${slug}`, { method: "DELETE" });
        fetchHubs();
    };

    const publishedCount = hubs.filter((h) => h.isPublished).length;

    return (
        <div>
            {/* Hero header */}
            <div className="relative mb-10">
                {/* Background glow */}
                <div className="absolute -top-8 left-0 w-72 h-72 bg-[#FF10A8]/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -top-8 right-20 w-48 h-48 bg-[#7628FE]/[0.04] rounded-full blur-[80px] pointer-events-none" />

                <div className="relative flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF10A8]/10 flex items-center justify-center border border-[#FF10A8]/20">
                                <LayoutGrid size={18} className="text-[#FF10A8]" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Your Hubs
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-[52px]">
                            Create and manage interactive fan engagement hubs
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                                Total
                            </p>
                            <p className="text-xl font-bold text-white">{hubs.length}</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-[#FF10A8]/[0.06] border border-[#FF10A8]/10">
                            <p className="text-[10px] uppercase tracking-wider text-[#FF10A8]/60 font-semibold">
                                Live
                            </p>
                            <p className="text-xl font-bold text-[#FF10A8]">
                                {publishedCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create new hub */}
            <div className="rounded-2xl border border-[#FF10A8]/10 bg-gradient-to-br from-[#FF10A8]/[0.04] via-transparent to-[#7628FE]/[0.03] p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-[#FF10A8]" />
                    <h2 className="text-sm font-bold text-white">Create New Hub</h2>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Event name, e.g. Volleyverse 2026"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-[#FF10A8] focus:ring-2 focus:ring-[#FF10A8]/20 transition-all"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={!newName.trim() || creating}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF10A8] to-[#D00E8C] hover:from-[#FF2DB8] hover:to-[#FF10A8] text-sm font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#FF10A8]/20 hover:shadow-[#FF10A8]/30"
                    >
                        <Plus size={16} />
                        Create Hub
                    </button>
                </div>
            </div>

            {/* Search */}
            {hubs.length > 0 && (
                <div className="mb-6">
                    <div className="relative max-w-sm">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search hubs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-gray-500 outline-none focus:border-[#FF10A8]/30 transition-colors"
                        />
                    </div>
                </div>
            )}

            {/* Hub list */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-2 border-[#FF10A8]/20 border-t-[#FF10A8] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Loading hubs...</p>
                </div>
            ) : filteredHubs.length === 0 && hubs.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF10A8]/10 to-[#7628FE]/10 flex items-center justify-center mx-auto mb-5 border border-white/[0.04]">
                        <Zap size={28} className="text-[#FF10A8]/40" />
                    </div>
                    <p className="text-lg font-bold text-white mb-1">No hubs yet</p>
                    <p className="text-sm text-gray-500">
                        Create your first interactive hub above to get started.
                    </p>
                </div>
            ) : filteredHubs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No hubs match your search.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredHubs.map((hub) => (
                        <div
                            key={hub.slug}
                            onClick={() => router.push(`/admin/${hub.slug}`)}
                            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center justify-between hover:border-[#FF10A8]/20 hover:bg-[#FF10A8]/[0.02] transition-all cursor-pointer"
                        >
                            {/* Left accent bar on hover */}
                            <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#FF10A8] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-4 pl-2">
                                {/* Hub avatar */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold border"
                                    style={{
                                        backgroundColor: hub.primaryColor + "12",
                                        color: hub.primaryColor,
                                        borderColor: hub.primaryColor + "20",
                                    }}
                                >
                                    {hub.eventName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="font-bold text-[15px] text-white group-hover:text-[#FF10A8] transition-colors">
                                            {hub.eventName}
                                        </h3>
                                        {hub.isPublished ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF10A8]/10 text-[#FF10A8] border border-[#FF10A8]/20">
                                                Live
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6020]/10 text-[#FF6020] border border-[#FF6020]/20">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 font-mono">
                                        /h/{hub.slug} · {hub.blocks?.length || 0} block
                                        {(hub.blocks?.length || 0) !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={`/h/${hub.slug}`}
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Preview hub"
                                >
                                    <ExternalLink size={15} />
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/admin/${hub.slug}`);
                                    }}
                                    className="p-2.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Edit hub"
                                >
                                    <Settings size={15} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(hub.slug, e)}
                                    className="p-2.5 rounded-lg hover:bg-red-500/20 transition-colors text-gray-500 hover:text-red-400"
                                    title="Delete hub"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}