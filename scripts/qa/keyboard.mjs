import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
const p = await ctx.newPage();
await p.goto(process.argv[2], { waitUntil:"networkidle" });

// 1. Heading outline - screen reader users navigate by headings.
const headings = await p.evaluate(() =>
  [...document.querySelectorAll("h1,h2,h3,h4")].map(h => ({
    lvl: +h.tagName[1], text: h.textContent.trim().slice(0, 42),
  })));
console.log("HEADING OUTLINE");
let prev = 0, skips = [], h1s = 0;
for (const h of headings) {
  if (h.lvl === 1) h1s++;
  if (prev && h.lvl > prev + 1) skips.push(`${prev}->${h.lvl} at "${h.text}"`);
  console.log(`  ${"  ".repeat(h.lvl-1)}h${h.lvl}  ${h.text}`);
  prev = h.lvl;
}
console.log(`\n  h1 count: ${h1s} ${h1s === 1 ? "(ok)" : "\x1b[31m(should be exactly 1)\x1b[0m"}`);
console.log(`  level skips: ${skips.length ? "\x1b[31m"+skips.join("; ")+"\x1b[0m" : "none"}`);

// 2. Skip link - first Tab should offer a way past the nav.
await p.keyboard.press("Tab");
const first = await p.evaluate(() => {
  const a = document.activeElement;
  return { tag:a.tagName.toLowerCase(), text:(a.textContent||"").trim().slice(0,40), href:a.getAttribute?.("href") };
});
console.log(`\nSKIP LINK\n  first Tab lands on: <${first.tag}> "${first.text}" href=${first.href}`);
console.log(`  is a skip link: ${/skip|main|content/i.test(first.text+first.href) ? "yes" : "\x1b[31mNO\x1b[0m"}`);

// 3. Tab traversal + visible focus indicator on every stop.
await p.evaluate(() => document.activeElement.blur());
const stops = [];
for (let i = 0; i < 60; i++) {
  await p.keyboard.press("Tab");
  const s = await p.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return null;
    const cs = getComputedStyle(a);
    const r = a.getBoundingClientRect();
    const hasRing =
      (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
      (cs.boxShadow && cs.boxShadow !== "none");
    return {
      tag: a.tagName.toLowerCase(),
      text: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 34) || "(no name)",
      hasRing,
      offscreen: r.width === 0 && r.height === 0,
    };
  });
  if (!s) break;
  stops.push(s);
}
console.log(`\nTAB TRAVERSAL (${stops.length} stops)`);
const noRing = stops.filter(s => !s.hasRing);
const hidden = stops.filter(s => s.offscreen);
const unnamed = stops.filter(s => s.text === "(no name)");
for (const s of stops.slice(0, 12))
  console.log(`  ${s.hasRing ? "\x1b[32m●\x1b[0m" : "\x1b[31m○\x1b[0m"} <${s.tag}> ${s.text}`);
if (stops.length > 12) console.log(`  ... +${stops.length - 12} more`);
console.log(`\n  no visible focus ring: ${noRing.length ? "\x1b[31m"+noRing.length+"\x1b[0m" : "0"}`);
for (const s of noRing.slice(0,6)) console.log(`      <${s.tag}> ${s.text}`);
console.log(`  focusable but invisible: ${hidden.length}`);
console.log(`  unnamed (no accessible name): ${unnamed.length}`);

// 4. Landmarks
const lm = await p.evaluate(() => ({
  header: !!document.querySelector("header"),
  main: document.querySelectorAll("main").length,
  footer: !!document.querySelector("footer"),
  navs: [...document.querySelectorAll("nav")].map(n => n.getAttribute("aria-label") || "(unlabelled)"),
}));
console.log(`\nLANDMARKS\n  header:${lm.header} main:${lm.main} footer:${lm.footer}`);
console.log(`  nav labels: ${lm.navs.join(", ")}`);

// 5. Does the page have a lang + title?
const meta = await p.evaluate(() => ({ lang: document.documentElement.lang, title: document.title }));
console.log(`\nDOC\n  lang=${meta.lang || "\x1b[31mMISSING\x1b[0m"}  title="${meta.title.slice(0,60)}"`);
await b.close();
