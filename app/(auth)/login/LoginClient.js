// ============================================================================
// FAIL: app/(auth)/login/LoginClient.js
// KONSEP: Dei Theme Login Screen (Clean Tablet Bezel + Pastel Touches)
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { loginAction, createUserAction } from "@/app/actions/auth-actions";
import UserAvatar from "@/components/UserAvatar";
import PrayerTimeWidget from "@/components/PrayerTimeWidget";
import { ShieldCheck, KeyRound, CheckCircle2, UserPlus, X, Sparkles } from "lucide-react";

const AVATAR_COLORS = [
  "#3b82f6", // Sky Blue (Dei default)
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Coral Red
  "#14b8a6", // Teal
  "#18181b", // Midnight
];

export default function LoginClient({ users }) {
  const [selectedUser, setSelectedUser] = useState(users[0] || null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Tambah Ahli Baru (+ Daftar Ahli)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddingPending, startAddUserTransition] = useTransition();
  const [addUserError, setAddUserError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  const handlePinClick = (digit) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUser) return;
    if (pin.length !== 4) {
      setError("Tekan la cukup-cukup 4 digit PIN tu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("userId", selectedUser.id);
    formData.append("pin", pin);

    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setPin("");
      }
    } catch (err) {
      if (err?.message?.includes("NEXT_REDIRECT")) return;
      setError("Adoi ada problem masa nak login. Cuba try lagi sekali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("colorTheme", selectedColor);
    setAddUserError(null);

    startAddUserTransition(async () => {
      const res = await createUserAction(formData);
      if (res?.error) {
        setAddUserError(res.error);
      } else {
        setIsAddUserOpen(false);
        if (res?.user) {
          setSelectedUser(res.user);
          setPin("");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#d6eefb] flex items-center justify-center p-4 sm:p-8">
      {/* Outer Tablet Frame (Dei style) */}
      <div className="w-full max-w-4xl dei-tablet-frame p-2 sm:p-3 shadow-2xl">
        {/* Top Black Bar with Brand */}
        <div className="bg-[#0d0f11] text-white px-8 py-5 rounded-t-[36px] flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-white select-none">
              Cepat Kemas Rumah!
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Kiosk Mode</span>
          </div>
        </div>

        {/* White Screen Canvas */}
        <div className="bg-white rounded-b-[36px] p-6 sm:p-10">
          {/* Widget Waktu Solat Auto-Detect Location */}
          <PrayerTimeWidget />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Kolum Kiri: Pilihan Ahli */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black tracking-wider uppercase text-zinc-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Pilih Profil Ahli Famili
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 border border-purple-200"
                >
                  + Daftar Ahli
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto p-1">
                {users.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setPin("");
                        setError(null);
                      }}
                      type="button"
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 relative cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/70 border-purple-400 shadow-md ring-2 ring-purple-300"
                          : "bg-zinc-50 border-zinc-200 hover:bg-white hover:border-zinc-300"
                      }`}
                    >
                      <UserAvatar
                        name={u.name}
                        colorTheme={u.colorTheme || "#3b82f6"}
                        size={42}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-sm text-zinc-900 truncate">
                            {u.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-200/80 text-zinc-700 shrink-0">
                            {u.role === "admin" ? "Kapten" : "Member"}
                          </span>
                          <span className="text-xs font-black text-purple-700 truncate">
                            {u.points} pts
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kolum Kanan: Keypad PIN */}
            <div className="md:col-span-5 bg-[#f8fafc] rounded-3xl p-6 border border-zinc-200 shadow-xs flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-purple-600 mb-2 shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>

              <h3 className="text-base font-black text-zinc-900 text-center">
                Masukkan PIN {selectedUser?.name?.split(" ")[0]}
              </h3>
              <p className="text-xs text-zinc-500 mb-4 text-center">
                4 digit kod keselamatan
              </p>

              {/* Indikator Titik PIN */}
              <div className="flex gap-3 mb-5">
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                        filled
                          ? "bg-zinc-950 border-zinc-950 scale-125 shadow-xs"
                          : "border-zinc-300 bg-white"
                      }`}
                    />
                  );
                })}
              </div>

              {error && (
                <div className="mb-4 text-xs text-rose-700 font-bold text-center bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-2xl w-full">
                  {error}
                </div>
              )}

              {/* Papan Nombor PIN */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[230px]">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinClick(num)}
                    className="h-11 rounded-2xl bg-white hover:bg-zinc-100 active:scale-95 border border-zinc-200 text-base font-black text-zinc-900 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-11 rounded-2xl bg-zinc-100 hover:bg-zinc-200 active:scale-95 border border-zinc-200 text-xs text-zinc-600 font-bold transition-all flex items-center justify-center cursor-pointer"
                >
                  Padam
                </button>
                <button
                  type="button"
                  onClick={() => handlePinClick("0")}
                  className="h-11 rounded-2xl bg-white hover:bg-zinc-100 active:scale-95 border border-zinc-200 text-base font-black text-zinc-900 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-11 rounded-2xl bg-zinc-100 hover:bg-rose-50 active:scale-95 border border-zinc-200 text-xs text-zinc-600 hover:text-rose-600 transition-all flex items-center justify-center font-bold cursor-pointer"
                >
                  ⌫
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting || pin.length !== 4}
                className="mt-5 w-full py-3 px-4 rounded-full font-black text-sm transition-all duration-200 bg-zinc-950 hover:bg-zinc-800 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting
                  ? "Mengesahkan..."
                  : `Masuk Dashboard (${selectedUser?.name?.split(" ")[0]})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Ahli Baru (+ Daftar Ahli) */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-[36px] p-6 sm:p-8 border border-zinc-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-zinc-900 tracking-tight">
                    Daftar Ahli Keluarga Baru
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Pilih nama, PIN & warna avatar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addUserError && (
              <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-2xl font-bold">
                {addUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                  Nama Ahli *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="cth: Kakak, Abang, Tok Mama"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Peranan
                  </label>
                  <select
                    name="role"
                    defaultValue="member"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  >
                    <option value="member">Member Biasa</option>
                    <option value="admin">Kapten / Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    PIN (4-Digit) *
                  </label>
                  <input
                    type="text"
                    name="pin"
                    maxLength={4}
                    defaultValue="1234"
                    required
                    placeholder="1234"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-center tracking-widest font-black"
                  />
                </div>
              </div>

              {/* Pilihan Warna Avatar Default */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-2">
                  Pilih Warna Avatar
                </label>
                <div className="flex items-center gap-3">
                  <UserAvatar
                    colorTheme={selectedColor}
                    size={48}
                    className="ring-3 ring-zinc-900"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full transition-all cursor-pointer shadow-xs ${
                          selectedColor === c
                            ? "ring-3 ring-zinc-900 scale-110"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAddingPending}
                  className="px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
                >
                  {isAddingPending ? "Menyimpan..." : "Simpan Ahli Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
