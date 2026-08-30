import { test, expect } from "@playwright/test";
import { VIEWPORTS } from "./helpers";

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("body never scrolls horizontally", async ({ page }) => {
      await page.goto("/");
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test("nothing sticks out past the viewport", async ({ page }) => {
      await page.goto("/");
      const strays = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const out: string[] = [];
        for (const el of Array.from(document.querySelectorAll("body *"))) {
          const cs = getComputedStyle(el);
          // decorative blurred orbs are positioned deliberately offscreen
          if (cs.position === "fixed" || cs.position === "absolute") continue;
          const b = el.getBoundingClientRect();
          if (b.width === 0 && b.height === 0) continue;
          if (b.right > vw + 1 || b.left < -1) {
            out.push(`<${el.tagName.toLowerCase()}> ${Math.round(b.left)}..${Math.round(b.right)} (vw ${vw})`);
          }
        }
        return out;
      });
      expect(strays).toEqual([]);
    });

    test("tap targets meet the 44px minimum", async ({ page }) => {
      await page.goto("/");
      const small = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of Array.from(document.querySelectorAll("a,button"))) {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) continue;
          // sr-only elements (the skip link) are 1x1 until focused, by design
          if (b.width <= 2 && b.height <= 2) continue;
          if (b.height < 44 || b.width < 44) {
            const name = (el.textContent || "").trim().slice(0, 30) || "(icon)";
            out.push(`${Math.round(b.width)}x${Math.round(b.height)} "${name}"`);
          }
        }
        return out;
      });
      expect(small).toEqual([]);
    });

    test("no text below 12px", async ({ page }) => {
      await page.goto("/");
      const tiny = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of Array.from(
            document.querySelectorAll("p,span,a,li,h1,h2,h3,button"),
          )) {
          if (!el.textContent?.trim()) continue;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs && fs < 12) out.push(`${fs}px "${el.textContent.trim().slice(0, 24)}"`);
        }
        return out;
      });
      expect(tiny).toEqual([]);
    });

    if (vp.width < 768) {
      test("navigation is reachable on mobile", async ({ page }) => {
        await page.goto("/");
        await page.locator('button[aria-controls="mobile-nav"]').click();
        await expect(page.locator("#mobile-nav").getByRole("link")).toHaveCount(6);
      });
    }
  });
}

test.describe("hero fits the small viewport", () => {
  test.use({ viewport: { width: 393, height: 852 } });
  test("uses svh so iOS Safari does not clip it", async ({ page }) => {
    await page.goto("/");
    const fits = await page.evaluate(() => {
      const h = document.getElementById("hero")!;
      return h.getBoundingClientRect().height <= window.innerHeight + 1;
    });
    expect(fits).toBe(true);
  });
});
