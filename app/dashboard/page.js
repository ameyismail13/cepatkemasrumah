// ============================================================================
// FAIL: app/dashboard/page.js
// KONSEP: Server Component (`async`) yang mengambil data dari TiDB Database
//         secara terus di server dan menyemak sesi master & ahli
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser, getMasterSession } from "@/lib/auth";
import { getUsers, getChores, getActivityLogs, getRewards } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const master = await getMasterSession();
  if (!master) {
    redirect("/master-login");
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  // Pastikan profil ahli sepadan dengan keluarga master
  if (currentUser.familyId && currentUser.familyId !== master.id) {
    redirect("/login");
  }

  const [users, chores, activityLogs, rewards] = await Promise.all([
    getUsers(master.id),
    getChores(master.id),
    getActivityLogs(master.id),
    getRewards(master.id),
  ]);

  return (
    <DashboardClient
      currentUser={currentUser}
      family={master}
      users={users}
      chores={chores}
      activityLogs={activityLogs}
      rewards={rewards}
    />
  );
}

