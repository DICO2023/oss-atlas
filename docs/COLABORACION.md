# Colaboración en GitHub — cómo trabaja el equipo

## Roles en GitHub

| Rol en GitHub | Quién | Puede |
|---|---|---|
| Owner | Quien crea el repo (tú) | Todo, incluida configuración y borrado |
| Collaborator — Write | Los 8 compañeros | Clonar, crear ramas, abrir PR, comentar |
| (No usar) Admin para todos | Nadie más | Evita cambios accidentales en protección de `main` |

Invita en: **Settings → Collaborators → Add people** (por @usuario o correo),
rol **Write**. Las invitaciones por correo funcionan aunque la persona no
tenga aún cuenta asociada a ese correo.

## Ramas

- `main`: siempre desplegable y verde (CI en verde). **Nadie sube directo.**
- Ramas de trabajo (una por paquete de la WBS):
  - `feat/frontend-catalogo` · `feat/pipeline-ingesta` · `feat/busqueda-hibrida`
  - `feat/rag-arquitecto` · `feat/db-pgvector` · `feat/evaluacion-ragas`
  - `design/figma-sistema` · `docs/pmo` · `docs/entregables`
- Nombra tu rama: `<tipo>/<paquete>-<breve-descripción>`.

## Flujo de cada colaborador (diario)

```bash
git checkout main && git pull --rebase   # parte siempre de lo último
git checkout -b feat/<mi-paquete>-<tarea>
# ... trabaja y haz commits pequeños con mensajes claros ...
git push -u origin feat/<mi-paquete>-<tarea>
# Abre el Pull Request en GitHub y completa la plantilla
```

1. Abre el PR contra `main` con la plantilla (qué cambia, evidencia,
   alcance que cambió, bloqueos, próxima acción, decisiones retenidas).
2. CODEOWNERS pide revisión automática al Accountable de esa carpeta.
3. El Accountable aprueba **y** el CI debe estar en verde.
4. Quien abrió el PR hace **Squash and merge** y borra la rama.
5. Si tu rama quedó atrás: `git pull --rebase origin main` y resuelve
   conflictos localmente antes de pedir revisión de nuevo.

## Protección de `main` (activar en Settings → Branches)

- Regla sobre `main`: exigir Pull Request antes de fusionar.
- Exigir **1 aprobación** (del Accountable del área, vía CODEOWNERS).
- Exigir que los checks de estado (CI) estén en verde.
- No permitir push directo ni forzar push sobre `main`.
- A partir del **Code Freeze (9 nov)**: solo PR de `docs/` y `video-demo/`.

## Tablero y seguimiento

- **Issues**: uno por paquete WBS, asignado al Responsable (R), con el
  Accountable (A) como revisor y el hito correspondiente.
- **Milestones**: Hito 1 (18 oct), Hito 2 (27 oct), Hito 3 (4 nov),
  Hito 4 — Code Freeze (9 nov), Entrega (13 nov).
- **Project**: tablero Kanban (Por hacer / En curso / En revisión / Hecho).

## Reglas que no se negocian

- Nunca subir secretos (`.env`, `.env.local`, tokens, claves). Si se filtra
  un token, revocarlo en GitHub/Anthropic de inmediato y avisar al equipo.
- Nunca hacer `git push --force` sobre `main` ni sobre la rama de otro.
- Cada PR incluye evidencia (captura, log o enlace) — igual que el
  Traspaso de Bloque del protocolo asíncrono.
