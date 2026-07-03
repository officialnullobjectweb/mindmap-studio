"use client";

import { useState } from "react";
import { X, FileText, Sparkles } from "lucide-react";

const sample = `# Project Plan
- Research
  - Market analysis
  - Competitor review
- Design
  - Wireframes
  - Mockups
- Development
  - Frontend
  - Backend
  - Database
- Testing
  - Unit tests
  - Integration tests
- Launch
  - Marketing
  - Deployment`;

export default function MarkdownModal({ isOpen, onClose, onImport }) {
  const [md, setMd] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[90%] max-w-[560px] max-h-[80vh] flex flex-col overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[var(--accent)]" />
            <h3 className="text-[14px] font-semibold">Import Markdown</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f3f4f6] text-[var(--text-muted)] transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-4 flex-1 overflow-auto">
          <p className="text-[11px] text-[var(--text-muted)] mb-3">Paste a markdown list. Use <code className="bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[10px]">-</code> or <code className="bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[10px]">*</code> for bullets, indent for hierarchy.</p>
          <textarea value={md} onChange={(e) => setMd(e.target.value)} placeholder="Paste markdown here..."
            className="w-full h-[280px] bg-[#f9fafb] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] font-mono text-[var(--text-primary)] resize-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all placeholder:text-[var(--text-muted)]" />
          <button onClick={() => setMd(sample)} className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium">
            <Sparkles size={11} /> Load sample
          </button>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[#f3f4f6] transition-colors">Cancel</button>
          <button onClick={() => { if (md.trim()) { onImport(md); setMd(""); } }} disabled={!md.trim()}
            className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 transition-colors">
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
