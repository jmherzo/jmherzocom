import { existsSync, readFileSync } from "node:fs";
import axe from "axe-core";
import type { Page } from "@playwright/test";

/** Viewports the layout must survive, smallest phone to widest desktop. */
export const VIEWPORTS = [
  { name: "iPhone SE", width: 320, height: 568, isMobile: true },
  { name: "iPhone 12 mini", width: 375, height: 812, isMobile: true },
  { name: "iPhone 14 Pro", width: 393, height: 852, isMobile: true },
  { name: "Pixel 7", width: 412, height: 915, isMobile: true },
  { name: "iPad mini", width: 768, height: 1024, isMobile: true },
  { name: "iPad Pro", width: 1024, height: 1366, isMobile: true },
  { name: "Laptop", width: 1280, height: 800, isMobile: false },
  { name: "Desktop", width: 1440, height: 900, isMobile: false },
  { name: "Wide", width: 1920, height: 1080, isMobile: false },
] as const;

/** WCAG 2.1 A/AA plus axe's best-practice rules. */
export async function runAxe(page: Page) {
  // axe.source is the whole library as a string, meant for injection
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () =>
    // @ts-expect-error axe is injected at runtime
    (await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
      },
    })) as { violations: { id: string; help: string; nodes: unknown[] }[] },
  );
}

/** Applies a theme before the page's own scripts run. */
export async function withTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
}

/**
 * `next start` has no /_vercel/insights route, so Vercel Analytics 404s and
 * nosniff correctly refuses the HTML error page. Only happens off Vercel.
 */
export const IGNORED_CONSOLE = [
  /_vercel\/insights/,
  /Failed to load resource.*404/,
];

/** Alpha channel of an rgb()/rgba() string; opaque colours return 1. */
export function alphaOf(color: string) {
  const parts = color.match(/[\d.]+/g);
  if (!parts) return 1;
  return parts.length === 4 ? parseFloat(parts[3]) : 1;
}

/**
 * CV-only values read from the gitignored data/resume.private.json, so the
 * leak test can assert on them without the repo ever containing them. Returns
 * {} where the file is absent (CI, a fresh clone), and the structural
 * assertions still apply.
 */
export function privateValues(): Record<string, string> {
  const path = "data/resume.private.json";
  if (!existsSync(path)) return {};
  const raw = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of ["phoneCv", "emailCv", "cvSource"]) {
    const v = raw[key];
    if (typeof v === "string" && v.length > 4) out[key] = v;
  }
  return out;
}
