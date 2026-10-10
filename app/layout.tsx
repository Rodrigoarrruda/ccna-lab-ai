import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCNA Lab AI",
  description: "Laboratórios guiados de CLI Cisco, correção e progresso para estudos CCNA.",
  other: {
    "codex-preview": "development",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
