import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding StudyQuest AI demo accounts...");

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // 1. Parent Account
  const parent = await prisma.user.upsert({
    where: { email: "parent@studyquest.ai" },
    update: {},
    create: {
      email: "parent@studyquest.ai",
      name: "Sarah Explorer (Parent)",
      hashedPassword: defaultPasswordHash,
      role: "PARENT",
      profile: {
        create: {
          educationTier: "adult",
          learningPreference: "reading_writing",
          learningGoal: "skill_building",
          dailyStudyMinutes: 20,
        },
      },
    },
  });

  // 2. Student Account (Child linked to Sarah)
  const student = await prisma.user.upsert({
    where: { email: "student@studyquest.ai" },
    update: {},
    create: {
      email: "student@studyquest.ai",
      name: "Alex Explorer (Grade 4)",
      hashedPassword: defaultPasswordHash,
      role: "LEARNER",
      parentId: parent.id,
      profile: {
        create: {
          educationTier: "elementary",
          learningPreference: "mixed",
          learningGoal: "school_excellence",
          dailyStudyMinutes: 15,
          selectedSubjects: JSON.stringify(["elem-math", "middle-science"]),
          wantsPlacementQuiz: true,
        },
      },
      progress: {
        create: {
          xp: 450,
          level: 2,
          streakDays: 4,
          completedLessonIds: JSON.stringify(["g4-math-fractions-intro"]),
          achievementsJson: JSON.stringify([
            { id: "first_step", title: "First Steps", icon: "Compass" },
            { id: "fraction_master", title: "Pizza Master", icon: "Award" },
          ]),
        },
      },
      topicMasteries: {
        create: [
          {
            lessonId: "g4-math-fractions-intro",
            title: "Pizza Fractions: Numerators & Denominators",
            subjectId: "elem-math",
            masteryPercentage: 75,
            boxLevel: 3,
            attemptsCount: 3,
            nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  // 3. Teacher Account & Classroom
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@studyquest.ai" },
    update: {},
    create: {
      email: "teacher@studyquest.ai",
      name: "Mr. David Henderson (Teacher)",
      hashedPassword: defaultPasswordHash,
      role: "TEACHER",
      profile: {
        create: {
          educationTier: "adult",
          learningPreference: "visual",
          learningGoal: "school_excellence",
          dailyStudyMinutes: 30,
        },
      },
    },
  });

  // Create Classroom for Teacher with Student enrolled
  const classroom = await prisma.classroom.upsert({
    where: { code: "QUEST4" },
    update: {},
    create: {
      name: "Grade 4 Star Explorers",
      gradeLevel: "Grade 4",
      code: "QUEST4",
      teacherId: teacher.id,
      students: {
        connect: [{ id: student.id }],
      },
    },
  });

  // 4. Administrator Account
  await prisma.user.upsert({
    where: { email: "admin@studyquest.ai" },
    update: {},
    create: {
      email: "admin@studyquest.ai",
      name: "StudyQuest Admin",
      hashedPassword: defaultPasswordHash,
      role: "ADMIN",
      profile: {
        create: {
          educationTier: "college",
          learningPreference: "mixed",
          learningGoal: "skill_building",
          dailyStudyMinutes: 30,
        },
      },
    },
  });

  console.log("Seeding complete! Created demo accounts:");
  console.log("  - Learner: student@studyquest.ai (pw: password123)");
  console.log("  - Parent:  parent@studyquest.ai  (pw: password123)");
  console.log("  - Teacher: teacher@studyquest.ai (pw: password123)");
  console.log("  - Admin:   admin@studyquest.ai   (pw: password123)");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
