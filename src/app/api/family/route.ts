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

  if (userRole !== "PARENT" && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Access restricted to Parent accounts" }, { status: 403 });
  }

  const parent = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      children: {
        include: {
          profile: true,
          progress: true,
          topicMasteries: true,
          quizAttempts: {
            take: 10,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!parent) {
    return NextResponse.json({ error: "Parent user not found" }, { status: 404 });
  }

  const childrenData = parent.children.map((child) => ({
    id: child.id,
    name: child.name,
    email: child.email,
    profile: child.profile,
    progress: child.progress
      ? {
          xp: child.progress.xp,
          level: child.progress.level,
          streakDays: child.progress.streakDays,
          lastActiveDate: child.progress.lastActiveDate,
          completedCount: JSON.parse(child.progress.completedLessonIds || "[]").length,
        }
      : null,
    topicMasteries: child.topicMasteries,
    recentAttempts: child.quizAttempts,
  }));

  return NextResponse.json({ children: childrenData });
}
