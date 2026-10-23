const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

const sampleTools = [
  {
    name: 'PostgreSQL Relacional Core',
    slug: 'postgres/postgres',
    category: 'DBS',
    license: 'PostgreSQL',
    stars: '15.2k',
    healthScore: 99,
    integrationDifficulty: 'Baja',
    description: 'Motor de base de datos relacional estándar de la industria. Soporte ACID estricto, extensiones nativas y concurrencia MVCC probada.',
    dockerCommand: 'docker run -d --name postgres-core -p 5432:5432 -e POSTGRES_PASSWORD=postgres -v postgres_data:/var/lib/postgresql/data postgres:16-alpine',
    dependencies: ['Docker Engine 20.10+', 'Kernel Linux 5.15+ (WSL2/macOS)'],
    triggers: ['Transaction Log Replication', 'Read Replica Sync'],
    selfHostedSavingsB2B: '$1,850 USD / mes vs Cloud Propietario',
  },
  {
    name: 'Keycloak Identity & IAM',
    slug: 'keycloak/keycloak',
    category: 'AUTH',
    license: 'Apache-2.0',
    stars: '21.4k',
    healthScore: 97,
    integrationDifficulty: 'Media',
    description: 'Gestión de identidad y acceso unificada para aplicaciones modernas. Soporte OIDC, OAuth2, SAML 2.0 y federación de directorios.',
    dockerCommand: 'docker run -d --name keycloak-iam -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev',
    dependencies: ['Java OpenJDK 17+', 'PostgreSQL o base de datos relacional externa'],
    triggers: ['OIDC Token Exchange', 'Webhook Event Bus'],
    selfHostedSavingsB2B: '$2,400 USD / mes en licencias MAU B2B',
  },
  {
    name: 'Qdrant Vector Database',
    slug: 'qdrant/qdrant',
    category: 'DBS',
    license: 'Apache-2.0',
    stars: '19.8k',
    healthScore: 96,
    integrationDifficulty: 'Media',
    description: 'Motor de búsqueda y similitud vectorial escrito en Rust. Soporte nativo para filtrado de metadatos, cuantización escalar y HNSW distribuido.',
    dockerCommand: 'docker run -d --name qdrant-engine -p 6333:6333 -v qdrant_storage:/qdrant/storage qdrant/qdrant:latest',
    dependencies: ['Docker Engine', 'Memoria RAM recomendada >= 4GB'],
    triggers: ['Vector Upsert Stream', 'Cosine/Dot Product Search'],
    selfHostedSavingsB2B: '$1,200 USD / mes vs SaaS Propietario',
  },
];

function buildPdf(tool, lang, outputPath) {
  const isEs = lang === 'es';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addHeaderCompact = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(34, 211, 238);
    doc.text('OSS ATLAS B2B ARCHITECTURE', margin + 4, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
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
    doc.text('OSS Atlas · Creado por EdisonPEÑA (https://ossatlas.iotdico.com)', margin, pageHeight - 7);
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
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('GUÍA DE INTEGRACIÓN B2B', margin + 6, y + 10);

  doc.setFontSize(12);
  doc.setTextColor(56, 189, 248);
  doc.text(tool.name, margin + 6, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Slug: ${tool.slug}   |   Licencia: ${tool.license}   |   Categoría: ${tool.category}   |   Stars: ${tool.stars}`, margin + 6, y + 27);
  y += 40;

  // Metric Badges
  const badgeWidth = (contentWidth - 6) / 3;
  const badgeHeight = 16;

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, badgeWidth, badgeHeight, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, badgeWidth, badgeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129);
  doc.text('HEALTH SCORE', margin + 4, y + 5);
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`${tool.healthScore}/100`, margin + 4, y + 12);

  const b2X = margin + badgeWidth + 3;
  doc.setFillColor(15, 23, 42);
  doc.rect(b2X, y, badgeWidth, badgeHeight, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.rect(b2X, y, badgeWidth, badgeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(245, 158, 11);
  doc.text('DIFICULTAD', b2X + 4, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(tool.integrationDifficulty, b2X + 4, y + 12);

  const b3X = b2X + badgeWidth + 3;
  doc.setFillColor(15, 23, 42);
  doc.rect(b3X, y, badgeWidth, badgeHeight, 'F');
  doc.setDrawColor(34, 211, 238);
  doc.rect(b3X, y, badgeWidth, badgeHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(34, 211, 238);
  doc.text('TELEMETRÍA AHORRO', b3X + 4, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(tool.selfHostedSavingsB2B.slice(0, 24), b3X + 4, y + 12);
  y += badgeHeight + 8;

  // Technical Description - High Contrast
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('1. Descripción Técnica del Repositorio', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // slate-700
  const splitDesc = doc.splitTextToSize(tool.description, contentWidth);
  doc.text(splitDesc, margin, y);
  y += splitDesc.length * 4.5 + 4;

  // Dependencies
  checkPageBreak(25);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 22, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 22, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248);
  doc.text('DEPENDENCIAS DEL SISTEMA:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(tool.dependencies.join(', '), margin + 4, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248);
  doc.text('DISPARADORES DE INTEGRACIÓN:', margin + 4, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(tool.triggers.join(', '), margin + 4, y + 19);
  y += 28;

  // Windows Steps
  checkPageBreak(25);
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('2. PASO A PASO PARA WINDOWS (PowerShell & WSL2)', margin + 4, y + 5.5);
  y += 12;

  const winSteps = [
    { title: 'Validación del Subsistema WSL2', code: 'wsl --status\nwsl --update' },
    { title: 'Persistencia y Variables de Sesión', code: `$env:DATA_PATH = "$HOME\\oss-atlas-data\\${tool.slug.replace('/', '_')}"\nNew-Item -ItemType Directory -Force -Path $env:DATA_PATH` },
    { title: 'Despliegue del Contenedor en Windows', code: `${tool.dockerCommand} --restart unless-stopped` },
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
    doc.setTextColor(52, 211, 153);
    doc.text(splitCode, margin + 4, y + 5);
    y += boxH + 5;
  }

  // macOS Steps
  checkPageBreak(25);
  doc.setFillColor(88, 28, 135);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('3. PASO A PASO PARA MACOS (Homebrew, Colima & Apple Silicon)', margin + 4, y + 5.5);
  y += 12;

  const macSteps = [
    { title: 'Aprovisionamiento de Colima', code: 'brew install colima docker\ncolima start --cpu 4 --memory 4 --disk 40' },
    { title: 'Persistencia y Variables en Zsh', code: `mkdir -p "$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"\nexport DATA_DIR="$HOME/oss-atlas-data/${tool.slug.replace('/', '_')}"` },
    { title: 'Despliegue con Compatibilidad Multi-Arch', code: `${tool.dockerCommand} --restart unless-stopped` },
  ];

  for (const st of macSteps) {
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
    doc.setTextColor(167, 139, 250);
    doc.text(splitCode, margin + 4, y + 5);
    y += boxH + 5;
  }

  // Security Hardening
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('4. Recomendaciones de Seguridad para Producción', margin, y);
  y += 6;
  const securityPoints = [
    '1. Aislamiento de Red: Despliega los contenedores dentro de redes puente definidas por usuario.',
    '2. Gestión de Credenciales: Almacena contraseñas en archivos .env protegidos con permisos 600.',
    '3. Persistencia Segura: Configura volúmenes con respaldo automático diario hacia almacenamiento cifrado.',
  ];
  for (const pt of securityPoints) {
    checkPageBreak(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(pt, margin, y);
    y += 5;
  }

  addFooter();
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  console.log(`Generated: ${outputPath} (${(pdfBytes.byteLength / 1024).toFixed(1)} KB, ${doc.getNumberOfPages()} pages)`);
}

const outDir = path.join(__dirname, 'generated_guides');
sampleTools.forEach((t) => {
  const p = path.join(outDir, `Guia_Integracion_${t.slug.replace('/', '_')}_ES.pdf`);
  buildPdf(t, 'es', p);
});
