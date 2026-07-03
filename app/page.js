"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";
import ImportModal from "../components/ImportModal";
import ExportModal from "../components/ExportModal";
import ShapePanel from "../components/ShapePanel";
import ColorWheel from "../components/ColorWheel";
import { useStore } from "../lib/store";

export default function Home() {
  const { nodes, edges, dark, importJSON, importMarkdown } = useStore();
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = dark ? "" : "light";
  }, [dark]);

  const handleImport = useCallback((content, type) => {
    if (type === "markdown") {
      importMarkdown(content);
    } else {
      importJSON(content);
    }
  }, [importMarkdown, importJSON]);

  const handleExport = useCallback(async (format, quality) => {
    const rf = document.querySelector(".react-flow");
    if (!rf) return;

    if (format === "json") {
      useStore.getState().exportJSON();
      return;
    }

    if (format === "html") {
      useStore.getState().exportHTML();
      return;
    }

    try {
      const { toPng, toSvg } = await import("html-to-image");

      if (format === "svg") {
        const svg = await toSvg(rf, { quality, backgroundColor: dark ? "#0c1222" : "#f4f6fb" });
        const link = document.createElement("a");
        link.download = "mindmap.svg";
        link.href = svg;
        link.click();
      } else if (format === "png") {
        const dataUrl = await toPng(rf, { pixelRatio: quality, backgroundColor: dark ? "#0c1222" : "#f4f6fb" });
        const link = document.createElement("a");
        link.download = "mindmap.png";
        link.href = dataUrl;
        link.click();
      } else if (format === "jpg") {
        const dataUrl = await toPng(rf, { pixelRatio: quality, backgroundColor: dark ? "#0c1222" : "#f4f6fb" });
        const canvas = document.createElement("canvas");
        const img = new window.Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d").drawImage(img, 0, 0);
          const link = document.createElement("a");
          link.download = "mindmap.jpg";
          link.href = canvas.toDataURL("image/jpeg", 0.95);
          link.click();
        };
        img.src = dataUrl;
      } else if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const dataUrl = await toPng(rf, { pixelRatio: quality, backgroundColor: dark ? "#0c1222" : "#f4f6fb" });
        const img = new window.Image();
        img.onload = () => {
          const pdf = new jsPDF({ orientation: img.width > img.height ? "l" : "p", unit: "px", format: [img.width, img.height] });
          pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
          pdf.save("mindmap.pdf");
        };
        img.src = dataUrl;
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [dark]);

  return (
    <div className="w-screen h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><circle cx="5" cy="5" r="1.5" /><circle cx="19" cy="5" r="1.5" /><circle cx="5" cy="19" r="1.5" /><circle cx="19" cy="19" r="1.5" /><line x1="12" y1="12" x2="5" y2="5" opacity="0.5" /><line x1="12" y1="12" x2="19" y2="5" opacity="0.5" /><line x1="12" y1="12" x2="5" y2="19" opacity="0.5" /><line x1="12" y1="12" x2="19" y2="19" opacity="0.5" /></svg>
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-[var(--text)] leading-none tracking-[-0.02em]">MindMap Studio</h1>
            <p className="text-[10px] text-[var(--text3)] mt-0.5">Visual mind mapping</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[var(--text3)]">
            <span className="flex items-center gap-1.5"><span className="kbd">N</span> Add</span>
            <span className="flex items-center gap-1.5"><span className="kbd">Del</span> Delete</span>
            <span className="flex items-center gap-1.5"><span className="kbd">⌘Z</span> Undo</span>
            <span className="flex items-center gap-1.5"><span className="kbd">⌘D</span> Duplicate</span>
          </div>
          <div className="h-4 w-px bg-[var(--border)]" />
          <span className="text-[11px] text-[var(--text3)] font-medium tabular-nums">{nodes.length} nodes · {edges.length} links</span>
        </div>
      </header>

      <Toolbar onImport={() => setImportOpen(true)} onExport={() => setExportOpen(true)} />

      <div className="flex-1 relative" style={{ background: "var(--bg)" }}>
        <Canvas />
        <ShapePanel />
        <ColorWheel />
      </div>

      <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} onExport={handleExport} />
    </div>
  );
}
