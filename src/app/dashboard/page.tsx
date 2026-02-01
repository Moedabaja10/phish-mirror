"use client";

import { useState } from "react";
import { analyzeText, AnalysisResult} from "@/lib/detection/analyze";

/* -------------------- Types -------------------- */


/* ---------------- Mock Call Script -------------- */

const mockCallLines = [
  "Hello, this is the bank fraud department.",
  "We have detected suspicious activity on your account.",
  "If you do not act immediately, your account will be locked.",
  "I need you to provide the verification code we sent to your phone.",
];

/* ---------------- Component -------------------- */

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [callActive, setCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState<string[]>([]);

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

  /* ---------------- Render ---------------- */

  return (
    <main
      style={{
        padding: 32,
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>PhishMirror</h1>
      <p style={{ marginBottom: 24, color: "#555" }}>
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
          backgroundColor: "#222",
          color: "#fff",
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        {callActive ? "Call in progress…" : "Simulate Incoming Call"}
      </button>

      {callTranscript.length > 0 && (
        <section
          style={{
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginBottom: 24,
            backgroundColor: "#fafafa",
          }}
        >
          <h3>Live Call Transcript</h3>
          <ul>
            {callTranscript.map((line, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- Paste-in Analysis ---- */}
      <h3>Analyze Message or Transcript</h3>

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
          border: "1px solid #ccc",
          marginBottom: 12,
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
          backgroundColor: "#111",
          color: "#fff",
          cursor: "pointer",
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
            border: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>
            Verdict:{" "}
            <span
              style={{
                color:
                  result.verdict === "SCAM"
                    ? "#d32f2f"
                    : result.verdict === "SUSPICIOUS"
                    ? "#f57c00"
                    : "#2e7d32",
              }}
            >
              {result.verdict}
            </span>
          </h2>

          <p style={{ marginBottom: 16 }}>
            Risk Score: <strong>{result.score}</strong>
          </p>

          <h3>Why this was flagged</h3>

          {result.reasons.length === 0 ? (
            <p>No scam indicators detected.</p>
          ) : (
            <ul>
              {result.reasons.map((r, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <strong>{r.title}</strong>
                  {r.evidence && (
                    <div style={{ fontSize: 12, color: "#555" }}>
                      Evidence: “{r.evidence}”
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
