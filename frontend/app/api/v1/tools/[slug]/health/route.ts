import { NextResponse } from "next/server";
import { getPool } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/** GET /api/v1/tools/{slug}/health — Health Score + desglose ponderado. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT name, slug, license, health_score,
            commit_velocity_score, security_score, docs_score,
            (commit_velocity_score * 0.15 + security_score * 0.20 + docs_score * 0.65) AS weighted_health
     FROM oss_repositories WHERE slug = $1`,
    [slug]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: `Herramienta no encontrada: ${slug}` }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}
