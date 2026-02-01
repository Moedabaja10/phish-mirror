"use client";

import { useState } from "react";
import { analyzeText, AnalysisResult } from "@/lib/detection/analyze";

const mockCallLines = [
  "Hello, this is the bank fraud department.",
  "We have detected suspicious activity on your account.",
  "If you do not act immediately, your account will be locked.",
  "I need you to provide the verification code we sent to your phone.",
];

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState<string[]>([]);

  async function analyze() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function simulateCall() {
    setCallActive(true);
    setCallTranscript([]);
    setResult(null);

    let accumulatedText = "";

    for (let i = 0; i < mockCallLines.length; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const line = mockCallLines[i];
      accumulatedText += " " + line;
      setCallTranscript((prev) => [...prev, line]);
      setResult(analyzeText(accumulatedText));
    }

    setCallActive(false);
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-display text-gradient-primary">
            PhishMirror
          </h1>
          <p className="text-muted-foreground text-lg">
            Live scam interception and explanation
          </p>
        </div>

        {/* Live Call Simulation */}
        <div className="glass p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display">Live Call Simulation</h2>
            {callActive && (
              <div className="flex items-center gap-2">
                <div className="pulse-glow bg-threat-500 w-3 h-3 rounded-full"></div>
                <span className="text-sm text-threat-400">Call in progress</span>
              </div>
            )}
          </div>

          <button
            onClick={simulateCall}
            disabled={callActive}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              callActive
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground hover-lift shadow-glow-sm"
            }`}
          >
            {callActive ? "Call in progress..." : "🎭 Simulate Incoming Call"}
          </button>

          {/* Live Transcript */}
          {callTranscript.length > 0 && (
            <div className="glass-strong p-4 rounded-lg space-y-3 animate-slide-in-up">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-monitor-500 rounded-full animate-pulse"></div>
                <h3 className="font-display text-lg">Live Call Transcript</h3>
              </div>
              <ul className="space-y-2 font-mono text-sm">
                {callTranscript.map((line, i) => (
                  <li
                    key={i}
                    className="stagger-item bg-muted/50 p-3 rounded border-l-2 border-monitor-500"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Manual Analysis */}
        <div className="glass p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-display">Analyze Message or Transcript</h2>
          
          <textarea
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste suspicious message or transcript here..."
            className="w-full bg-muted/30 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />

          <button
            onClick={analyze}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              loading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-monitor-500 hover:bg-monitor-600 text-white hover-lift"
            }`}
          >
            {loading ? "Analyzing..." : "🔍 Analyze"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="glass-strong p-6 rounded-lg space-y-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display">Analysis Results</h2>
              <span
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  result.verdict === "SCAM"
                    ? "badge-threat"
                    : result.verdict === "SUSPICIOUS"
                    ? "badge-warning"
                    : "badge-safe"
                }`}
              >
                {result.verdict === "SCAM" && "🚨"}
                {result.verdict === "SUSPICIOUS" && "⚠️"}
                {result.verdict === "SAFE" && "✅"}
                {" " + result.verdict}
              </span>
            </div>

            {/* Threat Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Score</span>
                <span className="font-bold font-mono">{result.score}/100</span>
              </div>
              <div className="w-full h-3 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-safe-500 via-warning-500 to-threat-500 transition-all duration-1000 ease-out"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            {/* Reasons */}
            <div className="space-y-3">
              <h3 className="font-display text-lg">Why this was flagged</h3>
              {result.reasons.length === 0 ? (
                <p className="text-safe-400">✅ No scam indicators detected.</p>
              ) : (
                <ul className="space-y-3">
                  {result.reasons.map((r, i) => (
                    <li
                      key={i}
                      className="glass p-4 rounded-lg space-y-1 border-l-4 border-threat-500"
                    >
                      <div className="font-medium text-threat-400">{r.title}</div>
                      {r.evidence && (
                        <div className="font-mono text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                          Evidence: "{r.evidence}"
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Weight: {r.weight}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}