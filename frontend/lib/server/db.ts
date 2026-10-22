/**
 * Pool de PostgreSQL (singleton). La app Next.js se conecta directo a
 * PostgreSQL 16 + pgvector; no hay backend separado por defecto.
 * Requiere DATABASE_URL (ver frontend/.env.example).
 */
import { Pool } from "pg";

declare global {
  // Evita crear pools duplicados en dev (hot reload de Next.js).
  // eslint-disable-next-line no-var
  var __aceleradorPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!globalThis.__aceleradorPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL no está configurada. Copia frontend/.env.example a .env.local.");
    }

    const isCloud =
      connectionString.includes("neon.tech") ||
      connectionString.includes("supabase.co") ||
      connectionString.includes("sslmode=require") ||
      connectionString.includes("aws.") ||
      process.env.NODE_ENV === "production";

    globalThis.__aceleradorPool = new Pool({
      connectionString,
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
    });
  }
  return globalThis.__aceleradorPool;
}

/** Verificación de salud: SELECT 1 + extensión vector instalada. */
export async function checkDbHealth(): Promise<{ ok: boolean; vector: boolean }> {
  const pool = getPool();
  await pool.query("SELECT 1");
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS n FROM pg_extension WHERE extname = 'vector'"
  );
  return { ok: true, vector: rows[0].n > 0 };
}
