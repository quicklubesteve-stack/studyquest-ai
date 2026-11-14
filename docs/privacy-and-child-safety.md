# StudyQuest AI — Privacy, Child Safety & Regulatory Compliance Framework

**Slogan**: *“Learn Your Way. Play Your Way. Grow Every Day.”*  
**Date**: November 2026  
**Status**: Comprehensive Privacy & Child Safety Architecture  

---

## 1. Executive Summary & Compliance Mandate
StudyQuest AI is designed as a safe, ethical, multi-generational educational platform serving learners from Kindergarten through University and lifelong adult learning. Protecting the privacy, psychological well-being, and academic integrity of learners—especially young children—is foundational to every architectural and pedagogical choice in this application.

This framework documents compliance with:
1. **Canada**: Personal Information Protection and Electronic Documents Act (**PIPEDA**) and provincial privacy statutes (Quebec Law 25, BC PIPA, Alberta PIPA).
2. **United States**: Children’s Online Privacy Protection Act (**COPPA**, 16 CFR Part 312).
3. **International**: General Data Protection Regulation for Children (**GDPR-K**) and ISO/IEC 27001 data protection standards.
4. **Accessibility**: Web Content Accessibility Guidelines (**WCAG 2.2 AA**).

---

## 2. Child Safety & AI Guardrails

### A. Zero Targeted Advertising & Zero Data Commercialization
- **No Commercial Profiling**: StudyQuest AI never displays advertisements, sponsors, or commercial marketing to learners.
- **No Data Sale**: Learner data, study telemetry, speech transcripts, and uploaded materials are never sold, rented, or monetized.

### B. Anti-Cheating & Socratic Pedagogy
- The AI Tutor operates under strict deterministic instructional guardrails.
- It will **never complete homework assignments or provide raw answers directly** without guided step-by-step reasoning.
- Prompts are dynamically filtered to encourage critical thinking, reflection, and active recall.

### C. Personal Identifiable Information (PII) Scrubbing
All AI Tutor inputs and outputs pass through an automated regex and heuristic PII scrubber before processing:
- **Redacted Data**: Email addresses, phone numbers, postal/ZIP codes, Social Insurance Numbers (SIN / SSN), credit card numbers, and physical addresses.
- Redacted strings are sanitized with `[REDACTED_*]` tokens before transmission to model providers.

### D. Age-Appropriate Content Isolation & Walled Gardens
- Children under 13 have strictly isolated individual workspaces.
- **No Unrestricted Public Chat**: Children cannot participate in open, unmonitored direct messaging or public broadcast forums.
- **Parental Oversight**: Parents have dedicated dashboards to review topics mastered, hints accessed, time spent, and Leitner box spaced repetition health.

---

## 3. Canadian PIPEDA & US COPPA Regulatory Principles

| Regulatory Principle | Implementation in StudyQuest AI |
| :--- | :--- |
| **Accountability (Principle 1)** | Dedicated privacy contact and automated role-based permission gates. |
| **Identifying Purposes (Principle 2)** | Data collection is strictly limited to instructional personalization, level mastery calculations, and spaced repetition scheduling. |
| **Consent & Parental Verification (Principle 3 / COPPA §312.5)** | Explicit consent during onboarding; parental account linkage for children under 13. |
| **Limiting Collection (Principle 4)** | Minimal data intake. Anonymous demo explorer accounts supported; no unnecessary demographic harvesting. |
| **Limiting Use, Disclosure & Retention (Principle 5)** | Data retained only while the account is active. Inactive data purged upon request. |
| **Accuracy (Principle 6)** | Deterministic scoring engine with verified academic curricula and audited math algorithms. |
| **Safeguards (Principle 7)** | Bcrypt password hashing, session tokens, rate limiting, and encrypted transport (HTTPS/TLS 1.3). |
| **Openness & Individual Access (Principle 8 & 9 / Data Portability)** | Real-time automated data export endpoint (`/api/user/export`) generating complete machine-readable JSON records. |
| **Right to Erasure / Deletion (COPPA §312.6 / PIPEDA Principle 5)** | Real-time automated account deletion endpoint (`/api/user/delete`) executing cascade deletion of all user records. |

---

## 4. Accessibility Conformance (WCAG 2.2 AA)
StudyQuest AI incorporates universal design principles to ensure every learner can participate:
- **Keyboard Operability**: 100% of interactive components (quizzes, flashcard flipping, drag-and-drop puzzles, word search, modals) are operable via Tab, Enter, Space, and Arrow keys with high-visibility focus indicators.
- **Alternative Controls**: Drag-and-drop puzzles feature dedicated "Move Up" and "Move Down" buttons for learners using screen readers or motor accessibility switches.
- **Dynamic Text Scaling**: Integrated toolbar supports Normal (100%), Medium (112%), and Large (125%) font scaling without breaking responsive layouts.
- **High Contrast Theme**: Meets or exceeds the 4.5:1 contrast ratio for body text and 3:1 for large graphical headings.
- **Motion Reduction**: Complies with `prefers-reduced-motion` to eliminate distracting or vestibular-triggering animations.
- **Multi-Modal Learning**: Audio text-to-speech with speed controls (0.75x to 1.5x) accompanied by synchronized visual text captions.

---

## 5. Billing Ethics & Commercial Boundaries
- **Configurable Proposed Plus Tier**: CAD $9.99/month for StudyQuest Plus.
- **Zero Dark Patterns**: Essential core educational curriculum across all grade levels remains 100% free and unrestricted.
- **Stripe Test Mode Isolation**: Secret API keys (`STRIPE_SECRET_KEY`) reside exclusively in server-side environment variables and are never bundled into client browser code.
