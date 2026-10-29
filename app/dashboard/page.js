// ============================================================================
// FAIL: app/dashboard/page.js
// KONSEP: Server Component (`async`) yang mengambil data dari JSON Store
//         secara terus di server dan menyemak sesi log masuk pengguna
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUsers, getChores, getActivityLogs, getRewards } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const [users, chores, activityLogs, rewards] = await Promise.all([
    getUsers(),
    getChores(),
    getActivityLogs(),
    getRewards(),
  ]);

  return (
    <DashboardClient
      currentUser={currentUser}
      users={users}
      chores={chores}
      activityLogs={activityLogs}
      rewards={rewards}
    />
  );
}

