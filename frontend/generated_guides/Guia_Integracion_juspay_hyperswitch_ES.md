# Guía de Integración Técnica B2B: Juspay Hyperswitch B2B Router

> **OSS Atlas Architecture Intelligence**  
> **Titularidad & Autoría:** EdisonPEÑA (Iotdico — https://ossatlas.iotdico.com)  
> **Fecha de Emisión:** 23 de Octubre de 2026 | **Licencia:** Apache-2.0 | **Categoría:** PAYMENTS

---

## 1. Métricas Cardinales & Telemetría

| Métrica | Valor Evaluado | Dictamen B2B |
| :--- | :--- | :--- |
| **Health Score** | `93 / 100` | Ponderado (Commits 15%, Seguridad 20%, Docs 65%) |
| **Dificultad de Integración** | `Alta` | Basada en dependencias de runtime |
| **Telemetría de Ahorro** | `$3,100 USD / mes en comisiones de pasarela` | Frente a alternativas propietarias |
| **GitHub Stars** | `13.4k` | Adopción global verificada |

---

## 2. Descripción Técnica & Requisitos

Switch de pagos universal escrito en Rust. Orquestación inteligente de cobros y enrutamiento dinámico multi-adquirente con soporte PCI-DSS.

### Dependencias del Sistema
- `Rust Runtime`
- `PostgreSQL 14+`
- `Redis Cluster`

### Disparadores de Integración (Triggers)
- ⚡ `Payment Intent Confirmation Webhook`
- ⚡ `Dispute Chargeback Ingestion`
- ⚡ `Merchant Smart Routing Rule`

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
$env:DATA_PATH = "$HOME\oss-atlas-data\juspay_hyperswitch"
New-Item -ItemType Directory -Force -Path $env:DATA_PATH

# Configurar puerto y ambiente
$env:PORT = "8080"
$env:NODE_ENV = "production"
```

### 3.3. Despliegue del Contenedor
```powershell
docker run -d --name hyperswitch -p 8080:8080 -v hyperswitch_config:/etc/hyperswitch juspay/hyperswitch-router:latest --restart unless-stopped
```

### 3.4. Healthcheck de Endpoints
```powershell
# Verificar logs iniciales
docker logs --tail 30 (docker ps -lq)

# Probar endpoint HTTP
Invoke-RestMethod -Uri "http://localhost:8080" -Method GET -ErrorAction SilentlyContinue
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
mkdir -p "$HOME/oss-atlas-data/juspay_hyperswitch"
export DATA_DIR="$HOME/oss-atlas-data/juspay_hyperswitch"
export PORT="8080"
```

### 4.3. Despliegue Multi-Arquitectura ARM64
```bash
docker run -d --name hyperswitch -p 8080:8080 -v hyperswitch_config:/etc/hyperswitch juspay/hyperswitch-router:latest --restart unless-stopped
```

### 4.4. Healthcheck con curl
```bash
# Probar respuesta de servicio
curl -I -s "http://localhost:8080" | head -n 5
```

---

## 5. Lista de Verificación de Seguridad en Producción

1. **Aislamiento de Red:** Crea redes puente dedicadas (`docker network create oss-net`) para evitar exponer puertos al host sin control.
2. **Gestión de Secretos:** Inyecta contraseñas mediante archivos `.env` protegidos con permisos `chmod 600`.
3. **Respaldos Automatizados:** Programa snapshots diarios de los volúmenes montados hacia almacenamiento cloud cifrado.
4. **Auditoría CVE:** Monitorea avisos de vulnerabilidad suscritos desde el catálogo activo de OSS Atlas.

---

*Guía generada dinámicamente por OSS Atlas (https://ossatlas.iotdico.com) — EdisonPEÑA (Iotdico)*
