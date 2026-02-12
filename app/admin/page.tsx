// app/admin/page.tsx — Hub list with client filter + polished UI
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    ExternalLink,
    Settings,
    Trash2,
    Filter,
    Search,
    LayoutGrid,
} from "lucide-react";
import type { HubConfig } from "@/lib/types";

export default function AdminDashboard() {
    const router = useRouter();
    const [hubs, setHubs] = useState<HubConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [filterClient, setFilterClient] = useState("all");
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

    // Derive unique client names from hub event names for filter
    const clientNames = useMemo(() => {
        const names = [...new Set(hubs.map((h) => h.eventName))];
        return names.sort();
    }, [hubs]);

    const filteredHubs = useMemo(() => {
        return hubs.filter((hub) => {
            const matchesClient =
                filterClient === "all" || hub.eventName === filterClient;
            const matchesSearch =
                !searchQuery ||
                hub.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hub.slug.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesClient && matchesSearch;
        });
    }, [hubs, filterClient, searchQuery]);

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

    return (
        <div>
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <LayoutGrid size={20} className="text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Your Hubs</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Create and manage interactive fan hubs
                        </p>
                    </div>
                </div>
                <div className="text-xs text-gray-600">
                    {hubs.length} hub{hubs.length !== 1 ? "s" : ""} total
                </div>
            </div>

            {/* Create new hub */}
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Plus size={16} className="text-purple-400" />
                    <h2 className="text-sm font-semibold text-gray-200">
                        Create New Hub
                    </h2>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Event name, e.g. Volleyverse 2026"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={!newName.trim() || creating}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-sm font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={16} />
                        Create Hub
                    </button>
                </div>
            </div>

            {/* Filters */}
            {hubs.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search hubs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>

                    {/* Client filter dropdown */}
                    <div className="relative">
                        <Filter
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                        <select
                            value={filterClient}
                            onChange={(e) => setFilterClient(e.target.value)}
                            className="pl-9 pr-8 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-[#1a1a24]">
                                All Clients
                            </option>
                            {clientNames.map((name) => (
                                <option key={name} value={name} className="bg-[#1a1a24]">
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Hub list */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading hubs...</p>
                </div>
            ) : filteredHubs.length === 0 && hubs.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                        <LayoutGrid size={24} className="text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium">No hubs yet</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Create your first hub above to get started.
                    </p>
                </div>
            ) : filteredHubs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No hubs match your filter.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredHubs.map((hub) => (
                        <div
                            key={hub.slug}
                            onClick={() => router.push(`/admin/${hub.slug}`)}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center justify-between group hover:bg-white/[0.04] hover:border-purple-500/20 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                {/* Color preview */}
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner"
                                    style={{
                                        backgroundColor: hub.primaryColor + "15",
                                        color: hub.primaryColor,
                                        border: `1px solid ${hub.primaryColor}25`,
                                    }}
                                >
                                    {hub.eventName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="font-semibold text-sm text-white">
                                            {hub.eventName}
                                        </h3>
                                        {hub.isPublished ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                                Live
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        /h/{hub.slug} · {hub.actionCards.length} card
                                        {hub.actionCards.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={`/h/${hub.slug}`}
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Preview hub"
                                >
                                    <ExternalLink size={15} />
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/admin/${hub.slug}`);
                                    }}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Edit hub"
                                >
                                    <Settings size={15} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(hub.slug, e)}
                                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-gray-500 hover:text-red-400"
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