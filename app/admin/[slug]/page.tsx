// app/admin/[slug]/page.tsx — Hub editor with client feedback applied
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Save, Plus, Trash2, ExternalLink, Eye,
    ChevronDown, ChevronUp, GripVertical, CircleCheck, CircleDashed,
    Image as ImageIcon,
} from "lucide-react";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HubConfig, ContentBlock } from "@/lib/types";
import { DEFAULT_BLOCK, GOOGLE_FONTS, normalizeHub } from "@/lib/types";
import { ImageUpload } from "@/components/ImageUpload";
import { QRCodeBlock } from "@/components/QRCodeBlock";

function generateId() {
    return `block_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ─── FORM HELPERS ────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-[#FF10A8]/50 focus:ring-2 focus:ring-[#FF10A8]/10 transition-all" />
    );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center gap-2">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white font-mono outline-none focus:border-[#FF10A8]/50 transition-colors" />
        </div>
    );
}

function FontPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
    return (
        <Field label={label}>
            <select value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white outline-none focus:border-[#FF10A8]/50 transition-colors appearance-none cursor-pointer">
                {GOOGLE_FONTS.map((f) => (
                    <option key={f} value={f} className="bg-[#1a1a24]">{f}</option>
                ))}
            </select>
        </Field>
    );
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────
function Section({ title, description, children, defaultOpen = true }: { title: string; description?: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div>
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    {description && <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>}
                </div>
                {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </button>
            {open && <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/[0.03]">{children}</div>}
        </div>
    );
}

// ─── SORTABLE BLOCK EDITOR ───────────────────────────────────────────
function SortableBlockEditor({ block, onUpdate, onDelete, onSave }: { block: ContentBlock; onUpdate: (u: Partial<ContentBlock>) => void; onDelete: () => void; onSave: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 0 };

    return (
        <div ref={setNodeRef} style={style} className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-3">
                <button {...attributes} {...listeners} className="p-1 rounded cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors touch-none">
                    <GripVertical size={16} />
                </button>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/[0.06]" style={{ backgroundColor: block.accentColor + "15" }}>
                    {block.imageUrl ? <img src={block.imageUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={14} style={{ color: block.accentColor }} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{block.title || "Untitled Block"}</p>
                    <p className="text-[11px] text-gray-500 truncate">{block.url || "No URL"}</p>
                </div>
                {block.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ backgroundColor: block.accentColor + "20", color: block.accentColor }}>{block.badge}</span>
                )}
                <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-500">
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-4">
                    <ImageUpload label="Block Image" value={block.imageUrl} onChange={(v) => onUpdate({ imageUrl: v })} placeholder="16:9 image for this block" />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Title"><TextInput value={block.title} onChange={(v) => onUpdate({ title: v })} placeholder="Block title" /></Field>
                        <Field label="Badge"><TextInput value={block.badge || ""} onChange={(v) => onUpdate({ badge: v || undefined })} placeholder="e.g. LIVE, NEW" /></Field>
                    </div>
                    <Field label="Description"><TextInput value={block.description} onChange={(v) => onUpdate({ description: v })} placeholder="Short description" /></Field>
                    <Field label="URL"><TextInput value={block.url} onChange={(v) => onUpdate({ url: v })} placeholder="https://..." /></Field>
                    <div className="pt-2 flex items-center justify-between">
                        <button onClick={onDelete} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5">
                            <Trash2 size={12} />Remove
                        </button>
                        <button onClick={onSave} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF10A8] to-[#D00E8C] hover:from-[#FF2DB8] hover:to-[#FF10A8] text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-lg shadow-[#FF10A8]/20">
                            <Save size={12} />Save Block
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── MINI PREVIEW ────────────────────────────────────────────────────
function MiniPreview({ hub }: { hub: HubConfig }) {
    return (
        <div className="rounded-2xl overflow-hidden p-4 w-full" style={{ backgroundColor: hub.backgroundColor }}>
            <div className="text-center mb-3">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden" style={{ backgroundColor: hub.blockColor + "25" }}>
                    {hub.logoUrl ? <img src={hub.logoUrl} alt="" className="w-5 h-5 object-contain" /> : <span className="text-xs font-bold" style={{ color: hub.blockColor }}>{hub.eventName.charAt(0)}</span>}
                </div>
                {hub.heroTagline && <p className="text-[11px] font-bold text-white leading-tight">{hub.heroTagline}</p>}
            </div>
            <div className="space-y-1.5">
                {(hub.blocks || []).slice(0, 4).map((block) => (
                    <div key={block.id} className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="h-8 bg-white/[0.04]" />
                        <div className="px-2 py-1.5" style={{ backgroundColor: hub.blockColor }}>
                            <span className="text-[9px] text-white font-medium truncate block">{block.title}</span>
                        </div>
                    </div>
                ))}
                {(hub.blocks || []).length === 0 && <p className="text-[9px] text-gray-500 text-center py-2">No blocks yet</p>}
            </div>
            <p className="text-[7px] text-gray-600 text-center mt-3 uppercase tracking-widest">Powered by Dizplai</p>
        </div>
    );
}

// ─── MAIN EDITOR ─────────────────────────────────────────────────────
export default function HubEditorPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [hub, setHub] = useState<HubConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetch(`/api/hubs/${slug}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) { router.push("/admin"); return; }
                setHub(normalizeHub(data));
                setLoading(false);
            });
    }, [slug, router]);

    const updateHub = useCallback((updates: Partial<HubConfig>) => {
        setHub((prev) => (prev ? { ...prev, ...updates } : prev));
        setSaved(false);
    }, []);

    const handleSave = async () => {
        if (!hub) return;
        setSaving(true);
        const res = await fetch(`/api/hubs/${hub.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(hub) });
        const updated = await res.json();
        if (updated && !updated.error) {
            setHub(normalizeHub(updated));
            if (updated.slug && updated.slug !== slug) {
                router.replace(`/admin/${updated.slug}`);
            }
        }
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const addBlock = () => {
        if (!hub) return;
        updateHub({ blocks: [...(hub.blocks || []), { ...DEFAULT_BLOCK, id: generateId(), sortOrder: (hub.blocks || []).length }] });
    };

    const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
        if (!hub) return;
        updateHub({ blocks: (hub.blocks || []).map((b) => b.id === id ? { ...b, ...updates } : b) });
    };

    const deleteBlock = (id: string) => {
        if (!hub) return;
        updateHub({ blocks: (hub.blocks || []).filter((b) => b.id !== id).map((b, i) => ({ ...b, sortOrder: i })) });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (!hub) return;
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const blocks = hub.blocks || [];
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        updateHub({ blocks: arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({ ...b, sortOrder: i })) });
    };

    if (loading || !hub) {
        return (
            <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-[#FF10A8]/30 border-t-[#FF10A8] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading hub...</p>
            </div>
        );
    }

    const sortedBlocks = [...(hub.blocks || [])].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/admin")} className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-gray-400 border border-white/[0.06]">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{hub.eventName}</h1>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">/h/{hub.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => updateHub({ isPublished: !hub.isPublished })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${hub.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-[#FF6020]/10 text-[#FF6020] border-[#FF6020]/20"}`}>
                        {hub.isPublished ? <><CircleCheck size={14} />Published</> : <><CircleDashed size={14} />Draft</>}
                    </button>
                    <a href={`/h/${hub.slug}`} target="_blank" className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-gray-300 transition-all flex items-center gap-2">
                        <Eye size={14} />Preview
                    </a>
                    <button onClick={handleSave} disabled={saving}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 shadow-lg ${saved ? "bg-emerald-600 shadow-emerald-500/20" : "bg-gradient-to-r from-[#FF10A8] to-[#D00E8C] hover:from-[#FF2DB8] hover:to-[#FF10A8] shadow-[#FF10A8]/20"} disabled:opacity-50`}>
                        <Save size={14} />{saving ? "Saving..." : saved ? "Saved!" : "Save"}
                    </button>
                </div>
            </div>

            {/* Two column layout */}
            <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                    {/* Branding */}
                    <Section title="Branding" description="Event identity, colours, and typography" defaultOpen={false}>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Event Name"><TextInput value={hub.eventName} onChange={(v) => updateHub({ eventName: v })} /></Field>
                            <Field label="URL Slug"><TextInput value={hub.slug} onChange={(v) => updateHub({ slug: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") })} /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Block Colour"><ColorInput value={hub.blockColor} onChange={(v) => updateHub({ blockColor: v })} /></Field>
                            <Field label="Background Colour"><ColorInput value={hub.backgroundColor} onChange={(v) => updateHub({ backgroundColor: v })} /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FontPicker label="Header Font" value={hub.headerFont} onChange={(v) => updateHub({ headerFont: v })} />
                            <FontPicker label="Body Font" value={hub.bodyFont} onChange={(v) => updateHub({ bodyFont: v })} />
                        </div>
                        <ImageUpload label="Logo" value={hub.logoUrl} onChange={(v) => updateHub({ logoUrl: v })} placeholder="Drop your event logo here" aspectHint="Square (1:1) recommended" />
                        <ImageUpload label="Hero Background Image" value={hub.heroImageUrl} onChange={(v) => updateHub({ heroImageUrl: v })} placeholder="Full-width background image for the hero" aspectHint="Wide (16:9 or wider) recommended" />
                        <Field label="Header Text"><TextInput value={hub.heroTagline} onChange={(v) => updateHub({ heroTagline: v })} placeholder="Your Game. Your Voice." /></Field>
                        <Field label="Subtext"><TextInput value={hub.heroSubtext} onChange={(v) => updateHub({ heroSubtext: v })} placeholder="Short description..." /></Field>

                        {/* Social Links */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Social Links</label>
                            <div className="space-y-2">
                                {(hub.socialLinks || []).map((link, i) => (
                                    <div key={i} className="flex gap-2">
                                        <select value={link.platform} onChange={(e) => { const u = [...(hub.socialLinks || [])]; u[i] = { ...u[i], platform: e.target.value }; updateHub({ socialLinks: u }); }}
                                            className="w-32 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white outline-none focus:border-[#FF10A8]/50 transition-colors appearance-none cursor-pointer">
                                            {["twitter", "instagram", "tiktok", "youtube", "facebook", "linkedin", "whatsapp", "website"].map((p) => (
                                                <option key={p} value={p} className="bg-[#1a1a24]">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                            ))}
                                        </select>
                                        <input type="text" value={link.url} onChange={(e) => { const u = [...(hub.socialLinks || [])]; u[i] = { ...u[i], url: e.target.value }; updateHub({ socialLinks: u }); }}
                                            placeholder="https://..." className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-gray-500 outline-none focus:border-[#FF10A8]/50 transition-all" />
                                        <button onClick={() => updateHub({ socialLinks: (hub.socialLinks || []).filter((_, idx) => idx !== i) })}
                                            className="p-2.5 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                                <button onClick={() => updateHub({ socialLinks: [...(hub.socialLinks || []), { platform: "twitter", url: "" }] })}
                                    className="w-full py-2 rounded-xl border border-dashed border-white/[0.08] hover:border-[#FF10A8]/40 hover:bg-[#FF10A8]/5 text-xs text-gray-400 hover:text-[#FF10A8] transition-all flex items-center justify-center gap-1.5">
                                    <Plus size={14} />Add Social Link
                                </button>
                            </div>
                        </div>
                    </Section>

                    {/* Blocks */}
                    <Section title={`Content Blocks (${sortedBlocks.length})`} description="Add and reorder blocks shown to fans">
                        {sortedBlocks.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3"><ImageIcon size={22} className="text-gray-600" /></div>
                                <p className="text-sm text-gray-400 font-medium">No blocks yet</p>
                                <p className="text-xs text-gray-600 mt-1">Add your first block below to get started.</p>
                            </div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sortedBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-2">
                                        {sortedBlocks.map((block) => (
                                            <SortableBlockEditor key={block.id} block={block} onUpdate={(u) => updateBlock(block.id, u)} onDelete={() => deleteBlock(block.id)} onSave={handleSave} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                        <button onClick={addBlock} className="w-full py-3 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-[#FF10A8]/40 hover:bg-[#FF10A8]/5 text-sm text-gray-400 hover:text-[#FF10A8] transition-all flex items-center justify-center gap-2 mt-3">
                            <Plus size={16} />Add Block
                        </button>
                    </Section>
                </div>

                {/* Sidebar */}
                <div className="w-[300px] flex-shrink-0">
                    <div className="sticky top-24 space-y-4">
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/[0.04]"><span className="text-xs font-semibold text-gray-300">Live Preview</span></div>
                            <div className="p-3"><MiniPreview hub={hub} /></div>
                            <div className="px-3 pb-3">
                                <a href={`/h/${hub.slug}`} target="_blank" className="w-full py-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-[11px] text-gray-400 transition-colors flex items-center justify-center gap-1.5 font-medium">
                                    <ExternalLink size={11} />Open Full Preview
                                </a>
                            </div>
                        </div>
                        <QRCodeBlock slug={hub.slug} />
                    </div>
                </div>
            </div>
        </div>
    );
}