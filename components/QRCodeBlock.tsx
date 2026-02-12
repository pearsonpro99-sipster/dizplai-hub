// components/QRCodeBlock.tsx — QR code generator with copy/download
"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Copy, Download, Check, Link as LinkIcon } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeBlockProps {
  slug: string;
}

export function QRCodeBlock({ slug }: QRCodeBlockProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // In production, replace with your actual domain
  const hubUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/h/${slug}`
      : `/h/${slug}`;

  useEffect(() => {
    if (!slug) return;
    QRCode.toDataURL(hubUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [hubUrl, slug]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(hubUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `${slug}-qr-code.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2">
        <QrCode size={14} className="text-purple-400" />
        <span className="text-xs font-semibold text-gray-300">
          QR Code & Share
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* QR Code */}
        {qrDataUrl && (
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-3 shadow-lg">
              <img
                src={qrDataUrl}
                alt={`QR Code for ${slug}`}
                className="w-40 h-40"
              />
            </div>
          </div>
        )}

        {/* URL display + copy */}
        <div className="flex items-center gap-2 rounded-lg bg-black/30 border border-white/[0.06] px-3 py-2">
          <LinkIcon size={13} className="text-gray-500 flex-shrink-0" />
          <span className="text-[11px] text-gray-400 truncate flex-1 font-mono">
            {hubUrl}
          </span>
          <button
            onClick={copyLink}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            title="Copy link"
          >
            {copied ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={copyLink}
            className="py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-gray-300 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={downloadQR}
            className="py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-medium text-purple-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download size={13} />
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}