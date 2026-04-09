import type { Metadata } from "next";
import { Amatic_SC, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

/* =============================================
   FUENTES — next/font/google
   Next.js descarga estas fuentes al hacer build
   y las sirve localmente (no depende de Google
   en runtime). Cada una genera una CSS variable.
   ============================================= */

// Display: fuente script decorativa para títulos (estilo Coraline)
const amaticSC = Amatic_SC({
  variable: "--font-amatic-sc", // → esta variable la usa @theme en globals.css
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap", // Muestra texto inmediatamente con fallback, luego cambia
});

// Body: sans-serif limpia y moderna
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Mono: para etiquetas "Capítulo N"
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/* =============================================
   METADATA — SEO
   Next.js convierte esto en <title>, <meta>,
   y tags Open Graph automáticamente.
   ============================================= */
export const metadata: Metadata = {
  title: "Ragdoll — Estudio de Diseño UX/UI",
  description:
    "Portafolio de Ragdoll, estudio de diseño UX/UI dirigido por Rosaly Lebrón. Diseño centrado en el usuario con alma artesanal.",
  keywords: ["UX", "UI", "diseño", "portafolio", "Ragdoll", "Rosaly Lebrón"],
  openGraph: {
    title: "Ragdoll — Estudio de Diseño UX/UI",
    description: "Diseño centrado en el usuario con alma artesanal.",
    type: "website",
    locale: "es_PR",
  },
};

/* =============================================
   ROOT LAYOUT
   Este componente envuelve TODA la app.
   - lang="es" para SEO en español
   - Las 3 variables de fuente se inyectan en <html>
   - antialiased mejora el rendering de texto
   ============================================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${amaticSC.variable} ${outfit.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
