// ============================================================================
// FAIL: components/TopHeader.js
// KONSEP: Dei Theme Top Black Bar (Rounded Pill Nav, Search, User with Email)
// ============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth-actions";
import { logoutMasterAction } from "@/app/actions/master-auth-actions";
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
  Building,
  Home,
} from "lucide-react";

export default function TopHeader({
  currentUser,
  family,
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
    <header className="w-full bg-[#0d0f11] text-white px-6 py-3.5 flex items-center justify-between gap-4 border-b border-white/5 relative z-50">
      {/* Kiri: Title Jenama & Tag Famili */}
      <div className="flex items-center gap-3">
        <span className="font-black text-xl sm:text-2xl tracking-tight text-white select-none">
          Cepat Kemas Rumah!
        </span>
        {family?.familyName && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-zinc-300 border border-white/5">
            <Home className="w-3 h-3 text-emerald-400" />
            {family.familyName}
          </span>
        )}
      </div>

      {/* Kanan: User Profile */}
      <div className="flex items-center gap-3">
        {/* User Pill Dropdown: Avatar + Name + Subtitle + Chevron */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 px-2.5 rounded-full hover:bg-white/10 transition-all cursor-pointer bg-white/5 border border-white/10"
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
                {family?.familyName || `${currentUser.name.toLowerCase()}@famili.com`}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white p-3 shadow-2xl border border-zinc-200 text-zinc-900 z-50">
              <div className="px-2 py-1.5 border-b border-zinc-100 mb-2">
                <p className="text-xs font-black text-zinc-900">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-zinc-500 capitalize">
                  Peranan: {currentUser.role === "admin" ? "Kapten" : "Member"}
                </p>
                {family?.familyName && (
                  <p className="text-[10px] text-purple-700 font-bold mt-0.5">
                    Famili: {family.familyName}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between text-xs bg-zinc-50 border border-zinc-100 rounded-2xl p-2">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {currentUser.points} pts
                  </span>
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {currentUser.streakDays || 1}d
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 rounded-2xl transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-purple-600" /> Tukar Ahli (Kiosk)
                  </button>
                </form>

                <form action={logoutMasterAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Log Keluar Akaun Famili
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
