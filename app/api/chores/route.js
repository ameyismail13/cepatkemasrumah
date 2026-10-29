// ============================================================================
// FAIL: app/api/chores/route.js
// RUJUKAN LAB: api-lab10/app/api/tasks/route.js (Module 10: Route Handlers)
// KONSEP: GET (Senarai Tugasan) & POST (Cipta Tugasan Baru) dengan NextResponse
// ============================================================================

import { NextResponse } from "next/server";
import { getChores, saveChore } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const chores = await getChores();
    return NextResponse.json(chores);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not read chores" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "title must be a non-empty string" },
        { status: 400 }
      );
    }

    const chore = await saveChore({
      title: body.title.trim(),
      description: body.description || "",
      category: body.category || "cleaning",
      priority: body.priority || "medium",
      recurrence: body.recurrence || "none",
      assignedToId: body.assignedToId || null,
      createdById: user.id,
      pointValue: Number(body.pointValue) || 20,
      dueDate: body.dueDate || new Date().toISOString().split("T")[0],
      status: "todo",
    });

    return NextResponse.json(chore, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not create chore" },
      { status: 500 }
    );
  }
}

