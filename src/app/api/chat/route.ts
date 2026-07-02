import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const KIE_AI_URL =
  process.env.KIE_AI_URL ?? "https://api.kie.ai/v1/chat/completions";
const KIE_AI_KEY = process.env.KIE_AI_KEY ?? "";

async function getAboutContext(): Promise<string> {
  try {
    const filePath = join(process.cwd(), "src/data/about.md");
    return await readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages } = body;

  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const aboutContext = await getAboutContext();

  const systemPrompt = `You are an AI assistant on Muji Alunika's personal portfolio website. Answer questions about Muji based on the following information. Be friendly, concise, and helpful. Answer in the same language the user uses (Indonesian or English).

Here is information about Muji:

${aboutContext}

Important rules:
- Only answer questions related to Muji's profile, skills, experience, and projects.
- If asked something unrelated, politely redirect to topics about Muji.
- Keep answers concise (2-4 sentences unless more detail is needed).
- Use markdown formatting when appropriate.`;

  try {
    const res = await fetch(KIE_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIE_AI_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10), // Keep last 10 messages for context
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("kie.ai error:", errorText);
      return NextResponse.json(
        { message: "Maaf, AI sedang tidak tersedia. Coba lagi nanti." },
        { status: 200 },
      );
    }

    const data = await res.json();
    const message =
      data.choices?.[0]?.message?.content ??
      "Maaf, saya tidak bisa menjawab saat ini.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "Maaf, terjadi kesalahan. Coba lagi nanti." },
      { status: 200 },
    );
  }
}
