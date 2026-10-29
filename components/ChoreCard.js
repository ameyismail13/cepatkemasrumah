// ============================================================================
// FAIL: components/ChoreCard.js
// KONSEP: Greenish Style Card untuk Tugasan Individu
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
  RotateCcw,
  Sparkles,
  ArrowRight,
  Trash2,
} from "lucide-react";

export default function ChoreCard({ chore, users, currentUser }) {
  const [isPending, startTransition] = useTransition();

  const assignee = users.find((u) => u.id === chore.assignedToId);
  const isMine = chore.assignedToId === currentUser.id;

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
          colors: ["#2e6945", "#fbb839", "#3b82f6", "#10b981"],
        });
      } catch (e) {}
    }

    startTransition(async () => {
      await updateChoreStatusAction(chore.id, nextStatus);
    });
  };

  const handleDelete = () => {
    if (!confirm(`Betul ke nak buang tugasan "${chore.title}" ni?`)) return;
    startTransition(async () => {
      await deleteChoreAction(chore.id);
    });
  };

  const categoryStyles = {
    kitchen: "bg-amber-100 text-amber-800 border-amber-200",
    cleaning: "bg-emerald-100 text-emerald-800 border-emerald-200",
    laundry: "bg-sky-100 text-sky-800 border-sky-200",
    outdoor: "bg-lime-100 text-lime-800 border-lime-200",
    groceries: "bg-purple-100 text-purple-800 border-purple-200",
    maintenance: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const priorityStyles = {
    urgent: "bg-rose-100 text-rose-800 border-rose-200",
    high: "bg-amber-100 text-amber-800 border-amber-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    low: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };

  const isOverdue =
    chore.status !== "completed" &&
    new Date(chore.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      className={`bg-white rounded-2xl p-4 border transition-all shadow-xs hover:shadow-md ${
        chore.status === "completed"
          ? "opacity-60 border-emerald-200 bg-emerald-50/30"
          : isOverdue
          ? "border-rose-300 ring-1 ring-rose-200"
          : "border-[#d8e6dc] hover:border-[#a3cbb0]"
      } ${isPending ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Lencana Kategori & Urgency */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              categoryStyles[chore.category] || categoryStyles.cleaning
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
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              priorityStyles[chore.priority] || priorityStyles.medium
            }`}
          >
            {chore.priority === "urgent" && "Urgent"}
            {chore.priority === "high" && "Penting"}
            {chore.priority === "medium" && "Biasa"}
            {chore.priority === "low" && "Santai"}
          </span>
          {chore.recurrence !== "none" && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#f0f5f1] border border-[#d8e6dc] text-[#50705a] flex items-center gap-1">
              <RotateCcw className="w-2.5 h-2.5" />
              {chore.recurrence === "daily" && "Hari-hari"}
              {chore.recurrence === "weekly" && "Mingguan"}
              {chore.recurrence === "monthly" && "Bulanan"}
            </span>
          )}
        </div>

        {/* Lencana Mata Ganjaran */}
        <span className="text-xs font-black text-[#1b5334] bg-[#eaf4ec] border border-[#cfe2d3] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-[#2e6945]" />+{chore.pointValue}
        </span>
      </div>

      {/* Tajuk & Penerangan */}
      <h4
        className={`font-bold text-sm leading-snug ${
          chore.status === "completed"
            ? "line-through text-zinc-400"
            : "text-[#183123]"
        }`}
      >
        {chore.title}
      </h4>

      {chore.description && (
        <p className="text-xs text-[#52705d] mt-1 line-clamp-2 leading-relaxed">
          {chore.description}
        </p>
      )}

      {/* Gambar Bukti jika ada */}
      {chore.verificationImage && (
        <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-[#cfe2d4]">
          <Image
            src={chore.verificationImage}
            alt="Bukti Selesai"
            fill
            sizes="280px"
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-white font-semibold px-2 py-0.5 rounded-md">
            Gambar Bukti 📸
          </div>
        </div>
      )}

      {/* Bahagian Bawah: Profile & Action Button */}
      <div className="mt-3 pt-3 border-t border-[#edf4ee] space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {assignee ? (
              <div
                className="flex items-center gap-1.5 bg-[#f4f8f5] border border-[#d8e6dc] px-2 py-1 rounded-xl shrink-0"
                title={`Kena buat: ${assignee.name}`}
              >
                <UserAvatar
                  name={assignee.name}
                  colorTheme={assignee.colorTheme || "#2e6945"}
                  size={18}
                />
                <span
                  className={`text-[11px] font-bold truncate max-w-[75px] ${
                    isMine ? "text-[#1b5334]" : "text-[#405e4a]"
                  }`}
                >
                  {assignee.name.split(" ")[0]}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-[#7d9b87] italic shrink-0">
                Sesiapa Je
              </span>
            )}

            <div
              className={`flex items-center gap-1 text-[11px] shrink-0 font-medium ${
                isOverdue ? "text-rose-600 font-bold" : "text-[#62806e]"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{chore.dueDate}</span>
            </div>
          </div>

          {currentUser.role === "admin" && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-all cursor-pointer shrink-0"
              title="Buang tugasan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Butang Tindakan Status */}
        {chore.status !== "completed" && (
          <button
            type="button"
            onClick={handleAdvanceStatus}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-[#2e6945] hover:bg-[#255638] active:scale-[0.98] text-white transition-all cursor-pointer shadow-xs"
          >
            <span>
              {chore.status === "todo" && "Start Buat Sekarang"}
              {chore.status === "in_progress" &&
                (currentUser.role === "admin" ? "Sahkan Dah Setel!" : "Dah Siap! Minta Check")}
              {chore.status === "pending_approval" && "Approve & Bagi Point!"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
