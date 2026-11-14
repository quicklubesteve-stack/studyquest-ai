import { GoogleGenAI } from "@google/genai";
import { TutorRequest, TutorResponse } from "./types";
import { buildSystemPrompt } from "./prompts";
import { sanitizeUserInput, checkContentSafety } from "./safety";
import { SAMPLE_CURRICULUM, getLessonById } from "@/curriculum/data";

/**
 * Intelligent Deterministic Socratic Engine
 * Used when GEMINI_API_KEY is not provided, during local offline testing, or on network failover.
 */
function generateDeterministicSocraticResponse(req: TutorRequest, sanitizedMessage: string): TutorResponse {
  const tier = req.educationTier;
  const mode = req.tutorMode;
  const lowerMsg = sanitizedMessage.toLowerCase();

  // Find active lesson metadata if available
  const lesson = req.currentLessonId
    ? getLessonById(req.currentLessonId)
    : undefined;

  const topicName = lesson ? lesson.title : "this topic";
  const subjectName = lesson ? lesson.subjectId : "General Studies";

  let reply = "";
  let followUpQuestion = "What do you think our next step should be?";
  let suggestedActions = ["Show me a worked example", "Give me a practice question", "Let me explain it to you"];

  switch (mode) {
    case "socratic":
      if (tier === "kindergarten") {
        reply = `🦊 Hey little explorer! Let's count our animal friends together! If you have 3 friendly ducks swimming in the pond 🦆🦆🦆 and 1 more waddles over, how many ducks are splashing now? 🎈`;
        followUpQuestion = "Can you count on your fingers: 1, 2, 3, and one more?";
        suggestedActions = ["Count with ducks", "Count on fingers", "Show me another number"];
      } else if (tier === "elementary") {
        if (lowerMsg.includes("fraction") || lowerMsg.includes("pizza") || lowerMsg.includes("denominator")) {
          reply = `🍕 Great curiosity! Think of fractions like sharing a delicious pizza. If we slice the whole pizza into 4 equal slices, the bottom number (the denominator) is 4. If you eat 1 slice, you've eaten 1 out of 4 (1/4)! What would happen if we cut the pizza into 8 slices instead?`;
          followUpQuestion = "Would 1 slice of an 8-slice pizza be bigger or smaller than 1 slice of a 4-slice pizza?";
        } else {
          reply = `🌟 Awesome question about ${topicName}! To discover the answer, let's break it down into smaller puzzle pieces. What is the very first clue or number given to you in this problem?`;
          followUpQuestion = "Can you spot the starting piece of information?";
        }
      } else if (tier === "high_school") {
        if (lowerMsg.includes("slope") || lowerMsg.includes("linear") || lowerMsg.includes("graph")) {
          reply = `In linear equations $y = mx + b$, remember that the slope $m$ represents the steepness and direction of the line, measured as the vertical change (rise) over horizontal change (run). If a hill goes up 3 meters for every 1 meter you move forward, the rate of change is 3/1 = 3. What does the $b$ value represent when $x = 0$?`;
          followUpQuestion = "Where does the line cross the vertical y-axis when no horizontal distance has passed?";
        } else {
          reply = `A solid analytical approach to ${topicName} starts by identifying the governing relationship. What are the known variables versus the unknown target we are solving for?`;
          followUpQuestion = "How can we express this relationship mathematically or conceptually?";
        }
      } else if (tier === "college") {
        reply = `Examining ${topicName} from first principles requires disentangling theoretical foundations from empirical observations. In this paradigm, how do the underlying assumptions or constraints dictate the optimization path or state transitions?`;
        followUpQuestion = "What theoretical constraints are we operating under in this formulation?";
      } else {
        // Adult
        reply = `Welcome! When approaching ${topicName}, it's helpful to ground the concept in everyday practical utility. Consider how this system behaves when applied to real-world workflows or security decisions. What is the primary objective you want to achieve here?`;
        followUpQuestion = "What is the key takeaway or practical outcome you want to verify?";
      }
      break;

    case "worked_example":
      reply = `Here is a step-by-step worked example of a similar problem:\n\n` +
        `**Step 1: Understand the Goal**\nIdentify the core quantity or relationship we want to determine.\n\n` +
        `**Step 2: Apply the Formula / Concept**\nBreak down the calculation or logical rule systematically.\n\n` +
        `**Step 3: Verify the Solution**\nCheck if the outcome aligns with physical intuition and units of measurement.`;
      followUpQuestion = "Would you like to try applying this exact 3-step pattern to your own question?";
      suggestedActions = ["Try with my own problem", "See another example", "Explain Step 2 more"];
      break;

    case "teach_the_ai":
      reply = `I would love to learn from you! 🎓 Pretend I'm a fellow student who hasn't seen ${topicName} yet. How would you explain the core idea to me in your own words?`;
      followUpQuestion = "What is the single most important rule or idea I need to remember?";
      suggestedActions = ["Here is my explanation", "Give me a hint to get started", "Ask me a quiz question"];
      break;

    case "practice_generator":
      reply = `Here is a custom practice challenge for **${topicName}**:\n\n` +
        `**Challenge Question:**\n` +
        `Which of the following correctly describes the fundamental behavior in this topic?\n` +
        `A) It remains static regardless of inputs.\n` +
        `B) It changes proportionally based on the governing rate of change.\n` +
        `C) It fluctuates randomly with no underlying rules.\n` +
        `D) It can only be calculated with experimental guesswork.\n`;
      followUpQuestion = "What is your best answer, and why did you choose it?";
      suggestedActions = ["I choose Option B", "Give me a hint", "Explain the options"];
      break;

    case "mistake_analysis":
      reply = `That is a completely understandable answer, and many learners make that exact choice at first! 💡 The reason this happens is because our instinct focuses on the most visible piece of information. However, when we look closer at the underlying rule, we notice a key distinction. Let's trace back one step.`;
      followUpQuestion = "Where do you think the first difference between your intuition and the rule occurred?";
      suggestedActions = ["Trace it back one step", "Show me a diagram", "Let's try again"];
      break;
  }

  return {
    reply,
    followUpQuestion,
    suggestedActions,
    curriculumCitation: lesson
      ? { topic: lesson.title, subject: lesson.subjectId, gradeLevel: lesson.tier }
      : undefined,
    isSocratic: true,
    safetyFiltered: false,
    usedFallbackEngine: true,
  };
}

/**
 * Main AI Tutor Dispatcher
 * Calls Google Gemini API if GEMINI_API_KEY is configured; otherwise uses deterministic Socratic engine.
 */
export async function askAITutor(request: TutorRequest): Promise<TutorResponse> {
  // 1. Safety check & PII sanitization
  const safetyCheck = checkContentSafety(request.message);
  if (!safetyCheck.isSafe) {
    return {
      reply: safetyCheck.warning || "Safety filter triggered.",
      isSocratic: false,
      safetyFiltered: true,
      usedFallbackEngine: true,
    };
  }

  const { sanitizedText, piiRedacted } = sanitizeUserInput(request.message);

  // 2. Check for configured Gemini API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    // Return deterministic pedagogical engine
    const response = generateDeterministicSocraticResponse(request, sanitizedText);
    if (piiRedacted) {
      response.reply = `*(Note: Private personal information like email or phone was removed for your safety.)*\n\n` + response.reply;
      response.safetyFiltered = true;
    }
    return response;
  }

  // 3. Call live Gemini API via Google GenAI SDK
  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = buildSystemPrompt({
      educationTier: request.educationTier,
      learningPreference: request.learningPreference,
      tutorMode: request.tutorMode,
      currentLessonId: request.currentLessonId,
      currentSubjectId: request.currentSubjectId,
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}` },
            ...request.history.map((h) => ({ text: `${h.role.toUpperCase()}: ${h.content}` })),
            { text: `STUDENT INQUIRY:\n${sanitizedText}` },
          ],
        },
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    const candidateText = response.text || "";

    // Find lesson metadata if available
    const lesson = request.currentLessonId
      ? getLessonById(request.currentLessonId)
      : undefined;

    return {
      reply: candidateText,
      followUpQuestion: "Does this make sense so far, or would you like to see another angle?",
      suggestedActions: ["Give me a practice question", "Show me a worked example", "Let me explain it back to you"],
      curriculumCitation: lesson
        ? { topic: lesson.title, subject: lesson.subjectId, gradeLevel: lesson.tier }
        : undefined,
      isSocratic: true,
      safetyFiltered: piiRedacted,
      usedFallbackEngine: false,
    };
  } catch (error) {
    console.error("Gemini API call encountered an error. Falling back to Socratic engine:", error);
    const fallbackResponse = generateDeterministicSocraticResponse(request, sanitizedText);
    fallbackResponse.usedFallbackEngine = true;
    return fallbackResponse;
  }
}
