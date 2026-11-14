import { describe, it, expect } from "vitest";
import { SAMPLE_CURRICULUM } from "@/curriculum/data";
import { CurriculumManifestSchema } from "@/curriculum/schema";

describe("Extensible Curriculum Registry & Demonstration Modules", () => {
  it("validates that all curriculum categories conform to the Zod schema", () => {
    const parseResult = CurriculumManifestSchema.safeParse(SAMPLE_CURRICULUM);
    expect(parseResult.success).toBe(true);
  });

  it("contains all 7 required multi-generation demonstration modules", () => {
    const allLessonIds = SAMPLE_CURRICULUM.flatMap((c) => c.lessons).map((l) => l.id);

    // 1. Kindergarten counting
    expect(allLessonIds).toContain("k-math-counting-10");
    // 2. Grade 4 fractions
    expect(allLessonIds).toContain("g4-math-fractions-intro");
    // 3. Grade 8 science
    expect(allLessonIds).toContain("g8-sci-matter-energy");
    // 4. High school algebra
    expect(allLessonIds).toContain("hs-alg-linear-slope");
    // 5. College introduction to AI
    expect(allLessonIds).toContain("col-ai-intro-paradigms");
    // 6. University-level ML fundamentals
    expect(allLessonIds).toContain("uni-ml-gradient-descent");
    // 7. Adult digital literacy
    expect(allLessonIds).toContain("adult-dig-sec-passwords");
  });

  it("ensures every lesson has verified questions with valid correctIndex and hints", () => {
    SAMPLE_CURRICULUM.forEach((category) => {
      category.lessons.forEach((lesson) => {
        expect(lesson.quiz.length).toBeGreaterThan(0);
        lesson.quiz.forEach((q) => {
          expect(q.prompt.length).toBeGreaterThan(5);
          expect(q.choices.length).toBeGreaterThanOrEqual(2);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.choices.length);
          expect(q.explanation.length).toBeGreaterThan(10);
          expect(Array.isArray(q.hints)).toBe(true);
        });
      });
    });
  });

  it("verifies interactive activity configurations for each lesson", () => {
    SAMPLE_CURRICULUM.forEach((category) => {
      category.lessons.forEach((lesson) => {
        expect(lesson.activity).toBeDefined();
        expect(lesson.activity.title).toBeTruthy();
        expect(lesson.activity.instruction).toBeTruthy();
        expect(lesson.activity.type).toBeTruthy();
      });
    });
  });
});
