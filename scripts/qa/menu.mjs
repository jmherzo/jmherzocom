import { chromium } from "playwright";
const base = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const p = await ctx.newPage();
await p.goto(base, { waitUntil: "networkidle" });

const pass = [], fail = [];
const t = (name, ok) => (ok ? pass : fail).push(name);

const btn = p.locator('button[aria-controls="mobile-nav"]');
const panel = p.locator("#mobile-nav");
const firstLink = panel.locator("a").first();

t("menu button visible on mobile", await btn.isVisible());
t("panel starts closed (aria-expanded=false)", (await btn.getAttribute("aria-expanded")) === "false");
t("links not reachable while closed", !(await firstLink.isVisible()));

await btn.click();
await p.waitForTimeout(400);
t("opens on click", (await btn.getAttribute("aria-expanded")) === "true");
t("links visible when open", await firstLink.isVisible());
t("all 6 nav links present", (await panel.locator("a").count()) === 6);

// Escape closes and returns focus to the button
await p.keyboard.press("Escape");
await p.waitForTimeout(400);
t("Escape closes", (await btn.getAttribute("aria-expanded")) === "false");
t("focus returns to button", await btn.evaluate(el => el === document.activeElement));

// Outside click closes
await btn.click(); await p.waitForTimeout(350);
await p.locator("#hero").click({ position: { x: 200, y: 400 } });
await p.waitForTimeout(350);
t("outside click closes", (await btn.getAttribute("aria-expanded")) === "false");

// Clicking a link navigates AND closes
await btn.click(); await p.waitForTimeout(350);
await panel.getByRole("link", { name: "Experience" }).click();
await p.waitForTimeout(1400);
t("closes after choosing a link", (await btn.getAttribute("aria-expanded")) === "false");
t("anchor lands below the fixed header", await p.evaluate(() => {
  const s = document.getElementById("experience");
  return s ? s.getBoundingClientRect().top >= 0 && s.getBoundingClientRect().top < 120 : false;
}));

// Resizing to desktop must not leave it stuck open
await btn.click(); await p.waitForTimeout(300);
await p.setViewportSize({ width: 1280, height: 800 });
await p.waitForTimeout(400);
t("closes when resized to desktop", (await btn.getAttribute("aria-expanded")) === "false");
t("desktop nav visible again", await p.locator("nav").first().locator("a").first().isVisible());

// Header no longer overlaps hero content at the top
await p.setViewportSize({ width: 393, height: 852 });
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(300);
t("hero fits the small viewport", await p.evaluate(() => {
  const h = document.getElementById("hero");
  return h.getBoundingClientRect().height <= window.innerHeight + 1;
}));

console.log("\nPASS");
for (const x of pass) console.log("  \x1b[32m✓\x1b[0m " + x);
if (fail.length) { console.log("\nFAIL"); for (const x of fail) console.log("  \x1b[31m✗\x1b[0m " + x); }
console.log(`\n${pass.length}/${pass.length + fail.length} passed`);
await b.close();
process.exit(fail.length ? 1 : 0);
