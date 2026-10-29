// ============================================================================
// FAIL: lib/auth/index.js
// KONSEP: Pengurusan Sesi (HTTP-only Cookie JWT) & Pengesahan PIN (bcryptjs)
// ============================================================================

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "cepat-kemas-rumah-secret-key-super-safe-2026"
);
const COOKIE_NAME = "cepat_kemas_session";

export async function createSessionCookie(payload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
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
    const token = cookieStore.get(COOKIE_NAME)?.value;
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
  cookieStore.delete(COOKIE_NAME);
}

export function verifyPin(rawPin, pinHash) {
  return bcrypt.compareSync(rawPin, pinHash);
}

