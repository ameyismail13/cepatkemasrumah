// ============================================================================
// FAIL: proxy.js (Pengganti middleware.js dalam Next.js 16)
// KONSEP: Route Guard yang melindungi laluan `/dashboard` dan `/api/chores`
// ============================================================================

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "cepat-kemas-rumah-secret-key-super-safe-2026"
);
const COOKIE_NAME = "cepat_kemas_session";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValidSession = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Jika pengguna sudah log masuk dan cuba buka /login atau /, hantar ke /dashboard
  if (pathname === "/login" || pathname === "/") {
    if (isValidSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Laluan dilindungi: /dashboard & /api/chores
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/chores")) {
    if (!isValidSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/api/chores/:path*"],
};

