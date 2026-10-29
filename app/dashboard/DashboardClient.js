// ============================================================================
// FAIL: app/dashboard/DashboardClient.js
// KONSEP: Dei Look & Feel - Black Bezel Tablet Frame, White Canvas, 3 Counters, Right Sidebar
// ============================================================================

"use client";

import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import KanbanBoard from "@/components/KanbanBoard";
import ScheduleCalendarView from "@/components/ScheduleCalendarView";
import LeaderboardView from "@/components/LeaderboardView";
import RewardsView from "@/components/RewardsView";
import BottomDock from "@/components/BottomDock";
import CreateChoreModal from "@/components/CreateChoreModal";
import CommandSearchDialog from "@/components/CommandSearchDialog";
import { Plus, Bell, Minus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function DashboardClient({
  currentUser,
  family,
  users,
  chores,
  activityLogs,
  rewards,
}) {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Metrik Statistik ala 26 Total / 2 Completed / 23 Upcoming
  const totalCount = chores.length;
  const completedCount = chores.filter((c) => c.status === "completed").length;
  const upcomingCount = chores.filter((c) => c.status !== "completed").length;

  return (
    <div className="min-h-screen bg-[#d6eefb] py-6 px-3 sm:px-8 flex justify-center items-start selection:bg-purple-200">
      {/* Black Bezel Outer Frame (Tablet Style ala Dei Mockup) */}
      <div className="w-full max-w-[1440px] dei-tablet-frame p-2 sm:p-3 shadow-2xl relative">
        {/* Top Header bar with Dei branding */}
        <div className="rounded-t-[36px] relative z-30">
          <TopHeader
            currentUser={currentUser}
            family={family}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenCreateModal={() => setIsCreateOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        {/* Main Tablet Screen Canvas (White Canvas) */}
        <div className="bg-white rounded-b-[36px] p-6 sm:p-8 min-h-[820px] flex flex-col gap-6 relative z-10">
          <div className="w-full space-y-6">
            {/* Header Row: "Pelan Kemas Rumah 🕰️" + 3 Stats Counter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                  Pelan Kemas Rumah 🕰️
                </h1>
              </div>

              {/* 3 Pill Counters (Total, Completed, Upcoming) ala Dei mockup */}
              <div className="flex items-center gap-2.5">
                {/* Total */}
                <div className="rounded-2xl p-2.5 px-4 bg-[#e0f2fe] border border-sky-200 text-center min-w-[70px] shadow-2xs">
                  <div className="text-xl font-black text-sky-950 leading-tight">
                    {totalCount}
                  </div>
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                    Total
                  </div>
                </div>

                {/* Completed with Party Popper emoji */}
                <div className="rounded-2xl p-2.5 px-4 bg-[#dcfce7] border border-emerald-200 text-center min-w-[75px] shadow-2xs relative">
                  <span className="absolute -top-2.5 -right-1 text-sm">🎉</span>
                  <div className="text-xl font-black text-emerald-950 leading-tight">
                    {completedCount}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Selesai
                  </div>
                </div>

                {/* Upcoming */}
                <div className="rounded-2xl p-2.5 px-4 bg-zinc-100 border border-zinc-200 text-center min-w-[70px] shadow-2xs">
                  <div className="text-xl font-black text-zinc-900 leading-tight">
                    {upcomingCount}
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    Upcoming
                  </div>
                </div>
              </div>
            </div>

            {/* View Switcher: Pelan Tugasan, Kalendar, Juara, Hadiah */}
            <div className="w-full">
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
          </div>
        </div>

        {/* Bottom Floating Black Dock Toolbar (Dei style) */}
        <BottomDock
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Modal Cipta Tugasan Baru */}
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
