"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs, type TabType } from "./profile-tabs";
import { ProjectGrid } from "./project-grid";
import { ExperienceTimeline } from "./experience-timeline";
import { SkillsSection } from "./skills-section";
import { GithubActivity } from "./github-activity";
import { ChatPanel } from "@/components/chat/chat-panel";
import type {
  ProfileView,
  StatsView,
  ProjectView,
  ExperienceView,
  SkillView,
} from "./types";

interface PortfolioShellProps {
  profile: ProfileView;
  stats: StatsView;
  projects: ProjectView[];
  experiences: ExperienceView[];
  skills: SkillView[];
}

export function PortfolioShell({
  profile,
  stats,
  projects,
  experiences,
  skills,
}: PortfolioShellProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("projects");

  return (
    <div className="relative flex h-screen flex-col">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="portfolio-bg absolute inset-0" />
        <div className="portfolio-glow absolute inset-x-0 top-0 h-[420px]" />
      </div>

      <Navbar
        title={profile.name}
        onChatToggle={() => setChatOpen(!chatOpen)}
        chatOpen={chatOpen}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ProfileHeader profile={profile} stats={stats} />
            </div>
            <ProfileTabs active={activeTab} onChange={setActiveTab} />

            <div
              key={activeTab}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {activeTab === "projects" && <ProjectGrid projects={projects} />}
              {activeTab === "experience" && (
                <ExperienceTimeline experiences={experiences} />
              )}
              {activeTab === "skills" && <SkillsSection skills={skills} />}
              {activeTab === "github" && (
                <GithubActivity username={profile.githubUsername} />
              )}
            </div>
          </div>
        </main>

        <ChatPanel
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          name={profile.name}
        />
      </div>
    </div>
  );
}
