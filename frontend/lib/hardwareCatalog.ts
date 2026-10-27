/**
 * OSS Atlas — Catálogo y Motor de Dimensionamiento de Hardware Físico (Capa 0 On-Premise)
 * Diseñado para consultoría de arquitectura B2B: recomienda las máquinas físicas
 * óptimas para auto-hospedar las 4 capas de software (DBS, AUTH, PAYMENTS, AI)
 * con enlaces de afiliados de Amazon Associates y métricas para Diagrama Radar.
 */

export interface HardwareSpecs {
  cpu: string;
  coresThreads: string;
  ram: string;
  storage: string;
  network: string;
  powerConsumptionWatts: string;
  formFactor: string;
  expansionSlots: string;
}

export interface HardwareRadarScore {
  compute: number;        // Cómputo CPU (0-100)
  ram: number;            // Memoria RAM y ECC (0-100)
  storageIOPS: number;    // Velocidad Almacenamiento NVMe IOPS (0-100)
  network: number;        // Ancho de banda de Red (0-100)
  costEfficiency: number; // Retorno de inversión y bajo consumo (0-100)
}

export interface HardwareTier {
  id: "homelab_minipc" | "sme_tower" | "enterprise_rack" | "ai_workstation";
  name: { es: string; en: string };
  categoryBadge: { es: string; en: string };
  tagline: { es: string; en: string };
  specs: HardwareSpecs;
  pros: { es: string[]; en: string[] };
  cons: { es: string[]; en: string[] };
  idealWorkload: { es: string; en: string };
  estimatedPriceUSD: number;
  monthlyCloudEquivalentUSD: number;
  breakEvenMonths: number;
  amazonSearchQuery: string;
  amazonAffiliateUrl: string;
  radarScores: HardwareRadarScore;
}

export const AMAZON_AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";

export function hasAffiliateTag(): boolean {
  return typeof AMAZON_AFFILIATE_TAG === "string" && AMAZON_AFFILIATE_TAG.trim().length > 0;
}

export function buildAmazonAffiliateUrl(searchQuery: string, tag: string = AMAZON_AFFILIATE_TAG): string {
  const encodedQuery = encodeURIComponent(searchQuery);
  const activeTag = tag || AMAZON_AFFILIATE_TAG;
  if (activeTag && activeTag.trim().length > 0) {
    return `https://www.amazon.com/s?k=${encodedQuery}&tag=${activeTag.trim()}`;
  }
  return `https://www.amazon.com/s?k=${encodedQuery}`;
}

export const HARDWARE_CATALOG: HardwareTier[] = [
  {
    id: "homelab_minipc",
    name: {
      es: "Mini PC / Homelab Edge (AMD Ryzen 9 / Intel i9)",
      en: "Mini PC / Homelab Edge (AMD Ryzen 9 / Intel i9)",
    },
    categoryBadge: {
      es: "Nivel 1: Edge & Prototipos",
      en: "Tier 1: Edge & Prototyping",
    },
    tagline: {
      es: "Ultra-compacto, silencioso y de bajo consumo (35W-65W) para MVPs, dev staging y pequeñas empresas.",
      en: "Ultra-compact, whisper-quiet and low-power (35W-65W) for MVPs, staging and small teams.",
    },
    specs: {
      cpu: "AMD Ryzen 9 7940HS / Intel Core i9-13900H",
      coresThreads: "8 Cores / 16 Threads (hasta 5.2 GHz)",
      ram: "64 GB DDR5 5600 MHz Dual-Channel",
      storage: "2 TB NVMe M.2 PCIe 4.0 (7,000 MB/s lectura)",
      network: "Dual 2.5 GbE LAN + Wi-Fi 6E / BT 5.3",
      powerConsumptionWatts: "35W - 65W TDP",
      formFactor: "Mini PC Ultra Pequeño (0.8L)",
      expansionSlots: "2x M.2 PCIe 4.0, 1x USB4 / Thunderbolt 4",
    },
    pros: {
      es: [
        "Inversión inicial mínima con retorno en menos de 4 meses",
        "Consumo eléctrico insignificante para operar 24/7 en oficina",
        "Doble puerto 2.5 GbE para aislar red de base de datos y tráfico web",
      ],
      en: [
        "Minimal initial capex with ROI in under 4 months",
        "Negligible power consumption for 24/7 continuous office run",
        "Dual 2.5 GbE ports to isolate database and public traffic",
      ],
    },
    cons: {
      es: [
        "No soporta memoria RAM con corrección de errores (ECC)",
        "Sin bahías hot-plug para discos mecánicos redundantes de gran volumen",
      ],
      en: [
        "Lacks ECC memory support for hardware bit-flip protection",
        "No hot-swap bays for large mechanical redundancy arrays",
      ],
    },
    idealWorkload: {
      es: "Microservicios Docker, Supabase, PocketBase, Authentik y CopilotKit para hasta 50 usuarios concurrentes.",
      en: "Docker microservices, Supabase, PocketBase, Authentik and CopilotKit for up to 50 concurrent users.",
    },
    estimatedPriceUSD: 780,
    monthlyCloudEquivalentUSD: 240,
    breakEvenMonths: 3.2,
    amazonSearchQuery: "Mini PC Ryzen 9 7940HS 64GB RAM 2TB NVMe",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Mini PC Ryzen 9 7940HS 64GB RAM 2TB NVMe"),
    radarScores: {
      compute: 72,
      ram: 70,
      storageIOPS: 82,
      network: 72,
      costEfficiency: 98,
    },
  },
  {
    id: "sme_tower",
    name: {
      es: "Servidor Torre PYME (ECC Server Tower)",
      en: "SME Server Tower (ECC Enterprise Grade)",
    },
    categoryBadge: {
      es: "Nivel 2: PYME & Oficina Local",
      en: "Tier 2: SME & Branch Office",
    },
    tagline: {
      es: "Fiabilidad corporativa con memoria ECC, controladora RAID y soporte para operación continua sin rack.",
      en: "Enterprise reliability with ECC memory, hardware RAID, and non-rack 24/7 continuous operation.",
    },
    specs: {
      cpu: "Intel Xeon E-2300 / AMD EPYC 4004 Series",
      coresThreads: "8 Cores / 16 Threads Server Grade",
      ram: "64 GB - 128 GB DDR5 ECC Unbuffered",
      storage: "2x 2 TB NVMe Enterprise + 2x 4 TB Enterprise SATA (RAID 1/10)",
      network: "2x 1 GbE + 1x 2.5 GbE + Puerto Dedicado IPMI/iDRAC",
      powerConsumptionWatts: "150W - 250W",
      formFactor: "Torre Servidor Silenciosa (4U Convertible)",
      expansionSlots: "4x PCIe 4.0, 4 bahías 3.5\" Hot-Swap",
    },
    pros: {
      es: [
        "Memoria ECC que erradica la corrupción silenciosa de transacciones financieras",
        "Bahías de discos intercambiables en caliente (Hot-Swap) y gestión remota iDRAC/IPMI",
        "Excelente relación entre resiliencia de datos y costo de adquisición",
      ],
      en: [
        "ECC memory prevents silent data corruption in financial transactions",
        "Hot-swap drive bays and dedicated iDRAC/IPMI remote management",
        "Superior balance between mission-critical resilience and capex",
      ],
    },
    cons: {
      es: [
        "Mayor tamaño físico que una Mini PC (requiere espacio ventilado)",
        "Consumo eléctrico moderado que aconseja incluir un UPS dedicado",
      ],
      en: [
        "Larger footprint than mini PCs (requires ventilated office spot)",
        "Moderate power consumption recommends a dedicated UPS battery",
      ],
    },
    idealWorkload: {
      es: "PostgreSQL transaccional, Keycloak Enterprise IAM, Kill Bill y Juspay con alta concurrencia de facturación.",
      en: "Mission-critical PostgreSQL, Keycloak IAM, Kill Bill, and Juspay for high-concurrency payment routing.",
    },
    estimatedPriceUSD: 1850,
    monthlyCloudEquivalentUSD: 520,
    breakEvenMonths: 3.5,
    amazonSearchQuery: "Dell PowerEdge Server Tower Xeon ECC 64GB RAM",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Dell PowerEdge Server Tower Xeon ECC 64GB RAM"),
    radarScores: {
      compute: 80,
      ram: 84,
      storageIOPS: 86,
      network: 78,
      costEfficiency: 90,
    },
  },
  {
    id: "enterprise_rack",
    name: {
      es: "Servidor Rackmount 1U/2U Enterprise (Data Center Dual Socket)",
      en: "Enterprise 1U/2U Rack Server (Data Center Dual Socket)",
    },
    categoryBadge: {
      es: "Nivel 3: Data Center & Alta Disponibilidad",
      en: "Tier 3: Data Center & High Availability",
    },
    tagline: {
      es: "Máximo rendimiento multi-hilo, fuentes redundantes y enlaces de fibra 10GbE para infraestructura crítica.",
      en: "Maximum multi-threaded throughput, redundant power supplies, and 10GbE fiber for critical workloads.",
    },
    specs: {
      cpu: "Dual AMD EPYC 9004 / Dual Intel Xeon Silver",
      coresThreads: "32 Cores / 64 Threads hasta 64C/128T",
      ram: "128 GB - 256 GB DDR5 ECC Registered (RDIMM)",
      storage: "4x 1.92 TB NVMe Enterprise U.2/U.3 Hot-Plug (Hardware RAID 10)",
      network: "Dual 10 GbE SFP+ Fibra Óptica + Dual 1 GbE Cobre + IPMI",
      powerConsumptionWatts: "450W - 750W (Fuentes Redundantes 1+1 Titanium)",
      formFactor: "Rackmount 1U / 2U para Rack estándar 19\"",
      expansionSlots: "Hasta 6x PCIe 5.0, 8-16 bahías U.2/U.3 NVMe",
    },
    pros: {
      es: [
        "Tolerancia total a fallos: fuentes redundantes y discos U.3 sin tiempo de inactividad",
        "Red óptica 10 GbE SFP+ para latencias sub-milisegundo en clústeres",
        "Soporta cientos de contenedores Docker y clústeres Kubernetes de alta densidad",
      ],
      en: [
        "Total fault tolerance: redundant PSUs and zero-downtime U.3 NVMe drives",
        "Dual 10 GbE SFP+ fiber for sub-millisecond inter-node cluster latency",
        "Powers hundreds of Docker containers and high-density Kubernetes clusters",
      ],
    },
    cons: {
      es: [
        "Requiere gabinete rack de 19\" con aire acondicionado o centro de colocation",
        "Nivel sonoro elevado de turbinas de ventilación industrial",
      ],
      en: [
        "Requires a 19\" server rack enclosure with active cooling or datacenter colo",
        "High acoustic noise from high-RPM industrial blower fans",
      ],
    },
    idealWorkload: {
      es: "Bases de datos masivas con pgvector a gran escala, microservicios Kubernetes multitenant y millones de transacciones/día.",
      en: "Massive pgvector database search at scale, multitenant Kubernetes clusters, and millions of daily transactions.",
    },
    estimatedPriceUSD: 4600,
    monthlyCloudEquivalentUSD: 1350,
    breakEvenMonths: 3.4,
    amazonSearchQuery: "Enterprise Rackmount Server Dual EPYC 128GB RAM 10GbE",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Enterprise Rackmount Server Dual EPYC 128GB RAM 10GbE"),
    radarScores: {
      compute: 96,
      ram: 98,
      storageIOPS: 98,
      network: 98,
      costEfficiency: 82,
    },
  },
  {
    id: "ai_workstation",
    name: {
      es: "AI Inference & Agentic Workstation (NVIDIA 24GB VRAM)",
      en: "AI Inference & Agentic Workstation (NVIDIA 24GB VRAM)",
    },
    categoryBadge: {
      es: "Nivel 4: IA Local & Modelos LLM",
      en: "Tier 4: Local AI & Self-Hosted LLMs",
    },
    tagline: {
      es: "Equipada con GPU Tensor dedicada para auto-hospedar LLMs (Llama 3, Mistral, Whisper) con privacidad 100%.",
      en: "Equipped with dedicated Tensor GPU to self-host LLMs (Llama 3, Mistral, Whisper) with 100% data privacy.",
    },
    specs: {
      cpu: "AMD Ryzen 9 9950X / Intel Core i9-14900K (16C/32T)",
      coresThreads: "16 Cores / 32 Threads (5.7 GHz Boost)",
      ram: "128 GB DDR5 6000 MHz de alta velocidad",
      storage: "4 TB NVMe PCIe 5.0/4.0 para pesos de modelos y datasets",
      network: "Dual 2.5 GbE + 10 GbE Aquantia LAN + Wi-Fi 7",
      powerConsumptionWatts: "550W - 850W (Fuente 1000W-1200W Platinum)",
      formFactor: "Torre E-ATX Profesional con refrigeración líquida 360mm",
      expansionSlots: "NVIDIA RTX 4090 24GB GDDR6X o RTX A5000 Ada (Tensor Cores)",
    },
    pros: {
      es: [
        "Inferencia de LLMs locales (vLLM / Ollama) a 80+ tokens/segundo sin costo por token",
        "Privacidad de datos 100% garantizada: ningún prompt ni dato sensible sale de la empresa",
        "Ahorra miles de dólares al año frente a instancias GPU dedicadas en AWS (g5/p4)",
      ],
      en: [
        "Local LLM inference (vLLM / Ollama) at 80+ tokens/sec with zero per-token API bills",
        "100% guaranteed data privacy: zero sensitive prompts or data leave premises",
        "Saves thousands annually compared to AWS GPU instances (g5/p4 instances)",
      ],
    },
    cons: {
      es: [
        "Mayor demanda de energía bajo carga máxima de entrenamiento o inferencia",
        "Costo de GPU representa una porción importante de la inversión inicial",
      ],
      en: [
        "Higher electricity draw under sustained training or heavy inference loads",
        "GPU represents a significant share of the upfront hardware budget",
      ],
    },
    idealWorkload: {
      es: "vLLM, VoiceStudio, OpenShorts, Upscayl, agentes CopilotKit y modelos de visión e inferencia sin latencia de red.",
      en: "vLLM, VoiceStudio, OpenShorts, Upscayl, CopilotKit agents, and local speech/vision pipelines with zero API lag.",
    },
    estimatedPriceUSD: 3650,
    monthlyCloudEquivalentUSD: 1150,
    breakEvenMonths: 3.1,
    amazonSearchQuery: "AI Workstation RTX 4090 24GB RAM 128GB 4TB NVMe",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("AI Workstation RTX 4090 24GB RAM 128GB 4TB NVMe"),
    radarScores: {
      compute: 98,
      ram: 90,
      storageIOPS: 94,
      network: 86,
      costEfficiency: 88,
    },
  },
];

export interface HardwareRecommendationResult {
  recommendedTier: HardwareTier;
  alternativeTier: HardwareTier;
  rationale: { es: string; en: string };
  isAiIntensive: boolean;
  totalMonthlyCloudCostUSD: number;
  estimatedAnnualSavingsUSD: number;
}

export function recommendHardwareForArchitecture(layers: {
  dbsTool?: string;
  authTool?: string;
  paymentsTool?: string;
  aiTool?: string;
}): HardwareRecommendationResult {
  const aiToolLower = (layers.aiTool || "").toLowerCase();
  const dbsToolLower = (layers.dbsTool || "").toLowerCase();
  const paymentsToolLower = (layers.paymentsTool || "").toLowerCase();
  const authToolLower = (layers.authTool || "").toLowerCase();

  // Detectar si requiere GPU local por herramientas de IA intensiva
  const isAiGpuIntensive =
    aiToolLower.includes("vllm") ||
    aiToolLower.includes("voice") ||
    aiToolLower.includes("video") ||
    aiToolLower.includes("short") ||
    aiToolLower.includes("upscayl") ||
    aiToolLower.includes("ollama");

  // Detectar si es carga financiera/transaccional pesada
  const isHighConcurrency =
    paymentsToolLower.includes("juspay") ||
    paymentsToolLower.includes("kill bill") ||
    authToolLower.includes("keycloak") ||
    dbsToolLower.includes("postgres") ||
    dbsToolLower.includes("supabase");

  if (isAiGpuIntensive) {
    const recommendedTier = HARDWARE_CATALOG.find((t) => t.id === "ai_workstation")!;
    const alternativeTier = HARDWARE_CATALOG.find((t) => t.id === "enterprise_rack")!;
    return {
      recommendedTier,
      alternativeTier,
      isAiIntensive: true,
      rationale: {
        es: `Tu arquitectura integra aceleración de inteligencia artificial (${layers.aiTool || "Modelos de IA"}). La Estación de Trabajo de IA con GPU NVIDIA dedicada (24GB VRAM) garantiza inferencia local a latencia ultra-baja (< 40ms) y privacidad estricta sin costos recurrentes por tokens ni límites de API de terceros.`,
        en: `Your architecture integrates artificial intelligence acceleration (${layers.aiTool || "AI Models"}). The AI Workstation with a dedicated NVIDIA GPU (24GB VRAM) guarantees ultra-low latency (< 40ms) local inference and strict data sovereignty without recurring per-token cloud bills or rate limits.`,
      },
      totalMonthlyCloudCostUSD: recommendedTier.monthlyCloudEquivalentUSD,
      estimatedAnnualSavingsUSD: recommendedTier.monthlyCloudEquivalentUSD * 12 - recommendedTier.estimatedPriceUSD,
    };
  }

  if (isHighConcurrency) {
    const recommendedTier = HARDWARE_CATALOG.find((t) => t.id === "sme_tower")!;
    const alternativeTier = HARDWARE_CATALOG.find((t) => t.id === "enterprise_rack")!;
    return {
      recommendedTier,
      alternativeTier,
      isAiIntensive: false,
      rationale: {
        es: `Para soportar la combinación de base de datos relacional y autenticación/pagos (${layers.dbsTool || "DBS"} + ${layers.authTool || "AUTH"} + ${layers.paymentsTool || "PAYMENTS"}), recomendamos el Servidor Torre PYME con memoria ECC contra corrupción de memoria y almacenamiento RAID 1/10 redundante, alcanzando punto de equilibrio frente a la nube en tan solo 3.5 meses.`,
        en: `To reliably host transactional database and authentication/payment gateways (${layers.dbsTool || "DBS"} + ${layers.authTool || "AUTH"} + ${layers.paymentsTool || "PAYMENTS"}), we recommend the SME Server Tower with ECC memory to prevent bit flips and redundant RAID 1/10 arrays, achieving cloud parity payback in just 3.5 months.`,
      },
      totalMonthlyCloudCostUSD: recommendedTier.monthlyCloudEquivalentUSD,
      estimatedAnnualSavingsUSD: recommendedTier.monthlyCloudEquivalentUSD * 12 - recommendedTier.estimatedPriceUSD,
    };
  }

  // Por defecto: Homelab Mini PC (alta eficiencia de costo para prototipos o pymes ligeras)
  const recommendedTier = HARDWARE_CATALOG.find((t) => t.id === "homelab_minipc")!;
  const alternativeTier = HARDWARE_CATALOG.find((t) => t.id === "sme_tower")!;
  return {
    recommendedTier,
    alternativeTier,
    isAiIntensive: false,
    rationale: {
      es: `Tu arquitectura es ágil y modular. La Mini PC Homelab Edge ofrece 64GB DDR5 y 2TB NVMe PCIe 4.0 con un consumo mínimo (35W-65W), ideal para auto-hospedar los contenedores de las 4 capas con un retorno de inversión en 3.2 meses respecto al alquiler de instancias cloud.`,
      en: `Your architecture is agile and lightweight. The Homelab Mini PC provides 64GB DDR5 and 2TB NVMe PCIe 4.0 with whisper-low power draw (35W-65W), ideal for self-hosting all 4 layers with ROI in just 3.2 months versus rented cloud instances.`,
    },
    totalMonthlyCloudCostUSD: recommendedTier.monthlyCloudEquivalentUSD,
    estimatedAnnualSavingsUSD: recommendedTier.monthlyCloudEquivalentUSD * 12 - recommendedTier.estimatedPriceUSD,
  };
}

/** Formateo de datos multidimensionales para el componente Recharts RadarChart */
export function getRadarComparisonData(lang: "es" | "en") {
  const dimensions = [
    { key: "compute", label: lang === "es" ? "Cómputo CPU" : "CPU Compute" },
    { key: "ram", label: lang === "es" ? "Memoria & ECC" : "RAM & ECC" },
    { key: "storageIOPS", label: lang === "es" ? "Almacenamiento NVMe" : "NVMe Storage" },
    { key: "network", label: lang === "es" ? "Red & Ancho de Banda" : "Network & Bandwidth" },
    { key: "costEfficiency", label: lang === "es" ? "Eficiencia ROI / Costo" : "Cost / ROI Efficiency" },
  ] as const;

  return dimensions.map((dim) => {
    const item: Record<string, string | number> = {
      dimension: dim.label,
      fullMark: 100,
    };
    for (const tier of HARDWARE_CATALOG) {
      item[tier.id] = tier.radarScores[dim.key];
    }
    return item;
  });
}
