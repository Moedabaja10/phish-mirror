// src/app/api/teli/stats/route.ts
import { NextResponse } from "next/server";
import { getCalls, isScamCall } from "@/lib/teli-api";

export async function GET() {
  try {
    const calls = await getCalls(100); // Get last 100 calls for stats

    const totalCalls = calls.length;
    const scamCalls = calls.filter(isScamCall).length;
    const legitimateCalls = totalCalls - scamCalls;
    const scamDetectionRate = totalCalls > 0 ? (scamCalls / totalCalls) * 100 : 0;

    const totalDuration = calls.reduce((sum, call) => sum + call.duration_ms, 0);
    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalCalls,
        scamCalls,
        legitimateCalls,
        scamDetectionRate: Math.round(scamDetectionRate * 10) / 10,
        avgDuration: Math.round(avgDuration / 1000), // Convert to seconds
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}