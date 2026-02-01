export default function TestDesignPage() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-6xl font-display text-gradient-primary">
          PhishMirror
        </h1>
        <p className="text-muted-foreground text-lg">
          Design System Test - If you see colors and effects, it's working!
        </p>
      </div>

      {/* Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-lg space-y-2">
          <h2 className="text-2xl font-display">Glass Effect</h2>
          <p className="text-foreground/80">
            This card should have a glassmorphism effect with blur
          </p>
        </div>

        <div className="glass-strong p-6 rounded-lg space-y-2">
          <h2 className="text-2xl font-display">Strong Glass</h2>
          <p className="text-foreground/80">
            This card should have stronger glass effect
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div>
        <h2 className="text-2xl font-display mb-4">Status Badges</h2>
        <div className="flex flex-wrap gap-4">
          <span className="badge-threat px-4 py-2 rounded-full text-sm font-medium">
            🚨 Scam Detected
          </span>
          <span className="badge-warning px-4 py-2 rounded-full text-sm font-medium">
            ⚠️ Suspicious Activity
          </span>
          <span className="badge-safe px-4 py-2 rounded-full text-sm font-medium">
            ✅ Safe & Protected
          </span>
          <span className="badge-monitor px-4 py-2 rounded-full text-sm font-medium">
            👁️ Actively Monitoring
          </span>
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h2 className="text-2xl font-display mb-4">Custom Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-full h-20 bg-threat-500 rounded-lg"></div>
            <p className="text-sm text-center">Threat Red</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-warning-500 rounded-lg"></div>
            <p className="text-sm text-center">Warning Amber</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-safe-500 rounded-lg"></div>
            <p className="text-sm text-center">Safe Green</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-monitor-500 rounded-lg"></div>
            <p className="text-sm text-center">Monitor Cyan</p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <div>
        <h2 className="text-2xl font-display mb-4">Animations</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="pulse-glow bg-monitor-500 w-16 h-16 rounded-full"></div>
          <div className="animate-float bg-primary w-16 h-16 rounded-lg"></div>
          <div className="shimmer w-32 h-16 bg-muted rounded-lg"></div>
        </div>
      </div>

      {/* Interactive Card */}
      <div>
        <h2 className="text-2xl font-display mb-4">Interactive Elements</h2>
        <div className="card-interactive p-6 hover-lift cursor-pointer">
          <h3 className="text-xl font-display mb-2">Hover Over Me</h3>
          <p className="text-foreground/80">
            This card should lift and change on hover
          </p>
        </div>
      </div>

      {/* Gradient Text */}
      <div>
        <h2 className="text-2xl font-display mb-4">Gradient Text Effects</h2>
        <div className="space-y-2">
          <p className="text-4xl font-display text-gradient-threat">Threat Detected</p>
          <p className="text-4xl font-display text-gradient-warning">Suspicious Call</p>
          <p className="text-4xl font-display text-gradient-safe">Protected</p>
        </div>
      </div>

      {/* Grid Background */}
      <div className="bg-grid p-8 rounded-lg border border-border">
        <h2 className="text-2xl font-display mb-2">Grid Pattern Background</h2>
        <p className="text-foreground/80">
          This section should have a subtle grid pattern
        </p>
      </div>

      {/* Font Test */}
      <div className="glass p-6 rounded-lg space-y-4">
        <h1 className="text-4xl font-display">Display Font (Sora)</h1>
        <p className="text-lg font-sans">Body Font (Outfit) - Clean and readable</p>
        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
          Monospace Font (JetBrains Mono) - For code
        </code>
      </div>
    </div>
  );
}