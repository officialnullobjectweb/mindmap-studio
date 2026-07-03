"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useStore } from "../lib/store";
import MindNode from "./MindNode";
import ContextMenu from "./ContextMenu";

const nodeTypes = { mindNode: MindNode };

function CanvasInner() {
  const store = useStore();
  const toastMsg = useStore((s) => s.toastMsg);
  const dark = useStore((s) => s.dark);
  const shapeMode = useStore((s) => s.shapeMode);
  const { screenToFlowPosition } = useReactFlow();

  const onNodeClick = useCallback(
    (e, node) => {
      // If holding Ctrl/Cmd, toggle in our store
      if (e.ctrlKey || e.metaKey) {
        store.selectNode(node.id, true);
      }
      // Otherwise let React Flow handle single selection
    },
    [store.selectNode]
  );

  // Sync React Flow's selection with our store
  const onSelectionEnd = useCallback(
    (_, nodes) => {
      if (nodes && nodes.length > 0) {
        useStore.setState({ selIds: nodes.map((n) => n.id), selEdge: null });
      }
    },
    []
  );

  const onSelectionStart = useCallback(() => {
    // Clear our selection when starting a new box selection
    useStore.setState({ selIds: [], selEdge: null });
  }, []);

  const onEdgeClick = useCallback(
    (_, edge) => store.selectEdge(edge.id),
    [store.selectEdge]
  );
  const onPaneClick = useCallback(
    (e) => {
      const state = useStore.getState();
      if (state.shapeMode) {
        const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        store.addNode("New Node", pos.x - 60, pos.y - 20);
        useStore.setState({ shapeMode: false });
        return;
      }
      store.clearSel();
      store.closeCtx();
    },
    [store, screenToFlowPosition]
  );
  const onNodeContextMenu = useCallback(
    (e, node) => {
      e.preventDefault();
      e.stopPropagation();
      store.selectNode(node.id, false);
      store.openCtx(e.clientX, e.clientY, node.id, "node");
    },
    [store]
  );
  const onEdgeContextMenu = useCallback(
    (e, edge) => {
      e.preventDefault();
      e.stopPropagation();
      store.selectEdge(edge.id);
      store.openCtx(e.clientX, e.clientY, edge.id, "edge");
    },
    [store]
  );
  const onPaneContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      store.clearSel();
      store.openCtx(e.clientX, e.clientY, null, "pane");
    },
    [store]
  );
  const onDoubleClick = useCallback(
    (e) => {
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      store.addNode("New Node", pos.x - 60, pos.y - 20);
    },
    [store, screenToFlowPosition]
  );
  const onNodeDragStart = useCallback(
    (e, node) => {
      if (e.ctrlKey || e.metaKey) store.dupOnDrag(node.id);
    },
    [store.dupOnDrag]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        store.deleteSel();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        store.redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        store.redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        store.duplicateNodes();
      }
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        store.addNode("New Node");
      }
      if (e.key === "l" && !e.metaKey && !e.ctrlKey) {
        useStore.getState().autoLayout();
      }
      if (e.key === "Escape") {
        store.clearSel();
        store.closeCtx();
        useStore.setState({ shapeMode: false });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        useStore.setState({
          selIds: useStore.getState().nodes.filter((n) => !n.hidden).map((n) => n.id),
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [store]);

  const edgeColor = dark ? "#4b5563" : "#c5cad6";
  const dotColor = dark ? "#2a3a52" : "#c8cdd8";
  const maskBg = dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)";

  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const shapeId = e.dataTransfer.getData("shape");
    if (!shapeId) return;
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    store.setShape(shapeId);
    store.addNode("New Node", pos.x - 60, pos.y - 20);
    useStore.setState({ shapeMode: false });
  }, [store, screenToFlowPosition]);

  return (
    <div
      className="w-full h-full"
      style={{ cursor: shapeMode ? "crosshair" : "default" }}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={store.nodes}
        edges={store.edges}
        onNodesChange={store.onNodesChange}
        onEdgesChange={store.onEdgesChange}
        onConnect={store.onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onDoubleClick={onDoubleClick}
        onNodeDragStart={onNodeDragStart}
        onSelectionEnd={onSelectionEnd}
        onSelectionStart={onSelectionStart}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        defaultEdgeOptions={{
          type: "bezier",
          style: { stroke: edgeColor, strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.05}
        maxZoom={3}
        snapToGrid
        snapGrid={[16, 16]}
        connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
        connectionLineType="bezier"
        connectionRadius={50}
        deleteKeyCode={null}
        multiSelectionKeyCode="Shift"
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectNodesOnDrag={true}
        selectionMode="partial"
      >
        <Background variant="dots" color={dotColor} gap={20} size={1.5} />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          nodeColor={(n) => n.style?.background || "#fff"}
          nodeStrokeColor={(n) => n.style?.borderColor || "#374151"}
          maskColor={maskBg}
          style={{ marginBottom: 56 }}
          pannable
          zoomable
        />
      </ReactFlow>
      <ContextMenu />
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
