import { connectDb } from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { lastMessage, role } = await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini API Key missing",
        },
        {
          status: 500,
        }
      );
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
You are an AI reply suggestion system for a vehicle booking chat app.

Generate exactly 6 reply suggestions.

ROLE: ${role}

LAST_MESSAGE:
${lastMessage}

Return ONLY valid JSON.

Example:

{
  "suggestions": [
    "I am on my way",
    "Please wait a moment",
    "Reached nearby",
    "Can you share location?",
    "I will arrive shortly",
    "Thank you"
  ]
}
`;

    const response = await axios.post(
      geminiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return NextResponse.json(
        {
          success: false,
          message: "No response from Gemini",
        },
        {
          status: 500,
        }
      );
    }

    let suggestions: string[] = [];

    try {
      const cleaned = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      suggestions = Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : [];
    } catch (e) {
      console.error("JSON Parse Error:", e);

      suggestions = [];
    }

    return NextResponse.json(
      {
        success: true,
        suggestions,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
  console.log("================================");
  console.log("FULL ERROR");
  console.dir(error?.response?.data, { depth: null });
  console.log("STATUS:", error?.response?.status);
  console.log("MESSAGE:", error?.message);
  console.log("================================");

  return NextResponse.json(
    {
      success: false,
      error: error?.response?.data,
      status: error?.response?.status,
      message: error?.message,
    },
    { status: 500 }
  );
}
}