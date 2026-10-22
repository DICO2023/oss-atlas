import { NextResponse } from "next/server";
import { z } from "zod";
import { hybridSearch } from "@/lib/server/search";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  query: z.string().min(1).max(1000),
  embedding: z.array(z.number()).length(1536).optional(),
});

/** POST /api/v1/hybrid-search — FTS 'simple' + HNSW halfvec + RRF (k=60). */
export async function POST(request: Request) {
  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Cuerpo inválido", issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const results = await hybridSearch(parsed.data.query, parsed.data.embedding);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Búsqueda híbrida no disponible" },
      { status: 503 }
    );
  }
}
