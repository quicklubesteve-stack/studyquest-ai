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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      progress: true,
      topicMasteries: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    profile: user.profile,
    progress: user.progress
      ? {
          xp: user.progress.xp,
          level: user.progress.level,
          streakDays: user.progress.streakDays,
          lastActiveDate: user.progress.lastActiveDate,
          completedLessonIds: JSON.parse(user.progress.completedLessonIds || "[]"),
          achievements: JSON.parse(user.progress.achievementsJson || "[]"),
        }
      : null,
    topicMasteries: user.topicMasteries,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await req.json();
  const { progress, profile, topicMasteries } = body;

  // 1. Update or create profile
  if (profile) {
    await prisma.profile.upsert({
      where: { userId },
      update: {
        educationTier: profile.educationTier,
        learningPreference: profile.learningPreference,
        learningGoal: profile.learningGoal,
        dailyStudyMinutes: profile.dailyStudyMinutes,
        selectedSubjects: JSON.stringify(profile.selectedSubjects || []),
      },
      create: {
        userId,
        educationTier: profile.educationTier || "elementary",
        learningPreference: profile.learningPreference || "mixed",
        learningGoal: profile.learningGoal || "skill_building",
        dailyStudyMinutes: profile.dailyStudyMinutes || 15,
        selectedSubjects: JSON.stringify(profile.selectedSubjects || []),
      },
    });
  }

  // 2. Update progress
  if (progress) {
    await prisma.userProgress.upsert({
      where: { userId },
      update: {
        xp: progress.xp,
        level: progress.level,
        streakDays: progress.streakDays,
        lastActiveDate: new Date(),
        completedLessonIds: JSON.stringify(progress.completedLessonIds || []),
        achievementsJson: JSON.stringify(progress.achievements || []),
      },
      create: {
        userId,
        xp: progress.xp || 0,
        level: progress.level || 1,
        streakDays: progress.streakDays || 1,
        completedLessonIds: JSON.stringify(progress.completedLessonIds || []),
        achievementsJson: JSON.stringify(progress.achievements || []),
      },
    });
  }

  // 3. Upsert Topic Masteries
  if (topicMasteries && typeof topicMasteries === "object") {
    for (const [lessonId, mastery] of Object.entries(topicMasteries) as [string, any][]) {
      await prisma.topicMastery.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {
          masteryPercentage: mastery.masteryPercentage,
          boxLevel: mastery.boxLevel,
          attemptsCount: mastery.attemptsCount,
          lastPracticed: new Date(mastery.lastPracticed || Date.now()),
          nextReviewDate: new Date(mastery.nextReviewDate || Date.now()),
        },
        create: {
          userId,
          lessonId,
          title: mastery.title || lessonId,
          subjectId: mastery.subjectId || "general",
          masteryPercentage: mastery.masteryPercentage || 0,
          boxLevel: mastery.boxLevel || 1,
          attemptsCount: mastery.attemptsCount || 1,
          lastPracticed: new Date(mastery.lastPracticed || Date.now()),
          nextReviewDate: new Date(mastery.nextReviewDate || Date.now()),
        },
      });
    }
  }

  return NextResponse.json({ success: true, syncedAt: new Date().toISOString() });
}
