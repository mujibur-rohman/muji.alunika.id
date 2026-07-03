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
        avatar: profile.avatar,
        location: profile.location ?? "",
        email: profile.email ?? "",
        githubUsername: profile.githubUsername ?? "",
        aiContext: profile.aiContext,
        cvUrl: profile.cvUrl,
        cvKey: profile.cvKey,
        socials: getSocials(profile),
      }}
    />
  );
}
