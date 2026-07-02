"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "./project-card";

interface ProjectImage {
  id: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  images: ProjectImage[];
}

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1 px-4 pb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-sm bg-[var(--muted)]"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
        No projects yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 px-4 pb-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          thumbnail={project.images[0]?.url ?? ""}
          onClick={() => router.push(`/projects/${project.slug}`)}
        />
      ))}
    </div>
  );
}
