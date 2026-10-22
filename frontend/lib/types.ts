/** Tipos de la API Next.js (Route Handlers). El frontend visual usa los
 *  tipos completos de page.tsx; aquí solo los contratos de la API. */

export type CategoryId = "AUTH" | "DBS" | "PAYMENTS" | "AI";
export type LicenseType = "MIT" | "Apache-2.0" | "PostgreSQL" | "BSL-1.1";

export interface CatalogTool {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  license: LicenseType;
  health_score: number;
  stars: number;
  description: string;
  docker_command: string;
  integration_difficulty: "Baja" | "Media" | "Alta";
  triggers: string[];
  dependencies: string[];
}

export interface HybridSearchResult {
  repo_id: string;
  tool_name: string;
  slug?: string;
  category?: CategoryId;
  license: string;
  health_score: number;
  commit_velocity_score?: number;
  security_score?: number;
  docs_score?: number;
  stars?: number;
  description?: string;
  docker_command?: string;
  integration_difficulty?: "Baja" | "Media" | "Alta";
  triggers?: string[];
  dependencies?: string[];
  etag?: string;
  lexical_rank?: number | null;
  vector_rank?: number | null;
  rrf_score: number;
}

export interface RagArchitectureNode {
  layer: string;
  tool_name: string;
  license: string;
  health_score: number;
  rrf_score: number;
  lexical_match?: string;
  vector_cosine?: number;
  rationale: string;
  integration_trigger: string;
}

export interface RagArchitectureResponse {
  prompt: string;
  business_domain?: string;
  executive_summary: string;
  ragas?: {
    contextPrecision: number;
    contextRecall: number;
    faithfulness: number;
    answerRelevance: number;
    latencyMs: number;
  };
  nodes: RagArchitectureNode[];
  sql_hybrid_query: string;
  faithfulness_guard: string;
}
