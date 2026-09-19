---
description: Design reference for next-gen-presentation.html (the "Left nav case 1" interview-deck version of the NGCC case study). Kept separate from the site-wide DESIGN-SYSTEM.md for now - this file's tokens and patterns have NOT been reconciled with or adopted into the main site system. Read this before editing next-gen-presentation.html; read DESIGN-SYSTEM.md for everything else in the project.
---

# NGCC Presentation Deck - Design Reference (Case 1)

`next-gen-presentation.html` is a self-contained, single-file interview deck (left-hand sticky nav rail + main scroll column), separate from the live case-study page (`next-gen-contact-center.html`) and linked from it via the "PPT" button. It does **not** share `styles.css` - all CSS lives in its own `<style>` block, with its own local token set. Do not assume a value here matches the site-wide system; where they overlap it's coincidence, not shared source.

`next-gen-presentation-v1.html` is the archived pre-"Left nav case 1" version, kept in the folder for reference. Do not edit it going forward - all future work happens on `next-gen-presentation.html`.

---

## 1. Local design tokens (`:root` in the deck's own `<style>` block)

| Token | Value | Note |
|---|---|---|
| `--r-sm` / `--r-md` / `--r-lg` / `--r-xl` | all `12px` | Unified to a single flat radius across every card and image this session - previously a scaled ramp (14/22/28/36px). Keep them equal going forward; don't reintroduce a scale here without an explicit decision to. |
| `--r-pill` | `999px` | Untouched - still used for circular/pill elements only (nav dots, zoom-icon circles, badges). Never flatten these to match the 12px card radius. |
| `--sp-2` … `--sp-10` | 0.5rem → 4rem | No `--sp-1` (4px) token exists. Several micro-gaps (2-8px) are still hardcoded inline for lack of one - worth adding a `--sp-1: 4px` token if this file gets more work. |
| `--fs-micro` / `--fs-small` / `--fs-body` / `--fs-body-lg` / `--fs-h3` / `--fs-display` | 0.72rem → fluid display size | Fixed rem values, not the site's `clamp()` fluid scale. |
| `--text-primary` / `--text-secondary` / `--text-tertiary` | ink / grey-600 / grey-400 | Same 3-level hierarchy concept as the site, but `--text-tertiary` (`#a3a3a8`) measures only ~2.3-2.5:1 contrast against white/grey-50 - fails WCAG AA. It's used for every eyebrow/label in the deck, and became more visible once eyebrows were bumped to body-copy size (see below). Flagged, not yet fixed - darken this token or move labels to `--text-secondary` (6.3-6.9:1, passes) before this is considered done.

## 2. Eyebrow / mini-headline convention

- No leading numbers. Every section eyebrow (`<p class="eyebrow">`) was stripped of its `"NN - "` prefix this session - it's `"Trade-offs, Challenges & Constraints"`, not `"10 - Trade-offs, Challenges & Constraints"`. Don't reintroduce numbering.
- Font size matches body copy (`var(--fs-body)`, 16px), not a small "micro" label size like the site's eyebrows. Still bold + grey to read as a label, not a paragraph.
- No `text-transform: uppercase` anywhere in this file - eyebrows, card labels (`.contrib-label`), the "Selected direction" tag, and the shipped/projected flags in Impact were all de-capped this session and should stay in natural sentence case. Real acronyms typed in the copy (AHT, ACSS, FCR, AI, UX, POC, etc.) are literal text, not CSS-driven, and are unaffected either way.

## 3. Layout: left nav rail + mobile hamburger

- Desktop (>1000px): `.shell` is a `260px 1fr` grid - `.rail` is `position: sticky; top:0; height:100vh`, unchanged this session.
- Mobile (≤1000px, new this session): `.rail` is no longer inlined at the top of the page. It's now a fixed off-canvas panel (`transform: translateX(-100%)` → `.is-open { transform: translateX(0) }`), triggered by a new sticky `.mobile-bar` (title + hamburger `.nav-toggle` button) that sits outside `.shell`, plus a `.rail-backdrop` overlay. JS lives in its own IIFE near the top of the deck's `<script>` block - toggle open/close, close on backdrop click, close on Escape, close on any agenda link click. Reuse this pattern (don't reinvent) if another full-bleed section ever needs a mobile off-canvas treatment.
- `.nav-toggle` and `.agenda a` have a `:focus-visible` outline now - the only two focus states in the file. Everything else (carousel buttons/dots, zoom triggers) still has no custom focus style; if this file gets more accessibility passes, that's the next gap.

## 4. Known open items (not yet fixed)

- `--text-tertiary` contrast (section 1) - highest priority.
- No `--sp-1` token for sub-8px gaps (section 1).
- Grounding the Design (`#s9`) still carries a condensed one-line paraphrase of the storyboard narrative that's now redundant with the dedicated Storyboard section (`#s7`) - flagged, not removed, pending a decision.
- Research Approach (`#s5`) and Concept Exploration (`#s8`) run noticeably longer/taller than every other section (breaks the deck's one-screen-per-idea rhythm). A trim was drafted and reverted this session at the user's call ("recommendation has not come very well") - open for a different approach later.
- Heading levels skip from `h2` straight to `h4` (no `h3` anywhere in the file).
- The zoom/lightbox view always renders `alt=""` on the enlarged image instead of inheriting the source image's alt text.

## 5. Relationship to the site-wide system

This file's tokens (flat 12px radii, fixed rem type scale, no-caps eyebrows) are deliberately **not** merged into `DESIGN-SYSTEM.md` or `styles.css`. Treat this as a standalone reference until/unless a decision is made to bring any of these patterns (especially the no-caps eyebrow convention, or the mobile off-canvas nav pattern) into the main site system - at that point, update `DESIGN-SYSTEM.md` directly and note the change there, not here.
