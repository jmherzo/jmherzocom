# QA scripts

Run the site first (`pnpm build && pnpm start -p 3000`), then point a script at it:

    pnpm qa:a11y       http://localhost:3000   # axe-core, mobile+desktop x light+dark
    pnpm qa:responsive http://localhost:3000   # 9 viewports: overflow, tap targets, tiny text
    pnpm qa:keyboard   http://localhost:3000   # tab order, focus rings, heading outline
    pnpm qa:menu       http://localhost:3000   # mobile menu behaviour
    pnpm qa:header     http://localhost:3000   # dim-on-scroll, both themes
    pnpm qa:verify     http://localhost:3000   # skip link, theme flash, reduced motion
    pnpm qa:html                               # html-validate over the built HTML

## Why some html-validate rules are off

Every hit from `void-style`, `attr-case`, `attribute-boolean-style`,
`attribute-empty-style` and `valid-id` comes from React/Next serialization we
do not author: self-closing `<meta/>`, camelCase `charSet` / `fetchPriority` /
`noModule` / `dateTime`, and React's generated `_R_` ids. HTML attribute names
are case-insensitive, and the DOM confirms these parse correctly
(`time.dateTime` returns its value).

The structural rules stay ON - `element-permitted-content`,
`no-implicit-button-type`, heading order, required attributes. Those are the
ones that caught the real bugs: `<button>` nested inside `<a>` in the hero,
and buttons defaulting to `type="submit"`.
