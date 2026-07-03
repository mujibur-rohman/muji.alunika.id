import type { Social } from "@/lib/profile";

export interface ProfileView {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string | null;
  email: string | null;
  cvUrl: string | null;
  githubUsername: string | null;
  socials: Social[];
}

export interface StatsView {
  projects: number;
  experience: string;
  techStacks: number;
}

export interface ProjectView {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  thumbnail: string;
}

export interface ExperienceView {
  id: string;
  role: string;
  company: string;
  companyUrl: string | null;
  location: string | null;
  employmentType: string | null;
  description: string;
  techStack: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export interface SkillView {
  id: string;
  name: string;
  category: string;
  level: number | null;
}
