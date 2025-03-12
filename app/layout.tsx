import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jesus Manuel Hernandez Zozaya | Senior Software Engineer",
  description:
    "Personal portfolio of Jesus Manuel Hernandez Zozaya, a senior software engineer specialized in JavaScript, TypeScript, React and NodeJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  );
}
