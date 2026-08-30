import { chromium } from "playwright";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = (await import("node:fs")).readFileSync(axePath, "utf8");

const base = process.argv[2];
const b = await chromium.launch();
const CASES = [
  ["mobile light", 393, 852, "light", true],
  ["mobile dark",  393, 852, "dark",  true],
  ["desktop light",1440, 900, "light", false],
  ["desktop dark", 1440, 900, "dark",  false],
];

const seen = new Map();
for (const [name, w, h, theme, isMobile] of CASES) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile, hasTouch:isMobile });
  const p = await ctx.newPage();
  await p.addInitScript(t => localStorage.setItem("theme", t), theme);
  await p.goto(base, { waitUntil:"networkidle" });
  await p.waitForTimeout(300);
  await p.addScriptTag({ content: axeSource });
  const res = await p.evaluate(async () =>
    await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"] },
    })
  );
  for (const v of res.violations) {
    const key = v.id;
    if (!seen.has(key)) seen.set(key, { ...v, where: new Set() });
    seen.get(key).where.add(name);
    for (const n of v.nodes.slice(0,3)) seen.get(key).sample = n.html.slice(0,110);
  }
  console.log(`${name.padEnd(14)} violations: ${res.violations.length}  passes: ${res.passes.length}`);
  await ctx.close();
}

console.log("\n" + "=".repeat(76));
if (!seen.size) console.log("No axe violations.");
for (const v of seen.values()) {
  console.log(`\n[${v.impact}] ${v.id} — ${v.help}`);
  console.log(`  where: ${[...v.where].join(", ")}`);
  console.log(`  e.g.  ${v.sample}`);
  console.log(`  docs: ${v.helpUrl.split("?")[0]}`);
}
console.log("=".repeat(76));
await b.close();
