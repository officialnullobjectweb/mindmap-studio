"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useStore, pal } from "../lib/store";

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, "0"); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorWheel() {
  const [open, setOpen] = useState(false);
  const { customColor, setCustomColor, selIds, applyColorToSel, colorIdx, setColor } = useStore();
  const [hsl, setHsl] = useState(() => hexToHsl(customColor));
  const [hexInput, setHexInput] = useState(customColor);
  const wheelRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => { setHsl(hexToHsl(customColor)); setHexInput(customColor); }, [customColor]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const pickFromWheel = useCallback((e) => {
    const rect = wheelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const h = Math.round(x * 360);
    const s = Math.round(Math.max(0, Math.min(100, 100 - (y * 100))));
    const hex = hslToHex(h, s, hsl.l);
    setHsl({ h, s, l: hsl.l });
    setHexInput(hex);
    setCustomColor(hex);
    if (selIds.length > 0) applyColorToSel(hex);
  }, [hsl.l, setCustomColor, selIds, applyColorToSel]);

  const pickLightness = (e) => {
    const rect = e.target.getBoundingClientRect();
    const l = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    const hex = hslToHex(hsl.h, hsl.s, l);
    setHsl({ ...hsl, l });
    setHexInput(hex);
    setCustomColor(hex);
    if (selIds.length > 0) applyColorToSel(hex);
  };

  const handleHex = (val) => {
    setHexInput(val);
    if (/^#[0-9a-f]{6}$/i.test(val)) {
      setCustomColor(val);
      setHsl(hexToHsl(val));
      if (selIds.length > 0) applyColorToSel(val);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed left-4 bottom-4 z-40 w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center transition-all hover:border-[var(--accent)]"
        style={{ boxShadow: "var(--shadow-md)" }}
        title="Color Wheel">
        <div className="w-5 h-5 rounded-full" style={{ background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)` }} />
      </button>
    );
  }

  return (
    <div ref={panelRef} className="fixed left-4 bottom-4 z-40 w-[260px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4"
      style={{ boxShadow: "var(--shadow-lg)", animation: "mIn 0.2s ease-out" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-semibold text-[var(--text)]">Color</span>
        <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text3)] hover:bg-[var(--accent-light)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      {/* Wheel */}
      <div ref={wheelRef} className="w-full aspect-square rounded-xl cursor-crosshair mb-3 relative overflow-hidden"
        style={{ background: `conic-gradient(hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))` }}
        onMouseDown={pickFromWheel} onMouseMove={(e) => e.buttons === 1 && pickFromWheel(e)}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
        <div className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{ left: `${(hsl.h / 360) * 100}%`, top: `${(1 - hsl.s / 100) * 100}%`, transform: "translate(-50%, -50%)" }} />
      </div>

      {/* Lightness */}
      <div className="w-full h-4 rounded-full cursor-crosshair mb-3 relative overflow-hidden"
        style={{ background: `linear-gradient(to right, hsl(${hsl.h},${hsl.s}%,0%), hsl(${hsl.h},${hsl.s}%,50%), hsl(${hsl.h},${hsl.s}%,100%))` }}
        onMouseDown={pickLightness} onMouseMove={(e) => e.buttons === 1 && pickLightness(e)}>
        <div className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{ left: `${hsl.l}%`, top: "50%", transform: "translate(-50%, -50%)" }} />
      </div>

      {/* Hex */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg border border-[var(--border)]" style={{ background: customColor }} />
        <input value={hexInput} onChange={(e) => handleHex(e.target.value)}
          className="flex-1 px-2 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[12px] font-mono text-[var(--text)] outline-none focus:border-[var(--accent)]" />
      </div>

      {/* Presets */}
      <div className="grid grid-cols-8 gap-1">
        {pal.map((c, i) => (
          <button key={i} onClick={() => { setCustomColor(c.bg); if (selIds.length > 0) applyColorToSel(c.bg); }}
            className={`w-full aspect-square rounded-md border-2 transition-all ${customColor === c.bg ? "border-[var(--accent)] scale-110" : "border-transparent hover:scale-105"}`}
            style={{ background: c.bg }} />
        ))}
      </div>
    </div>
  );
}
