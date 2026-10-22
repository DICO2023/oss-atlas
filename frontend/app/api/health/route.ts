import { NextResponse } from "next/server";
import { checkDbHealth } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/** GET /api/health — salud de la app + PostgreSQL + pgvector. */
export async function GET() {
  try {
    const db = await checkDbHealth();
    return NextResponse.json({ status: "ok", db });
  } catch (error) {
    return NextResponse.json(
      { status: "degraded", error: error instanceof Error ? error.message : "DB no disponible" },
      { status: 503 }
    );
  }
}
