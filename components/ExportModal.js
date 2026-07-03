"use client";

import { useState } from "react";
import { X, Download, FileImage, FileText, FileType, Image, File } from "lucide-react";

const formats = [
  { id: "html", label: "HTML", desc: "Interactive, hoverable", icon: FileText, color: "#6366f1" },
  { id: "svg", label: "SVG", desc: "Vector, scalable", icon: FileImage, color: "#22c55e" },
  { id: "png", label: "PNG", desc: "Raster image", icon: Image, color: "#f59e0b" },
  { id: "jpg", label: "JPG", desc: "Compressed image", icon: Image, color: "#ef4444" },
  { id: "pdf", label: "PDF", desc: "Print-ready document", icon: File, color: "#8b5cf6" },
  { id: "json", label: "JSON", desc: "Data backup", icon: FileType, color: "#06b6d4" },
];

export default function ExportModal({ isOpen, onClose, onExport }) {
  const [quality, setQuality] = useState(2);
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  const handleExport = (format) => {
    setSelected(format);
    setTimeout(() => {
      onExport(format, quality);
      setSelected(null);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl w-[92%] max-w-[480px] overflow-hidden border border-[var(--border)]" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-[15px] font-semibold text-[var(--text)]">Export</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text3)] hover:bg-[var(--accent-light)] hover:text-[var(--text)] transition-colors"><X size={16} /></button>
        </div>

        <div className="px-6 py-5">
          {/* Quality */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[var(--text2)] font-medium">Resolution</span>
              <span className="text-[11px] text-[var(--text3)]">{quality}x ({quality === 1 ? "72 DPI" : quality === 2 ? "144 DPI" : "216 DPI"})</span>
            </div>
            <input type="range" min="1" max="3" value={quality} onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]" />
          </div>

          {/* Formats */}
          <div className="grid grid-cols-2 gap-2">
            {formats.map((f) => (
              <button key={f.id} onClick={() => handleExport(f.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  selected === f.id ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-[var(--border)] hover:border-[var(--text3)] hover:bg-[var(--accent-light)]"
                }`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: f.color + "15" }}>
                  <f.icon size={16} style={{ color: f.color }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text)]">{f.label}</p>
                  <p className="text-[10px] text-[var(--text3)]">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
