"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import {
  HARDWARE_CATALOG,
  getRadarComparisonData,
  HardwareTier,
} from "../lib/hardwareCatalog";

interface HardwareRadarChartProps {
  selectedTierId?: string;
  onSelectTier?: (tierId: string) => void;
  lang?: "es" | "en";
}

const TIER_COLORS: Record<string, { fill: string; stroke: string; label: { es: string; en: string } }> = {
  homelab_minipc: {
    fill: "rgba(16, 185, 129, 0.25)",
    stroke: "#10b981",
    label: { es: "N1: Mini PC Homelab", en: "T1: Mini PC Homelab" },
  },
  sme_tower: {
    fill: "rgba(6, 182, 212, 0.25)",
    stroke: "#06b6d4",
    label: { es: "N2: Torre Servidor PYME", en: "T2: SME Server Tower" },
  },
  enterprise_rack: {
    fill: "rgba(139, 92, 246, 0.25)",
    stroke: "#8b5cf6",
    label: { es: "N3: Servidor Rack Enterprise", en: "T3: Enterprise Rack Server" },
  },
  ai_workstation: {
    fill: "rgba(245, 158, 11, 0.25)",
    stroke: "#f59e0b",
    label: { es: "N4: AI Workstation (GPU)", en: "T4: AI Workstation (GPU)" },
  },
};

export const HardwareRadarChart: React.FC<HardwareRadarChartProps> = ({
  selectedTierId = "ai_workstation",
  onSelectTier,
  lang = "es",
}) => {
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<"focused" | "compare">("focused");
  const [activeTierId, setActiveTierId] = useState<string>(selectedTierId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedTierId) {
      setActiveTierId(selectedTierId);
    }
  }, [selectedTierId]);

  const radarData = getRadarComparisonData(lang);
  const currentTier = HARDWARE_CATALOG.find((t) => t.id === activeTierId) || HARDWARE_CATALOG[0];

  const handleTierChange = (id: string) => {
    setActiveTierId(id);
    if (onSelectTier) {
      onSelectTier(id);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-80 sm:h-96 flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
          <span>{lang === "es" ? "Cargando Diagrama Radar de Rendimiento..." : "Loading Performance Radar Chart..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800/80 p-4 sm:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
      {/* Cabecera del Gráfico con Controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🕸️</span>
            <h4 className="text-base sm:text-lg font-bold text-slate-100">
              {lang === "es" ? "Diagrama Radar de Rendimiento Físico" : "Physical Hardware Radar Diagram"}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "es"
              ? "Comparativa dimensional de cómputo, memoria ECC, IOPS NVMe, red y retorno de inversión."
              : "Dimensional balance across compute, ECC RAM, NVMe IOPS, networking, and ROI."}
          </p>
        </div>

        {/* Selector de Modo: Enfocado vs Comparativa */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-full border border-slate-700/60 text-xs">
          <button
            onClick={() => setViewMode("focused")}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              viewMode === "focused"
                ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {lang === "es" ? "🎯 Enfocado" : "🎯 Focused"}
          </button>
          <button
            onClick={() => setViewMode("compare")}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              viewMode === "compare"
                ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {lang === "es" ? "📊 Comparar 4" : "📊 Compare 4"}
          </button>
        </div>
      </div>

      {/* Selector de Nivel Rápido (Chips en modo enfocado) */}
      {viewMode === "focused" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {HARDWARE_CATALOG.map((tier) => {
            const isSelected = tier.id === activeTierId;
            const color = TIER_COLORS[tier.id];
            return (
              <button
                key={tier.id}
                onClick={() => handleTierChange(tier.id)}
                className={`p-2 rounded-xl text-left transition-all border text-xs flex flex-col gap-0.5 ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/30"
                    : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/50 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color.stroke }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    ${tier.estimatedPriceUSD}
                  </span>
                </div>
                <span className={`font-semibold truncate ${isSelected ? "text-slate-100" : "text-slate-300"}`}>
                  {tier.categoryBadge[lang]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Contenedor del Gráfico SVG Recharts */}
      <div className="w-full h-72 sm:h-84 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#475569"
              tick={{ fill: "#64748b", fontSize: 10 }}
            />

            {/* Si es modo enfocado, solo mostramos el tier activo */}
            {viewMode === "focused" ? (
              <Radar
                name={TIER_COLORS[activeTierId]?.label[lang] || currentTier.name[lang]}
                dataKey={activeTierId}
                stroke={TIER_COLORS[activeTierId]?.stroke || "#06b6d4"}
                fill={TIER_COLORS[activeTierId]?.fill || "rgba(6, 182, 212, 0.3)"}
                fillOpacity={0.6}
                strokeWidth={2.5}
                dot={{ r: 4, fill: TIER_COLORS[activeTierId]?.stroke || "#06b6d4" }}
              />
            ) : (
              // Si es modo comparar, superponemos las 4 opciones
              HARDWARE_CATALOG.map((tier) => {
                const color = TIER_COLORS[tier.id];
                return (
                  <Radar
                    key={tier.id}
                    name={color.label[lang]}
                    dataKey={tier.id}
                    stroke={color.stroke}
                    fill={color.fill}
                    fillOpacity={0.25}
                    strokeWidth={1.8}
                    dot={{ r: 3, fill: color.stroke }}
                  />
                );
              })
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: "#090d16",
                borderColor: "#334155",
                borderRadius: "0.75rem",
                color: "#e2e8f0",
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: "#38bdf8", padding: "2px 0" }}
              formatter={(value: any, name: any) => [`${value} / 100 pts`, name]}
            />
            {viewMode === "compare" && (
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "11px",
                }}
                formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Desglose de Puntuaciones Cardinales del Nivel Seleccionado */}
      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-5 gap-1.5 text-center">
        <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono">{lang === "es" ? "Cómputo" : "Compute"}</p>
          <p className="text-sm font-bold text-slate-100">{currentTier.radarScores.compute}<span className="text-[10px] text-slate-400">/100</span></p>
        </div>
        <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono">{lang === "es" ? "Memoria" : "RAM"}</p>
          <p className="text-sm font-bold text-slate-100">{currentTier.radarScores.ram}<span className="text-[10px] text-slate-400">/100</span></p>
        </div>
        <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono">{lang === "es" ? "NVMe IOPS" : "NVMe IOPS"}</p>
          <p className="text-sm font-bold text-slate-100">{currentTier.radarScores.storageIOPS}<span className="text-[10px] text-slate-400">/100</span></p>
        </div>
        <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono">{lang === "es" ? "Red" : "Network"}</p>
          <p className="text-sm font-bold text-slate-100">{currentTier.radarScores.network}<span className="text-[10px] text-slate-400">/100</span></p>
        </div>
        <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono">{lang === "es" ? "ROI / Costo" : "Cost ROI"}</p>
          <p className="text-sm font-bold text-emerald-400">{currentTier.radarScores.costEfficiency}<span className="text-[10px] text-slate-400">/100</span></p>
        </div>
      </div>
    </div>
  );
};
export default HardwareRadarChart;
