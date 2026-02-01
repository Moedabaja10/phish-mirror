// src/app/api/teli/calls/route.ts
import { NextResponse } from "next/server";
import { getCalls } from "@/lib/teli-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const calls = await getCalls(limit);

    return NextResponse.json({ success: true, calls });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}