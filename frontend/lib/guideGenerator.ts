import jsPDF from 'jspdf';
import { type Language, getToolDescription, getDifficultyLabel, getSavingsLabel } from './translations';
import { HARDWARE_CATALOG } from './hardwareCatalog';

export interface GuideToolData {
  id: string;
  name: string;
  slug: string;
  category: string;
  license: string;
  healthScore: number;
  healthBreakdown: {
    commitVelocity: number;
    securityStructural: number;
    communityDocs: number;
  };
  stars: string;
  description: string;
  dockerCommand: string;
  integrationDifficulty: string;
  triggers: string[];
  dependencies: string[];
  selfHostedSavingsB2B?: string;
}

export interface PlatformGuide {
  title: string;
  os: 'windows' | 'mac' | 'linux';
  steps: {
    title: string;
    description: string;
    code: string;
    lang: string;
  }[];
  notes: string[];
}

/**
 * Returns structured platform guides tailored for Windows, macOS, and Linux
 */
export function getPlatformGuides(
  tool: GuideToolData,
  lang: Language
): { windows: PlatformGuide; mac: PlatformGuide; linux: PlatformGuide } {
  const isEs = lang === 'es';
  const slug = tool.slug.toLowerCase();

  // Container or runtime specifics
  let primaryContainer =
    tool.dockerCommand.trim() ||
    `docker run -d --name ${tool.slug.split('/').pop()} -p 8080:8080 ${tool.slug}:latest`;
  let testPort = '8080';
  const portMatch = primaryContainer.match(/-p\s+(\d+):/);
  if (portMatch) {
    testPort = portMatch[1];
  }

  // 1. Windows Specific Guide
  const windowsSteps = [
    {
      title: isEs ? '1. Verificación del Entorno WSL2 y Docker Desktop' : '1. Verify WSL2 & Docker Desktop Environment',
      description: isEs
        ? 'Asegúrate de que el subsistema WSL2 esté activo y que Docker Desktop tenga habilitada la integración con WSL2 en Configuración > Recursos > Integración WSL.'
        : 'Ensure WSL2 subsystem is active and Docker Desktop has WSL2 integration enabled in Settings > Resources > WSL Integration.',
      code: `# Comprobar versión y estado del kernel WSL2\nwsl --status\nwsl --update\n\n# Verificar conectividad con el daemon de Docker\ndocker version`,
      lang: 'powershell',
    },
    {
      title: isEs ? '2. Configuración de Variables de Entorno en PowerShell' : '2. Configure Environment Variables in PowerShell',
      description: isEs
        ? 'Define las variables de entorno necesarias para la sesión de PowerShell y crea un directorio para persistencia local de volúmenes.'
        : 'Set necessary environment variables in PowerShell session and create directory for local volume persistence.',
      code: `# Crear directorio de datos persistentes\nNew-Item -ItemType Directory -Force -Path "$HOME\\oss-atlas-data\\${tool.slug.replace('/', '_')}"\n\n# Variables de entorno seguras en la sesión actual\n$env:APP_PORT = "${testPort}"\n$env:APP_ENV = "production"\n$env:DATA_DIR = "$HOME\\oss-atlas-data\\${tool.slug.replace('/', '_')}"`,
      lang: 'powershell',
    },
    {
      title: isEs ? '3. Despliegue del Servicio en Contenedor' : '3. Deploy Service Container',
      description: isEs
        ? 'Ejecuta el contenedor con reinicio automático (unless-stopped) y límites de memoria adecuados para entornos de desarrollo y staging.'
        : 'Run the container with automatic restart policy (unless-stopped) and memory limits suitable for development and staging.',
      code: `# Ejecución en segundo plano con límites de recursos recomendados\n${primaryContainer} --restart unless-stopped`,
      lang: 'powershell',
    },
    {
      title: isEs ? '4. Validación de Salud y Endpoints (Healthcheck)' : '4. Validate Health & Endpoints (Healthcheck)',
      description: isEs
        ? 'Verifica que el proceso esté escuchando en el puerto configurado y que los logs no reporten fallos de inicialización.'
        : 'Verify the process is listening on the configured port and check container logs for initialization status.',
      code: `# Revisar estado del contenedor activo\ndocker ps --filter "name=${tool.slug.split('/').pop()}"\n\n# Inspeccionar logs iniciales\ndocker logs --tail 50 -f $(docker ps -lq)\n\n# Probar endpoint local con PowerShell\nInvoke-RestMethod -Uri "http://localhost:${testPort}" -Method GET -ErrorAction SilentlyContinue`,
      lang: 'powershell',
    },
  ];

  const windowsNotes = isEs
    ? [
        'Firewall de Windows Defender: Si se bloquea la conexión externa, permite el puerto ' + testPort + ' en las reglas de entrada de PowerShell.',
        'Hyper-V Port Reservation: Si Docker arroja error de puerto en uso ("port already allocated"), ejecuta: netsh interface ipv4 show excludedportrange protocol=tcp',
      ]
    : [
        'Windows Defender Firewall: If external connection is blocked, allow port ' + testPort + ' in PowerShell inbound firewall rules.',
        'Hyper-V Port Reservation: If Docker returns "port already allocated", inspect reserved ranges via: netsh interface ipv4 show excludedportrange protocol=tcp',
      ];

  // 2. macOS Specific Guide
  const macSteps = [
    {
      title: isEs ? '1. Preparación del Runtime (Homebrew / Colima / Docker Desktop)' : '1. Prepare Container Runtime (Homebrew / Colima / Docker Desktop)',
      description: isEs
        ? 'En macOS (Apple Silicon M1-M4 o Intel), puedes utilizar Docker Desktop o el runtime ligero de código abierto Colima.'
        : 'On macOS (Apple Silicon M-Series or Intel), you can use Docker Desktop or the lightweight open-source Colima runtime.',
      code: `# Opción A: Usando Colima (Ligero, 100% Open Source sin licencia comercial)\nbrew install colima docker docker-compose\n# Iniciar Colima asignando 4 CPU cores y 4GB de RAM\ncolima start --cpu 4 --memory 4 --disk 40\n\n# Opción B: Si usas Docker Desktop para Mac\n# Abrir Docker Desktop desde Spotlight o /Applications`,
      lang: 'bash',
    },
    {
      title: isEs ? '2. Configuración del Entorno en Terminal (Zsh)' : '2. Configure Environment in Terminal (Zsh)',
      description: isEs
        ? 'Crea el directorio de persistencia y exporta las variables de entorno en tu shell Zsh o perfil ~/.zshrc.'
        : 'Create data directory and export environment variables in your Zsh shell or ~/.zshrc profile.',
      code: `# Crear carpeta de volúmenes persistentes\nmkdir -p "$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"\n\n# Exportar variables\nexport APP_PORT="${testPort}"\nexport DATA_DIR="$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"`,
      lang: 'bash',
    },
    {
      title: isEs ? '3. Despliegue del Servicio con Compatibilidad de Arquitectura' : '3. Deploy Service with Architecture Compatibility',
      description: isEs
        ? 'En procesadores Apple Silicon (ARM64), la mayoría de imágenes oficiales cuentan con soporte multi-arch. Si una imagen solo soporta AMD64, usa la bandera --platform linux/amd64.'
        : 'On Apple Silicon (ARM64), official images support multi-arch natively. If an image is AMD64-only, append --platform linux/amd64.',
      code: `# Despliegue optimizado para macOS\n${primaryContainer} --restart unless-stopped`,
      lang: 'bash',
    },
    {
      title: isEs ? '4. Verificación y Monitoreo de Logs en macOS' : '4. Verification & Log Monitoring on macOS',
      description: isEs
        ? 'Comprueba que el puerto esté activo y realiza una petición HTTP o sondeo del servicio.'
        : 'Check port binding and perform an HTTP healthcheck probe.',
      code: `# Verificar contenedor activo\ndocker ps --filter "name=${tool.slug.split('/').pop()}"\n\n# Monitorear logs en tiempo real\ndocker logs -f $(docker ps -lq)\n\n# Probar conectividad con curl\ncurl -I -s http://localhost:${testPort} | head -n 5`,
      lang: 'bash',
    },
  ];

  const macNotes = isEs
    ? [
        'Apple Silicon (ARM64): Para máximo rendimiento de I/O, Colima utiliza Virtualization.Framework nativo de macOS.',
        'Puertos Privilegiados: Puertos menores a 1024 requieren permisos administrativos en macOS; se recomienda mapear siempre a puertos > 1024 (ej: 8080, 5432).',
      ]
    : [
        'Apple Silicon (ARM64): For maximum I/O throughput, Colima uses native macOS Virtualization.Framework.',
        'Privileged Ports: Ports below 1024 require root elevation on macOS; always map host ports > 1024 (e.g. 8080, 5432).',
      ];

  // 3. Linux Specific Guide (Ubuntu / Debian / RHEL / Rocky Linux)
  const linuxSteps = [
    {
      title: isEs ? '1. Instalación de Docker Engine Oficial y systemd en Linux' : '1. Install Official Docker Engine & systemd on Linux',
      description: isEs
        ? 'Instala el motor nativo de Docker en distribuciones basadas en Debian/Ubuntu o RHEL/Rocky Linux y habilita el arranque automático con systemd.'
        : 'Install native Docker Engine on Debian/Ubuntu or RHEL/Rocky Linux distributions and enable auto-start with systemd.',
      code: `# Instalación desatendida del motor oficial de Docker\ncurl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh\n\n# Habilitar servicio del daemon con systemd\nsudo systemctl enable --now docker\n\n# Permitir ejecución sin sudo (requiere re-login)\nsudo usermod -aG docker $USER`,
      lang: 'bash',
    },
    {
      title: isEs ? '2. Optimización del Kernel Linux (sysctl) y Directorio de Datos' : '2. Linux Kernel Optimization (sysctl) & Data Directory',
      description: isEs
        ? 'Ajusta los parámetros de memoria virtual y descriptores de archivos para alto rendimiento en bases de datos y microservicios.'
        : 'Tune virtual memory and file descriptor parameters for high-throughput databases and microservices.',
      code: `# Crear directorio persistente en /opt con permisos estrictos\nsudo mkdir -p /opt/oss-atlas-data/${tool.slug.replace('/', '_')}\nsudo chown -R $USER:$USER /opt/oss-atlas-data\n\n# Parámetros del kernel recomendados para producción\nsudo sysctl -w vm.max_map_count=262144\nsudo sysctl -w net.core.somaxconn=4096\nsudo sysctl -w fs.file-max=2097152`,
      lang: 'bash',
    },
    {
      title: isEs ? '3. Despliegue con Red Puente Aislada y Políticas de Reinicio' : '3. Deploy with Isolated Bridge Network & Restart Policy',
      description: isEs
        ? 'Despliega el contenedor dentro de una red Docker aislada para garantizar seguridad multi-tenant y tolerancia a fallos.'
        : 'Deploy the container within an isolated Docker network to ensure multi-tenant security and fault tolerance.',
      code: `# Crear red puente corporativa aislada\ndocker network create b2b-tier-net --driver bridge 2>/dev/null || true\n\n# Desplegar servicio conectado a la red puente\n${primaryContainer} --network b2b-tier-net --restart unless-stopped`,
      lang: 'bash',
    },
    {
      title: isEs ? '4. Reglas de Cortafuegos (UFW / Firewalld) y Healthcheck con cURL' : '4. Firewall Rules (UFW / Firewalld) & Healthcheck with cURL',
      description: isEs
        ? 'Habilita el tráfico entrante en el cortafuegos y valida la respuesta del endpoint y las métricas de recursos con docker stats.'
        : 'Open the port in UFW or firewalld, test endpoint responsiveness, and monitor runtime resource consumption with docker stats.',
      code: `# Opción Ubuntu/Debian con UFW:\nsudo ufw allow ${testPort}/tcp comment 'OSS Atlas ${tool.name}'\n\n# Opción RHEL/Rocky con Firewalld:\n# sudo firewall-cmd --permanent --add-port=${testPort}/tcp && sudo firewall-cmd --reload\n\n# Verificación de salud y telemetría de recursos\ncurl -I -s http://localhost:${testPort} | head -n 5\ndocker stats --no-stream $(docker ps -lq)`,
      lang: 'bash',
    },
  ];

  const linuxNotes = isEs
    ? [
        'SELinux en RHEL / Rocky Linux: Si el contenedor reporta "Permission Denied" al acceder al volumen, añade el sufijo :z (ej: -v /opt/data:/data:z) para reetiquetar los contextos SELinux.',
        'Docker Rootless Mode: En entornos con regulaciones estrictas de seguridad (PCI-DSS / ISO 27001), puedes ejecutar Docker en modo Rootless para no otorgar permisos de root al daemon.',
      ]
    : [
        'SELinux on RHEL / Rocky Linux: If the container encounters "Permission Denied" on mounted volumes, append :z (e.g. -v /opt/data:/data:z) to configure SELinux contexts.',
        'Docker Rootless Mode: In strictly regulated environments (PCI-DSS / ISO 27001), run Docker in Rootless Mode to prevent daemon root privileges.',
      ];

  return {
    windows: {
      title: isEs ? 'Guía de Integración para Windows (PowerShell / WSL2 / Docker Desktop)' : 'Integration Guide for Windows (PowerShell / WSL2 / Docker Desktop)',
      os: 'windows',
      steps: windowsSteps,
      notes: windowsNotes,
    },
    mac: {
      title: isEs ? 'Guía de Integración para macOS (Terminal / Homebrew / Colima / Docker)' : 'Integration Guide for macOS (Terminal / Homebrew / Colima / Docker)',
      os: 'mac',
      steps: macSteps,
      notes: macNotes,
    },
    linux: {
      title: isEs ? 'Guía de Integración para Linux (Ubuntu / Debian / RHEL / Docker Engine & systemd)' : 'Integration Guide for Linux (Ubuntu / Debian / RHEL / Docker Engine & systemd)',
      os: 'linux',
      steps: linuxSteps,
      notes: linuxNotes,
    },
  };
}

/**
 * Generates comprehensive Markdown content for the tool integration guide
 */
export function generateMarkdownGuide(tool: GuideToolData, lang: Language): string {
  const isEs = lang === 'es';
  const desc = getToolDescription(tool.slug, tool.description, lang);
  const diff = getDifficultyLabel(tool.integrationDifficulty, lang);
  const savings = getSavingsLabel(tool.selfHostedSavingsB2B || '', lang);
  const { windows, mac, linux } = getPlatformGuides(tool, lang);

  const timestamp = new Date().toISOString();

  return `# ${isEs ? 'Guía de Integración Técnica B2B' : 'B2B Technical Integration Guide'}: ${tool.name}

> **OSS Atlas B2B Architecture Intelligence**  
> **${isEs ? 'Plataforma' : 'Platform'}:** [https://ossatlas.iotdico.com](https://ossatlas.iotdico.com)  
> **${isEs ? 'Autor' : 'Author'}:** EdisonPEÑA (Iotdico)  
> **${isEs ? 'Fecha de Generación' : 'Generated At'}:** ${timestamp}  
> **${isEs ? 'Licencia de Software' : 'Software License'}:** ${tool.license}  
> **Health Score:** ${tool.healthScore}/100 (Commits: ${tool.healthBreakdown.commitVelocity}%, Security: ${tool.healthBreakdown.securityStructural}%, Docs/Community: ${tool.healthBreakdown.communityDocs}%)

---

## 1. ${isEs ? 'Perfil Arquitectónico & Resumen Ejecutivo' : 'Architectural Profile & Executive Summary'}

- **${isEs ? 'Repositorio' : 'Repository'}:** \`${tool.slug}\`
- **${isEs ? 'Categoría' : 'Category'}:** ${tool.category}
- **${isEs ? 'Dificultad de Integración' : 'Integration Difficulty'}:** ${diff}
${savings ? `- **${isEs ? 'Telemetría de Ahorro B2B' : 'B2B Savings Telemetry'}:** ${savings}` : ''}
- **Stars GitHub:** ${tool.stars}

### ${isEs ? 'Descripción' : 'Description'}
${desc}

---

## 2. ${isEs ? 'Requisitos, Dependencias y Disparadores' : 'Requirements, Dependencies & Integration Triggers'}

### ${isEs ? 'Dependencias del Sistema' : 'System Dependencies'}
${tool.dependencies && tool.dependencies.length > 0 ? tool.dependencies.map((d) => `- \`${d}\``).join('\n') : isEs ? '- Docker Runtime 20.10+ / Kernel compatible' : '- Docker Runtime 20.10+ / Compatible kernel'}

### ${isEs ? 'Disparadores de Arquitectura (Triggers)' : 'Architectural Triggers'}
${tool.triggers && tool.triggers.length > 0 ? tool.triggers.map((t) => `- ${t}`).join('\n') : isEs ? '- Despliegue de microservicios B2B' : '- B2B microservices deployment'}

---

## 3. ${windows.title}

${windows.steps
  .map(
    (s) => `### ${s.title}
${s.description}

\`\`\`${s.lang}
${s.code}
\`\`\`
`
  )
  .join('\n')}

### ${isEs ? 'Notas Técnicas & Solución de Problemas en Windows' : 'Technical Notes & Troubleshooting for Windows'}
${windows.notes.map((n) => `- ⚠️ ${n}`).join('\n')}

---

## 4. ${mac.title}

${mac.steps
  .map(
    (s) => `### ${s.title}
${s.description}

\`\`\`${s.lang}
${s.code}
\`\`\`
`
  )
  .join('\n')}

### ${isEs ? 'Notas Técnicas & Compatibilidad Apple Silicon' : 'Technical Notes & Apple Silicon Compatibility'}
${mac.notes.map((n) => `- 💡 ${n}`).join('\n')}

---

## 5. ${linux.title}

${linux.steps
  .map(
    (s) => `### ${s.title}
${s.description}

\`\`\`${s.lang}
${s.code}
\`\`\`
`
  )
  .join('\n')}

### ${isEs ? 'Notas Técnicas & Optimización en Linux' : 'Technical Notes & Linux Optimization'}
${linux.notes.map((n) => `- 🐧 ${n}`).join('\n')}

---

## 6. ${isEs ? 'Especificaciones de Hardware Físico Recomendado (Capa 0 On-Premise)' : 'Recommended Physical Hardware Specifications (Layer 0 On-Premise)'}

${isEs
  ? 'Para garantizar la soberanía de datos y mitigar costos recurrentes en la nube, se recomiendan los siguientes niveles de hardware físico para hospedar esta herramienta y su ecosistema:'
  : 'To ensure data sovereignty and eliminate recurring cloud expenses, the following physical hardware tiers are recommended to self-host this tool:'}

| ${isEs ? 'Nivel de Hardware' : 'Hardware Tier'} | ${isEs ? 'CPU & Núcleos' : 'CPU & Cores'} | ${isEs ? 'Memoria RAM' : 'Memory RAM'} | ${isEs ? 'Almacenamiento' : 'Storage'} | ${isEs ? 'Inversión Aprox.' : 'Approx. Capex'} | ${isEs ? 'Punto de Equilibrio' : 'Break-Even Payback'} |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **${HARDWARE_CATALOG[0].name[lang]}** | ${HARDWARE_CATALOG[0].specs.cpu} | ${HARDWARE_CATALOG[0].specs.ram} | ${HARDWARE_CATALOG[0].specs.storage} | ~$${HARDWARE_CATALOG[0].estimatedPriceUSD} USD | ~${HARDWARE_CATALOG[0].breakEvenMonths} ${isEs ? 'meses' : 'months'} |
| **${HARDWARE_CATALOG[1].name[lang]}** | ${HARDWARE_CATALOG[1].specs.cpu} | ${HARDWARE_CATALOG[1].specs.ram} | ${HARDWARE_CATALOG[1].specs.storage} | ~$${HARDWARE_CATALOG[1].estimatedPriceUSD} USD | ~${HARDWARE_CATALOG[1].breakEvenMonths} ${isEs ? 'meses' : 'months'} |
| **${HARDWARE_CATALOG[2].name[lang]}** | ${HARDWARE_CATALOG[2].specs.cpu} | ${HARDWARE_CATALOG[2].specs.ram} | ${HARDWARE_CATALOG[2].specs.storage} | ~$${HARDWARE_CATALOG[2].estimatedPriceUSD} USD | ~${HARDWARE_CATALOG[2].breakEvenMonths} ${isEs ? 'meses' : 'months'} |
| **${HARDWARE_CATALOG[3].name[lang]}** | ${HARDWARE_CATALOG[3].specs.cpu} | ${HARDWARE_CATALOG[3].specs.ram} | ${HARDWARE_CATALOG[3].specs.storage} | ~$${HARDWARE_CATALOG[3].estimatedPriceUSD} USD | ~${HARDWARE_CATALOG[3].breakEvenMonths} ${isEs ? 'meses' : 'months'} |

> 🛒 **${isEs ? 'Referencia de Compra:' : 'Procurement Reference:'}** [${isEs ? 'Ver catálogo de hardware y disponibilidad en Amazon' : 'View hardware options on Amazon'}](${HARDWARE_CATALOG[1].amazonAffiliateUrl})

---

## 7. ${isEs ? 'Lista de Verificación de Seguridad para Producción' : 'Production Security Hardening Checklist'}

1. **${isEs ? 'Aislamiento de Red' : 'Network Isolation'}:** ${isEs ? 'Crea una red puente dedicada (ej: `docker network create b2b-net`) y no expongas puertos de base de datos a internet abierto.' : 'Create a dedicated bridge network (`docker network create b2b-net`) and avoid binding database ports to 0.0.0.0.'}
2. **${isEs ? 'Gestión de Secretos' : 'Secrets Management'}:** ${isEs ? 'Nunca guardes contraseñas en scripts. Usa Docker Secrets o variables inyectadas mediante archivos `.env` restringidos (`chmod 600`).' : 'Never hardcode credentials in scripts. Use Docker Secrets or injected environment files with restricted permissions (`chmod 600`).'}
3. **${isEs ? 'Políticas de Respaldo' : 'Backup Policies'}:** ${isEs ? 'Configura respaldos periódicos de los volúmenes montados en almacenamiento externo o buckets S3.' : 'Establish automated snapshot backups for persistent volumes to object storage/S3.'}
4. **${isEs ? 'Actualizaciones de Parches' : 'Patch Management'}:** ${isEs ? 'Suscríbete al feed de releases del repositorio en OSS Atlas para auditar alertas CVE.' : 'Subscribe to repository release events via OSS Atlas to monitor CVE advisories.'}

---

*${isEs ? 'Documento generado automáticamente por OSS Atlas B2B Architecture Intelligence' : 'Document automatically generated by OSS Atlas B2B Architecture Intelligence'}*  
*${isEs ? 'Creado por' : 'Created by'} EdisonPEÑA — [https://ossatlas.iotdico.com](https://ossatlas.iotdico.com)*
`;
}

/**
 * Triggers the client-side download of the Markdown file
 */
export function downloadMarkdownGuide(tool: GuideToolData, lang: Language): void {
  const content = generateMarkdownGuide(tool, lang);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Guia_Integracion_${tool.slug.replace('/', '_')}_${lang.toUpperCase()}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers the client-side download of a high-fidelity B2B PDF guide
 */
export async function downloadPdfGuide(tool: GuideToolData, lang: Language): Promise<void> {
  const isEs = lang === 'es';
  const desc = getToolDescription(tool.slug, tool.description, lang);
  const diff = getDifficultyLabel(tool.integrationDifficulty, lang);
  const savings = getSavingsLabel(tool.selfHostedSavingsB2B || '', lang);
  const { windows, mac, linux } = getPlatformGuides(tool, lang);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper function to check space and add new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      addFooter();
      doc.addPage();
      y = margin;
      addHeaderCompact();
    }
  };

  // Header compact for subsequent pages
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

  // Footer for each page
  const addFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setDrawColor(51, 65, 85); // slate-700
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(
      isEs
        ? 'OSS Atlas · Creado por EdisonPEÑA (https://ossatlas.iotdico.com)'
        : 'OSS Atlas · Created by EdisonPEÑA (https://ossatlas.iotdico.com)',
      margin,
      pageHeight - 7
    );
    doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // --- PAGE 1: TITLE & EXECUTIVE PROFILE ---
  // Top Banner
  doc.setFillColor(10, 15, 30); // slate-950
  doc.rect(margin, y, contentWidth, 34, 'F');
  doc.setDrawColor(34, 211, 238); // cyan border
  doc.setLineWidth(0.8);
  doc.rect(margin, y, contentWidth, 34, 'S');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isEs ? `GUÍA DE INTEGRACIÓN B2B: ${tool.name.toUpperCase()}` : `B2B INTEGRATION GUIDE: ${tool.name.toUpperCase()}`,
    margin + 6,
    y + 11
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `OSS Atlas Intelligence Platform · ${tool.slug} · ${tool.license} License · Generated: ${new Date().toLocaleDateString()}`,
    margin + 6,
    y + 18
  );

  // Badges row inside banner
  const badgeY = y + 23;
  // Health badge
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(margin + 6, badgeY, 34, 6, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`HEALTH: ${tool.healthScore}/100`, margin + 8, badgeY + 4.2);

  // Difficulty badge
  doc.setFillColor(59, 130, 246); // blue-500
  doc.roundedRect(margin + 44, badgeY, 32, 6, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(`DIFF: ${diff.toUpperCase()}`, margin + 46, badgeY + 4.2);

  // Category badge
  doc.setFillColor(139, 92, 246); // violet-500
  doc.roundedRect(margin + 80, badgeY, 32, 6, 1.5, 1.5, 'F');
  doc.text(tool.category, margin + 82, badgeY + 4.2);

  // Savings if available
  if (savings) {
    doc.setFillColor(245, 158, 11); // amber-500
    doc.roundedRect(margin + 116, badgeY, 44, 6, 1.5, 1.5, 'F');
    doc.setTextColor(15, 23, 42);
    doc.text(savings.substring(0, 24), margin + 118, badgeY + 4.2);
  }

  y += 40;

  // Description & Architecture Summary Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(isEs ? '1. Resumen de Arquitectura y Propósito B2B' : '1. Architecture Summary & B2B Purpose', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const splitDesc = doc.splitTextToSize(desc, contentWidth - 8);
  doc.text(splitDesc, margin + 4, y + 13);
  y += 36;

  // --- WINDOWS SECTION ---
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(14, 116, 144); // cyan-700
  doc.text(`2. ${windows.title}`, margin, y);
  y += 6;

  for (const step of windows.steps) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(step.title, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // slate-600
    const splitDesc = doc.splitTextToSize(step.description, contentWidth);
    doc.text(splitDesc, margin, y);
    y += splitDesc.length * 4 + 2;

    // Code Box
    const codeLines = doc.splitTextToSize(step.code, contentWidth - 8);
    const codeBoxHeight = codeLines.length * 3.8 + 6;
    checkPageBreak(codeBoxHeight + 4);

    doc.setFillColor(8, 12, 24);
    doc.rect(margin, y, contentWidth, codeBoxHeight, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, codeBoxHeight, 'S');

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text(codeLines, margin + 4, y + 4.5);
    y += codeBoxHeight + 5;
  }

  // Windows Notes
  checkPageBreak(25);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(245, 158, 11);
  doc.text(isEs ? 'AVISO TÉCNICO WINDOWS / WSL2:' : 'WINDOWS / WSL2 TECHNICAL NOTICE:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  const splitWinNote = doc.splitTextToSize(windows.notes.join(' | '), contentWidth - 8);
  doc.text(splitWinNote, margin + 4, y + 10);
  y += 24;

  // --- MAC SECTION ---
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(168, 85, 247); // purple-500
  doc.text(`3. ${mac.title}`, margin, y);
  y += 6;

  for (const step of mac.steps) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(step.title, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitMacDesc = doc.splitTextToSize(step.description, contentWidth);
    doc.text(splitMacDesc, margin, y);
    y += splitMacDesc.length * 4 + 2;

    const codeLines = doc.splitTextToSize(step.code, contentWidth - 8);
    const codeBoxHeight = codeLines.length * 3.8 + 6;
    checkPageBreak(codeBoxHeight + 4);

    doc.setFillColor(8, 12, 24);
    doc.rect(margin, y, contentWidth, codeBoxHeight, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, codeBoxHeight, 'S');

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(192, 132, 252); // purple-400
    doc.text(codeLines, margin + 4, y + 4.5);
    y += codeBoxHeight + 5;
  }

  // Mac Notes
  checkPageBreak(25);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(34, 211, 238);
  doc.text(isEs ? 'AVISO TÉCNICO MACOS / APPLE SILICON:' : 'MACOS / APPLE SILICON TECHNICAL NOTICE:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  const splitMacNote = doc.splitTextToSize(mac.notes.join(' | '), contentWidth - 8);
  doc.text(splitMacNote, margin + 4, y + 10);
  y += 24;

  // --- LINUX SECTION ---
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text(`4. ${linux.title}`, margin, y);
  y += 6;

  for (const step of linux.steps) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(step.title, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitLinuxDesc = doc.splitTextToSize(step.description, contentWidth);
    doc.text(splitLinuxDesc, margin, y);
    y += splitLinuxDesc.length * 4 + 2;

    const codeLines = doc.splitTextToSize(step.code, contentWidth - 8);
    const codeBoxHeight = codeLines.length * 3.8 + 6;
    checkPageBreak(codeBoxHeight + 4);

    doc.setFillColor(8, 12, 24);
    doc.rect(margin, y, contentWidth, codeBoxHeight, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, codeBoxHeight, 'S');

    doc.setFont('courier', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text(codeLines, margin + 4, y + 4.5);
    y += codeBoxHeight + 5;
  }

  // Linux Notes
  checkPageBreak(25);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text(isEs ? 'AVISO TÉCNICO LINUX / SYSTEMD / SELINUX:' : 'LINUX / SYSTEMD / SELINUX TECHNICAL NOTICE:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  const splitLinuxNote = doc.splitTextToSize(linux.notes.join(' | '), contentWidth - 8);
  doc.text(splitLinuxNote, margin + 4, y + 10);
  y += 24;

  // --- HARDWARE SPEC SHEET SECTION ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(isEs ? '5. Requisitos de Hardware Físico Recomendado (Capa 0 On-Premise)' : '5. Recommended Physical Hardware Specifications (Layer 0 On-Premise)', margin, y);
  y += 6;

  const hardwareRows = [
    `• Nivel 1: Mini PC Homelab (Ryzen 9 / i9, 64GB DDR5, 2TB NVMe) -> ~$780 USD (ROI: 3.2 ${isEs ? 'meses' : 'months'})`,
    `• Nivel 2: Servidor Torre PYME (Xeon ECC / EPYC, 64-128GB ECC, RAID) -> ~$1,850 USD (ROI: 3.5 ${isEs ? 'meses' : 'months'})`,
    `• Nivel 3: Servidor Rack 1U/2U (Dual EPYC/Xeon, 128-256GB ECC, 10GbE) -> ~$4,600 USD (ROI: 3.4 ${isEs ? 'meses' : 'months'})`,
    `• Nivel 4: AI Workstation (Ryzen 9 / i9, 128GB, GPU RTX 24GB VRAM) -> ~$3,650 USD (ROI: 3.1 ${isEs ? 'meses' : 'months'})`,
  ];

  for (const row of hardwareRows) {
    checkPageBreak(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(row, margin, y);
    y += 5;
  }
  y += 4;

  // --- SECURITY HARDENING CHECKLIST ---
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(isEs ? '6. Recomendaciones de Seguridad para Producción' : '6. Production Security Hardening Recommendations', margin, y);
  y += 6;

  const securityPoints = isEs
    ? [
        '1. Aislamiento de Red: Despliega los contenedores dentro de redes puente definidas por usuario (evita usar la red host en entornos multi-tenant).',
        '2. Gestión de Credenciales: Almacena contraseñas y tokens en archivos de variables de entorno (.env) protegidos con permisos de lectura exclusivos.',
        '3. Persistencia Segura: Configura volúmenes con respaldo automático diario hacia almacenamiento cifrado en la nube.',
        '4. Auditoría y Monitoreo: Revisa periódicamente las alertas de seguridad y versiones publicadas a través del catálogo de OSS Atlas.',
      ]
    : [
        '1. Network Isolation: Deploy containers within dedicated user-defined bridge networks (avoid host networking in multi-tenant setups).',
        '2. Credentials Management: Store database passwords and API tokens in .env files protected with strict filesystem access permissions.',
        '3. Secure Persistence: Configure volume mounts with daily snapshot backups to encrypted cloud storage.',
        '4. Audit & Monitoring: Regularly review security advisories and updated tags published via the OSS Atlas live catalog.',
      ];

  for (const point of securityPoints) {
    checkPageBreak(12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitPoint = doc.splitTextToSize(point, contentWidth);
    doc.text(splitPoint, margin, y);
    y += splitPoint.length * 4 + 2;
  }

  // Add footer to final page
  addFooter();

  // Save the PDF file
  const fileName = `Guia_Integracion_${tool.slug.replace('/', '_')}_${lang.toUpperCase()}.pdf`;
  doc.save(fileName);
}
