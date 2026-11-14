import { SubjectCategory, Lesson } from "@/types";

export const SAMPLE_CURRICULUM: SubjectCategory[] = [
  // 1. Kindergarten Counting
  {
    id: "early-math",
    title: "Playful Math & Numbers",
    tier: "kindergarten",
    icon: "Sparkles",
    description: "Joyful early counting, number recognition, and animal friends for young explorers.",
    lessons: [
      {
        id: "k-math-counting-10",
        subjectId: "early-math",
        courseTitle: "Adventures in Numberland",
        title: "Counting Happy Animals: 1 to 10",
        tier: "kindergarten",
        summary: "Learn to count friendly farmyard animals one by one up to ten!",
        estimatedMinutes: 5,
        visualSummary: "Five friendly yellow chicks chirping on green grass.",
        audioNarration: "Welcome little explorer! Let's count our friendly animal pals together. Tap each animal as we count!",
        contentMarkdown: `
# Let's Count to 5! 🐣

Numbers help us count all the amazing things around us! 

When we count, we touch or point to each friend once and say the magic counting words:
- **1** (One little puppy wagging its tail!) 🐶
- **2** (Two fluffy kittens playing with yarn!) 🐱🐱
- **3** (Three bouncy bunnies hopping high!) 🐰🐰🐰
- **4** (Four chirpy birds singing songs!) 🐦🐦🐦🐦
- **5** (Five happy little ducklings swimming in the pond!) 🦆🦆🦆🦆🦆

### Remember:
Every animal gets **one** number. That tells us **how many** there are altogether!
`,
        keyTakeaways: [
          "Counting tells us 'how many' things we have.",
          "We say one number for each item we touch.",
          "1, 2, 3, 4, 5 are our first five counting friends!",
        ],
        activity: {
          id: "act-k-count",
          title: "Farmyard Animal Counter",
          instruction: "Tap on the ducklings to count them into the pond!",
          type: "interactive_counter",
          data: {
            itemEmoji: "🦆",
            itemName: "ducklings",
            targetCount: 5,
          },
        },
        quiz: [
          {
            id: "k-quiz-1",
            prompt: "Look at the sunny pond! There are 🦆 🦆 🦆 ducklings swimming happily. How many ducklings do you see?",
            choices: ["2 ducklings", "3 ducklings", "5 ducklings", "1 duckling"],
            correctIndex: 1,
            explanation: "Great job! Let's count together: One 🦆, Two 🦆, Three 🦆! There are 3 ducklings!",
            hints: [
              "Point your finger to each duckling and say 1... 2...",
              "After 2 comes the number 3!",
            ],
            sourceReference: "StudyQuest Early Explorer Math Standards, Section K.CC.B.4",
            difficulty: "beginner",
          },
          {
            id: "k-quiz-2",
            prompt: "If you have 4 bouncy bunnies 🐰🐰🐰🐰 and 1 more bunny hops over, how many bunnies do you have now?",
            choices: ["3 bunnies", "4 bunnies", "5 bunnies", "10 bunnies"],
            correctIndex: 2,
            explanation: "Hooray! 4 bunnies plus 1 more bunny makes 5 happy bunnies in total!",
            hints: [
              "Start at 4 and count forward one more step.",
              "What number comes right after 4?",
            ],
            sourceReference: "StudyQuest Early Explorer Math Standards, Section K.OA.A.1",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },

  // 2. Grade 4 Fractions
  {
    id: "elem-math",
    title: "Elementary Mathematics",
    tier: "elementary",
    icon: "PieChart",
    description: "Fractions, geometry, multiplication, and problem-solving through interactive games.",
    lessons: [
      {
        id: "g4-math-fractions-intro",
        subjectId: "elem-math",
        courseTitle: "Mastering Fractions",
        title: "Pizza Fractions: Numerators & Denominators",
        tier: "elementary",
        summary: "Understand what fractions mean using equal pizza slices and real-world snacks.",
        estimatedMinutes: 8,
        visualSummary: "A fresh pizza cut into 8 equal slices with 3 slices with toppings highlighted.",
        audioNarration: "Fractions represent equal parts of a whole! Today we explore numerators and denominators.",
        contentMarkdown: `
# Understanding Fractions with Pizza! 🍕

A **fraction** represents equal parts of a whole object.

Think of a freshly baked pizza cut into **8 equal slices**:
- The **Denominator** (the bottom number) tells you the **total number of equal parts** the whole is divided into. Here, that's **8**.
- The **Numerator** (the top number) tells you **how many parts you are talking about** or eating.

If you eat **3 slices** of this 8-slice pizza:
$$\\text{Fraction Eaten} = \\frac{3}{8}$$

- 3 is the **Numerator** (slices eaten).
- 8 is the **Denominator** (total slices in the whole pie).

What fraction is left for your family?
$$8 - 3 = 5 \\implies \\frac{5}{8} \\text{ remains!}$$
`,
        keyTakeaways: [
          "The denominator (bottom) is the total equal parts in the whole.",
          "The numerator (top) is the number of parts selected or eaten.",
          "Fractions are only fair if every piece is equal in size!",
        ],
        activity: {
          id: "act-g4-pizza",
          title: "Interactive Pizza Slice Maker",
          instruction: "Select slices to see the numerator and denominator change dynamically!",
          type: "fraction_pie",
          data: {
            totalSlices: 8,
            initialSelected: 3,
            label: "Cheese & Tomato Pizza",
          },
        },
        quiz: [
          {
            id: "g4-quiz-1",
            prompt: "A fresh birthday cake is sliced into 6 equal pieces. Alex gives 2 pieces to his friends. What fraction of the cake did Alex give away?",
            choices: ["2/6", "4/6", "6/2", "1/6"],
            correctIndex: 0,
            explanation: "Alex gave away 2 pieces out of 6 equal total pieces. In fraction form, this is 2/6 (which can also simplify to 1/3)!",
            hints: [
              "Remember: the parts given away go on top (numerator).",
              "The total number of equal slices goes on the bottom (denominator).",
            ],
            sourceReference: "CCSS.MATH.CONTENT.4.NF.A.1",
            difficulty: "beginner",
          },
          {
            id: "g4-quiz-2",
            prompt: "If 5/8 of a garden is planted with sunflowers, what fraction of the garden is NOT planted with sunflowers?",
            choices: ["3/8", "5/8", "8/5", "1/8"],
            correctIndex: 0,
            explanation: "The entire garden is 8/8. Subtract the sunflower portion: 8/8 - 5/8 = 3/8 left over!",
            hints: [
              "A whole garden is 8/8.",
              "Subtract 5 from 8 to find the remaining slices.",
            ],
            sourceReference: "CCSS.MATH.CONTENT.4.NF.B.3.A",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },

  // 3. Grade 8 Science: States of Matter & Thermal Energy
  {
    id: "middle-science",
    title: "Middle School Physical Science",
    tier: "elementary",
    icon: "Atom",
    description: "Explore atomic structure, thermal energy, and physical state transitions.",
    lessons: [
      {
        id: "g8-sci-matter-energy",
        subjectId: "middle-science",
        courseTitle: "Matter and Thermal Dynamics",
        title: "States of Matter & Molecular Kinetic Energy",
        tier: "elementary",
        summary: "Discover how heating and cooling changes particle movement in solids, liquids, and gases.",
        estimatedMinutes: 10,
        visualSummary: "Three beakers showing tightly packed vibrating ice crystals, flowing water molecules, and rapidly bouncing steam particles.",
        audioNarration: "Matter is all around us, and its atoms are always in motion. Let's see what happens when we add thermal energy!",
        contentMarkdown: `
# Thermal Energy and the States of Matter 🌡️

All matter is made of tiny particles (atoms and molecules) that are constantly in motion. The energy of this motion is called **kinetic energy**. 

When we measure **temperature**, we are measuring the *average kinetic energy* of the particles.

### The Three Familiar States of Matter:
1. **Solid (e.g. Ice)**:
   - Particles are packed tightly in fixed positions.
   - They vibrate in place but cannot slide past one another.
   - Definite shape and definite volume.

2. **Liquid (e.g. Liquid Water)**:
   - Thermal energy increases; particles vibrate fast enough to break free of rigid bonds.
   - Particles flow and slide around each other.
   - Definite volume, but takes the shape of its container.

3. **Gas (e.g. Steam)**:
   - High thermal energy! Particles move rapidly in random directions.
   - Overcome almost all attractive forces and spread far apart.
   - No definite shape and no definite volume.
`,
        keyTakeaways: [
          "Temperature measures the average kinetic energy of vibrating particles.",
          "Adding heat makes particles move faster and push farther apart.",
          "State transitions (melting, boiling) occur when kinetic energy overcomes intermolecular attractions.",
        ],
        activity: {
          id: "act-g8-particles",
          title: "Thermal Particle Chamber Simulator",
          instruction: "Slide the thermal energy dial from Cold to Hot to watch molecular speed and phase changes!",
          type: "particle_sim",
          data: {
            temperatureStates: ["Solid (Cold)", "Liquid (Warm)", "Gas (Hot)"],
          },
        },
        quiz: [
          {
            id: "g8-quiz-1",
            prompt: "What fundamental change occurs to water molecules when liquid water boils into steam?",
            choices: [
              "The molecules expand in mass and become new elements",
              "The molecules move much faster and spread far apart from each other",
              "The molecules stop vibrating and freeze into rigid structures",
              "The hydrogen atoms separate permanently from oxygen atoms"
            ],
            correctIndex: 1,
            explanation: "Boiling is a physical state change. Thermal energy accelerates molecular kinetic energy, causing water molecules to break loose and disperse as steam vapor.",
            hints: [
              "Think about what heat does to the speed of microscopic particles.",
              "Does boiling change the molecule itself, or how the molecules move relative to one another?",
            ],
            sourceReference: "NGSS MS-PS1-4: Models of Particle Motion with Thermal Energy",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },

  // 4. High School Algebra: Linear Equations & Slope-Intercept
  {
    id: "hs-algebra",
    title: "High School Algebra",
    tier: "high_school",
    icon: "TrendingUp",
    description: "Linear models, algebraic reasoning, functions, and graphing systems.",
    lessons: [
      {
        id: "hs-alg-linear-slope",
        subjectId: "hs-algebra",
        courseTitle: "Linear Functions & Modeling",
        title: "Slope-Intercept Form: Deciphering y = mx + b",
        tier: "high_school",
        summary: "Master the standard slope-intercept formula to predict lines, rates of change, and vertical intercepts.",
        estimatedMinutes: 12,
        visualSummary: "Cartesian coordinate plane graphing the line y = 2x + 1 with highlighted rise over run triangle.",
        audioNarration: "Slope-intercept form is one of the most powerful tools in algebra for modeling constant rates of change.",
        contentMarkdown: `
# The Power of $y = mx + b$ 📈

Every non-vertical straight line on the Cartesian plane can be described by the linear equation:

$$y = mx + b$$

### Breaking Down the Components:
- **$x$**: The independent variable (input).
- **$y$**: The dependent variable (output).
- **$m$ (Slope)**: The **rate of change**, often defined as:
  $$m = \\frac{\\text{Rise}}{\\text{Run}} = \\frac{y_2 - y_1}{x_2 - x_1}$$
  - A positive slope ($m > 0$) slants uphill from left to right.
  - A negative slope ($m < 0$) slants downhill.
  - A zero slope ($m = 0$) is a perfectly horizontal line.
- **$b$ (y-intercept)**: The point $(0, b)$ where the line intersects the vertical y-axis. When $x = 0$, $y = b$.

### Example:
For $y = 3x - 4$:
- The slope is **$3$** (for every 1 unit you move right, move up 3 units).
- The line crosses the y-axis at **$(0, -4)$**.
`,
        keyTakeaways: [
          "m represents the steepness and direction (rise over run).",
          "b is the vertical anchor point where x equals zero.",
          "Parallel lines share identical slopes (m1 = m2).",
        ],
        activity: {
          id: "act-hs-slope",
          title: "Dynamic Linear Grapher",
          instruction: "Adjust the slope (m) and intercept (b) sliders to see the graph transform in real time!",
          type: "slope_slider",
          data: {
            initialM: 2,
            initialB: -1,
          },
        },
        quiz: [
          {
            id: "hs-quiz-1",
            prompt: "What is the slope ($m$) and y-intercept ($(0, b)$) of the linear equation $2y = 8x + 6$?",
            choices: [
              "Slope = 8, y-intercept = (0, 6)",
              "Slope = 4, y-intercept = (0, 3)",
              "Slope = 2, y-intercept = (0, 4)",
              "Slope = 4, y-intercept = (0, 6)"
            ],
            correctIndex: 1,
            explanation: "First convert to standard form by dividing all terms by 2: y = (8/2)x + (6/2) => y = 4x + 3. Therefore, slope m = 4 and y-intercept is (0, 3)!",
            hints: [
              "Is the equation currently solved for a single 'y'?",
              "Divide both sides of the equation by 2 first.",
            ],
            sourceReference: "Common Core State Standards HSF.IF.C.7",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },

  // 5. College Introduction to Artificial Intelligence
  {
    id: "col-cs-ai",
    title: "Computer Science & AI",
    tier: "college",
    icon: "Cpu",
    description: "Fundamental AI paradigms, knowledge graphs, heuristic search, and statistical learning.",
    lessons: [
      {
        id: "col-ai-intro-paradigms",
        subjectId: "col-cs-ai",
        courseTitle: "Foundations of Artificial Intelligence",
        title: "Classical Symbolic AI vs Statistical Machine Learning",
        tier: "college",
        summary: "Contrast deterministic rule-based expert systems with probabilistic data-driven learning paradigms.",
        estimatedMinutes: 15,
        visualSummary: "Side-by-side conceptual comparison: Expert systems (Rules + Data -> Answers) versus Machine Learning (Data + Answers -> Rules).",
        contentMarkdown: `
# Paradigm Shift: From Expert Systems to Statistical Learning 🤖

In early computing, creating intelligent systems meant hand-coding expert knowledge into deductive inference engines.

### 1. Symbolic (GOFAI - Good Old-Fashioned AI)
- Relied on explicit logical formalisms (Prolog, LISP, production rules: IF condition THEN action).
- **Strengths**: Deterministic, fully explainable, provably sound.
- **Failures**: Fragile in the presence of noise, cannot handle high-dimensional perceptual inputs like images and raw audio.

### 2. Statistical Machine Learning
Instead of hand-crafting human heuristics:
$$\\text{Input Data} (X) + \\text{Labels} (Y) \\xrightarrow{\\text{Optimization}} \\text{Model Parameters} (W, b)$$

The machine learns an approximating hypothesis function $h_\\theta(x) \\approx y$ that minimizes an empirical loss metric across training distributions.
`,
        keyTakeaways: [
          "Classical AI requires human experts to specify all decision boundaries.",
          "Machine learning derives statistical weights directly from observed data distributions.",
          "Modern foundation models blend deep statistical representations with structured tool use.",
        ],
        activity: {
          id: "act-col-paradigms",
          title: "AI Paradigm Architecture Flowchart",
          instruction: "Trace data flows between Classical Systems and Machine Learning Pipelines.",
          type: "flowchart",
          data: {
            steps: ["Input Features", "Loss Metric", "Parameter Optimization", "Inference"],
          },
        },
        quiz: [
          {
            id: "col-quiz-1",
            prompt: "Why did classical symbolic expert systems struggle to solve computer vision tasks like identifying cats in real-world photographs?",
            choices: [
              "Computers in the 1980s lacked logical operators like AND and OR",
              "Real-world pixel matrices have high variance (lighting, angles, fur patterns) that cannot be captured by rigid hand-crafted if-then rules",
              "Symbolic systems can only compute mathematical equations, not logical propositions",
              "Expert systems require quantum computing processors to run"
            ],
            correctIndex: 1,
            explanation: "Perceptual data exhibits combinatorial variability. Describing every possible pixel pattern of a cat via deterministic rules is computationally intractable; statistical models excel because they generalize over continuous feature spaces.",
            hints: [
              "Consider how many angles, lighting conditions, and fur colors a single cat can have.",
              "Can a human engineer write a discrete IF statement for every single pixel combination?",
            ],
            sourceReference: "Russell & Norvig, Artificial Intelligence: A Modern Approach (4th Ed.)",
            difficulty: "intermediate",
          },
        ],
      },
    ],
  },

  // 6. University Machine Learning Fundamentals
  {
    id: "uni-data-science",
    title: "University Machine Learning & Data Science",
    tier: "college",
    icon: "Network",
    description: "Optimization algorithms, loss functions, regularization, and model generalization.",
    lessons: [
      {
        id: "uni-ml-gradient-descent",
        subjectId: "uni-data-science",
        courseTitle: "Advanced Statistical Machine Learning",
        title: "Gradient Descent Optimization & Overfitting Diagnostics",
        tier: "college",
        summary: "Formulate the gradient descent update rule and diagnose generalization error via validation curves.",
        estimatedMinutes: 20,
        visualSummary: "3D convex cost surface showing optimization trajectory down toward the global minimum, alongside train vs validation loss curves.",
        contentMarkdown: `
# Optimization: Gradient Descent & Generalization 📉

In supervised parametric machine learning, we seek parameter weights $\\theta$ that minimize an empirical loss function $J(\\theta)$:

$$\\theta^{(t+1)} = \\theta^{(t)} - \\alpha \\nabla_\\theta J(\\theta^{(t)})$$

Where:
- $\\alpha > 0$ is the **learning rate** (step size).
- $\\nabla_\\theta J(\\theta)$ is the vector of partial derivatives pointing in the direction of steepest ascent.

### Diagnosing Generalization: The Bias-Variance Tradeoff
When monitoring training vs validation loss over training epochs:
1. **Underfitting (High Bias)**:
   - Both training loss and validation loss remain high and plateau prematurely.
   - Model is too simple to capture underlying data structure.
2. **Optimal Fit**:
   - Both training and validation loss decrease smoothly and converge to a low steady state.
3. **Overfitting (High Variance)**:
   - Training loss continues downward toward near-zero.
   - Validation loss reaches a trough, then starts **increasing** steadily.
   - Model begins memorizing training noise rather than generalizing.
`,
        keyTakeaways: [
          "Gradient descent iteratively updates weights in the negative gradient direction.",
          "An excessively large learning rate causes divergence; too small causes glacial convergence.",
          "A divergence between falling training loss and rising validation loss is the hallmark of overfitting.",
        ],
        activity: {
          id: "act-uni-loss",
          title: "Epoch Loss Curve Diagnostic Visualizer",
          instruction: "Drag the epoch slider to observe where overfitting begins on the validation loss curve.",
          type: "loss_curve",
          data: {
            overfitEpoch: 25,
            minValLoss: 0.28,
          },
        },
        quiz: [
          {
            id: "uni-quiz-1",
            prompt: "During deep neural network training, your training loss drops from 0.85 to 0.04 by epoch 40, but your validation loss bottoms out at 0.30 at epoch 18 and climbs back up to 0.72 by epoch 40. What is the most effective remedy?",
            choices: [
              "Increase the model capacity and train for 50 more epochs",
              "Implement Early Stopping at epoch 18 and apply L2 regularization / dropout",
              "Remove all validation sets and train solely on raw training samples",
              "Increase the learning rate by a factor of 100"
            ],
            correctIndex: 1,
            explanation: "The divergence between falling training error and rising validation error is classic overfitting. Early stopping at the validation minimum (epoch 18) and adding regularization (L2/dropout) constrains model complexity and restores generalization.",
            hints: [
              "Look at epoch 18: that was the peak generalization performance.",
              "What techniques prevent a model from memorizing specific training noise?",
            ],
            sourceReference: "Goodfellow, Bengio, Courville: Deep Learning (MIT Press)",
            difficulty: "advanced",
          },
        ],
      },
    ],
  },

  // 7. Adult Digital Literacy: Cybersecurity & Account Protection
  {
    id: "adult-digital-literacy",
    title: "Practical Digital Literacy & Life Skills",
    tier: "adult",
    icon: "ShieldCheck",
    description: "Practical cybersecurity, online safety, privacy tools, and scam prevention for adults and seniors.",
    lessons: [
      {
        id: "adult-dig-sec-passwords",
        subjectId: "adult-digital-literacy",
        courseTitle: "Everyday Cybersecurity & Scam Defense",
        title: "Spotting Phishing Scams & Fortifying Passwords",
        tier: "adult",
        summary: "Learn practical steps to identify deceptive emails, recognize fake alerts, and use two-factor authentication.",
        estimatedMinutes: 10,
        visualSummary: "Sample deceptive email with callouts showing mismatched domain names, artificial urgency, and suspicious link destinations.",
        audioNarration: "Staying safe online doesn't require being a tech genius. It comes down to a few healthy habits and knowing what to look out for.",
        contentMarkdown: `
# Protecting Yourself from Online Scams & Phishing 🛡️

Cybercriminals rarely 'hack' complex computers; instead, they try to trick normal people through **phishing**.

### What is Phishing?
Phishing is when an attacker sends a message pretending to be a trusted institution (like your bank, postal service, or government agency) to steal passwords or credit cards.

### The 4 Red Flags of Phishing Messages:
1. **Urgency & Panic**:
   - *"Your account will be suspended within 2 hours unless you click here!"*
   - Legitimate organizations provide formal notices and never demand urgent panic clicks.
2. **Suspicious Sender Email Addresses**:
   - The display name says "Canada Post", but the actual address is \`service@postal-alert-track189.com\`.
3. **Requests for Sensitive Information**:
   - Legitimate banks will **never** ask you to email or text your password, PIN, or one-time code.
4. **Vague or Strange Links**:
   - Hovering over a link reveals it directs to a totally different, unfamiliar website address.

### The Best Defense:
- If you receive a concerning message, **never click the link**.
- Close the message, open your web browser, and type the company's verified address yourself (e.g. \`www.bankofamerica.com\`).
- Enable **Two-Factor Authentication (2FA)** on your email and banking accounts!
`,
        keyTakeaways: [
          "Phishing uses urgency and fear to make people act before thinking.",
          "Always inspect the actual email address after the @ symbol.",
          "Never click links in unexpected security alerts; go directly to the official website.",
        ],
        activity: {
          id: "act-adult-phishing",
          title: "Real vs Fake Email Inspector",
          instruction: "Analyze the suspicious email below and click on the 3 deceptive security red flags!",
          type: "email_inspector",
          data: {
            sender: "support@service-apple-recovery-center.net",
            subject: "URGENT: Cloud Storage Locked due to Unauthorized Sign-In",
            flags: ["Urgent panic language", "Mismatched domain", "Demands password verification"],
          },
        },
        quiz: [
          {
            id: "adult-quiz-1",
            prompt: "You receive an SMS text saying: 'Your parcel delivery failed. Please click http://post-pkg-redelivery-99.cc within 15 minutes to confirm your home address and pay $1.50.' What is the safest action?",
            choices: [
              "Click the link immediately so your package is not sent back",
              "Delete the text message or report it as spam; do not click any links",
              "Reply with your credit card details via text message",
              "Call the random number from the text to verify"
            ],
            correctIndex: 1,
            explanation: "This is a classic 'smishing' (SMS phishing) scam designed to steal credit card details. Postal carriers do not send urgent 15-minute ultimatums from strange web domains. Delete and ignore.",
            hints: [
              "Notice the strange web address ending in '.cc'.",
              "Notice the artificial 15-minute countdown creating panic.",
            ],
            sourceReference: "Canadian Centre for Cyber Security — Phishing Guidance (ITSAP.00.101)",
            difficulty: "beginner",
          },
        ],
      },
    ],
  },
];

export function getAllLessons(): Lesson[] {
  return SAMPLE_CURRICULUM.flatMap((subject) => subject.lessons);
}

export function getLessonById(id: string): Lesson | undefined {
  for (const subject of SAMPLE_CURRICULUM) {
    const found = subject.lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}
