// src/app/api/teli/calls/[id]/route.ts
import { NextResponse } from "next/server";
import { getCallDetails } from "@/lib/teli-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const callData = await getCallDetails(id);

    return NextResponse.json({ success: true, call: callData });
  } catch (error) {
    console.error("Error fetching call details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch call details" },
      { status: 500 }
    );
  }
}