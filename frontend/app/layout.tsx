import React from "react";
import "./globals.css";

export const metadata = {
  title: "OSS Atlas | B2B Architecture",
  description: "Plataforma de inteligencia y arquitectura B2B Open Source por EdisonPEÑA (Iotdico).",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
