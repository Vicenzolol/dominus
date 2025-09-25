import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Merriweather } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import Banner from './components/Banner';

const cinzel = Cinzel({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: "Dominus - Jogo de Estratégia em Tabuleiro",
  description: "Jogo de estratégia medieval com unidades como Guerreiros, Arqueiros, Cavaleiros e Espiões. Gerador de terrenos para batalhas táticas em tabuleiro 26x26.",
  keywords: ["jogo de tabuleiro", "estratégia", "medieval", "guerreiros", "arqueiros", "cavaleiros", "espiões", "batalha", "tático", "Dominus"],
  authors: [{ name: "Brener" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Dominus - Jogo de Estratégia em Tabuleiro",
    description: "Jogo de estratégia medieval com unidades táticas e gerador de terrenos para batalhas épicas.",
    images: ["/imagens/logo-do-jogo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dominus - Jogo de Estratégia em Tabuleiro",
    description: "Jogo de estratégia medieval com unidades táticas e gerador de terrenos para batalhas épicas.",
    images: ["/imagens/logo-do-jogo.jpg"],
  },
  icons: {
    apple: "/imagens/favicon/apple-touch-icon.png",
    icon: [
      { url: "/imagens/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/imagens/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/imagens/favicon/favicon.ico",
  },
  manifest: "/imagens/favicon/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#D1A75C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${cinzel.variable} ${cormorant.variable} ${merriweather.variable} antialiased`}>
        <div className="container">
          <Navbar />
          <Banner />
          {children}
          <footer>
            <p>🎯 Sistema desenvolvido para Brener</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
