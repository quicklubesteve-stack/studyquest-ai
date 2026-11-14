import { z } from "zod";

export const EducationTierSchema = z.enum([
  "kindergarten",
  "elementary",
  "high_school",
  "college",
  "adult",
]);

export const QuizQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string().min(5),
  choices: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().min(10),
  hints: z.array(z.string()),
  sourceReference: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export const ActivityStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  instruction: z.string(),
  type: z.enum([
    "interactive_counter",
    "fraction_pie",
    "particle_sim",
    "slope_slider",
    "flowchart",
    "loss_curve",
    "email_inspector",
  ]),
  data: z.record(z.any()),
});

export const LessonSchema = z.object({
  id: z.string(),
  subjectId: z.string(),
  courseTitle: z.string(),
  title: z.string().min(3),
  tier: EducationTierSchema,
  summary: z.string(),
  estimatedMinutes: z.number().int().positive(),
  visualSummary: z.string().optional(),
  audioNarration: z.string().optional(),
  contentMarkdown: z.string().min(20),
  keyTakeaways: z.array(z.string()).min(1),
  activity: ActivityStepSchema,
  quiz: z.array(QuizQuestionSchema).min(1),
  nextLessonId: z.string().optional(),
});

export const SubjectCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  tier: EducationTierSchema,
  icon: z.string(),
  description: z.string(),
  lessons: z.array(LessonSchema),
});

export const CurriculumManifestSchema = z.array(SubjectCategorySchema);
