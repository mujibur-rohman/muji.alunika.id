import { prisma } from "./prisma";
import type { Profile, Experience, Skill } from "@/generated/prisma/client";

export interface Social {
  platform: string;
  url: string;
  label: string;
}

const PROFILE_ID = "singleton";

const DEFAULT_PROFILE = {
  id: PROFILE_ID,
  name: "Your Name",
  title: "Your Title",
  bio: "Add your bio in the admin panel.",
  avatar: "/avatar.jpg",
  location: null,
  email: null,
  githubUsername: null,
  aiContext: "",
  cvUrl: null,
  cvKey: null,
  socials: [],
  updatedAt: new Date(),
} satisfies Profile;

/** Returns the singleton profile row, creating a default one if it doesn't exist. */
export async function getProfile(): Promise<Profile> {
  const existing = await prisma.profile.findFirst();
  if (existing) return existing;

  return prisma.profile.create({
    data: {
      id: PROFILE_ID,
      name: DEFAULT_PROFILE.name,
      title: DEFAULT_PROFILE.title,
      bio: DEFAULT_PROFILE.bio,
    },
  });
}

/** Reads the profile without side effects (safe for public reads). */
export async function readProfile(): Promise<Profile> {
  return (await prisma.profile.findFirst()) ?? DEFAULT_PROFILE;
}

export function getSocials(profile: Pick<Profile, "socials">): Social[] {
  if (!Array.isArray(profile.socials)) return [];
  return profile.socials as unknown as Social[];
}

export interface ProfileStats {
  projects: number;
  experience: string;
  techStacks: number;
}

/** Formats total years of experience from the earliest experience start date. */
export function formatYearsOfExperience(experiences: Pick<Experience, "startDate">[]): string {
  if (experiences.length === 0) return "New";
  const earliest = experiences.reduce(
    (min, e) => (e.startDate < min ? e.startDate : min),
    experiences[0].startDate,
  );
  const years = Math.floor(
    (Date.now() - new Date(earliest).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  if (years < 1) return "< 1 year";
  return `${years}+ years`;
}

export async function getStats(): Promise<ProfileStats> {
  const [projects, techStacks, experiences] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.findMany({ select: { startDate: true } }),
  ]);

  return {
    projects,
    experience: formatYearsOfExperience(experiences),
    techStacks,
  };
}

type ProjectSummary = { title: string; description: string; techStack: string[] };

/**
 * Builds the grounding context handed to the AI assistant: the admin-authored
 * markdown plus a structured summary of skills, experience, and projects from the DB.
 */
export function buildAiContext(
  profile: Profile,
  skills: Skill[],
  experiences: Experience[],
  projects: ProjectSummary[],
): string {
  const parts: string[] = [];

  parts.push(`Name: ${profile.name}`);
  parts.push(`Title: ${profile.title}`);
  if (profile.location) parts.push(`Location: ${profile.location}`);
  if (profile.email) parts.push(`Email: ${profile.email}`);
  parts.push(`Bio: ${profile.bio}`);

  if (profile.aiContext.trim()) {
    parts.push(`\n## Notes\n${profile.aiContext.trim()}`);
  }

  if (skills.length) {
    const byCategory = new Map<string, string[]>();
    for (const s of skills) {
      const list = byCategory.get(s.category) ?? [];
      list.push(s.name);
      byCategory.set(s.category, list);
    }
    const lines = [...byCategory.entries()].map(
      ([cat, names]) => `- ${cat}: ${names.join(", ")}`,
    );
    parts.push(`\n## Skills\n${lines.join("\n")}`);
  }

  if (experiences.length) {
    const lines = experiences.map((e) => {
      const start = new Date(e.startDate).getFullYear();
      const end = e.current ? "Present" : e.endDate ? new Date(e.endDate).getFullYear() : "";
      const range = end ? `${start}–${end}` : `${start}`;
      const tech = e.techStack.length ? ` [${e.techStack.join(", ")}]` : "";
      return `- ${e.role} at ${e.company} (${range}): ${e.description}${tech}`;
    });
    parts.push(`\n## Experience\n${lines.join("\n")}`);
  }

  if (projects.length) {
    const lines = projects.map(
      (p) => `- ${p.title}: ${p.description} [${p.techStack.join(", ")}]`,
    );
    parts.push(`\n## Projects\n${lines.join("\n")}`);
  }

  return parts.join("\n");
}
