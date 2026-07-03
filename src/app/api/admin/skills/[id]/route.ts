import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PUT /api/admin/skills/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, category, level, order } = await request.json();

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category: category || "Other" }),
      ...(level !== undefined && {
        level: typeof level === "number" ? level : null,
      }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ data: skill });
}

// DELETE /api/admin/skills/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
