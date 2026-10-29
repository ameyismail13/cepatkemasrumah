// ============================================================================
// FAIL: components/RewardsView.js
// KONSEP: Greenish Theme Rewards View
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
        return <Film className="w-6 h-6 text-indigo-600" />;
      case "Utensils":
        return <Utensils className="w-6 h-6 text-rose-600" />;
      case "Coffee":
        return <Coffee className="w-6 h-6 text-amber-600" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-yellow-600" />;
      default:
        return <Award className="w-6 h-6 text-emerald-600" />;
    }
  };

  const handleClaim = (reward) => {
    if (currentUser.points < reward.cost) {
      setMessage({
        text: `Mata kau tak cukup la! Kena ada ${reward.cost} mata (Mata kau ada ${currentUser.points} je lagi).`,
        error: true,
      });
      return;
    }

    if (
      !confirm(
        `Betul nak tebus "${reward.title}" pakai ${reward.cost} mata ni?`
      )
    )
      return;

    startTransition(async () => {
      const res = await claimRewardAction(reward.id);
      if (res?.error) {
        setMessage({ text: res.error, error: true });
      } else {
        setMessage({
          text: `Fuh mantap! Berjaya tebus "${reward.title}"! 🎉 Enjoy ya!`,
          error: false,
        });
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner Baki Mata Greenish */}
      <div className="p-6 rounded-3xl bg-[#eef4f0] border border-[#d5e2d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#2e6945] border border-[#cfe2d4] flex items-center justify-center shadow-xs">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#183123]">
              Port Tebus Hadiah & Reward
            </h2>
            <p className="text-xs text-[#52705d]">
              Kumpul point dari kerja rumah, lepas tu claim reward syok sendiri!
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#d0e0d4] px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#52705d]">
              Baki Mata {currentUser.name.split(" ")[0]}
            </span>
            <div className="text-2xl font-black text-[#1b5334] leading-tight">
              {currentUser.points}{" "}
              <span className="text-xs font-bold text-[#62806e]">pts</span>
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
        {rewards.map((reward) => {
          const canAfford = currentUser.points >= reward.cost;
          return (
            <div
              key={reward.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between bg-white shadow-2xs ${
                canAfford
                  ? "border-[#2e6945]/40 hover:border-[#2e6945] hover:shadow-md"
                  : "border-[#d8e6dc] opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-3 rounded-2xl bg-[#f2f7f3] border border-[#d8e6dc]">
                    {getRewardIcon(reward.icon)}
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#eaf4ec] text-[#2e6945] border border-[#cfe2d3] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#2e6945]" /> {reward.cost} pts
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#183123] mb-1.5 leading-snug">
                  {reward.title}
                </h3>
                <p className="text-xs text-[#52705d] leading-relaxed mb-4">
                  {reward.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleClaim(reward)}
                disabled={isPending || !canAfford}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  canAfford
                    ? "bg-[#2e6945] hover:bg-[#255638] text-white active:scale-95"
                    : "bg-[#f0f4f1] text-[#8ea897] border border-[#d8e6dc] cursor-not-allowed"
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
