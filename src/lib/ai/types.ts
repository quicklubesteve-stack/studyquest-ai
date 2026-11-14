import { z } from "zod";

export type TutorMode =
  | "socratic"
  | "worked_example"
  | "teach_the_ai"
  | "practice_generator"
  | "mistake_analysis";

export type EducationTier =
  | "kindergarten"
  | "elementary"
  | "high_school"
  | "college"
  | "adult";

export type LearningPreference =
  | "visual"
  | "audio"
  | "reading_writing"
  | "hands_on"
  | "mixed";

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: string;
  isSocratic?: boolean;
  followUpQuestion?: string;
  suggestedActions?: string[];
  citation?: {
    topic: string;
    subject: string;
    gradeLevel: string;
  };
}

export const TutorRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model", "system"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  educationTier: z.enum(["kindergarten", "elementary", "high_school", "college", "adult"]).default("elementary"),
  learningPreference: z.enum(["visual", "audio", "reading_writing", "hands_on", "mixed"]).default("mixed"),
  currentLessonId: z.string().optional(),
  currentSubjectId: z.string().optional(),
  tutorMode: z.enum(["socratic", "worked_example", "teach_the_ai", "practice_generator", "mistake_analysis"]).default("socratic"),
  difficultyLevel: z.number().min(1).max(5).optional().default(2),
});

export type TutorRequest = z.infer<typeof TutorRequestSchema>;

export const TutorResponseSchema = z.object({
  reply: z.string(),
  followUpQuestion: z.string().optional(),
  suggestedActions: z.array(z.string()).optional(),
  curriculumCitation: z
    .object({
      topic: z.string(),
      subject: z.string(),
      gradeLevel: z.string(),
    })
    .optional(),
  isSocratic: z.boolean().default(true),
  safetyFiltered: z.boolean().default(false),
  usedFallbackEngine: z.boolean().default(false),
});

export type TutorResponse = z.infer<typeof TutorResponseSchema>;
