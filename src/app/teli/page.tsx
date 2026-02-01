// src/app/teli/page.tsx
"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/teli/StatsCards";
import { CallCard } from "@/components/teli/CallCard";
import { TeliCall } from "@/lib/teli-api";
import { Button } from "@/components/ui/button";
import { RefreshCw, Phone } from "lucide-react";
import Link from "next/link";

export default function TeliDashboard() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    scamCalls: 0,
    legitimateCalls: 0,
    scamDetectionRate: 0,
    avgDuration: 0,
  });
  const [recentCalls, setRecentCalls] = useState<TeliCall[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch("/api/teli/stats");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch recent calls (limit to 10)
      const callsRes = await fetch("/api/teli/calls?limit=10");
      const callsData = await callsRes.json();
      if (callsData.success) {
        setRecentCalls(callsData.calls);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ProtectorNumber Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered scam call detection
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/teli/settings">
            <Button variant="outline">Settings</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Recent Calls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Calls</h2>
          <Link href="/teli/calls">
            <Button variant="link">View All →</Button>
          </Link>
        </div>

        {recentCalls.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No calls yet</h3>
            <p className="text-muted-foreground">
              Your AI is ready! Call <span className="font-mono">+1 313-351-9574</span> to test it.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentCalls.map((call) => (
              <CallCard key={call.call_id} call={call} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}