// ============================================================================
// FAIL: components/KanbanBoard.js
// KONSEP: Greenish Theme Kanban Board (4 Columns)
// ============================================================================

"use client";

import { useState } from "react";
import ChoreCard from "./ChoreCard";
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

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
      title: "Kena Buat",
      color: "border-sky-300 text-sky-800 bg-sky-100",
      icon: Clock,
      items: filteredChores.filter((c) => c.status === "todo"),
    },
    {
      id: "in_progress",
      title: "Tengah Buat",
      color: "border-amber-300 text-amber-800 bg-amber-100",
      icon: AlertCircle,
      items: filteredChores.filter((c) => c.status === "in_progress"),
    },
    {
      id: "pending_approval",
      title: "Tunggu Check",
      color: "border-purple-300 text-purple-800 bg-purple-100",
      icon: CheckSquare,
      items: filteredChores.filter((c) => c.status === "pending_approval"),
    },
    {
      id: "completed",
      title: "Dah Setel",
      color: "border-emerald-300 text-emerald-800 bg-emerald-100",
      icon: CheckCircle2,
      items: filteredChores.filter((c) => c.status === "completed"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bar Penapisan Greenish */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#d2ddd4] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyMyChores(!onlyMyChores)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              onlyMyChores
                ? "bg-[#2e6945] text-white border-[#2e6945] shadow-xs"
                : "bg-[#f2f7f3] border-[#d8e6dc] text-[#34523e] hover:bg-[#e4efe6]"
            }`}
          >
            {onlyMyChores ? "★ Kerja Aku Sahaja" : "Semua Kerja"}
          </button>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="bg-[#f2f7f3] border border-[#d8e6dc] rounded-xl px-2.5 py-1.5 text-xs text-[#1e3827] focus:outline-none focus:border-[#2e6945]"
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
            className="bg-[#f2f7f3] border border-[#d8e6dc] rounded-xl px-2.5 py-1.5 text-xs text-[#1e3827] focus:outline-none focus:border-[#2e6945]"
          >
            <option value="all">Semua Port</option>
            <option value="kitchen">Dapur</option>
            <option value="cleaning">Kemas / Lap</option>
            <option value="laundry">Basuh Baju</option>
            <option value="outdoor">Laman / Luar</option>
            <option value="groceries">Barang Dapur</option>
            <option value="maintenance">Repair</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#f2f7f3] border border-[#d8e6dc] rounded-xl px-2.5 py-1.5 text-xs text-[#1e3827] focus:outline-none focus:border-[#2e6945]"
          >
            <option value="all">Semua Urgency</option>
            <option value="urgent">Urgent Gila</option>
            <option value="high">Penting</option>
            <option value="medium">Biasa</option>
            <option value="low">Santai</option>
          </select>
        </div>

        <div className="text-xs text-[#52705d] font-semibold">
          Ada <span className="font-bold text-[#1b5334]">{filteredChores.length}</span> tugasan
        </div>
      </div>

      {/* 4 Kolum Kanban Container Greenish */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="bg-[#eef4f0] rounded-3xl p-4 border border-[#d5e2d8] flex flex-col min-h-[500px]"
            >
              {/* Header Kolum */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d8e7dc]">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-xl border flex items-center justify-center ${col.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#1e3827]">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white text-[#2e6945] border border-[#d0e0d4] shadow-2xs">
                  {col.items.length}
                </span>
              </div>

              {/* Senarai Kad Tugasan */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {col.items.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#c9dbce] rounded-2xl">
                    <p className="text-xs text-[#6e8a78]">Kosong lagi bahagian ni.</p>
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
          );
        })}
      </div>
    </div>
  );
}
