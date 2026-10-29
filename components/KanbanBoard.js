// ============================================================================
// FAIL: components/KanbanBoard.js
// KONSEP: Dei Theme Task Mind-Map & Card Flow
// ============================================================================

"use client";

import { useState } from "react";
import ChoreCard from "./ChoreCard";
import { Clock, AlertCircle, CheckSquare, CheckCircle2, Filter } from "lucide-react";

export default function KanbanBoard({ chores, users, currentUser }) {
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [onlyMyChores, setOnlyMyChores] = useState(false);

  const filteredChores = chores.filter((chore) => {
    if (onlyMyChores && chore.assignedToId !== currentUser.id) return false;
    if (filterAssignee !== "all" && chore.assignedToId !== filterAssignee)
      return false;
    if (filterCategory !== "all" && chore.category !== filterCategory)
      return false;
    if (filterPriority !== "all" && chore.priority !== filterPriority)
      return false;
    return true;
  });

  const columns = [
    {
      id: "todo",
      title: "Untuk Dibuat (Upcoming)",
      badgeColor: "bg-zinc-100 text-zinc-700",
      items: filteredChores.filter((c) => c.status === "todo"),
    },
    {
      id: "in_progress",
      title: "Sedang Dibuat (Active)",
      badgeColor: "bg-purple-100 text-purple-800",
      items: filteredChores.filter((c) => c.status === "in_progress"),
    },
    {
      id: "pending_approval",
      title: "Menunggu Semakan",
      badgeColor: "bg-sky-100 text-sky-800",
      items: filteredChores.filter((c) => c.status === "pending_approval"),
    },
    {
      id: "completed",
      title: "Selesai (Completed)",
      badgeColor: "bg-emerald-100 text-emerald-800",
      items: filteredChores.filter((c) => c.status === "completed"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Toolbar ala Dei */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-5 rounded-full bg-zinc-100/90 border border-zinc-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyMyChores(!onlyMyChores)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              onlyMyChores
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200"
            }`}
          >
            {onlyMyChores ? "★ Kerja Saya Sahaja" : "Semua Kerja"}
          </button>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="bg-white border border-zinc-200 rounded-full px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="all">Semua Ahli</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-zinc-200 rounded-full px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="all">Semua Port</option>
            <option value="kitchen">Dapur</option>
            <option value="cleaning">Kemas / Lap</option>
            <option value="laundry">Basuh Baju</option>
            <option value="outdoor">Laman</option>
            <option value="groceries">Barang Dapur</option>
            <option value="maintenance">Repair</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-white border border-zinc-200 rounded-full px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="all">Semua Urgency</option>
            <option value="urgent">Urgent</option>
            <option value="high">Penting</option>
            <option value="medium">Biasa</option>
            <option value="low">Santai</option>
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-semibold">
          <span className="font-bold text-zinc-900">{filteredChores.length}</span> tugasan aktif
        </div>
      </div>

      {/* Grid Kolum Tugasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start w-full">
        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-[#f8fafc] rounded-[28px] p-3 sm:p-3.5 border border-zinc-200/80 flex flex-col min-h-[480px] w-full overflow-hidden"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-200/60 px-1">
              <h3 className="font-black text-xs uppercase tracking-wider text-zinc-800 truncate pr-1">
                {col.title}
              </h3>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full shrink-0 ${col.badgeColor}`}>
                {col.items.length}
              </span>
            </div>

            {/* Chores Stack */}
            <div className="space-y-2.5 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
              {col.items.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-300 rounded-2xl">
                  <p className="text-xs text-zinc-400">Tiada tugasan di sini.</p>
                </div>
              ) : (
                col.items.map((chore) => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    users={users}
                    currentUser={currentUser}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
