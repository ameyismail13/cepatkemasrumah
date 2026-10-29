// ============================================================================
// FAIL: components/RewardsView.js
// KONSEP: Dei Theme Full Rewards Catalog View
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { claimRewardAction } from "@/app/actions/chore-actions";
import confetti from "canvas-confetti";
import { Gift, Sparkles, Film, Coffee, Utensils, Award } from "lucide-react";

export default function RewardsView({ rewards, currentUser }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case "Film":
        return <Film className="w-6 h-6 text-sky-600" />;
      case "Utensils":
        return <Utensils className="w-6 h-6 text-purple-600" />;
      case "Coffee":
        return <Coffee className="w-6 h-6 text-amber-600" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-pink-600" />;
      default:
        return <Award className="w-6 h-6 text-emerald-600" />;
    }
  };

  const handleClaim = (reward) => {
    if (currentUser.points < reward.cost) {
      setMessage({
        text: `Mata tak cukup lagi! Kena ada ${reward.cost} mata (Mata anda: ${currentUser.points}).`,
        error: true,
      });
      return;
    }

    if (!confirm(`Tebus ganjaran "${reward.title}" menggunakan ${reward.cost} mata?`)) return;

    startTransition(async () => {
      const res = await claimRewardAction(reward.id);
      if (res?.error) {
        setMessage({ text: res.error, error: true });
      } else {
        setMessage({
          text: `Tahniah! Berjaya tebus "${reward.title}"! 🎉`,
          error: false,
        });
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-[32px] bg-[#f8fafc] border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-zinc-900 border border-zinc-200 flex items-center justify-center shadow-xs">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
              Kolam Ganjaran & Pas Famili 🎁
            </h2>
            <p className="text-xs text-zinc-500">
              Kumpul mata daripada tugas selesai dan tebus ganjaran seronok
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Baki Mata {currentUser.name.split(" ")[0]}
            </span>
            <div className="text-2xl font-black text-purple-700 leading-tight">
              {currentUser.points}{" "}
              <span className="text-xs font-bold text-zinc-400">pts</span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between gap-3 ${
            message.error
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Grid Hadiah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map((reward, idx) => {
          const canAfford = currentUser.points >= reward.cost;
          const cardStyle =
            idx === 0
              ? "dei-pastel-cyan"
              : idx === 1
              ? "dei-pastel-purple"
              : idx === 2
              ? "dei-pastel-yellow"
              : "dei-pastel-green";

          return (
            <div
              key={reward.id}
              className={`rounded-[28px] p-5 border transition-all flex flex-col justify-between shadow-xs ${cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-3 rounded-2xl bg-white/70 border border-black/5 shadow-2xs">
                    {getRewardIcon(reward.icon)}
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white/80 shadow-2xs">
                    {reward.cost} pts
                  </span>
                </div>

                <h3 className="font-black text-base tracking-tight mb-1.5 leading-snug">
                  {reward.title}
                </h3>
                <p className="text-xs opacity-85 leading-relaxed mb-4">
                  {reward.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleClaim(reward)}
                disabled={isPending || !canAfford}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  canAfford
                    ? "bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95"
                    : "bg-black/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {canAfford ? "Tebus Hadiah Ni" : `Kurang ${reward.cost - currentUser.points} mata`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
