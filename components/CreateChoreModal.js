// ============================================================================
// FAIL: components/CreateChoreModal.js
// KONSEP: Greenish Theme Create Chore Modal
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { createChoreAction } from "@/app/actions/chore-actions";
import { X, Plus } from "lucide-react";

export default function CreateChoreModal({ users, currentUser, onClose }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createChoreAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2d4] shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5efe7]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] border border-[#cfe2d3] flex items-center justify-center text-[#2e6945]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#183123]">
                Tambah Kerja Rumah Baru
              </h3>
              <p className="text-xs text-[#52705d]">
                Bagi tugasan kat famili biar rumah maintain bersih & segar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#f0f4f1] text-[#637d6d] hover:text-[#183123] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
            {error}
          </div>
        )}

        {/* Borang Tugasan */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
              Tajuk Tugasan *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="cth: Basuh Pinggan Dapur, Siram Pokok Hiasan"
              className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3.5 py-2.5 text-sm text-[#183123] placeholder-[#8ea897] focus:outline-none focus:border-[#2e6945]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
              Nota / Pesanan Tambahan
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="cth: Pastikan lap permukaan meja & susun cawan kemas."
              className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3.5 py-2.5 text-sm text-[#183123] placeholder-[#8ea897] focus:outline-none focus:border-[#2e6945]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                Port Kerja (Kategori)
              </label>
              <select
                name="category"
                defaultValue="cleaning"
                className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
              >
                <option value="cleaning">Kemas / Lap</option>
                <option value="kitchen">Dapur & Singki</option>
                <option value="laundry">Basuh / Lipat Baju</option>
                <option value="outdoor">Luar Rumah / Pokok</option>
                <option value="groceries">Beli Barang Dapur</option>
                <option value="maintenance">Tukang / Repair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                Urgency (Keutamaan)
              </label>
              <select
                name="priority"
                defaultValue="medium"
                className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
              >
                <option value="urgent">Kecemasan / Kena Buat Segera!</option>
                <option value="high">Penting Hari Ni</option>
                <option value="medium">Biasa Je</option>
                <option value="low">Santai-santai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                Siapa Kena Buat?
              </label>
              <select
                name="assignedToId"
                defaultValue=""
                className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
              >
                <option value="">Sesiapa Yang Rajin (Terbuka)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role === "admin" ? "Kapten" : "Member"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                Ulangan Automatik
              </label>
              <select
                name="recurrence"
                defaultValue="none"
                className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
              >
                <option value="none">Sekali Je</option>
                <option value="daily">Ulang Setiap Hari</option>
                <option value="weekly">Ulang Seminggu Sekali</option>
                <option value="monthly">Ulang Sebulan Sekali</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                Ganjaran Point (Mata)
              </label>
              <input
                type="number"
                name="pointValue"
                min={5}
                max={500}
                defaultValue={25}
                className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                Tarikh Kena Siap (Due Date)
              </label>
              <input
                type="date"
                name="dueDate"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e5efe7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#577261] hover:bg-[#f0f5f1] transition-all cursor-pointer"
            >
              Batal Je
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-[#2e6945] hover:bg-[#255638] text-white font-bold text-xs shadow-md shadow-[#2e6945]/20 cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Tengah Cipta..." : "Confirm Tambah Tugasan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
