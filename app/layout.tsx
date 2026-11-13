import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-discovery";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "CCNA Lab AI",
      url: siteUrl,
      inLanguage: "pt-BR",
    },
    {
      "@type": "SoftwareApplication",
      name: "CCNA Lab AI",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: siteUrl,
      inLanguage: "pt-BR",
      isAccessibleForFree: true,
      description:
        "Laboratório educacional para praticar conceitos do CCNA 200-301 com topologia visual, CLI Cisco simulada e questões comentadas.",
      featureList: [
        "Laboratórios guiados de configuração Cisco",
        "Topologia de rede interativa",
        "Prática de CLI Cisco simulada",
        "Questões de estudo para CCNA 200-301",
        "Tutor contextual em português",
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CCNA Lab AI | Laboratório interativo CCNA",
  description:
    "Pratique CCNA 200-301 em laboratórios interativos de CLI Cisco, topologias de rede, questões comentadas e tutor contextual em português.",
  applicationName: "CCNA Lab AI",
  keywords: [
    "CCNA",
    "Cisco",
    "laboratório de redes",
    "CLI Cisco",
    "simulador de redes",
    "CCNA 200-301",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/`,
    siteName: "CCNA Lab AI",
    locale: "pt_BR",
    title: "CCNA Lab AI | Laboratório interativo CCNA",
    description:
      "Pratique redes Cisco com laboratórios interativos, topologia visual, CLI simulada e questões para CCNA 200-301.",
  },
  twitter: {
    card: "summary",
    title: "CCNA Lab AI | Laboratório interativo CCNA",
    description:
      "Laboratórios interativos de redes Cisco para praticar os fundamentos do CCNA 200-301.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
