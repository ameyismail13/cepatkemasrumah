// ============================================================================
// FAIL: app/api/chores/[id]/route.js
// RUJUKAN LAB: api-lab10/app/api/tasks/[id]/route.js (Dynamic API Route Handlers)
// KONSEP: PUT (Kemas kini Tugasan) & DELETE (Padam Tugasan) menggunakan `await params`
// ============================================================================

import { NextResponse } from "next/server";
import { updateChore, deleteChore } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateChore(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not update chore" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteChore(id);
    if (!deleted) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chore deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not delete chore" },
      { status: 500 }
    );
  }
}

