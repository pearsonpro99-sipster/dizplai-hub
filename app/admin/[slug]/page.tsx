// app/admin/[slug]/page.tsx — Hub editor with drag-drop, QR code, polished UI
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    ExternalLink,
    Eye,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    BarChart3,
    Camera,
    Trophy,
    Zap,
    Radio,
    Gift,
    Heart,
    Star,
    ShoppingBag,
    Ticket,
    Users,
    Play,
    Music,
    Globe,
    GripVertical,
    CircleCheck,
    CircleDashed,
    type LucideIcon,
} from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HubConfig, ActionCard } from "@/lib/types";
import {
    DEFAULT_HUB,
    DEFAULT_CARD,
    AVAILABLE_ICONS,
    LINK_TYPES,
} from "@/lib/types";
import { ImageUpload } from "@/components/ImageUpload";
import { QRCodeBlock } from "@/components/QRCodeBlock";

// ─── ICON MAP ────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
    MessageCircle, BarChart3, Camera, Trophy, Zap, Radio, Gift,
    Heart, Star, ShoppingBag, Ticket, Users, Play, Music, Globe,
};

function generateId() {
    return `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────
function Section({
    title,
    description,
    children,
    defaultOpen = true,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div>
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    {description && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
                    )}
                </div>
                {open ? (
                    <ChevronUp size={16} className="text-gray-500" />
                ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                )}
            </button>
            {open && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/[0.03]">
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── FORM FIELD ──────────────────────────────────────────────────────
function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                {label}
            </label>
            {children}
        </div>
    );
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
    );
}

function ColorInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white font-mono outline-none focus:border-purple-500 transition-colors"
            />
        </div>
    );
}

function SelectInput({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: readonly { value: string; label: string }[];
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1a24]">
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

// ─── SORTABLE CARD EDITOR ────────────────────────────────────────────
function SortableCardEditor({
    card,
    onUpdate,
    onDelete,
}: {
    card: ActionCard;
    onUpdate: (updates: Partial<ActionCard>) => void;
    onDelete: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const Icon = iconMap[card.icon] || MessageCircle;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
        >
            {/* Collapsed header */}
            <div className="flex items-center gap-2 px-3 py-3">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 rounded cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors touch-none"
                >
                    <GripVertical size={16} />
                </button>

                {/* Icon preview */}
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                        backgroundColor: card.accentColor + "20",
                    }}
                >
                    <Icon size={14} style={{ color: card.accentColor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {card.title}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{card.link}</p>
                </div>

                {card.badge && (
                    <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
                        style={{
                            backgroundColor: card.accentColor + "20",
                            color: card.accentColor,
                        }}
                    >
                        {card.badge}
                    </span>
                )}

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-500"
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {/* Expanded editor */}
            {expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Title">
                            <TextInput
                                value={card.title}
                                onChange={(v) => onUpdate({ title: v })}
                                placeholder="Card title"
                            />
                        </Field>
                        <Field label="Badge">
                            <TextInput
                                value={card.badge || ""}
                                onChange={(v) => onUpdate({ badge: v || undefined })}
                                placeholder="e.g. LIVE, NEW"
                            />
                        </Field>
                    </div>

                    <Field label="Description">
                        <TextInput
                            value={card.description}
                            onChange={(v) => onUpdate({ description: v })}
                            placeholder="Short description"
                        />
                    </Field>

                    <Field label="URL">
                        <TextInput
                            value={card.link}
                            onChange={(v) => onUpdate({ link: v })}
                            placeholder="https://..."
                        />
                    </Field>

                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Link Type">
                            <SelectInput
                                value={card.linkType}
                                onChange={(v) =>
                                    onUpdate({ linkType: v as ActionCard["linkType"] })
                                }
                                options={LINK_TYPES}
                            />
                        </Field>
                        <Field label="Icon">
                            <SelectInput
                                value={card.icon}
                                onChange={(v) => onUpdate({ icon: v })}
                                options={AVAILABLE_ICONS}
                            />
                        </Field>
                        <Field label="Accent Colour">
                            <ColorInput
                                value={card.accentColor}
                                onChange={(v) => onUpdate({ accentColor: v })}
                            />
                        </Field>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            onClick={onDelete}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                        >
                            <Trash2 size={12} />
                            Remove Card
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
        <div
            className="rounded-2xl overflow-hidden p-4 w-full"
            style={{ backgroundColor: hub.backgroundColor }}
        >
            {/* Sponsor */}
            <div
                className="w-full h-12 rounded-lg mb-3 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
                {hub.sponsorBannerUrl ? (
                    <img
                        src={hub.sponsorBannerUrl}
                        alt="Sponsor"
                        className="max-h-[32px] w-auto object-contain opacity-80"
                    />
                ) : (
                    <span className="text-[9px] text-gray-500">Sponsor Banner</span>
                )}
            </div>

            {/* Logo + tagline */}
            <div className="text-center mb-3">
                <div
                    className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: hub.primaryColor + "25" }}
                >
                    {hub.logoUrl ? (
                        <img
                            src={hub.logoUrl}
                            alt=""
                            className="w-5 h-5 object-contain"
                        />
                    ) : (
                        <span
                            className="text-xs font-bold"
                            style={{ color: hub.primaryColor }}
                        >
                            {hub.eventName.charAt(0)}
                        </span>
                    )}
                </div>
                <p className="text-[11px] font-bold text-white leading-tight">
                    {hub.heroTagline}
                </p>
                {hub.heroSubtext && (
                    <p className="text-[8px] text-gray-400 mt-0.5">{hub.heroSubtext}</p>
                )}
            </div>

            {/* Cards */}
            <div className="space-y-1.5">
                {hub.actionCards.slice(0, 4).map((card) => {
                    const Icon = iconMap[card.icon] || MessageCircle;
                    return (
                        <div
                            key={card.id}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                        >
                            <div
                                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: card.accentColor + "20" }}
                            >
                                <Icon size={10} style={{ color: card.accentColor }} />
                            </div>
                            <span className="text-[10px] text-white truncate flex-1">
                                {card.title}
                            </span>
                            {card.badge && (
                                <span
                                    className="text-[7px] font-bold px-1 rounded"
                                    style={{
                                        color: card.accentColor,
                                        backgroundColor: card.accentColor + "20",
                                    }}
                                >
                                    {card.badge}
                                </span>
                            )}
                        </div>
                    );
                })}
                {hub.actionCards.length > 4 && (
                    <p className="text-[8px] text-gray-500 text-center">
                        +{hub.actionCards.length - 4} more
                    </p>
                )}
            </div>

            <p className="text-[7px] text-gray-600 text-center mt-3 uppercase tracking-widest">
                Powered by Dizplai
            </p>
        </div>
    );
}

// ─── SECTION LABELS ──────────────────────────────────────────────────
const SECTION_LABELS: Record<string, { title: string; description: string; icon: string }> = {
    sponsor: { title: "Sponsor Banner", description: "Headline sponsor area", icon: "sponsor" },
    hero: { title: "Hero Text", description: "Tagline and subtext", icon: "hero" },
    cards: { title: "Action Cards", description: "Interactive link cards", icon: "cards" },
};

// ─── SORTABLE SECTION BLOCK ──────────────────────────────────────────
function SortableSectionBlock({
    sectionId,
    hub,
    updateHub,
    sensors,
    sortedCards,
    addCard,
    updateCard,
    deleteCard,
    handleCardDragEnd,
}: {
    sectionId: string;
    hub: HubConfig;
    updateHub: (updates: Partial<HubConfig>) => void;
    sensors: ReturnType<typeof useSensors>;
    sortedCards: ActionCard[];
    addCard: () => void;
    updateCard: (id: string, updates: Partial<ActionCard>) => void;
    deleteCard: (id: string) => void;
    handleCardDragEnd: (event: DragEndEvent) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sectionId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 20 : 0,
    };

    const label = SECTION_LABELS[sectionId] || {
        title: sectionId,
        description: "",
    };

    const renderContent = () => {
        switch (sectionId) {
            case "sponsor":
                return (
                    <Section title={label.title} description={label.description}>
                        <ImageUpload
                            label="Sponsor Banner"
                            value={hub.sponsorBannerUrl}
                            onChange={(v) => updateHub({ sponsorBannerUrl: v })}
                            placeholder="Drop the sponsor banner here"
                            aspectHint="Wide banner (4:1) recommended"
                        />
                        <Field label="Sponsor Click-through URL">
                            <TextInput
                                value={hub.sponsorLink}
                                onChange={(v) => updateHub({ sponsorLink: v })}
                                placeholder="https://sponsor-website.com"
                            />
                        </Field>
                    </Section>
                );

            case "hero":
                return (
                    <Section title={label.title} description={label.description}>
                        <Field label="Tagline">
                            <TextInput
                                value={hub.heroTagline}
                                onChange={(v) => updateHub({ heroTagline: v })}
                                placeholder="Your Game. Your Voice."
                            />
                        </Field>
                        <Field label="Subtext">
                            <TextInput
                                value={hub.heroSubtext}
                                onChange={(v) => updateHub({ heroSubtext: v })}
                                placeholder="Short description..."
                            />
                        </Field>
                    </Section>
                );

            case "cards":
                return (
                    <Section
                        title={`${label.title} (${hub.actionCards.length})`}
                        description="Drag to reorder · Links and interactions shown to fans"
                    >
                        {sortedCards.length === 0 ? (
                            <p className="text-sm text-gray-500 py-6 text-center">
                                No cards yet. Add your first one below.
                            </p>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleCardDragEnd}
                            >
                                <SortableContext
                                    items={sortedCards.map((c) => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {sortedCards.map((card) => (
                                            <SortableCardEditor
                                                key={card.id}
                                                card={card}
                                                onUpdate={(updates) => updateCard(card.id, updates)}
                                                onDelete={() => deleteCard(card.id)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                        <button
                            onClick={addCard}
                            className="w-full py-3 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-500/5 text-sm text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Add Card
                        </button>
                    </Section>
                );

            default:
                return null;
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="relative">
            {/* Drag handle bar */}
            <div
                {...attributes}
                {...listeners}
                className="absolute -left-1 top-3 z-10 p-1.5 rounded-lg cursor-grab active:cursor-grabbing text-gray-600 hover:text-purple-400 hover:bg-purple-500/10 transition-colors touch-none"
                title="Drag to reorder section"
            >
                <GripVertical size={16} />
            </div>
            <div className="pl-6">{renderContent()}</div>
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

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetch(`/api/hubs/${slug}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    router.push("/admin");
                    return;
                }
                setHub(data);
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
        await fetch(`/api/hubs/${slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hub),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    // Card CRUD
    const addCard = () => {
        if (!hub) return;
        const newCard: ActionCard = {
            ...DEFAULT_CARD,
            id: generateId(),
            sortOrder: hub.actionCards.length,
        };
        updateHub({ actionCards: [...hub.actionCards, newCard] });
    };

    const updateCard = (id: string, updates: Partial<ActionCard>) => {
        if (!hub) return;
        updateHub({
            actionCards: hub.actionCards.map((c) =>
                c.id === id ? { ...c, ...updates } : c
            ),
        });
    };

    const deleteCard = (id: string) => {
        if (!hub) return;
        updateHub({
            actionCards: hub.actionCards
                .filter((c) => c.id !== id)
                .map((c, i) => ({ ...c, sortOrder: i })),
        });
    };

    // Drag end handler
    const handleDragEnd = (event: DragEndEvent) => {
        if (!hub) return;
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = hub.actionCards.findIndex((c) => c.id === active.id);
        const newIndex = hub.actionCards.findIndex((c) => c.id === over.id);

        const reordered = arrayMove(hub.actionCards, oldIndex, newIndex).map(
            (c, i) => ({ ...c, sortOrder: i })
        );
        updateHub({ actionCards: reordered });
    };

    if (loading || !hub) {
        return (
            <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading hub...</p>
            </div>
        );
    }

    const sortedCards = [...hub.actionCards].sort(
        (a, b) => a.sortOrder - b.sortOrder
    );

    // Section order — default if not set
    const sectionOrder = hub.sectionOrder?.length
        ? hub.sectionOrder
        : ["sponsor", "hero", "cards"];

    // Section drag handler
    const handleSectionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sectionOrder.indexOf(active.id as string);
        const newIndex = sectionOrder.indexOf(over.id as string);
        const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
        updateHub({ sectionOrder: newOrder });
    };

    return (
        <div>
            {/* ── TOP BAR ── */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/admin")}
                        className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-gray-400 border border-white/[0.06]"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">
                            {hub.eventName}
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">/h/{hub.slug}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Published toggle - moved to top */}
                    <button
                        onClick={() => updateHub({ isPublished: !hub.isPublished })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${hub.isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                            }`}
                    >
                        {hub.isPublished ? (
                            <>
                                <CircleCheck size={14} />
                                Published
                            </>
                        ) : (
                            <>
                                <CircleDashed size={14} />
                                Draft
                            </>
                        )}
                    </button>

                    <a
                        href={`/h/${hub.slug}`}
                        target="_blank"
                        className="px-4 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-gray-300 transition-all flex items-center gap-2"
                    >
                        <Eye size={14} />
                        Preview
                    </a>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 shadow-lg ${saved
                                ? "bg-emerald-600 shadow-emerald-500/20"
                                : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-purple-500/20"
                            } disabled:opacity-50`}
                    >
                        <Save size={14} />
                        {saving ? "Saving..." : saved ? "Saved!" : "Save"}
                    </button>
                </div>
            </div>

            {/* ── TWO COLUMN LAYOUT ── */}
            <div className="flex gap-6">
                {/* Editor column */}
                <div className="flex-1 space-y-4">
                    {/* Branding — always at top, not draggable (it's config, not layout) */}
                    <Section title="Branding" description="Event identity and colours">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Event Name">
                                <TextInput
                                    value={hub.eventName}
                                    onChange={(v) => updateHub({ eventName: v })}
                                />
                            </Field>
                            <Field label="URL Slug">
                                <TextInput
                                    value={hub.slug}
                                    onChange={(v) =>
                                        updateHub({
                                            slug: v
                                                .toLowerCase()
                                                .replace(/[^a-z0-9-]+/g, "-")
                                                .replace(/^-|-$/g, ""),
                                        })
                                    }
                                />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Primary Colour">
                                <ColorInput
                                    value={hub.primaryColor}
                                    onChange={(v) => updateHub({ primaryColor: v })}
                                />
                            </Field>
                            <Field label="Background Colour">
                                <ColorInput
                                    value={hub.backgroundColor}
                                    onChange={(v) => updateHub({ backgroundColor: v })}
                                />
                            </Field>
                        </div>
                        <ImageUpload
                            label="Logo"
                            value={hub.logoUrl}
                            onChange={(v) => updateHub({ logoUrl: v })}
                            placeholder="Drop your event logo here"
                            aspectHint="Square (1:1) recommended"
                        />
                    </Section>

                    {/* ── DRAGGABLE FAN-FACING SECTIONS ── */}
                    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <GripVertical size={14} className="text-purple-400" />
                            <span className="text-xs font-semibold text-purple-300">
                                Fan Page Layout
                            </span>
                            <span className="text-[10px] text-gray-500 ml-1">
                                — Drag sections to reorder how fans see the page
                            </span>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleSectionDragEnd}
                        >
                            <SortableContext
                                items={sectionOrder}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {sectionOrder.map((sectionId) => (
                                        <SortableSectionBlock
                                            key={sectionId}
                                            sectionId={sectionId}
                                            hub={hub}
                                            updateHub={updateHub}
                                            sensors={sensors}
                                            sortedCards={sortedCards}
                                            addCard={addCard}
                                            updateCard={updateCard}
                                            deleteCard={deleteCard}
                                            handleCardDragEnd={handleDragEnd}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
                <div className="w-[300px] flex-shrink-0">
                    <div className="sticky top-24 space-y-4">
                        {/* Preview */}
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/[0.04]">
                                <span className="text-xs font-semibold text-gray-300">
                                    Live Preview
                                </span>
                            </div>
                            <div className="p-3">
                                <MiniPreview hub={hub} />
                            </div>
                            <div className="px-3 pb-3">
                                <a
                                    href={`/h/${hub.slug}`}
                                    target="_blank"
                                    className="w-full py-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-[11px] text-gray-400 transition-colors flex items-center justify-center gap-1.5 font-medium"
                                >
                                    <ExternalLink size={11} />
                                    Open Full Preview
                                </a>
                            </div>
                        </div>

                        {/* QR Code */}
                        <QRCodeBlock slug={hub.slug} />
                    </div>
                </div>
            </div>
        </div>
    );
}