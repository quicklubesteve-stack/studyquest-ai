import { NextRequest, NextResponse } from "next/server";
import { TutorRequestSchema } from "@/lib/ai/types";
import { askAITutor } from "@/lib/ai/engine";

// Simple in-memory sliding window rate limiter (max 30 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many tutor requests. Please pause for a moment before asking again." },
        { status: 429 }
      );
    }

    let json: any;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body provided" }, { status: 400 });
    }
    const parsed = TutorRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tutor request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const tutorResult = await askAITutor(parsed.data);

    return NextResponse.json(tutorResult, { status: 200 });
  } catch (error: any) {
    console.error("AI Tutor Route Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while communicating with the AI Tutor." },
      { status: 500 }
    );
  }
}
