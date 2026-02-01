// src/app/api/teli/agent/route.ts
import { NextResponse } from "next/server";
import { updateAgent } from "@/lib/teli-api";

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const result = await updateAgent(updates);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update agent" },
      { status: 500 }
    );
  }
}