// ============================================================================
// FAIL: components/LeaderboardView.js
// KONSEP: Greenish Theme Carta Juara (Active Containers style table & Leaderboard)
// ============================================================================

"use client";

import UserAvatar from "@/components/UserAvatar";
import { Trophy, Flame, Clock, Sparkles } from "lucide-react";

export default function LeaderboardView({ users, activityLogs }) {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getRankBadge = (index) => {
    if (index === 0)
      return (
        <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-black text-sm shadow-xs">
          🥇
        </span>
      );
    if (index === 1)
      return (
        <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-300 flex items-center justify-center font-black text-sm shadow-xs">
          🥈
        </span>
      );
    if (index === 2)
      return (
        <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-black text-sm shadow-xs">
          🥉
        </span>
      );
    return (
      <span className="w-8 h-8 rounded-full bg-[#eaf4ec] text-[#2e6945] border border-[#cfe2d4] flex items-center justify-center font-bold text-xs">
        #{index + 1}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Carta Juara (Greenish Pill Rows ala "Active Containers Status") */}
      <div className="lg:col-span-7 bg-[#eef4f0] rounded-3xl p-6 border border-[#d5e2d8] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#d8e7dc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white text-[#2e6945] border border-[#cfe2d4] shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#183123]">
                Carta Juara Rumah
              </h2>
              <p className="text-xs text-[#52705d]">
                Siapa paling rajin buat kerja, dialah peneraju ranking!
              </p>
            </div>
          </div>
        </div>

        {/* Rows style ala Greenish container table */}
        <div className="space-y-3">
          {sortedUsers.map((user, idx) => (
            <div
              key={user.id}
              className={`p-3.5 px-5 rounded-full border transition-all flex items-center justify-between gap-4 bg-white shadow-2xs ${
                idx === 0
                  ? "border-[#fbb839] ring-2 ring-[#fbb839]/30"
                  : "border-[#d8e6dc] hover:border-[#b4cfbd]"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {getRankBadge(idx)}
                <UserAvatar
                  name={user.name}
                  colorTheme={user.colorTheme || "#2e6945"}
                  size={42}
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-[#183123] truncate flex items-center gap-2">
                    {user.name}
                    {idx === 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                        Peneraju 👑
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#5b7866] mt-0.5 font-medium">
                    <span className="capitalize">{user.role === "admin" ? "Kapten" : "Member"}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {user.streakDays || 1} Hari Streak
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-black text-[#1b5334]">
                  {user.points}{" "}
                  <span className="text-xs font-bold text-[#62806e]">
                    pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Aktiviti (Activity Overview style) */}
      <div className="lg:col-span-5 bg-[#eef4f0] rounded-3xl p-6 border border-[#d5e2d8] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#d8e7dc]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-white text-[#2e6945] border border-[#cfe2d4] shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#183123]">
                Cerita Terkini Famili
              </h2>
              <p className="text-xs text-[#52705d]">
                Aktiviti kemas rumah & tebus point terkini
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {activityLogs.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#6e8a78]">
              Senyap je lagi ni, belum ada aktiviti baru.
            </div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white border border-[#d8e6dc] space-y-1 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#183123]">
                    {log.userName || "Ahli Famili"}
                  </span>
                  <span className="text-[10px] text-[#718d7b] font-medium">
                    {new Date(log.timestamp).toLocaleTimeString("ms-MY", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-[#3b5945] text-xs leading-relaxed">
                  {log.notes}
                </p>

                {log.pointsChanged !== undefined && log.pointsChanged !== 0 && (
                  <div className="pt-1 flex items-center justify-end">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.pointsChanged > 0
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {log.pointsChanged > 0 ? `+${log.pointsChanged}` : log.pointsChanged} mata
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
