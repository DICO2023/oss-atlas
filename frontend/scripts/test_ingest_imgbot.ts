import * as fs from 'fs';
import * as path from 'path';

// Asegurar DATABASE_URL en process.env
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^DATABASE_URL=(.+)$/m);
if (match) process.env.DATABASE_URL = match[1].trim();

import { POST } from '../app/api/v1/github/evaluate/route';

async function testIngestImgbot() {
  console.log('⚡ Probando ingesta de Imgbot con autoIngest: true...');
  const req = new Request('http://localhost:3000/api/v1/github/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'Imgbot/Imgbot', autoIngest: true }),
  });

  const res = await POST(req as any);
  console.log('HTTP Status:', res.status);
  const data = await res.json();
  console.log('Ingested record:', data.ingested);
  console.log('Audit status:', data.audit?.status);
}

testIngestImgbot();
