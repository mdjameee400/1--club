import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/lib/site";
import { PackProvider } from "@/components/PackProvider";
import SmoothScroll from "@/components/SmoothScroll";
import RevealController from "@/components/RevealController";
import OrderDrawer from "@/components/OrderDrawer";
import MobileDock from "@/components/MobileDock";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "The 1% Club — Naturally refreshing. Naturally nourishing.",
    template: "%s · The 1% Club",
  },
  description: site.description,
  openGraph: {
    title: "The 1% Club",
    description: site.description,
    type: "website",
    siteName: "The 1% Club",
  },
  twitter: { card: "summary_large_image", title: "The 1% Club", description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#F9F6F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream font-sans text-ink antialiased">
        <noscript>
          <style>{`[data-reveal],[data-word]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <PackProvider>
          {children}
          <MobileDock />
          <OrderDrawer />
        </PackProvider>
        <SmoothScroll />
        <RevealController />
      </body>
    </html>
  );
}
