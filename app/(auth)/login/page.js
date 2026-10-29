// ============================================================================
// FAIL: app/(auth)/login/page.js
// KONSEP: Server Component yang membaca senarai pengguna dari `data/users.json`
// ============================================================================

import { redirect } from "next/navigation";
import { getUsers } from "@/lib/db";
import { getCurrentUser, getMasterSession } from "@/lib/auth";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const master = await getMasterSession();
  if (!master) {
    redirect("/master-login");
  }

  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard");
  }

  const users = await getUsers(master.id);
  return <LoginClient users={users} family={master} />;
}

