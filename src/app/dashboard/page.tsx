"use client";

import { useState, useEffect } from "react";
import { analyzeText, AnalysisResult } from "@/lib/detection/analyze";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/firebase/auth";

/* -------------------- Mock Call Script -------------------- */

const mockCallLines = [
  "Hello, this is the bank fraud department.",
  "We have detected suspicious activity on your account.",
  "If you do not act immediately, your account will be locked.",
  "I need you to provide the verification code we sent to your phone.",
];

/* -------------------- Component -------------------- */

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [callActive, setCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  /* -------- Paste-in Analysis -------- */

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

  /* -------- Live Call Simulation -------- */

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

  /* -------- Loading State -------- */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  /* -------------------- Render -------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with User Info */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">PhishMirror</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Welcome back,</p>
              <p className="text-white font-semibold">
                {user?.displayName || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition border border-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Your Original Dashboard */}
      <main
        style={{
          padding: 32,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <p style={{ marginBottom: 24, color: "#cbd5e1" }}>
          Live scam interception and explanation
        </p>

        {/* ---- Simulated Call ---- */}
        <button
          onClick={simulateCall}
          disabled={callActive}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            borderRadius: 6,
            border: "none",
            backgroundColor: "#3b82f6",
            color: "#fff",
            cursor: callActive ? "not-allowed" : "pointer",
            marginBottom: 24,
            opacity: callActive ? 0.6 : 1,
          }}
        >
          {callActive ? "Call in progress…" : "Simulate Incoming Call"}
        </button>

        {callTranscript.length > 0 && (
          <section
            style={{
              padding: 16,
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              marginBottom: 24,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: 12 }}>
              Live Call Transcript
            </h3>
            <ul>
              {callTranscript.map((line, i) => (
                <li
                  key={i}
                  style={{ marginBottom: 6, color: "#cbd5e1" }}
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---- Paste-in Analysis ---- */}
        <h3 style={{ color: "#fff", marginBottom: 12 }}>
          Analyze Message or Transcript
        </h3>

        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste suspicious message or transcript here..."
          style={{
            width: "100%",
            padding: 12,
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.2)",
            marginBottom: 12,
            backgroundColor: "rgba(255,255,255,0.05)",
            color: "#fff",
          }}
        />

        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding: "10px 16px",
            fontSize: 14,
            borderRadius: 6,
            border: "none",
            backgroundColor: "#3b82f6",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>

        {/* ---- Results ---- */}
        {result && (
          <section
            style={{
              marginTop: 32,
              padding: 20,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <h2 style={{ color: "#fff" }}>
              Verdict:{" "}
              <span
                style={{
                  color:
                    result.verdict === "SCAM"
                      ? "#ef4444"
                      : result.verdict === "SUSPICIOUS"
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              >
                {result.verdict}
              </span>
            </h2>

            <p style={{ marginBottom: 16, color: "#cbd5e1" }}>
              Risk Score: <strong>{result.score}</strong>
            </p>

            <h3 style={{ color: "#fff", marginBottom: 12 }}>
              Why this was flagged
            </h3>

            {result.reasons.length === 0 ? (
              <p style={{ color: "#cbd5e1" }}>No scam indicators detected.</p>
            ) : (
              <ul>
                {result.reasons.map((r, i) => (
                  <li
                    key={i}
                    style={{ marginBottom: 10, color: "#cbd5e1" }}
                  >
                    <strong style={{ color: "#fff" }}>{r.title}</strong>
                    {r.evidence && (
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        Evidence: "{r.evidence}"
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}