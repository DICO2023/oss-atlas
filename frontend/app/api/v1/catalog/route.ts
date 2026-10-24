import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  category: z.enum(["AUTH", "DBS", "PAYMENTS", "AI"]).optional(),
  license: z.enum(["MIT", "Apache-2.0", "PostgreSQL", "BSL-1.1"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

/** GET /api/v1/catalog?category=&license=&limit= — catálogo desde PostgreSQL. */
export async function GET(request: NextRequest) {
  const parsed = QuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Parámetros inválidos", issues: parsed.error.issues }, { status: 400 });
  }
  const { category, license, limit } = parsed.data;
  const pool = getPool();
  const conditions: string[] = [];
  const values: unknown[] = [];
  if (category) { values.push(category); conditions.push(`category = $${values.length}`); }
  if (license) { values.push(license); conditions.push(`license = $${values.length}`); }
  values.push(limit);
  const { rows } = await pool.query(
    `SELECT id, name, slug, category, license, health_score,
            commit_velocity_score, security_score, docs_score,
            stars, description, docker_command, integration_difficulty,
            triggers, dependencies, etag, COALESCE(status, 'APPROVED') AS status
     FROM oss_repositories
     ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
     ORDER BY health_score DESC LIMIT $${values.length}`,
    values
  );
  // Cálculo determinista de ETag agregado para negociación de caché HTTP 304
  const etagFingerprint = rows.map((r: { slug: string; etag?: string | null; health_score: number | string }) => `${r.slug}:${r.etag || r.health_score}`).join("|");
  const catalogEtag = `W/"catalog-${rows.length}-${Buffer.from(etagFingerprint).toString("base64").slice(0, 24)}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && (ifNoneMatch === catalogEtag || ifNoneMatch.includes(catalogEtag))) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: catalogEtag,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "X-Catalog-Count": String(rows.length),
      },
    });
  }

  return NextResponse.json(rows, {
    headers: {
      ETag: catalogEtag,
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Catalog-Count": String(rows.length),
    },
  });
}
