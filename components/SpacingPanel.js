"use client";

import { useStore } from "../lib/store";
import { SlidersHorizontal } from "lucide-react";

export default function SpacingPanel() {
  const { nodeSpacing, setSpacing } = useStore();

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal size={13} className="text-gray-400" />
        <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">Spacing</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-gray-500">Horizontal</label>
            <span className="text-[11px] text-gray-700 font-medium">{nodeSpacing.horizontal}px</span>
          </div>
          <input
            type="range"
            min="80"
            max="500"
            value={nodeSpacing.horizontal}
            onChange={(e) => setSpacing({ ...nodeSpacing, horizontal: Number(e.target.value) })}
            className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-gray-500">Vertical</label>
            <span className="text-[11px] text-gray-700 font-medium">{nodeSpacing.vertical}px</span>
          </div>
          <input
            type="range"
            min="40"
            max="300"
            value={nodeSpacing.vertical}
            onChange={(e) => setSpacing({ ...nodeSpacing, vertical: Number(e.target.value) })}
            className="w-full h-1 bg-gray-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
