import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert email scam detector AND educator. Analyze the provided email for scam indicators with extreme precision.

Common scam indicators to look for:
- Urgent language creating false sense of emergency
- Requests for personal/financial information
- Suspicious sender addresses or domains
- Poor grammar and spelling (often intentional to filter victims)
- Generic greetings ("Dear Customer" instead of your name)
- Threats or promises that seem too good to be true
- Mismatched or suspicious links
- Requests to bypass normal procedures
- Impersonation of known brands/organizations
- Unusual payment requests (gift cards, cryptocurrency, wire transfers)
- Pressure tactics and artificial deadlines
- Inconsistent branding or formatting

Return a JSON response with this exact structure:
{
  "isScam": boolean,
  "confidence": number (0-100),
  "reason": "Brief 2-3 sentence explanation",
  "indicators": ["list", "of", "specific", "red", "flags", "found"],
  "recommendation": "Specific action advice for the user",
  "highlightedText": [
    {
      "text": "exact text segment",
      "type": "scam" | "suspicious" | "safe" | "neutral",
      "explanation": "Why this specific text is flagged",
      "category": "Urgency" | "Authority" | "Personal Info Request" | etc.
    }
  ],
  "educationalTips": [
    "Practical tip users can apply to spot similar scams",
    "Another actionable learning point"
  ]
}

For highlightedText:
- Break the email into meaningful segments (phrases/sentences)
- Mark each segment as: "scam" (red flag), "suspicious" (yellow flag), "safe" (good sign), or "neutral"
- Provide clear, educational explanations for each flagged segment
- Categories: "Urgency", "Authority Impersonation", "Personal Info Request", "Suspicious Link", "Grammar Issue", "Threat", "Too Good To Be True", etc.

For educationalTips:
- Focus on transferable knowledge
- Explain WHY certain tactics work on victims
- Give concrete examples of what to watch for
- Maximum 5 tips, each 1-2 sentences

Be thorough but concise.`;

const INTERACTIVE_SYSTEM_PROMPT = SYSTEM_PROMPT + `

IMPORTANT: When providing highlightedText, ensure:
1. Each segment is a complete phrase or sentence
2. Segments flow naturally when read together
3. Include ALL text (neutral segments for non-suspicious parts)
4. Explanations are educational and actionable
5. Don't just identify problems - teach users HOW to spot them

Example format:
{
  "highlightedText": [
    {
      "text": "URGENT ACTION REQUIRED!",
      "type": "scam",
      "explanation": "Scammers use all-caps and urgency to trigger panic and bypass rational thinking. Legitimate companies rarely use this aggressive language.",
      "category": "Urgency Tactic"
    },
    {
      "text": "Dear Valued Customer,",
      "type": "suspicious",
      "explanation": "Generic greetings suggest mass-sent emails. Real companies use your actual name. This is a red flag for phishing attempts.",
      "category": "Generic Greeting"
    },
    {
      "text": "Thank you for contacting support.",
      "type": "neutral",
      "explanation": null,
      "category": null
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const image = formData.get("image") as File | null;
    const interactive = formData.get("interactive") === "true";

    if (!text && !image) {
      return NextResponse.json(
        { error: "Please provide email text or an image" },
        { status: 400 }
      );
    }

    const systemPrompt = interactive ? INTERACTIVE_SYSTEM_PROMPT : SYSTEM_PROMPT;

    let messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Handle image if provided
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");
      const mimeType = image.type;

      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
          {
            type: "text",
            text: text
              ? `Analyze this email screenshot${interactive ? " and provide interactive highlights" : ""}. Additional context: ${text}`
              : `Analyze this email screenshot for scam indicators${interactive ? " and provide interactive highlights with educational explanations" : ""}.`,
          },
        ],
      });
    } else {
      // Text only
      messages.push({
        role: "user",
        content: `Analyze this email for scam indicators${interactive ? " and provide interactive highlights with educational explanations" : ""}:\n\n${text}`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000, // Increased for interactive mode
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Email analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze email", details: error.message },
      { status: 500 }
    );
  }
}