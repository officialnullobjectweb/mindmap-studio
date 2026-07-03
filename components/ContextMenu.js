"use client";

import { useEffect, useRef } from "react";
import { useStore } from "../lib/store";

const I = ({ d, s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

const icons = {
  copy: "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  plus: "M12 5v14 M5 12h14",
  collapse: "M4 14h16",
};

export default function ContextMenu() {
  const { ctxMenu, closeCtx, deleteSel, duplicateNodes, addNode, selectNode, selectEdge, deleteEdge } = useStore();
  const ref = useRef(null);

  useEffect(() => {
    if (!ctxMenu) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) closeCtx(); };
    const esc = (e) => { if (e.key === "Escape") closeCtx(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", esc); };
  }, [ctxMenu, closeCtx]);

  if (!ctxMenu) return null;

  const items = ctxMenu.type === "node" ? [
    { label: "Duplicate", icon: icons.copy, action: () => { selectNode(ctxMenu.id, false); duplicateNodes(); closeCtx(); } },
    { label: "Delete", icon: icons.trash, danger: true, action: () => { selectNode(ctxMenu.id, false); deleteSel(); closeCtx(); } },
  ] : ctxMenu.type === "edge" ? [
    { label: "Remove Connection", icon: icons.trash, danger: true, action: () => { deleteEdge(ctxMenu.id); closeCtx(); } },
  ] : [
    { label: "Add Node", icon: icons.plus, action: () => { addNode("New Node", ctxMenu.x - 60, ctxMenu.y - 100); closeCtx(); } },
  ];

  return (
    <div ref={ref} className="ctx" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
      {items.map((item, i) => (
        <button key={i} onClick={item.action} className={item.danger ? "danger" : ""}>
          <I d={item.icon} s={13} /> {item.label}
        </button>
      ))}
    </div>
  );
}
