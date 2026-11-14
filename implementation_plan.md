# Implementation Plan — StudyQuest AI

## Phase Roadmap Overview

| Phase | Focus Area | Status | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Foundations, Navigation, Onboarding & Sample Curriculum** | 🚀 **In Progress** | Next.js + TS + Tailwind setup, Onboarding flow (6 questions + learning preferences), Dashboard, 7 verified multi-grade sample lessons, interactive quiz & activity engine, local persistence, accessibility toggles, unit & E2E tests. |
| **Phase 2** | **Authentication, Database & Profiles** | Planned | NextAuth / Auth0, PostgreSQL with Prisma schema, multi-role accounts (Learner, Parent, Teacher, Admin), remote progress sync. |
| **Phase 3** | **Personalized AI Tutor & Grounded Responses** | Planned | Gemini server-side integration, Socratic prompt chains, citation/grounding engine, conversational chat UI, check-for-understanding loop. |
| **Phase 4** | **Rich Learning Activities, Gamification & Worlds** | Planned | 15 distinct interactive activity types, customizable avatars, unlockable world themes, sound effects, quests & celebration animations. |
| **Phase 5** | **Study Material Uploads & Voice Tutor** | Planned | PDF/DOCX/TXT text extraction, document-grounded flashcards, quiz generator, interactive browser voice tutor with transcript and speed control. |
| **Phase 6** | **Subscriptions, Administration & Production Security** | Planned | Stripe test mode billing (Free vs Plus CAD $9.99/mo), parental consent dashboard, rate limiters, token budgets, security audits. |
| **Phase 7** | **Accessibility Audit, Privacy Compliance & Launch** | Planned | Formal WCAG 2.2 AA audit, PIPEDA/COPPA child safety validation, production deployment guide, user acceptance test matrix. |

---

## Phase 1 Detailed Implementation Checklist

- [x] **Project Scaffolding**:
  - Next.js 14/15 App Router with TypeScript and Tailwind CSS.
  - Lucide icons, Vitest test suite, and Playwright E2E configuration.
  - Base configuration files: `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`.
- [x] **Core Documentation**:
  - `README.md`, `AGENTS.md`, `.env.example`, `architecture.md`, `implementation_plan.md`, `curriculum-design.md`, `privacy-and-safety.md`, `test-plan.md`, `deployment-guide.md`.
- [x] **Data Schemas & Extensible Curriculum Structure (`src/curriculum`)**:
  - Define Zod types for Subjects, Courses, Units, Lessons, Questions, and Activities.
  - Implement 7 multi-grade verified demonstration modules:
    1. *Kindergarten Counting*: Fun with numbers 1 to 10 and visual animal counting.
    2. *Grade 4 Fractions*: Visual pizza fractions, numerators and denominators.
    3. *Grade 8 Science*: States of matter and thermal energy transfer.
    4. *High School Algebra*: Linear equations, slope-intercept form ($y = mx + b$).
    5. *College AI Introduction*: Machine learning vs rules-based programming, supervised vs unsupervised learning.
    6. *University ML Fundamentals*: Gradient descent, loss functions, overfitting vs underfitting.
    7. *Adult Digital Literacy*: Phishing detection, password security, two-factor authentication.
- [x] **State Management & Local Persistence (`src/lib/store`)**:
  - User profile store: Onboarding answers, learning preference (Visual, Audio, Reading/Writing, Hands-on, Mixed), daily goal minutes, age group.
  - Progress tracking store: Mastery scores, completed lessons, XP, current streak, review dates.
  - Accessibility settings: High contrast, text size scale (normal/large/xlarge), reduced motion.
  - Safe hydration from `localStorage` with initial state fallbacks.
- [x] **Interactive Onboarding Experience (`src/components/onboarding`)**:
  - Attractive welcome screen introducing *“Learn Your Way. Play Your Way. Grow Every Day.”*
  - 6-question multi-step wizard:
    1. Age group / education tier (Kindergarten, Elementary, High School, College, Adult/Senior).
    2. Subjects of interest.
    3. Main learning goal (School excellence, Skill building, Exam prep, Curiosity).
    4. Daily study commitment (5 min, 15 min, 30 min, 45 min+).
    5. Preferred learning style (Visual, Audio, Reading/Writing, Hands-on, Mixed).
    6. Optional diagnostic placement quiz.
  - Age-tailored messaging (parental supervision guidance for children).
- [x] **Dynamic Personalized Dashboard (`src/components/dashboard`)**:
  - "Continue Learning" active lesson card.
  - "Today's Mission" and daily goal progress meter.
  - Subject catalog browser with level filters.
  - Mastery and review center showing upcoming spaced repetition targets.
  - XP, level badges, and streak counter.
  - AI Tutor launch drawer / study companion modal.
  - Accessibility toolbar (high contrast, text scale, reduced motion).
- [x] **Interactive Lesson & Quiz Runner (`src/components/lesson`)**:
  - Lesson content viewer adapted to learning preference (visual aids, concise text, interactive elements).
  - Multiple choice quiz runner with immediate pedagogical feedback.
  - Progressive hint system (Hint 1 -> Hint 2 -> Explanation).
  - Retry capability without punitive failure locks.
  - Post-lesson summary awarding XP and calculating mastery.
- [x] **Testing & Verification Suite**:
  - Vitest unit tests for the deterministic adaptive engine, curriculum loader, and storage sync.
  - Component tests for the onboarding flow and quiz runner.
  - End-to-end browser verification tests.

---

## Phase 2: Authentication, Persistence & Role Architecture (Completed)

- [x] **Database & ORM Layer**:
  - Configured Prisma schema (`prisma/schema.prisma`) with support for SQLite (`dev.db`) locally and PostgreSQL in production.
  - Core models: `User`, `Profile`, `UserProgress`, `TopicMastery`, `QuizAttempt`, `Classroom`, `Account`, `Session`.
  - Created automated database seed script (`prisma/seed.ts`) with 4 seeded demo accounts:
    - Learner: `student@studyquest.ai` (Grade 4 Alex Explorer)
    - Parent: `parent@studyquest.ai` (Sarah Explorer)
    - Teacher: `teacher@studyquest.ai` (Mr. Henderson, manages cohort `QUEST4`)
    - Admin: `admin@studyquest.ai` (Platform administrator)
- [x] **Secure Authentication & RBAC**:
  - Implemented NextAuth.js JWT session handling (`src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`).
  - Added registration endpoint with Zod validation, bcrypt password hashing, and COPPA/PIPEDA guardian linkage for minors (`/api/auth/register`).
  - Created accessible Sign In / Sign Up modal with 1-click demo account presets (`src/components/auth/AuthModal.tsx`).
- [x] **Cloud Progress Sync Engine**:
  - Developed bidirectional synchronization endpoint (`/api/sync`) bridging local browser storage and Prisma database models.
  - Integrated debounced auto-sync into application store (`src/lib/store/useAppStore.tsx`).
- [x] **Supervised Role Portals**:
  - **Parent Supervision Portal** (`src/components/portals/ParentPortalModal.tsx` & `/api/family`): Linked children dashboard, screen time limiter, leaderboard visibility toggle, GDPR/PIPEDA account data export, and right-to-be-forgotten deletion flow.
  - **Teacher Classroom Portal** (`src/components/portals/TeacherPortalModal.tsx` & `/api/classroom`): Classroom cohort rosters, join codes (`QUEST4`), real-time student mastery analytics, level distribution, and streak monitoring.
  - **Admin System Portal** (`src/components/portals/AdminPortalModal.tsx`): System metrics, active user distribution by tier, database and AI provider health.
- [x] **Phase 2 Verification**:
  - 21 passing Vitest unit & integration tests covering scoring, curriculum, database operations, and authentication logic.
  - 10 passing Playwright E2E browser tests across both **Desktop Chrome** (1024px+) and **Mobile Chrome** (375px+).
  - 0-error production build (`next build`) across all 8 static and dynamic API routes.

---

## Phase 3: Personalized AI Tutor Engine & Gemini Integration (Completed)

- [x] **Server-Side AI Dispatcher (`src/lib/ai/engine.ts`, `src/lib/ai/prompts.ts`, `/api/tutor/chat`)**:
  - Live Gemini API integration using official `@google/genai` SDK (`gemini-1.5-flash`).
  - Intelligent deterministic Socratic engine (`DeterministicSocraticEngine`) providing pedagogical fallback when `GEMINI_API_KEY` is not present, offline, or network-blocked.
  - Rate-limited POST route (`/api/tutor/chat`) with IP sliding-window protection and Zod validation.
  - Persona system adapting to 5 education stages: Kindergarten (Questie the Fox), Elementary (Captain Quest), High School (QuestMentor), College (Professor Quest), and Adult (StudyQuest Advisor).
  - 5 pedagogical modes: Socratic Hints, Worked Examples, Teach-the-AI (Feynman technique), Practice Challenge Generator, and Mistake Breakdown.
- [x] **Safety, Privacy & COPPA/PIPEDA Compliance (`src/lib/ai/safety.ts`)**:
  - Automated client PII scrubbing redacting emails, phone numbers, postal codes, US zip codes, and credit cards before sending payloads.
  - Proactive safeguards blocking cheating queries ("do my test for me") with pedagogical encouragement.
  - Factual curriculum grounding citing approved lessons and refusing hallucinated facts.
- [x] **Multimodal Conversational UI (`src/components/tutor/AITutorModal.tsx`)**:
  - Tabbed mode switcher with instant quick-action prompts.
  - Interactive next-action follow-up buttons returned by the AI.
  - Web Speech API integration: SpeechRecognition for spoken input and SpeechSynthesis for read-aloud playback with 4-tier speed control (0.75x to 1.5x).
  - Responsive layout with isolated inner scroll container preserving viewport position across mobile (375px) and desktop viewports.
- [x] **Phase 3 Verification**:
  - 28 passing Vitest tests (7 dedicated tutor tests covering PII sanitization, content safety, prompt construction, and Socratic fallbacks).
  - 10 passing Playwright E2E browser tests across Desktop Chrome and Mobile Chrome.
  - 0-error production build (`next build`) across all 9 static and dynamic API routes.

---

## Phase 4: Full Multi-Modal Activity Components & Interactive Challenges (Next)

- [ ] **Interactive Activity Suite (`src/components/activities/`)**:
  - Fill-in-the-blank challenges with keyboard navigation.
  - Matching games and memory challenges with accessible tile-selection.
  - Drag-and-drop puzzles with keyboard ARIA alternative controls.
  - Flashcard challenges with flip animations and active recall confidence scoring.
  - Word searches and vocabulary challenges.
  - Science simulations & math problem solvers.
- [ ] **Spaced Repetition & Daily Review Center**:
  - Flashcard review queue powered by Leitner box scheduling.
  - Daily mission challenges with XP rewards.
- [ ] **Phase 4 Verification**:
  - Unit tests for activity state logic and scoring.
  - E2E browser tests covering all activity types across mobile and desktop.
