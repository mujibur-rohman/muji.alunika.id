import { prisma } from "@/lib/prisma";
import { ProjectListClient } from "./_module/components/project-list-client";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { order: "asc" },
  });

  return <ProjectListClient initialProjects={projects} />;
}
