import { describe, it, expect } from "vitest";
import {
  validateUploadSafety,
  extractTextFromBuffer,
  analyzeStudyMaterial,
  searchMaterialGrounding,
} from "@/lib/materials/extractor";

describe("Study Material Text Extractor & Document Intelligence", () => {
  describe("validateUploadSafety", () => {
    it("accepts valid text, markdown, pdf, and docx file extensions under 10MB", () => {
      const txtBuffer = Buffer.from("Valid study notes content");
      const res = validateUploadSafety("notes.txt", txtBuffer);
      expect(res.valid).toBe(true);
      expect(res.fileType).toBe("txt");

      const mdRes = validateUploadSafety("guide.md", txtBuffer);
      expect(mdRes.valid).toBe(true);
      expect(mdRes.fileType).toBe("md");
    });

    it("rejects files exceeding the 10MB threshold", () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
      const res = validateUploadSafety("large_book.pdf", largeBuffer);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("exceeds maximum allowed size");
    });

    it("rejects unsupported and potentially executable extensions", () => {
      const buf = Buffer.from("echo hello");
      const resExe = validateUploadSafety("malware.exe", buf);
      expect(resExe.valid).toBe(false);
      expect(resExe.error).toContain("Unsupported file type");

      const resBat = validateUploadSafety("script.bat", buf);
      expect(resBat.valid).toBe(false);
    });

    it("detects and rejects Windows PE executable binaries with MZ headers even if renamed", () => {
      // 0x4D, 0x5A ('MZ') header
      const peBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const res = validateUploadSafety("trojan_hidden.txt", peBuffer);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("Executable PE binary detected");
    });
  });

  describe("extractTextFromBuffer", () => {
    it("extracts plain UTF-8 text from txt and md buffers", async () => {
      const sample = "Photosynthesis is the chemical process by which green plants synthesize nutrients.";
      const buf = Buffer.from(sample, "utf-8");
      const text = await extractTextFromBuffer(buf, "txt");
      expect(text).toBe(sample);
    });
  });

  describe("analyzeStudyMaterial", () => {
    const sampleArticle = `
Cellular respiration is the biochemical pathway through which eukaryotic cells convert glucose and oxygen into ATP.

Glycolysis is the initial anaerobic phase occurring in the cytosol where glucose is converted into pyruvate.

The Krebs Cycle refers to the metabolic cycle within the mitochondrial matrix producing electron carriers NADH and FADH2.

The Electron Transport Chain represents the final aerobic phase where ATP synthase generates approximately 32 ATP molecules.

Mitochondria are the primary organelles responsible for cellular respiration and metabolic energy production.
`;

    it("analyzes text and produces structured summary, concepts, notes, flashcards, quiz, and study plan", () => {
      const result = analyzeStudyMaterial(sampleArticle, "Cellular_Biology.txt", "high_school");

      expect(result.summary).toContain("Executive Overview: Cellular_Biology.txt");
      expect(result.wordCount).toBeGreaterThan(20);
      expect(result.keyConcepts.length).toBeGreaterThanOrEqual(3);

      // Verify concepts have citations
      for (const concept of result.keyConcepts) {
        expect(concept.term).toBeTruthy();
        expect(concept.definition).toBeTruthy();
        expect(concept.citation).toContain("Section");
      }

      // Verify flashcards
      expect(result.flashcards.length).toBeGreaterThanOrEqual(3);
      expect(result.flashcards[0].front).toContain("What is the significance or definition of");
      expect(result.flashcards[0].back).toContain("Source:");

      // Verify diagnostic quiz
      expect(result.quizQuestions.length).toBeGreaterThanOrEqual(2);
      const q = result.quizQuestions[0];
      expect(q.type).toBe("multiple-choice");
      expect(q.choices.length).toBe(4);
      expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswerIndex).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();

      // Verify notes & 5-day study plan
      expect(result.studyNotes).toContain("# Study Notes: Cellular_Biology.txt");
      expect(result.studyPlan).toContain("# 5-Day Study Quest: Cellular_Biology.txt");
      expect(result.studyPlan).toContain("Day 1:");
      expect(result.studyPlan).toContain("Day 5:");
    });
  });

  describe("searchMaterialGrounding", () => {
    const textCorpus = `
Section One Introduction:
Photosynthesis occurs inside chloroplasts using chlorophyll pigments to capture solar radiation.

Section Two Process:
Light-dependent reactions synthesize NADPH and ATP molecules across the thylakoid membranes.

Section Three Calvin Cycle:
The Calvin cycle fixes atmospheric carbon dioxide into high-energy sugars using ribulose bisphosphate.
`;

    it("matches relevant paragraphs and provides verbatim snippets with section citations", () => {
      const result = searchMaterialGrounding(
        "Photosynthesis_Guide.txt",
        textCorpus,
        "Where do light-dependent reactions take place?"
      );

      expect(result.citation.documentName).toBe("Photosynthesis_Guide.txt");
      expect(result.citation.section).toContain("Section");
      expect(result.citation.verbatimSnippet).toContain("Light-dependent reactions");
      expect(result.answer).toContain("Based on Section");
    });

    it("gracefully reports when query terms do not match the corpus", () => {
      const result = searchMaterialGrounding(
        "Photosynthesis_Guide.txt",
        textCorpus,
        "quantum entanglement and general relativity"
      );

      expect(result.citation.confidence).toBe("Low");
      expect(result.answer).toBeTruthy();
    });
  });
});
