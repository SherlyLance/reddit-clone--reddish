import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/header/Header";
import "@/app/globals.css";

export default function TestThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}