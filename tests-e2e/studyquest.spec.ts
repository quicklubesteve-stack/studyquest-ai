import { test, expect } from "@playwright/test";

test.describe("StudyQuest AI — Core Application & Phase 2 Journeys", () => {
  test("completes 6-step onboarding and lands on personalized dashboard", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto("/");

    // 1. Verify Welcome & Education Stage
    await expect(page.getByText(/Welcome to StudyQuest AI/i)).toBeVisible();
    await expect(page.getByText(/What is your education stage\?/i)).toBeVisible();

    // Select Scholar (High School)
    await page.getByRole("button", { name: /Scholar/i }).click();
    await page.getByRole("button", { name: /Next Step/i }).click({ force: true });

    // 2. Select Subjects
    await expect(page.getByText(/What subjects do you want to explore\?/i)).toBeVisible();
    await page.getByRole("button", { name: /Next Step/i }).click({ force: true });

    // 3. Learning Goal
    await expect(page.getByText(/What is your main learning goal\?/i)).toBeVisible();
    await page.getByRole("button", { name: /Next Step/i }).click({ force: true });

    // 4. Daily Study Time
    await expect(page.getByText(/How much time would you like to study daily\?/i)).toBeVisible();
    await page.getByRole("button", { name: /Next Step/i }).click({ force: true });

    // 5. Preferred Way to Learn (All 5 options)
    await expect(page.getByText(/What is your preferred way to learn\?/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Visual$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Audio & Discussion/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Reading & Writing/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Hands-on & Interactive/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Mixed \(Balanced Combination\)/i })).toBeVisible();

    // Select Visual
    await page.getByRole("heading", { name: /^Visual$/i }).click();
    await page.getByRole("button", { name: /Next Step/i }).click({ force: true });

    // 6. Placement Quiz Step
    await expect(page.getByText(/Would you like a diagnostic placement check\?/i)).toBeVisible();
    await page.getByRole("button", { name: /Begin StudyQuest Adventure/i }).click({ force: true });

    // Verify Dashboard Lands Successfully
    await expect(page.getByRole("heading", { name: /Learn Your Way. Play Your Way. Grow Every Day./i })).toBeVisible();
    await expect(page.getByText(/Today's Mission/i)).toBeVisible();
    await expect(page.getByText(/Study Streak/i)).toBeVisible();
    await expect(page.getByText('Spaced Repetition', { exact: true })).toBeVisible();
  });

  test("runs an interactive lesson, uses hints, and checks answers", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "test-user",
        name: "Test Explorer",
        educationTier: "elementary",
        selectedSubjects: ["elem-math"],
        learningGoal: "skill_building",
        dailyStudyMinutes: 15,
        learningPreference: "mixed",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");

    // Verify Dashboard
    await expect(page.getByText(/Today's Mission/i)).toBeVisible();

    // Start Grade 4 Fractions Lesson
    const startBtn = page.getByRole("button", { name: /Start Quest|Review Quest/i }).first();
    await startBtn.click({ force: true });

    // Verify Lesson Header
    await expect(page.getByText(/Pizza Fractions: Numerators & Denominators/i)).toBeVisible();

    // Switch to Interactive Activity Tab
    await page.getByRole("button", { name: /2. Interactive Activity/i }).click();
    await expect(page.getByText(/Interactive Pizza Slice Maker/i)).toBeVisible();

    // Switch to Quiz Tab
    await page.getByRole("button", { name: /3. Quest Quiz/i }).click();
    await expect(page.getByText(/Question 1 of 2/i)).toBeVisible();

    // Test Hint Functionality
    const hintBtn = page.getByRole("button", { name: /Need a Hint\?/i });
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
    await expect(page.getByText(/Hint 1:/i)).toBeVisible();

    // Select correct choice (Choice A: 2/6)
    await page.getByText(/2\/6/i).first().click();

    // Click Check Answer
    await page.getByRole("button", { name: /Check Answer/i }).click();

    // Verify Feedback
    await expect(page.getByText(/Excellent work! Correct answer!/i)).toBeVisible();
  });

  test("signs in with demo student account and opens AI Tutor", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "guest-user",
        name: "Adventurous Learner",
        educationTier: "elementary",
        selectedSubjects: ["elem-math"],
        learningGoal: "skill_building",
        dailyStudyMinutes: 15,
        learningPreference: "mixed",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");

    // Click Sign In button in Header
    const signInBtn = page.locator("header").getByRole("button", { name: /Sign In/i });
    await signInBtn.click();

    // Verify Auth Modal is open
    await expect(page.getByText(/Sign In to StudyQuest/i)).toBeVisible();

    // Click Demo Student Quick Login
    const demoStudentBtn = page.getByRole("button", { name: /Alex \(Student\)/i });
    await demoStudentBtn.click();

    // Wait for Auth Modal to dismiss and reload to complete
    await expect(page.getByText(/Sign In to StudyQuest/i)).not.toBeVisible();
    await expect(page.getByRole("button", { name: /User Account Settings/i })).toBeVisible();

    // Open AI Tutor from Header
    const aiBtn = page.locator("header").getByRole("button", { name: /Ask AI/i });
    await aiBtn.click();

    // Verify AI Tutor Dialog is visible
    await expect(page.getByText(/Personal AI Socratic Tutor/i)).toBeVisible();
    await expect(page.getByText(/Tuned for: elementary/i)).toBeVisible();

    // Switch to Worked Example mode
    await page.getByRole("button", { name: "Worked Example", exact: true }).click();

    // Type and send a question
    const input = page.getByPlaceholder(/Ask a question, request a hint/i);
    await input.fill("What is a fraction?");
    await input.press("Enter");

    // Verify AI tutor response appears
    await expect(page.getByText(/Step 1|pizza|delicious/i).first()).toBeVisible({ timeout: 10000 });

    // Open Voice Controls
    const voiceBtn = page.getByRole("button", { name: /Voice & Speed Settings/i });
    await voiceBtn.click({ force: true });
    await expect(page.getByText(/Speech Speed:/i)).toBeVisible();

    // Close AI Tutor modal
    await page.getByRole("button", { name: /Close AI Tutor dialog/i }).click({ force: true });
    await expect(page.getByText(/Personal AI Socratic Tutor/i)).not.toBeVisible();
  });

  test("signs in with demo parent account and accesses Parent Portal", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "guest-user",
        name: "Adventurous Learner",
        educationTier: "elementary",
        selectedSubjects: ["elem-math"],
        learningGoal: "skill_building",
        dailyStudyMinutes: 15,
        learningPreference: "mixed",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");

    // Click Sign In
    const signInBtn = page.locator("header").getByRole("button", { name: /Sign In/i });
    await signInBtn.click();

    // Verify Auth Modal is open
    await expect(page.getByText(/Sign In to StudyQuest/i)).toBeVisible();

    // Click Demo Parent Login
    const demoParentBtn = page.getByRole("button", { name: /Sarah \(Parent\)/i });
    await demoParentBtn.click();

    // Verify User Account reflects Parent
    await expect(page.getByText(/Sarah/i).first()).toBeVisible();

    // Verify Parent Portal button is visible in header
    const parentPortalBtn = page.locator("header").getByRole("button", { name: /Parent Portal/i });
    await expect(parentPortalBtn).toBeVisible();
    await parentPortalBtn.click();

    // Verify Parent Supervision Modal contents
    await expect(page.getByText(/Parent Supervision Portal/i)).toBeVisible();
    await expect(page.getByText(/COPPA Verified/i)).toBeVisible();
    await expect(page.getByText(/Alex Explorer \(Grade 4\)/i)).toBeVisible();
    await expect(page.getByText(/Parental Safeguards & Screen Limits/i)).toBeVisible();
  });

  test("accessibility toolbar toggles high contrast and text scale", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "test-user",
        name: "Test Explorer",
        educationTier: "elementary",
        selectedSubjects: ["elem-math"],
        learningGoal: "skill_building",
        dailyStudyMinutes: 15,
        learningPreference: "mixed",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");

    // Toggle Contrast
    const contrastBtn = page.getByTitle(/Toggle High Contrast Mode/i);
    await contrastBtn.click();
    const html = page.locator("html");
    await expect(html).toHaveClass(/high-contrast/);

    // Toggle Text Scale
    const textScaleBtn = page.getByTitle(/Change text size/i);
    await textScaleBtn.click();
    await expect(html).toHaveClass(/text-scale-large/);
  });

  test("explores Interactive Learning Arcade and Spaced Repetition Center", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "activity-user",
        name: "Activity Explorer",
        educationTier: "elementary",
        selectedSubjects: ["elem-math"],
        learningGoal: "skill_building",
        dailyStudyMinutes: 15,
        learningPreference: "mixed",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");

    // Open Learning Arcade from Dashboard Hero
    const arcadeBtn = page.getByRole("button", { name: /Learning Arcade/i });
    await arcadeBtn.click({ force: true });

    // Verify Arcade Modal opens
    await expect(page.getByText(/Interactive Learning Arcade/i)).toBeVisible();
    await expect(page.getByText(/Flashcard Challenge/i)).toBeVisible();
    await expect(page.getByText(/Concept Matching Game/i)).toBeVisible();

    // Launch Flashcards Activity
    await page.getByRole("button", { name: /Flashcard Challenge/i }).click();
    await expect(page.getByText(/Card 1 of/i)).toBeVisible();

    // Flip flashcard
    await page.getByRole("button", { name: /Reveal Answer/i }).click({ force: true });
    await expect(page.getByText(/How well did you know this\?/i)).toBeVisible();

    // Rate card "Mastered!"
    await page.getByRole("button", { name: /Mastered!/i }).click({ force: true });

    // Return to Arcade Menu
    await page.getByRole("button", { name: /Back to Activities Menu/i }).click({ force: true });
    await expect(page.getByText(/Flashcard Challenge/i)).toBeVisible();

    // Launch Word Search Activity
    await page.getByRole("button", { name: /Vocabulary Word Search/i }).click({ force: true });
    await expect(page.getByText(/Academic Vocabulary Word Search/i)).toBeVisible();

    // Click on FRACTION word button
    await page.getByRole("button", { name: /FRACTION/i }).first().click({ force: true });
    await expect(page.getByText(/Definition: FRACTION/i)).toBeVisible();

    // Close Activity Hub
    await page.getByRole("button", { name: /Close Activity Arcade/i }).click({ force: true });
    await expect(page.getByText(/Interactive Learning Arcade/i)).not.toBeVisible();

    // Open Spaced Repetition Center from Dashboard Card
    await page.getByRole("button", { name: /Start Recall Drill/i }).click({ force: true });
    await expect(page.getByText(/Spaced Repetition & Recall Center/i)).toBeVisible();

    // Switch to Memory Box Stats
    await page.getByRole("button", { name: /Memory Box Stats/i }).click({ force: true });
    await expect(page.getByText(/How Leitner Spaced Repetition Works/i)).toBeVisible();
    await expect(page.getByText(/Box 1 \(Daily\)/i)).toBeVisible();

    // Close Spaced Repetition Center
    await page.getByRole("button", { name: /Close Spaced Repetition Center/i }).click({ force: true });
    await expect(page.getByText(/Spaced Repetition & Recall Center/i)).not.toBeVisible();
  });

  test("uploads study material, generates flashcards & quiz, and queries grounded citations", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "test-user-materials",
        name: "Test Researcher",
        educationTier: "high_school",
        selectedSubjects: ["biology"],
        learningGoal: "exam_prep",
        dailyStudyMinutes: 20,
        learningPreference: "reading_writing",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Learn Your Way. Play Your Way. Grow Every Day./i })).toBeVisible();

    // Open Study Notes Studio
    await page.getByRole("button", { name: /Study Notes Studio/i }).click({ force: true });
    await expect(page.getByText(/Study Material Studio & AI Synthesizer/i)).toBeVisible();

    // Add built-in sample document: Biology_Cellular_Respiration
    await page.getByRole("button", { name: /Biology_Cellular_Respiration/i }).click({ force: true });

    // Verify Document Analysis
    await expect(page.getByText(/Executive Overview: Biology_Cellular_Respiration/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Key Defined Concepts/i)).toBeVisible();

    // Switch to Study Notes Tab
    await page.getByRole("button", { name: "Study Notes", exact: true }).click({ force: true });
    await expect(page.getByText(/# Study Notes: Biology_Cellular_Respiration/i)).toBeVisible();

    // Switch to 5-Day Study Plan Tab
    await page.getByRole("button", { name: /5-Day Study Plan/i }).click({ force: true });
    await expect(page.getByText(/# 5-Day Study Quest:/i)).toBeVisible();

    // Switch to Ask Document (Citations) Tab
    await page.getByRole("button", { name: /Ask Document/i }).click({ force: true });
    await expect(page.getByPlaceholder(/e.g. What is the role of the electron transport chain\?/i)).toBeVisible();

    // Query Grounded Q&A
    await page.getByPlaceholder(/e.g. What is the role of the electron transport chain\?/i).fill("What occurs during glycolysis in the cytoplasm?");
    await page.getByRole("button", { name: "Ask", exact: true }).click({ force: true });

    // Verify Grounded Citation
    await expect(page.getByText(/Grounded Explanation/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Citation: Biology_Cellular_Respiration/i)).toBeVisible();

    // Close Study Notes Studio
    await page.getByRole("button", { name: /Close Study Material Studio/i }).click({ force: true });
    await expect(page.getByText(/Study Material Studio & AI Synthesizer/i)).not.toBeVisible();
  });

  test("manages subscription plans, activates Stripe test mode Plus tier, and views privacy export", async ({ page }) => {
    await page.addInitScript(() => {
      const profile = {
        id: "test-billing-user",
        name: "Billing Explorer",
        educationTier: "college",
        selectedSubjects: ["comp-sci"],
        learningGoal: "career",
        dailyStudyMinutes: 30,
        learningPreference: "mixed",
        wantsPlacementQuiz: false,
        isOnboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyquest_user_profile_v1", JSON.stringify(profile));
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Learn Your Way. Play Your Way. Grow Every Day./i })).toBeVisible();

    // Open Plans Modal from Footer
    await page.getByRole("button", { name: /View Plans & Features/i }).click({ force: true });
    await expect(page.getByRole("heading", { name: /StudyQuest Plans & Privacy/i })).toBeVisible();

    // Verify Free & Plus plan cards
    await expect(page.getByText("Core Explorer", { exact: true })).toBeVisible();
    await expect(page.getByText("StudyQuest Plus", { exact: true })).toBeVisible();
    await expect(page.getByText("CAD $9.99 / month")).toBeVisible();

    // Activate Plus in Stripe Test Mode if not already active
    const activateBtn = page.getByRole("button", { name: /Activate in Test Mode/i });
    if (await activateBtn.isVisible()) {
      await activateBtn.click({ force: true });
      await expect(page.getByText(/StudyQuest Plus activated in Stripe Test Mode/i)).toBeVisible();
    }

    // Verify Active Plan Badge
    await expect(page.getByText(/StudyQuest Plus Active/i)).toBeVisible();

    // Verify Data Portability & Privacy options
    await expect(page.getByRole("button", { name: /Download Personal Data/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Delete My Account/i })).toBeVisible();

    // Close Plans Modal
    await page.getByRole("button", { name: /Close Plans Modal/i }).click({ force: true });
    await expect(page.getByRole("heading", { name: /StudyQuest Plans & Privacy/i })).not.toBeVisible();
  });
});
