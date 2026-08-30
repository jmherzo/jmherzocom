# Tests

    pnpm test          # everything, in parallel
    pnpm test:ui       # interactive runner
    pnpm test:html     # html-validate over the built page

`playwright.config.ts` starts the server itself (`pnpm build && pnpm start`),
so there is nothing to run first. Tests hit a **production** build on purpose:
`next dev` serves different markup and a looser CSP, so testing it would not
reflect what visitors get. An already-running server on the port is reused
locally, never in CI.

| spec | covers |
|---|---|
| `a11y` | axe (WCAG 2.1 AA) × light/dark × mobile/desktop, heading outline, skip link, tab order, focus rings, landmarks, reduced motion |
| `responsive` | 9 viewports: horizontal overflow, stray elements, 44px tap targets, text size, mobile nav reachability, hero svh |
| `menu` | mobile menu: pointer + keyboard, Escape, outside click, anchor landing, breakpoint close, tab-order removal when closed |
| `header` | dim-on-scroll in both themes, menu-open opacity, no-scroll-timeline fallback |
| `theme` | theme applied before paint (no flash), toggle label and persistence |
| `console` | no console errors on load or interaction, security headers, `/resume.json` carries no private data |

Failures keep a trace and screenshot under `test-results/`; open one with
`pnpm exec playwright show-trace <path>`.
