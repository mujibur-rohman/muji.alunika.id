import { prisma } from "@/lib/prisma";
import { readProfile, getSocials, getStats } from "@/lib/profile";
import { PortfolioShell } from "@/components/portfolio/portfolio-shell";
import type {
  ProfileView,
  ProjectView,
  ExperienceView,
  SkillView,
} from "@/components/portfolio/types";

// Always render fresh so admin edits show up immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects, experiences, skills, stats] = await Promise.all([
    readProfile(),
    prisma.project.findMany({
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { order: "asc" },
    }),
    prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    getStats(),
  ]);

  const profileView: ProfileView = {
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    location: profile.location,
    email: profile.email,
    githubUsername: profile.githubUsername,
    socials: getSocials(profile),
  };

  const projectViews: ProjectView[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    techStack: p.techStack,
    thumbnail: p.images[0]?.url ?? "",
  }));

  const experienceViews: ExperienceView[] = experiences.map((e) => ({
    id: e.id,
    role: e.role,
    company: e.company,
    companyUrl: e.companyUrl,
    location: e.location,
    employmentType: e.employmentType,
    description: e.description,
    techStack: e.techStack,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString() ?? null,
    current: e.current,
  }));

  const skillViews: SkillView[] = skills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    level: s.level,
  }));

  return (
    <PortfolioShell
      profile={profileView}
      stats={stats}
      projects={projectViews}
      experiences={experienceViews}
      skills={skillViews}
    />
  );
}
