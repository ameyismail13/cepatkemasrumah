// ============================================================================
// FAIL: app/(auth)/login/LoginClient.js
// KONSEP: Greenish Theme - Moden, Bersih & Elegan
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { loginAction, createUserAction } from "@/app/actions/auth-actions";
import UserAvatar from "@/components/UserAvatar";
import { ShieldCheck, KeyRound, CheckCircle2, UserPlus, X, Sparkles } from "lucide-react";

const AVATAR_COLORS = [
  "#2e6945", // Greenish signature
  "#1f4b33", // Deep Forest
  "#f59e0b", // Amber/Gold
  "#3b82f6", // Sky Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Coral Red
  "#14b8a6", // Teal
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
    <div className="min-h-screen bg-[#d6e2d8] flex items-center justify-center p-4 sm:p-8">
      {/* Container Kad Utama Greenish */}
      <div className="w-full max-w-4xl greenish-mainCard p-6 sm:p-10 border border-white/70 shadow-2xl rounded-[36px] bg-[#eaf1eb]">
        {/* Top Header Banner Greenish */}
        <div className="greenish-hero-banner p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 font-black text-2xl shadow-inner">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Cepat Kemas Rumah!
                </h1>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Kemas rumah rasa tenang macam taman santai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span>Sistem Onz</span>
          </div>
        </div>

        {/* Bahagian Pemilihan Ahli & Keypad */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Kolum Kiri: Pilihan Ahli */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-wider uppercase text-[#1e3d2b] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2e6945]" /> Pilih Siapa Yang Nak Masuk
              </h2>
              {/* Sesuai arahan: hanya di sini ada + Daftar Ahli */}
              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className="text-xs font-bold text-[#2e6945] hover:text-[#1e4b33] bg-[#dbe8de] hover:bg-[#cde0d1] px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                + Daftar Ahli
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto p-1.5 -m-1.5">
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
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 relative cursor-pointer ${
                      isSelected
                        ? "bg-[#ffffff] border-[#2e6945] shadow-md shadow-[#2e6945]/15 ring-2 ring-[#2e6945]"
                        : "bg-white/70 border-[#cfe0d4] hover:bg-white hover:border-[#9ebd9d]"
                    }`}
                  >
                    {/* Default person avatar dengan warna tersendiri */}
                    <UserAvatar
                      name={u.name}
                      colorTheme={u.colorTheme || "#2e6945"}
                      size={40}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-sm text-[#183123] truncate">
                          {u.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#2e6945] shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#e8f1ea] text-[#295b3d] shrink-0">
                          {u.role === "admin" ? "Kapten" : "Member"}
                        </span>
                        <span className="text-xs font-black text-[#2e6945] truncate">
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
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-[#cfe0d4] shadow-sm flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#eaf4ec] border border-[#cfe2d3] flex items-center justify-center text-[#2e6945] mb-2 shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-[#183123] text-center">
              Masukkan PIN {selectedUser?.name?.split(" ")[0]}
            </h3>
            <p className="text-xs text-[#52705d] mb-4 text-center">
              4 digit kod rahsia
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
                        ? "bg-[#2e6945] border-[#1e4b33] scale-125 shadow-sm"
                        : "border-[#b8cfbf] bg-[#eef5f0]"
                    }`}
                  />
                );
              })}
            </div>

            {error && (
              <div className="mb-4 text-xs text-rose-700 font-semibold text-center bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl w-full">
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
                  className="h-11 rounded-xl bg-[#f2f7f3] hover:bg-[#e1ece3] active:scale-95 border border-[#d8e7dc] text-base font-bold text-[#1a3826] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-11 rounded-xl bg-white hover:bg-[#f0f4f1] active:scale-95 border border-[#d8e7dc] text-xs text-[#557560] font-bold transition-all flex items-center justify-center cursor-pointer"
              >
                Padam
              </button>
              <button
                type="button"
                onClick={() => handlePinClick("0")}
                className="h-11 rounded-xl bg-[#f2f7f3] hover:bg-[#e1ece3] active:scale-95 border border-[#d8e7dc] text-base font-bold text-[#1a3826] transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-11 rounded-xl bg-white hover:bg-rose-50 active:scale-95 border border-[#d8e7dc] text-xs text-[#557560] hover:text-rose-600 transition-all flex items-center justify-center font-bold cursor-pointer"
              >
                ⌫
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || pin.length !== 4}
              className="mt-5 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 bg-[#2e6945] hover:bg-[#255638] text-white shadow-md shadow-[#2e6945]/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? "Tengah check PIN..."
                : `Masuk Dashboard (${selectedUser?.name?.split(" ")[0]})`}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Ahli Baru (+ Daftar Ahli) */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2d4] shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5efe7]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] border border-[#cfe2d3] flex items-center justify-center text-[#2e6945]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#183123]">
                    Daftar Ahli Keluarga Baru
                  </h3>
                  <p className="text-xs text-[#5b7866]">
                    Pilih nama, PIN & warna avatar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#f0f4f1] text-[#637d6d] hover:text-[#183123] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addUserError && (
              <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                {addUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                  Nama Ahli *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="cth: Kakak, Abang, Tok Mama"
                  className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3.5 py-2.5 text-sm text-[#183123] placeholder-[#8ea897] focus:outline-none focus:border-[#2e6945]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                    Peranan
                  </label>
                  <select
                    name="role"
                    defaultValue="member"
                    className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2.5 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945]"
                  >
                    <option value="member">Member Biasa</option>
                    <option value="admin">Kapten / Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-1.5">
                    PIN (4-Digit) *
                  </label>
                  <input
                    type="text"
                    name="pin"
                    maxLength={4}
                    defaultValue="1234"
                    required
                    placeholder="1234"
                    className="w-full bg-[#f6f9f6] border border-[#cfe2d4] rounded-xl px-3 py-2.5 text-xs text-[#183123] focus:outline-none focus:border-[#2e6945] font-mono text-center tracking-widest font-bold"
                  />
                </div>
              </div>

              {/* Pilihan Warna Avatar (Default Person Look & Feel) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#355240] mb-2">
                  Pilih Warna Avatar Default
                </label>
                <div className="flex items-center gap-3">
                  <UserAvatar
                    colorTheme={selectedColor}
                    size={48}
                    className="ring-2 ring-[#2e6945]"
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
                            ? "ring-3 ring-[#183123] scale-110"
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
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#577261] hover:bg-[#f0f5f1] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAddingPending}
                  className="px-5 py-2.5 rounded-xl bg-[#2e6945] hover:bg-[#255638] text-white font-bold text-xs shadow-md shadow-[#2e6945]/20 cursor-pointer disabled:opacity-50"
                >
                  {isAddingPending ? "Tengah simpan..." : "Simpan Ahli Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
