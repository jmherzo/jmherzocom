import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { basics, work, education, skills } from "@/data/resume";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(basics.url),
  title: `${basics.name} | ${basics.label}`,
  description: basics.summaryCv,
  alternates: {
    canonical: "/",
    types: { "application/json": "/resume.json" },
  },
  openGraph: {
    title: `${basics.name} | ${basics.label}`,
    description: basics.headline,
    url: basics.url,
    siteName: basics.name,
    type: "profile",
  },
};

/** Structured data so agents and crawlers read the resume correctly. */
function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: basics.name,
    jobTitle: basics.label,
    description: basics.summaryCv,
    email: `mailto:${basics.email}`,
    url: basics.url,
    sameAs: basics.profiles.map((p) => p.url),
    knowsLanguage: ["en", "es"],
    knowsAbout: skills.flatMap((s) => s.items),
    alumniOf: education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.institution,
    })),
    hasOccupation: work.map((job) => ({
      "@type": "Occupation",
      name: job.position,
      occupationLocation: { "@type": "Organization", name: job.company },
    })),
    worksFor: work
      .filter((j) => !j.endDate)
      .map((j) => ({ "@type": "Organization", name: j.company })),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Applies the saved theme before first paint. Without this the document
          renders light, then React corrects it after hydration - a white flash
          for anyone who chose dark. Runs blocking and inline on purpose.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          // JSON.stringify does not escape "<", so a "</script>" appearing in
          // resume.json would close this tag early. The data is author-owned,
          // not user input, but escaping keeps the sink safe by construction.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
