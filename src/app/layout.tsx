import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patologia · DemoQuest",
  description: "Sistema de gestión para laboratorio de anatomía patológica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
