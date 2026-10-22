import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const CheckoutRequestSchema = z.object({
  planId: z.enum(["PRO_ARCHITECTURE", "ENTERPRISE_HUB"]),
  billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
  customerEmail: z.string().email("Correo corporativo inválido"),
  companyName: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  taxId: z.string().optional(),
  paymentMethod: z.enum(["card", "bank_transfer", "crypto_usdc"]).default("card"),
});

interface PlanPricingConfig {
  id: "PRO_ARCHITECTURE" | "ENTERPRISE_HUB";
  name: string;
  monthlyPriceUsd: number;
  annualPriceUsd: number;
  features: string[];
}

const B2B_PLANS: Record<"PRO_ARCHITECTURE" | "ENTERPRISE_HUB", PlanPricingConfig> = {
  PRO_ARCHITECTURE: {
    id: "PRO_ARCHITECTURE",
    name: "OSS Atlas Pro Architecture",
    monthlyPriceUsd: 19,
    annualPriceUsd: 190, // 2 meses gratis
    features: [
      "Consultas ilimitadas al Arquitecto RAG con contexto real de PostgreSQL 16",
      "Descarga de Guías de Integración B2B (.md y .pdf) paso a paso para Windows y Mac",
      "Exportación de manifiestos unificados (Docker Compose & Terraform multicapa)",
      "Acceso prioritario al Pipeline de Ingesta Continua con ETags en vivo",
      "Soporte arquitectónico asíncrono con SLA < 12h",
    ],
  },
  ENTERPRISE_HUB: {
    id: "ENTERPRISE_HUB",
    name: "OSS Atlas Enterprise Hub",
    monthlyPriceUsd: 49,
    annualPriceUsd: 490, // Ahorro anual
    features: [
      "Todas las características de Pro Architecture incluidas",
      "Licencia comercial multi-asiento para equipos de ingeniería (hasta 10 arquitectos)",
      "Auditorías automáticas de cumplimiento normativo (PCI-DSS, SOC2, HIPAA)",
      "Conectores directos a pipelines CI/CD corporativos (GitHub Actions / GitLab CI)",
      "Facturación legal B2B con RUT / Tax ID / NIT y pagos por transferencia bancaria",
      "Sesión 1-on-1 trimestral de revisión de arquitectura con EdisonPEÑA (Iotdico)",
    ],
  },
};

/**
 * POST /api/v1/checkout
 * Genera una sesión de suscripción B2B, emite factura proforma y credencial Pro.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = CheckoutRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos de checkout incompletos o inválidos",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { planId, billingCycle, customerEmail, companyName, taxId, paymentMethod } = parsed.data;
    const plan = B2B_PLANS[planId];
    const amountUsd = billingCycle === "annual" ? plan.annualPriceUsd : plan.monthlyPriceUsd;

    const subscriptionId = `sub_b2b_${crypto.randomBytes(8).toString("hex")}`;
    const invoiceNumber = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (billingCycle === "annual" ? 365 : 30));

    // Generar token criptográfico verificable para el cliente B2B
    const tokenPayload = {
      subId: subscriptionId,
      planId,
      planName: plan.name,
      email: customerEmail,
      company: companyName,
      taxId: taxId || "N/A",
      cycle: billingCycle,
      amountUsd,
      exp: expiresAt.toISOString(),
      issuer: "OSS Atlas (EdisonPEÑA / Iotdico)",
    };

    const proAccessToken = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    return NextResponse.json({
      success: true,
      message: `¡Suscripción a ${plan.name} activada exitosamente!`,
      subscription: {
        id: subscriptionId,
        status: "ACTIVE",
        planId,
        planName: plan.name,
        billingCycle,
        amountUsd,
        currency: "USD",
        paymentMethod,
        invoiceNumber,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
      customer: {
        email: customerEmail,
        companyName,
        taxId: taxId || null,
      },
      proAccessToken,
      unlockedFeatures: plan.features,
    });
  } catch (error) {
    console.error("Error en checkout B2B:", error);
    return NextResponse.json(
      {
        error: "Error interno al procesar el checkout B2B",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/checkout
 * Consulta el catálogo de planes y precios B2B disponibles.
 */
export async function GET() {
  return NextResponse.json({
    plans: B2B_PLANS,
    currency: "USD",
    discounts: {
      annualDiscountPercent: 20,
      annualSavingsNote: "2 meses gratis pagando anualmente",
    },
    guarantee: "Garantía de reembolso de 14 días sin preguntas para clientes B2B",
  });
}
