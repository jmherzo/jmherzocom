import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jesus Manuel Hernandez Zozaya | Senior Software Engineer & Tech Lead",
  description:
    "Senior Full Stack Engineer with 7+ years building high-scale consumer products. Specializing in React, TypeScript, GraphQL, and distributed frontend architecture.",
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
