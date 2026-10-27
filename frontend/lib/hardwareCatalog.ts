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

export const AMAZON_AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "iotdico-20";

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

export interface HardwareBrandModel {
  id: string;
  brand: "Minisforum" | "Beelink" | "Geekom" | "GMKtec" | "Bosgame" | "Bmax" | "Apple" | "NVIDIA" | "Microsoft";
  model: string;
  category: "minipc_x86" | "apple_silicon" | "nvidia_ai" | "mobile_workstation";
  categoryLabel: { es: string; en: string };
  badge: { es: string; en: string };
  highlights: { es: string[]; en: string[] };
  targetWorkload: { es: string; en: string };
  specsSummary: string;
  estimatedPriceUSD: string;
  amazonSearchQuery: string;
  amazonAffiliateUrl: string;
  recommendedForTierId: "homelab_minipc" | "sme_tower" | "enterprise_rack" | "ai_workstation";
}

export const HARDWARE_BRAND_MODELS: HardwareBrandModel[] = [
  // 1. Minisforum MS-01
  {
    id: "minisforum_ms01",
    brand: "Minisforum",
    model: "Minisforum MS-01 Workstation Mini",
    category: "minipc_x86",
    categoryLabel: { es: "Mini PC Homelab 10GbE", en: "10GbE Homelab Mini PC" },
    badge: { es: "★ Estándar B2B Homelab", en: "★ B2B Homelab Standard" },
    highlights: {
      es: [
        "Doble puerto 10G SFP+ (Fibra/DAC) + Doble 2.5 GbE RJ45",
        "Intel Core i9-13900H / i9-12900H (14 Cores / 20 Threads)",
        "3 ranuras M.2 NVMe PCIe 4.0 + 1 ranura PCIe x16 para GPU o RAID",
      ],
      en: [
        "Dual 10G SFP+ ports (Fiber/DAC) + Dual 2.5 GbE RJ45",
        "Intel Core i9-13900H / i9-12900H (14 Cores / 20 Threads)",
        "3x M.2 NVMe PCIe 4.0 slots + 1x PCIe x16 expansion slot",
      ],
    },
    targetWorkload: {
      es: "Clústeres Proxmox/Kubernetes, cortafuegos pfSense/OPNsense y microservicios con red 10GbE.",
      en: "Proxmox/Kubernetes clusters, pfSense/OPNsense firewalls, and microservices with 10GbE network.",
    },
    specsSummary: "Intel i9-13900H | Hasta 64GB DDR5 | 3x M.2 NVMe | 2x 10G SFP+ + 2x 2.5G LAN",
    estimatedPriceUSD: "$650 - $920",
    amazonSearchQuery: "Minisforum MS-01 Intel i9 64GB RAM 10GbE SFP+",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Minisforum MS-01 Intel i9 64GB RAM 10GbE SFP+"),
    recommendedForTierId: "homelab_minipc",
  },

  // 2. Minisforum UM790 Pro
  {
    id: "minisforum_um790",
    brand: "Minisforum",
    model: "Minisforum UM790 Pro",
    category: "minipc_x86",
    categoryLabel: { es: "Mini PC Zen 4 Alta Potencia", en: "High-Power Zen 4 Mini PC" },
    badge: { es: "AMD Ryzen 9 Flagship", en: "AMD Ryzen 9 Flagship" },
    highlights: {
      es: [
        "AMD Ryzen 9 7940HS (8C/16T, 5.2 GHz) con gráficos Radeon 780M RDNA3",
        "Soporte hasta 64 GB DDR5 5600 MHz y 2x M.2 PCIe 4.0",
        "Doble puerto USB4 40Gbps con soporte eGPU y LAN 2.5 GbE",
      ],
      en: [
        "AMD Ryzen 9 7940HS (8C/16T, 5.2 GHz) with Radeon 780M RDNA3",
        "Supports up to 64 GB DDR5 5600 MHz and 2x M.2 PCIe 4.0",
        "Dual USB4 40Gbps with eGPU support and 2.5 GbE LAN",
      ],
    },
    targetWorkload: {
      es: "Servidor ágil de base de datos Postgres con pgvector, Docker multi-contenedor y APIs FastAPI/Next.js.",
      en: "Agile Postgres server with pgvector, multi-container Docker, and FastAPI/Next.js APIs.",
    },
    specsSummary: "AMD Ryzen 9 7940HS | 64GB DDR5 | 2TB NVMe | 2x USB4 40G + 2.5GbE",
    estimatedPriceUSD: "$560 - $780",
    amazonSearchQuery: "Minisforum UM790 Pro Ryzen 9 7940HS 64GB RAM 2TB SSD",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Minisforum UM790 Pro Ryzen 9 7940HS 64GB RAM 2TB SSD"),
    recommendedForTierId: "homelab_minipc",
  },

  // 3. Beelink SER8
  {
    id: "beelink_ser8",
    brand: "Beelink",
    model: "Beelink SER8 (AMD Hawk Point)",
    category: "minipc_x86",
    categoryLabel: { es: "Mini PC Ultra Silenciosa", en: "Whisper-Quiet Mini PC" },
    badge: { es: "Top Ventas Homelab", en: "Top Seller Homelab" },
    highlights: {
      es: [
        "AMD Ryzen 7 8845HS con acelerador NPU de IA (38 TOPS plataforma)",
        "Refrigeración por cámara de vapor ultra-silenciosa (32 dB bajo carga)",
        "Chasis unibody de aleación metálica con protección anti-polvo",
      ],
      en: [
        "AMD Ryzen 7 8845HS with AI NPU accelerator (38 TOPS platform)",
        "Vapor chamber ultra-silent cooling (32 dB under sustained load)",
        "Metal alloy unibody enclosure with built-in dust filter",
      ],
    },
    targetWorkload: {
      es: "Operación 24/7 en oficinas y consultorías donde el ruido cero y la eficiencia de consumo (54W) son vitales.",
      en: "24/7 office run where zero acoustics and extreme energy efficiency (54W) are required.",
    },
    specsSummary: "AMD Ryzen 7 8845HS | 32GB/64GB DDR5 | 1TB/2TB NVMe | 2.5G LAN + Wi-Fi 6",
    estimatedPriceUSD: "$520 - $720",
    amazonSearchQuery: "Beelink SER8 AMD Ryzen 7 8845HS 32GB DDR5 1TB NVMe",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Beelink SER8 AMD Ryzen 7 8845HS 32GB DDR5 1TB NVMe"),
    recommendedForTierId: "homelab_minipc",
  },

  // 4. Beelink EQ12 / Mini S12
  {
    id: "beelink_eq12",
    brand: "Beelink",
    model: "Beelink EQ12 / S12 Pro (Intel N100)",
    category: "minipc_x86",
    categoryLabel: { es: "Micro-Servidor 15W TDP", en: "15W TDP Micro-Server" },
    badge: { es: "Máxima Eficiencia Eléctrica", en: "Maximum Power Efficiency" },
    highlights: {
      es: [
        "Procesador Intel N100 4 núcleos con consumo real de solo 6W a 15W",
        "Doble puerto de red 2.5 GbE Intel i225-V para separar redes",
        "Soporte de transcodificación de vídeo por hardware QuickSync AV1",
      ],
      en: [
        "Intel N100 4-core CPU with real-world power draw of just 6W to 15W",
        "Dual 2.5 GbE Intel i225-V ports for dedicated network segregation",
        "Intel QuickSync AV1 hardware video transcode engine",
      ],
    },
    targetWorkload: {
      es: "Reverse proxy Traefik/Nginx, Keycloak ligero, servidor DNS Pi-hole y monitorización Prometheus.",
      en: "Traefik/Nginx reverse proxy, lightweight Keycloak, DNS Pi-hole, and Prometheus monitoring.",
    },
    specsSummary: "Intel N100 4C | 16GB DDR5 | 500GB SSD | Dual 2.5GbE LAN (6W-15W)",
    estimatedPriceUSD: "$190 - $280",
    amazonSearchQuery: "Beelink EQ12 Intel N100 16GB RAM 500GB SSD Dual 2.5GbE",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Beelink EQ12 Intel N100 16GB RAM 500GB SSD Dual 2.5GbE"),
    recommendedForTierId: "homelab_minipc",
  },

  // 5. Geekom A8
  {
    id: "geekom_a8",
    brand: "Geekom",
    model: "Geekom A8 Flagship",
    category: "minipc_x86",
    categoryLabel: { es: "Mini PC Premium Ejecutiva", en: "Executive Premium Mini PC" },
    badge: { es: "Chasis Aluminio CNC", en: "CNC Aluminum Chasis" },
    highlights: {
      es: [
        "AMD Ryzen 9 8945HS (hasta 5.2 GHz) con NPU Ryzen AI integrada",
        "Acabado en aluminio espacial con disipador IceFlow 1.5",
        "Wi-Fi 7 + Bluetooth 5.4 + Red 2.5 GbE ultrarrápida",
      ],
      en: [
        "AMD Ryzen 9 8945HS (up to 5.2 GHz) with integrated Ryzen AI NPU",
        "Space-grade aluminum finish with IceFlow 1.5 cooling system",
        "Wi-Fi 7 + Bluetooth 5.4 + ultra-fast 2.5 GbE Ethernet",
      ],
    },
    targetWorkload: {
      es: "Estación de compilación continua, microservicios Node/Go y despliegue rápido de agentes CopilotKit.",
      en: "Continuous build station, Node/Go microservices, and rapid CopilotKit agent staging.",
    },
    specsSummary: "AMD Ryzen 9 8945HS | 32GB DDR5 | 2TB PCIe 4.0 | Wi-Fi 7 + 2.5G LAN",
    estimatedPriceUSD: "$680 - $890",
    amazonSearchQuery: "Geekom A8 AMD Ryzen 9 8945HS 32GB RAM 2TB SSD",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Geekom A8 AMD Ryzen 9 8945HS 32GB RAM 2TB SSD"),
    recommendedForTierId: "homelab_minipc",
  },

  // 6. GMKtec NucBox K8
  {
    id: "gmktec_k8",
    brand: "GMKtec",
    model: "GMKtec NucBox K8",
    category: "minipc_x86",
    categoryLabel: { es: "Mini PC Dual LAN 2.5G", en: "Dual 2.5G LAN Mini PC" },
    badge: { es: "Excelente Relación Valor/Precio", en: "High Value-for-Money" },
    highlights: {
      es: [
        "AMD Ryzen 7 8845HS con 8 núcleos y 16 hilos a 45W-65W TDP ajustable",
        "Doble puerto 2.5 GbE LAN para separar VLANs internas y públicas",
        "Soporte para 2x unidades M.2 PCIe 4.0 de hasta 8 TB en total",
      ],
      en: [
        "AMD Ryzen 7 8845HS 8-core/16-thread with 45W-65W adjustable TDP",
        "Dual 2.5 GbE LAN ports to segregate internal VLANs and public web",
        "Supports 2x M.2 PCIe 4.0 SSD slots for up to 8 TB total storage",
      ],
    },
    targetWorkload: {
      es: "Servidor de integración continua, Supabase auto-hospedado y gateways de pago con Juspay.",
      en: "CI/CD staging server, self-hosted Supabase, and payment gateways with Juspay.",
    },
    specsSummary: "AMD Ryzen 7 8845HS | 32GB/64GB DDR5 | 1TB NVMe | Dual 2.5G LAN",
    estimatedPriceUSD: "$480 - $690",
    amazonSearchQuery: "GMKtec K8 AMD Ryzen 7 8845HS 32GB RAM 1TB SSD Dual LAN",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("GMKtec K8 AMD Ryzen 7 8845HS 32GB RAM 1TB SSD Dual LAN"),
    recommendedForTierId: "homelab_minipc",
  },

  // 7. Bosgame & Bmax
  {
    id: "bosgame_b95",
    brand: "Bosgame",
    model: "Bosgame B95 / Bmax B8 Pro",
    category: "minipc_x86",
    categoryLabel: { es: "Mini PC Económica de Entrada", en: "Budget Entry Mini PC" },
    badge: { es: "Costo Ultra Bajo (<$350)", en: "Ultra Budget (<$350)" },
    highlights: {
      es: [
        "Intel Core i5 / i7 o Intel 12th Gen para arrancar con presupuesto mínimo",
        "32 GB RAM DDR4/DDR5 y 1 TB NVMe incluidos de fábrica",
        "Consumo eléctrico menor a 45W apto para despliegues perimetrales (Edge)",
      ],
      en: [
        "Intel Core i5 / i7 or 12th Gen to launch on a shoestring hardware budget",
        "32 GB DDR4/DDR5 RAM and 1 TB NVMe SSD factory pre-installed",
        "Under 45W power draw ideal for distributed edge IoT and branch gateways",
      ],
    },
    targetWorkload: {
      es: "Gateways perimetrales, entornos de prueba para desarrolladores juniors y PoCs de bajo riesgo.",
      en: "Branch edge gateways, staging testbeds for dev teams, and low-risk client PoCs.",
    },
    specsSummary: "Intel i5/i7 | 32GB RAM | 1TB NVMe | HDMI Dual + LAN 2.5G/1G",
    estimatedPriceUSD: "$240 - $380",
    amazonSearchQuery: "Bosgame Mini PC 32GB RAM 1TB SSD Intel Core i7",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Bosgame Mini PC 32GB RAM 1TB SSD Intel Core i7"),
    recommendedForTierId: "homelab_minipc",
  },

  // 8. Apple Mac mini M4
  {
    id: "apple_mac_mini_m4",
    brand: "Apple",
    model: "Apple Mac mini (Chip M4 / M4 Pro)",
    category: "apple_silicon",
    categoryLabel: { es: "Memoria Unificada de Alta Eficiencia", en: "Unified Memory High Efficiency" },
    badge: { es: "★ Revolucionario en Consumo/Potencia", en: "★ Breakthrough Perf/Watt" },
    highlights: {
      es: [
        "Chip Apple M4 / M4 Pro con hasta 64 GB de Memoria Unificada (hasta 273 GB/s)",
        "Consumo ridículo de solo 15W a 40W en operación continua 24/7",
        "Puertos Thunderbolt 5 (hasta 120 Gbps) y opción de red 10 GbE nativa",
      ],
      en: [
        "Apple M4 / M4 Pro chip with up to 64 GB Unified Memory (up to 273 GB/s)",
        "Whisper 15W to 40W real power draw during 24/7 non-stop operation",
        "Thunderbolt 5 ports (up to 120 Gbps) and native 10 GbE Ethernet option",
      ],
    },
    targetWorkload: {
      es: "Base de datos pgvector, búsqueda semántica y servidores de API con Docker/Colima y costo eléctrico mínimo.",
      en: "pgvector database, semantic search, and API microservices with Docker/Colima at minimal electric bill.",
    },
    specsSummary: "Apple M4 (10C CPU / 10C GPU) | 24GB-64GB Unificada | 512GB-2TB SSD | 10GbE Opción",
    estimatedPriceUSD: "$599 - $1,399",
    amazonSearchQuery: "Apple Mac mini M4 24GB RAM 512GB SSD",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Apple Mac mini M4 24GB RAM 512GB SSD"),
    recommendedForTierId: "homelab_minipc",
  },

  // 9. Apple Mac Studio (M2/M4 Max / Ultra)
  {
    id: "apple_mac_studio",
    brand: "Apple",
    model: "Apple Mac Studio (M2 / M4 Max o Ultra)",
    category: "apple_silicon",
    categoryLabel: { es: "Inferencia LLM por Memoria Unificada", en: "Unified Memory LLM Inference" },
    badge: { es: "★ Mejor Alternativa a GPUs de $10K", en: "★ Best Alternative to $10K GPUs" },
    highlights: {
      es: [
        "64 GB, 96 GB o hasta 192 GB de Memoria Unificada compartida CPU/GPU",
        "Ancho de banda colosal de 400 GB/s a 800 GB/s para cargar LLMs enteros en RAM",
        "Ejecuta Llama 3 70B, Qwen y DeepSeek localmente sin cuelgues ni falta de VRAM",
      ],
      en: [
        "64 GB, 96 GB or up to 192 GB Unified Memory shared between CPU and GPU",
        "Colossal 400 GB/s to 800 GB/s bandwidth to load whole LLMs into RAM",
        "Runs Llama 3 70B, Qwen, and DeepSeek locally without out-of-VRAM panics",
      ],
    },
    targetWorkload: {
      es: "Inferencia local de modelos de lenguaje grandes (Ollama / llama.cpp / vLLM-metal) con privacidad 100% estricta.",
      en: "Local inference of large language models (Ollama / llama.cpp / vLLM-metal) with 100% strict data privacy.",
    },
    specsSummary: "Apple M2/M4 Max/Ultra | 64GB-192GB Unificada (400-800 GB/s) | 10GbE LAN + 6x Thunderbolt",
    estimatedPriceUSD: "$1,999 - $3,999",
    amazonSearchQuery: "Apple Mac Studio M2 Max 64GB Unified Memory 1TB SSD",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Apple Mac Studio M2 Max 64GB Unified Memory 1TB SSD"),
    recommendedForTierId: "ai_workstation",
  },

  // 10. NVIDIA Jetson AGX Orin / GX Spark Workstation
  {
    id: "nvidia_orin_workstation",
    brand: "NVIDIA",
    model: "NVIDIA Jetson AGX Orin & RTX AI Station",
    category: "nvidia_ai",
    categoryLabel: { es: "Cómputo Tensor & CUDA Nativo", en: "Native CUDA & Tensor Compute" },
    badge: { es: "Hasta 275 TOPS IA", en: "Up to 275 AI TOPS" },
    highlights: {
      es: [
        "Arquitectura NVIDIA Ampere/Ada Lovelace con Tensor Cores de 4ª generación",
        "Compatibilidad total con TensorRT, vLLM, DeepStream y CUDA sin emulación",
        "Aceleración nativa para embeddings vectoriales y procesamiento de visión/audio",
      ],
      en: [
        "NVIDIA Ampere/Ada Lovelace architecture with 4th Gen Tensor Cores",
        "Full native compatibility with TensorRT, vLLM, DeepStream, and CUDA",
        "Native hardware acceleration for vector embeddings, vision, and audio",
      ],
    },
    targetWorkload: {
      es: "Agentes autónomos de voz/visión en tiempo real, pipelines RAG con alta tasa de concurrencia y vLLM.",
      en: "Autonomous real-time voice/vision agents, high-concurrency RAG embedding pipelines, and vLLM.",
    },
    specsSummary: "NVIDIA 2048-core GPU | 64GB LPDDR5 | 275 TOPS | Red 10 GbE Industrial",
    estimatedPriceUSD: "$1,799 - $3,850",
    amazonSearchQuery: "NVIDIA Jetson AGX Orin Developer Kit 64GB",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("NVIDIA Jetson AGX Orin Developer Kit 64GB"),
    recommendedForTierId: "ai_workstation",
  },

  // 11. Microsoft Surface Laptop Studio / Copilot+ PC
  {
    id: "microsoft_surface_copilot",
    brand: "Microsoft",
    model: "Microsoft Surface Studio & Copilot+ PC",
    category: "mobile_workstation",
    categoryLabel: { es: "Estación Móvil & Auditoría B2B", en: "Mobile Workstation & B2B Audit" },
    badge: { es: "Auditoría en Terreno / NPU 45 TOPS", en: "On-Site Audit / 45 TOPS NPU" },
    highlights: {
      es: [
        "Pantalla PixelSense Flow táctil convertible para demos ejecutivas ante clientes",
        "NPU dedicada (45+ TOPS) o GPU NVIDIA RTX para ejecutar validaciones en local",
        "Chasis ultra-resistente y batería de larga duración para consultoría en campo",
      ],
      en: [
        "PixelSense Flow convertible touchscreen for executive client demos",
        "Dedicated NPU (45+ TOPS) or NVIDIA RTX GPU to run local validations",
        "Durable chassis with all-day battery life for field architecture consulting",
      ],
    },
    targetWorkload: {
      es: "Consultor de arquitectura B2B: demostración de PoCs en cliente, auditoría de seguridad y diagnósticos en vivo.",
      en: "B2B architecture consultant: client PoC demos, security audit, and live on-site diagnostics.",
    },
    specsSummary: "Intel Core i7 / Snapdragon X Elite | 32GB-64GB RAM | 1TB SSD | NPU IA + RTX",
    estimatedPriceUSD: "$1,499 - $2,699",
    amazonSearchQuery: "Microsoft Surface Laptop Studio 2 32GB RAM NVIDIA RTX",
    amazonAffiliateUrl: buildAmazonAffiliateUrl("Microsoft Surface Laptop Studio 2 32GB RAM NVIDIA RTX"),
    recommendedForTierId: "homelab_minipc",
  },
];

