# Guía de Integración Técnica B2B: Upscayl AI Image Super-Resolution

> **OSS Atlas Architecture Intelligence**  
> **Titularidad & Autoría:** EdisonPEÑA (Iotdico — https://ossatlas.iotdico.com)  
> **Fecha de Emisión:** 23 de Octubre de 2026 | **Licencia:** AGPL-3.0 | **Categoría:** AI

---

## 1. Métricas Cardinales & Telemetría

| Métrica | Valor Evaluado | Dictamen B2B |
| :--- | :--- | :--- |
| **Health Score** | `96.95 / 100` | Ponderado (Commits 15%, Seguridad 20%, Docs 65%) |
| **Dificultad de Integración** | `Baja` | Basada en dependencias de runtime |
| **Telemetría de Ahorro** | `$10 USD / mes vs Topaz Gigapixel` | Frente a alternativas propietarias |
| **GitHub Stars** | `32.5k` | Adopción global verificada |

---

## 2. Descripción Técnica & Requisitos

Escalador y mejorador de resolución de imágenes 4x/8x por IA mediante modelos Real-ESRGAN locales acelerados por GPU.

### Dependencias del Sistema
- `Vulkan SDK / GPU Driver`
- `Docker Engine`

### Disparadores de Integración (Triggers)
- ⚡ `Batch Image Upscaling Task`
- ⚡ `Vulkan/CUDA Tensor Acceleration`
- ⚡ `Sharpening Filter Hook`

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
$env:DATA_PATH = "$HOME\oss-atlas-data\upscayl_upscayl"
New-Item -ItemType Directory -Force -Path $env:DATA_PATH

# Configurar puerto y ambiente
$env:PORT = "8088"
$env:NODE_ENV = "production"
```

### 3.3. Despliegue del Contenedor
```powershell
docker run -d --name upscayl-core -p 8088:8080 -v upscayl_output:/data/output upscayl/upscayl-cli:latest --restart unless-stopped
```

### 3.4. Healthcheck de Endpoints
```powershell
# Verificar logs iniciales
docker logs --tail 30 (docker ps -lq)

# Probar endpoint HTTP
Invoke-RestMethod -Uri "http://localhost:8088" -Method GET -ErrorAction SilentlyContinue
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
mkdir -p "$HOME/oss-atlas-data/upscayl_upscayl"
export DATA_DIR="$HOME/oss-atlas-data/upscayl_upscayl"
export PORT="8088"
```

### 4.3. Despliegue Multi-Arquitectura ARM64
```bash
docker run -d --name upscayl-core -p 8088:8080 -v upscayl_output:/data/output upscayl/upscayl-cli:latest --restart unless-stopped
```

### 4.4. Healthcheck con curl
```bash
# Probar respuesta de servicio
curl -I -s "http://localhost:8088" | head -n 5
```

---

## 5. Lista de Verificación de Seguridad en Producción

1. **Aislamiento de Red:** Crea redes puente dedicadas (`docker network create oss-net`) para evitar exponer puertos al host sin control.
2. **Gestión de Secretos:** Inyecta contraseñas mediante archivos `.env` protegidos con permisos `chmod 600`.
3. **Respaldos Automatizados:** Programa snapshots diarios de los volúmenes montados hacia almacenamiento cloud cifrado.
4. **Auditoría CVE:** Monitorea avisos de vulnerabilidad suscritos desde el catálogo activo de OSS Atlas.

---

*Guía generada dinámicamente por OSS Atlas (https://ossatlas.iotdico.com) — EdisonPEÑA (Iotdico)*
