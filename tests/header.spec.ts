import { test, expect } from "@playwright/test";
import { alphaOf, withTheme } from "./helpers";

const bgOf = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => getComputedStyle(document.querySelector("header")!).backgroundColor,
  );
const blurOf = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => getComputedStyle(document.querySelector("header")!).backdropFilter,
  );

for (const theme of ["light", "dark"] as const) {
  test(`header is transparent at the top — ${theme}`, async ({ page }) => {
    await withTheme(page, theme);
    await page.goto("/");
    expect(alphaOf(await bgOf(page))).toBeLessThan(0.05);
    expect(["none", "blur(0px)"]).toContain(await blurOf(page));
  });

  test(`header dims in after scrolling — ${theme}`, async ({ page }) => {
    await withTheme(page, theme);
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    // driven by animation-timeline: scroll(), so give it a frame to settle
    await expect.poll(async () => alphaOf(await bgOf(page))).toBeGreaterThan(0.7);
    expect(await blurOf(page)).not.toBe("none");
  });

  test(`dimmed header keeps the theme colour — ${theme}`, async ({ page }) => {
    await withTheme(page, theme);
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect.poll(async () => alphaOf(await bgOf(page))).toBeGreaterThan(0.7);
    const bg = await bgOf(page);
    // light must not go dark, dark must not go white
    if (theme === "light") expect(bg).toMatch(/^rgba?\(2[0-9]{2}, 2[0-9]{2}/);
    else expect(bg).not.toMatch(/^rgba?\(25[0-5], 25[0-5], 25[0-5]/);
  });
}

test.describe("menu open forces an opaque header", () => {
  test.use({ viewport: { width: 393, height: 852 } });
  test("even at scroll offset 0", async ({ page }) => {
    await page.goto("/");
    await page.locator('button[aria-controls="mobile-nav"]').click();
    await expect.poll(async () => alphaOf(await bgOf(page))).toBeGreaterThan(0.7);
  });
});

test("falls back to a readable header without scroll-timeline support", async ({
  page,
}) => {
  await page.goto("/");
  // The resting CSS state is the dimmed one; the animation only removes it at
  // the top of the page. So a browser ignoring animation-timeline still gets
  // an opaque header rather than a transparent bar over the content.
  const resting = await page.evaluate(() => {
    const el = document.querySelector("header")!;
    el.setAttribute("data-menu-open", "true"); // disables the animation
    return getComputedStyle(el).backgroundColor;
  });
  expect(alphaOf(resting)).toBeGreaterThan(0.7);
});
