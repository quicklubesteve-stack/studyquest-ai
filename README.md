# StudyQuest AI
> *“Learn Your Way. Play Your Way. Grow Every Day.”*

StudyQuest AI is an interactive, multi-generation, AI-powered educational web application designed for learners from kindergarten through senior adulthood. It combines an extensible curriculum system, an adaptive learning and scoring engine, interactive activities, and personalized study companion features.

---

## 🌟 Core Features (Phase 1)
- **Multi-Age Onboarding & Personalization**:
  - 6-step guided onboarding assessing education tier, subjects, learning goals, daily commitment, and learning preference (Visual, Audio, Reading/Writing, Hands-on, Mixed).
  - Diagnostic placement option and dynamic interface adaptations.
- **Unified Learning Dashboard**:
  - Quick-resume "Continue Learning" cards.
  - "Today's Mission" progress tracker.
  - Subject catalog with tier filters.
  - Mastery and spaced repetition review scheduler.
  - XP counter, levels, streaks, and achievement badges.
- **Extensible Multi-Grade Curriculum**:
  - Sample verified lessons spanning 7 education tiers:
    1. **Kindergarten**: Counting 1 to 10 with interactive visual animals
    2. **Grade 4**: Introduction to Fractions with visual pizza slices
    3. **Grade 8**: States of Matter & Thermal Kinetic Energy
    4. **High School**: Linear Equations & Slope-Intercept Form ($y = mx + b$)
    5. **College**: Introduction to AI & Symbolic vs Machine Learning
    6. **University**: Machine Learning Fundamentals (Gradient Descent & Overfitting)
    7. **Adult / Senior**: Digital Literacy & Phishing Defense
- **Interactive Quiz & Activity Runner**:
  - Multi-step quizzes with pedagogical hints, retry mechanisms, and clear feedback.
  - Non-punitive scoring engine: hints reduce hint penalty, but mistakes guide students rather than locking them out.
- **Local Persistence & State Sync**:
  - Browser local-storage sync ensures progress, preferences, streaks, and quiz history persist across page reloads.
  - Profile reset and export tools.
- **Accessibility & Inclusion (WCAG 2.2 AA)**:
  - High contrast mode.
  - 3-tier font size scaling.
  - Reduced motion mode.
  - Full keyboard navigation and ARIA landmarks.

---

## 🛠️ Quick Start (Windows)

### 1. Prerequisites
- Node.js (v18.18 or v20+ recommended)
- Windows PowerShell or Command Prompt

### 2. Setup & Installation
```powershell
# Navigate to project folder
cd "c:\Users\steve\OneDrive\Desktop\study app"

# Copy local environment config
Copy-Item .env.example .env.local

# Install dependencies
npm.cmd install
```

### 3. Run the Development Server
```powershell
npm.cmd run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Automated Tests
```powershell
# Run unit & integration test suite
npm.cmd test

# Run Playwright E2E browser tests
npm.cmd run test:e2e
```

---

## 📚 Project Documentation
- **[architecture.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/architecture.md)**: Full system architecture, layers, and tech stack rationale.
- **[implementation_plan.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/implementation_plan.md)**: 7-phase roadmap and detailed checklists.
- **[curriculum-design.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/curriculum-design.md)**: Extensible schema and pedagogical breakdown for all 7 modules.
- **[privacy-and-safety.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/privacy-and-safety.md)**: Child protection, COPPA/PIPEDA compliance guidelines, role permissions.
- **[test-plan.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/test-plan.md)**: Test levels, multi-age test matrix, and accessibility verification.
- **[deployment-guide.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/deployment-guide.md)**: Local run and cloud deployment instructions.
- **[AGENTS.md](file:///c:/Users/steve/OneDrive/Desktop/study%20app/AGENTS.md)**: Rules of engagement for coding agents and contributors.
