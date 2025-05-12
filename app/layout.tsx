import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import TailwindIndicator from "@/components/tailwind-indicator";
import Icons from "@/components/icons";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const noto_sans_jp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [],
  authors: [
    {
      name: "Yushin Ito",
      url: siteConfig.url,
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};
interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans",
          `${inter.variable} ${noto_sans_jp.variable} antialiased`
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
        <Toaster
          icons={{
            success: <Icons.checkCircle className="size-5 text-primary" />,
            error: <Icons.alertCircle className="size-5 text-destructive" />,
          }}
        />
        <Analytics />
        <SpeedInsights />
        <TailwindIndicator />
      </body>
    </html>
  );
};

export default RootLayout;
