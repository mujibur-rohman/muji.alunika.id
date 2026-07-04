import { readProfile } from "@/lib/profile";
import { TemplatesClient } from "./_module/components/templates-client";

export default async function AdminTemplatesPage() {
  const profile = await readProfile();
  return <TemplatesClient email={profile.email} name={profile.name} />;
}
