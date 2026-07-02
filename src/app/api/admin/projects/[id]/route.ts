import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { deleteS3Object } from "@/lib/s3";

// GET /api/admin/projects/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: project });
}

// PUT /api/admin/projects/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const {
    title,
    slug,
    description,
    techStack,
    demoUrl,
    repoUrl,
    featured,
    order,
  } = body;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(techStack && { techStack }),
      ...(demoUrl !== undefined && { demoUrl: demoUrl || null }),
      ...(repoUrl !== undefined && { repoUrl: repoUrl || null }),
      ...(featured !== undefined && { featured }),
      ...(order !== undefined && { order }),
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ data: project });
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Delete S3 images first
  const images = await prisma.projectImage.findMany({
    where: { projectId: id },
  });
  for (const img of images) {
    try {
      await deleteS3Object(img.key);
    } catch (e) {
      console.error("Failed to delete S3 object:", img.key, e);
    }
  }

  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
