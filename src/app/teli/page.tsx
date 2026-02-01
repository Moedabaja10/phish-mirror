// src/app/teli/page.tsx
"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/teli/StatsCards";
import { CallCard } from "@/components/teli/CallCard";
import { TeliCall } from "@/lib/teli-api";
import { Button } from "@/components/ui/button";
import { RefreshCw, Phone, Shield, Activity, TrendingUp, Sparkles } from "lucide-react";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-monitor-500/20 border-b-monitor-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ 
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-monitor-500/10 rounded-full blur-3xl animate-float" 
          style={{ 
            animationDelay: '1s', 
            animationDuration: '4s',
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out'
          }} 
        />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Premium Header */}
      <div className="relative border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="space-y-4 animate-slide-in-up">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
                  <div className="relative p-3 bg-gradient-to-br from-primary/20 to-monitor-500/20 rounded-xl border border-primary/20">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-display font-bold tracking-tight text-white">
                      Call Protection
                    </h1>
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    AI-powered scam call detection & monitoring
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safe-500/10 border border-safe-500/30">
                  <div className="w-2 h-2 rounded-full bg-safe-500 animate-pulse" />
                  <span className="text-sm font-medium text-safe-400">Protection Active</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Your number: <span className="font-mono text-foreground">+1 313-351-9574</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={fetchData}
                className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/40 hover:border-primary/50 transition-all hover-lift group"
              >
                <RefreshCw className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-180 duration-500" />
              </button>
              <Link href="/teli/settings">
                <button className="px-6 py-3 rounded-xl bg-card/50 hover:bg-muted/30 border border-border/40 hover:border-border/60 font-medium transition-all hover-lift">
                  Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Stats Cards */}
        <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <StatsCards stats={stats} />
        </div>

        {/* Recent Calls Section */}
        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-semibold text-white">Recent Activity</h2>
              <p className="text-sm text-muted-foreground mt-1">Latest calls monitored by AI</p>
            </div>
            <Link href="/teli/calls">
              <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary font-medium transition-all hover-lift">
                View All
                <Activity className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {recentCalls.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/40 bg-card/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-monitor-500/5" />
              <div className="relative text-center py-16 px-8">
                <div className="inline-flex p-6 bg-muted/20 rounded-2xl mb-6">
                  <Phone className="w-16 h-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-white">No calls yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your AI protection is ready and waiting
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="font-mono text-primary font-semibold">+1 313-351-9574</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Test it by calling this number
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {recentCalls.map((call, i) => (
                <div 
                  key={call.call_id}
                  className="stagger-item"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CallCard call={call} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-3 gap-6 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass rounded-xl p-6 border border-border/40 hover:border-primary/30 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-safe-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-safe-500" />
              </div>
              <TrendingUp className="w-4 h-4 text-safe-500" />
            </div>
            <div className="text-2xl font-display font-bold text-white mb-1">
              {stats.scamDetectionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Detection Rate</div>
          </div>

          <div className="glass rounded-xl p-6 border border-border/40 hover:border-primary/30 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-threat-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-threat-500" />
              </div>
              <TrendingUp className="w-4 h-4 text-threat-500" />
            </div>
            <div className="text-2xl font-display font-bold text-white mb-1">
              {stats.scamCalls}
            </div>
            <div className="text-sm text-muted-foreground">Scams Blocked</div>
          </div>

          <div className="glass rounded-xl p-6 border border-border/40 hover:border-primary/30 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-monitor-500/10 rounded-lg">
                <Phone className="w-5 h-5 text-monitor-500" />
              </div>
              <Activity className="w-4 h-4 text-monitor-500" />
            </div>
            <div className="text-2xl font-display font-bold text-white mb-1">
              {Math.round(stats.avgDuration / 60)}s
            </div>
            <div className="text-sm text-muted-foreground">Avg Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
}