import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers/Providers";
import { ServiceWorkerCleaner } from "@/components/ServiceWorkerCleaner";

import { PageLoader } from "@/components/PageLoader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";

// Premium typography: Inter (Apple-style) + Manrope
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  // Primary Meta Tags
  title: {
    default: "Odyssée | Self-Repaying Loans on Mantle Network",
    template: "%s | Odyssée RWA",
  },
  description: "Unlock liquidity from your mETH and fBTC without selling. Odyssée automatically harvests yield from your collateral and pays off your loan. DeFi lending reimagined on Mantle Network.",
  keywords: [
    "DeFi lending",
    "self-repaying loans",
    "Mantle Network",
    "mETH",
    "fBTC",
    "yield-bearing assets",
    "crypto loans",
    "RWA credit line",
    "auto-repaying debt",
    "liquidity without liquidation",
    "Odyssée protocol",
    "decentralized finance",
    "stablecoin borrowing",
    "USDC loans",
    "crypto-backed credit",
  ],
  authors: [{ name: "Odyssée Protocol" }],
  creator: "Odyssée Protocol",
  publisher: "Odyssée Protocol",

  // Favicon & Icons
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  // Open Graph (Facebook, LinkedIn, Discord)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://odyssee.finance",
    siteName: "Odyssée Protocol",
    title: "Odyssée | Self-Repaying Loans on Mantle Network",
    description: "Unlock liquidity from your mETH and fBTC without selling. Yield from your collateral automatically pays off your loan. DeFi lending reimagined.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Odyssée - Self-Repaying Credit Lines",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@OdysseeProtocol",
    creator: "@OdysseeProtocol",
    title: "Odyssée | Self-Repaying Loans on Mantle",
    description: "Your collateral works for you. mETH & fBTC yield automatically repays your loan. No manual payments. No selling.",
    images: ["/og-image.png"],
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (Add your IDs when ready)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // Additional Meta
  category: "DeFi",
  classification: "Finance",

  // Alternate Languages (if applicable)
  alternates: {
    canonical: "https://odyssee.finance",
  },

  // Application Info
  applicationName: "Odyssée Protocol",
  referrer: "origin-when-cross-origin",

  // Theme
  metadataBase: new URL("https://odyssee.finance"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(manrope.variable, inter.variable, "min-h-screen bg-background font-sans antialiased")}>
        <Providers>
          <ScrollToTop />
          <SmoothScroll />
          <PageLoader />
          <ServiceWorkerCleaner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
