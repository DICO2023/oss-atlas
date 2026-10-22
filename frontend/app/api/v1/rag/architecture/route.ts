import { NextResponse } from "next/server";
import { z } from "zod";
import { generateArchitecture } from "@/lib/server/rag";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BodySchema = z.object({ prompt: z.string().min(1).max(2000) });

/** POST /api/v1/rag/architecture — mapa de arquitectura RAG (LangChain + Claude). */
export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Cuerpo inválido", issues: parsed.error.issues }, { status: 400 });
  }
  try {
    return NextResponse.json(await generateArchitecture(parsed.data.prompt));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Arquitecto RAG no disponible" },
      { status: 503 }
    );
  }
}
