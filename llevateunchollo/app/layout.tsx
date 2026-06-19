import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LlévateUnChollo - Chollos al Mejor Precio",
  description:
    "Descubre los mejores chollos y ofertas al mejor precio. Productos de calidad con descuentos increíbles.",
  keywords: ["chollos", "ofertas", "descuentos", "comprar barato", "liquidación"],
  openGraph: {
    title: "LlévateUnChollo - Chollos al Mejor Precio",
    description:
      "Descubre los mejores chollos y ofertas al mejor precio.",
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
        </CartProvider>
      </body>
    </html>
  );
}
