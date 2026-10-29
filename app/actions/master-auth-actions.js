// ============================================================================
// FAIL: app/actions/master-auth-actions.js
// KONSEP: Server Actions untuk Pendaftaran & Log Masuk Master Family Account
// ============================================================================

"use server";

import { redirect } from "next/navigation";
import { createFamily, getFamilyByEmail } from "@/lib/db";
import {
  createMasterSessionCookie,
  verifyPassword,
  logoutMaster,
} from "@/lib/auth";

export async function registerMasterAction(formData) {
  const name = (formData.get("name") || "").toString().trim();
  const familyName = (formData.get("familyName") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString();

  if (!name || !familyName || !email || !password) {
    return { error: "Semua ruangan (Nama, Nama Keluarga, Email, Password) wajib diisi." };
  }

  if (password.length < 6) {
    return { error: "Password mestilah sekurang-kurangnya 6 aksara." };
  }

  // Semak jika email sudah didaftarkan
  const existing = await getFamilyByEmail(email);
  if (existing) {
    return { error: "Email ini telah digunakan. Sila gunakan email lain atau log masuk terus." };
  }

  try {
    const family = await createFamily({
      name,
      familyName,
      email,
      password,
    });

    // Cipta sesi master cookie
    await createMasterSessionCookie({
      familyId: family.id,
      familyName: family.familyName,
      email: family.email,
    });
  } catch (err) {
    console.error("Gagal daftar master account:", err);
    return { error: "Alamak, ralat semasa mendaftar keluarga. Sila cuba sebentar lagi." };
  }

  redirect("/login");
}

export async function loginMasterAction(formData) {
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString();

  if (!email || !password) {
    return { error: "Sila masukkan email dan password akaun keluarga anda." };
  }

  const family = await getFamilyByEmail(email);
  if (!family) {
    return { error: "Akaun keluarga dengan email ini tidak ditemui. Sila daftar akaun baru." };
  }

  const isMatch = verifyPassword(password, family.passwordHash);
  if (!isMatch) {
    return { error: "Password salah! Sila semak semula password anda." };
  }

  await createMasterSessionCookie({
    familyId: family.id,
    familyName: family.familyName,
    email: family.email,
  });

  redirect("/login");
}

export async function logoutMasterAction() {
  await logoutMaster();
  redirect("/master-login");
}

