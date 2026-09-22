---
description: Design language / UI reference for the PAVI portfolio site. Read this before creating or editing any case study or homepage section, so new work matches existing styling instead of drifting from it.
---

# PAVI Portfolio: Design System Reference

This file is the single source of truth for the site's visual language. It was reverse-engineered from the current `styles.css`, `main.js`, `case-study.js`, `index.html`, `case-study-template.html`, and the live case studies as of **Aug 13, 2026**, and has been updated repeatedly since: **Sep 18, 2026** (sitewide punctuation/casing pass), **Sep 19, 2026** ×3 (card/modal radius unification + cursor removal; `next-gen-contact-center.html` replaced with a standalone deck; the deck's back link and scroll-to-top button), and now **Sep 22, 2026** (Case 2 and Case 3 given a left-rail nav and mini-header treatment matching Case 1; Case 3's image lightbox replaced with inline galleries; Case 1 established as the base template for new case studies going forward). When adding a new case study or touching the homepage, check new markup/CSS against this doc, don't reinvent a pattern that already exists here.

## ⚠️ Case 1 is now the base template for new case studies (Sep 22, 2026)

Going forward, **`next-gen-contact-center.html` is the starting point for any new case study**, not `case-study-template.html`. This is a deliberate architecture decision, not just a visual one:

- Case 1 is a **full-viewport slide deck**: CSS scroll-snap (`main { scroll-snap-type: y proximity; }`, each `.slide { scroll-snap-align: start; min-height: 100vh; }`), one topic per screen, navigated by scrolling, the `.rail`/`.agenda` sidebar, or Arrow/Page keys (`ArrowDown`/`PageDown`/`ArrowUp`/`PageUp` step between slides, handled inline in the deck's own `<script>`).
- `case-study-template.html` (and the shell it scaffolds, described in Section 5 below) is a **continuous scrolling long-form page**: `.cs-hero` → `.cs-cover` → a sequence of `.cs-section` blocks the reader scrolls through, no snap, no discrete slides.
- These are genuinely different reading experiences, not just different chrome. A new case study should be duplicated from `next-gen-contact-center.html` (self-contained `:root` tokens, `.rail`/`.agenda`/`.slide` structure, scroll-snap, keyboard nav) rather than from `case-study-template.html`.
- `case-study-template.html` is now **legacy**: kept for reference and for maintaining the two existing case studies still built on it (`reimagining-employee-center.html`, `ux-assessment-tool.html`), but is no longer the recommended starting point for new work.
- Section 5 below still documents the scrolling-shell pattern in full, since it's what Case 2 and Case 3 are built on and will need ongoing maintenance. Section 8's checklist has been rewritten for the new case-1-based process.

## ⚠️ Known issue: duplicate files in this project

`index.html`, `case-study-template.html`, `next-gen-contact-center.html`, and `reimagining-employee-center.html` each currently exist as **two separate docs** in this project (one dated Aug 12, one dated Aug 13). `styles.css`, `main.js`, and `case-study.js` exist only once, dated Aug 13, and this reference was built from the **Aug 13 HTML versions**, which read as the newer/more complete ones (icon-bullet before/after lists, inline persona heads, carousels, etc.). Treat Aug 13 as canonical. There's also a standalone `Reimagining Employee Centre V1.html`, which looks like an older draft, not part of the current set.

Before relying on any of this blindly: if a live GitHub repo or deployed URL (Vercel, per `DEPLOY.md`) exists, that deployed HTML is the real tie-breaker, diff it against these project docs and reconcile before building on top. Worth doing a one-time cleanup pass to delete the stale duplicates from the project so future sessions can't grab the wrong one.

## ⚠️ Left-rail nav ported to Case 2 and Case 3 (Sep 22, 2026)

`reimagining-employee-center.html` and `ux-assessment-tool.html` both replaced their old `.site-nav` top bar with a left-rail nav ported from Case 1's deck, so all three case studies now share the same navigation chrome even though 2 and 3 keep the scrolling shell (see the policy note above). This pattern is currently duplicated in each page's own local `<style>`/`<script>` block, not yet promoted to `styles.css`/`main.js`, since it doesn't apply to `index.html` or the homepage nav.

Markup (replaces `<header class="site-nav">`):
```html
<div class="mobile-bar">
  <span class="mobile-bar-title">[Case Name]</span>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="rail" aria-label="Open menu">...</button>
</div>
<div class="rail-backdrop" data-nav-close></div>
<div class="shell">
  <nav class="rail" id="rail">
    <a href="index.html" class="nav-back" aria-label="Back to home">...Back</a>
    <div class="rail-head"><h1>[Case Name]</h1></div>
    <ul class="rail-agenda" id="agenda">
      <li><a href="#slug" data-target="slug">Section Name</a></li>
      ...
    </ul>
  </nav>
  <main id="main">
    ...existing .cs-hero / .cs-cover / .cs-section content, unchanged...
  </main>
</div>
```

Key points:
- `.shell` is `display: grid; grid-template-columns: 260px 1fr;`, and **`.shell > main { min-width: 0; }` is required** or `<main>` refuses to shrink below its content's intrinsic width once it becomes a grid item, causing horizontal overflow on mobile (a real bug caught and fixed while porting this to Case 2, see git history).
- Every `.cs-section` needs `id="slug" data-nav="slug"` matching its `.rail-agenda` link's `href`/`data-target`, so the two IIFEs below can find it. Case 2 already had ids on some sections; Case 3 had none and got them added fresh (`overview`, `problem`, `research`, `how-it-works`, `wireframes`, `usability-testing`, `ab-testing`, `visual-design`, `style-guide`, `reflection`).
- Below 900px (Case 1's own deck uses 1000px as its breakpoint for the same behavior, a small inherited inconsistency, not yet reconciled), the rail becomes an off-canvas panel (`position: fixed; transform: translateX(-100%)`, slides in via `.is-open`), the `.mobile-bar` hamburger bar appears, and `.cs-section[id] { scroll-margin-top: 64px; }` so anchor jumps clear the sticky mobile bar.
- Two inline `<script>` IIFEs, copied verbatim into each page: (1) mobile toggle open/close, backdrop click, Escape key, and agenda-link-closes-menu; (2) an `IntersectionObserver` on every section with an id, toggling `.is-active` on the matching `.rail-agenda a[data-target]` as the reader scrolls. `main.js`'s `initNav()` already null-checks for `.site-nav`, so removing that header is safe without touching the shared JS.
- **Mini-header eyebrows**: numbers dropped from the text (`"01 · Overview"` → `"Overview"`), font-size bumped from the shared `--fs-micro` (0.75rem) to `1rem`, and moved to sit **directly above** `.cs-headline` instead of in a separate sticky `.cs-section-label` left column — i.e. `.cs-section-inner { grid-template-columns: 1fr; }` and `.cs-section-label { position: static; margin-bottom: var(--sp-5); }`, both page-local overrides. This matches Case 1's slide pattern (`<p class="eyebrow">The Problem</p>` immediately above `<h2 class="headline">`), single column throughout, not the 0.8fr/2.2fr split described for the untouched template in Section 5.
- **Back link**: the rail's `.nav-back` (inherits the shared style otherwise) is greyed to `color: var(--text-secondary)` and given `margin-bottom: var(--sp-4)` (16px) so there's breathing room before the case title, matching Case 1's `.rail-back` spacing exactly (Case 1 itself keeps its back link `--text-primary`/black; the grey treatment is a Case 2/3–specific preference, applied consistently to both after an audit caught Case 2 still being flush/black while Case 3 had already been fixed). Scope this as `.rail .nav-back { ... }` in the page's local style block, not the shared `styles.css` `.nav-back` rule, since that class is also used elsewhere.
- The hero's top eyebrow (`"Case Study · Product Design"` / `"Case Study · UX Research & Product Design"`) was removed from both Case 2 and Case 3, so the `<h1>` is the first thing read, matching how Case 1's own cover reads.
- Browser-tab `<title>` should use the site-standard `"[Case Name] | Pavithran P"` pipe separator (Case 3 briefly used a hyphen, fixed same day).

## ⚠️ Case 3 images now shown inline, no lightbox (Sep 22, 2026)

`ux-assessment-tool.html` originally hid every screenshot behind a `.p-view` text button that opened a click-to-expand modal (`#cs-lightbox`, with prev/next through grouped images). This has been **removed entirely** (markup, CSS, and JS) in favor of showing images directly on the page, matching how Case 1 displays screenshots inline (`.concept-img-wrap`, always visible, no click required to see it).

Replacement pattern, page-local:
```css
.cs-gallery{display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:var(--sp-5);}
.cs-gallery-item{min-width:0;}
.cs-gallery-item img{display:block;width:100%;height:auto;border-radius:var(--r-card);border:1px solid var(--border-hairline);}
.cs-gallery-item figcaption{margin-top:var(--sp-3);font-size:var(--fs-small);color:var(--text-secondary);}
```
```html
<div class="cs-gallery cs-reveal">
  <figure class="cs-gallery-item">
    <img src="assets/images/case-studies/[slug]/[file].png" alt="[Title]">
    <figcaption>[Title]</figcaption>
  </figure>
  <!-- repeat per image; the grid wraps automatically for 1, 2, 3, or many images -->
</div>
```
This works uniformly whether a section has one image (auto-fit just gives it the full width) or several (wraps into a responsive grid), so it's the reusable pattern for a new case study needing to show more than one screenshot in a section, no separate "pair" vs "gallery" variant needed. `.cs-mockup-pair` (side-by-side, bottom-aligned, no crop, for laptop+mobile mockup pairs specifically) is unrelated and still valid for that specific use, it's just unused in Case 3 currently.

## ⚠️ Next Gen Contact Center is now a standalone deck, not the shared template (Sep 19, 2026)

`next-gen-contact-center.html` no longer follows the standard case-study shell described in Sections 3 and 5 below (as of Sep 22, it's now the recommended *starting point* for new case studies instead, see the policy note above, just not built by duplicating the old template). It used to be the scrolling `.cs-hero`/`.cs-section` case study built from `case-study-template.html`; that page has been archived, unchanged, as **`next-gen-contact-center-v1.html`** and is **not linked from anywhere on the site** (not the homepage, not any nav, not any other case study's "next case" card), kept only for reference.

In its place, the filename `next-gen-contact-center.html` now serves what used to be the separate, password-protected presentation deck (`next-gen-presentation.html`, already unlocked in the same-day radius/cursor pass below). The reasoning: the long-form scrolling format wasn't strong enough to present with, so the deck (already built for walking hiring managers through the case slide by slide) became the primary version of this case instead of a secondary artifact linked from it.

This means the file at `next-gen-contact-center.html` is architecturally different from Case 2 and Case 3:

- It is **fully self-contained**: its own `<style>` block with its own `:root` token set (a different px scale than the shared `styles.css`, e.g. `--r-card: 12px` is defined locally here too, not inherited). It does **not** link `assets/css/styles.css`, and does **not** load `assets/js/main.js` or `assets/js/case-study.js`. A future change to the shared design tokens (radius, color, type scale, etc.) will **not** automatically reach this page, it needs the same edit made separately here, exactly like the per-page overrides in `ux-assessment-tool.html`, just more extensive since nothing is shared at all.
- Its layout is a left-rail slide deck (`.rail` sidebar with an `.agenda` list + `.slide` sections in `<main>`, one per topic, navigated with arrow/Page keys or the rail links, CSS scroll-snap), not the scrolling `.cs-hero` → `.cs-section` → `.cs-closing` shell Case 2 and Case 3 use.
- It was given a **`.rail-back`** link (placed above `.rail-head`) and a **`.rail-contact`** row (copyright + LinkedIn + Email, placed below `.rail-foot`) so it works as a standalone entry point from the homepage. `.rail-back` is a deck-local class name (not the actual shared `.nav-back` class, the CSS rule is duplicated here, not inherited, since this page doesn't link `styles.css`), and looks and behaves like `.nav-back`: "Back" text, chevron icon, pill-radius grey hover background, `--text-primary` (black) color, `margin-bottom: var(--sp-4)` (16px) before `.rail-head`. (Case 2 and Case 3's ported `.nav-back` copies this same 16px spacing but grey the text instead of leaving it black, see the note above.)
- The case name in `.rail-head h1` is wrapped in `<a href="#s0">`; clicking it scrolls back to the Cover slide (`#s0`), i.e. the top of the deck. It's included in the same click-handler loop that closes the mobile off-canvas rail (selector is `.agenda a, .rail-head a`), so tapping it on mobile also closes the menu. The mobile top bar's `.mobile-bar-title` was made a matching `<a href="#s0">` for the same behavior on small screens.
- A floating **`.scroll-top-btn`** (fixed bottom-right circular button, black background, white up-arrow icon, `z-index: 50`) was added: hidden until the reader scrolls past ~60% of one viewport height (`window.scrollY > window.innerHeight * 0.6`), then fades/slides in; clicking it smooth-scrolls to the top. This is a pattern specific to this deck, the site's existing `.back-to-top` elsewhere is just an inline footer text link, not a floating button, not yet promoted to the shared stylesheet.
- The Closing slide (`#s15`) ends with a **`.cs-next.cs-next-double`** block: a single `More work` eyebrow, then a 2-up grid of `.cs-next-card` dashed-border links, one to `reimagining-employee-center.html` and one to `ux-assessment-tool.html`, so a reader who's done with this case can jump straight to either of the other two. This reuses the exact `.cs-next`/`.cs-next-double`/`.cs-next-card` class names and visual pattern already live at the end of `ux-assessment-tool.html` (dashed `--grey-200` border, `--grey-25` fill, hover darkens to `--grey-300`/`--grey-50`), just redeclared with the deck's own local tokens since it doesn't link `styles.css`, plus a couple of deck-specific tweaks: the radius uses the deck's `--r-lg` (12px, same value as the site's `--r-card`) since this file has no `--r-card` token, and the "More work" eyebrow sits once above the grid rather than repeated inside each card. Collapses to a single column under 640px, matching this deck's other 2-up grids.
- It has its own `<title>`/meta description/favicon/`<meta name="view-transition">` tag added to match site conventions, and its cover slide's `<h2 class="headline">` carries the `view-transition-name: cs-next-gen-contact-center-title` so the homepage→case title still morphs. There's no equivalent hero image in the deck's cover slide, so the `cs-next-gen-contact-center-media` transition on the homepage card side is unpaired, that half just fades normally on navigation instead of morphing.
- The homepage's `.featured-work` card and both other case studies' `.cs-next-card` "next case" links were **not changed**, they already pointed at the filename `next-gen-contact-center.html`, so only the identity of the file at that path changed, not any link to it.

## ⚠️ Sitewide copy pass (Sep 18, 2026)

Every em dash across every deployed file (`index.html`, both case studies, `case-study-template.html`, `next-gen-presentation.html`, `styles.css`, `main.js`, `case-study.js`) was rewritten to a period, comma, colon, or semicolon, whichever reads most naturally in that spot, not a blind find-replace. New content should follow the same rule: no em dashes (`—`) anywhere, including code comments. Use natural punctuation instead. Section-number/category eyebrows that used to be separated by an em dash (e.g. "01 — Overview") now use a middle dot instead (`01 · Overview`, `Case Study · Research & Product Design`), matching the separator already used elsewhere on the site (e.g. "Telecom · Conversational AI · Enterprise Customer Care"). (As of Sep 22, 2026, Case 2 and Case 3's section eyebrows dropped the leading number entirely, see the rail-nav note above, so this separator no longer appears in those two files' section labels specifically, it's still the convention for any eyebrow that does join two parts, e.g. the hero meta row.)

Additionally, `.eyebrow` no longer force-uppercases its text via CSS (`text-transform: uppercase` removed, `letter-spacing` reduced from `0.14em` to `0.02em`), eyebrows now render in whatever case they're typed in the HTML (sentence/title case), not full caps. This applies everywhere `.eyebrow` is used (hero eyebrow, section-number labels, meta labels like Sector/My Role/Context, before/after labels, etc.). Genuine acronyms (AI, UX, UI, YOE, SCM, PPT, AHT, etc.) were deliberately left alone, this only affects the eyebrow label component itself. The `.vision-flag` badge (used for "Projected, not yet delivered" / "Shipped, design validated with users") still uses `text-transform: uppercase` and was intentionally left as-is since it wasn't part of what was flagged, worth revisiting if the same "no full caps" rule should extend there too.

The default (unused-in-practice) before/after bullet marker in `styles.css` (`.ba-card li::before`) was also changed from a literal em dash character to a middle dot, for the same reason, even though both live case studies already override it with the icon-bullet variant.

## ⚠️ Card/modal radius unification + cursor removal (Sep 19, 2026)

Every card, modal, and cover-image surface across the whole site now uses a single **`--r-card: 12px`** radius, replacing the previous size-scaled `--r-md`/`--r-lg`/`--r-xl` (24/32/40px on the main-site scale, 22/28/36px on the standalone presentation deck's own scale) that those components used before. This is a deliberate move away from this doc's original "soft, app-icon feel" radius philosophy toward a tighter, flatter, more systematic look. The change was applied everywhere the pattern appears, not just `styles.css`, also the per-page `<style>` blocks in `reimagining-employee-center.html`, `ux-assessment-tool.html`, and the fully standalone `next-gen-presentation.html` (which defines its own `:root` tokens; that file has since been renamed to `next-gen-contact-center.html`, see the note above).

Components changed to `--r-card`: `.featured-work` (the 3 homepage case-study cards), `.cs-cover .placeholder-block` and the real case-study cover `<img>` tags, `.ba-card`, `.persona-card`, `.quote-card`, `.contact-card`, `.cs-next-card`, `.cs-vision-band`, `.usecase-card` and `.pillar-card` (Reimagining Employee Center), and, in the deck: `.lightbox-panel` (the modal shell used by every modal in the deck, plus the equivalent modal that used to exist in `ux-assessment-tool.html`, since removed entirely, see the Sep 22 note above), `#pw-gate-card` (the password-gate modal that existed at the time, since fully removed along with the rest of the password gate), `.priority-card`, `.problem-card`, `.cap-col`, `.contrib-card`, `.quote-box`, `.vision-band`, `.shipped-band`. The Reimagining Employee Center cover image previously had no `border-radius` at all (a pre-existing inconsistency, its cover rendered with sharp corners while the other two case studies' covers were rounded), it now gets `--r-card` too, so all three case-study covers match. Case 3's new inline gallery images (see the Sep 22 note above) also use `--r-card`.

Deliberately left untouched, these aren't "cards" or "modals": pill-shaped buttons/tags/badges (`--r-pill`), small circular UI (avatars, dots, icon circles), icon swatches like `.trailer-icon`, and plain bordered image frames that aren't card containers (`.cs-mockup-pair img`, `.concept-img-wrap img`, `.workshop-thumb`, dashed placeholder boxes like `.lightbox-placeholder`/`.workshop-thumb-placeholder`). Also left untouched: the `.vzmock-*` family in the deck, these simulate an actual product screen (the Verizon app UI being discussed) inside the case-study narrative, not portfolio chrome, so their radius should track whatever the real product looks like, not the portfolio's own card system. `--r-sm`/`--r-md`/`--r-lg`/`--r-xl` are all still defined and still used by these non-card elements, only reach for `--r-card` when building a new card or modal.

The site-wide custom cursor (concentric dot + trailing ring, `initCursor()` in `main.js`, `.cursor-dot`/`.cursor-ring`/`body.has-custom-cursor` in `styles.css`) has been removed entirely. The site now uses the plain default browser cursor everywhere. The now-dead `data-cursor-dark`/`data-cursor-hover` attributes were removed from `index.html`. Don't reintroduce custom-cursor code or these attributes on future pages, `--r-sm` and the `isFinePointer` check in `main.js` are still used elsewhere (magnetic buttons) and were left in place.

---

## 1. Design philosophy

- **Monochrome, flat, "Apple-adjacent."** Black / white / one cool-neutral grey ramp. No color accents anywhere, no blue links, no brand color. Contrast and whitespace do all the work.
- **One typeface everywhere.** Manrope for UI, body, and display text. `--font-serif` exists as a variable but is mapped to Manrope too, it's used to mark "editorial/display" moments (headlines, stat numbers, quote marks) at `font-weight: 400`, vs UI text which leans 500–700. Don't bring in an actual serif font.
- **Tight, uniform radius on every card, modal, and cover image**: a single 12px radius (`--r-card`), not scaled by element size. (Changed Sep 19, 2026, see note above; previously these ranged 16–40px depending on element size.) Small non-card UI chrome (skip link, icon swatches) still uses `--r-sm`/`--r-md`/`--r-lg` as before, and anything button/chip/badge-shaped stays pill (999px).
- **Editorial case-study layout, two variants**: Case 1 (the new base template, see the policy note above) is a full-viewport left-rail slide deck. Case 2 and Case 3 keep the scrolling long-form shell but now share Case 1's chrome: a left-rail nav, mini-header eyebrows sitting directly above each section's headline (single column, not a separate sticky side column anymore, see the Sep 22 note above), 1rem eyebrow size, greyed back link with 16px spacing to the title.
- **Motion is quiet and consistent**: mask/fade-up reveals on scroll, magnetic buttons, count-up numbers, never anything bouncy or attention-grabbing. Everything respects `prefers-reduced-motion`. (No longer includes a custom cursor, removed Sep 19, 2026, see note above, the site uses the default browser cursor.)
- **Content authenticity over decoration.** Placeholder blocks (diagonal hatch pattern) are used honestly when real imagery isn't ready yet, rather than faking it. Screenshots and reference images are always shown inline, never hidden behind a click-to-reveal modal (see the Sep 22 note above), an optional click-to-zoom-bigger affordance is fine, but the image itself must be visible without clicking anything first.

---

## 2. Design tokens (from `:root` in `styles.css`)

All values are CSS custom properties, always use the variable, never hardcode a hex/px value in new markup or CSS.

### Color

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0a` | Primary dark surface, primary button bg, dark cards |
| `--white` | `#ffffff` | Primary light surface |
| `--grey-25` … `--grey-800` | `#fbfbfc` → `#232326` | Full neutral ramp, cool-toned (Apple-adjacent, not warm grey) |
| `--ink` | `#111113` | `--text-primary` |
| `--surface` / `--surface-alt` | white / `--grey-50` | Page bg / subtle section bg |
| `--text-primary` / `--text-secondary` / `--text-tertiary` | ink / grey-600 / grey-400 | Text hierarchy, 3 levels only |
| `--border-hairline` | `rgba(10,10,10,0.08)` | All hairline dividers/borders |

No other colors exist in the system. If a new case study needs a status/semantic color (e.g. a red "risk" flag), that's a deliberate decision to make explicitly, not something to improvise inline, check with the shared token list first.

### Typography

- Font: `'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (both `--font-sans` and `--font-serif`).
- Fluid type scale (all `clamp()`, so it scales with viewport, never hardcode a px font-size):

| Token | Range | Typical use |
|---|---|---|
| `--fs-hero` | 2.75rem → 6.25rem | Homepage `<h1>` name, case-study `<h1>` |
| `--fs-display` | 2.1rem → 4rem | Section-level headlines (contact heading, vision/closing) |
| `--fs-cs-headline` | 1.75rem → 2.75rem | Case-study section headlines (`.cs-headline`), smaller than `--fs-display` |
| `--fs-cs-stat` | 1.5rem → 2.5rem | Case-study stat numbers (`.cs-stat .stat-num`), smaller than `--fs-cs-headline` |
| `--fs-h2` | 1.5rem → 2.25rem | Featured-work card title, next-case-study title |
| `--fs-h3` | 1.15rem → 1.5rem | Quote text, persona name, numbered-item number |
| `--fs-body-lg` | 1.05rem → 1.3rem | Dek/subhead copy, card body copy |
| `--fs-body` | 1rem (fixed) | Default body text |
| `--fs-small` | 0.875rem | Meta text, nav links, list items |
| `--fs-micro` | 0.75rem | Eyebrows, chips, tags, captions (Case 2/Case 3 section-label eyebrows are bumped to a literal 1rem instead, see the Sep 22 note above) |

- `--lh-tight` (1.05) for big display type, `--lh-snug` (1.25) for quotes, `--lh-normal` (1.55) for body copy.
- Headings (`h1–h4`) default to `font-weight: 500; letter-spacing: -0.02em`, but most display-style headings (`.cs-headline`, `.cs-hero h1`, `.contact-heading`, `.persona-card h4`) override to `font-weight: 400` on the "serif" family, that lighter weight + tight tracking is what gives the editorial feel. UI elements (nav, buttons, chips, eyebrows) stay 500–800 weight on the sans family.
- `.eyebrow` is the standard label pattern everywhere: `--fs-micro`, 600 weight, `0.02em` letter-spacing, sentence/title case as typed (no forced uppercase, see the Sep 18 note above), `--text-tertiary` color. Always use the `.eyebrow` class for section labels/tags rather than styling one-off. Use a middle dot (`·`), not an em dash, to separate parts within an eyebrow (e.g. hero meta labels); section-number prefixes have been dropped from Case 2/Case 3 entirely (see the Sep 22 note above).

### Spacing (4px base scale)

`--sp-1` (4px) through `--sp-20` (160px): 1, 2, 3, 4, 5(24), 6(32), 7(40), 8(48), 10(64), 12(96), 16(128), 20(160). Always compose spacing from this scale, no arbitrary margin/padding values.

### Radius

`--r-sm` 16px, `--r-md` 24px, `--r-lg` 32px, `--r-xl` 40px, `--r-pill` 999px, **`--r-card` 12px** (added Sep 19, 2026). `--r-card` is now the single standard for every card, modal, and cover-image surface, regardless of size, replacing the old size-scaled md/lg/xl usage on those components (see the Sep 19 note above for the full before/after list). `--r-sm`/`--r-md`/`--r-lg`/`--r-xl` remain defined and are still used by a handful of non-card elements (icon swatches, plain bordered image frames, simulated product-UI mockups in the deck), but should no longer be reached for when building a new card or modal, use `--r-card` instead. `--r-pill` unchanged for anything button/chip/badge-shaped. `next-gen-contact-center.html` (the standalone deck, now also the base template for new case studies, see the notes above) defines its own token set (slightly different px values, since it doesn't link `styles.css`) but includes its own matching `--r-card: 12px` too.

### Motion

- Easing: `--ease-out` (`cubic-bezier(0.16,1,0.3,1)`) for reveals, `--ease-in-out` for role-rotator crossfades.
- Duration: `--dur-fast` 0.25s (hovers), `--dur-med` 0.5s (nav show/hide), `--dur-slow` 0.9s (big reveals).
- Everything wraps in `@media (prefers-reduced-motion: reduce)` → durations collapse to ~0.

### Layout

- `--container`: 1320px max width, centered.
- `--gutter`: fluid `clamp(1.25rem, 4vw, 3rem)` side padding, used on every top-level section wrapper.

---

## 3. Global structural pattern

Every page **except `next-gen-contact-center.html`** (the standalone deck / new base template, see the policy note above) shares this shell:

```
<a class="skip-link">Skip to content</a>
<header class="site-nav">...</header>   <!-- homepage only; case studies use the left-rail nav instead, see the Sep 22 note above -->
<main id="main">
  ...page content...
</main>
<footer class="site-footer">...</footer>
<script>inline year-stamp script</script>
<script src="assets/js/main.js"></script>
<script src="assets/js/case-study.js"></script>  <!-- case studies only -->
```

- `<link rel="stylesheet" href="assets/css/styles.css">` in `<head>` on every page following this shell, the *only* shared stylesheet.
- `<meta name="view-transition" content="same-origin">` on every page, the site uses native cross-document View Transitions.
- Standard `<head>` boilerplate: charset, viewport, `<title>` (format: `Page Name | Pavithran P`, pipe separator, not an em dash or hyphen), meta description, favicon link, then the stylesheet. Match this exactly for new pages.

### Nav

The homepage still uses `.site-nav` as described below. Case studies (Case 1, 2, and 3 alike) now use the left-rail nav pattern instead, see the Sep 22 note above for the full markup/CSS/JS.

1. **Homepage nav** (`.site-nav`, unchanged): `position: sticky; top: 0`, translucent white background that solidifies (`.is-scrolled`) after 8px of scroll, and hides on scroll-down past 160px (`.is-hidden`), reappearing on scroll-up (handled by `initNav()` in `main.js`). `.nav-mark` (logo/initials, links home) on the left, `.nav-links` (Work, Contact, Resume button) on the right.
2. **Case-study nav**: left-rail (`.rail`/`.agenda`), not `.site-nav`. `initNav()` in `main.js` null-checks `.site-nav` (`if (!nav) return;`), so it's safe that case-study pages no longer have one.

### Footer (`.site-footer`)

Identical on every page using the shared shell: `© {year} Pavithran P.` on the left (year filled by inline script), LinkedIn / Email / "Back to top ↑" links on the right.

### Buttons

- `.btn` base + `.btn-primary` (black bg, white text, hovers to `--grey-800`) or `.btn-ghost` (grey-50 bg, hovers to grey-100). Always pill-radius.
- Wrap any button meant to feel "grabbable" in `<span class="magnetic-wrap"><a data-magnetic class="btn ...">`, this activates the cursor-follow magnetic effect (fine-pointer only, disabled under reduced motion). This is a hover-pull effect on the button itself, unrelated to the removed custom cursor (see Sep 19 note above), it's still in place.

### Cursor

Removed Sep 19, 2026 (see note above). The site now uses the browser's plain default cursor everywhere. Do not reintroduce a custom cursor/follower effect or the `data-cursor-dark`/`data-cursor-hover` attributes on future pages.

---

## 4. Homepage-specific components

- **Hero** (`.hero`): name (`.hero-name`, line-mask reveal on load via `.is-loaded`), a rotating role line (`.role-rotator`, cycles every 3.8s), stacked fact rows (`.hero-facts`, YOE/employers/location, then education), then two caption lines (`.hero-caption`), one of which (`.hero-philosophy`) is styled bolder as the "thesis statement." A quiet scroll cue sits beside the hero text on wide viewports only.
- **Featured work** (`.featured-work` inside `.work-stack`): full-bleed two-column card (`border-radius: var(--r-card)`, see Sep 19 note above), image left, dark content panel right (always `background: var(--black); color: var(--white)` on the whole card), chips (`.chip-row`/`.chip`) for tags, title, one-sentence description, and a `.featured-link` pill CTA. Has entrance reveal (`IntersectionObserver`) + subtle 3D tilt on mousemove (fine-pointer only). **This is the card used to list every case study on the homepage**, stack additional `<a class="featured-work">` entries inside `.work-stack` for each new case study, in the order they should appear. The Next Gen Contact Center entry links to `next-gen-contact-center.html`, which is now the standalone deck (see note above) and the base template for new case studies, don't be surprised when its content doesn't share the scrolling shell described in Section 5.
- **Contact** (`.contact-section`): two-column, intro/heading left, stacked `.contact-card`s right (email, phone, LinkedIn), each with a copy-to-clipboard button that appears on hover and flips to "Copied" on click (`data-copy` attribute + `initCopyButtons()`).

---

## 5. Case-study page components (legacy scrolling shell: Case 2 and Case 3)

This section describes the scrolling long-form shell that `reimagining-employee-center.html` and `ux-assessment-tool.html` are built on, scaffolded from `case-study-template.html`. As of Sep 22, 2026 this is **no longer the recommended starting point for a new case study** (Case 1's deck is, see the policy note at the top of this doc), but it's still what these two existing case studies use and need maintained, and it's still a valid pattern if a future case genuinely calls for continuous long-form scrolling instead of a slide deck.

Case 2 and Case 3 both layer the left-rail nav (Sep 22 note above) on top of this shell: the shell's content (`.cs-hero` through `.cs-next`) is unchanged, it now sits inside `.shell > main` alongside the new `.rail` sidebar, and each `.cs-section`'s eyebrow moved from a separate sticky column to directly above its headline. Read both notes together when working on these two files.

### Page shell
`.cs-hero` (eyebrow, `<h1>`, `.cs-dek` summary, `.cs-meta` 3-column Sector/Role/Context row, no eyebrow above the `<h1>` as of Sep 22, see note above) → `.cs-cover` (full-width hero image or `.placeholder-block`, `border-radius: var(--r-card)`) → a sequence of `.cs-section` blocks → `.cs-closing` (CTA back to contact) → `.cs-next` teaser card linking to the next case study.

### The section pattern (repeats for every section)
```html
<section class="cs-section" id="slug" data-nav="slug">
  <div class="cs-section-inner">
    <div>
      <div class="cs-section-label"><p class="eyebrow">Overview</p></div>  <!-- directly above the headline as of Sep 22, see note above -->
      <h2 class="cs-headline">...</h2>        <!-- mask-reveals on scroll via case-study.js -->
      <!-- one or more content blocks below, each tagged .cs-reveal for fade-up-on-scroll -->
    </div>
  </div>
</section>
```
Historically (pre-Sep 22) `.cs-section-label` was `position: sticky; top: 7rem` in its own `0.8fr` column next to a `2.2fr` content column (still true of the base `styles.css` rule, and of `case-study-template.html` itself and `ux-assessment-tool.html`/`reimagining-employee-center.html`'s original committed history). Case 2 and Case 3 now override this page-locally to a single column with the label static and directly above the headline, see the Sep 22 rail-nav note above for the exact override CSS. A brand-new case study built on this legacy shell should decide deliberately which pattern to use, the single-column version is the current visual direction, the sticky-side-column version is what `case-study-template.html` still scaffolds by default.

### Reusable content blocks (pick from these before inventing something new)

| Component | Class | Shape |
|---|---|---|
| Stat row | `.cs-stat-row` + `.cs-stat` | 3-up grid, `data-count-to`/`data-suffix` numbers animate on scroll into view (`initCountUp`) |
| Two-column callouts | `.cs-recs-grid` + `.recs-col` | Used for "My role / What this covers", recommendations, research goals, flexible 2-or-3 col |
| Numbered list | `.cs-numbered-list` + `.numbered-item` | Big serif number + heading + detail, for problem points / process steps |
| Before/After | `.cs-before-after` + `.ba-card` (`.ba-after` = dark variant) | Two-column comparison, `border-radius: var(--r-card)`; base style uses a middle-dot (`·`) bullet, but both live case studies override with `.ba-icon-list` (custom inline SVG icon per bullet), **use the icon-bullet variant for consistency with existing case studies**, not the plain-dot default |
| Persona cards | `.cs-persona-grid` + `.persona-card` | 3-up, `border-radius: var(--r-card)`; base markup stacks `.persona-initial` above the name, but both live case studies use the `.persona-head` wrapper to place the initial circle inline beside the name instead, **use `.persona-head` for consistency** |
| Quotes | `.cs-quote-grid` + `.quote-card` | 2-up (can hold more, wraps), `border-radius: var(--r-card)` |
| Vision/impact band | `.cs-vision-band` (dark, full-bleed) | `border-radius: var(--r-card)`; status flag (`.vision-flag`, still uppercase, see Sep 18 note) + lead paragraph + optional stat row |
| Timeline | `.cs-timeline` + `.timeline-item` | Left-aligned date/label + right description, stacked with hairline dividers |
| Reflection | `.cs-reflect-grid` + `.reflect-card` | 3-up "lessons learned," numbered |
| Closing note / pull-quote aside | `.cs-closing-note` | Left-border-accented single paragraph, used as an inline aside within a section |
| Inline image gallery | `.cs-gallery` + `.cs-gallery-item` | Responsive grid, 1 to many images, each with a `<figcaption>`; always visible, no click-to-open modal, see the Sep 22 note above. Currently only in `ux-assessment-tool.html`'s local style block, promote to `styles.css` if a second case needs it |
| Next case study teaser | `.cs-next-card` | Dashed border card, `border-radius: var(--r-card)`; becomes a live link (`<a class="cs-next-card">`) once the next case study exists |

### Patterns invented per-case-study (in a local `<style>` block, not yet in the shared stylesheet)

`reimagining-employee-center.html`, `ux-assessment-tool.html`, and the archived `next-gen-contact-center-v1.html` add a **local `<style>` block in `<head>`** for components the shared template doesn't have yet. Several of these have converged independently across files, meaning they're now de-facto shared patterns, **reuse this exact CSS (copy it into the new case study's local `<style>` block) rather than reinventing a similar-but-different version**:

- The full left-rail nav pattern (`.shell`/`.rail`/`.rail-agenda`/`.mobile-bar`/`.nav-toggle`/`.rail-backdrop` + the two nav IIFEs), see the Sep 22 note above, now identical (modulo the 900px vs 1000px breakpoint quirk) across all three case studies.
- `.cs-gallery`/`.cs-gallery-item`, inline image gallery, see the Sep 22 note above.
- `.ba-icon-list` / `.ba-icon`, icon-bullet override for before/after lists (see table above).
- `.persona-head`, inline initial+name layout (see table above).
- `.cs-carousel` (+ `-track`, `-slide`, `-controls`, `-arrow`, `-dots`), a 3-per-view horizontally-scrolling image carousel with prev/next arrows and dot pagination, used for wireframe/visual-design galleries. Needs the inline `<script>` at the bottom of `reimagining-employee-center.html` (`initCarousels()`) copied in too if reused. (Note: Case 3 uses the simpler `.cs-gallery` grid instead for its equivalent galleries, not this carousel, the two components overlap in purpose, pick whichever fits the number of images better, a carousel for many images that shouldn't all show at once, a gallery grid otherwise.)
- `.usecase-scroll` / `.usecase-card`, horizontal swipe strip of small text cards, no controls, for a large set of scenario/use-case blurbs (`.usecase-card` uses `border-radius: var(--r-card)` as of Sep 19, 2026).
- `.cs-mockup-pair`, side-by-side laptop+mobile mockup images, bottom-aligned (the images themselves keep their existing frame radius, not `--r-card`, see the Sep 19 note above, these are image frames, not cards).
- `.pillar-grid`/`.pillar-card` and `.principle-grid`/`.principle-chip`, 4-up icon-pillar grid and chip grid, used for a strategy/framework section (currently specific to Reimagining Employee Center, but reusable for any "our framework/principles" section). `.pillar-card` uses `border-radius: var(--r-card)` as of Sep 19, 2026; `.principle-chip` is a label chip, not a card, and keeps `--r-md`.

**Because these live in per-page `<style>` blocks instead of `styles.css`, it's easy for a new case study to almost-but-not-quite match them (slightly different gap, a missed hover state, etc.), that's very likely the source of the styling mismatches you've been seeing.** When a new case study needs one of the components above, copy the block verbatim from whichever existing case study has it, rather than rewriting it from memory. If a component is duplicated across multiple case studies (like the ones above), that's the trigger to promote it into `styles.css` proper and delete it from the per-page blocks.

### Reveal/scroll behavior (`case-study.js`, loaded only on case-study pages using the shared template)
- `.cs-headline` text is auto-wrapped in `<span class="reveal-line"><span>...</span></span>` and mask-reveals when scrolled into view.
- Any block tagged `.cs-reveal` fades up + in when it enters the viewport (`IntersectionObserver`, threshold 0.15).
- Always add `.cs-reveal` to new content blocks inside a section (stat rows, grids, bodies) to match existing motion, a block without it will just snap into place with no animation, which reads as broken/inconsistent next to everything else on the page.

### View Transitions
Each case study needs two unique `view-transition-name` values, one on its homepage `.featured-media`/`<h3>` pair (`cs-[slug]-media` / `cs-[slug]-title`) and the matching ones on its own `.cs-cover`/`<h1>`. New names also need a matching animation-duration override block added at the bottom of `styles.css` (see the existing `::view-transition-old/new(cs-next-gen-contact-center-media)` etc. blocks), copy that pattern for the new slug so the homepage→case-study morph transition works and doesn't collide with other case studies. (The deck at `next-gen-contact-center.html` only pairs the title half of this, see the standalone-deck note above.)

---

## 6. Placeholder block

`.placeholder-block` (diagonal hatch pattern + centered `.placeholder-tag` pill reading "Image coming soon") is the standard stand-in for any image not yet supplied. Use it instead of a grey box or leaving markup empty, swap for a real `<img>` once the asset exists, keeping the same `border-radius: inherit` container (inherits `--r-card` from its parent, e.g. `.cs-cover`, as of Sep 19, 2026). Never gate the placeholder (or the eventual real image) behind a click-to-reveal modal, see the "content authenticity" and Sep 22 notes above, images are always shown inline.

---

## 7. Asset & file conventions

- `assets/css/styles.css`, `assets/js/main.js`, `assets/js/case-study.js`, shared, loaded on every page that uses the standard scrolling template (everything except the `next-gen-contact-center.html` deck, see note above). A future new case study built on the deck pattern will similarly not load these, following Case 1's fully self-contained approach.
- `assets/images/case-studies/[slug]/...`, one folder per case study; `cover.png` for the hero/homepage image, then descriptively-named files per screen (e.g. `wire-home.png`, `home.png`, `laptop.png`, `mobile.png` in the Employee Center case; `wire-home.png`, `visual-home.png`, `style-primary-colors.png` etc. in the UX Assessment Tool case).
- `assets/images/favicon.png`, `assets/resume/Pavithran_Resume.pdf`, global, referenced from every page's `<head>`/nav.
- New case study slugs become the HTML filename (`your-case-study-slug.html`) at the project root, matching the pattern of the existing ones.

## 8. Checklist for adding a new case study

**As of Sep 22, 2026, build a new case study by duplicating `next-gen-contact-center.html`** (the deck), not `case-study-template.html` (the legacy scrolling scaffold, see the policy note at the top of this doc). The steps below reflect that:

1. Duplicate `next-gen-contact-center.html`, rename to the new case's slug (`your-case-study-slug.html`).
2. Update the file's own `:root` token block if anything genuinely needs to differ (it shouldn't, normally, these should match the shared `styles.css` tokens, they're only local because this deck format doesn't link the shared stylesheet), then work through its `.slide` sections: rewrite each one's eyebrow/headline/body for the new case, delete slides that don't apply, duplicate a slide for new topics, keeping the `.rail`/`.agenda` list in sync with each slide's `id`.
3. Pull in whichever content-block components the new case needs (stat rows, before/after, personas, quotes, numbered lists, reflection grid, inline image gallery) by copying the exact markup/CSS from an existing case study rather than rewriting from scratch, see Section 5's component table (these are shared in spirit across both the deck and the legacy scrolling shell, the visual language is the same either way, only the outer page mechanics differ).
4. Set a unique `[slug]` for `view-transition-name` on the deck's cover slide `<h2 class="headline">`; add the matching homepage-side transition if pairing a hero image (the current deck's cover has no image, so its homepage transition is unpaired, a new case study with a real cover image should pair both halves properly, following the pattern Case 2/Case 3 use, not the current Case 1 gap).
5. Add a new `.featured-work` card to `index.html`'s `.work-stack`, with matching `view-transition-name`s on `.featured-media`/`<h3>`.
6. Update the `.cs-next`/`.cs-next-double` teaser on the deck's closing slide, and on whichever other case studies' teasers should now point to this one.
7. Swap every placeholder/`[bracketed]` note for real content and images once assets exist, using `assets/images/case-studies/[slug]/...`. Show images inline directly in their slide, never behind a click-to-open modal (an optional click-to-zoom-bigger affordance, like the deck's own `data-zoom` pattern, is fine, but the image itself must already be visible).
8. Set the browser-tab `<title>` using the site-standard `"[Case Name] | Pavithran P"` pipe format, and matching meta description/favicon/`view-transition` meta tag.
9. No em dashes anywhere (headlines, body copy, code comments), use a period, comma, colon, or semicolon depending on what reads naturally. Eyebrow-style labels use a middle dot (`·`) to join parts where they do join parts, drop leading numbers from section eyebrows entirely (matching the current Case 2/Case 3/Case 1 convention).
10. Don't add a custom cursor or `data-cursor-*` attributes, the site uses the plain default cursor (removed Sep 19, 2026).
11. Re-check this file, if the new case study needs a genuinely new component, decide token/spacing/radius/motion choices from Sections 2–3 first, then build it in a local `<style>` block; promote it to `styles.css` once a second case study needs it too. New cards/modals use `--r-card` (12px), not `--r-md`/`--r-lg`/`--r-xl`.

**If a case genuinely calls for continuous scrolling instead of a slide deck** (a deliberate exception, not the default), fall back to duplicating `case-study-template.html` and follow Section 5's legacy shell pattern instead, still applying the left-rail nav, single-column eyebrow-above-headline, greyed back link, and inline-image-gallery conventions documented above rather than that template's older sticky-side-column defaults.
