/**
 * Safety and Child Privacy Protections for StudyQuest AI
 * Complies with COPPA, PIPEDA, and educational safety best practices.
 */

// Common PII Regular Expressions
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const PHONE_REGEX = /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g;
const CANADIAN_POSTAL_REGEX = /[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d/gi;
const US_ZIP_REGEX = /\b\d{5}(?:-\d{4})?\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
const SIN_SSN_REGEX = /\b\d{3}[ -]?\d{3}[ -]?\d{3}\b/g;

/**
 * Sanitizes user input by redacting personally identifiable information (PII).
 * Ensures young learners' confidential details never reach third-party AI APIs.
 */
export function sanitizeUserInput(input: string): { sanitizedText: string; piiRedacted: boolean } {
  let text = input;
  let piiRedacted = false;

  const replaceAndFlag = (regex: RegExp, token: string) => {
    if (regex.test(text)) {
      piiRedacted = true;
      text = text.replace(regex, token);
    }
  };

  replaceAndFlag(EMAIL_REGEX, "[REDACTED_EMAIL]");
  replaceAndFlag(PHONE_REGEX, "[REDACTED_PHONE]");
  replaceAndFlag(CREDIT_CARD_REGEX, "[REDACTED_CARD]");
  replaceAndFlag(SIN_SSN_REGEX, "[REDACTED_ID]");
  replaceAndFlag(CANADIAN_POSTAL_REGEX, "[REDACTED_POSTAL]");
  replaceAndFlag(US_ZIP_REGEX, "[REDACTED_ZIP]");

  return { sanitizedText: text, piiRedacted };
}

/**
 * Checks if the prompt contains prohibited keywords (harmful, violent, or predatory behavior).
 */
export function checkContentSafety(input: string): { isSafe: boolean; warning?: string } {
  const normalized = input.toLowerCase();

  const unsafeTerms = [
    "self harm",
    "suicide",
    "bomb",
    "weapon",
    "exploit",
    "hack password",
    "cheat on exam",
    "do my test for me",
  ];

  for (const term of unsafeTerms) {
    if (normalized.includes(term)) {
      if (term.includes("do my test") || term.includes("cheat")) {
        return {
          isSafe: false,
          warning: "I'm your learning companion, not a shortcut! Let's work through the concept together step-by-step so you understand it completely.",
        };
      }
      return {
        isSafe: false,
        warning: "This inquiry violates StudyQuest AI safety guidelines. Please focus on academic questions.",
      };
    }
  }

  return { isSafe: true };
}
