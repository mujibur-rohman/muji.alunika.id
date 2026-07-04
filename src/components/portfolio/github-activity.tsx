"use client";

import { useEffect, useState } from "react";
import { GitBranch, Star, GitFork, Eye } from "lucide-react";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  createdAt: string;
  action?: string;
}

export function GithubActivity({ username }: { username: string | null }) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(() => Boolean(username));

  useEffect(() => {
    if (!username) return;
    async function fetchGitHub() {
      try {
        const [userRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(
            `https://api.github.com/users/${username}/events/public?per_page=10`,
          ),
        ]);

        if (userRes.ok) {
          const user = await userRes.json();
          setStats({
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            totalStars: 0, // Would need separate API call for total stars
          });
        }

        if (eventsRes.ok) {
          const rawEvents = await eventsRes.json();
          const mapped = rawEvents
            .slice(0, 8)
            .map(
              (e: {
                id: string;
                type: string;
                repo: { name: string };
                created_at: string;
                payload?: { action?: string };
              }) => ({
                id: e.id,
                type: e.type,
                repo: e.repo.name,
                createdAt: e.created_at,
                action: e.payload?.action,
              }),
            );
          setEvents(mapped);
        }
      } catch (err) {
        console.error("GitHub fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHub();
  }, [username]);

  if (!username) {
    return (
      <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
        No GitHub username configured yet.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--muted-foreground)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<GitBranch className="h-4 w-4" />}
            label="Repos"
            value={stats.publicRepos}
          />
          <StatCard
            icon={<Star className="h-4 w-4" />}
            label="Stars"
            value={stats.totalStars}
          />
          <StatCard
            icon={<Eye className="h-4 w-4" />}
            label="Followers"
            value={stats.followers}
          />
          <StatCard
            icon={<GitFork className="h-4 w-4" />}
            label="Following"
            value={stats.following}
          />
        </div>
      )}

      {/* Contribution Graph Placeholder */}
      <div className="overflow-hidden rounded-md border">
        <div className="border-b px-4 py-2.5">
          <h3 className="text-sm font-semibold">Contribution Graph</h3>
        </div>
        <div className="p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ghchart.rshah.org/${username}`}
            alt="GitHub Contribution Graph"
            className="w-full dark:invert dark:hue-rotate-180"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border px-3 py-3">
      <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}

function getEventIcon(type: string) {
  switch (type) {
    case "PushEvent":
      return <GitBranch className="h-4 w-4" />;
    case "WatchEvent":
      return <Star className="h-4 w-4" />;
    case "ForkEvent":
      return <GitFork className="h-4 w-4" />;
    default:
      return <GitBranch className="h-4 w-4" />;
  }
}

function formatEventType(type: string, action?: string): string {
  switch (type) {
    case "PushEvent":
      return "Pushed to";
    case "CreateEvent":
      return "Created";
    case "WatchEvent":
      return "Starred";
    case "ForkEvent":
      return "Forked";
    case "IssuesEvent":
      return `${action ?? "Opened"} issue in`;
    case "PullRequestEvent":
      return `${action ?? "Opened"} PR in`;
    case "IssueCommentEvent":
      return "Commented on";
    default:
      return type.replace("Event", "") + " in";
  }
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
