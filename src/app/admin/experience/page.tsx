import { prisma } from "@/lib/prisma";
import { ExperienceListClient } from "./_module/components/experience-list-client";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });

  return (
    <ExperienceListClient
      initialExperiences={experiences.map((e) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        location: e.location,
        employmentType: e.employmentType,
        current: e.current,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate?.toISOString() ?? null,
      }))}
    />
  );
}
