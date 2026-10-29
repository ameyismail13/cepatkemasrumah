// ============================================================================
// FAIL: app/(auth)/login/page.js
// KONSEP: Server Component yang membaca senarai pengguna dari `data/users.json`
// ============================================================================

import { redirect } from "next/navigation";
import { getUsers } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard");
  }

  const users = await getUsers();
  return <LoginClient users={users} />;
}

