# Recrear la estructura en D:\MuseWorkspace (ver archivo hermano en la entrega).
# Uso: clic derecho → Ejecutar con PowerShell, o:
#   powershell -ExecutionPolicy Bypass -File .\Crear-Estructura.ps1
$ErrorActionPreference = "Stop"
$destino = "D:\MuseWorkspace\acelerador-integraciones-open-source"
New-Item -ItemType Directory -Force -Path $destino | Out-Null
Write-Host "Destino: $destino"
Write-Host "Copia aquí el contenido del ZIP del proyecto (esta carpeta ya incluye el árbol completo)."
