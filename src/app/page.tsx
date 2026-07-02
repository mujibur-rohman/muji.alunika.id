"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ProfileHeader } from "@/components/portfolio/profile-header";
import { ProfileTabs, type TabType } from "@/components/portfolio/profile-tabs";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { GithubActivity } from "@/components/portfolio/github-activity";
import { ChatPanel } from "@/components/chat/chat-panel";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("projects");

  return (
    <div className="flex h-screen flex-col">
      <Navbar onChatToggle={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* Portfolio content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl">
            <ProfileHeader />
            <ProfileTabs active={activeTab} onChange={setActiveTab} />
            {activeTab === "projects" ? <ProjectGrid /> : <GithubActivity />}
          </div>
        </main>

        {/* Chat sidebar */}
        <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}
