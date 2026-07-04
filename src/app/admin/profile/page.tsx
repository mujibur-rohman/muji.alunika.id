import { getProfile, getSocials } from "@/lib/profile";
import { ProfileForm } from "./_module/components/profile-form";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <ProfileForm
      initialData={{
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        location: profile.location ?? "",
        email: profile.email ?? "",
        githubUsername: profile.githubUsername ?? "",
        aiContext: profile.aiContext,
        socials: getSocials(profile),
      }}
    />
  );
}
