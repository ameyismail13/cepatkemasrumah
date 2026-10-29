// ============================================================================
// FAIL: app/page.js
// KONSEP: Root Route ("/") — Semak sesi pengguna dan redirect ke /dashboard atau /login
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser, getMasterSession } from "@/lib/auth";

export default async function Home() {
  const master = await getMasterSession();
  if (!master) {
    redirect("/master-login");
  }

  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}

