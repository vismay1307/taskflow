import type { Metadata } from "next";

import "./globals.css";

import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "TaskFlow",
  description:
    "Real-time collaborative Kanban board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}