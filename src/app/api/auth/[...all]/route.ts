import { NextRequest, NextResponse } from "next/server";
import { signIn, signOut } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;
  const action = all.join("/");

  if (action === "sign-in") {
    const { email, password } = await request.json();
    const user = await signIn(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  }

  if (action === "sign-out") {
    await signOut();
    return NextResponse.json({ message: "Signed out" });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
