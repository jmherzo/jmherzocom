import { chromium } from "playwright";

const VIEWPORTS = [
  ["iPhone SE",      320, 568,  true],
  ["iPhone 12 mini", 375, 812,  true],
  ["iPhone 14 Pro",  393, 852,  true],
  ["Pixel 7",        412, 915,  true],
  ["iPad mini",      768, 1024, true],
  ["iPad Pro",       1024, 1366, true],
  ["Laptop",         1280, 800,  false],
  ["Desktop",        1440, 900,  false],
  ["Wide",           1920, 1080, false],
];

const base = process.argv[2] || "http://localhost:3120";
const browser = await chromium.launch();
const results = [];

for (const [name, w, h, isMobile] of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: isMobile ? 3 : 2,
    isMobile, hasTouch: isMobile,
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", m => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", e => consoleErrors.push(String(e)));
  await page.goto(base, { waitUntil: "networkidle" });

  const r = await page.evaluate(() => {
    const de = document.documentElement;
    const out = { overflow: [], tiny: [], touch: [], contrastRisk: [] };

    // 1. Horizontal overflow: the page body must never scroll sideways.
    out.hScroll = de.scrollWidth - de.clientWidth;

    // 2. Which elements actually stick out past the viewport?
    const vw = de.clientWidth;
    for (const el of document.querySelectorAll("body *")) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue;
      if (b.right > vw + 1 || b.left < -1) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.position === "absolute") continue; // decorative orbs
        out.overflow.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 60),
          left: Math.round(b.left), right: Math.round(b.right),
          text: (el.textContent || "").trim().slice(0, 40),
        });
      }
    }

    // 3. Text too small to read on mobile.
    for (const el of document.querySelectorAll("p,span,a,li,h1,h2,h3,button")) {
      if (!el.textContent?.trim()) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 12) out.tiny.push({ tag: el.tagName.toLowerCase(), fs, text: el.textContent.trim().slice(0, 30) });
    }

    // 4. Tap targets smaller than the 44x44 accessibility minimum.
    for (const el of document.querySelectorAll("a,button")) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      // sr-only elements (the skip link) are 1x1 until focused, by design.
      if (b.width <= 2 && b.height <= 2) continue;
      if (b.height < 44 || b.width < 44) {
        out.touch.push({
          tag: el.tagName.toLowerCase(),
          w: Math.round(b.width), h: Math.round(b.height),
          text: (el.textContent || "").trim().slice(0, 30) || "(icon)",
        });
      }
    }

    out.docHeight = document.body.scrollHeight;
    out.navVisible = [...document.querySelectorAll("nav a")].filter(a => a.getBoundingClientRect().width > 0).length;
    return out;
  });

  results.push({ name, w, h, isMobile, ...r, consoleErrors });
  await page.screenshot({ path: `/tmp/shot-${w}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();

const RED = s => `\x1b[31m${s}\x1b[0m`, GRN = s => `\x1b[32m${s}\x1b[0m`, YEL = s => `\x1b[33m${s}\x1b[0m`;
console.log("\n" + "=".repeat(78));
for (const r of results) {
  const issues = [];
  if (r.hScroll > 0) issues.push(RED(`H-SCROLL +${r.hScroll}px`));
  if (r.overflow.length) issues.push(RED(`${r.overflow.length} overflowing`));
  if (r.tiny.length) issues.push(YEL(`${r.tiny.length} tiny-text`));
  if (r.touch.length) issues.push(YEL(`${r.touch.length} small-tap`));
  if (r.consoleErrors.length) issues.push(RED(`${r.consoleErrors.length} console-err`));
  if (r.isMobile && r.navVisible === 0) issues.push(RED("NO NAV LINKS"));
  console.log(`${r.name.padEnd(15)} ${String(r.w).padStart(4)}x${String(r.h).padEnd(5)} ` +
    `h=${String(r.docHeight).padStart(5)}  ${issues.length ? issues.join("  ") : GRN("clean")}`);
  for (const o of r.overflow.slice(0, 3)) console.log(`      overflow <${o.tag}> ${o.left}..${o.right} "${o.text}" [${o.cls}]`);
  for (const t of r.touch.slice(0, 4)) console.log(`      tap ${t.w}x${t.h} <${t.tag}> "${t.text}"`);
  for (const t of r.tiny.slice(0, 2)) console.log(`      tiny ${t.fs}px "${t.text}"`);
  for (const e of r.consoleErrors.slice(0, 2)) console.log(`      err ${e.slice(0, 90)}`);
}
console.log("=".repeat(78));
