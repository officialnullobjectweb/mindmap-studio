"use client";

import { useState } from "react";
import { useStore, pal } from "../lib/store";

const categories = [
  {
    name: "Basic",
    shapes: [
      { id: "rectangle", label: "Rectangle", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="8" width="24" height="16" rx="3" /></svg> },
      { id: "rounded", label: "Rounded", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="8" width="24" height="16" rx="8" /></svg> },
      { id: "pill", label: "Pill", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="26" height="10" rx="5" /></svg> },
    ],
  },
  {
    name: "Geometric",
    shapes: [
      { id: "circle", label: "Circle", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="12" /></svg> },
      { id: "diamond", label: "Diamond", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4L28 16L16 28L4 16Z" /></svg> },
      { id: "hexagon", label: "Hexagon", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4L27 10V22L16 28L5 22V10L16 4Z" /></svg> },
    ],
  },
  {
    name: "Flow",
    shapes: [
      { id: "parallelogram", label: "Parallelogram", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 24L14 8H28L22 24Z" /></svg> },
      { id: "trapezoid", label: "Trapezoid", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 8H24L20 24H4Z" /></svg> },
      { id: "arrow", label: "Arrow", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16H24M24 16L18 10M24 16L18 22" /></svg> },
    ],
  },
  {
    name: "Special",
    shapes: [
      { id: "cloud", label: "Cloud", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 22C5.8 22 4 20.2 4 18C4 15.8 5.8 14 8 14C8 11.2 10.2 9 13 9C14.4 9 15.6 9.5 16.6 10.4C17.8 8.9 19.8 8 22 8C25.3 8 28 10.7 28 14C28 14.2 28 14.4 27.9 14.6C29.2 15.4 30 16.8 30 18.5C30 20.4 28.4 22 26.5 22H8Z" /></svg> },
      { id: "star", label: "Star", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4L19.5 12.5L29 13.5L22 19.5L24 29L16 24L8 29L10 19.5L3 13.5L12.5 12.5Z" /></svg> },
      { id: "note", label: "Note", icon: <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="24" height="24" rx="3" /><line x1="10" y1="12" x2="22" y2="12" /><line x1="10" y1="17" x2="22" y2="17" /><line x1="10" y1="22" x2="18" y2="22" /></svg> },
    ],
  },
];

export default function ShapePanel() {
  const [open, setOpen] = useState(false);
  const { shape, setShape, setShapeMode } = useStore();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
        style={{ boxShadow: "var(--shadow-md)" }}
        title="Shapes">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><circle cx="17.5" cy="6.5" r="3.5" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 17.5L20 14L20 21L14 17.5Z" /></svg>
      </button>
    );
  }

  const handleDragStart = (e, shapeId) => {
    e.dataTransfer.setData("shape", shapeId);
    e.dataTransfer.effectAllowed = "copy";
    setShape(shapeId);
    setShapeMode(true);
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-[200px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden max-h-[70vh] flex flex-col"
      style={{ boxShadow: "var(--shadow-lg)", animation: "mIn 0.2s ease-out" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="text-[12px] font-semibold text-[var(--text)]">Shapes</span>
        <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text3)] hover:bg-[var(--accent-light)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {categories.map((cat) => (
          <div key={cat.name} className="mb-3">
            <p className="text-[9px] text-[var(--text3)] uppercase tracking-wider font-semibold px-1 mb-1.5">{cat.name}</p>
            <div className="grid grid-cols-3 gap-1">
              {cat.shapes.map((s) => (
                <button key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)}
                  onClick={() => { setShape(s.id); setShapeMode(true); }}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing transition-all ${
                    shape === s.id ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text3)] hover:border-[var(--text3)] hover:text-[var(--text2)]"
                  }`}>
                  <div className="w-5 h-5">{s.icon}</div>
                  <span className="text-[8px] font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
