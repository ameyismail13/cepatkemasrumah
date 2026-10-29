// ============================================================================
// FAIL: app/dashboard/DashboardClient.js
// KONSEP: Greenish Theme Dashboard Layout
// ============================================================================

"use client";

import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import KanbanBoard from "@/components/KanbanBoard";
import ScheduleCalendarView from "@/components/ScheduleCalendarView";
import LeaderboardView from "@/components/LeaderboardView";
import RewardsView from "@/components/RewardsView";
import CreateChoreModal from "@/components/CreateChoreModal";
import CommandSearchDialog from "@/components/CommandSearchDialog";
import UserAvatar from "@/components/UserAvatar";
import { Droplets, Sparkles, Thermometer, TrendingUp, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function DashboardClient({
  currentUser,
  users,
  chores,
  activityLogs,
  rewards,
}) {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Statistik & Metrik
  const totalChores = chores.length;
  const completedChores = chores.filter((c) => c.status === "completed").length;
  const pendingApproval = chores.filter(
    (c) => c.status === "pending_approval"
  ).length;
  const overdueCount = chores.filter(
    (c) =>
      c.status !== "completed" &&
      new Date(c.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const completionRate =
    totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#d6e2d8] flex flex-col selection:bg-[#2e6945]/20 selection:text-[#183123]">
      {/* Top Header Greenish */}
      <TopHeader
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 space-y-6">
        {/* GREENISH HERO OVERVIEW CARD (Sama macam gambar rujukan) */}
        <div className="greenish-hero-banner p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/20 text-emerald-100">
              Famili Kemas Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Overview Rumah
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Hai <span className="font-bold underline text-amber-300">{currentUser.name}</span>! Jom tengok status kebersihan rumah hari ni. Rumah kemas, hati lapang, point pun masuk lebat.
            </p>

            {/* Quick Metrics Bar ala Greenish */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Tahap Bersih</div>
                  <div className="text-lg font-black text-white">{completionRate}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sky-200">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Dah Setel</div>
                  <div className="text-lg font-black text-white">{completedChores} / {totalChores}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Mata Anda</div>
                  <div className="text-lg font-black text-amber-300">{currentUser.points} pts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Plant / Mascot illustration container */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-center shrink-0 w-64 shadow-inner">
            <div className="text-5xl mb-2">🌿</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Status Rumah
            </div>
            <div className="text-sm font-semibold text-emerald-200 mt-0.5">
              {completionRate >= 70 ? "Kemas & Segar! 🌱" : "Boleh rajin sikit lagi 💪"}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] bg-white/15 px-3 py-1 rounded-full text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{users.length} Ahli Aktif</span>
            </div>
          </div>
        </div>

        {/* 3 STAT KAD (Growth Analytics, Critical Alerts & Activity Overview) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Kad 1: Kad Gelap (Growth Analytics style) */}
          <div className="greenish-card-dark p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Rekod Kerajinan
                </span>
                <span className="text-[10px] text-zinc-400 bg-white/10 px-2 py-0.5 rounded-full">
                  Streak
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {currentUser.streakDays || 1} Hari Berterusan!
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Kekalkan momentum tolong kemas rumah setiap hari tanpa henti.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +25% kerajinan minggu ni
              </span>
            </div>
          </div>

          {/* Kad 2: Kad Kuning/Amber (Critical Alerts style) */}
          <div className="greenish-card-amber p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1e3d2b]">
                  Perlu Perhatian (Alerts)
                </span>
                <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full font-bold">
                  Live
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white/40 p-2 rounded-xl text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-900" /> Tunggu Semakan:
                  </span>
                  <span className="font-black text-amber-950">{pendingApproval} kerja</span>
                </div>
                <div className="flex items-center justify-between bg-white/40 p-2 rounded-xl text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-800" /> Terbabas Due Date:
                  </span>
                  <span className="font-black text-rose-900">{overdueCount} kerja</span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-[11px] font-bold text-amber-950/80">
              {overdueCount > 0 ? "⚠️ Cepat siapkan kerja tertunggak!" : "✨ Semua kerja mengikut masa."}
            </div>
          </div>

          {/* Kad 3: Kad Putih (Activity Overview style) */}
          <div className="greenish-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#355742]">
                  Ringkasan Tugasan
                </span>
                <span className="text-[10px] text-[#557763] bg-[#eef5f0] px-2 py-0.5 rounded-full font-bold">
                  Status
                </span>
              </div>
              <div className="text-2xl font-black text-[#183123]">
                {completionRate}% Selesai
              </div>
              <p className="text-xs text-[#52705d] mt-1">
                {completedChores} daripada {totalChores} tugasan rumah telah selesai dibersihkan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e5efe7] flex items-center justify-between text-xs text-[#2e6945] font-bold">
              <span>Baki {totalChores - completedChores} tugasan aktif</span>
              <CheckCircle className="w-4 h-4 text-[#2e6945]" />
            </div>
          </div>
        </div>

        {/* Dynamic Views based on Tab */}
        <div className="pt-2">
          {activeTab === "kanban" && (
            <KanbanBoard
              chores={chores}
              users={users}
              currentUser={currentUser}
            />
          )}

          {activeTab === "calendar" && (
            <ScheduleCalendarView
              chores={chores}
              users={users}
              currentUser={currentUser}
            />
          )}

          {activeTab === "leaderboard" && (
            <LeaderboardView users={users} activityLogs={activityLogs} />
          )}

          {activeTab === "rewards" && (
            <RewardsView rewards={rewards} currentUser={currentUser} />
          )}
        </div>
      </main>

      {/* Modal Tambah Tugasan Baru */}
      {isCreateOpen && (
        <CreateChoreModal
          users={users}
          currentUser={currentUser}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {/* Dialog Carian Pintas (Cmd+K) */}
      <CommandSearchDialog
        chores={chores}
        users={users}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
