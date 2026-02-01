"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInUser, signInWithGoogle } from "@/lib/firebase/auth";
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signInUser(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to sign in");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const result = await signInWithGoogle();

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to sign in with Google");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        {/* Central gradient mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-primary/5 via-monitor-500/5 to-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title - Enhanced */}
        <div className="text-center mb-12 animate-scale-in">
          {/* Logo with pulsing glow */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse-glow" />
              <div className="relative p-6 bg-gradient-to-br from-primary/20 to-monitor-500/20 rounded-3xl border-2 border-primary/30 shadow-2xl">
                <Shield className="w-16 h-16 text-primary animate-pulse-slow" />
              </div>
            </div>
          </div>
          
          {/* Main Title - BOLD AND VISIBLE */}
          <div className="relative mb-4 animate-slide-in-up">
            {/* Colored glow behind */}
            <div className="absolute inset-0 blur-3xl opacity-50">
              <h1 className="text-7xl font-display font-black tracking-tight bg-gradient-to-r from-primary via-monitor-500 to-primary bg-clip-text text-transparent">
                PhishMirror
              </h1>
            </div>
            {/* Main WHITE text */}
            <h1 className="relative text-7xl font-display font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              PhishMirror
            </h1>
          </div>
          
          {/* Subtitle with accent */}
          <div className="flex items-center justify-center gap-3 mb-2 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary"></div>
            <p className="text-lg font-semibold text-white/90">
              AI-Powered Security Platform
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          
          {/* Feature badges */}
          <div className="flex items-center justify-center gap-3 mt-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="text-xs font-medium text-primary">Real-time Protection</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-monitor-500/10 border border-monitor-500/20 backdrop-blur-sm">
              <span className="text-xs font-medium text-monitor-500">256-bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-2xl border-2 border-border/40 p-8 shadow-2xl animate-slide-in-up backdrop-blur-xl" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-display font-semibold mb-8 text-center">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-threat-500/10 border border-threat-500/30 rounded-xl flex items-start gap-3 animate-scale-in">
              <AlertCircle className="w-5 h-5 text-threat-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-threat-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/20 border-2 border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted/30 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground/80">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/20 border-2 border-border/40 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted/30 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative group w-full py-4 rounded-xl font-semibold text-base transition-all overflow-hidden ${
                loading
                  ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-monitor-500 hover:shadow-glow-lg text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {!loading && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-monitor-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                </>
              )}
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-card/80 backdrop-blur-sm text-sm text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 bg-card/50 hover:bg-muted/30 border-2 border-border/40 hover:border-border/60 rounded-xl font-medium transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="group-hover:text-foreground transition-colors">Continue with Google</span>
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Bottom tagline with animation */}
        <div className="mt-8 text-center animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-muted-foreground">
            Join thousands protecting themselves from scams
          </p>
        </div>
      </div>
    </div>
  );
}