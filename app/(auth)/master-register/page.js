// ============================================================================
// FAIL: app/(auth)/master-register/page.js
// KONSEP: Master Family Register Page (Pendaftaran Akaun Induk Keluarga)
// Input: Nama, Nama Family, Email, Password
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registerMasterAction } from "@/app/actions/master-auth-actions";
import { Users, Lock, Mail, User, ArrowRight, Sparkles } from "lucide-react";

export default function MasterRegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);

    startTransition(async () => {
      const res = await registerMasterAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#d6eefb] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md dei-tablet-frame p-2 sm:p-3 shadow-2xl">
        {/* Top Header */}
        <div className="bg-[#0d0f11] text-white px-8 py-5 rounded-t-[36px] flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tight text-white select-none">
              Cepat Kemas Rumah!
            </span>
          </div>
          <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
            Daftar Famili
          </span>
        </div>

        {/* White Screen Canvas */}
        <div className="bg-white rounded-b-[36px] p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              Daftar Akaun Keluarga
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Cipta profil keluarga untuk mula mengurus tugasan dan ganjaran anak-anak.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                Nama Anda (Ketua Keluarga) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="cth: Azman, Siti, Papa"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                Nama Keluarga (Family Name) *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="familyName"
                  required
                  placeholder="cth: Famili Azman, Rumah Bahagia"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="cth: azman@gmail.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimum 6 aksara"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full py-3 px-4 rounded-full font-black text-sm bg-zinc-950 hover:bg-zinc-800 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <span>{isPending ? "Mendaftar..." : "Cipta Akaun Keluarga"}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <p className="text-xs text-zinc-500">
              Dah ada akaun keluarga?{" "}
              <Link
                href="/master-login"
                className="font-black text-purple-700 hover:underline"
              >
                Log Masuk Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

