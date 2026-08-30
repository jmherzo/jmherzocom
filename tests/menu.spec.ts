import { test, expect } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 393, height: 852 }, hasTouch: true });

  const button = (page: import("@playwright/test").Page) =>
    page.locator('button[aria-controls="mobile-nav"]');
  const panel = (page: import("@playwright/test").Page) =>
    page.locator("#mobile-nav");

  test.beforeEach(async ({ page }) => await page.goto("/"));

  test("starts closed with links out of the tab order", async ({ page }) => {
    await expect(button(page)).toBeVisible();
    await expect(button(page)).toHaveAttribute("aria-expanded", "false");
    // visibility:hidden, not just max-height:0 - otherwise they stay tabbable
    await expect(panel(page).getByRole("link").first()).toBeHidden();
  });

  test("opens on click and exposes all six links", async ({ page }) => {
    await button(page).click();
    await expect(button(page)).toHaveAttribute("aria-expanded", "true");
    await expect(panel(page).getByRole("link")).toHaveCount(6);
    await expect(panel(page).getByRole("link").first()).toBeVisible();
  });

  test("opens with the keyboard and Tab moves into the panel", async ({ page }) => {
    await button(page).focus();
    await page.keyboard.press("Enter");
    await expect(button(page)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() =>
      document.getElementById("mobile-nav")!.contains(document.activeElement),
    );
    expect(inside).toBe(true);
  });

  test("Escape closes it and returns focus to the button", async ({ page }) => {
    await button(page).click();
    await page.keyboard.press("Escape");
    await expect(button(page)).toHaveAttribute("aria-expanded", "false");
    await expect(button(page)).toBeFocused();
  });

  test("a click outside closes it", async ({ page }) => {
    await button(page).click();
    await page.locator("#hero").click({ position: { x: 200, y: 400 } });
    await expect(button(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("choosing a link closes it and scrolls below the fixed header", async ({
    page,
  }) => {
    await button(page).click();
    await panel(page).getByRole("link", { name: "Experience" }).click();
    await expect(button(page)).toHaveAttribute("aria-expanded", "false");
    // Smooth scrolling takes ~900ms, so poll on the landing position itself.
    // scroll-padding-top must keep the heading clear of the 4rem header:
    // top lands just below it, never underneath (negative).
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            Math.round(
              document.getElementById("experience")!.getBoundingClientRect().top,
            ),
          ),
        { timeout: 8000 },
      )
      .toBeLessThan(120);
    const top = await page.evaluate(() =>
      document.getElementById("experience")!.getBoundingClientRect().top,
    );
    expect(top).toBeGreaterThanOrEqual(0);
  });

  test("closes when the viewport grows to desktop", async ({ page }) => {
    await button(page).click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(button(page)).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link").first(),
    ).toBeVisible();
  });
});
