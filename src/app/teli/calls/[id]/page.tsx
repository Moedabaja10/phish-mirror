// src/app/teli/calls/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScamBadge } from "@/components/teli/ScamBadge";
import { ArrowLeft, Phone, Clock, User } from "lucide-react";
import { TeliCallDetail, isScamCall } from "@/lib/teli-api";

export default function CallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const callId = params.id as string;

  const [call, setCall] = useState<TeliCallDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        const response = await fetch(`/api/teli/calls/${callId}`);
        const data = await response.json();
        
        if (data.success) {
            console.log("Call data:", data.call);
            setCall(data.call);
        }
      } catch (error) {
        console.error("Error fetching call details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallDetails();
  }, [callId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Call not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isScam = isScamCall(call);
  const duration = Math.round(call.duration_ms / 1000);
  const callTime = new Date(call.start_timestamp).toLocaleString();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Call Details</h1>
          <p className="text-muted-foreground">Call ID: {call.call_id}</p>
        </div>
        <ScamBadge isScam={isScam} />
      </div>

      {/* Call Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Call Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-mono font-medium">{call.from_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{duration} seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Agent</p>
                <p className="font-medium">{call.agent_name}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium">{callTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sentiment</p>
            <p className="font-medium">{call.user_sentiment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Audio Recording */}
      {call.recording_url && (
        <Card>
          <CardHeader>
            <CardTitle>Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <audio controls className="w-full">
              <source src={call.recording_url} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}

      {/* Transcript */}
      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {call.transcript_object.map((item, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  item.role === "agent" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    item.role === "agent"
                      ? "bg-primary/10 text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {item.role === "agent" ? "AI Agent" : "Caller"}
                  </p>
                  <p className="text-sm">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}