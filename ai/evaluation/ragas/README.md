# Evaluación RAGAS (Fase 4)

Métricas: Context Precision, Context Recall, Faithfulness, Answer Relevance.
- `datasets/` → preguntas B2B + respuestas de referencia + contextos esperados
- `reports/` → informes de cada corrida (fecha, umbrales, hallazgos, acciones)

Regla de ajuste: alta fidelidad + bajo recall → ajustar pgvector / RRF.
Recuperación perfecta + baja fidelidad → endurecer limitadores del prompt.
