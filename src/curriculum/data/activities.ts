import {
  Flashcard,
  MatchingPair,
  FillBlankChallenge,
  SequencePuzzleItem,
  MemoryCard,
} from "@/types";

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    front: "What does the denominator in a fraction represent?",
    back: "The total number of equal parts that make up one whole.",
    hint: "Think about the total number of pizza slices the whole pie was cut into.",
    category: "Elementary Math",
    boxLevel: 1,
  },
  {
    id: "fc-2",
    front: "In the slope-intercept equation y = mx + b, what is 'm'?",
    back: "The slope (rate of change), calculated as rise over run: Δy / Δx.",
    hint: "It determines how steep the line climbs or descends.",
    category: "High School Algebra",
    boxLevel: 2,
  },
  {
    id: "fc-3",
    front: "What happens to molecular motion as thermal energy increases?",
    back: "Particles move faster and spread further apart, increasing kinetic energy.",
    hint: "Think of ice melting into water and boiling into steam.",
    category: "Middle School Science",
    boxLevel: 1,
  },
  {
    id: "fc-4",
    front: "What is the primary indicator of overfitting in machine learning?",
    back: "Training loss continues to decrease while validation/test loss begins to increase.",
    hint: "The model is memorizing noise rather than learning general patterns.",
    category: "University AI",
    boxLevel: 3,
  },
  {
    id: "fc-5",
    front: "What is the safest defense against urgent SMS phishing (smishing) links?",
    back: "Do not tap the link; delete or report the message, and log in directly through the verified website or official app.",
    hint: "Scammers rely on artificial 15-minute ultimatums to create panic.",
    category: "Adult Digital Security",
    boxLevel: 4,
  },
  {
    id: "fc-6",
    front: "How many animal friends do you have if 3 ducklings are joined by 2 bunnies?",
    back: "5 animal friends in total! (3 + 2 = 5)",
    hint: "Hold up 3 fingers, then hold up 2 more fingers and count them all!",
    category: "Early Explorer Math",
    boxLevel: 2,
  },
];

export const SAMPLE_MATCHING_PAIRS: Record<string, MatchingPair[]> = {
  science: [
    { id: "m-1", left: "Solid", right: "Fixed shape and fixed volume; particles vibrate in place", category: "Matter" },
    { id: "m-2", left: "Liquid", right: "Fixed volume, takes shape of container; particles slide past each other", category: "Matter" },
    { id: "m-3", left: "Gas", right: "Fills entire container; particles move rapidly with high kinetic energy", category: "Matter" },
    { id: "m-4", left: "Plasma", right: "Ionized high-energy gas found in stars and lightning", category: "Matter" },
  ],
  math: [
    { id: "m-5", left: "1/2", right: "50% or 0.50 (Half)", category: "Fractions" },
    { id: "m-6", left: "1/4", right: "25% or 0.25 (One Quarter)", category: "Fractions" },
    { id: "m-7", left: "3/4", right: "75% or 0.75 (Three Quarters)", category: "Fractions" },
    { id: "m-8", left: "1/1", right: "100% or 1.0 (One Whole)", category: "Fractions" },
  ],
  ai: [
    { id: "m-9", left: "Supervised Learning", right: "Training with input data paired with verified target labels", category: "AI Paradigms" },
    { id: "m-10", left: "Unsupervised Learning", right: "Discovering inherent clustering or hidden structure without labels", category: "AI Paradigms" },
    { id: "m-11", left: "Reinforcement Learning", right: "Agent learns optimal policies through reward and penalty feedback", category: "AI Paradigms" },
    { id: "m-12", left: "Gradient Descent", right: "Optimization algorithm iteratively updating weights to minimize loss", category: "AI Paradigms" },
  ],
};

export const SAMPLE_FILL_BLANKS: FillBlankChallenge[] = [
  {
    id: "fb-1",
    sentenceParts: ["In the fraction 3/8, the number 8 is the", ", representing the total equal slices."],
    blankAnswer: "denominator",
    options: ["denominator", "numerator", "exponent", "quotient"],
    hint: "It's the bottom number of the fraction.",
    explanation: "The denominator (down below) always counts how many equal parts the whole is partitioned into.",
  },
  {
    id: "fb-2",
    sentenceParts: ["On a coordinate grid, a straight line with a slope of zero is completely", "."],
    blankAnswer: "horizontal",
    options: ["horizontal", "vertical", "curved", "perpendicular"],
    hint: "Since rise is 0, the height never changes as you move along x.",
    explanation: "A slope of zero means there is no vertical rise (0 / run = 0), resulting in a perfectly flat horizontal line.",
  },
  {
    id: "fb-3",
    sentenceParts: ["During thermal heating, molecular kinetic energy", ", causing molecules to bounce vigorously."],
    blankAnswer: "increases",
    options: ["increases", "freezes", "vanishes", "decreases"],
    hint: "Adding heat transfers energy into the substance.",
    explanation: "Temperature is a direct measure of average molecular kinetic energy. Higher heat equals faster particle motion.",
  },
  {
    id: "fb-4",
    sentenceParts: ["A reputable organization will never send an email demanding your account", "under threat of deletion."],
    blankAnswer: "password",
    options: ["password", "username", "feedback", "newsletter preference"],
    hint: "Legitimate support staff already have administrative access and will never ask you to disclose this secret.",
    explanation: "Asking for passwords or credentials via email or SMS is the #1 telltale red flag of credential-harvesting phishing scams.",
  },
];

export const SAMPLE_SEQUENCE_PUZZLES: { title: string; prompt: string; items: SequencePuzzleItem[] }[] = [
  {
    title: "The Scientific Method in Action",
    prompt: "Arrange the stages of scientific discovery in their proper empirical order:",
    items: [
      { id: "seq-1", text: "1. Make an observation & ask a question", correctIndex: 0 },
      { id: "seq-2", text: "2. Formulate a testable hypothesis", correctIndex: 1 },
      { id: "seq-3", text: "3. Design & conduct a controlled experiment", correctIndex: 2 },
      { id: "seq-4", text: "4. Analyze empirical data & draw conclusions", correctIndex: 3 },
    ],
  },
  {
    title: "Machine Learning Training Loop",
    prompt: "Order the computational steps of one gradient descent optimization epoch:",
    items: [
      { id: "seq-5", text: "1. Forward pass (compute predictions)", correctIndex: 0 },
      { id: "seq-6", text: "2. Compute loss between predictions & ground truth", correctIndex: 1 },
      { id: "seq-7", text: "3. Backward pass (calculate gradients via backpropagation)", correctIndex: 2 },
      { id: "seq-8", text: "4. Update model weights using learning rate", correctIndex: 3 },
    ],
  },
  {
    title: "Ordering Fractions by Magnitude",
    prompt: "Arrange these fractions in order from smallest to largest:",
    items: [
      { id: "seq-9", text: "1/8 (One eighth)", correctIndex: 0 },
      { id: "seq-10", text: "1/4 (One quarter)", correctIndex: 1 },
      { id: "seq-11", text: "1/2 (One half)", correctIndex: 2 },
      { id: "seq-12", text: "3/4 (Three quarters)", correctIndex: 3 },
    ],
  },
];

export const SAMPLE_MEMORY_CARDS: MemoryCard[] = [
  { id: "card-1a", pairId: "pair-1", content: "🍕 1/2", type: "text" },
  { id: "card-1b", pairId: "pair-1", content: "50%", type: "text" },
  { id: "card-2a", pairId: "pair-2", content: "🍕 1/4", type: "text" },
  { id: "card-2b", pairId: "pair-2", content: "25%", type: "text" },
  { id: "card-3a", pairId: "pair-3", content: "🧊 Solid", type: "text" },
  { id: "card-3b", pairId: "pair-3", content: "Vibrating Particles", type: "text" },
  { id: "card-4a", pairId: "pair-4", content: "🔥 Gas", type: "text" },
  { id: "card-4b", pairId: "pair-4", content: "Rapid Particles", type: "text" },
];

export const SAMPLE_WORD_SEARCH = {
  grid: [
    ["F", "R", "A", "C", "T", "I", "O", "N"],
    ["S", "L", "O", "P", "E", "X", "M", "U"],
    ["E", "N", "E", "R", "G", "Y", "Q", "M"],
    ["P", "H", "I", "S", "H", "I", "N", "G"],
    ["G", "R", "A", "D", "I", "E", "N", "T"],
    ["A", "T", "O", "M", "S", "K", "I", "L"],
    ["S", "P", "A", "C", "E", "D", "X", "P"],
    ["M", "A", "S", "T", "E", "R", "Y", "W"],
  ],
  words: [
    { word: "FRACTION", hint: "A part of a whole with a numerator and denominator" },
    { word: "SLOPE", hint: "The steepness and direction of a line (rise over run)" },
    { word: "ENERGY", hint: "The capacity of a physical system to do work or produce heat" },
    { word: "PHISHING", hint: "Fraudulent messages designed to steal passwords or sensitive data" },
    { word: "GRADIENT", hint: "Direction of steepest ascent in machine learning loss functions" },
    { word: "MASTERY", hint: "Demonstrated deep understanding of an educational topic" },
  ],
};
