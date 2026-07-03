"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { useStore } from "../lib/store";

function MindNode({ id, data, selected }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);
  const { updateLabel, selectNode, toggleCollapse, collapsed, hasChildren, getChildrenCount } = useStore();
  const isCollapsed = collapsed.has(id);
  const hasKids = hasChildren(id);
  const kidsCount = getChildrenCount(id);

  useEffect(() => setLabel(data.label), [data.label]);
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    if (label.trim() && label !== data.label) updateLabel(id, label);
    else setLabel(data.label);
  }, [label, data.label, id, updateLabel]);

  const shape = data.shape || "rectangle";
  const cls = `mn shape-${shape} ${selected ? "sel" : ""}`;

  return (
    <div className={cls} onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}>
      <Handle type="source" position={Position.Top} id="top" isConnectable={true} />
      <Handle type="target" position={Position.Top} id="top-t" isConnectable={true} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={true} />
      <Handle type="target" position={Position.Bottom} id="bottom-t" isConnectable={true} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={true} />
      <Handle type="target" position={Position.Left} id="left-t" isConnectable={true} />
      <Handle type="source" position={Position.Right} id="right" isConnectable={true} />
      <Handle type="target" position={Position.Right} id="right-t" isConnectable={true} />

      {shape === "diamond" ? (
        <div className="inner">
          {editing ? (
            <input ref={inputRef} value={label} onChange={(e) => setLabel(e.target.value)} onBlur={commit}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } if (e.key === "Escape") { setLabel(data.label); setEditing(false); } }}
              onClick={(e) => e.stopPropagation()} />
          ) : <span>{data.label}</span>}
        </div>
      ) : (
        editing ? (
          <input ref={inputRef} value={label} onChange={(e) => setLabel(e.target.value)} onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } if (e.key === "Escape") { setLabel(data.label); setEditing(false); } }}
            onClick={(e) => e.stopPropagation()} />
        ) : <span>{data.label}</span>
      )}

      {hasKids && (
        <div className="collapse-btn" onClick={(e) => { e.stopPropagation(); toggleCollapse(id); }}
          title={isCollapsed ? `Show ${kidsCount} children` : "Collapse children"}>
          {isCollapsed ? "+" : "−"}
        </div>
      )}
    </div>
  );
}

export default memo(MindNode);
