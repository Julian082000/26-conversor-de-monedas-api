import React from "react";

export const metadata = {
  title: "API REST — Conversor de Monedas Offline-First",
  description: "Backend serverless en Next.js + TypeScript con Firebase y Cloud Firestore",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}