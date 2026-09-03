---
description: Design language / UI reference for the PAVI portfolio site. Read this before creating or editing any case study or homepage section, so new work matches existing styling instead of drifting from it.
---

# PAVI Portfolio — Design System Reference

This file is the single source of truth for the site's visual language. It was reverse-engineered from the current `styles.css`, `main.js`, `case-study.js`, `index.html`, `case-study-template.html`, and the two live case studies (`next-gen-contact-center.html`, `reimagining-employee-center.html`) as of **Aug 13, 2026**. When adding a new case study or touching the homepage, check new markup/CSS against this doc — don't reinvent a pattern that already exists here.

## ⚠️ Known issue: duplicate files in this project

`index.html`, `case-study-template.html`, `next-gen-contact-center.html`, and `reimagining-employee-center.html` each currently exist as **two separate docs** in this project (one dated Aug 12, one dated Aug 13). `styles.css`, `main.js`, and `case-study.js` exist only once, dated Aug 13, and this reference was built from the **Aug 13 HTML versions**, which read as the newer/more complete ones (icon-bullet before/after lists, inline persona heads, carousels, etc.). Treat Aug 13 as canonical. There's also a standalone `Reimagining Employee Centre V1.html`, which looks like an older draft, not part of the current set.

Before relying on any of this blindly: if a live GitHub repo or deployed URL (Vercel, per `DEPLOY.md`) exists, that deployed HTML is the real tie-breaker — diff it against these project docs and reconcile before building on top. Worth doing a one-time cleanup pass to delete the stale duplicates from the project so future sessions can't grab the wrong one.

---

## 1. Design philosophy

- **Monochrome, flat, "Apple-adjacent."** Black / white / one cool-neutral grey ramp. No color accents anywhere — no blue links, no brand color. Contrast and whitespace do all the work.
- **One typeface everywhere.** Manrope for UI, body, and display text. `--font-serif` exists as a variable but is mapped to Manrope too — it's used to mark "editorial/display" moments (headlines, stat numbers, quote marks) at `font-weight: 400`, vs UI text which leans 500–700. Don't bring in an actual serif font.
- **Soft, app-icon-style radii**, not sharp corners and not fully rounded — 16–40px depending on element size, pill (999px) for anything button/chip/badge-shaped.
- **Editorial case-study layout**: a narrow sticky left rail (`0.8fr`) with a numbered eyebrow label, paired with a wide right column (`2.2fr`) holding the actual content. This 2-column rhythm repeats for every section of a case study.
- **Motion is quiet and consistent**: mask/fade-up reveals on scroll, a soft custom cursor, magnetic buttons, count-up numbers — never anything bouncy or attention-grabbing. Everything respects `prefers-reduced-motion`.
- **Content authenticity over decoration.** Placeholder blocks (diagonal hatch pattern) are used honestly when real imagery isn't ready yet, rather than faking it.

---

## 2. Design tokens (from `:root` in `styles.css`)

All values are CSS custom properties — always use the variable, never hardcode a hex/px value in new markup or CSS.

### Color

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0a` | Primary dark surface, primary button bg, dark cards |
| `--white` | `#ffffff` | Primary light surface |
| `--grey-25` … `--grey-800` | `#fbfbfc` → `#232326` | Full neutral ramp, cool-toned (Apple-adjacent, not warm grey) |
| `--ink` | `#111113` | `--text-primary` |
| `--surface` / `--surface-alt` | white / `--grey-50` | Page bg / subtle section bg |
| `--text-primary` / `--text-secondary` / `--text-tertiary` | ink / grey-600 / grey-400 | Text hierarchy — 3 levels only |
| `--border-hairline` | `rgba(10,10,10,0.08)` | All hairline dividers/borders |

No other colors exist in the system. If a new case study needs a status/semantic color (e.g. a red "risk" flag), that's a deliberate decision to make explicitly, not something to improvise inline — check with the shared token list first.

### Typography

- Font: `'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (both `--font-sans` and `--font-serif`).
- Fluid type scale (all `clamp()`, so it scales with viewport — never hardcode a px font-size):

| Token | Range | Typical use |
|---|---|---|
| `--fs-hero` | 2.75rem → 6.25rem | Homepage `<h1>` name, case-study `<h1>` |
| `--fs-display` | 2.1rem → 4rem | Section-level headlines (contact heading, vision/closing) |
| `--fs-h2` | 1.5rem → 2.25rem | Featured-work card title, next-case-study title |
| `--fs-h3` | 1.15rem → 1.5rem | Quote text, persona name, numbered-item number |
| `--fs-body-lg` | 1.05rem → 1.3rem | Dek/subhead copy, card body copy |
| `--fs-body` | 1rem (fixed) | Default body text |
| `--fs-small` | 0.875rem | Meta text, nav links, list items |
| `--fs-micro` | 0.75rem | Eyebrows, chips, tags, captions |

- `--lh-tight` (1.05) for big display type, `--lh-snug` (1.25) for quotes, `--lh-normal` (1.55) for body copy.
- Headings (`h1–h4`) default to `font-weight: 500; letter-spacing: -0.02em`, but most display-style headings (`.cs-headline`, `.cs-hero h1`, `.contact-heading`, `.persona-card h4`) override to `font-weight: 400` on the "serif" family — that lighter weight + tight tracking is what gives the editorial feel. UI elements (nav, buttons, chips, eyebrows) stay 500–800 weight on the sans family.
- `.eyebrow` is the standard label pattern everywhere: `--fs-micro`, 600 weight, `0.14em` letter-spacing, uppercase, `--text-tertiary` color. Always use the `.eyebrow` class for section labels/tags rather than styling one-off.

### Spacing (4px base scale)

`--sp-1` (4px) through `--sp-20` (160px): 1, 2, 3, 4, 5(24), 6(32), 7(40), 8(48), 10(64), 12(96), 16(128), 20(160). Always compose spacing from this scale — no arbitrary margin/padding values.

### Radius

`--r-sm` 16px, `--r-md` 24px, `--r-lg` 32px, `--r-xl` 40px, `--r-pill` 999px. Rough rule of thumb: small UI chrome (skip link, chips) → sm; content cards (persona, quote, contact, before/after) → md/lg; big hero/media blocks and dark bands → xl; anything pill/button/badge-shaped → pill.

### Motion

- Easing: `--ease-out` (`cubic-bezier(0.16,1,0.3,1)`) for reveals, `--ease-in-out` for role-rotator crossfades.
- Duration: `--dur-fast` 0.25s (hovers), `--dur-med` 0.5s (nav show/hide), `--dur-slow` 0.9s (big reveals).
- Everything wraps in `@media (prefers-reduced-motion: reduce)` → durations collapse to ~0.

### Layout

- `--container`: 1320px max width, centered.
- `--gutter`: fluid `clamp(1.25rem, 4vw, 3rem)` side padding — used on every top-level section wrapper.

---

## 3. Global structural pattern

Every page (`index.html` and every case study) shares this shell:

```
<a class="skip-link">Skip to content</a>
<header class="site-nav">...</header>
<main id="main">
  ...page content...
</main>
<footer class="site-footer">...</footer>
<script>inline year-stamp script</script>
<script src="assets/js/main.js"></script>
<script src="assets/js/case-study.js"></script>  <!-- case studies only -->
```

- `<link rel="stylesheet" href="assets/css/styles.css">` in `<head>` on every page — this is the *only* shared stylesheet.
- `<meta name="view-transition" content="same-origin">` on every page — the site uses native cross-document View Transitions.
- Standard `<head>` boilerplate: charset, viewport, `<title>`, meta description, favicon link, then the stylesheet. Match this exactly for new pages.

### Nav (`.site-nav`)

Two variants, both `position: sticky; top: 0`, translucent white background that solidifies (`.is-scrolled`) after 8px of scroll, and hides on scroll-down past 160px (`.is-hidden`), reappearing on scroll-up (handled by `initNav()` in `main.js`):

1. **Homepage nav**: `.nav-mark` (logo/initials, links home) on the left, `.nav-links` (Work, Contact, Resume button) on the right.
2. **Case-study nav**: `.nav-back` (← Back, links to `index.html`) on the left, `.nav-case-name` (case study title, absolutely centered) — no right-side links.

### Footer (`.site-footer`)

Identical on every page: `© {year} Pavithran P.` on the left (year filled by inline script), LinkedIn / Email / "Back to top ↑" links on the right.

### Buttons

- `.btn` base + `.btn-primary` (black bg, white text, hovers to `--grey-800`) or `.btn-ghost` (grey-50 bg, hovers to grey-100). Always pill-radius.
- Wrap any button meant to feel "grabbable" in `<span class="magnetic-wrap"><a data-magnetic class="btn ...">` — this activates the cursor-follow magnetic effect (fine-pointer only, disabled under reduced motion).

### Custom cursor

Fine-pointer devices only (`hover: hover` + `pointer: fine`) get a two-part custom cursor (`.cursor-dot` + `.cursor-ring`, lerped for a trailing effect) that expands on hover over interactive elements (`a, button, .featured-work, input, textarea, [data-cursor-hover]`), and inverts to white on elements marked `[data-cursor-dark]` (used over dark photo/media backgrounds). This is initialized once in `main.js` and applies site-wide — never re-implement it per page.

---

## 4. Homepage-specific components

- **Hero** (`.hero`): name (`.hero-name`, line-mask reveal on load via `.is-loaded`), a rotating role line (`.role-rotator`, cycles every 3.8s), stacked fact rows (`.hero-facts` — YOE/employers/location, then education), then two caption lines (`.hero-caption`), one of which (`.hero-philosophy`) is styled bolder as the "thesis statement." A quiet scroll cue sits beside the hero text on wide viewports only.
- **Featured work** (`.featured-work` inside `.work-stack`): full-bleed two-column card — image left, dark content panel right (always `background: var(--black); color: var(--white)` on the whole card) — chips (`.chip-row`/`.chip`) for tags, title, one-sentence description, and a `.featured-link` pill CTA. Has entrance reveal (`IntersectionObserver`) + subtle 3D tilt on mousemove (fine-pointer only). **This is the card used to list every case study on the homepage** — stack additional `<a class="featured-work">` entries inside `.work-stack` for each new case study, in the order they should appear.
- **Contact** (`.contact-section`): two-column — intro/heading left, stacked `.contact-card`s right (email, phone, LinkedIn), each with a copy-to-clipboard button that appears on hover and flips to "Copied" on click (`data-copy` attribute + `initCopyButtons()`).

---

## 5. Case-study page components

Case studies are built from `case-study-template.html`, which is the authoritative scaffold — **duplicate it for every new case study rather than copying an existing one**, since the existing ones carry case-study-specific inline `<style>` overrides you don't want to inherit by accident. The template's own header comment documents the 7-step process (copy → rename → fill placeholders → swap placeholder blocks for real `<img>` → register on homepage → done, styles are all shared → set unique `view-transition-name`s). Follow it.

### Page shell
`.cs-hero` (eyebrow, `<h1>`, `.cs-dek` summary, `.cs-meta` 3-column Sector/Role/Context row) → `.cs-cover` (full-width hero image or `.placeholder-block`) → a sequence of `.cs-section` blocks → `.cs-closing` (CTA back to contact) → `.cs-next` teaser card linking to the next case study.

### The section pattern (repeats for every numbered section)
```html
<section class="cs-section">
  <div class="cs-section-inner">              <!-- grid: 0.8fr sticky label | 2.2fr content -->
    <div class="cs-section-label"><p class="eyebrow">01 — Overview</p></div>
    <div>
      <h2 class="cs-headline">...</h2>        <!-- mask-reveals on scroll via case-study.js -->
      <!-- one or more content blocks below, each tagged .cs-reveal for fade-up-on-scroll -->
    </div>
  </div>
</section>
```
`.cs-section-label` is `position: sticky; top: 7rem` on desktop, so the numbered eyebrow stays pinned while the reader scrolls that section's content. Collapses to static, single-column below 900px.

### Reusable content blocks (pick from these before inventing something new)

| Component | Class | Shape |
|---|---|---|
| Stat row | `.cs-stat-row` + `.cs-stat` | 3-up grid, `data-count-to`/`data-suffix` numbers animate on scroll into view (`initCountUp`) |
| Two-column callouts | `.cs-recs-grid` + `.recs-col` | Used for "My role / What this covers", recommendations, research goals — flexible 2-or-3 col |
| Numbered list | `.cs-numbered-list` + `.numbered-item` | Big serif number + heading + detail, for problem points / process steps |
| Before/After | `.cs-before-after` + `.ba-card` (`.ba-after` = dark variant) | Two-column comparison; base style uses a dash (`—`) bullet, but both live case studies override with `.ba-icon-list` (custom inline SVG icon per bullet) — **use the icon-bullet variant for consistency with existing case studies**, not the plain-dash default |
| Persona cards | `.cs-persona-grid` + `.persona-card` | 3-up; base markup stacks `.persona-initial` above the name, but both live case studies use the `.persona-head` wrapper to place the initial circle inline beside the name instead — **use `.persona-head` for consistency** |
| Quotes | `.cs-quote-grid` + `.quote-card` | 2-up (can hold more, wraps) |
| Vision/impact band | `.cs-vision-band` (dark, full-bleed) | Status flag (`.vision-flag`) + lead paragraph + optional stat row |
| Timeline | `.cs-timeline` + `.timeline-item` | Left-aligned date/label + right description, stacked with hairline dividers |
| Reflection | `.cs-reflect-grid` + `.reflect-card` | 3-up "lessons learned," numbered |
| Closing note / pull-quote aside | `.cs-closing-note` | Left-border-accented single paragraph, used as an inline aside within a section |
| Next case study teaser | `.cs-next-card` | Dashed border card; becomes a live link (`<a class="cs-next-card">`) once the next case study exists |

### Patterns invented per-case-study (in a local `<style>` block, not yet in the shared stylesheet)

Both live case studies add a **local `<style>` block in `<head>`** for components the shared template doesn't have yet. These have converged independently in both files, meaning they're now de-facto shared patterns — **reuse this exact CSS (copy it into the new case study's local `<style>` block) rather than reinventing a similar-but-different version**:

- `.ba-icon-list` / `.ba-icon` — icon-bullet override for before/after lists (see table above).
- `.persona-head` — inline initial+name layout (see table above).
- `.cs-carousel` (+ `-track`, `-slide`, `-controls`, `-arrow`, `-dots`) — a 3-per-view horizontally-scrolling image carousel with prev/next arrows and dot pagination, used for wireframe/visual-design galleries. Needs the inline `<script>` at the bottom of `reimagining-employee-center.html` (`initCarousels()`) copied in too if reused.
- `.usecase-scroll` / `.usecase-card` — horizontal swipe strip of small text cards, no controls, for a large set of scenario/use-case blurbs.
- `.cs-mockup-pair` — side-by-side laptop+mobile mockup images, bottom-aligned.
- `.pillar-grid`/`.pillar-card` and `.principle-grid`/`.principle-chip` — 4-up icon-pillar grid and chip grid, used for a strategy/framework section (currently specific to Reimagining Employee Center, but reusable for any "our framework/principles" section).

**Because these live in per-page `<style>` blocks instead of `styles.css`, it's easy for a new case study to almost-but-not-quite match them (slightly different gap, a missed hover state, etc.) — that's very likely the source of the styling mismatches you've been seeing.** When a new case study needs one of the components above, copy the block verbatim from whichever existing case study has it, rather than rewriting it from memory. If a 3rd case study needs the same component, that's the trigger to promote it into `styles.css` proper and delete it from the per-page blocks.

### Reveal/scroll behavior (`case-study.js`, loaded only on case-study pages)
- `.cs-headline` text is auto-wrapped in `<span class="reveal-line"><span>...</span></span>` and mask-reveals when scrolled into view.
- Any block tagged `.cs-reveal` fades up + in when it enters the viewport (`IntersectionObserver`, threshold 0.15).
- Always add `.cs-reveal` to new content blocks inside a section (stat rows, grids, bodies) to match existing motion — a block without it will just snap into place with no animation, which reads as broken/inconsistent next to everything else on the page.

### View Transitions
Each case study needs two unique `view-transition-name` values — one on its homepage `.featured-media`/`<h3>` pair (`cs-[slug]-media` / `cs-[slug]-title`) and the matching ones on its own `.cs-cover`/`<h1>`. New names also need a matching animation-duration override block added at the bottom of `styles.css` (see the existing `::view-transition-old/new(cs-next-gen-contact-center-media)` etc. blocks) — copy that pattern for the new slug so the homepage→case-study morph transition works and doesn't collide with other case studies.

---

## 6. Placeholder block

`.placeholder-block` (diagonal hatch pattern + centered `.placeholder-tag` pill reading "Image coming soon") is the standard stand-in for any image not yet supplied. Use it instead of a grey box or leaving markup empty — swap for a real `<img>` once the asset exists, keeping the same `border-radius: inherit` container.

---

## 7. Asset & file conventions

- `assets/css/styles.css`, `assets/js/main.js`, `assets/js/case-study.js` — shared, loaded on every relevant page, never duplicated or forked per-page.
- `assets/images/case-studies/[slug]/...` — one folder per case study; `cover.png` for the hero/homepage image, then descriptively-named files per screen (e.g. `wire-home.png`, `home.png`, `laptop.png`, `mobile.png` in the Employee Center case).
- `assets/images/favicon.png`, `assets/resume/Pavithran_Resume.pdf` — global, referenced from every page's `<head>`/nav.
- New case study slugs become the HTML filename (`your-case-study-slug.html`) at the project root, matching the pattern of the two existing ones.

## 8. Checklist for adding a new case study

1. Duplicate `case-study-template.html` (the Aug 13 version), not an existing finished case study.
2. Fill every `[bracketed]` placeholder; delete sections that don't apply, duplicate item blocks for extra stats/personas/quotes.
3. Pull in any per-page components you need (carousel, use-case scroll, mockup pair, before/after icon list, inline persona head, pillar/principle grid) by copying the exact `<style>` block + markup from an existing case study — don't rewrite from scratch.
4. Tag every content block with `.cs-reveal`; leave `.cs-headline` untouched (JS wraps it automatically).
5. Set a unique `[slug]` for `view-transition-name` on both `.cs-cover` and `.cs-hero h1`; add the matching `::view-transition-old/new` timing block to `styles.css`.
6. Add a new `.featured-work` card to `index.html`'s `.work-stack`, with matching `view-transition-name`s on `.featured-media`/`<h3>`.
7. Update the `.cs-next` teaser on whichever case study should now point to this one (and set this one's own `.cs-next` to point at whatever comes after it, or leave the "coming soon" placeholder).
8. Swap every `.placeholder-block` for a real `<img>` once assets exist, using `assets/images/case-studies/[slug]/...`.
9. Re-check this file — if the new case study needs a genuinely new component, decide token/spacing/radius/motion choices from Sections 2–3 first, then build it in a local `<style>` block; promote it to `styles.css` once a second case study needs it too.
