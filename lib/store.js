import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";

let nid = 1;
const nextId = () => `n${nid++}`;

const baseStyle = {
  padding: "10px 18px", fontSize: "13px", fontWeight: 500, fontFamily: "Inter, sans-serif",
  border: "1.5px solid #e5e7eb", background: "#fff", color: "#111827",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)", minWidth: "100px", textAlign: "center",
  cursor: "grab", outline: "none",
};

const darkBaseStyle = {
  ...baseStyle,
  border: "1.5px solid #374151", background: "#1f2937", color: "#f3f4f6",
  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
};

const sh = {
  rectangle: { borderRadius: "10px" },
  rounded: { borderRadius: "20px" },
  circle: { borderRadius: "50%", minWidth: "90px", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  diamond: { borderRadius: "6px", minWidth: "80px", minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  pill: { borderRadius: "999px", padding: "8px 24px" },
};

const pal = [
  { bg: "#fff", bd: "#e5e7eb", tx: "#111827" },
  { bg: "#eef2ff", bd: "#c7d2fe", tx: "#3730a3" },
  { bg: "#f0fdf4", bd: "#bbf7d0", tx: "#166534" },
  { bg: "#fef3c7", bd: "#fde68a", tx: "#92400e" },
  { bg: "#fce7f3", bd: "#fbcfe8", tx: "#9d174d" },
  { bg: "#ecfdf5", bd: "#a7f3d0", tx: "#065f46" },
  { bg: "#1f2937", bd: "#374151", tx: "#f9fafb" },
  { bg: "#f9fafb", bd: "#d1d5db", tx: "#374151" },
];

const useStore = create((set, get) => ({
  nodes: [], edges: [], selIds: [], selEdge: null,
  shape: "rectangle", colorIdx: 0, customColor: "#4f46e5",
  spacing: { h: 220, v: 120 },
  history: [], histIdx: -1, ctxMenu: null, toastMsg: null,
  collapsed: new Set(), shapeMode: false, dark: true,

  setShapeMode: (v) => set({ shapeMode: v }),
  toggleDark: () => set((s) => ({ dark: !s.dark })),

  toast: (msg) => { set({ toastMsg: msg }); setTimeout(() => set({ toastMsg: null }), 2500); },

  saveHist: () => {
    const s = get();
    const snap = { nodes: JSON.parse(JSON.stringify(s.nodes)), edges: JSON.parse(JSON.stringify(s.edges)) };
    set({ history: [...s.history.slice(0, s.histIdx + 1), snap], histIdx: s.histIdx + 1 });
  },
  undo: () => { const s = get(); if (s.histIdx <= 0) return; const p = s.history[s.histIdx - 1]; set({ nodes: p.nodes, edges: p.edges, histIdx: s.histIdx - 1 }); },
  redo: () => { const s = get(); if (s.histIdx >= s.history.length - 1) return; const n = s.history[s.histIdx + 1]; set({ nodes: n.nodes, edges: n.edges, histIdx: s.histIdx + 1 }); },

  onNodesChange: (c) => set((s) => ({ nodes: applyNodeChanges(c, s.nodes) })),
  onEdgesChange: (c) => set((s) => ({ edges: applyEdgeChanges(c, s.edges) })),

  onConnect: (conn) => {
    const s = get();
    const exists = s.edges.some((e) => (e.source === conn.source && e.target === conn.target) || (e.source === conn.target && e.target === conn.source));
    if (exists) return;
    get().saveHist();
    set((s) => ({
      edges: addEdge({ ...conn, type: "bezier", style: { stroke: s.dark ? "#4b5563" : "#c5cad6", strokeWidth: 2 }, data: {} }, s.edges),
    }));
  },

  selectNode: (id, multi) => {
    set((s) => {
      if (multi) {
        const has = s.selIds.includes(id);
        return { selIds: has ? s.selIds.filter((i) => i !== id) : [...s.selIds, id], selEdge: null };
      }
      return { selIds: [id], selEdge: null };
    });
  },
  selectEdge: (id) => set({ selIds: [], selEdge: id }),
  clearSel: () => set({ selIds: [], selEdge: null }),

  addNode: (label, x, y) => {
    get().saveHist();
    const s = get();
    const c = pal[s.colorIdx];
    const sStyle = sh[s.shape] || sh.rectangle;
    const id = nextId();
    const base = s.dark ? darkBaseStyle : baseStyle;
    set((s) => ({
      nodes: [...s.nodes, {
        id, type: "mindNode",
        position: { x: x ?? 300 + Math.random() * 200, y: y ?? 250 + Math.random() * 200 },
        data: { label: label || "New Node", shape: s.shape, childIds: [] },
        style: { ...base, ...sStyle, background: c.bg, borderColor: c.bd, color: c.tx },
      }],
    }));
    return id;
  },

  updateLabel: (id, label) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, label } } : n),
  })),

  updateShape: (id, shape) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, shape }, style: { ...n.style, ...sh[shape] } } : n),
  })),

  applyColorToSel: (hex) => {
    const s = get();
    const nodes = s.nodes.map((n) => {
      if (!s.selIds.includes(n.id)) return n;
      if (hex) return { ...n, style: { ...n.style, background: hex, borderColor: hex, color: isLight(hex) ? "#111827" : "#f9fafb" } };
      const c = pal[s.colorIdx];
      return { ...n, style: { ...n.style, background: c.bg, borderColor: c.bd, color: c.tx } };
    });
    set({ nodes });
  },

  applyShapeToSel: () => {
    const s = get(); const sStyle = sh[s.shape] || sh.rectangle;
    set((s) => ({
      nodes: s.nodes.map((n) => s.selIds.includes(n.id) ? { ...n, data: { ...n.data, shape: s.shape }, style: { ...n.style, ...sStyle } } : n),
    }));
  },

  deleteSel: () => {
    const s = get();
    if (s.selIds.length === 0 && !s.selEdge) return;
    get().saveHist();
    if (s.selIds.length > 0) {
      const ids = new Set(s.selIds);
      set({
        nodes: s.nodes.filter((n) => !ids.has(n.id)),
        edges: s.edges.filter((e) => !ids.has(e.source) && !ids.has(e.target)),
        selIds: [],
      });
      get().toast(`Deleted ${ids.size} node(s)`);
    }
    if (s.selEdge) {
      set({ edges: s.edges.filter((e) => e.id !== s.selEdge), selEdge: null });
      get().toast("Connection removed");
    }
  },

  deleteEdge: (edgeId) => {
    get().saveHist();
    set((s) => ({ edges: s.edges.filter((e) => e.id !== edgeId), selEdge: null }));
    get().toast("Connection removed");
  },

  duplicateNodes: () => {
    const s = get();
    if (s.selIds.length === 0) { get().toast("No nodes selected"); return; }
    get().saveHist();
    const map = {};
    const newN = [];
    for (const id of s.selIds) {
      const n = s.nodes.find((nd) => nd.id === id);
      if (!n) continue;
      const nid = nextId();
      map[id] = nid;
      newN.push({ ...JSON.parse(JSON.stringify(n)), id: nid, position: { x: n.position.x + 40, y: n.position.y + 40 }, data: { ...n.data, childIds: [] } });
    }
    const newE = s.edges.filter((e) => map[e.source] && map[e.target]).map((e) => ({
      ...e, id: `e_${map[e.source]}_${map[e.target]}`, source: map[e.source], target: map[e.target],
    }));
    set((s) => ({ nodes: [...s.nodes, ...newN], edges: [...s.edges, ...newE], selIds: newN.map((n) => n.id) }));
    get().toast(`Duplicated ${newN.length} node(s)`);
  },

  dupOnDrag: (nodeId) => {
    const s = get(); const n = s.nodes.find((nd) => nd.id === nodeId);
    if (!n) return;
    get().saveHist();
    const nid = nextId();
    const nn = { ...JSON.parse(JSON.stringify(n)), id: nid, position: { x: n.position.x + 20, y: n.position.y + 20 }, data: { ...n.data, childIds: [] } };
    set((s) => ({ nodes: [...s.nodes, nn], selIds: [nid] }));
    return nid;
  },

  toggleCollapse: (nodeId) => {
    const s = get();
    const newC = new Set(s.collapsed);
    const childIds = get().getChildIds(nodeId);
    if (newC.has(nodeId)) {
      newC.delete(nodeId);
      set((s) => ({
        collapsed: newC,
        nodes: s.nodes.map((n) => childIds.has(n.id) ? { ...n, hidden: false } : n),
        edges: s.edges.map((e) => (childIds.has(e.source) || childIds.has(e.target)) ? { ...e, hidden: false } : e),
      }));
    } else {
      newC.add(nodeId);
      set((s) => ({
        collapsed: newC,
        nodes: s.nodes.map((n) => childIds.has(n.id) ? { ...n, hidden: true } : n),
        edges: s.edges.map((e) => (childIds.has(e.source) || childIds.has(e.target)) ? { ...e, hidden: true } : e),
      }));
    }
  },

  getChildIds: (nodeId) => {
    const s = get(); const ids = new Set(); const q = [nodeId];
    while (q.length > 0) {
      const cur = q.shift();
      for (const e of s.edges) { if (e.source === cur && !ids.has(e.target)) { ids.add(e.target); q.push(e.target); } }
    }
    return ids;
  },
  hasChildren: (nodeId) => get().edges.some((e) => e.source === nodeId),
  getChildrenCount: (nodeId) => get().getChildIds(nodeId).size,

  autoLayout: () => {
    const s = get();
    const nodes = JSON.parse(JSON.stringify(s.nodes));
    const edges = s.edges;
    if (nodes.length === 0) return;
    const targets = new Set(edges.map((e) => e.target));
    const roots = nodes.filter((n) => !targets.has(n.id));
    if (roots.length === 0) { nodes[0].position = { x: 100, y: 100 }; set({ nodes }); return; }
    const visited = new Set(); let y = 100;
    function layout(id, x) {
      if (visited.has(id)) return; visited.add(id);
      const node = nodes.find((n) => n.id === id);
      if (!node) return;
      const children = edges.filter((e) => e.source === id && !e.hidden).map((e) => e.target);
      if (children.length === 0) { node.position = { x, y }; y += s.spacing.v; return; }
      const sy = y;
      for (const c of children) layout(c, x + s.spacing.h);
      node.position = { x, y: (sy + y) / 2 - 20 };
    }
    for (const r of roots) layout(r.id, 100);
    set({ nodes });
    get().toast("Layout applied");
  },

  clearAll: () => { get().saveHist(); set({ nodes: [], edges: [], selIds: [], selEdge: null, collapsed: new Set() }); },

  importMarkdown: (md) => {
    const nodes = []; const edges = []; let y = 0; const stack = [];
    const s = get(); const base = s.dark ? darkBaseStyle : baseStyle;
    for (const line of md.split("\n")) {
      const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)/);
      if (!m) continue;
      const indent = m[1].length; const text = m[3].trim(); const level = Math.floor(indent / 2);
      const id = nextId(); const x = 200 + level * 240; const yPos = y * 130;
      const c = pal[Math.min(level, pal.length - 1)];
      nodes.push({ id, type: "mindNode", position: { x, y: yPos },
        data: { label: text, shape: level === 0 ? "rounded" : "rectangle", childIds: [] },
        style: { ...base, ...(level === 0 ? sh.rounded : sh.rectangle), background: c.bg, borderColor: c.bd, color: c.tx, fontSize: level === 0 ? "15px" : "13px", fontWeight: level === 0 ? 700 : 500, minWidth: level === 0 ? "160px" : "100px" },
      });
      while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();
      if (stack.length > 0) {
        edges.push({ id: `e_${stack[stack.length-1].id}_${id}`, source: stack[stack.length-1].id, target: id, type: "bezier", style: { stroke: s.dark ? "#4b5563" : "#c5cad6", strokeWidth: 2 }, data: {} });
      }
      stack.push({ id, level }); y++;
    }
    set({ nodes, edges });
    get().toast(`Imported ${nodes.length} nodes`);
  },

  exportHTML: () => {
    const s = get();
    const visible = s.nodes.filter((n) => !n.hidden);
    const visEdges = s.edges.filter((e) => !e.hidden);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of visible) {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + 200);
      maxY = Math.max(maxY, n.position.y + 60);
    }
    const pad = 80;
    const w = maxX - minX + pad * 2;
    const h = maxY - minY + pad * 2;

    let svgEdges = "";
    for (const e of visEdges) {
      const src = visible.find((n) => n.id === e.source);
      const tgt = visible.find((n) => n.id === e.target);
      if (!src || !tgt) continue;
      const x1 = src.position.x - minX + pad + 70;
      const y1 = src.position.y - minY + pad + 22;
      const x2 = tgt.position.x - minX + pad + 70;
      const y2 = tgt.position.y - minY + pad + 22;
      const cy = Math.abs(y2 - y1) * 0.4;
      svgEdges += `<path d="M${x1},${y1} C${x1},${y1 + cy} ${x2},${y2 - cy} ${x2},${y2}" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`;
    }

    let svgNodes = "";
    for (const n of visible) {
      const x = n.position.x - minX + pad;
      const y = n.position.y - minY + pad;
      const bg = n.style?.background || "#fff";
      const bd = n.style?.borderColor || "#e5e7eb";
      const tx = n.style?.color || "#111827";
      const r = n.data?.shape === "rounded" ? 20 : n.data?.shape === "pill" ? 999 : n.data?.shape === "circle" ? 999 : 10;
      const nw = n.data?.shape === "circle" ? 90 : n.data?.shape === "pill" ? 160 : 150;
      const nh = n.data?.shape === "circle" ? 90 : 44;
      const rx = n.data?.shape === "circle" ? nw / 2 : r;
      svgNodes += `<g class="node" data-id="${n.id}">`;
      svgNodes += `<rect x="${x}" y="${y}" width="${nw}" height="${nh}" rx="${rx}" fill="${bg}" stroke="${bd}" stroke-width="1.5" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.08));cursor:pointer"/>`;
      svgNodes += `<text x="${x + nw / 2}" y="${y + nh / 2 + 5}" text-anchor="middle" fill="${tx}" font-size="13" font-weight="500" font-family="Inter,sans-serif">${escHtml(n.data?.label || "")}</text>`;
      svgNodes += `</g>`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MindMap — FRAMD</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0f172a; font-family:'Inter',sans-serif; overflow:auto; }
  svg { display:block; margin:40px auto; max-width:95vw; }
  .node rect { transition: filter 0.2s, stroke 0.2s; }
  .node:hover rect { stroke:#6366f1; stroke-width:2; filter:drop-shadow(0 4px 12px rgba(99,102,241,0.3)); }
</style>
</head>
<body>
<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#0f172a" rx="16"/>
  ${svgEdges}
  ${svgNodes}
</svg>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mindmap.html"; a.click();
    URL.revokeObjectURL(url);
    get().toast("Interactive HTML exported");
  },

  exportJSON: () => {
    const s = get();
    const data = { nodes: s.nodes, edges: s.edges, dark: s.dark, exportedAt: new Date().toISOString(), version: 1 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `mindmap-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    get().toast("JSON exported");
  },

  importJSON: (data) => {
    if (data.nodes && data.edges) {
      set({ nodes: data.nodes, edges: data.edges, collapsed: new Set() });
      get().toast(`Imported ${data.nodes.length} nodes`);
    }
  },

  setShape: (s) => set({ shape: s }),
  setColor: (i) => set({ colorIdx: i }),
  setCustomColor: (c) => set({ customColor: c }),
  setSpacing: (sp) => set({ spacing: sp }),
  openCtx: (x, y, id, type) => set({ ctxMenu: { x, y, id, type } }),
  closeCtx: () => set({ ctxMenu: null }),
}));

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export { useStore, pal, sh };
