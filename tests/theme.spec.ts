import { test, expect } from "@playwright/test";
import { withTheme } from "./helpers";

for (const theme of ["dark", "light"] as const) {
  test(`${theme}: applied before paint, so there is no flash`, async ({ page }) => {
    await withTheme(page, theme);
    // domcontentloaded, i.e. before React hydrates and could correct it
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark).toBe(theme === "dark");
  });

  test(`${theme}: body background matches after hydration`, async ({ page }) => {
    await withTheme(page, theme);
    await page.goto("/");
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    if (theme === "light") expect(bg).toBe("rgb(255, 255, 255)");
    else expect(bg).not.toBe("rgb(255, 255, 255)");
  });
}

test("toggle switches the theme and says what it will do", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /switch to .* theme/i });
  await expect(toggle).toHaveAttribute("aria-label", /switch to dark theme/i);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-label", /switch to light theme/i);
  expect(
    await page.evaluate(() => localStorage.getItem("theme")),
  ).toBe("dark");
});
