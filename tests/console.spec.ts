import { test, expect } from "@playwright/test";
import { IGNORED_CONSOLE, privateValues } from "./helpers";

test("the page loads with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(errors.filter((e) => !IGNORED_CONSOLE.some((re) => re.test(e)))).toEqual([]);
});

test("interacting with the page raises nothing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");

  await page.getByRole("button", { name: /switch to .* theme/i }).click();
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.setViewportSize({ width: 393, height: 852 });
  await page.locator('button[aria-controls="mobile-nav"]').click();
  await page.keyboard.press("Escape");

  expect(errors).toEqual([]);
});

test("security headers are served in production", async ({ page }) => {
  const res = await page.goto("/");
  const h = res!.headers();
  expect(h["content-security-policy"]).toBeTruthy();
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-powered-by"]).toBeUndefined();
  // dev needs 'unsafe-eval' for hot reload; production must never have it
  expect(h["content-security-policy"]).not.toContain("unsafe-eval");
});

test("/resume.json is public and carries no private contact details", async ({
  request,
}) => {
  const res = await request.get("/resume.json");
  expect(res.status()).toBe(200);
  const body = await res.text();
  const json = JSON.parse(body);

  expect(json.basics.name).toBeTruthy();
  expect(json.work.length).toBeGreaterThan(0);
  expect(json.basics).not.toHaveProperty("phoneCv");
  expect(json.basics).not.toHaveProperty("emailCv");

  // The literals are read from the gitignored private file, never written
  // here - a leak test that hardcodes the secret publishes it in the repo.
  for (const [field, value] of Object.entries(privateValues())) {
    expect(body, `${field} leaked into /resume.json`).not.toContain(value);
  }
});
