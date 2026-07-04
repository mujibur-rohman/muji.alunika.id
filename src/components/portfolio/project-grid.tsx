"use client";

import { useRouter } from "next/navigation";
import { ProjectCard } from "./project-card";
import { startNavProgress } from "@/components/layout/nav-progress";
import type { ProjectView } from "./types";

export function ProjectGrid({ projects }: { projects: ProjectView[] }) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
        No projects yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-8 pt-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          thumbnail={project.thumbnail}
          onClick={() => {
            startNavProgress();
            router.push(`/projects/${project.slug}`);
          }}
        />
      ))}
    </div>
  );
}
