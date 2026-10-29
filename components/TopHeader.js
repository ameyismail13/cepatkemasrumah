// ============================================================================
// FAIL: components/TopHeader.js
// KONSEP: Dei Theme Top Black Bar (Rounded Pill Nav, Search, User with Email)
// ============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth-actions";
import UserAvatar from "@/components/UserAvatar";
import {
  Compass,
  Users,
  Clock,
  ShoppingBag,
  Grid,
  Search,
  Plus,
  LogOut,
  Trophy,
  Flame,
  ChevronDown,
} from "lucide-react";

export default function TopHeader({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onOpenSearch,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#0d0f11] text-white px-6 py-3.5 flex items-center justify-between gap-4 border-b border-white/5 relative z-40">
      {/* Kiri: Logo "Dei" bold typography */}
      <div className="flex items-center gap-3">
        <span className="font-black text-2xl tracking-tight text-white select-none">
          Dei
        </span>
        <span className="text-[11px] font-bold text-zinc-400 bg-white/10 px-2 py-0.5 rounded-full hidden sm:inline">
          Kemas Rumah
        </span>
      </div>

      {/* Tengah: Navigation Icons / Pills */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("kanban")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "kanban"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Pelan Tugasan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "calendar"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
          title="Jadual Kalendar"
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Jadual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "leaderboard"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
          title="Ranking Juara"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Juara</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rewards")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "rewards"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
          title="Ganjaran Hadiah"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Hadiah</span>
        </button>
      </nav>

      {/* Kanan: Search pill, Butang Tambah, User Profile (Ellington Thom style) */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-zinc-300 transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>Search...</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Tambah Kerja</span>
        </button>

        {/* User Pill Dropdown gaya gambar rujukan: Avatar + Name + Subtitle + Chevron */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 px-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
          >
            <UserAvatar
              name={currentUser.name}
              colorTheme={currentUser.colorTheme || "#3b82f6"}
              size={32}
              className="border border-white/30"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-zinc-400 leading-tight">
                {currentUser.name.toLowerCase()}@famili.com
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-white p-3 shadow-2xl border border-zinc-200 text-zinc-900 z-50">
              <div className="px-2 py-1.5 border-b border-zinc-100 mb-2">
                <p className="text-xs font-bold text-zinc-900">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-zinc-500 capitalize">
                  Peranan: {currentUser.role === "admin" ? "Kapten" : "Member"}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs bg-zinc-50 border border-zinc-100 rounded-2xl p-2">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {currentUser.points} pts
                  </span>
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {currentUser.streakDays || 1}d
                  </span>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Tukar Ahli / Keluar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
