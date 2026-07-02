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
        "group relative aspect-square w-full overflow-hidden rounded-sm bg-[var(--muted)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
      )}
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover transition-transform duration-200 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50">
        <span className="text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          {title}
        </span>
      </div>
    </button>
  );
}
