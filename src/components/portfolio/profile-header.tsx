import Image from "next/image";
import {
  GithubLogo,
  LinkedinLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import profile from "@/data/profile.json";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  twitter: XLogo,
};

export function ProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-8 text-center md:items-start md:text-left">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--muted)]">
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {profile.title}
        </p>
      </div>

      <p className="max-w-md text-sm text-[var(--muted-foreground)]">
        {profile.bio}
      </p>

      <div className="flex gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="font-bold">{profile.stats.projects}</span>
          <span className="text-[var(--muted-foreground)]">Projects</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{profile.stats.experience}</span>
          <span className="text-[var(--muted-foreground)]">Experience</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{profile.stats.techStacks}</span>
          <span className="text-[var(--muted-foreground)]">Tech Stacks</span>
        </div>
      </div>

      <div className="flex gap-2">
        {profile.socials.map((social) => {
          const Icon = iconMap[social.platform];
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--accent)] transition-colors"
              aria-label={social.label}
            >
              {Icon && <Icon className="h-5 w-5" />}
            </a>
          );
        })}
      </div>
    </div>
  );
}
