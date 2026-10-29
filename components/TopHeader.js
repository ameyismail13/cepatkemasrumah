// ============================================================================
// FAIL: components/TopHeader.js
// KONSEP: Greenish Theme Navbar (Clean Forest Green & Sage)
// ============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth-actions";
import UserAvatar from "@/components/UserAvatar";
import { Flame, Trophy, Plus, LogOut, Search, Bell } from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full bg-[#1b5334] text-white px-4 sm:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand Greenish */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 font-black text-lg shadow-inner">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 hidden sm:inline-flex">
                Cepat Kemas Rumah!
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Greenish */}
        <nav className="flex items-center p-1 rounded-full bg-black/15 backdrop-blur-md border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("kanban")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "kanban"
                ? "bg-white text-[#1b5334] shadow-sm"
                : "text-emerald-100/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Papan Kerja
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "calendar"
                ? "bg-white text-[#1b5334] shadow-sm"
                : "text-emerald-100/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Jadual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-white text-[#1b5334] shadow-sm"
                : "text-emerald-100/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Juara
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rewards")}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "rewards"
                ? "bg-white text-[#1b5334] shadow-sm"
                : "text-emerald-100/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Hadiah
          </button>
        </nav>

        {/* Right Section: Search, Add Chore, Notification, User Profile */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-emerald-100 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Cari (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cari...</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#fbb839] hover:bg-[#fab028] text-[#1b3d28] font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Tambah Kerja</span>
          </button>

          {/* User Profile Avatar with custom color theme */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <UserAvatar
                name={currentUser.name}
                colorTheme={currentUser.colorTheme || "#2e6945"}
                size={34}
                className="border-2 border-white/50"
              />
              <span className="text-xs font-bold text-white hidden md:inline">
                {currentUser.name}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-[#cfe2d4] text-[#183123] z-50">
                <div className="px-3 py-2 border-b border-[#e5efe7] mb-1">
                  <p className="text-xs font-bold text-[#183123]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[#557560] capitalize">
                    Peranan: {currentUser.role === "admin" ? "Kapten" : "Member"}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs bg-[#eaf4ec] border border-[#cfe2d3] rounded-xl px-2.5 py-1.5">
                    <span className="text-[#2e6945] font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> {currentUser.points} Mata
                    </span>
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {currentUser.streakDays || 1}d
                    </span>
                  </div>
                </div>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Tukar Ahli / Keluar
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
