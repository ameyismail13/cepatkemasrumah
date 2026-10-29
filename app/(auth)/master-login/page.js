// ============================================================================
// FAIL: app/(auth)/master-login/page.js
// KONSEP: Master Family Login Page (Akaun Induk Keluarga)
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { loginMasterAction } from "@/app/actions/master-auth-actions";
import { Home, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function MasterLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);

    startTransition(async () => {
      const res = await loginMasterAction(formData);
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
            Master Login
          </span>
        </div>

        {/* White Screen Canvas */}
        <div className="bg-white rounded-b-[36px] p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Home className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              Akaun Induk Keluarga
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Log masuk akaun ketua keluarga untuk mengakses kiosk dan papan tugasan famili anda.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Email Akaun Keluarga
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="cth: papa@famili.com"
                  defaultValue=""
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  defaultValue=""
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>
            </div>

            {/* <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Demo Family Login:</span>
              <span className="font-mono font-bold text-purple-700">demo@famili.com / 123456</span>
            </div> */}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 rounded-full font-black text-sm bg-zinc-950 hover:bg-zinc-800 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <span>{isPending ? "Mengesahkan..." : "Buka Kiosk Keluarga"}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <p className="text-xs text-zinc-500">
              Belum ada akaun keluarga?{" "}
              <Link
                href="/master-register"
                className="font-black text-purple-700 hover:underline"
              >
                Daftar Keluarga Baru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

