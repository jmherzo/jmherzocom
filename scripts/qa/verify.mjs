import { chromium } from "playwright";
const base = process.argv[2];
const b = await chromium.launch();
const pass=[],fail=[]; const t=(n,ok)=>(ok?pass:fail).push(n);

// --- skip link actually moves focus into main ---
{
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base,{waitUntil:"networkidle"});
  await p.keyboard.press("Tab");
  t("skip link is first tab stop", await p.evaluate(()=>document.activeElement?.getAttribute("href")==="#main"));
  t("skip link visible when focused", await p.evaluate(()=>{
    const r=document.activeElement.getBoundingClientRect(); return r.width>0&&r.height>0&&r.top>=0;}));
  await p.keyboard.press("Enter");
  await p.waitForTimeout(500);
  t("activating it focuses <main>", await p.evaluate(()=>document.activeElement?.id==="main"));
  await p.close();
}

// --- theme applied before paint, no flash ---
for (const theme of ["dark","light"]) {
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  await p.addInitScript(t=>localStorage.setItem("theme",t), theme);
  // Sample the class at the very first script execution point.
  await p.goto(base,{waitUntil:"domcontentloaded"});
  const early = await p.evaluate(()=>document.documentElement.classList.contains("dark"));
  t(`${theme}: html.dark correct before hydration (${early})`, early === (theme==="dark"));
  await p.waitForLoadState("networkidle");
  const bg = await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  t(`${theme}: body background matches theme`, theme==="dark" ? bg!=="rgb(255, 255, 255)" : bg==="rgb(255, 255, 255)");
  await ctx.close();
}

// --- mobile menu keyboard flow ---
{
  const ctx = await b.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true});
  const p = await ctx.newPage();
  await p.goto(base,{waitUntil:"networkidle"});
  const btn = p.locator('button[aria-controls="mobile-nav"]');
  await btn.focus(); await p.keyboard.press("Enter"); await p.waitForTimeout(400);
  t("menu opens via keyboard (Enter)", (await btn.getAttribute("aria-expanded"))==="true");
  await p.keyboard.press("Tab");
  t("Tab moves into the open panel", await p.evaluate(()=>
    document.getElementById("mobile-nav")?.contains(document.activeElement)));
  await p.keyboard.press("Escape"); await p.waitForTimeout(400);
  t("Escape closes from inside the panel", (await btn.getAttribute("aria-expanded"))==="false");
  t("panel links leave the tab order when closed", await p.evaluate(()=>{
    const links=[...document.querySelectorAll("#mobile-nav a")];
    return links.every(a=>a.getBoundingClientRect().width===0 || getComputedStyle(a.closest("#mobile-nav")).visibility==="hidden");}));
  await ctx.close();
}

// --- reduced motion honoured ---
{
  const ctx = await b.newContext({viewport:{width:1440,height:900}, reducedMotion:"reduce"});
  const p = await ctx.newPage();
  await p.goto(base,{waitUntil:"networkidle"});
  t("smooth scroll disabled under reduced-motion", await p.evaluate(()=>
    getComputedStyle(document.documentElement).scrollBehavior==="auto"));
  await ctx.close();
}

console.log("\nPASS"); for(const x of pass) console.log("  \x1b[32m✓\x1b[0m "+x);
if(fail.length){console.log("\nFAIL");for(const x of fail)console.log("  \x1b[31m✗\x1b[0m "+x);}
console.log(`\n${pass.length}/${pass.length+fail.length} passed`);
await b.close(); process.exit(fail.length?1:0);
