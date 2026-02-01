"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Clock,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  Eye
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Animated counter hook
  const [counters, setCounters] = useState({
    totalCalls: 0,
    scamsBlocked: 0,
    emailsScanned: 0,
    smsScanned: 0,
  });

  useEffect(() => {
    // Animate counters on mount
    const targetValues = {
      totalCalls: 1247,
      scamsBlocked: 89,
      emailsScanned: 342,
      smsScanned: 156,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        totalCalls: Math.floor(targetValues.totalCalls * progress),
        scamsBlocked: Math.floor(targetValues.scamsBlocked * progress),
        emailsScanned: Math.floor(targetValues.emailsScanned * progress),
        smsScanned: Math.floor(targetValues.smsScanned * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targetValues);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Cycle through metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-monitor-500/20 border-b-monitor-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
    );
  }

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', scams: 12, legitimate: 45 },
    { day: 'Tue', scams: 8, legitimate: 52 },
    { day: 'Wed', scams: 15, legitimate: 38 },
    { day: 'Thu', scams: 11, legitimate: 48 },
    { day: 'Fri', scams: 18, legitimate: 55 },
    { day: 'Sat', scams: 6, legitimate: 22 },
    { day: 'Sun', scams: 9, legitimate: 18 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.scams + d.legitimate));

  const threatCategories = [
    { name: 'Phishing', value: 45, color: 'bg-threat-500', trend: 12 },
    { name: 'Authority Scam', value: 28, color: 'bg-warning-500', trend: -5 },
    { name: 'Urgency Tactics', value: 18, color: 'bg-warning-600', trend: 8 },
    { name: 'Other', value: 9, color: 'bg-muted', trend: -2 },
  ];

  const recentActivity = [
    { type: 'scam', source: 'Email', content: 'Urgent: Your account will be...', time: '2m ago', severity: 'high' },
    { type: 'safe', source: 'SMS', content: 'Your package has been deliver...', time: '15m ago', severity: 'low' },
    { type: 'scam', source: 'Call', content: 'IRS fraud department calling...', time: '1h ago', severity: 'critical' },
    { type: 'safe', source: 'Email', content: 'Weekly newsletter from...', time: '2h ago', severity: 'low' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Header with Animated Background */}
      <div className="relative overflow-hidden border-b border-border/40">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-monitor-500/20 to-primary/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-monitor-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }} />

        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">AI Protection Active</span>
              </div>

              <h1 className="text-6xl font-display font-bold tracking-tight">
                <span className="text-gradient-primary">Welcome back,</span>
                <br />
                <span className="text-foreground">{user?.displayName || "User"}</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Your AI security system is actively monitoring threats across all channels
              </p>
            </div>

            {/* Key Metrics - Animated Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Monitored', value: counters.totalCalls, icon: Activity, color: 'primary', change: '+12%' },
                { label: 'Scams Blocked', value: counters.scamsBlocked, icon: Shield, color: 'threat-500', change: '+23%' },
                { label: 'Emails Scanned', value: counters.emailsScanned, icon: Mail, color: 'monitor-500', change: '+8%' },
                { label: 'SMS Checked', value: counters.smsScanned, icon: MessageSquare, color: 'safe-500', change: '+15%' },
              ].map((metric, i) => (
                <div
                  key={i}
                  className={`relative group cursor-pointer transition-all duration-500 stagger-item ${activeMetric === i ? 'scale-105' : 'hover:scale-105'
                    }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                  onMouseEnter={() => setActiveMetric(i)}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-${metric.color}/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative glass-strong rounded-2xl p-6 border-2 border-border/40 group-hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${metric.color}/10`}>
                        <metric.icon className={`w-6 h-6 text-${metric.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${metric.change.startsWith('+') ? 'text-safe-500' : 'text-threat-500'
                        }`}>
                        {metric.change.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {metric.change}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-4xl font-display font-bold tabular-nums">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>

                    {/* Animated bar */}
                    <div className="mt-4 h-1 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${metric.color} to-${metric.color}/50 transition-all duration-1000`}
                        style={{ width: activeMetric === i ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Activity Chart */}
            <div className="glass rounded-2xl p-8 border border-border/40">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display font-semibold">Weekly Activity</h2>
                  <p className="text-sm text-muted-foreground mt-1">Threats detected vs legitimate traffic</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-threat-500" />
                    <span className="text-sm text-muted-foreground">Scams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-safe-500" />
                    <span className="text-sm text-muted-foreground">Safe</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 h-64">
                {weeklyData.map((data, i) => {
                  const scamHeight = (data.scams / maxValue) * 100;
                  const legitHeight = (data.legitimate / maxValue) * 100;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                      <div className="w-full flex flex-col-reverse gap-1">
                        {/* Legitimate bar */}
                        <div
                          className="w-full bg-gradient-to-t from-safe-500 to-safe-400 rounded-t-lg transition-all duration-500 hover:from-safe-400 hover:to-safe-300 relative overflow-hidden group-hover:shadow-glow-sm"
                          style={{
                            height: `${legitHeight}%`,
                            animationDelay: `${i * 100}ms`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
                        </div>

                        {/* Scam bar */}
                        <div
                          className="w-full bg-gradient-to-t from-threat-500 to-threat-400 rounded-t-lg transition-all duration-500 hover:from-threat-400 hover:to-threat-300 relative overflow-hidden group-hover:shadow-glow-sm"
                          style={{
                            height: `${scamHeight}%`,
                            animationDelay: `${i * 100 + 50}ms`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
                        </div>
                      </div>

                      <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                        {data.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Threat Categories */}
            <div className="glass rounded-2xl p-8 border border-border/40">
              <h2 className="text-2xl font-display font-semibold mb-6">Threat Categories</h2>

              <div className="space-y-4">
                {threatCategories.map((category, i) => (
                  <div key={i} className="group" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.name}</span>
                        <div className={`flex items-center gap-1 text-xs font-medium ${category.trend > 0 ? 'text-threat-400' : 'text-safe-400'
                          }`}>
                          {category.trend > 0 ? '↑' : '↓'} {Math.abs(category.trend)}%
                        </div>
                      </div>
                      <span className="text-sm font-bold tabular-nums">{category.value}%</span>
                    </div>

                    <div className="relative h-3 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 ${category.color} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                        style={{ width: `${category.value}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 border border-border/40">
              <h2 className="text-xl font-display font-semibold mb-4">Quick Actions</h2>

              <div className="space-y-3">
                {[
                  { name: 'Scan Email', icon: Mail, href: '/email-check', color: 'primary' },
                  { name: 'Check SMS', icon: MessageSquare, href: '/sms-check', color: 'monitor-500' },
                  { name: 'View Calls', icon: Phone, href: '/teli', color: 'safe-500' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="group flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-primary/50 transition-all hover-lift"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${action.color}/10`}>
                        <action.icon className={`w-5 h-5 text-${action.color}`} />
                      </div>
                      <span className="font-medium">{action.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6 border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold">Recent Activity</h2>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${activity.type === 'scam' ? 'bg-threat-500/10' : 'bg-safe-500/10'
                      }`}>
                      {activity.type === 'scam' ? (
                        <AlertTriangle className="w-4 h-4 text-threat-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-safe-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">{activity.source}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {activity.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protection Status */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-monitor-500/10 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

              <div className="relative space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Protection Status</div>
                    <div className="text-sm text-muted-foreground">All systems active</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {['Email Protection', 'SMS Monitoring', 'Call Screening'].map((service, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">{service}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-safe-500 animate-pulse" />
                        <span className="text-safe-500 font-medium">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}