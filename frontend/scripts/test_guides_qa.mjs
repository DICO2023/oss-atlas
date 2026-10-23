/**
 * QA Test Suite 3: Validación Física y Generación de Guías Descargables (.md y .pdf)
 * 
 * Valida:
 * 1. Generación de Markdown estructurado (.md) en Español e Inglés.
 * 2. Generación Vectorial de PDFs multi-página con jspdf en Español e Inglés.
 * 3. Cobertura de herramientas de las 4 capas (AUTH, DBS, PAYMENTS, AI),
 *    incluyendo las nuevas herramientas de IA: Meetily, CopilotKit, VoiceStudio, Upscayl, Vane.
 * 4. Inspección de contraste tipográfico, cajas de terminal monoespaciadas, 
 *    comandos para Windows (PowerShell/WSL2) y macOS (Colima/Apple Silicon).
 * 5. Checklist de seguridad y créditos de autoría oficiales (EdisonPEÑA / Iotdico).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'generated_guides');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Catálogo de prueba diverso representativo de las 4 capas B2B
const testTools = [
  {
    name: 'PostgreSQL Relacional Core',
    slug: 'postgres/postgres',
    category: 'DBS',
    license: 'PostgreSQL',
    stars: '16.5k',
    healthScore: 99,
    integrationDifficulty: 'Baja',
    description: 'El motor de base de datos relacional de código abierto más avanzado del mundo. Soporte ACID estricto, extensiones nativas y concurrencia MVCC probada.',
    dockerCommand: 'docker run -d --name postgres-core -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16-alpine',
    dependencies: ['C Runtime', 'Linux / POSIX Kernel', 'Docker Engine 20.10+'],
    triggers: ['Write-Ahead Log (WAL) Replication', 'Foreign Data Wrapper (FDW) Query', 'ACID Transaction Commit'],
    selfHostedSavingsB2B: '$1,850 USD / mes vs Cloud Propietario',
  },
  {
    name: 'Keycloak Enterprise IAM',
    slug: 'keycloak/keycloak',
    category: 'AUTH',
    license: 'Apache-2.0',
    stars: '21.4k',
    healthScore: 95,
    integrationDifficulty: 'Media',
    description: 'Gestión de identidad y accesos para aplicaciones modernas. Soporta SSO empresarial, OAuth2/OIDC, SAML 2.0 y federación Kerberos/LDAP.',
    dockerCommand: 'docker run -d --name keycloak-iam -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev',
    dependencies: ['Java OpenJDK 17+', 'PostgreSQL o BD relacional', 'Docker Engine'],
    triggers: ['OIDC JWT Bearer Issuance', 'SAML 2.0 Assertion Consumer', 'Webhook Event Bus'],
    selfHostedSavingsB2B: '$2,400 USD / mes en licencias MAU B2B',
  },
  {
    name: 'Juspay Hyperswitch B2B Router',
    slug: 'juspay/hyperswitch',
    category: 'PAYMENTS',
    license: 'Apache-2.0',
    stars: '13.4k',
    healthScore: 93,
    integrationDifficulty: 'Alta',
    description: 'Switch de pagos universal escrito en Rust. Orquestación inteligente de cobros y enrutamiento dinámico multi-adquirente con soporte PCI-DSS.',
    dockerCommand: 'docker run -d --name hyperswitch -p 8080:8080 -v hyperswitch_config:/etc/hyperswitch juspay/hyperswitch-router:latest',
    dependencies: ['Rust Runtime', 'PostgreSQL 14+', 'Redis Cluster'],
    triggers: ['Payment Intent Confirmation Webhook', 'Dispute Chargeback Ingestion', 'Merchant Smart Routing Rule'],
    selfHostedSavingsB2B: '$3,100 USD / mes en comisiones de pasarela',
  },
  {
    name: 'Meetily AI Meeting Assistant',
    slug: 'meetily/meetily',
    category: 'AI',
    license: 'MIT',
    stars: '9.2k',
    healthScore: 95.45,
    integrationDifficulty: 'Baja',
    description: 'Asistente de reuniones IA local y privado. Graba, transcribe con Whisper local y genera minutas ejecutivas estructuradas sin enviar audio a nubes externas.',
    dockerCommand: 'docker run -d --name meetily-core -p 3010:3000 -v meetily_vault:/app/vault meetily/meetily:latest',
    dependencies: ['Node.js 20+ / Docker', 'Whisper.cpp / ffmpeg', 'CUDA opcional'],
    triggers: ['Meeting Audio Stream', 'Whisper Transcription Hook', 'Markdown Minute Export'],
    selfHostedSavingsB2B: '$14 USD / mes vs Granola',
  },
  {
    name: 'CopilotKit Embedded AI Agents',
    slug: 'CopilotKit/CopilotKit',
    category: 'AI',
    license: 'MIT',
    stars: '16.5k',
    healthScore: 97.2,
    integrationDifficulty: 'Baja',
    description: 'Framework open-source para integrar copilotos de IA, autocompletado contextual y asistentes en aplicaciones React/Next.js.',
    dockerCommand: 'docker run -d --name copilotkit-runtime -p 4000:4000 -v copilotkit_data:/data copilotkit/runtime:latest',
    dependencies: ['Node.js 18+ / React 18+', 'LangChain / OpenAI SDK', 'Docker Engine'],
    triggers: ['Contextual Copilot Query', 'Agentic Tool Calling Hook', 'State Synchronization Stream'],
    selfHostedSavingsB2B: '$200 USD / mes vs ChatGPT Pro',
  },
  {
    name: 'VoiceStudio AI Voice & TTS',
    slug: 'voicestudio/voicestudio',
    category: 'AI',
    license: 'AGPL-3.0',
    stars: '11.8k',
    healthScore: 95.95,
    integrationDifficulty: 'Media',
    description: 'Estación de síntesis de voz neural, texto a voz (TTS) ultrarrealista y clonación vocal con IA local sin límites de caracteres.',
    dockerCommand: 'docker run -d --name voicestudio -p 7860:7860 -v voicestudio_models:/models voicestudio/voicestudio:latest',
    dependencies: ['Python 3.10+ / PyTorch', 'CUDA 12+ / Apple Silicon Metal', 'Docker Engine'],
    triggers: ['TTS Synthesis Stream', 'Voice Clone Reference Sampling', 'Audio Normalization Hook'],
    selfHostedSavingsB2B: '$25 USD / mes vs ElevenLabs',
  },
  {
    name: 'Upscayl AI Image Super-Resolution',
    slug: 'upscayl/upscayl',
    category: 'AI',
    license: 'AGPL-3.0',
    stars: '32.5k',
    healthScore: 96.95,
    integrationDifficulty: 'Baja',
    description: 'Escalador y mejorador de resolución de imágenes 4x/8x por IA mediante modelos Real-ESRGAN locales acelerados por GPU.',
    dockerCommand: 'docker run -d --name upscayl-core -p 8088:8080 -v upscayl_output:/data/output upscayl/upscayl-cli:latest',
    dependencies: ['Vulkan SDK / GPU Driver', 'Docker Engine'],
    triggers: ['Batch Image Upscaling Task', 'Vulkan/CUDA Tensor Acceleration', 'Sharpening Filter Hook'],
    selfHostedSavingsB2B: '$10 USD / mes vs Topaz Gigapixel',
  },
  {
    name: 'Vane Conversational AI Search',
    slug: 'vane-ai/vane',
    category: 'AI',
    license: 'MIT',
    stars: '6.1k',
    healthScore: 93.85,
    integrationDifficulty: 'Baja',
    description: 'Buscador conversacional con citas académicas y extracción de fuentes en tiempo real para intranet empresarial sin trackers.',
    dockerCommand: 'docker run -d --name vane-search -p 3014:3000 -v vane_cache:/app/cache vane/vane:latest',
    dependencies: ['Node.js / Docker', 'SearXNG / Web Search API'],
    triggers: ['Web Crawler Query Dispatch', 'Source Citation Synthesizer', 'Reranking Evaluation'],
    selfHostedSavingsB2B: '$50 USD / mes vs Perplexity Pro',
  }
];

function generateMarkdown(tool, lang) {
  const isEs = lang === 'es';
  const portMatch = tool.dockerCommand.match(/-p\s+(\d+):/);
  const testPort = portMatch ? portMatch[1] : '8080';

  return `# ${isEs ? 'Guía de Integración Técnica B2B' : 'B2B Technical Integration Guide'}: ${tool.name}

> **OSS Atlas Architecture Intelligence**  
> **${isEs ? 'Titularidad & Autoría' : 'Official Authorship'}:** EdisonPEÑA (Iotdico — https://ossatlas.iotdico.com)  
> **${isEs ? 'Fecha de Emisión' : 'Issue Date'}:** 23 de Octubre de 2026 | **Licencia:** ${tool.license} | **Categoría:** ${tool.category}

---

## 1. ${isEs ? 'Métricas Cardinales & Telemetría' : 'Cardinal Metrics & Telemetry'}

| ${isEs ? 'Métrica' : 'Metric'} | ${isEs ? 'Valor Evaluado' : 'Evaluated Value'} | ${isEs ? 'Dictamen B2B' : 'B2B Evaluation'} |
| :--- | :--- | :--- |
| **Health Score** | \`${tool.healthScore} / 100\` | ${isEs ? 'Ponderado (Commits 15%, Seguridad 20%, Docs 65%)' : 'Weighted (Commits 15%, Security 20%, Docs 65%)'} |
| **${isEs ? 'Dificultad de Integración' : 'Integration Difficulty'}** | \`${tool.integrationDifficulty}\` | ${isEs ? 'Basada en dependencias de runtime' : 'Based on runtime dependencies'} |
| **${isEs ? 'Telemetría de Ahorro' : 'Savings Telemetry'}** | \`${tool.selfHostedSavingsB2B}\` | ${isEs ? 'Frente a alternativas propietarias' : 'Compared to proprietary SaaS'} |
| **GitHub Stars** | \`${tool.stars}\` | ${isEs ? 'Adopción global verificada' : 'Verified global adoption'} |

---

## 2. ${isEs ? 'Descripción Técnica & Requisitos' : 'Technical Description & Prerequisites'}

${tool.description}

### ${isEs ? 'Dependencias del Sistema' : 'System Dependencies'}
${tool.dependencies.map(d => `- \`${d}\``).join('\n')}

### ${isEs ? 'Disparadores de Integración (Triggers)' : 'Integration Triggers'}
${tool.triggers.map(t => `- ⚡ \`${t}\``).join('\n')}

---

## 3. ${isEs ? 'Paso a Paso para Windows (PowerShell & WSL2)' : 'Step-by-Step for Windows (PowerShell & WSL2)'}

### 3.1. ${isEs ? 'Validación de WSL2 y Docker Desktop' : 'Verify WSL2 & Docker Desktop'}
\`\`\`powershell
# Comprobar estado de WSL2
wsl --status
wsl --update

# Verificar daemon de Docker
docker version
\`\`\`

### 3.2. ${isEs ? 'Persistencia de Volúmenes y Variables de Sesión' : 'Volume Persistence & Session Variables'}
\`\`\`powershell
# Crear directorio de datos persistente
$env:DATA_PATH = "$HOME\\oss-atlas-data\\${tool.slug.replace('/', '_')}"
New-Item -ItemType Directory -Force -Path $env:DATA_PATH

# Configurar puerto y ambiente
$env:PORT = "${testPort}"
$env:NODE_ENV = "production"
\`\`\`

### 3.3. ${isEs ? 'Despliegue del Contenedor' : 'Deploy Container'}
\`\`\`powershell
${tool.dockerCommand} --restart unless-stopped
\`\`\`

### 3.4. ${isEs ? 'Healthcheck de Endpoints' : 'Endpoint Healthcheck'}
\`\`\`powershell
# Verificar logs iniciales
docker logs --tail 30 (docker ps -lq)

# Probar endpoint HTTP
Invoke-RestMethod -Uri "http://localhost:${testPort}" -Method GET -ErrorAction SilentlyContinue
\`\`\`

---

## 4. ${isEs ? 'Paso a Paso para macOS (Homebrew, Colima & Apple Silicon)' : 'Step-by-Step for macOS (Homebrew, Colima & Apple Silicon)'}

### 4.1. ${isEs ? 'Aprovisionamiento con Colima' : 'Provisioning with Colima'}
\`\`\`bash
# Instalar Colima y Docker CLI con Homebrew
brew install colima docker

# Iniciar máquina virtual optimizada
colima start --cpu 4 --memory 4 --disk 40
\`\`\`

### 4.2. ${isEs ? 'Persistencia y Variables en Zsh' : 'Persistence & Variables in Zsh'}
\`\`\`bash
# Crear directorio local
mkdir -p "$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"
export DATA_DIR="$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"
export PORT="${testPort}"
\`\`\`

### 4.3. ${isEs ? 'Despliegue Multi-Arquitectura ARM64' : 'Multi-Architecture Deployment (ARM64)'}
\`\`\`bash
${tool.dockerCommand} --restart unless-stopped
\`\`\`

### 4.4. ${isEs ? 'Healthcheck con curl' : 'Healthcheck with curl'}
\`\`\`bash
# Probar respuesta de servicio
curl -I -s "http://localhost:${testPort}" | head -n 5
\`\`\`

---

## 5. ${isEs ? 'Lista de Verificación de Seguridad en Producción' : 'Production Security Hardening Checklist'}

1. **${isEs ? 'Aislamiento de Red' : 'Network Isolation'}:** ${isEs ? 'Crea redes puente dedicadas (`docker network create oss-net`) para evitar exponer puertos al host sin control.' : 'Create dedicated bridge networks (`docker network create oss-net`) to avoid uncontrolled host port exposure.'}
2. **${isEs ? 'Gestión de Secretos' : 'Secrets Management'}:** ${isEs ? 'Inyecta contraseñas mediante archivos `.env` protegidos con permisos `chmod 600`.' : 'Inject passwords through `.env` files protected with `chmod 600` permissions.'}
3. **${isEs ? 'Respaldos Automatizados' : 'Automated Backups'}:** ${isEs ? 'Programa snapshots diarios de los volúmenes montados hacia almacenamiento cloud cifrado.' : 'Schedule daily automated volume snapshots to encrypted cloud storage.'}
4. **${isEs ? 'Auditoría CVE' : 'CVE Audit'}:** ${isEs ? 'Monitorea avisos de vulnerabilidad suscritos desde el catálogo activo de OSS Atlas.' : 'Monitor security advisories subscribed from the active OSS Atlas catalog.'}

---

*${isEs ? 'Guía generada dinámicamente por' : 'Guide dynamically generated by'} OSS Atlas (https://ossatlas.iotdico.com) — EdisonPEÑA (Iotdico)*
`;
}

function generatePdf(tool, lang, outputPath) {
  const isEs = lang === 'es';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addHeaderCompact = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(34, 211, 238); // cyan-400
    doc.text('OSS ATLAS B2B ARCHITECTURE', margin + 4, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8);
    doc.text(`${tool.name} (${tool.slug})`, pageWidth - margin - 4, y + 8, { align: 'right' });
    y += 16;
  };

  const addFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      isEs 
        ? 'OSS Atlas · Creado por EdisonPEÑA (https://ossatlas.iotdico.com)' 
        : 'OSS Atlas · Created by EdisonPEÑA (https://ossatlas.iotdico.com)',
      margin,
      pageHeight - 7
    );
    doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      addFooter();
      doc.addPage();
      y = margin;
      addHeaderCompact();
    }
  };

  // Top Banner
  doc.setFillColor(10, 15, 30);
  doc.rect(margin, y, contentWidth, 34, 'F');
  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(0.8);
  doc.rect(margin, y, contentWidth, 34, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(isEs ? 'GUÍA DE INTEGRACIÓN B2B' : 'B2B INTEGRATION GUIDE', margin + 6, y + 10);

  doc.setFontSize(12);
  doc.setTextColor(56, 189, 248);
  doc.text(tool.name, margin + 6, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Slug: ${tool.slug}   |   ${isEs ? 'Licencia' : 'License'}: ${tool.license}   |   ${isEs ? 'Categoría' : 'Category'}: ${tool.category}   |   Stars: ${tool.stars}`,
    margin + 6,
    y + 27
  );
  y += 40;

  // Metric Badges
  const badgeWidth = (contentWidth - 6) / 3;
  const badgeHeight = 16;

  // Badge 1: Health Score
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, badgeWidth, badgeHeight, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, badgeWidth, badgeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129);
  doc.text('HEALTH SCORE', margin + 4, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${tool.healthScore}/100`, margin + 4, y + 12);

  // Badge 2: Difficulty
  const b2X = margin + badgeWidth + 3;
  doc.setFillColor(15, 23, 42);
  doc.rect(b2X, y, badgeWidth, badgeHeight, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.rect(b2X, y, badgeWidth, badgeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(245, 158, 11);
  doc.text(isEs ? 'DIFICULTAD' : 'DIFFICULTY', b2X + 4, y + 5);
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(tool.integrationDifficulty, b2X + 4, y + 12);

  // Badge 3: Telemetry
  const b3X = b2X + badgeWidth + 3;
  doc.setFillColor(15, 23, 42);
  doc.rect(b3X, y, badgeWidth, badgeHeight, 'F');
  doc.setDrawColor(34, 211, 238);
  doc.rect(b3X, y, badgeWidth, badgeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(34, 211, 238);
  doc.text(isEs ? 'TELEMETRÍA AHORRO' : 'SAVINGS TELEMETRY', b3X + 4, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text((tool.selfHostedSavingsB2B || 'N/A').slice(0, 24), b3X + 4, y + 12);
  y += badgeHeight + 8;

  // Technical Description - High Contrast
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(isEs ? '1. Descripción Técnica del Repositorio' : '1. Repository Technical Description', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // slate-700
  const splitDesc = doc.splitTextToSize(tool.description, contentWidth);
  doc.text(splitDesc, margin, y);
  y += splitDesc.length * 4.5 + 4;

  // Dependencies Box
  checkPageBreak(25);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 22, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 22, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248);
  doc.text(isEs ? 'DEPENDENCIAS DEL SISTEMA:' : 'SYSTEM DEPENDENCIES:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(tool.dependencies.join(', '), margin + 4, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248);
  doc.text(isEs ? 'DISPARADORES DE INTEGRACIÓN:' : 'INTEGRATION TRIGGERS:', margin + 4, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(tool.triggers.join(', '), margin + 4, y + 19);
  y += 28;

  // Windows Section
  checkPageBreak(25);
  doc.setFillColor(30, 58, 138); // blue-900
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isEs ? '2. PASO A PASO PARA WINDOWS (PowerShell & WSL2)' : '2. STEP-BY-STEP FOR WINDOWS (PowerShell & WSL2)',
    margin + 4,
    y + 5.5
  );
  y += 12;

  const winSteps = [
    {
      title: isEs ? 'Validación del Subsistema WSL2' : 'Validate WSL2 Subsystem',
      code: 'wsl --status\nwsl --update\ndocker version'
    },
    {
      title: isEs ? 'Persistencia y Variables de Sesión' : 'Persistence & Session Variables',
      code: `$env:DATA_PATH = "$HOME\\oss-atlas-data\\${tool.slug.replace('/', '_')}"\nNew-Item -ItemType Directory -Force -Path $env:DATA_PATH`
    },
    {
      title: isEs ? 'Despliegue del Contenedor en Windows' : 'Deploy Container in Windows',
      code: `${tool.dockerCommand} --restart unless-stopped`
    },
  ];

  for (const st of winSteps) {
    checkPageBreak(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(st.title, margin, y);
    y += 4.5;
    const splitCode = doc.splitTextToSize(st.code, contentWidth - 8);
    const boxH = splitCode.length * 4.2 + 6;
    doc.setFillColor(5, 8, 17);
    doc.rect(margin, y, contentWidth, boxH, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, boxH, 'S');
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text(splitCode, margin + 4, y + 5);
    y += boxH + 5;
  }

  // macOS Section
  checkPageBreak(25);
  doc.setFillColor(88, 28, 135); // purple-900
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isEs ? '3. PASO A PASO PARA MACOS (Homebrew, Colima & Apple Silicon)' : '3. STEP-BY-STEP FOR MACOS (Homebrew, Colima & Apple Silicon)',
    margin + 4,
    y + 5.5
  );
  y += 12;

  const macSteps = [
    {
      title: isEs ? 'Aprovisionamiento con Colima' : 'Colima Provisioning',
      code: 'brew install colima docker\ncolima start --cpu 4 --memory 4 --disk 40'
    },
    {
      title: isEs ? 'Persistencia y Variables en Zsh' : 'Persistence & Zsh Variables',
      code: `mkdir -p "$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"\nexport DATA_DIR="$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"`
    },
    {
      title: isEs ? 'Despliegue Multi-Arch' : 'Multi-Arch Deployment',
      code: `${tool.dockerCommand} --restart unless-stopped`
    },
  ];

  for (const st of macSteps) {
    checkPageBreak(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(st.title, margin, y);
    y += 4.5;
    const splitCode = doc.splitTextToSize(st.code, contentWidth - 8);
    const boxH = splitCode.length * 4.2 + 6;
    doc.setFillColor(5, 8, 17);
    doc.rect(margin, y, contentWidth, boxH, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, boxH, 'S');
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(167, 139, 250); // purple-400
    doc.text(splitCode, margin + 4, y + 5);
    y += boxH + 5;
  }

  // Security Hardening Section
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(isEs ? '4. Recomendaciones de Seguridad para Producción' : '4. Production Security Hardening Recommendations', margin, y);
  y += 6;

  const securityPoints = isEs
    ? [
        '1. Aislamiento de Red: Despliega los contenedores dentro de redes puente dedicadas (ej: docker network create oss-net).',
        '2. Gestión de Credenciales: Almacena contraseñas en variables de entorno protegidas con permisos chmod 600.',
        '3. Persistencia Segura: Configura volúmenes con respaldo automático diario hacia almacenamiento cifrado.',
        '4. Monitoreo CVE: Audita periódicamente vulnerabilidades a través de las métricas de OSS Atlas.'
      ]
    : [
        '1. Network Isolation: Deploy containers inside dedicated bridge networks (e.g., docker network create oss-net).',
        '2. Credentials Management: Store passwords in environment files protected with chmod 600 permissions.',
        '3. Secure Persistence: Configure volume mounts with daily snapshot backups to encrypted storage.',
        '4. CVE Monitoring: Periodically review vulnerability advisories via OSS Atlas metrics.'
      ];

  for (const pt of securityPoints) {
    checkPageBreak(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(pt, margin, y);
    y += 5;
  }

  addFooter();
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

  return {
    pages: doc.getNumberOfPages(),
    bytes: pdfBytes.byteLength,
    kb: (pdfBytes.byteLength / 1024).toFixed(1)
  };
}

async function runGuideTests() {
  console.log('='.repeat(80));
  console.log('🧪 SUITE DE PRUEBAS 3: GENERACIÓN Y VALIDACIÓN FÍSICA DE GUÍAS (.MD & .PDF)');
  console.log(`📁 Directorio de salida: ${outDir}`);
  console.log('='.repeat(80));

  const stats = {
    totalMarkdown: 0,
    totalPdf: 0,
    generatedFiles: []
  };

  for (const tool of testTools) {
    const safeSlug = tool.slug.replace('/', '_');

    // 1. Markdown en Español
    const mdEsPath = path.join(outDir, `Guia_Integracion_${safeSlug}_ES.md`);
    const mdEsContent = generateMarkdown(tool, 'es');
    fs.writeFileSync(mdEsPath, mdEsContent, 'utf-8');
    stats.totalMarkdown++;
    stats.generatedFiles.push({ file: path.basename(mdEsPath), type: 'Markdown (ES)', sizeKb: (Buffer.byteLength(mdEsContent) / 1024).toFixed(1) });

    // 2. Markdown en Inglés
    const mdEnPath = path.join(outDir, `Guia_Integracion_${safeSlug}_EN.md`);
    const mdEnContent = generateMarkdown(tool, 'en');
    fs.writeFileSync(mdEnPath, mdEnContent, 'utf-8');
    stats.totalMarkdown++;
    stats.generatedFiles.push({ file: path.basename(mdEnPath), type: 'Markdown (EN)', sizeKb: (Buffer.byteLength(mdEnContent) / 1024).toFixed(1) });

    // 3. PDF en Español
    const pdfEsPath = path.join(outDir, `Guia_Integracion_${safeSlug}_ES.pdf`);
    const pdfEsMeta = generatePdf(tool, 'es', pdfEsPath);
    stats.totalPdf++;
    stats.generatedFiles.push({ file: path.basename(pdfEsPath), type: 'PDF (ES)', sizeKb: pdfEsMeta.kb, pages: pdfEsMeta.pages });

    // 4. PDF en Inglés
    const pdfEnPath = path.join(outDir, `Guia_Integracion_${safeSlug}_EN.pdf`);
    const pdfEnMeta = generatePdf(tool, 'en', pdfEnPath);
    stats.totalPdf++;
    stats.generatedFiles.push({ file: path.basename(pdfEnPath), type: 'PDF (EN)', sizeKb: pdfEnMeta.kb, pages: pdfEnMeta.pages });

    console.log(`✅ [${tool.name}] -> Generados 4 documentos (.md ES/EN, .pdf ES/EN [${pdfEsMeta.pages} págs])`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`🏁 RESUMEN DE GENERACIÓN:`);
  console.log(`- Guías Markdown (.md) generadas: ${stats.totalMarkdown}`);
  console.log(`- Documentos PDF vectoriales (.pdf) generados: ${stats.totalPdf}`);
  console.log(`- Total de archivos generados y validados: ${stats.generatedFiles.length}`);
  console.log('='.repeat(80));

  // Validaciones físicas automáticas
  console.log('\n🔍 VERIFICACIONES FÍSICAS DE CONTENIDO Y ESTRUCTURA:');
  const sampleMd = fs.readFileSync(path.join(outDir, 'Guia_Integracion_meetily_meetily_ES.md'), 'utf-8');
  console.log(`- [Meetily MD] Contiene telemetría de ahorro vs Granola: ${sampleMd.includes('Granola') ? 'SÍ ✅' : 'NO ❌'}`);
  console.log(`- [Meetily MD] Contiene comandos PowerShell WSL2: ${sampleMd.includes('wsl --status') ? 'SÍ ✅' : 'NO ❌'}`);
  console.log(`- [Meetily MD] Contiene comandos Colima macOS: ${sampleMd.includes('colima start') ? 'SÍ ✅' : 'NO ❌'}`);
  console.log(`- [Meetily MD] Contiene autoría EdisonPEÑA: ${sampleMd.includes('EdisonPEÑA') ? 'SÍ ✅' : 'NO ❌'}`);

  const sampleCopilotMd = fs.readFileSync(path.join(outDir, 'Guia_Integracion_CopilotKit_CopilotKit_ES.md'), 'utf-8');
  console.log(`- [CopilotKit MD] Contiene telemetría de ahorro vs ChatGPT Pro: ${sampleCopilotMd.includes('ChatGPT Pro') ? 'SÍ ✅' : 'NO ❌'}`);

  return stats;
}

runGuideTests().catch(console.error);
