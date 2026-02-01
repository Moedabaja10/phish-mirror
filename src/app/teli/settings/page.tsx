// src/app/teli/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Phone, Mic } from "lucide-react";
import Link from "next/link";
import { PHONE_NUMBER } from "@/lib/teli-api";

const VOICE_OPTIONS = [
  { id: "cartesia-Brian", name: "Brian", accent: "American", gender: "Male", age: "Young" },
  { id: "cartesia-Cleo", name: "Cleo", accent: "American", gender: "Female", age: "Middle Aged" },
  { id: "cartesia-Adam", name: "Adam", accent: "British", gender: "Male", age: "Middle Aged" },
  { id: "cartesia-Evie", name: "Evie", accent: "American", gender: "Female", age: "Young" },
  { id: "cartesia-Max", name: "Max", accent: "American", gender: "Male", age: "Middle Aged" },
  { id: "cartesia-Victoria", name: "Victoria", accent: "American", gender: "Female", age: "Young" },
  { id: "cartesia-Anthony", name: "Anthony", accent: "British", gender: "Male", age: "Middle Aged" },
  { id: "cartesia-Sarah", name: "Sarah", accent: "American", gender: "Female", age: "Middle Aged" },
  { id: "11labs-Adrian", name: "Adrian", accent: "American", gender: "Male", age: "Young" },
  { id: "11labs-Lily", name: "Lily", accent: "American", gender: "Female", age: "Young" },
];

export default function SettingsPage() {
  const [agentName, setAgentName] = useState("Scam Protector");
  const [startingMessage, setStartingMessage] = useState(
    "Hello, who is this and why are you calling?"
  );
  const [prompt, setPrompt] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("cartesia-Brian");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Default prompt
  const DEFAULT_PROMPT = `You are a professional call screening assistant. Your job is to identify the caller and their purpose.

SCAM DETECTION - If the caller exhibits ANY of these red flags, politely end the call:
- Asks for bank information, passwords, SSN, credit card numbers, personal information
- Mentions warranty, IRS, Social Security Administration, refund, urgent action required
- Threatens legal action or arrest
- Offers prizes, lottery winnings, or free products
- Claims to be from tech support or says your computer has a virus
- Requests payment via gift cards, wire transfer, or cryptocurrency
- Uses high-pressure tactics or creates false urgency
- Robocalls or pre-recorded messages

If scam detected, immediately say: I am sorry, but I do not take unsolicited calls. Please remove this number from your list. Goodbye. Then end the call.

For legitimate calls: Politely ask their name, company or organization, and reason for calling. If it seems genuine, take a brief message with their callback number.`;

  useEffect(() => {
    setPrompt(DEFAULT_PROMPT);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const response = await fetch("/api/teli/agent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_name: agentName,
          starting_message: startingMessage,
          prompt: prompt,
          voice_id: selectedVoice,
        }),
      });

      if (response.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teli">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your AI call screener</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Save Status */}
      {saveStatus === "success" && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg text-sm">
          ✅ Agent updated successfully!
        </div>
      )}
      {saveStatus === "error" && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
          ❌ Failed to update agent. Please try again.
        </div>
      )}

      {/* Phone Number Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Your ProtectorNumber
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xl font-bold">{PHONE_NUMBER}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Forward unknown calls to this number for AI screening
          </p>
        </CardContent>
      </Card>

      {/* Agent Name & Starting Message */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Starting Message</label>
            <p className="text-xs text-muted-foreground mb-1">
              What the AI says when it picks up the call
            </p>
            <input
              type="text"
              value={startingMessage}
              onChange={(e) => setStartingMessage(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VOICE_OPTIONS.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  selectedVoice === voice.id
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:bg-accent"
                }`}
              >
                <p className="font-medium text-sm">{voice.name}</p>
                <p className="text-xs text-muted-foreground">
                  {voice.accent} • {voice.gender}
                </p>
                <p className="text-xs text-muted-foreground">{voice.age}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}