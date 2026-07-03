import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const AI_CONTEXT = `# About Muji Alunika

## Who I Am
I'm Muji Alunika, a fullstack developer based in Indonesia. I specialize in building
modern web applications using TypeScript, Next.js, and various AI technologies.

## Personality & Working Style
- I love building tools that solve real problems.
- Active in the Indonesian developer community.
- Always experimenting with new AI technologies.

## Contact
- Email: muji@alunika.id
- GitHub: github.com/mujibur-rohman
- LinkedIn: linkedin.com/in/mujay

> Note: Detailed skills, experience, and projects are provided separately and kept in sync
> with the portfolio database.`;

async function main() {
  // --- Admin user ---
  const hashedPassword = await hash("muji6666", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@alunika.id" },
    update: {},
    create: {
      email: "admin@alunika.id",
      name: "Muji Burrohman",
      password: hashedPassword,
    },
  });
  console.log("Admin user:", user.email);

  // --- Profile (singleton) ---
  const profile = await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Muji Burrohman",
      title: "Fullstack Developer",
      bio: "Passionate fullstack developer building modern web applications. Love exploring AI, open-source, and creative coding.",
      avatar: "/avatar.jpg",
      location: "Indonesia",
      email: "muji@alunika.id",
      githubUsername: "mujibur-rohman",
      aiContext: AI_CONTEXT,
      socials: [
        {
          platform: "github",
          url: "https://github.com/mujibur-rohman",
          label: "GitHub",
        },
        {
          platform: "linkedin",
          url: "https://linkedin.com/in/mujay",
          label: "LinkedIn",
        },
        {
          platform: "twitter",
          url: "https://x.com/mujay",
          label: "X / Twitter",
        },
      ],
    },
  });
  console.log("Profile:", profile.name);

  // --- Skills ---
  if ((await prisma.skill.count()) === 0) {
    const skills: { name: string; category: string; level: number }[] = [
      { name: "React", category: "Frontend", level: 95 },
      { name: "Next.js", category: "Frontend", level: 95 },
      { name: "TypeScript", category: "Frontend", level: 90 },
      { name: "Tailwind CSS", category: "Frontend", level: 90 },
      { name: "Node.js", category: "Backend", level: 88 },
      { name: "Express", category: "Backend", level: 82 },
      { name: "Prisma", category: "Backend", level: 85 },
      { name: "PostgreSQL", category: "Backend", level: 80 },
      { name: "OpenAI API", category: "AI / ML", level: 85 },
      { name: "LangChain", category: "AI / ML", level: 78 },
      { name: "RAG Systems", category: "AI / ML", level: 80 },
      { name: "Docker", category: "DevOps", level: 75 },
      { name: "AWS", category: "DevOps", level: 72 },
      { name: "Vercel", category: "DevOps", level: 88 },
      { name: "Git", category: "Tools", level: 90 },
    ];
    await prisma.skill.createMany({
      data: skills.map((s, i) => ({ ...s, order: i })),
    });
    console.log("Skills seeded:", skills.length);
  }

  // --- Experiences ---
  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({
      data: [
        {
          role: "Senior Fullstack Developer",
          company: "Alunika",
          location: "Remote, Indonesia",
          employmentType: "Full-time",
          description:
            "Lead development of AI-powered web applications. Architect end-to-end features from database to UI, integrate LLMs, and mentor junior developers.",
          techStack: [
            "Next.js",
            "TypeScript",
            "Prisma",
            "PostgreSQL",
            "OpenAI API",
          ],
          startDate: new Date("2022-01-01"),
          endDate: null,
          current: true,
          order: 0,
        },
        {
          role: "Fullstack Developer",
          company: "Abangantech",
          location: "Indonesia",
          employmentType: "Full-time",
          description:
            "Built a learning platform with interactive modules, quizzes, and community discussions serving thousands of students.",
          techStack: ["React", "Node.js", "Express", "PostgreSQL"],
          startDate: new Date("2020-03-01"),
          endDate: new Date("2021-12-31"),
          current: false,
          order: 1,
        },
        {
          role: "Frontend Developer",
          company: "Freelance",
          location: "Indonesia",
          employmentType: "Freelance",
          description:
            "Delivered responsive websites and dashboards for various clients, focused on performance and clean UI.",
          techStack: ["React", "TypeScript", "Tailwind CSS"],
          startDate: new Date("2019-01-01"),
          endDate: new Date("2020-02-28"),
          current: false,
          order: 2,
        },
      ],
    });
    console.log("Experiences seeded: 3");
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
