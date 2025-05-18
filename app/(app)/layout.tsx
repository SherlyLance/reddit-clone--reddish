import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header/Header";
import { SanityLive } from "@/sanity/lib/live";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddish",
  description: "Reddish",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }
                } catch (_) {}
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col h-svh`}
          suppressHydrationWarning
        >
          <ThemeProvider>
            <SidebarProvider>
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <AppSidebar className="dark:bg-gray-900" />
                <SidebarInset className="flex-1 overflow-y-auto px-4 pb-4 pt-0 md:px-6 md:pb-6 md:pt-0">
                  <div className="flex flex-col">{children}</div>
                </SidebarInset>
              </div>
            </SidebarProvider>

            <SanityLive />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
