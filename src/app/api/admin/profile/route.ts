import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { deleteS3Object } from "@/lib/s3";

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
    avatar,
    location,
    email,
    githubUsername,
    aiContext,
    socials,
    cvUrl,
    cvKey,
  } = body;

  // If the CV is being replaced or removed, delete the previous S3 object.
  if (cvKey !== undefined && current.cvKey && current.cvKey !== cvKey) {
    try {
      await deleteS3Object(current.cvKey);
    } catch (e) {
      console.error("Failed to delete old CV:", current.cvKey, e);
    }
  }

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
      ...(avatar !== undefined && { avatar: avatar || "/avatar.jpg" }),
      ...(location !== undefined && { location: location || null }),
      ...(email !== undefined && { email: email || null }),
      ...(githubUsername !== undefined && {
        githubUsername: githubUsername || null,
      }),
      ...(aiContext !== undefined && { aiContext: aiContext ?? "" }),
      ...(socialsClean !== undefined && { socials: socialsClean }),
      ...(cvUrl !== undefined && { cvUrl: cvUrl || null }),
      ...(cvKey !== undefined && { cvKey: cvKey || null }),
    },
  });

  return NextResponse.json({ data: profile });
}
