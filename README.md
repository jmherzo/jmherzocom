# jmherzo.com

My personal site. Next.js App Router, Tailwind, deployed on Vercel.

The point of the architecture: **the resume exists once**, in
`data/resume.json`. The page, the machine-readable `/resume.json`, and the
one-page Word CV are all projections of that file. Before this, the resume was
hardcoded in `app/page.tsx` and quietly drifted out of sync with the CV.

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Node 24 (`.node-version`, picked up automatically by fnm/nvm) and pnpm 11
(pinned via `packageManager`).

## How the resume data works

`data/resume.json` is a superset of every fact. Each renderer takes the subset
it needs — nothing is duplicated:

```jsonc
{
  "text":    "Co-led the rebuild of PayPal's global card-add experience …, 2x performance",
  "cvText":  "Co-led the rebuild of PayPal's global card-add experience on web.",
  "targets": ["cv", "web"]
}
```

- `targets` decides **whether** a fact appears in a renderer.
- `cvText` decides **how tersely** it reads, so the CV can stay on one page
  without becoming a second copy of the fact that drifts.

The one-page CV is therefore `highlights.filter(h => h.targets.includes("cv"))`,
not a separate document.

### Keeping the Word CV in sync

The `.docx` stays the master for the PDF's formatting — nothing here writes to
it. This reports what has drifted:

```bash
pnpm resume:check
```

It extracts the CV's text with macOS `textutil` and diffs it against the `cv`
projection, normalising smart quotes and dashes so Word's autocorrect doesn't
raise false alarms.

### Private data

CV-only contact details and the local path to the `.docx` live in
`data/resume.private.json`, which is **gitignored**. Copy the example to set it
up:

```bash
cp data/resume.private.example.json data/resume.private.json
```

They are kept out of `data/resume.json` deliberately. `app/page.tsx` is a
client component, and importing a JSON file into one ships **the whole file**
to the browser regardless of which fields are read — so anything private in it
would land in the public bundle.

## Tests

```bash
pnpm test           # everything, in parallel
pnpm test:ui        # interactive runner
pnpm test:html      # html-validate over the built page
```

`playwright.config.ts` starts the server itself, so there is nothing to run
first. Tests hit a **production** build on purpose: `next dev` serves different
markup and a looser CSP, so testing it would not reflect what visitors get.

| spec | covers |
|---|---|
| `a11y` | axe (WCAG 2.1 AA) × light/dark × mobile/desktop, headings, skip link, tab order, focus rings, landmarks, reduced motion |
| `responsive` | 9 viewports: overflow, stray elements, 44px tap targets, text size, mobile nav, hero `svh` |
| `menu` | mobile menu: pointer and keyboard, Escape, outside click, anchor landing, breakpoint close |
| `header` | dim-on-scroll in both themes, plus the no-scroll-timeline fallback |
| `theme` | theme applied before paint, toggle label and persistence |
| `console` | no console errors, security headers, no private data in `/resume.json` |

Failures keep a trace: `pnpm exec playwright show-trace test-results/…/trace.zip`.

## Notes worth knowing

**The header dims on scroll in CSS**, not JavaScript — `animation-timeline:
scroll()` in `app/globals.css`. The resting state is the *dimmed* one, so a
browser without scroll-timeline support gets a readable header rather than a
transparent bar over the content.

**`'unsafe-eval'` is dev-only** in the CSP (`next.config.js`). Next's hot
reload compiles with `eval`; the production bundle never does and must not get
it.

**Running `pnpm dev` overwrites `.next`**, so `pnpm start` afterwards fails
until you rebuild.

## Layout

```
app/            page, layout, /resume.json route, icon
data/           resume.json (source of truth) + typed accessors
scripts/        check-resume-sync.mjs
tests/          Playwright specs
components/ui/  Button, Card, Badge
```

## License

[MIT](license.md) for the code. The resume content in `data/` is mine.
