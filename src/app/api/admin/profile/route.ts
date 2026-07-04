import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

// GET /api/admin/profile — current profile
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile();
  return NextResponse.json({ data: profile });
}

// PUT /api/admin/profile — update the singleton profile
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const current = await getProfile();
  const body = await request.json();
  const {
    name,
    title,
    bio,
    location,
    email,
    githubUsername,
    aiContext,
    socials,
  } = body;

  const socialsClean = Array.isArray(socials)
    ? socials
        .filter((s: { url?: string }) => s?.url?.trim())
        .map((s: { platform?: string; url: string; label?: string }) => ({
          platform: s.platform ?? "link",
          url: s.url.trim(),
          label: s.label ?? s.platform ?? "Link",
        }))
    : undefined;

  const profile = await prisma.profile.update({
    where: { id: current.id },
    data: {
      ...(name !== undefined && { name }),
      ...(title !== undefined && { title }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location: location || null }),
      ...(email !== undefined && { email: email || null }),
      ...(githubUsername !== undefined && {
        githubUsername: githubUsername || null,
      }),
      ...(aiContext !== undefined && { aiContext: aiContext ?? "" }),
      ...(socialsClean !== undefined && { socials: socialsClean }),
    },
  });

  return NextResponse.json({ data: profile });
}
