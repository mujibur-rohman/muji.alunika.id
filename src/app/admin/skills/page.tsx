import { prisma } from "@/lib/prisma";
import { SkillsManager } from "./_module/components/skills-manager";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return <SkillsManager initialSkills={skills} />;
}
