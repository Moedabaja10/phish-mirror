import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert SMS/text message scam detector. Analyze the provided text message for scam indicators with extreme precision.

Common SMS scam indicators to look for:
- Urgent language creating panic or FOMO
- Suspicious shortened links (bit.ly, tinyurl, etc.)
- Requests to click links immediately
- Claims of account problems, package delivery issues, or winning prizes
- Requests for personal information via text
- Unknown or spoofed phone numbers
- Messages pretending to be from banks, government, or major companies
- Two-factor authentication code phishing
- "Verify your account" or "Confirm your identity" requests
- Cryptocurrency or investment opportunities
- Job offers or "work from home" schemes
- Romance or relationship scams
- Fake customer support
- Requests to call premium rate numbers

Return a JSON response with this exact structure:
{
  "isScam": boolean,
  "confidence": number (0-100),
  "reason": "Brief 2-3 sentence explanation",
  "indicators": ["list", "of", "specific", "red", "flags", "found"],
  "recommendation": "Specific action advice for the user"
}

Consider the phone number format and origin if provided. Be thorough but concise.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;
    const image = formData.get("image") as File | null;

    if (!text && !image) {
      return NextResponse.json(
        { error: "Please provide SMS text or an image" },
        { status: 400 }
      );
    }

    let messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Build context
    let contextText = "";
    if (phoneNumber) {
      contextText += `Sender's phone number: ${phoneNumber}\n`;
    }
    if (text) {
      contextText += `Message content:\n${text}`;
    }

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
            text: contextText
              ? `Analyze this SMS screenshot. Additional context:\n${contextText}`
              : "Analyze this SMS screenshot for scam indicators.",
          },
        ],
      });
    } else {
      // Text only
      messages.push({
        role: "user",
        content: `Analyze this SMS for scam indicators:\n\n${contextText}`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // GPT-4 with vision
      messages,
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for consistent analysis
      max_tokens: 1000,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("SMS analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze SMS", details: error.message },
      { status: 500 }
    );
  }
}