// ============================================================================
// FAIL: components/ChoreCard.js
// KONSEP: Dei Theme Task Card - Padat, Responsif, Tiada Overflow Kiri/Kanan
// ============================================================================

"use client";

import { useTransition } from "react";
import Image from "next/image";
import {
  updateChoreStatusAction,
  deleteChoreAction,
} from "@/app/actions/chore-actions";
import UserAvatar from "@/components/UserAvatar";
import confetti from "canvas-confetti";
import {
  Clock,
  Sparkles,
  Trash2,
  Check,
  Play,
} from "lucide-react";

export default function ChoreCard({ chore, users, currentUser }) {
  const [isPending, startTransition] = useTransition();

  const assignee = users.find((u) => u.id === chore.assignedToId);

  const handleAdvanceStatus = () => {
    let nextStatus = "in_progress";
    if (chore.status === "todo") nextStatus = "in_progress";
    else if (chore.status === "in_progress") {
      nextStatus =
        currentUser.role === "admin" ? "completed" : "pending_approval";
    } else if (chore.status === "pending_approval") {
      nextStatus = "completed";
    }

    if (nextStatus === "completed") {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#d946ef", "#38bdf8", "#facc15", "#4ade80"],
        });
      } catch (e) {}
    }

    startTransition(async () => {
      await updateChoreStatusAction(chore.id, nextStatus);
    });
  };

  const handleDelete = () => {
    if (!confirm(`Padam tugasan "${chore.title}"?`)) return;
    startTransition(async () => {
      await deleteChoreAction(chore.id);
    });
  };

  const isCompleted = chore.status === "completed";
  const isInProgress = chore.status === "in_progress";
  const isPendingApproval = chore.status === "pending_approval";

  return (
    <div
      className={`relative rounded-3xl p-4 transition-all shadow-xs border flex flex-col justify-between w-full overflow-hidden ${
        isInProgress
          ? "dei-pastel-purple shadow-md border-purple-200"
          : isCompleted
          ? "bg-white/70 border-zinc-200 opacity-60"
          : isPendingApproval
          ? "dei-pastel-cyan border-sky-200"
          : "bg-white border-zinc-200/90 hover:border-zinc-300"
      } ${isPending ? "opacity-40 pointer-events-none" : ""}`}
    >
      <div>
        {/* Top Row: Category Pill & Points Badge */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span
            className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full truncate max-w-[100px] ${
              isInProgress
                ? "bg-white/70 text-purple-900 border border-purple-200"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {chore.category === "kitchen" && "Dapur"}
            {chore.category === "cleaning" && "Kemas"}
            {chore.category === "laundry" && "Baju"}
            {chore.category === "outdoor" && "Laman"}
            {chore.category === "groceries" && "Barang Dapur"}
            {chore.category === "maintenance" && "Repair"}
            {!["kitchen", "cleaning", "laundry", "outdoor", "groceries", "maintenance"].includes(chore.category) && chore.category}
          </span>

          <span
            className={`text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 ${
              isInProgress
                ? "bg-white text-purple-900 shadow-2xs"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />+{chore.pointValue}
          </span>
        </div>

        {/* Tajuk & Penerangan */}
        <h3
          className={`font-black text-sm tracking-tight leading-snug break-words ${
            isInProgress
              ? "text-purple-950"
              : isCompleted
              ? "line-through text-zinc-400"
              : "text-zinc-900"
          }`}
        >
          {chore.title}
        </h3>

        {chore.description && (
          <p
            className={`text-[11px] mt-1 line-clamp-2 leading-relaxed break-words ${
              isInProgress ? "text-purple-900/80" : "text-zinc-500"
            }`}
          >
            {chore.description}
          </p>
        )}

        {/* Gambar Bukti jika ada */}
        {chore.verificationImage && (
          <div className="mt-2.5 relative h-24 w-full rounded-2xl overflow-hidden border border-black/10">
            <Image
              src={chore.verificationImage}
              alt="Bukti Selesai"
              fill
              sizes="220px"
              className="object-cover"
            />
            <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-[9px] text-white font-semibold px-2 py-0.5 rounded-md">
              Bukti Bergambar 📸
            </div>
          </div>
        )}
      </div>

      {/* Bahagian Bawah: Status Pill & Action Button */}
      <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Status Badge */}
          {isCompleted && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 truncate">
              Completed 🌿
            </span>
          )}
          {isInProgress && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-purple-900 shadow-2xs flex items-center gap-1 truncate">
              <Clock className="w-2.5 h-2.5 text-purple-700 shrink-0" /> Sedang Dibuat
            </span>
          )}
          {chore.status === "todo" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 truncate">
              Upcoming ⏰
            </span>
          )}
          {isPendingApproval && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 truncate">
              Menunggu Semakan
            </span>
          )}

          {assignee && (
            <div
              className="flex items-center gap-1 bg-white/70 p-0.5 px-1.5 rounded-full border border-black/5 shrink-0"
              title={`Ditugaskan kepada ${assignee.name}`}
            >
              <UserAvatar
                name={assignee.name}
                colorTheme={assignee.colorTheme || "#3b82f6"}
                size={14}
              />
              <span className="text-[9px] font-bold text-zinc-700 truncate max-w-[45px]">
                {assignee.name.split(" ")[0]}
              </span>
            </div>
          )}
        </div>

        {/* Tindakan: Butang Tindakan Kanan */}
        <div className="flex items-center gap-1 shrink-0">
          {currentUser.role === "admin" && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              title="Padam Tugasan"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {!isCompleted && (
            <button
              type="button"
              onClick={handleAdvanceStatus}
              className="w-7 h-7 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-all shrink-0"
              title={
                chore.status === "todo"
                  ? "Mula Buat"
                  : currentUser.role === "admin"
                  ? "Luluskan & Selesai"
                  : "Hantar Semakan"
              }
            >
              {chore.status === "todo" ? (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              ) : (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
