// components/ImageUpload.tsx — Drag-and-drop image upload with preview
"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string; // Current image URL
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
    aspectHint?: string; // e.g. "Banner (4:1)" or "Logo (1:1)"
}

export function ImageUpload({
    value,
    onChange,
    label,
    placeholder = "Drop an image or click to upload",
    aspectHint,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const upload = useCallback(
        async (file: File) => {
            setError(null);
            setUploading(true);

            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Upload failed");
                    return;
                }

                onChange(data.url);
            } catch {
                setError("Upload failed. Please try again.");
            } finally {
                setUploading(false);
            }
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) upload(file);
        },
        [upload]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            // Reset input so same file can be re-selected
            e.target.value = "";
        },
        [upload]
    );

    const handleClear = useCallback(() => {
        onChange("");
        setError(null);
    }, [onChange]);

    // Has an image
    if (value) {
        return (
            <div>
                {label && (
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-24 object-contain bg-black/20 p-2"
                        onError={(e) => {
                            // If image fails to load, show the URL as text
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/20 text-xs text-white font-medium hover:bg-white/30 transition-colors"
                        >
                            Replace
                        </button>
                        <button
                            onClick={handleClear}
                            className="p-1.5 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    {/* URL display */}
                    <div className="px-3 py-2 text-[11px] text-gray-500 truncate border-t border-white/5">
                        {value}
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
        );
    }

    // Empty state / upload zone
    return (
        <div>
            {label && (
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    {label}
                </label>
            )}
            <div
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`
          relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all
          ${dragOver
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
                    }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 size={24} className="text-purple-400 animate-spin" />
                        <p className="text-xs text-gray-400">Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                            <Upload size={18} className="text-gray-500" />
                        </div>
                        <p className="text-xs text-gray-400">{placeholder}</p>
                        {aspectHint && (
                            <p className="text-[10px] text-gray-600">{aspectHint}</p>
                        )}
                        <p className="text-[10px] text-gray-600">
                            PNG, JPG, SVG, WebP · Max 5MB
                        </p>
                    </div>
                )}

                {error && (
                    <p className="mt-2 text-xs text-red-400">{error}</p>
                )}
            </div>

            {/* Manual URL input as fallback */}
            <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-gray-600">or paste URL:</span>
                <input
                    type="text"
                    placeholder="https://..."
                    onBlur={(e) => {
                        if (e.target.value.trim()) {
                            onChange(e.target.value.trim());
                            e.target.value = "";
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                                onChange(val);
                                (e.target as HTMLInputElement).value = "";
                            }
                        }
                    }}
                    className="flex-1 px-2 py-1 rounded text-[11px] bg-white/[0.04] border border-white/5 text-gray-400 outline-none focus:border-purple-500/50 transition-colors"
                />
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}