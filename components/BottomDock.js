// ============================================================================
// FAIL: components/BottomDock.js
// KONSEP: Dei Theme Bottom Floating Black Pill Toolbar (Tool shortcuts)
// ============================================================================

"use client";

import { Sparkles, Plus, Search, Calendar, Trophy, CheckSquare } from "lucide-react";

export default function BottomDock({
  onOpenCreate,
  onOpenSearch,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-2 rounded-full bg-[#0d0f11] text-white shadow-2xl border border-white/10 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setActiveTab("kanban")}
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
          activeTab === "kanban"
            ? "bg-white text-zinc-950 scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/10"
        }`}
        title="Pelan Tugasan"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("calendar")}
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
          activeTab === "calendar"
            ? "bg-white text-zinc-950 scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/10"
        }`}
        title="Jadual Kalendar"
      >
        <Calendar className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("leaderboard")}
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
          activeTab === "leaderboard"
            ? "bg-white text-zinc-950 scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/10"
        }`}
        title="Carta Juara"
      >
        <Trophy className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/20 mx-1" />

      {/* Quick Search */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
        title="Carian Pintas (Cmd+K)"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Quick Add */}
      <button
        type="button"
        onClick={onOpenCreate}
        className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#14532d] hover:bg-[#bbf7d0] flex items-center justify-center font-black cursor-pointer transition-all shadow-sm"
        title="Tambah Tugasan Baru"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
}

