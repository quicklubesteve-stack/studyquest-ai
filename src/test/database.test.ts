import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Database & Prisma Persistence (Phase 2)", () => {
  it("queries the seeded demo accounts successfully", async () => {
    const student = await prisma.user.findUnique({
      where: { email: "student@studyquest.ai" },
      include: { profile: true, progress: true },
    });

    expect(student).toBeDefined();
    expect(student?.name).toContain("Alex Explorer");
    expect(student?.role).toBe("LEARNER");
    expect(student?.profile?.educationTier).toBe("elementary");
    expect(student?.progress?.streakDays).toBe(4);
  });

  it("verifies parent-child linkage in database relational model", async () => {
    const parent = await prisma.user.findUnique({
      where: { email: "parent@studyquest.ai" },
      include: { children: true },
    });

    expect(parent).toBeDefined();
    expect(parent?.role).toBe("PARENT");
    expect(parent?.children.length).toBeGreaterThan(0);
    expect(parent?.children[0].email).toBe("student@studyquest.ai");
  });

  it("verifies teacher classroom cohort and student enrollment", async () => {
    const teacher = await prisma.user.findUnique({
      where: { email: "teacher@studyquest.ai" },
      include: {
        teachingClasses: {
          include: { students: true },
        },
      },
    });

    expect(teacher).toBeDefined();
    expect(teacher?.role).toBe("TEACHER");
    expect(teacher?.teachingClasses.length).toBeGreaterThan(0);

    const classroom = teacher?.teachingClasses[0];
    expect(classroom?.code).toBe("QUEST4");
    expect(classroom?.students.length).toBeGreaterThan(0);
    expect(classroom?.students[0].email).toBe("student@studyquest.ai");
  });
});
