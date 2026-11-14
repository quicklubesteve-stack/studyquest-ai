import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  if (userRole !== "TEACHER" && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Access restricted to Teacher accounts" }, { status: 403 });
  }

  const classrooms = await prisma.classroom.findMany({
    where: userRole === "ADMIN" ? {} : { teacherId: userId },
    include: {
      students: {
        include: {
          profile: true,
          progress: true,
          topicMasteries: true,
        },
      },
    },
  });

  const formatted = classrooms.map((c) => ({
    id: c.id,
    name: c.name,
    gradeLevel: c.gradeLevel,
    code: c.code,
    studentCount: c.students.length,
    students: c.students.map((s) => {
      const masteries = s.topicMasteries || [];
      const avgMastery =
        masteries.length > 0
          ? Math.round(
              masteries.reduce((acc, m) => acc + m.masteryPercentage, 0) / masteries.length
            )
          : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        level: s.progress?.level || 1,
        xp: s.progress?.xp || 0,
        streak: s.progress?.streakDays || 1,
        averageMastery: avgMastery,
        topicsCount: masteries.length,
      };
    }),
  }));

  return NextResponse.json({ classrooms: formatted });
}
