// src/components/teli/ScamBadge.tsx
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle } from "lucide-react";

interface ScamBadgeProps {
  isScam: boolean;
}

export function ScamBadge({ isScam }: ScamBadgeProps) {
  if (isScam) {
    return (
      <Badge variant="destructive" className="gap-1">
        <ShieldAlert className="h-3 w-3" />
        Scam Detected
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 border-green-500 text-green-500">
      <CheckCircle className="h-3 w-3" />
      Legitimate
    </Badge>
  );
}