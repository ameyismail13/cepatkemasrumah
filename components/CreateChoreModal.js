// ============================================================================
// FAIL: components/CreateChoreModal.js
// KONSEP: Dei Theme Create Chore Modal
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { createChoreAction } from "@/app/actions/chore-actions";
import { X, Plus, Sparkles } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-[36px] p-6 sm:p-8 border border-zinc-200 shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-zinc-900 tracking-tight">
                Tambah Kerja Rumah Baru
              </h3>
              <p className="text-xs text-zinc-500">
                Susun tugasan ke dalam pelan kemas famili
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-2xl font-semibold">
            {error}
          </div>
        )}

        {/* Borang Tugasan */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
              Tajuk Tugasan *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="cth: Basuh Pinggan Dapur, Sapu Ruang Tamu"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
              Nota / Penerangan
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="cth: Pastikan lap permukaan meja dan singki sekali."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Port Kerja (Kategori)
              </label>
              <select
                name="category"
                defaultValue="cleaning"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
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
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Urgency (Keutamaan)
              </label>
              <select
                name="priority"
                defaultValue="medium"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
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
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Ditugaskan Kepada
              </label>
              <select
                name="assignedToId"
                defaultValue=""
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                <option value="">Sesiapa Sahaja (Terbuka)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role === "admin" ? "Kapten" : "Member"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Ulangan
              </label>
              <select
                name="recurrence"
                defaultValue="none"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                <option value="none">Sekali Sahaja</option>
                <option value="daily">Setiap Hari</option>
                <option value="weekly">Seminggu Sekali</option>
                <option value="monthly">Sebulan Sekali</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Mata Ganjaran (Point)
              </label>
              <input
                type="number"
                name="pointValue"
                min={5}
                max={500}
                defaultValue={25}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Tarikh Akhir (Due Date)
              </label>
              <input
                type="date"
                name="dueDate"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
            >
              {isPending ? "Menyimpan..." : "Confirm Tambah Tugasan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
