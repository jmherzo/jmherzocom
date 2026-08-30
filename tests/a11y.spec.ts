import { test, expect } from "@playwright/test";
import { runAxe, withTheme } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  for (const [label, viewport] of [
    ["mobile", { width: 393, height: 852 }],
    ["desktop", { width: 1440, height: 900 }],
  ] as const) {
    test(`no axe violations — ${label} ${theme}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await withTheme(page, theme);
      await page.goto("/");
      const { violations } = await runAxe(page);
      expect(
        violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
      ).toEqual([]);
    });
  }
}

test("exactly one h1, and no skipped heading levels", async ({ page }) => {
  await page.goto("/");
  const headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => ({
      level: Number(h.tagName[1]),
      text: h.textContent?.trim().slice(0, 40) ?? "",
    })),
  );
  expect(headings.filter((h) => h.level === 1)).toHaveLength(1);

  const skips = headings.filter(
    (h, i) => i > 0 && h.level > headings[i - 1].level + 1,
  );
  expect(skips, `skipped levels at ${JSON.stringify(skips)}`).toEqual([]);
});

test("skip link is the first stop and moves focus into main", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const link = page.locator(":focus");
  await expect(link).toHaveAttribute("href", "#main");
  // sr-only until focused, so it must be a real target once it is
  const box = await link.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);

  await page.keyboard.press("Enter");
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.id))
    .toBe("main");
});

test("every tab stop is named and shows a focus ring", async ({ page }) => {
  await page.goto("/");
  const problems: string[] = [];

  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        name: (el.getAttribute("aria-label") || el.textContent || "").trim(),
        ring:
          (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
          (cs.boxShadow !== "none" && cs.boxShadow !== ""),
      };
    });
    if (!stop) break;
    if (!stop.name) problems.push(`<${stop.tag}> has no accessible name`);
    if (!stop.ring) problems.push(`<${stop.tag}> "${stop.name}" has no focus ring`);
  }
  expect(problems).toEqual([]);
});

test("landmarks are present and both navs are named", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(1);
  // The mobile <nav aria-label="Site"> is visibility:hidden at this width, so
  // it is correctly absent from the accessibility tree. menu.spec covers it
  // where it is actually exposed.
  await expect(page.getByRole("navigation", { name: "Site" })).toHaveCount(0);
  expect(await page.locator("nav").count()).toBe(2);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("en");
});

test("respects prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const behavior = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );
  expect(behavior).toBe("auto");
});
