"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, Clipboard, FileJson, Sparkles } from "lucide-react";

const sampleMd = `# My Project Plan
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

export default function ImportModal({ isOpen, onClose, onImport }) {
  const [tab, setTab] = useState("paste");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("markdown");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target.result);
      if (file.name.endsWith(".json")) setFormat("json");
      else setFormat("markdown");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    if (!content.trim()) return;
    if (format === "json") {
      try {
        const data = JSON.parse(content);
        if (data.nodes && data.edges) onImport(data);
      } catch { alert("Invalid JSON"); return; }
    } else {
      onImport(content, "markdown");
    }
    setContent(""); onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl w-[92%] max-w-[580px] max-h-[85vh] flex flex-col overflow-hidden border border-[var(--border)]" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-[15px] font-semibold text-[var(--text)]">Import</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text3)] hover:bg-[var(--accent-light)] hover:text-[var(--text)] transition-colors"><X size={16} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {[
            { id: "paste", label: "Paste Content", icon: Clipboard },
            { id: "file", label: "Upload File", icon: Upload },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${tab === id ? "bg-[var(--accent-light)] text-[var(--accent)]" : "text-[var(--text3)] hover:text-[var(--text2)]"}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4 overflow-auto">
          {tab === "paste" ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] text-[var(--text3)]">Format:</span>
                {["markdown", "json"].map((f) => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${format === f ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)] text-[var(--text3)] border border-[var(--border)]"}`}>
                    {f === "markdown" ? "Markdown" : "JSON"}
                  </button>
                ))}
                {format === "markdown" && (
                  <button onClick={() => setContent(sampleMd)} className="ml-auto flex items-center gap-1 text-[10px] text-[var(--accent)] hover:text-[var(--accent-hover)]">
                    <Sparkles size={10} /> Sample
                  </button>
                )}
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={format === "markdown" ? "# My Plan\n- Research\n  - Market analysis\n- Design\n  - Wireframes" : '{"nodes":[...],"edges":[...]}'}
                className="w-full h-[260px] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] font-mono text-[var(--text)] resize-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all placeholder:text-[var(--text3)]" />
            </>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`h-[260px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${dragOver ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-[var(--border)] hover:border-[var(--text3)]"}`}>
              <input ref={fileRef} type="file" accept=".json,.md,.txt" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
              <Upload size={28} className="text-[var(--text3)] mb-3" />
              <p className="text-[13px] text-[var(--text2)] font-medium mb-1">Drop file here or click to browse</p>
              <p className="text-[11px] text-[var(--text3)]">Supports .json, .md, .txt</p>
              {content && (
                <div className="mt-4 px-4 py-2 bg-[var(--accent-light)] rounded-lg">
                  <p className="text-[11px] text-[var(--accent)] font-medium">File loaded — {format.toUpperCase()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-medium text-[var(--text2)] hover:bg-[var(--accent-light)] transition-colors">Cancel</button>
          <button onClick={handleImport} disabled={!content.trim()}
            className="px-5 py-2 rounded-lg text-[12px] font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 transition-colors">
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
