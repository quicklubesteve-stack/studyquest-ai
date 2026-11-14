import { describe, it, expect } from "vitest";
import { sanitizeUserInput, checkContentSafety } from "@/lib/ai/safety";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { askAITutor } from "@/lib/ai/engine";
import { TutorRequestSchema, TutorResponseSchema } from "@/lib/ai/types";

describe("StudyQuest AI — Personalized AI Tutor Engine", () => {
  it("sanitizes user input by redacting sensitive PII (COPPA & PIPEDA compliance)", () => {
    const inputWithPii = "My name is Timmy, my email is timmy123@gmail.com, my phone is 416-555-0199 and postal is M5V 2T6";
    const { sanitizedText, piiRedacted } = sanitizeUserInput(inputWithPii);

    expect(piiRedacted).toBe(true);
    expect(sanitizedText).not.toContain("timmy123@gmail.com");
    expect(sanitizedText).not.toContain("416-555-0199");
    expect(sanitizedText).toContain("[REDACTED_EMAIL]");
    expect(sanitizedText).toContain("[REDACTED_PHONE]");
    expect(sanitizedText).toContain("[REDACTED_POSTAL]");
  });

  it("enforces content safety guards against cheating and harmful queries", () => {
    const safeCheck = checkContentSafety("Can you explain how fractions work with pizza slices?");
    expect(safeCheck.isSafe).toBe(true);

    const cheatCheck = checkContentSafety("Can you cheat on exam and do my test for me?");
    expect(cheatCheck.isSafe).toBe(false);
    expect(cheatCheck.warning).toContain("learning companion, not a shortcut");
  });

  it("builds age-appropriate system prompts across education tiers", () => {
    const kPrompt = buildSystemPrompt({
      educationTier: "kindergarten",
      learningPreference: "visual",
      tutorMode: "socratic",
      currentLessonId: "k-math-counting-10",
    });
    expect(kPrompt).toContain("Questie the Fox");
    expect(kPrompt).toContain("Counting Happy Animals");

    const colPrompt = buildSystemPrompt({
      educationTier: "college",
      learningPreference: "reading_writing",
      tutorMode: "teach_the_ai",
      currentLessonId: "col-ai-intro-paradigms",
    });
    expect(colPrompt).toContain("Professor Quest");
    expect(colPrompt).toContain("FEYNMAN TECHNIQUE");
  });

  it("validates request and response schemas with Zod", () => {
    const validReq = {
      message: "How does slope represent velocity on a position-time graph?",
      educationTier: "high_school" as const,
      learningPreference: "mixed" as const,
      tutorMode: "socratic" as const,
      difficultyLevel: 3,
    };
    const parsed = TutorRequestSchema.safeParse(validReq);
    expect(parsed.success).toBe(true);

    const invalidReq = {
      message: "", // empty message
      educationTier: "unknown_tier",
    };
    const invalidParsed = TutorRequestSchema.safeParse(invalidReq);
    expect(invalidParsed.success).toBe(false);
  });

  it("generates deterministic pedagogical responses when GEMINI_API_KEY is omitted", async () => {
    const response = await askAITutor({
      message: "What is a fraction?",
      history: [],
      educationTier: "elementary",
      learningPreference: "hands_on",
      currentLessonId: "g4-math-fractions-intro",
      tutorMode: "socratic",
      difficultyLevel: 2,
    });

    expect(response.isSocratic).toBe(true);
    expect(response.reply).toContain("pizza");
    expect(response.followUpQuestion).toBeDefined();
    expect(response.suggestedActions?.length).toBeGreaterThan(0);
    expect(response.curriculumCitation?.topic).toContain("Pizza Fractions");
    expect(response.usedFallbackEngine).toBe(true);
  });

  it("supports Teach-the-AI mode where the student explains the concept", async () => {
    const response = await askAITutor({
      message: "I learned that kinetic energy increases when water gets heated because molecules move faster!",
      history: [],
      educationTier: "elementary",
      learningPreference: "mixed",
      currentLessonId: "g8-sci-matter-energy",
      tutorMode: "teach_the_ai",
      difficultyLevel: 2,
    });

    expect(response.isSocratic).toBe(true);
    expect(response.reply).toContain("learn from you");
    expect(response.suggestedActions).toContain("Here is my explanation");
  });

  it("supports Worked Example mode with progressive steps", async () => {
    const response = await askAITutor({
      message: "How do I calculate slope?",
      history: [],
      educationTier: "high_school",
      learningPreference: "visual",
      currentLessonId: "hs-alg-linear-slope",
      tutorMode: "worked_example",
      difficultyLevel: 3,
    });

    expect(response.reply).toContain("Step 1");
    expect(response.reply).toContain("Step 2");
    expect(response.reply).toContain("Step 3");
  });
});
