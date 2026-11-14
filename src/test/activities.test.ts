import { describe, it, expect } from "vitest";
import {
  SAMPLE_FLASHCARDS,
  SAMPLE_MATCHING_PAIRS,
  SAMPLE_FILL_BLANKS,
  SAMPLE_SEQUENCE_PUZZLES,
  SAMPLE_MEMORY_CARDS,
  SAMPLE_WORD_SEARCH,
} from "@/curriculum/data/activities";

describe("StudyQuest AI — Interactive Learning Activities Suite", () => {
  it("provides comprehensive flashcards with Leitner box levels across grade tiers", () => {
    expect(SAMPLE_FLASHCARDS.length).toBeGreaterThanOrEqual(5);

    const categories = SAMPLE_FLASHCARDS.map((c) => c.category);
    expect(categories).toContain("Elementary Math");
    expect(categories).toContain("High School Algebra");
    expect(categories).toContain("Middle School Science");
    expect(categories).toContain("University AI");
    expect(categories).toContain("Adult Digital Security");

    SAMPLE_FLASHCARDS.forEach((card) => {
      expect(card.front.length).toBeGreaterThan(5);
      expect(card.back.length).toBeGreaterThan(5);
      expect(card.boxLevel).toBeGreaterThanOrEqual(1);
      expect(card.boxLevel).toBeLessThanOrEqual(5);
    });
  });

  it("verifies concept matching pairs across disciplines", () => {
    const sciencePairs = SAMPLE_MATCHING_PAIRS.science;
    expect(sciencePairs.length).toBe(4);

    sciencePairs.forEach((pair) => {
      expect(pair.left).toBeDefined();
      expect(pair.right).toBeDefined();
      expect(pair.left.length).toBeGreaterThan(2);
      expect(pair.right.length).toBeGreaterThan(5);
    });

    const mathPairs = SAMPLE_MATCHING_PAIRS.math;
    expect(mathPairs.find((p) => p.left === "1/2")?.right).toContain("50%");
    expect(mathPairs.find((p) => p.left === "1/4")?.right).toContain("25%");
  });

  it("validates fill-in-the-blank sentence challenges", () => {
    SAMPLE_FILL_BLANKS.forEach((challenge) => {
      expect(challenge.sentenceParts.length).toBe(2);
      expect(challenge.options).toContain(challenge.blankAnswer);
      expect(challenge.explanation.length).toBeGreaterThan(10);
      expect(challenge.hint.length).toBeGreaterThan(5);
    });

    const fractionChallenge = SAMPLE_FILL_BLANKS.find((c) => c.id === "fb-1");
    expect(fractionChallenge?.blankAnswer).toBe("denominator");
  });

  it("ensures sequence puzzles have unambiguous correct ordering", () => {
    SAMPLE_SEQUENCE_PUZZLES.forEach((puzzle) => {
      expect(puzzle.items.length).toBe(4);
      const indices = puzzle.items.map((i) => i.correctIndex).sort();
      expect(indices).toEqual([0, 1, 2, 3]);
    });
  });

  it("validates memory match card pairs", () => {
    expect(SAMPLE_MEMORY_CARDS.length % 2).toBe(0);

    // Every card must have a counterpart with the exact same pairId
    const pairCounts: Record<string, number> = {};
    SAMPLE_MEMORY_CARDS.forEach((card) => {
      pairCounts[card.pairId] = (pairCounts[card.pairId] || 0) + 1;
    });

    Object.values(pairCounts).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it("validates academic vocabulary word search grid integrity", () => {
    const grid = SAMPLE_WORD_SEARCH.grid;
    expect(grid.length).toBe(8);
    grid.forEach((row) => {
      expect(row.length).toBe(8);
    });

    // Check that target words exist in the grid
    const topRow = grid[0].join("");
    expect(topRow).toBe("FRACTION");

    const secondRow = grid[1].slice(0, 5).join("");
    expect(secondRow).toBe("SLOPE");
  });
});
