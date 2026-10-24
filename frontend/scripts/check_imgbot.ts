import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^DATABASE_URL=(.+)$/m);
const databaseUrl = match ? match[1].trim() : process.env.DATABASE_URL;

const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function checkImgbot() {
  try {
    const res = await pool.query(`
      SELECT id, name, slug, category, license, health_score, status 
      FROM oss_repositories 
      WHERE slug ILIKE '%imgbot%'
    `);
    console.log('Imgbot en base de datos:', res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkImgbot();
