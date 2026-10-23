# Guía de Integración Técnica B2B: Meetily AI Meeting Assistant

> **OSS Atlas Architecture Intelligence**  
> **Titularidad & Autoría:** EdisonPEÑA (Iotdico — https://ossatlas.iotdico.com)  
> **Fecha de Emisión:** 23 de Octubre de 2026 | **Licencia:** MIT | **Categoría:** AI

---

## 1. Métricas Cardinales & Telemetría

| Métrica | Valor Evaluado | Dictamen B2B |
| :--- | :--- | :--- |
| **Health Score** | `95.45 / 100` | Ponderado (Commits 15%, Seguridad 20%, Docs 65%) |
| **Dificultad de Integración** | `Baja` | Basada en dependencias de runtime |
| **Telemetría de Ahorro** | `$14 USD / mes vs Granola` | Frente a alternativas propietarias |
| **GitHub Stars** | `9.2k` | Adopción global verificada |

---

## 2. Descripción Técnica & Requisitos

Asistente de reuniones IA local y privado. Graba, transcribe con Whisper local y genera minutas ejecutivas estructuradas sin enviar audio a nubes externas.

### Dependencias del Sistema
- `Node.js 20+ / Docker`
- `Whisper.cpp / ffmpeg`
- `CUDA opcional`

### Disparadores de Integración (Triggers)
- ⚡ `Meeting Audio Stream`
- ⚡ `Whisper Transcription Hook`
- ⚡ `Markdown Minute Export`

---

## 3. Paso a Paso para Windows (PowerShell & WSL2)

### 3.1. Validación de WSL2 y Docker Desktop
```powershell
# Comprobar estado de WSL2
wsl --status
wsl --update

# Verificar daemon de Docker
docker version
```

### 3.2. Persistencia de Volúmenes y Variables de Sesión
```powershell
# Crear directorio de datos persistente
$env:DATA_PATH = "$HOME\oss-atlas-data\meetily_meetily"
New-Item -ItemType Directory -Force -Path $env:DATA_PATH

# Configurar puerto y ambiente
$env:PORT = "3010"
$env:NODE_ENV = "production"
```

### 3.3. Despliegue del Contenedor
```powershell
docker run -d --name meetily-core -p 3010:3000 -v meetily_vault:/app/vault meetily/meetily:latest --restart unless-stopped
```

### 3.4. Healthcheck de Endpoints
```powershell
# Verificar logs iniciales
docker logs --tail 30 (docker ps -lq)

# Probar endpoint HTTP
Invoke-RestMethod -Uri "http://localhost:3010" -Method GET -ErrorAction SilentlyContinue
```

---

## 4. Paso a Paso para macOS (Homebrew, Colima & Apple Silicon)

### 4.1. Aprovisionamiento con Colima
```bash
# Instalar Colima y Docker CLI con Homebrew
brew install colima docker

# Iniciar máquina virtual optimizada
colima start --cpu 4 --memory 4 --disk 40
```

### 4.2. Persistencia y Variables en Zsh
```bash
# Crear directorio local
mkdir -p "$HOME/oss-atlas-data/meetily_meetily"
export DATA_DIR="$HOME/oss-atlas-data/meetily_meetily"
export PORT="3010"
```

### 4.3. Despliegue Multi-Arquitectura ARM64
```bash
docker run -d --name meetily-core -p 3010:3000 -v meetily_vault:/app/vault meetily/meetily:latest --restart unless-stopped
```

### 4.4. Healthcheck con curl
```bash
# Probar respuesta de servicio
curl -I -s "http://localhost:3010" | head -n 5
```

---

## 5. Lista de Verificación de Seguridad en Producción

1. **Aislamiento de Red:** Crea redes puente dedicadas (`docker network create oss-net`) para evitar exponer puertos al host sin control.
2. **Gestión de Secretos:** Inyecta contraseñas mediante archivos `.env` protegidos con permisos `chmod 600`.
3. **Respaldos Automatizados:** Programa snapshots diarios de los volúmenes montados hacia almacenamiento cloud cifrado.
4. **Auditoría CVE:** Monitorea avisos de vulnerabilidad suscritos desde el catálogo activo de OSS Atlas.

---

*Guía generada dinámicamente por OSS Atlas (https://ossatlas.iotdico.com) — EdisonPEÑA (Iotdico)*
