// src/app/teli/calls/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CallCard } from "@/components/teli/CallCard";
import { TeliCall, isScamCall } from "@/lib/teli-api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

type FilterType = "all" | "scam" | "legitimate";

export default function CallHistoryPage() {
  const [calls, setCalls] = useState<TeliCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch("/api/teli/calls?limit=50");
        const data = await response.json();
        if (data.success) {
          setCalls(data.calls);
        }
      } catch (error) {
        console.error("Error fetching calls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const filteredCalls = calls.filter((call) => {
    // Apply scam/legit filter
    if (filter === "scam" && !isScamCall(call)) return false;
    if (filter === "legitimate" && isScamCall(call)) return false;

    // Apply search filter (phone number or transcript)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesPhone = call.from_number.toLowerCase().includes(query);
      const matchesTranscript = call.transcript.toLowerCase().includes(query);
      if (!matchesPhone && !matchesTranscript) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teli">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Call History</h1>
          <p className="text-muted-foreground">{calls.length} total calls</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by phone number or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "scam" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("scam")}
            className={filter === "scam" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Scam
          </Button>
          <Button
            variant={filter === "legitimate" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("legitimate")}
            className={filter === "legitimate" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Legitimate
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCalls.length} of {calls.length} calls
      </p>

      {/* Call List */}
      {filteredCalls.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No calls found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCalls.map((call) => (
            <CallCard key={call.call_id} call={call} />
          ))}
        </div>
      )}
    </div>
  );
}