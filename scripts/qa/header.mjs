import { chromium } from "playwright";
const base = process.argv[2] || "http://localhost:3126";
const b = await chromium.launch();
const pass=[],fail=[]; const t=(n,ok,d="")=>(ok?pass:fail).push(n+(d?`  ${d}`:""));

for (const theme of ["light","dark"]) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(x=>localStorage.setItem("theme",x), theme);
  await p.goto(base,{waitUntil:"networkidle"});

  const read = async () => p.evaluate(() => {
    const cs = getComputedStyle(document.querySelector("header"));
    return { bg: cs.backgroundColor, blur: cs.backdropFilter, border: cs.borderBottomColor, shadow: cs.boxShadow };
  });

  const supported = await p.evaluate(() => CSS.supports("animation-timeline: scroll()"));
  await p.evaluate(() => window.scrollTo(0,0));
  await p.waitForTimeout(250);
  const top = await read();

  await p.evaluate(() => window.scrollTo(0, 600));
  await p.waitForTimeout(400);
  const scrolled = await read();

  const alpha = c => { const m=c.match(/[\d.]+/g); return m && m.length===4 ? parseFloat(m[3]) : (c==="rgba(0, 0, 0, 0)"?0:1); };

  console.log(`\n${theme.toUpperCase()}  (scroll-timeline supported: ${supported})`);
  console.log(`  at top      bg=${top.bg}  blur=${top.blur}`);
  console.log(`  scrolled    bg=${scrolled.bg}  blur=${scrolled.blur}`);

  t(`${theme}: transparent at top`, alpha(top.bg) < 0.05, `alpha=${alpha(top.bg)}`);
  t(`${theme}: dimmed after scroll`, alpha(scrolled.bg) > 0.7, `alpha=${alpha(scrolled.bg)}`);
  t(`${theme}: blur applied after scroll`, scrolled.blur !== "none" && scrolled.blur !== "blur(0px)");
  t(`${theme}: no blur at top`, top.blur === "none" || top.blur === "blur(0px)");
  t(`${theme}: keeps theme colour (not black)`, !/^rgba?\(0, 0, 0/.test(scrolled.bg) || theme==="dark");
  await ctx.close();
}

// menu open must force the opaque header even at scroll 0
{
  const ctx = await b.newContext({ viewport:{width:393,height:852}, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  await p.goto(base,{waitUntil:"networkidle"});
  await p.locator('button[aria-controls="mobile-nav"]').click();
  await p.waitForTimeout(400);
  const bg = await p.evaluate(()=>getComputedStyle(document.querySelector("header")).backgroundColor);
  const a = (bg.match(/[\d.]+/g)||[]).length===4 ? parseFloat(bg.match(/[\d.]+/g)[3]) : 1;
  t("menu open forces opaque header at scroll 0", a > 0.7, `alpha=${a}`);
  await ctx.close();
}

console.log("\nPASS"); for(const x of pass) console.log("  \x1b[32m✓\x1b[0m "+x);
if(fail.length){console.log("\nFAIL");for(const x of fail)console.log("  \x1b[31m✗\x1b[0m "+x);}
console.log(`\n${pass.length}/${pass.length+fail.length} passed`);
await b.close(); process.exit(fail.length?1:0);
