// src/lib/teli-api.ts

const TELI_API_URL = "https://teli-hackathon--transfer-message-service-fastapi-app.modal.run";
const TELI_API_KEY = "hackathon-sms-api-key-h4ck-2024-a1b2-c3d4e5f67890";

// For now, hardcode your credentials (we'll move to Firebase later)
const ORG_ID = "1769911536561x118870425265095323";
const USER_ID = "1769911724164x789712809602863622";
const AGENT_ID = "1769913790320x591526282831956710";
const PHONE_NUMBER = "+13133519574";

export interface TeliCall {
  call_id: string;
  from_number: string;
  to_number: string;
  duration_ms : number;
  start_timestamp: string;
  call_ended_at: string;
  transcript: string;
  user_sentiment: string;
  call_successful: boolean;
  recording_url: string;
  agent_name: string;
  direction: "inbound" | "outbound";
}

export interface TeliCallDetail extends TeliCall {
  transcript_object: Array<{
    role: "agent" | "user";
    content: string;
    words?: Array<{ word: string; start: number; end: number }>;
  }>;
  extracted_fields: Record<string, any>;
}

// Get all calls
export async function getCalls(limit: number = 50): Promise<TeliCall[]> {
  const response = await fetch(
    `${TELI_API_URL}/v1/voice/calls?organization_id=${ORG_ID}&user_id=${USER_ID}&is_admin=true&limit=${limit}`,
    {
      headers: {
        "X-API-Key": TELI_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch calls");
  }

  const data = await response.json();
  return data.calls || [];
}

// Get single call details
export async function getCallDetails(callId: string): Promise<TeliCallDetail> {
  const response = await fetch(`${TELI_API_URL}/v1/voice/calls/${callId}`, {
    headers: {
      "X-API-Key": TELI_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch call details");
  }

  return await response.json();
}

// Update agent settings
export async function updateAgent(updates: {
  prompt?: string;
  voice_id?: string;
  agent_name?: string;
  starting_message?: string;
}) {
  const response = await fetch(`${TELI_API_URL}/v1/agents/${AGENT_ID}`, {
    method: "PATCH",
    headers: {
      "X-API-Key": TELI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update agent");
  }

  return await response.json();
}

// Helper function to detect if a call is likely a scam
export function isScamCall(call: TeliCall | TeliCallDetail): boolean {
    const transcript = call.transcript.toLowerCase();
  
    // Check 1: Did the AI say the scam goodbye phrase?
    if (transcript.includes("unsolicited calls")) {
      return true;
    }
  
    // Check 2: Did the AI say it would transfer (legitimate call)?
    if (transcript.includes("i will connect you now")) {
      return false;
    }
  
    // Check 3: Keyword matching as a fallback
    const scamKeywords = [
      "bank information",
      "credit card",
      "social security",
      "irs",
      "warranty",
      "refund",
      "arrest",
      "tech support",
      "virus",
      "gift card",
      "wire transfer",
      "urgent",
      "verify account",
      "suspended",
    ];
  
    return scamKeywords.some((keyword) => transcript.includes(keyword));
  }
export { ORG_ID, USER_ID, AGENT_ID, PHONE_NUMBER };