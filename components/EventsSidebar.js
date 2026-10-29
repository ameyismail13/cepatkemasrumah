// ============================================================================
// FAIL: components/EventsSidebar.js
// KONSEP: Dei Theme "My Events 🧐" Right Panel (Webinar, Lesson, Task sticky cards)
// ============================================================================

"use client";

import { useTransition } from "react";
import { claimRewardAction } from "@/app/actions/chore-actions";
import confetti from "canvas-confetti";
import { Sparkles, Gift, Film, Coffee, Utensils, Award } from "lucide-react";

export default function EventsSidebar({ rewards, currentUser, activityLogs }) {
  const [isPending, startTransition] = useTransition();

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case "Film":
        return <Film className="w-4 h-4 text-sky-600" />;
      case "Utensils":
        return <Utensils className="w-4 h-4 text-purple-600" />;
      case "Coffee":
        return <Coffee className="w-4 h-4 text-amber-600" />;
      default:
        return <Award className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleClaim = (reward) => {
    if (currentUser.points < reward.cost) {
      alert(`Mata tak cukup lagi! Perlukan ${reward.cost} mata (Mata anda: ${currentUser.points}).`);
      return;
    }
    if (!confirm(`Tebus ganjaran "${reward.title}" menggunakan ${reward.cost} mata?`)) return;

    startTransition(async () => {
      const res = await claimRewardAction(reward.id);
      if (res?.error) {
        alert(res.error);
      } else {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    });
  };

  return (
    <div className="bg-[#f8fafc] rounded-[36px] p-6 border border-zinc-200/80 flex flex-col gap-5 h-full">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
          Ganjaran Famili 🧐
        </h2>
        <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
          {currentUser.points} pts
        </span>
      </div>

      <p className="text-xs text-zinc-500 -mt-2">
        Kumpul mata hasil kemas rumah dan tebus pas istimewa di bawah:
      </p>

      {/* Pastel Cards Stack ala My Events */}
      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
        {rewards.map((reward, idx) => {
          const canAfford = currentUser.points >= reward.cost;
          // Alternate pastel styles
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
              className={`rounded-3xl p-4.5 border transition-all shadow-xs flex flex-col justify-between ${cardStyle} ${
                canAfford ? "opacity-100" : "opacity-80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                    {getRewardIcon(reward.icon)}
                    <span>Reward #{idx + 1}</span>
                  </div>
                  <span className="text-xs font-black bg-white/70 px-2.5 py-0.5 rounded-full shadow-2xs">
                    {reward.cost} pts
                  </span>
                </div>

                <h4 className="font-black text-sm tracking-tight mb-1">
                  {reward.title}
                </h4>
                <p className="text-xs opacity-85 leading-relaxed mb-3">
                  {reward.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleClaim(reward)}
                disabled={isPending || !canAfford}
                className={`w-full py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                  canAfford
                    ? "bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95"
                    : "bg-black/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {canAfford ? "Tebus Sekarang ✨" : `Perlu ${reward.cost - currentUser.points} pts lagi`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sticky note kecil di bahagian bawah (Importance of teamwork ala mockup) */}
      <div className="rounded-3xl p-4 dei-pastel-green border border-emerald-300 shadow-sm text-xs font-medium leading-relaxed">
        <div className="font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-emerald-900 mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Tips Famili Harmoni
        </div>
        Kerjasama dan komunikasi antara ahli keluarga adalah kunci utama rumah yang sentiasa bersih dan lapang!
      </div>
    </div>
  );
}

