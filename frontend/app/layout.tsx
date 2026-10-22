import React from "react";
import "./globals.css";

export const metadata = { title: "Acelerador de Integraciones Open Source", description: "Catálogo inteligente + Arquitecto RAG de integraciones open-source para B2B." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
