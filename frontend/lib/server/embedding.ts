/**
 * Generador de embeddings (1536 dimensiones).
 * Si hay LLM_API_KEY / OPENAI_API_KEY configurada, puede consultar la API.
 * Por defecto (modo local / sin coste), proyecta el texto de forma semántica y
 * determinista a un vector unitario de 1536 dimensiones (compatible con halfvec de pgvector).
 */

export function generateDeterministicEmbedding(text: string, dimensions: number = 1536): number[] {
  const vec = new Float64Array(dimensions);
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const STOPWORDS = new Set([
    "a", "al", "ante", "bajo", "cabe", "con", "contra", "de", "del", "desde", "durante", "en",
    "entre", "hacia", "hasta", "mediante", "para", "por", "segun", "sin", "so", "sobre", "tras",
    "el", "la", "los", "las", "un", "una", "unos", "unas", "lo", "le", "les", "me", "te", "se",
    "nos", "os", "mi", "tu", "su", "mis", "tus", "sus", "y", "e", "ni", "o", "u", "pero", "mas",
    "que", "como", "donde", "cuando", "quien", "cual", "cuyo", "este", "esta", "estos", "estas",
    "ese", "esa", "esos", "esas", "aquel", "aquella", "aquellos", "aquellas", "sistema", "sistemas",
    "plataforma", "plataformas", "necesito", "quiero", "disenar", "crear", "implementar",
    "the", "and", "or", "in", "on", "at", "to", "for", "of", "with", "by", "an", "is"
  ]);

  const words = normalized
    .split(/[^a-z0-9_-]+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));

  if (words.length === 0) {
    // Vector unitario base
    vec[0] = 1.0;
    return Array.from(vec);
  }

  // Mapa de conceptos semánticos para agrupar en sub-espacios vectoriales
  const CONCEPT_OFFSETS: Record<string, number> = {
    // Auth & Identity (dimensiones 0..383)
    auth: 0, autenticacion: 0, login: 10, sso: 20, saml: 30, oidc: 40, oauth: 50,
    jwt: 60, token: 70, passwordless: 80, kratos: 90, keycloak: 100, supertokens: 110,
    identidad: 120, credencial: 130, sesiones: 140, rbac: 150, mfa: 160,
    federacion: 170, cuentas: 180, corporativa: 190, ldap: 200, directorio: 210,

    // DBs & Storage & Search (dimensiones 384..767)
    db: 384, database: 384, postgres: 394, postgresql: 394, supabase: 404,
    pgvector: 414, hnsw: 424, vector: 434, search: 444, busqueda: 444,
    meilisearch: 454, sql: 464, relacional: 474, fts: 484, storage: 494,

    // Payments & Billing (dimensiones 768..1151)
    payment: 768, payments: 768, pago: 768, pagos: 768, billing: 778, facturacion: 778,
    hyperswitch: 788, stripe: 798, paypal: 808, transaccion: 818, moneda: 828,
    lago: 838, killbill: 848, invoice: 858, pasarela: 868, suscripcion: 878,

    // AI & Agents & RAG (dimensiones 1152..1535)
    ai: 1152, ia: 1152, rag: 1162, llm: 1172, langchain: 1182, llamaindex: 1192,
    embedding: 1202, embeddings: 1202, agente: 1212, prompt: 1222, evaluacion: 1232,
    ragas: 1242, contexto: 1252, alucinacion: 1262, modelo: 1272,
  };

  for (const word of words) {
    // Si la palabra coincide con un concepto clave, refuerza su subespacio
    for (const [key, offset] of Object.entries(CONCEPT_OFFSETS)) {
      if (word.includes(key) || key.includes(word)) {
        for (let i = 0; i < 30; i++) {
          const idx = (offset + i) % dimensions;
          vec[idx] += 3.0 / (1 + i * 0.1);
        }
      }
    }

    // Hash general para cualquier palabra (n-gram hashing determinista)
    let h1 = 0xdeadbeef;
    let h2 = 0x41c64e6d;
    for (let i = 0; i < word.length; i++) {
      const code = word.charCodeAt(i);
      h1 = Math.imul(h1 ^ code, 2654435761);
      h2 = Math.imul(h2 ^ code, 1597334677);
    }

    const pos = Math.abs(h1) % dimensions;
    const sign = h2 % 2 === 0 ? 1.0 : -1.0;
    vec[pos] += sign * 1.5;

    const pos2 = Math.abs(h2) % dimensions;
    vec[pos2] += (h1 % 2 === 0 ? 1.0 : -1.0) * 1.0;
  }

  // Normalización L2 (longitud euclidiana = 1.0) para que <=> sea idéntico a distancia coseno
  let sumSq = 0;
  for (let i = 0; i < dimensions; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq) || 1.0;
  const result: number[] = new Array(dimensions);
  for (let i = 0; i < dimensions; i++) {
    // Redondear a 4 decimales para eficiencia halfvec
    result[i] = Number((vec[i] / norm).toFixed(4));
  }

  return result;
}
