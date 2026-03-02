import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "./contexts/auth-context";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}