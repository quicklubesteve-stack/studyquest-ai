# Curriculum Design & Standards — StudyQuest AI

## 1. Pedagogical Framework
StudyQuest AI is designed around an extensible, competency-based curriculum framework. Knowledge is structured into a hierarchical taxonomy:

$$\text{Subject} \longrightarrow \text{Course} \longrightarrow \text{Unit} \longrightarrow \text{Lesson} \longrightarrow \text{Skill} \longrightarrow (\text{Interactive Activity} + \text{Assessment Questions})$$

### Core Instructional Principles:
1. **Low Floor, High Ceiling**: Accessible entry points for beginners, with extensible depth for advanced students.
2. **Multi-Modal Representations**: Every concept offers visual, textual, spoken, and tactile interactive explanations.
3. **Active Recall & Spaced Repetition**: Concepts resurface systematically before forgetting occurs.
4. **Formative Assessment with Socratic Guidance**: Questions diagnose misconceptions rather than merely assigning marks.
5. **No Negative Punishments**: Mistakes are treated as valuable learning signals. Children are never penalized or locked out for missing a day.

---

## 2. Age-Specific Adaptations & Learning Worlds

| Tier | Name | Target Learners | Cognitive & UI Focus | Key Subject Themes |
| :--- | :--- | :--- | :--- | :--- |
| **K** | **Early Explorer** | Ages 4–6 (Kindergarten) | Auditory prompts, oversized touch targets, gamified animal companions, counting, phonics, color puzzles. | Math Basics, Early Reading, Shapes & Colors |
| **Elem** | **Junior Adventurer** | Ages 7–11 (Grades 1–5) | Narrative quests, visual fraction pizzas, exploratory science simulations, spelling challenges. | Elementary Math, Science, Reading, Geography |
| **Middle/High** | **Scholar Quest** | Ages 12–18 (Grades 6–12) | Step-by-step algebraic manipulation, scientific inquiry, essay breakdown, timed practice. | Algebra, Biology, Chemistry, World History, Coding |
| **College** | **University Academy** | Higher Ed / Pre-Professional | Algorithmic logic, theoretical foundations, data science, academic papers, case studies. | AI & ML, Statistics, Computer Science, Economics |
| **Adult** | **Lifelong Studio** | Adults & Seniors | High contrast, clear navigation, practical daily utility, cybersecurity, financial literacy, memory exercises. | Digital Literacy, Everyday Finance, Practical Tech |

---

## 3. Seven Verified Sample Demonstration Modules

### Module 1: Kindergarten Counting (Math)
- **ID**: `k-math-counting-10`
- **Objective**: Count objects from 1 to 10 with 1-to-1 correspondence.
- **Activity**: Visual farmyard counter where clicking animals plays sounds and increments the count.
- **Quiz**: "How many playful puppies are in the yard?" (Choices: 3, 4, 5, 6; Visual representation provided).
- **Explanation**: "Let's count together: 1, 2, 3, 4, 5 puppies! Each puppy counts for one number."

### Module 2: Grade 4 Fractions (Math)
- **ID**: `g4-math-fractions-intro`
- **Objective**: Understand numerators and denominators using parts of a whole (pizza slices).
- **Activity**: Interactive slice selector dividing a whole pie into equal portions.
- **Quiz**: "If a pizza is cut into 8 equal slices and you eat 3 slices, what fraction did you eat?" (Choices: 3/8, 5/8, 3/5, 8/3).
- **Hint 1**: "The bottom number (denominator) is the total slices. The top number (numerator) is the slices eaten."
- **Explanation**: "The denominator 8 represents all equal slices in the whole pizza. The numerator 3 counts how many you ate: $\frac{3}{8}$."

### Module 3: Grade 8 Science — States of Matter
- **ID**: `g8-sci-matter-energy`
- **Objective**: Relate molecular motion and thermal energy to phase transitions (solid, liquid, gas).
- **Activity**: Particle simulation showing molecules vibrating in ice, flowing in liquid, and bouncing in steam.
- **Quiz**: "What happens to water molecules when thermal energy (heat) is added to liquid water?"
- **Choices**: They stop moving, they move faster and spread farther apart, they bond permanently, they lose mass.
- **Explanation**: "Heating adds kinetic energy, causing molecules to overcome intermolecular bonds and move faster into vapor."

### Module 4: High School Algebra — Linear Equations
- **ID**: `hs-alg-linear-slope`
- **Objective**: Understand slope-intercept form ($y = mx + b$), where $m$ is rate of change and $b$ is the y-intercept.
- **Activity**: Interactive graph slider showing how altering $m$ steepens the line and altering $b$ shifts it vertically.
- **Quiz**: "In the equation $y = 3x - 5$, what is the slope and where does the line cross the y-axis?"
- **Choices**: Slope 3 and cross at $(0, -5)$; Slope $-5$ and cross at $(0, 3)$; Slope 3 and cross at $(5, 0)$; Slope $-5$ and cross at $(-5, 0)$.
- **Explanation**: "In $y = mx + b$, $m$ is the slope ($3$) and $b$ is the y-intercept ($-5$). The line crosses the y-axis at $(0, -5)$."

### Module 5: College Intro to AI — Symbolic vs Machine Learning
- **ID**: `col-ai-intro-paradigms`
- **Objective**: Contrast rules-based expert systems with statistical machine learning algorithms.
- **Activity**: Flowchart diagram comparing "Data + Rules = Answers" vs "Data + Answers = Rules".
- **Quiz**: "Which statement best describes the fundamental shift introduced by machine learning over classical expert systems?"
- **Choices**: ML requires humans to write every if-then rule, ML algorithms infer patterns and rules directly from training data, ML can only work without mathematical operations, ML cannot process text.
- **Explanation**: "In classical AI, engineers write explicit if-then rules. In machine learning, algorithms learn statistical patterns directly from data."

### Module 6: University Machine Learning — Gradient Descent & Overfitting
- **ID**: `uni-ml-gradient-descent`
- **Objective**: Formulate the gradient descent optimization step: $\theta_{new} = \theta - \alpha \nabla J(\theta)$ and diagnose overfitting.
- **Activity**: Interactive loss curve visualizer comparing training loss vs validation loss across epochs.
- **Quiz**: "If training loss continues to decrease toward zero while validation loss starts increasing significantly after epoch 20, what is happening?"
- **Choices**: Underfitting, Overfitting, Convergence to global minimum, Learning rate is too small.
- **Explanation**: "When training loss falls while validation loss rises, the model is memorizing noise in the training set and failing to generalize (overfitting)."

### Module 7: Adult Digital Literacy — Phishing & Account Security
- **ID**: `adult-dig-sec-passwords`
- **Objective**: Identify phishing indicators, use multi-factor authentication (MFA), and build secure passphrases.
- **Activity**: Email inspector highlighting deceptive sender domains, urgent scare tactics, and fake link targets.
- **Quiz**: "You receive an urgent email from 'support@paypa1-security-alert.com' asking you to click immediately to unlock your account. What is the safest response?"
- **Choices**: Click the link right away, Reply with your password, Mark as phishing/delete it and independently check the official website, Forward to all friends.
- **Explanation**: "The domain uses a spoofed character ('1' for 'l') and urgent pressure tactics. Never click suspicious links; navigate to the known official site directly."
