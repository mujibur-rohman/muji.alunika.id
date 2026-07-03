import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../_module/components/experience-form";

function toMonth(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 7); // YYYY-MM
}

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await prisma.experience.findUnique({ where: { id } });
  if (!exp) notFound();

  return (
    <ExperienceForm
      initialData={{
        id: exp.id,
        role: exp.role,
        company: exp.company,
        companyUrl: exp.companyUrl ?? "",
        location: exp.location ?? "",
        employmentType: exp.employmentType ?? "Full-time",
        description: exp.description,
        techStack: exp.techStack,
        startDate: toMonth(exp.startDate),
        endDate: toMonth(exp.endDate),
        current: exp.current,
        order: exp.order,
      }}
    />
  );
}
