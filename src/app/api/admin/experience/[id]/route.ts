import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/experience/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: experience });
}

// PUT /api/admin/experience/[id]
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
    role,
    company,
    companyUrl,
    location,
    employmentType,
    description,
    techStack,
    startDate,
    endDate,
    current,
    order,
  } = body;

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      ...(role !== undefined && { role }),
      ...(company !== undefined && { company }),
      ...(companyUrl !== undefined && { companyUrl: companyUrl || null }),
      ...(location !== undefined && { location: location || null }),
      ...(employmentType !== undefined && {
        employmentType: employmentType || null,
      }),
      ...(description !== undefined && { description: description ?? "" }),
      ...(techStack !== undefined && {
        techStack: Array.isArray(techStack) ? techStack : [],
      }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(current !== undefined && { current: !!current }),
      ...(endDate !== undefined && {
        endDate: current || !endDate ? null : new Date(endDate),
      }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ data: experience });
}

// DELETE /api/admin/experience/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
