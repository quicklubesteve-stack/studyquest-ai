import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = RegisterSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Optional parental linkage for child accounts
    let parentId: string | undefined = undefined;
    if (data.parentEmail) {
      const parentUser = await prisma.user.findUnique({
        where: { email: data.parentEmail.toLowerCase().trim() },
      });
      if (parentUser) {
        parentId = parentUser.id;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name,
        hashedPassword,
        role: data.role,
        parentId,
        profile: {
          create: {
            educationTier: data.educationTier,
            learningPreference: data.learningPreference,
          },
        },
        progress: {
          create: {
            xp: 0,
            level: 1,
            streakDays: 1,
            completedLessonIds: "[]",
            achievementsJson: JSON.stringify([
              { id: "registered", title: "New Explorer", icon: "Sparkles" },
            ]),
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
