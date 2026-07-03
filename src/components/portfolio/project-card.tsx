"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  thumbnail: string;
  onClick: () => void;
}

export function ProjectCard({ title, thumbnail, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-[var(--foreground)]/20 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
      )}
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-2 text-center text-xs font-medium text-[var(--muted-foreground)]">
          {title}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50">
        <span className="text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          {title}
        </span>
      </div>
    </button>
  );
}
