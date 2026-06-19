import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.llevateunchollo.es"),
  title: {
    default: "LlévateUnChollo - Chollos al Mejor Precio",
    template: "%s | LlévateUnChollo",
  },
  description:
    "Descubre los mejores chollos y ofertas al mejor precio. Productos de calidad con descuentos increíbles.",
  keywords: ["chollos", "ofertas", "descuentos", "comprar barato", "liquidación", "oportunidades"],
  alternates: {
    canonical: "https://www.llevateunchollo.es",
  },
  openGraph: {
    title: "LlévateUnChollo - Chollos al Mejor Precio",
    description:
      "Descubre los mejores chollos y ofertas al mejor precio.",
    url: "https://www.llevateunchollo.es",
    siteName: "LlévateUnChollo",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#FAFAFA]">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
