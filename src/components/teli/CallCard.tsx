// src/components/teli/CallCard.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScamBadge } from "./ScamBadge";
import { Phone, Clock } from "lucide-react";
import Link from "next/link";
import { TeliCall, isScamCall } from "@/lib/teli-api";

interface CallCardProps {
  call: TeliCall;
}

export function CallCard({ call }: CallCardProps) {
  const isScam = isScamCall(call);
  const duration = Math.round(call.call_duration_ms / 1000);
  const callTime = new Date(call.call_started_at).toLocaleString();

  return (
    <Link href={`/teli/calls/${call.call_id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">{call.from_number}</span>
            </div>
            <ScamBadge isScam={isScam} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{callTime}</span>
            <span>•</span>
            <span>{duration}s</span>
          </div>
          <p className="text-sm line-clamp-2 text-muted-foreground">
            {call.transcript.substring(0, 150)}...
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}