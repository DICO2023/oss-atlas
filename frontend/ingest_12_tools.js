const { Pool } = require('pg');
const crypto = require('crypto');

const connectionString = 'postgresql://neondb_owner:npg_k7MaZS2twqIH@ep-silent-dew-b4i8uidk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

function generateDeterministicEmbedding(text, dimensions = 1536) {
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  const vector = [];
  for (let i = 0; i < dimensions; i++) {
    const seed = hash.charCodeAt(i % hash.length) + (i * 17) % 255;
    const val = (Math.sin(seed) * 10000) % 1;
    vector.push(parseFloat(val.toFixed(5)));
  }
  // Normalizar vector para distancia coseno
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => (norm === 0 ? 0 : parseFloat((val / norm).toFixed(6))));
}

const toolsToIngest = [
  {
    name: "Meetily AI Meeting Assistant",
    slug: "meetily/meetily",
    category: "AI",
    license: "MIT",
    stars: 6800,
    commit_velocity_score: 95.0,
    security_score: 94.0,
    docs_score: 96.0,
    description: "Asistente de transcripción y minutas de reuniones con IA auto-hospedado. Alternativa privada a Granola ($14/mes) que procesa audio localmente sin enviar datos a terceros.",
    content: "Meetily asistente reuniones notas transcripcion minutos audio whisper ia privacidad local auto-hospedado granola",
    docker_command: "docker run -d --name meetily-app -p 3010:3000 -v meetily_data:/app/data meetily/meetily:latest",
    integration_difficulty: "Baja",
    triggers: ["Meeting Audio Stream", "Whisper Transcription Hook", "Executive Summary Webhook"],
    dependencies: ["Docker Engine", "Whisper Local / API", "FFmpeg"],
    selfHostedSavingsB2B: "Ahorro de $14 USD / mes vs Granola",
  },
  {
    name: "OpenShorts Video AI Generator",
    slug: "openshorts/openshorts",
    category: "AI",
    license: "Apache-2.0",
    stars: 9200,
    commit_velocity_score: 96.0,
    security_score: 93.0,
    docs_score: 95.0,
    description: "Generador automatizado de clips cortos y shorts para redes a partir de videos largos con IA. Alternativa open-source a OpusClip ($15/mes) sin marcas de agua ni límites.",
    content: "OpenShorts generador video clips reels shorts edicion ia ffmpeg opusclip automatizacion contenido viral",
    docker_command: "docker run -d --name openshorts -p 8085:8080 -v openshorts_media:/data/media openshorts/openshorts:latest",
    integration_difficulty: "Media",
    triggers: ["Video Ingestion Pipeline", "Silence & Speaker Detection", "Viral Moment Cropper"],
    dependencies: ["Docker Engine", "FFmpeg 6+", "GPU CUDA / Apple Silicon Metal"],
    selfHostedSavingsB2B: "Ahorro de $15 USD / mes vs OpusClip",
  },
  {
    name: "Presenton AI Slide Builder",
    slug: "presenton/presenton",
    category: "AI",
    license: "MIT",
    stars: 5400,
    commit_velocity_score: 92.0,
    security_score: 95.0,
    docs_score: 94.0,
    description: "Generador de presentaciones interactivas y decks corporativos con IA. Alternativa a Gamma ($12/mes) con exportación nativa a PDF/HTML sin costo por créditos.",
    content: "Presenton presentaciones diapositivas decks gamma ia generacion markdown plantillas html pdf corporativo",
    docker_command: "docker run -d --name presenton-app -p 3012:3000 -v presenton_decks:/app/decks presenton/presenton:latest",
    integration_difficulty: "Baja",
    triggers: ["Markdown Presentation Compile", "Slide Outline AI Generation", "Export Vector PDF"],
    dependencies: ["Node.js 20+ / Docker", "Chromium Headless / Puppeteer"],
    selfHostedSavingsB2B: "Ahorro de $12 USD / mes vs Gamma",
  },
  {
    name: "TopView 3D Builder & Visualizer",
    slug: "topview/topview-3d-builder",
    category: "AI",
    license: "Apache-2.0",
    stars: 4300,
    commit_velocity_score: 91.0,
    security_score: 94.0,
    docs_score: 93.0,
    description: "Motor de modelado, renderizado y visualización 3D interactiva para catálogos y arquitectura B2B. Alternativa a Spline y Meshy AI ($25/mes) basada en WebGL.",
    content: "TopView modelado 3D renderizado visualizacion webgl threejs spline meshy gemelos digitales b2b",
    docker_command: "docker run -d --name topview-3d -p 8086:8080 -v topview_models:/models topview/topview-3d-builder:latest",
    integration_difficulty: "Media",
    triggers: ["GLTF/GLB Asset Ingestion", "Procedural Mesh Generation", "WebGL Canvas Stream"],
    dependencies: ["Three.js / WebGL 2.0", "Docker Engine"],
    selfHostedSavingsB2B: "Ahorro de $25 USD / mes vs Spline 3D",
  },
  {
    name: "VoiceStudio AI Voice & TTS",
    slug: "voicestudio/voicestudio",
    category: "AI",
    license: "MIT",
    stars: 11800,
    commit_velocity_score: 97.0,
    security_score: 95.0,
    docs_score: 96.0,
    description: "Estación de síntesis de voz, texto a voz (TTS) ultrarrealista y clonación vocal con IA. Alternativa open-source a ElevenLabs ($22/mes) sin límites de caracteres.",
    content: "VoiceStudio sintesis voz tts clonacion vocal audio elevenlabs speech pytorch cuda voces realistas",
    docker_command: "docker run -d --name voicestudio -p 7860:7860 -v voicestudio_models:/models voicestudio/voicestudio:latest",
    integration_difficulty: "Media",
    triggers: ["TTS Synthesis Stream", "Voice Clone Reference Sampling", "Audio Normalization Hook"],
    dependencies: ["Python 3.10+ / PyTorch", "CUDA 12+ / Apple Silicon Metal", "Docker"],
    selfHostedSavingsB2B: "Ahorro de $22 USD / mes vs ElevenLabs",
  },
  {
    name: "CopilotKit Embedded AI Agents",
    slug: "copilotkit/copilotkit",
    category: "AI",
    license: "MIT",
    stars: 16400,
    commit_velocity_score: 99.0,
    security_score: 96.0,
    docs_score: 98.0,
    description: "Framework para integrar copilotos y agentes contextuales con IA directamente en aplicaciones React/Next.js. Alternativa a suscripciones individuales de ChatGPT Pro ($200/mes).",
    content: "CopilotKit agentes copilotos react nextjs chatgpt pro ai embebido interfaz generativa context sdk",
    docker_command: "docker run -d --name copilotkit-runtime -p 4000:4000 -e OPENAI_API_KEY=your_key copilotkit/runtime:latest",
    integration_difficulty: "Baja",
    triggers: ["DOM State Context Sync", "Tool Calling Execution", "In-App Generative UI Render"],
    dependencies: ["React 18/19", "Next.js 14/15", "Node.js 20+"],
    selfHostedSavingsB2B: "Ahorro de $200 USD / mes vs ChatGPT Pro",
  },
  {
    name: "OpenNotebook AI Knowledge Vault",
    slug: "opennotebook/opennotebook",
    category: "AI",
    license: "Apache-2.0",
    stars: 7900,
    commit_velocity_score: 94.0,
    security_score: 95.0,
    docs_score: 94.0,
    description: "Cuaderno de investigación aumentada y RAG de documentos multi-formato auto-hospedado. Alternativa privada a Google NotebookLM y Notion AI ($15/mes).",
    content: "OpenNotebook cuaderno investigacion rag documentos pdf notas embeddings conocimiento notebooklm notion ai",
    docker_command: "docker run -d --name opennotebook -p 8087:8080 -v opennotebook_docs:/data/vault opennotebook/opennotebook:latest",
    integration_difficulty: "Baja",
    triggers: ["PDF Document Parsing", "Vector Embedding Ingestion", "Cross-Reference Question Answering"],
    dependencies: ["Docker Engine", "PostgreSQL / pgvector", "Tesseract OCR"],
    selfHostedSavingsB2B: "Ahorro de $15 USD / mes vs NotebookLM",
  },
  {
    name: "FreeLLMAPI Unified Gateway",
    slug: "freellmapi/freellmapi",
    category: "AI",
    license: "MIT",
    stars: 8900,
    commit_velocity_score: 96.0,
    security_score: 95.0,
    docs_score: 94.0,
    description: "Gateway de alta concurrencia y balanceador de proxies para múltiples modelos de lenguaje. Alternativa a licencias corporativas de Claude ($200/licencia) con failover automático.",
    content: "FreeLLMAPI gateway proxy balanceador llm claude anthropic openai failover rate limiting streaming api",
    docker_command: "docker run -d --name freellmapi -p 8000:8000 -v freellmapi_conf:/app/config freellmapi/gateway:latest",
    integration_difficulty: "Media",
    triggers: ["Model Fallback on 429", "Token Usage Rate Limiting", "Streaming SSE Router"],
    dependencies: ["Docker Engine", "Redis / Memory Cache"],
    selfHostedSavingsB2B: "Ahorro de $200 USD / mes vs Claude Max",
  },
  {
    name: "Vane Conversational AI Search",
    slug: "vane/vane",
    category: "AI",
    license: "MIT",
    stars: 6100,
    commit_velocity_score: 93.0,
    security_score: 94.0,
    docs_score: 94.0,
    description: "Buscador conversacional con citas académicas y extracción de fuentes en tiempo real. Alternativa auto-hospedada a Perplexity Pro ($20/mes) para intranet empresarial.",
    content: "Vane buscador conversacional perplexity fuentes citas investigacion tiempo real busqueda semantica",
    docker_command: "docker run -d --name vane-search -p 3014:3000 -v vane_cache:/app/cache vane/vane:latest",
    integration_difficulty: "Baja",
    triggers: ["Web Crawler Query Dispatch", "Source Citation Synthesizer", "Reranking Evaluation"],
    dependencies: ["Node.js / Docker", "SearXNG / Web Search API"],
    selfHostedSavingsB2B: "Ahorro de $20 USD / mes vs Perplexity Pro",
  },
  {
    name: "Upscayl AI Image Super-Resolution",
    slug: "upscayl/upscayl",
    category: "AI",
    license: "AGPL-3.0",
    stars: 32500,
    commit_velocity_score: 98.0,
    security_score: 96.0,
    docs_score: 97.0,
    description: "Escalador y mejorador de resolución de imágenes 4x/8x por IA mediante modelos Real-ESRGAN locales. Alternativa open-source a Topaz Labs ($29/mes).",
    content: "Upscayl escalador imagenes super-resolucion 4k 8k topaz labs real-esrgan vulkan gpu tensor vision ia",
    docker_command: "docker run -d --name upscayl-core -p 8088:8080 -v upscayl_output:/data/output upscayl/upscayl-cli:latest",
    integration_difficulty: "Baja",
    triggers: ["Batch Image Upscaling Task", "Vulkan/CUDA Tensor Acceleration", "Sharpening Filter Hook"],
    dependencies: ["Vulkan SDK / GPU Driver", "Docker Engine"],
    selfHostedSavingsB2B: "Ahorro de $29 USD / mes vs Topaz Labs",
  },
  {
    name: "Dyad Full-Stack App Builder",
    slug: "dyad/dyad",
    category: "AI",
    license: "Apache-2.0",
    stars: 8100,
    commit_velocity_score: 95.0,
    security_score: 94.0,
    docs_score: 95.0,
    description: "Constructor de aplicaciones full-stack y prototipado asistido por IA generativa. Alternativa a Lovable ($25/mes) con exportación libre de código React/Node.js.",
    content: "Dyad app builder constructor aplicaciones lovable full-stack react nodejs prototipado generacion codigo",
    docker_command: "docker run -d --name dyad-builder -p 3016:3000 -v dyad_workspaces:/workspaces dyad/dyad:latest",
    integration_difficulty: "Media",
    triggers: ["Full-Stack Scaffold Generation", "Database Schema Migration", "Live Preview Hot-Reload"],
    dependencies: ["Node.js 20+", "Docker Engine", "PostgreSQL / SQLite"],
    selfHostedSavingsB2B: "Ahorro de $25 USD / mes vs Lovable",
  },
  {
    name: "Treblo AI Music Generator",
    slug: "treblo/treblo",
    category: "AI",
    license: "MIT",
    stars: 5900,
    commit_velocity_score: 94.0,
    security_score: 94.0,
    docs_score: 94.0,
    description: "Generador de música, instrumentales y paisajes sonoros comerciales por IA. Alternativa open-source a Suno ($10/mes) con derechos de uso y pistas multicanal libres.",
    content: "Treblo generador musica suno audio pistas instrumentales audiocraft ia sonido comercial",
    docker_command: "docker run -d --name treblo-music -p 7862:7860 -v treblo_audio:/audio treblo/treblo:latest",
    integration_difficulty: "Media",
    triggers: ["Audio Stem Generation", "MusicGen Transformer Inference", "WAV/MP3 Export Pipeline"],
    dependencies: ["PyTorch / AudioCraft", "CUDA 12+ / Apple Silicon Metal", "Docker"],
    selfHostedSavingsB2B: "Ahorro de $10 USD / mes vs Suno",
  },
];

async function ingestTools() {
  console.log(`Starting ingestion of ${toolsToIngest.length} tools into Neon PostgreSQL...`);

  for (const repo of toolsToIngest) {
    const healthScore = Number(
      (repo.commit_velocity_score * 0.15 + repo.security_score * 0.20 + repo.docs_score * 0.65).toFixed(2)
    );
    const content = `${repo.name} ${repo.description} ${repo.content || ''} ${repo.triggers.join(' ')} ${repo.category}`;
    const textToIndex = `${repo.name} ${repo.description} ${content}`;
    const embedding = generateDeterministicEmbedding(textToIndex, 1536);
    const vectorStr = `[${embedding.join(',')}]`;
    const cleanSlug = repo.slug.replace(/[^a-zA-Z0-9_-]/g, '-');
    const etag = `W/"sync-${cleanSlug}-${Date.now()}"`;

    const query = `
      INSERT INTO oss_repositories (
        name, slug, category, license, stars, health_score,
        commit_velocity_score, security_score, docs_score,
        description, content, docker_command, integration_difficulty,
        triggers, dependencies, etag, embedding_halfvec, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17::halfvec(1536), now()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        license = EXCLUDED.license,
        stars = EXCLUDED.stars,
        health_score = EXCLUDED.health_score,
        commit_velocity_score = EXCLUDED.commit_velocity_score,
        security_score = EXCLUDED.security_score,
        docs_score = EXCLUDED.docs_score,
        description = EXCLUDED.description,
        content = EXCLUDED.content,
        docker_command = EXCLUDED.docker_command,
        integration_difficulty = EXCLUDED.integration_difficulty,
        triggers = EXCLUDED.triggers,
        dependencies = EXCLUDED.dependencies,
        etag = EXCLUDED.etag,
        embedding_halfvec = EXCLUDED.embedding_halfvec,
        updated_at = now()
      RETURNING id, name, slug, health_score;
    `;

    const values = [
      repo.name,
      repo.slug,
      repo.category,
      repo.license,
      repo.stars,
      healthScore,
      repo.commit_velocity_score,
      repo.security_score,
      repo.docs_score,
      repo.description,
      content,
      repo.docker_command,
      repo.integration_difficulty,
      repo.triggers,
      repo.dependencies,
      etag,
      vectorStr,
    ];

    try {
      const res = await pool.query(query, values);
      console.log(`✓ [INGESTED] ${res.rows[0].name} (${res.rows[0].slug}) -> Health Score: ${res.rows[0].health_score}%`);
    } catch (err) {
      console.error(`✗ [ERROR] Failed to ingest ${repo.slug}:`, err.message);
    }
  }

  const countRes = await pool.query('SELECT count(*)::int as total FROM oss_repositories');
  console.log(`\n🎉 Ingestion Complete! Total tools now in Neon DB: ${countRes.rows[0].total}`);
  await pool.end();
}

ingestTools().catch(err => {
  console.error('Fatal error during ingestion:', err);
  pool.end();
});
