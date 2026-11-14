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

export type GoalType =
  | "school_excellence"
  | "skill_building"
  | "exam_prep"
  | "curiosity"
  | "career_advancement";

export interface UserProfile {
  id: string;
  name: string;
  educationTier: EducationTier;
  selectedSubjects: string[];
  learningGoal: GoalType;
  dailyStudyMinutes: number;
  learningPreference: LearningPreference;
  wantsPlacementQuiz: boolean;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityStep {
  id: string;
  title: string;
  instruction: string;
  type: "interactive_counter" | "fraction_pie" | "particle_sim" | "slope_slider" | "flowchart" | "loss_curve" | "email_inspector";
  data: Record<string, any>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  hints: string[];
  sourceReference?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Question {
  id: string;
  type?: "multiple-choice" | "fill-blank";
  prompt: string;
  choices: string[];
  correctAnswerIndex: number;
  explanation: string;
  hints: string[];
  xpReward?: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  courseTitle: string;
  title: string;
  tier: EducationTier;
  summary: string;
  estimatedMinutes: number;
  visualSummary?: string;
  audioNarration?: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  activity: ActivityStep;
  quiz: QuizQuestion[];
  nextLessonId?: string;
}

export interface SubjectCategory {
  id: string;
  title: string;
  tier: EducationTier;
  icon: string;
  description: string;
  lessons: Lesson[];
}

export interface QuizAttempt {
  questionId: string;
  selectedChoice: number;
  isCorrect: boolean;
  hintsUsed: number;
  timestamp: string;
}

export interface TopicMastery {
  lessonId: string;
  title: string;
  subjectId: string;
  masteryPercentage: number; // 0 to 100
  lastPracticed: string;
  nextReviewDate: string; // ISO date for spaced repetition
  attemptsCount: number;
  boxLevel: number; // 1 to 5 (Leitner box)
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  todayMinutesSpent: number;
  completedLessonIds: string[];
  topicMasteries: Record<string, TopicMastery>;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  textScale: "normal" | "large" | "xlarge";
  reducedMotion: boolean;
  speechRate: number; // 0.8 to 1.5
  audioEnabled: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category: string;
  boxLevel: number; // 1 to 5 Leitner box
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  category: string;
}

export interface FillBlankChallenge {
  id: string;
  sentenceParts: [string, string]; // [before, after]
  blankAnswer: string;
  options: string[];
  explanation: string;
  hint: string;
}

export interface SequencePuzzleItem {
  id: string;
  text: string;
  correctIndex: number;
}

export interface MemoryCard {
  id: string;
  pairId: string;
  content: string;
  type: "text" | "emoji" | "formula";
}
