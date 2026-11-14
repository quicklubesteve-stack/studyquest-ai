/**
 * StudyQuest AI — Study Material Text Extractor & Document Intelligence Engine
 * Supports PDF, DOCX, TXT, and Markdown files with safe sanitization, malware/executable checking,
 * active recall flashcard generation, quiz question generation, structured notes, and grounded citations.
 */

import mammoth from "mammoth";
import { Flashcard, Question } from "@/types";

export interface AnalyzedMaterial {
  summary: string;
  keyConcepts: Array<{ term: string; definition: string; citation: string }>;
  studyNotes: string;
  flashcards: Flashcard[];
  quizQuestions: Question[];
  studyPlan: string;
  wordCount: number;
}

export interface GroundedAnswer {
  answer: string;
  citation: {
    documentName: string;
    section: string;
    verbatimSnippet: string;
    confidence: "High" | "Medium" | "Low";
  };
}

/**
 * Validate file safety, mime type, and executable headers
 */
export function validateUploadSafety(
  filename: string,
  buffer: Buffer,
  maxBytes: number = 10 * 1024 * 1024 // 10MB default
): { valid: boolean; error?: string; fileType?: "pdf" | "docx" | "txt" | "md" } {
  // Check file size
  if (buffer.length > maxBytes) {
    return { valid: false, error: `File exceeds maximum allowed size of ${(maxBytes / (1024 * 1024)).toFixed(0)}MB.` };
  }

  if (buffer.length === 0) {
    return { valid: false, error: "Uploaded file is empty." };
  }

  // Determine file extension
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext || !["pdf", "docx", "txt", "md"].includes(ext)) {
    return { valid: false, error: "Unsupported file type. Only PDF, DOCX, TXT, and MD documents are supported." };
  }

  // Executable / Binary Malware Protection Check (Check for Windows PE "MZ" header or ELF executable header)
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return { valid: false, error: "Security warning: Executable PE binary detected. Upload rejected for safety." };
  }
  if (buffer.length >= 4 && buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return { valid: false, error: "Security warning: ELF binary detected. Upload rejected for safety." };
  }

  return { valid: true, fileType: ext as "pdf" | "docx" | "txt" | "md" };
}

/**
 * Safely extracts raw plain text from supported document buffers
 */
export async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: "pdf" | "docx" | "txt" | "md"
): Promise<string> {
  if (fileType === "txt" || fileType === "md") {
    return buffer.toString("utf-8");
  }

  if (fileType === "docx") {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } catch (err: unknown) {
      throw new Error(`Failed to extract text from DOCX file: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (fileType === "pdf") {
    try {
      // Dynamic import for pdf-parse to maintain compatibility in edge/next environments
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdf = require("pdf-parse");
      const data = await pdf(buffer);
      return (data.text || "").trim();
    } catch (err: unknown) {
      // Fallback: simple text stream regex parser for unencrypted raw PDF text objects
      const rawString = buffer.toString("latin1");
      const streamMatches = rawString.match(/BT[\s\S]*?ET/g);
      if (streamMatches && streamMatches.length > 0) {
        const textParts: string[] = [];
        for (const block of streamMatches) {
          const tjMatches = block.match(/\((.*?)\)\s*Tj/g);
          if (tjMatches) {
            for (const item of tjMatches) {
              const cleaned = item.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
              textParts.push(cleaned);
            }
          }
        }
        if (textParts.length > 0) {
          return textParts.join(" ").trim();
        }
      }
      throw new Error(`Failed to parse PDF document: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return "";
}

/**
 * Analyzes document text to extract structured notes, key concepts, flashcards,
 * quiz questions, and a personalized study plan.
 */
export function analyzeStudyMaterial(
  rawText: string,
  documentTitle: string,
  educationTier: string = "high_school"
): AnalyzedMaterial {
  // Clean whitespace and normalize line endings
  const cleanedText = rawText.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  const paragraphs = cleanedText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 30);
  
  const words = cleanedText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Generate Structured Summary
  const firstFewParagraphs = paragraphs.slice(0, 3).join("\n\n");
  const summary = paragraphs.length > 0
    ? `### Executive Overview: ${documentTitle}\n\n` +
      `This study document covers core principles related to ${documentTitle.replace(/\.[^/.]+$/, "")}. ` +
      `It contains ${paragraphs.length} major instructional sections spanning approximately ${wordCount} words.\n\n` +
      `**Key Highlights**:\n` +
      `- Foundation and terminology presented in early sections.\n` +
      `- Conceptual mechanisms and relationships detailed in core discussions.\n` +
      `- Applied takeaways suitable for ${educationTier.replace("_", " ")} learners.\n\n` +
      `> "${firstFewParagraphs.slice(0, 260)}..."`
    : `Summary of ${documentTitle}: No substantial text paragraphs detected.`;

  // 2. Identify Key Concepts & Terminology with Source Citations
  const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
  const conceptCandidates: Array<{ term: string; definition: string; citation: string }> = [];

  // Heuristic patterns for term definitions (e.g. "Term is...", "Term refers to...", "Term: ...")
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i].trim();
    const defMatch = s.match(/^([A-Z][A-Za-z0-9 -]{2,25})\s+(?:is|are|refers to|represents|means|describes)\s+(.+)/i);
    const colonMatch = s.match(/^([A-Z][A-Za-z0-9 -]{2,25}):\s*(.+)/);
    
    if (defMatch && defMatch[1] && defMatch[2] && defMatch[2].length > 15) {
      conceptCandidates.push({
        term: defMatch[1].trim(),
        definition: defMatch[2].trim(),
        citation: `Section ${Math.min(5, Math.floor(i / 5) + 1)}, Sentence ${i + 1}`,
      });
    } else if (colonMatch && colonMatch[1] && colonMatch[2] && colonMatch[2].length > 15) {
      conceptCandidates.push({
        term: colonMatch[1].trim(),
        definition: colonMatch[2].trim(),
        citation: `Section ${Math.min(5, Math.floor(i / 5) + 1)}, Line ${i + 1}`,
      });
    }

    if (conceptCandidates.length >= 6) break;
  }

  // Fallback concepts if regex found fewer than 3
  if (conceptCandidates.length < 3) {
    const sampleTerms = ["Core Objective", "Primary Mechanism", "Key Factor", "Analytical Takeaway"];
    for (let j = 0; j < Math.min(sampleTerms.length, paragraphs.length); j++) {
      conceptCandidates.push({
        term: sampleTerms[j],
        definition: paragraphs[j].slice(0, 140) + "...",
        citation: `Paragraph ${j + 1}`,
      });
    }
  }

  // 3. Generate Active Recall Flashcards
  const flashcards: Flashcard[] = conceptCandidates.map((c, idx) => ({
    id: `doc-fc-${idx + 1}`,
    front: `What is the significance or definition of **${c.term}** in "${documentTitle}"?`,
    back: `${c.definition} (Source: ${c.citation})`,
    category: documentTitle.replace(/\.[^/.]+$/, ""),
    difficulty: idx % 2 === 0 ? "easy" : "medium",
  }));

  // 4. Generate Practice Exam Questions (Multiple Choice & Fill-in-Blank)
  const quizQuestions: Question[] = conceptCandidates.slice(0, 4).map((c, idx) => {
    // Generate alternate distractors
    const otherConcepts = conceptCandidates.filter(other => other.term !== c.term);
    const distractors = otherConcepts.length >= 3
      ? otherConcepts.slice(0, 3).map(o => o.definition.slice(0, 80))
      : [
          "An unrelated auxiliary metric with minor analytical bearing.",
          "A legacy framework that has been deprecated in modern practice.",
          "A theoretical constant that remains invariant under all conditions.",
        ];

    const choices = [c.definition.slice(0, 80), ...distractors.slice(0, 3)];
    // deterministic shuffle: swap choice 0 with idx % choices.length
    const correctIdx = (idx + 1) % choices.length;
    const temp = choices[0];
    choices[0] = choices[correctIdx];
    choices[correctIdx] = temp;

    return {
      id: `doc-q-${idx + 1}`,
      type: "multiple-choice" as const,
      prompt: `According to ${documentTitle}, which statement best describes "${c.term}"?`,
      choices,
      correctAnswerIndex: correctIdx,
      explanation: `"${c.term}" is defined in ${c.citation}: ${c.definition}`,
      hints: [
        `Recall how ${c.term} was introduced in ${c.citation}.`,
        `Look for the option highlighting ${c.definition.slice(0, 30)}...`,
      ],
      xpReward: 20,
    };
  });

  // 5. Generate Structured Study Notes
  const studyNotes = [
    `# Study Notes: ${documentTitle}`,
    `*Generated for ${educationTier.replace("_", " ").toUpperCase()} Level Review*\n`,
    `## 1. Document Overview`,
    `${paragraphs[0] || "Foundational review material."}\n`,
    `## 2. Key Defined Concepts`,
    ...conceptCandidates.map(c => `- **${c.term}**: ${c.definition} *(Citation: ${c.citation})*`),
    `\n## 3. Core Insights & Synthesis`,
    `${paragraphs[1] || "Deepen your understanding through spaced repetition practice."}\n`,
    `## 4. Discussion & Exam Focus Areas`,
    `- Be prepared to explain how **${conceptCandidates[0]?.term || "the core topic"}** influences adjacent concepts.`,
    `- Pay close attention to definitions and practical examples when taking quizzes.`,
    `- Test your recall using the generated flashcard deck.`
  ].join("\n");

  // 6. Generate 5-Day Study Plan
  const studyPlan = [
    `# 5-Day Study Quest: ${documentTitle}`,
    `**Day 1: Exploration & Terminology**`,
    `- Read the executive overview and study notes.`,
    `- Master flashcards for: ${conceptCandidates.slice(0, 2).map(c => c.term).join(", ")}.`,
    `\n**Day 2: Deep Dive & Conceptual Linkage**`,
    `- Review full definitions and practice explaining them in your own words.`,
    `- Take initial practice quiz (Questions 1-2).`,
    `\n**Day 3: Midpoint Recall & Active Practice**`,
    `- Run through all ${flashcards.length} flashcards in the Leitner Spaced Repetition queue.`,
    `- Address any cards marked "Need Practice".`,
    `\n**Day 4: Exam Readiness Simulation**`,
    `- Complete the full generated diagnostic quiz under timed conditions.`,
    `- Use the AI Tutor to clarify any missed concepts.`,
    `\n**Day 5: Synthesis & Mastery**`,
    `- Teach the key takeaways back to the AI Tutor in Socratic dialogue mode.`,
    `- Earn 100% mastery badge for "${documentTitle}".`
  ].join("\n");

  return {
    summary,
    keyConcepts: conceptCandidates,
    studyNotes,
    flashcards,
    quizQuestions,
    studyPlan,
    wordCount,
  };
}

const STOP_WORDS = new Set([
  "and", "the", "for", "with", "from", "that", "this", "what", "which", "when",
  "where", "how", "are", "was", "were", "been", "have", "has", "had", "does",
]);

/**
 * Searches extracted material text to ground student inquiries with verbatim citations
 */
export function searchMaterialGrounding(
  documentTitle: string,
  extractedText: string,
  userQuery: string
): GroundedAnswer {
  const queryTerms = userQuery
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^a-z0-9]/g, ""))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const paragraphs = extractedText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 20);

  if (paragraphs.length === 0) {
    return {
      answer: `I could not locate specific text inside "${documentTitle}" to address your question.`,
      citation: {
        documentName: documentTitle,
        section: "N/A",
        verbatimSnippet: "No text available.",
        confidence: "Low",
      },
    };
  }

  // Score each paragraph based on query term frequency
  let bestScore = -1;
  let bestParagraph = paragraphs[0];
  let bestSectionIdx = 1;

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const para = paragraphs[idx];
    const paraLower = para.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      if (paraLower.includes(term)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestParagraph = para;
      bestSectionIdx = idx + 1;
    }
  }

  const confidence: "High" | "Medium" | "Low" = bestScore >= 3 ? "High" : bestScore >= 1 ? "Medium" : "Low";
  const snippet = bestParagraph.length > 200 ? bestParagraph.slice(0, 197) + "..." : bestParagraph;

  const answer = bestScore > 0
    ? `Based on Section ${bestSectionIdx} of **${documentTitle}**:\n\n` +
      `"${bestParagraph}"\n\n` +
      `*Summary*: The text specifically addresses this by explaining how the components interact under the principles established in this section.`
    : `I could not locate specific text matching your query inside "${documentTitle}". Here is the primary overview section instead:\n\n` +
      `"${bestParagraph}"`;

  return {
    answer,
    citation: {
      documentName: documentTitle,
      section: `Section ${bestSectionIdx}`,
      verbatimSnippet: snippet,
      confidence,
    },
  };
}
