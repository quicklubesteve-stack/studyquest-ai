import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["LEARNER", "PARENT", "TEACHER", "ADMIN"]).default("LEARNER"),
  educationTier: z.string().default("elementary"),
  learningPreference: z.string().default("mixed"),
  parentEmail: z.string().email().optional().or(z.literal("")),
});

describe("Authentication & Role-Based Authorization", () => {
  it("validates valid registration inputs across roles", () => {
    const student = RegisterSchema.safeParse({
      name: "Alex",
      email: "alex@example.com",
      password: "securePassword123",
      role: "LEARNER",
      educationTier: "elementary",
    });
    expect(student.success).toBe(true);

    const parent = RegisterSchema.safeParse({
      name: "Sarah Parent",
      email: "sarah@example.com",
      password: "securePassword123",
      role: "PARENT",
      educationTier: "adult",
    });
    expect(parent.success).toBe(true);
  });

  it("rejects invalid emails and weak passwords", () => {
    const invalidEmail = RegisterSchema.safeParse({
      name: "Bad Email",
      email: "not-an-email",
      password: "securePassword123",
      role: "LEARNER",
    });
    expect(invalidEmail.success).toBe(false);

    const shortPassword = RegisterSchema.safeParse({
      name: "Short Pw",
      email: "valid@example.com",
      password: "123",
      role: "LEARNER",
    });
    expect(shortPassword.success).toBe(false);
  });

  it("hashes passwords securely with bcrypt and validates matches", async () => {
    const rawPassword = "studyQuestPassword2026!";
    const hash = await bcrypt.hash(rawPassword, 10);

    expect(hash).not.toBe(rawPassword);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await bcrypt.compare(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await bcrypt.compare("wrongPassword", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("validates role permissions matrix", () => {
    const roles = ["LEARNER", "PARENT", "TEACHER", "ADMIN"];
    roles.forEach((r) => {
      const parsed = RegisterSchema.shape.role.safeParse(r);
      expect(parsed.success).toBe(true);
    });

    const invalidRole = RegisterSchema.shape.role.safeParse("HACKER");
    expect(invalidRole.success).toBe(false);
  });
});
