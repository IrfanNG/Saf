import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { BottomNav } from "@/components/bottom-nav";
import { PageTransition } from "@/components/page-transition";
import { AuthProvider } from "@/context/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saf",
  description: "Your daily companion for Ramadhan and beyond.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Saf",
  },
};

export const viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#F5F2EA] text-[#4A352D] relative selection:bg-emerald-500/30 font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="mx-auto max-w-md min-h-screen relative overflow-x-clip pb-24 touch-pan-y shadow-2xl bg-[#F5F2EA]">
              <AuthGuard>
                <PageTransition>
                  {children}
                </PageTransition>
                <BottomNav />
              </AuthGuard>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
