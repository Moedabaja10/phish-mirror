import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-display text-gradient-primary animate-scale-in">
            PhishMirror
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Scam Protection
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className="pulse-glow bg-monitor-500 w-3 h-3 rounded-full"></div>
          <span className="text-sm text-foreground/60">System Active</span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="glass p-6 rounded-lg space-y-2 hover-lift cursor-pointer">
            <div className="text-3xl">🛡️</div>
            <h3 className="font-display text-lg">Real-Time Protection</h3>
            <p className="text-sm text-muted-foreground">
              Intercepts scam calls before they reach you
            </p>
          </div>

          <div className="glass p-6 rounded-lg space-y-2 hover-lift cursor-pointer">
            <div className="text-3xl">🤖</div>
            <h3 className="font-display text-lg">AI Detection</h3>
            <p className="text-sm text-muted-foreground">
              Analyzes conversations in real-time
            </p>
          </div>

          <div className="glass p-6 rounded-lg space-y-2 hover-lift cursor-pointer">
            <div className="text-3xl">📊</div>
            <h3 className="font-display text-lg">Full Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track and review all intercepted calls
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-all hover-lift shadow-glow-md"
          >
            Go to Dashboard
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border/40 mt-12">
          <div className="space-y-1">
            <div className="text-3xl font-display text-safe-500">0</div>
            <div className="text-xs text-muted-foreground">Scams Blocked</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-display text-monitor-500">0</div>
            <div className="text-xs text-muted-foreground">Calls Monitored</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-display text-primary">100%</div>
            <div className="text-xs text-muted-foreground">Protection Rate</div>
          </div>
        </div>
      </div>
    </main>
  );
}