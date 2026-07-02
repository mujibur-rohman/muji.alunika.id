import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getUploadPresignedUrl, getS3Url, deleteS3Object } from "@/lib/s3";
import { randomUUID } from "crypto";

// POST /api/admin/projects/[id]/images — Get presigned URL for upload
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { fileName, contentType } = body;

  if (!fileName || !contentType) {
    return NextResponse.json(
      { error: "Missing fileName or contentType" },
      { status: 400 },
    );
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const ext = fileName.split(".").pop() ?? "jpg";
  const key = `projects/${id}/${randomUUID()}.${ext}`;
  const presignedUrl = await getUploadPresignedUrl(key, contentType);
  const imageUrl = getS3Url(key);

  // Get next order
  const lastImage = await prisma.projectImage.findFirst({
    where: { projectId: id },
    orderBy: { order: "desc" },
  });

  const image = await prisma.projectImage.create({
    data: {
      projectId: id,
      url: imageUrl,
      key,
      order: (lastImage?.order ?? -1) + 1,
    },
  });

  return NextResponse.json({
    data: {
      presignedUrl,
      image,
    },
  });
}

// DELETE /api/admin/projects/[id]/images — Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
  }

  const image = await prisma.projectImage.findUnique({
    where: { id: imageId },
  });
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  try {
    await deleteS3Object(image.key);
  } catch (e) {
    console.error("Failed to delete S3 object:", image.key, e);
  }

  await prisma.projectImage.delete({ where: { id: imageId } });

  return NextResponse.json({ message: "Deleted" });
}
