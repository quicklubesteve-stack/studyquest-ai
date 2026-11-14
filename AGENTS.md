# AGENTS.md — Agent Working Rules for StudyQuest AI

This document establishes the mandatory rules of engagement for all human and AI contributors, coding agents, and subagents working on the **StudyQuest AI** codebase.

## 1. Prime Directives
1. **Test After Implementing Each Feature**: Every new component, data utility, or workflow must have accompanying unit, integration, or browser tests. Never mark a task complete without running and validating tests.
2. **Never Expose API Keys or Secrets**:
   - Never hardcode API keys, service role credentials, Stripe private keys, or AI provider secrets.
   - Keep secrets strictly in `.env.local` (or environment variables) and verify `.env*` is in `.gitignore`.
   - Never expose server-only variables in client components (do not prefix secret keys with `NEXT_PUBLIC_`).
3. **Do Not Fabricate Working Functionality**:
   - Never implement non-functional dummy buttons or placeholder alerts masquerading as completed features.
   - If a feature is scheduled for a future phase (e.g., live Stripe checkout or active server-side voice streaming), clearly state its phase status, provide safe fallbacks, and log or display clear user notifications.
4. **Verify Responsive Layouts**:
   - Verify every UI screen across mobile (375px+), tablet (768px+), and desktop (1024px+) viewports.
   - Ensure touch targets are at least 44x44px for accessibility.
5. **Use Age-Appropriate Educational Content**:
   - Strictly tailor vocabulary, tone, iconography, and reading level to the user's selected education stage (Kindergarten, Elementary, High School, College/University, Adult/Senior).
   - Ensure learning materials are scientifically and academically factual, verified, and free of bias or manipulative patterns.
6. **Preserve Existing Working Features**:
   - Run the regression test suite before and after making edits.
   - Refactor cautiously; do not break existing routes, state models, or interfaces.
7. **Document Unfinished Work**:
   - Always keep a transparent log in `implementation_plan.md` and phase summaries noting what is fully functional, what is stubbed, and what is planned for future phases.
8. **Fix Failing Tests Before Moving On**:
   - Zero tolerance for broken tests. If a test fails, diagnose and resolve the root cause before starting new features.

---

## 2. Code Quality & Architecture Standards
- **Strict TypeScript**: No implicit `any`. Use comprehensive interfaces and Zod schemas for runtime validation of all external inputs and AI payloads.
- **Accessible UI (WCAG 2.2 AA)**:
  - All interactive elements must be keyboard focusable with visible focus rings.
  - Provide ARIA landmarks, roles, and alternative inputs for drag-and-drop or timed games.
  - Maintain color contrast ratios of at least 4.5:1 for normal text and 3:1 for large text.
  - Respect `prefers-reduced-motion` and user font-size preferences.
- **Deterministic Learning Engine**:
  - Mastery scores, XP calculations, and level progressions must use deterministic, audited math algorithms — not non-deterministic raw AI outputs.
  - AI may generate hints, explanations, and personalized suggestions, but never grade directly without validation rules.
- **Local-First & Resilient Persistence**:
  - Phase 1 relies on reliable browser persistence (local storage with fallback), migrating seamlessly to PostgreSQL + Prisma in Phase 2.
  - State stores must fail gracefully if storage is restricted or unavailable.
