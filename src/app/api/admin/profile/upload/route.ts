import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUploadPresignedUrl, getS3Url } from "@/lib/s3";
import { randomUUID } from "crypto";

// POST /api/admin/profile/upload — presigned URL for avatar or CV upload
// body: { type: "avatar" | "cv", fileName, contentType }
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, fileName, contentType } = await request.json();

  if (!fileName || !contentType || (type !== "avatar" && type !== "cv")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const key = `profile/${type}/${randomUUID()}.${ext}`;
  const presignedUrl = await getUploadPresignedUrl(key, contentType);
  const url = getS3Url(key);

  return NextResponse.json({ data: { presignedUrl, url, key } });
}
