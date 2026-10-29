// ============================================================================
// FAIL: app/actions/chore-actions.js
// KONSEP: Server Actions ("use server") + revalidatePath
// BAHASA: Bahasa Melayu Pasar / Santai
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import {
  getChoreById,
  saveChore,
  updateChore,
  deleteChore,
  updateUserPoints,
  logActivity,
  getRewards,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Kira tarikh seterusnya untuk tugasan berulang
function getNextDueDate(currentDateStr, recurrence) {
  const date = new Date(currentDateStr);
  if (isNaN(date.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  }

  if (recurrence === "daily") {
    date.setDate(date.getDate() + 1);
  } else if (recurrence === "weekly") {
    date.setDate(date.getDate() + 7);
  } else if (recurrence === "monthly") {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString().split("T")[0];
}

export async function createChoreAction(formData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Kena login dulu la wei");
  }

  const title = (formData.get("title") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();
  const category = formData.get("category") || "cleaning";
  const priority = formData.get("priority") || "medium";
  const recurrence = formData.get("recurrence") || "none";
  const assignedToId = formData.get("assignedToId") || null;
  const pointValue = parseInt(formData.get("pointValue") || "20", 10);
  const dueDate =
    formData.get("dueDate") || new Date().toISOString().split("T")[0];

  if (!title) {
    return { error: "Tajuk tugasan jangan la biar kosong bro!" };
  }

  const newChore = await saveChore({
    title,
    description,
    category,
    priority,
    recurrence,
    assignedToId,
    createdById: user.id,
    pointValue,
    dueDate,
    status: "todo",
  });

  await logActivity({
    choreId: newChore.id,
    choreTitle: newChore.title,
    userId: user.id,
    userName: user.name,
    action: "created",
    notes: `Dibuat oleh ${user.name}`,
  });

  revalidatePath("/dashboard");
  return { success: true, chore: newChore };
}

export async function updateChoreStatusAction(
  choreId,
  newStatus,
  verificationImage
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Tak login lagi ni");

  const chore = await getChoreById(choreId);
  if (!chore) throw new Error("Tak jumpa tugasan ni");

  const prevStatus = chore.status;
  const updates = { status: newStatus };

  if (newStatus === "completed" && prevStatus !== "completed") {
    updates.completedAt = new Date().toISOString();

    // Bagi point kat orang yang kena buat
    const targetUserId = chore.assignedToId || user.id;
    await updateUserPoints(targetUserId, chore.pointValue);

    await logActivity({
      choreId: chore.id,
      choreTitle: chore.title,
      userId: user.id,
      userName: user.name,
      action: "completed",
      pointsChanged: chore.pointValue,
      notes: `Setel kemas! Dapat free +${chore.pointValue} mata. Mantap!`,
    });

    // Kalau ada ulangan automatik
    if (chore.recurrence && chore.recurrence !== "none") {
      const nextDue = getNextDueDate(chore.dueDate, chore.recurrence);
      await saveChore({
        title: chore.title,
        description: chore.description,
        category: chore.category,
        priority: chore.priority,
        recurrence: chore.recurrence,
        assignedToId: chore.assignedToId,
        createdById: chore.createdById,
        pointValue: chore.pointValue,
        dueDate: nextDue,
        status: "todo",
      });
    }
  } else if (newStatus === "pending_approval") {
    if (verificationImage) {
      updates.verificationImage = verificationImage;
    }
    await logActivity({
      choreId: chore.id,
      choreTitle: chore.title,
      userId: user.id,
      userName: user.name,
      action: "submitted_approval",
      notes: "Dah siap buat, tengah tunggu mak bapak check & approve.",
    });
  } else if (newStatus === "in_progress") {
    await logActivity({
      choreId: chore.id,
      choreTitle: chore.title,
      userId: user.id,
      userName: user.name,
      action: "started",
      notes: "Tengah buat kerja ni sekarang.",
    });
  }

  await updateChore(choreId, updates);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function assignChoreAction(choreId, assignedToId) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Tak login lagi ni");

  const chore = await getChoreById(choreId);
  if (!chore) throw new Error("Tak jumpa tugasan ni");

  await updateChore(choreId, { assignedToId });

  await logActivity({
    choreId: chore.id,
    choreTitle: chore.title,
    userId: user.id,
    userName: user.name,
    action: "reassigned",
    notes: "Tugasan dah pas kat orang lain.",
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteChoreAction(choreId) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Tak login lagi ni");

  await deleteChore(choreId);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function claimRewardAction(rewardId) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Tak login lagi ni");

  const rewards = await getRewards();
  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward) throw new Error("Tak jumpa reward ni");

  if (user.points < reward.cost) {
    return {
      error: `Poin tak cukup la geng! Nak claim ni perlukan ${reward.cost} mata (Mata kau ada ${user.points} je lagi).`,
    };
  }

  await updateUserPoints(user.id, -reward.cost);

  await logActivity({
    choreTitle: `Hadiah: ${reward.title}`,
    userId: user.id,
    userName: user.name,
    action: "reward_claimed",
    pointsChanged: -reward.cost,
    notes: `Kasi sambar hadiah "${reward.title}"! Tolak ${reward.cost} mata.`,
  });

  revalidatePath("/dashboard");
  return { success: true, reward };
}
