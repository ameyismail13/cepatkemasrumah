// ============================================================================
// FAIL: lib/auth/index.js
// KONSEP: Pengurusan Sesi Dwi-Peringkat:
// 1. Master Family Session (Cookie: master_family_session)
// 2. Family Member Profile Session (Cookie: cepat_kemas_session)
// ============================================================================

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUserById, getFamilyById } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "cepat-kemas-rumah-secret-key-super-safe-2026"
);

const MASTER_COOKIE = "master_family_session";
const MEMBER_COOKIE = "cepat_kemas_session";

// ----------------------------------------------------------------------------
// 1. MASTER FAMILY SESSION (Akaun Induk Keluarga)
// ----------------------------------------------------------------------------

export async function createMasterSessionCookie(payload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(MASTER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 hari
  });

  return token;
}

export async function getMasterSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MASTER_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload?.familyId) return null;

    const family = await getFamilyById(payload.familyId);
    return family || null;
  } catch (err) {
    return null;
  }
}

export async function logoutMaster() {
  const cookieStore = await cookies();
  cookieStore.delete(MASTER_COOKIE);
  cookieStore.delete(MEMBER_COOKIE);
}

// ----------------------------------------------------------------------------
// 2. MEMBER PROFILE SESSION (Profil Ahli Tablet Kiosk)
// ----------------------------------------------------------------------------

export async function createSessionCookie(payload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return token;
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE)?.value;
    if (!token) return null;

    const session = await verifySessionToken(token);
    if (!session?.userId) return null;

    return await getUserById(session.userId);
  } catch (err) {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(MEMBER_COOKIE);
}

export function verifyPin(rawPin, pinHash) {
  return bcrypt.compareSync(rawPin, pinHash);
}

export function verifyPassword(rawPassword, passwordHash) {
  return bcrypt.compareSync(rawPassword, passwordHash);
}
