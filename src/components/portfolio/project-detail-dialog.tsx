"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react";

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
}

interface ProjectDetailDialogProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailDialog({
  project,
  onClose,
}: ProjectDetailDialogProps) {
  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        {project && (
          <>
            <DialogHeader>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>{project.description}</DialogDescription>
            </DialogHeader>

            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[var(--muted)]">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  <ArrowSquareOut className="h-4 w-4" />
                  Detail AppLive Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  <GithubLogo className="h-4 w-4" />
                  Source Code
                </a>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
