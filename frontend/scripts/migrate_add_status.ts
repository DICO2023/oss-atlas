import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

// Leer .env.local directamente
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^DATABASE_URL=(.+)$/m);
const databaseUrl = match ? match[1].trim() : process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ No se encontró DATABASE_URL');
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function migrate() {
  try {
    console.log('Conectando a Neon Serverless PostgreSQL...');
    await pool.query(`
      ALTER TABLE oss_repositories 
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'APPROVED';
    `);
    console.log('✅ Columna status agregada exitosamente a oss_repositories.');

    // Verificar columnas
    const res = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'oss_repositories' AND column_name = 'status';
    `);
    console.log('Metadatos de columna status:', res.rows);
  } catch (error) {
    console.error('Error durante migración:', error);
  } finally {
    await pool.end();
  }
}

migrate();
