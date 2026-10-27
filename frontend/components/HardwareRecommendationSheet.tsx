"use client";

import React, { useState, useId } from "react";
import {
  HARDWARE_CATALOG,
  HARDWARE_BRAND_MODELS,
  HardwareTier,
  HardwareBrandModel,
  recommendHardwareForArchitecture,
  buildAmazonAffiliateUrl,
  hasAffiliateTag,
} from "../lib/hardwareCatalog";
import HardwareRadarChart from "./HardwareRadarChart";

interface HardwareRecommendationSheetProps {
  layers?: {
    dbsTool?: string;
    authTool?: string;
    paymentsTool?: string;
    aiTool?: string;
  };
  lang?: "es" | "en";
}

export const HardwareRecommendationSheet: React.FC<HardwareRecommendationSheetProps> = ({
  layers = {},
  lang = "es",
}) => {
  const recommendation = recommendHardwareForArchitecture(layers);
  const [activeTierId, setActiveTierId] = useState<string>(recommendation.recommendedTier.id);
  const [brandCategoryFilter, setBrandCategoryFilter] = useState<string>("all");
  const activeTier = HARDWARE_CATALOG.find((t) => t.id === activeTierId) || recommendation.recommendedTier;
  const isAffiliateActive = hasAffiliateTag();

  const filteredBrandModels = brandCategoryFilter === "all"
    ? HARDWARE_BRAND_MODELS
    : HARDWARE_BRAND_MODELS.filter((m) => m.category === brandCategoryFilter);

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* 1. Banner Principal de Recomendación Inteligente */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
              <span>🏆 {lang === "es" ? "Capa 0: Hardware Físico Recomendado" : "Layer 0: Recommended Physical Hardware"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2 flex-wrap">
              <span>{activeTier.name[lang]}</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {activeTier.categoryBadge[lang]}
              </span>
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {recommendation.rationale[lang]}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                ⚡ {lang === "es" ? "Consumo:" : "Power:"} <strong className="text-slate-200">{activeTier.specs.powerConsumptionWatts}</strong>
              </span>
              <span className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                🌐 {lang === "es" ? "Red:" : "Network:"} <strong className="text-slate-200">{activeTier.specs.network}</strong>
              </span>
              <span className="bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                📦 {lang === "es" ? "Factor:" : "Form Factor:"} <strong className="text-slate-200">{activeTier.specs.formFactor}</strong>
              </span>
            </div>
          </div>

          {/* Tarjeta de Métricas Financieras y ROI */}
          <div className="w-full lg:w-auto shrink-0 bg-slate-950/90 rounded-xl border border-slate-800 p-5 space-y-4 min-w-[280px]">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                {lang === "es" ? "Inversión Única Estimada" : "Estimated Upfront Capex"}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-100">${activeTier.estimatedPriceUSD}</span>
                <span className="text-xs text-slate-400 font-mono">USD</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>{lang === "es" ? "Nube equivalente:" : "Cloud equivalent:"}</span>
                <strong className="text-rose-400">~${activeTier.monthlyCloudEquivalentUSD} USD/mes</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>{lang === "es" ? "Punto de equilibrio:" : "Break-even payback:"}</span>
                <strong className="text-emerald-400">{activeTier.breakEvenMonths} {lang === "es" ? "meses" : "months"}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>{lang === "es" ? "Ahorro Año 1:" : "Year 1 Net Savings:"}</span>
                <strong className="text-cyan-300 font-bold">
                  +${Math.max(0, activeTier.monthlyCloudEquivalentUSD * 12 - activeTier.estimatedPriceUSD).toLocaleString()} USD
                </strong>
              </div>
            </div>

            <a
              href={activeTier.amazonAffiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <span>🛒 {lang === "es" ? "Ver Opciones en Amazon" : "View Options on Amazon"}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Sección Gráfico Radar y Detalle de la Máquina Activa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between">
          <HardwareRadarChart
            selectedTierId={activeTierId}
            onSelectTier={setActiveTierId}
            lang={lang}
          />
        </div>

        {/* Ficha Técnica Detallada de la Máquina Activa */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                {lang === "es" ? "Ficha Técnica de Ingeniería" : "Engineering Spec Sheet"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {activeTier.id}
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px] mb-0.5">CPU & Arquitectura</span>
                <span className="text-slate-100 font-semibold">{activeTier.specs.cpu}</span>
                <span className="text-slate-400 block mt-0.5 text-[11px]">{activeTier.specs.coresThreads}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Memoria RAM</span>
                  <span className="text-slate-100 font-semibold">{activeTier.specs.ram}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Almacenamiento</span>
                  <span className="text-slate-100 font-semibold truncate block">{activeTier.specs.storage}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px] mb-0.5">
                  {lang === "es" ? "Carga de Trabajo Recomendada" : "Ideal Workload"}
                </span>
                <span className="text-slate-300 text-[11px] leading-relaxed block">
                  {activeTier.idealWorkload[lang]}
                </span>
              </div>
            </div>

            {/* Pros y Consideraciones */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <div className="space-y-1">
                {activeTier.pros[lang].map((pro, idx) => (
                  <p key={idx} className="text-xs text-emerald-400 flex items-start gap-1.5">
                    <span className="shrink-0 text-emerald-500">✓</span>
                    <span>{pro}</span>
                  </p>
                ))}
              </div>
              <div className="space-y-1 pt-1">
                {activeTier.cons[lang].map((con, idx) => (
                  <p key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="shrink-0 text-amber-500">⚠</span>
                    <span>{con}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <a
            href={activeTier.amazonAffiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span>🔍 {lang === "es" ? `Buscar "${activeTier.amazonSearchQuery}" en Amazon` : `Search "${activeTier.amazonSearchQuery}" on Amazon`}</span>
          </a>
        </div>
      </div>

      {/* 3. Cuadrícula Comparativa de las 4 Opciones de Hardware */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>🖥️</span>
            <span>{lang === "es" ? "Catálogo de las 4 Alternativas Físicas de Hardware" : "Catalog of 4 Physical Hardware Tiers"}</span>
          </h4>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {lang === "es" ? "Haz clic en una opción para ver su ficha y radar" : "Click any card to inspect radar and specs"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {HARDWARE_CATALOG.map((tier) => {
            const isSelected = tier.id === activeTierId;
            const isBestMatch = tier.id === recommendation.recommendedTier.id;

            return (
              <div
                key={tier.id}
                onClick={() => setActiveTierId(tier.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 relative ${
                  isSelected
                    ? "bg-slate-900 border-cyan-400/80 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-950/30"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                {isBestMatch && (
                  <span className="absolute -top-2.5 right-4 bg-cyan-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
                    {lang === "es" ? "★ Recomendado" : "★ Recommended"}
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {tier.categoryBadge[lang]}
                    </span>
                    <span className="text-sm font-extrabold text-slate-100">
                      ${tier.estimatedPriceUSD} <span className="text-[10px] text-slate-400 font-normal">USD</span>
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-100 line-clamp-1">
                    {tier.name[lang]}
                  </h5>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {tier.tagline[lang]}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
                    <p><strong className="text-slate-400">CPU:</strong> {tier.specs.cpu}</p>
                    <p><strong className="text-slate-400">RAM:</strong> {tier.specs.ram}</p>
                    <p><strong className="text-slate-400">Storage:</strong> {tier.specs.storage}</p>
                    <p><strong className="text-slate-400">Consumo:</strong> {tier.specs.powerConsumptionWatts}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <a
                    href={tier.amazonAffiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>🛒 {lang === "es" ? "Ver en Amazon" : "View on Amazon"}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  <button
                    onClick={() => setActiveTierId(tier.id)}
                    className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-950/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isSelected
                      ? (lang === "es" ? "✓ Activo en Radar" : "✓ Active in Radar")
                      : (lang === "es" ? "Examinar en Radar" : "Inspect in Radar")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Catálogo de Fabricantes y Modelos Insignia (Minisforum, Beelink, Geekom, GMKtec, Apple, NVIDIA, etc.) */}
      <div className="space-y-6 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <span>🏭 {lang === "es" ? "Ecosistema de Fabricantes Recomendados" : "Recommended Hardware Brands"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h4 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>{lang === "es" ? "Modelos Destacados en Amazon para Producción On-Premise" : "Featured Amazon Models for On-Premise Production"}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {lang === "es"
                ? "Selección verificada de Mini PCs (Minisforum, Beelink, Geekom, GMKtec, Bosgame, Bmax), arquitectura Apple Silicon de memoria unificada, estaciones NVIDIA AI y equipos Microsoft con enlaces directos."
                : "Verified lineup of Mini PCs (Minisforum, Beelink, Geekom, GMKtec, Bosgame, Bmax), Apple Silicon unified memory, NVIDIA AI stations, and Microsoft devices with direct search links."}
            </p>
          </div>

          {/* Filtros de Categoría */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setBrandCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                brandCategoryFilter === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lang === "es" ? "Todos (11)" : "All (11)"}
            </button>
            <button
              type="button"
              onClick={() => setBrandCategoryFilter("minipc_x86")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                brandCategoryFilter === "minipc_x86"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Mini PCs x86 (7)
            </button>
            <button
              type="button"
              onClick={() => setBrandCategoryFilter("apple_silicon")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                brandCategoryFilter === "apple_silicon"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Apple Silicon (2)
            </button>
            <button
              type="button"
              onClick={() => setBrandCategoryFilter("nvidia_ai")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                brandCategoryFilter === "nvidia_ai"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              NVIDIA AI (1)
            </button>
            <button
              type="button"
              onClick={() => setBrandCategoryFilter("mobile_workstation")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                brandCategoryFilter === "mobile_workstation"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Microsoft Mobile (1)
            </button>
          </div>
        </div>

        {/* Cuadrícula de Modelos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrandModels.map((item) => {
            const brandBadgeColors: Record<string, string> = {
              Minisforum: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
              Beelink: "border-amber-500/40 bg-amber-500/15 text-amber-300",
              Geekom: "border-purple-500/40 bg-purple-500/15 text-purple-300",
              GMKtec: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300",
              Bosgame: "border-blue-500/40 bg-blue-500/15 text-blue-300",
              Bmax: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
              Apple: "border-slate-400/40 bg-slate-300/15 text-slate-200",
              NVIDIA: "border-lime-500/40 bg-lime-500/15 text-lime-300",
              Microsoft: "border-sky-500/40 bg-sky-500/15 text-sky-300",
            };
            const badgeClass = brandBadgeColors[item.brand] || "border-slate-700 bg-slate-800 text-slate-300";

            return (
              <div
                key={item.id}
                className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
                      {item.brand.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate">
                      {item.badge[lang]}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {item.model}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1">
                      {item.specsSummary}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                    {item.highlights[lang].map((hl, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                        <span className="leading-tight">{hl}</span>
                      </p>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    💡 <strong className="text-slate-300 font-normal">{item.targetWorkload[lang]}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {lang === "es" ? "Rango Aprox." : "Approx Range"}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {item.estimatedPriceUSD} <span className="text-[10px] text-slate-400 font-normal">USD</span>
                    </span>
                  </div>

                  <a
                    href={item.amazonAffiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all shrink-0 cursor-pointer"
                  >
                    <span>🛒</span>
                    <span>{lang === "es" ? "Ver en Amazon" : "View on Amazon"}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Nota Informativa y Aviso de Enlaces de Amazon */}
      <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">ℹ️</span>
          <span>
            {isAffiliateActive
              ? (lang === "es"
                  ? "Aviso de transparencia: Como afiliados de Amazon, podemos percibir ingresos por compras elegibles adscritas, sin costo adicional para ti."
                  : "Transparency notice: As an Amazon Associate, we may earn from qualifying purchases at no additional cost to you.")
              : (lang === "es"
                  ? "Los enlaces de Amazon dirigen directamente a la búsqueda de hardware en tiempo real para verificar precios, disponibilidad y valoraciones."
                  : "Amazon links direct straight to live real-time hardware searches to check current pricing, availability, and customer reviews.")}
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-mono text-slate-400">
          OSS Atlas Architecture Engine v1.0
        </span>
      </div>
    </div>
  );
};
export default HardwareRecommendationSheet;
