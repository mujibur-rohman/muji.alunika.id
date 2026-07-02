"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash } from "lucide-react";

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
  featured: boolean;
  order: number;
  images: ProjectImage[];
}

export function ProjectListClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus project ini?")) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="py-12 text-center text-[var(--muted-foreground)]">
          Belum ada project. Klik &quot;Add Project&quot; untuk membuat.
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]">
                {project.images[0] ? (
                  <Image
                    src={project.images[0].url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--muted-foreground)]">
                    No img
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="truncate text-sm text-[var(--muted-foreground)]">
                  {project.description}
                </p>
                <div className="mt-1 flex gap-1.5">
                  {project.techStack.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded bg-[var(--secondary)] px-1.5 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--accent)]"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleting === project.id}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
