import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  title: {
    template: "%s — Muji Alunika",
    default: "Muji Alunika",
  },
  description: "Muji Alunika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
