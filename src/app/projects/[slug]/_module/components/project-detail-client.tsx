"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowSquareOut, GithubLogo } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProjectImage {
  id: string;
  url: string;
  key: string;
  order: number;
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

export function ProjectDetailClient({ project }: { project: Project }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
          <Link
            href="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--accent)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">{project.title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Image Gallery */}
        {project.images.length > 0 && (
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-[var(--muted)]">
              <Image
                src={project.images[activeImage]?.url ?? ""}
                alt={`${project.title} screenshot ${activeImage + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>

            {project.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {project.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                      i === activeImage
                        ? "border-[var(--primary)]"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="mt-2 text-[var(--muted-foreground)]">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90"
              >
                <ArrowSquareOut className="h-4 w-4" />
                Detail App
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent)]"
              >
                <GithubLogo className="h-4 w-4" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
