// ============================================================================
// FAIL: app/actions/auth-actions.js
// KONSEP: Next.js Server Actions ("use server") untuk Log Masuk, Log Keluar, & Tambah Ahli Baru
// BAHASA: Bahasa Melayu Pasar / Santai
// ============================================================================

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserById, createUser } from "@/lib/db";
import {
  createSessionCookie,
  logout,
  verifyPin,
  getMasterSession,
} from "@/lib/auth";

export async function loginAction(formData) {
  const userId = formData.get("userId");
  const pin = formData.get("pin");

  if (!userId || !pin) {
    return { error: "Pilih dulu siapa punya profil, lepas tu masukkan 4-digit PIN." };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { error: "Tak jumpa la profil ahli ni." };
  }

  // Sahkan ahli adalah di bawah keluarga master yang sedang aktif
  const master = await getMasterSession();
  if (master && user.familyId !== master.id) {
    return { error: "Profil ini bukan daripada keluarga anda." };
  }

  const isMatch = verifyPin(pin, user.pinHash);
  if (!isMatch) {
    return { error: "Adoi salah PIN bro!" };
  }

  await createSessionCookie({
    userId: user.id,
    familyId: user.familyId,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}

export async function createUserAction(formData) {
  const name = (formData.get("name") || "").toString().trim();
  const role = formData.get("role") || "member";
  const pin = (formData.get("pin") || "1234").toString().trim();
  const colorTheme = formData.get("colorTheme") || "#2e6945";

  if (!name) {
    return { error: "Nama takleh kosong la wei! Letak la nama dulu." };
  }

  if (pin.length !== 4 || isNaN(Number(pin))) {
    return { error: "PIN mesti ngam-ngam 4 digit nombor tau." };
  }

  const master = await getMasterSession();
  const familyId = master?.id || "fam_default";

  try {
    const newUser = await createUser({
      familyId,
      name,
      role,
      pin,
      avatarUrl: "/avatars/avatar-default.svg",
      colorTheme,
    });

    revalidatePath("/login");
    revalidatePath("/dashboard");
    return { success: true, user: newUser };
  } catch (err) {
    console.error("Ralat tambah user:", err);
    return { error: "Alamak, gagal nak daftar ahli baru. Cuba lagi japgi." };
  }
}
