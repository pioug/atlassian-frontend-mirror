# Pre-work: settle the `of S` argument list, and its interaction with `NoUnsafeNthChildSelectors`

**Closed question:** what exactly goes inside `of :not(:where(…))` before the codemod is generated.

**Scope read:** §0.2 subsection "Settle the `of` list before generating the codemod — and add
`style`", §0.3 "Why specificity is unchanged", Phase 5. Plus the §0.2 Scale table, read narrowly to
adjudicate the "~4,400 lines" figure that Phase 5 depends on.

**Method:** source reading for the ratchet rule; `node -e` for regex visibility; **real browser
engine** (Chrome for Testing 143.0.7499.4 via the repo's Playwright `chromium_headless_shell-1200`,
`--dump-dom`) for `of S` matching semantics and for specificity, measured empirically through
cascade order rather than asserted. jsdom was not used anywhere. Scratch harnesses:
`scratchpad/of-list-test.html`, `scratchpad/where-weight-test.html` (not checked in). Term
candidates were settled against a dedicated survey of what AFM actually injects as a sibling into
arbitrary containers (evidence inlined in the term table below).

**No source files were edited.**

---

## Claims verified / refuted

| #     | Claim                                                                                                            | Verdict                                                                                | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1a    | Rule lives at `no-unsafe-nth-child-selectors.ts:74` with regexes `[/:first-child/, /:nth-child/, /:last-child/]` | **VERIFIED (exact)**                                                                   | `/Users/areardon/atlassian/afm/master/platform/packages/monorepo-tooling/ratcheting/src/rules/no-unsafe-nth-child-selectors.ts:74` — `regexes: [/:first-child/, /:nth-child/, /:last-child/],`. Line number and regex list both exactly as the plan states.                                                                                                                                                                                                                                                                                                                    |
| 1b    | Registered at `ratcheting-rules.ts:160`                                                                          | **VERIFIED (exact)**                                                                   | `/Users/areardon/atlassian/afm/master/platform/monorepo.config/tasks/ratcheting/rules/ratcheting-rules.ts:160` (import at `:22`). Owner comment at `:159` reads `// Owner: UI Styling Standard #help-ui-styling-standard`.                                                                                                                                                                                                                                                                                                                                                     |
| 1c    | A checked-in baseline records the current violation count                                                        | **REFUTED**                                                                            | No baseline file exists. The ratchet is **diff-based**: `check-ratchet.ts:88` resolves `getMergeBaseCommit(baseBranch)` and `:149` logs `git diff <mergeBase> <head>`; counts come from `git grep` at each commit (`get-count.ts:47-57`). Nothing is persisted. `platform/ratcheting.config.js` is a 10-line re-export with no counts.                                                                                                                                                                                                                                         |
| 2     | The rule exists for injected `<style>` tags (SSR / devloops), **not** top layer                                  | **VERIFIED**                                                                           | `no-unsafe-nth-child-selectors.ts:76`: `'…to prevent issues in SSR and certain devloops when \`<style>\` tags are injected.'` No mention of top layer, popover or dialog anywhere in the file.                                                                                                                                                                                                                                                                                                                                                                                 |
| 3     | `:nth-last-child` is invisible to all three regexes                                                              | **VERIFIED**                                                                           | `node -e`: `/:last-child/.test(':nth-last-child')` → **`false`**; `/:nth-child/` → `false`; `/:first-child/` → `false`. The regexes require a literal **colon** immediately before `last-child`; in `:nth-last-child` that position holds `-`. Full per-form results in the ratchet table below.                                                                                                                                                                                                                                                                               |
| 3b    | Phase 5: the effect differs per guard form — `:last-child` reduces, `:not(:first-child)` is net-neutral          | **VERIFIED**                                                                           | `:nth-child(…)` forms stay visible via `/:nth-child/`, `:nth-last-child(…)` forms go invisible. Plan's per-form claim is exactly right; only its magnitude is wrong (3c).                                                                                                                                                                                                                                                                                                                                                                                                      |
| 3c    | Phase 5's "~4,400 `:last-child` lines that stop being matched"                                                   | **REFUTED — magnitude wrong by ~7×**                                                   | The ratchet counts **colon-prefixed** strings in `*.js/*.ts/*.jsx/*.tsx` only. Actual ratchet-visible `:last-child`: **665 lines repo-wide**, and the true count drop is bounded by lines matching `:last-child` and _nothing else_ = **607 repo-wide / 101 in `platform/`**. Also the Scale table itself does not reproduce (below).                                                                                                                                                                                                                                          |
| 4     | `of :not(:where([popover], dialog, style))` correctly skips an injected `<style>` sibling                        | **VERIFIED IN A REAL ENGINE**                                                          | Chrome 143. `[a,b,c,style]`: `#c:last-child` = `false`, `#c:nth-last-child(1 of GUARD)` = **`true`**. `[style,a,b]`: `#a:first-child` = `false`, `#a:nth-child(1 of GUARD)` = **`true`**. Also verified for `[popover]` (case C), `dialog` (case D), both at once (case E), the `n+2` forms (F, G), and the typed form `div:nth-last-child(1 of GUARD)` (I).                                                                                                                                                                                                                   |
| 4b    | §0.3: "Because a match must itself be in the `of` list, the host can never receive the declaration either"       | **VERIFIED**                                                                           | Chrome 143, case H: `[a, div[popover]]` → `#p:nth-last-child(1 of GUARD)` = `false`. The guard is self-excluding, so `of S` genuinely replaces the outer guard.                                                                                                                                                                                                                                                                                                                                                                                                                |
| 5     | All §0.2 before/after pairs are specificity-equal with the 4-term guard                                          | **VERIFIED IN A REAL ENGINE**                                                          | 5/5 pairs `EQUAL` by cascade-order test in Chrome 143, with a passing control that detects a real inequality. See specificity table.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 5b    | `:only-child` is the exception, (0,2,0) vs (0,1,0)                                                               | **VERIFIED**                                                                           | Chrome 143: `*:only-child` vs `:nth-child(1 of G):nth-last-child(1 of G)` → `AFTER-MORE-SPECIFIC`. Confirms it is residue, not a codemod target.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 5c    | `:where()` is load-bearing — `of :not([popover], dialog, style)` would be (0,2,0)                                | **VERIFIED**                                                                           | Chrome 143: guard-with-`:where` vs guard-without → `AFTER-MORE-SPECIFIC`. Dropping `:where()` really does break neutrality.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 5d    | Specificity is independent of **how many** terms, and of their kind                                              | **VERIFIED (new finding)**                                                             | Chrome 143: `*:last-child` is `EQUAL` to a 4-term guard, an 8-term guard, and a guard containing `#an-id`, `.some-class` and `[data-x="y"]`. Direct test: `:where(#z)` is weightless. **List length and term kind carry zero specificity cost** — so the "can never cheaply remove" cost is about behavioural commitment and review surface, not the cascade.                                                                                                                                                                                                                  |
| 6     | Should any **further** term be in the list?                                                                      | **YES — `template` and `link` have direct evidence; `script`/`noscript` on principle** | See the term-by-term table. `script`, portal containers, `noscript` and body-level announcers were **excluded on evidence**; `[hidden]` excluded on semantics; `[data-focus-guard]` is a real hazard escalated to a human rather than silently included.                                                                                                                                                                                                                                                                                                                       |
| §0.3a | §0.3: `of S` "already shipping in `editor-common`, `editor-core`, `renderer` and `editor-plugin-block-controls`" | **PARTLY REFUTED**                                                                     | `editor-common` ✅ (`packages/editor/editor-common/src/styles/shared/table.ts:39`), `editor-core` ✅ (9 sites), `renderer` ✅ (`packages/editor/renderer/src/ui/Renderer/RendererStyleContainer.tsx:2437`). **`editor-plugin-block-controls` has zero `of S` usage** — it appears in the ratchet's _exclusion_ list (`no-unsafe-nth-child-selectors.ts:42`) for raw `:first-child`, which is the opposite of shipping the guard. The genuine fourth adopter is `editor-plugin-floating-toolbar` (`packages/editor/editor-plugin-floating-toolbar/src/ui/Toolbar.tsx:647,667`). |
| §0.3b | §0.3: "both Compiled and emotion emit it intact, commas inside `of :not(...)` included"                          | **NOT VERIFIED HERE**                                                                  | No checked-in emitted artifact contains `of :not(` (`git grep 'of :not(' -- '*.snap' '*.css'` → 0 hits), and `node_modules` is not installed in this worktree, so the transform could not be exercised. This is §0.2's "prove the round-trip" prerequisite. **Adding `style` introduces no new syntax class** — it is one more comma in a comma list that already ships — so my recommendation does not increase this risk.                                                                                                                                                    |
| 7     | The rule advises `*-of-type`, which has no `of S` form                                                           | **VERIFIED**                                                                           | `no-unsafe-nth-child-selectors.ts:76`: `'Please use \`&:first-of-type\`, \`&:nth-of-type(…)\` and \`&:last-of-type\` instead.'` Replacement wording proposed below.                                                                                                                                                                                                                                                                                                                                                                                                            |
| —     | §0.2 Scale table figures (`first-child` 6,064 lines / `last-child` 4,444 lines)                                  | **NOT REPRODUCIBLE**                                                                   | Same tool and globs the plan names (`rg` over `*.ts`/`*.tsx`/`*.css`) gives `first-child` **1,301 lines / 468 files** and `last-child` **853 / 451** — ~4.7× lower on lines. Unfiltered `rg` (all file types) still only reaches 1,888 / 1,414. Files columns are also off (plan 658/578 vs measured 468/451).                                                                                                                                                                                                                                                                 |

---

## Ratchet-effect table

The ratchet counts **matching lines, deduplicated per rule** — `create-chunk-handler.ts:117-125`
`break`s after the first regex that matches a line, and `get-count.ts:56` takes `resultLines.length`
from `git grep`. So one line with two different offending pseudo-classes counts once.

| Guard form (before → after)                               | ratchet-visible before | ratchet-visible after | net effect        |
| --------------------------------------------------------- | ---------------------- | --------------------- | ----------------- |
| `X:last-child` → `X:nth-last-child(1 of S)`               | ✅ `/:last-child/`     | ❌ none               | **lowers**        |
| `& > :not(:last-child)` → `& > :nth-last-child(n+2 of S)` | ✅ `/:last-child/`     | ❌ none               | **lowers**        |
| `X:first-child` → `X:nth-child(1 of S)`                   | ✅ `/:first-child/`    | ✅ `/:nth-child/`     | **holds**         |
| `& > :not(:first-child)` → `& > :nth-child(n+2 of S)`     | ✅ `/:first-child/`    | ✅ `/:nth-child/`     | **holds**         |
| existing `:nth-child(k)` → `:nth-child(k of S)`           | ✅ `/:nth-child/`      | ✅ `/:nth-child/`     | **holds**         |
| `X` → `X:not(:where(…))` (outer-guard-only form)          | ❌ none                | ❌ none               | **holds at zero** |
| `:only-child` (residue, not codemodded)                   | ❌ none                | ❌ none               | **holds at zero** |

**Net effect: mixed per-form; monotonically non-increasing in aggregate — it can never raise.**

Measured magnitude (this checkout, `git grep` over the rule's `included` globs, before applying the
rule's `excluded` list):

| Population                                                                 | repo-wide | `platform/` only                       |
| -------------------------------------------------------------------------- | --------- | -------------------------------------- |
| ratchet-visible lines (any of the three, per-line dedupe)                  | 1,843     | 539 (526 after the major dir excludes) |
| lines with **only** `:last-child` → become invisible                       | **607**   | **101**                                |
| lines with `:first-child`/`:nth-child` and no `:last-child` → stay visible | 1,178     | —                                      |
| mixed lines (both families) → stay visible                                 | 58        | —                                      |

So the worst-case count drop is **607 repo-wide (33%)**, not ~4,400. Ratcheting runs per product
with product-relative paths (`excluded` mixes `packages/editor/…` with `src/packages/…` and
`platform/packages/…`), so each product sees only its own slice.

**Two blind spots worth recording while we are here:**

- **`.css` files are invisible to this ratchet entirely.** `included` is
  `['**/*.js','**/*.ts','**/*.jsx','**/*.tsx']` (`no-unsafe-nth-child-selectors.ts:5`), and there
  are **436** lines matching the three patterns in `*.css`. The codemod will rewrite them; the
  ratchet never saw them, so they neither raise nor lower it.
- The description string is propagated into
  `packages/design-system/ads-mcp/src/tools/get-lint-rules/lint-rules-structured-content.codegen.tsx`
  and `packages/monorepo-tooling/ratcheting/ratcheting-jira.toml`. The codegen file is already in
  `excluded` (`:44`), so rewording the description is safe — and the proposed wording adds only
  `:nth-last-child`, which no regex matches.

---

## Specificity table

Rules applied (Selectors 4 §17): `:where()` → always (0,0,0); `:not(S)` → specificity of the most
specific complex selector in `S`; `:nth-child(An+B of S)` → (0,1,0) for the pseudo-class **plus**
the most specific complex selector in `S`; `*` → (0,0,0); type selector → (0,0,1).

With `G = :not(:where([popover], dialog, style))`, `G` = **(0,0,0)**.

| #   | before                                  | (a,b,c) | after                                                  | (a,b,c)     | hand          | Chrome 143                                            |
| --- | --------------------------------------- | ------- | ------------------------------------------------------ | ----------- | ------------- | ----------------------------------------------------- |
| 1   | `& > *:last-child`                      | (0,1,0) | `& > :nth-last-child(1 of G)`                          | (0,1,0)     | equal         | **EQUAL**                                             |
| 2   | `& > div:last-child`                    | (0,1,1) | `& > div:nth-last-child(1 of G)`                       | (0,1,1)     | equal         | **EQUAL**                                             |
| 3   | `& > :not(:last-child)`                 | (0,1,0) | `& > :nth-last-child(n+2 of G)`                        | (0,1,0)     | equal         | **EQUAL**                                             |
| 4   | `& > :not(:first-child)`                | (0,1,0) | `& > :nth-child(n+2 of G)`                             | (0,1,0)     | equal         | **EQUAL**                                             |
| 5   | `& > *:first-child`                     | (0,1,0) | `& > :nth-child(1 of G)`                               | (0,1,0)     | equal         | **EQUAL**                                             |
| —   | `*:only-child`                          | (0,1,0) | `:nth-child(1 of G):nth-last-child(1 of G)`            | **(0,2,0)** | **not equal** | **AFTER-MORE-SPECIFIC**                               |
| ctl | `div`                                   | (0,0,1) | `*:last-child`                                         | (0,1,0)     | not equal     | AFTER-MORE-SPECIFIC (harness detects real inequality) |
| neg | `:nth-last-child(1 of :not(:where(…)))` | (0,1,0) | `:nth-last-child(1 of :not([popover], dialog, style))` | (0,2,0)     | not equal     | AFTER-MORE-SPECIFIC (`:where()` is load-bearing)      |

Method for the browser column: both selectors are scoped to the same clean 3-child container where
they match the same element, then declared in both orders. If the later declaration wins in **both**
orders, specificity is equal. The control row proves the harness detects genuine inequality.

**§0.2's `of` list is safe at any length.** Adding terms — including id, class and attribute terms —
was measured `EQUAL` up to 8 terms.

---

## Term-by-term decision

Every term is specificity-free (claim 5d), so cost is not measured in cascade weight — it is that
each term is a permanent semantic commitment across every rewritten site, removable only by a second
sweep.

**The decision principle that falls out of the evidence:** for an element the UA stylesheet renders
as `display:none` — `style`, `script`, `template`, `link`, `noscript` — _nothing in any codebase
ever positionally selects it on purpose_. Including such a term therefore **cannot break correct
code**, while omitting one leaves a silent bug that costs the second sweep. For never-rendered
elements inclusion is strictly safer than omission, so the list should be the **complete** set of
them rather than only those with evidence today. For anything that _is_ rendered (`[hidden]`, focus
guards, announcer spans, measurement divs) the reverse holds and each needs positive justification.

| Term                                      | Decision                                                           | Reason (≤1 sentence)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[popover]`                               | **include**                                                        | One of the two ways HTML enters the top layer, and a confirmed in-place host kind (`div[popover]` for `@atlaskit/flag`, `insertion-positions-in-place.md:24`).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `dialog`                                  | **include**                                                        | The other entry path — `showModal()` carries no `popover` attribute — and the confirmed host kind for `modal-dialog` and `drawer` under the gate.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `style`                                   | **include**                                                        | The sole reason the ratchet exists, browser-verified to shift position, already shipped as the first term of the editor's own `of` list, and now confirmed to land in arbitrary containers three separate ways (below).                                                                                                                                                                                                                                                                                                                                                           |
| `template`                                | **include**                                                        | Never-rendered, and there is direct evidence: `jira/src/packages/ssr/rendering-guard/src/index.tsx:94` returns a bare `<template data-jira-ssr-fallback>` in place of a Suspense fallback, plus React's own streaming `<template id="B:n">` nodes inside boundaries (`jira/src/packages/ssr/ssr-failure-tracker/src/tracker.tsx:70`) and `HydrationMarker.tsx:13`.                                                                                                                                                                                                                |
| `link`                                    | **include**                                                        | Never-rendered, and directly evidenced inline in body: `platform/packages/design-system/theme-switcher/src/ui/theme-switcher/index.tsx:135` renders N `<link rel="preload">` as **leading siblings** of its `DropdownMenu`; same at `identity/account-menu/src/ui/theme-switcher/index.tsx:45` and two `company-hub` sites.                                                                                                                                                                                                                                                       |
| `script`                                  | **include (on principle, not evidence)**                           | No AFM path injects one into a product container — every `appendChild(script)` targets `document.head`/`body` — but it is never-rendered, so the term is free and forecloses the one remaining never-rendered gap.                                                                                                                                                                                                                                                                                                                                                                |
| `noscript`                                | **include (on principle, not evidence)**                           | Zero occurrences anywhere in `platform/`, `jira/` or `confluence/`; included only to complete the never-rendered set at zero cost.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `[hidden]`                                | **exclude (strong)**                                               | Product-owned _visual state_, not injected noise — excluding hidden elements from position counting would silently change intended behaviour at thousands of sites, a semantic change the codemod has no mandate for.                                                                                                                                                                                                                                                                                                                                                             |
| portal container div / `#ds-portal`       | **exclude**                                                        | `@atlaskit/portal` hard-pins `.atlaskit-portal-container` to `body >` with no configurable mount point (`portal/src/internal/utils/create-portal-parent.tsx:17`, `constants.tsx:2`), and there is no `#ds-portal` in the repo at all.                                                                                                                                                                                                                                                                                                                                             |
| emotion / Compiled runtime style tags     | **covered by `style`**                                             | They are `<style>` elements; no separate term needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| focus-lock guards (`[data-focus-guard]`)  | **defer to human — genuine hazard, but rendered + vendor-coupled** | react-focus-lock renders 1–3 zero-size `<div data-focus-guard>` siblings around its container (`node_modules/react-focus-lock/dist/es2015/Lock.js:129,160`) and product code drops locks into arbitrary containers (`bulk-operations/platform-context-menu/.../focus-lock-wrapper/index.tsx:10`, `eoc/focus-state/src/ui/focus-state/container/index.tsx:33`, `ai-mate/conversation-assistant-widget/src/ui/main-header/index.tsx:3`) — but the attribute is a third-party implementation detail, so hard-coding it into ~1,800 selectors is a coupling decision, not a free one. |
| announcer / live-region nodes (pdnd, rbd) | **exclude**                                                        | All confirmed `document.body`-only singletons (`pragmatic-drag-and-drop/live-region/src/index.tsx:40`, `react-beautiful-dnd-migration/src/drag-drop-context/live-region.tsx:43`, `use-hidden-text-element.tsx:32`, upstream rbd `:5404`).                                                                                                                                                                                                                                                                                                                                         |
| react-select `A11yText` spans             | **cannot be a term — fix at source**                               | Two visually-hidden `<span>`s are the **first children of `SelectContainer`** (`design-system/react-select/src/select.tsx:2829` → `components/live-region.tsx:132-138`), but `span` is a rendered type and the editor's precedent for excluding it is editor-specific; guard-listing it would change real semantics.                                                                                                                                                                                                                                                              |
| `WidthObserver` measurement div           | **cannot be a term — fix at source**                               | `design-system/width-detector/src/WidthObserver/width-detector-observer.tsx:54-65` returns a **bare** absolutely-positioned div that consumers frequently place as the first child, and it carries no stable attribute to target.                                                                                                                                                                                                                                                                                                                                                 |
| top-layer CSS-length probe                | **exclude (transient)**                                            | `design-system/top-layer/src/internal/javascript-fallback/resolve-css-length-to-pixels.tsx` appends an `aria-hidden inert` div into a caller-supplied container and removes it in the same synchronous tick.                                                                                                                                                                                                                                                                                                                                                                      |

Non-element nodes need no term: comments and text nodes are not counted by `:nth-child`
(browser-verified, case K).

### Why `style` is stronger than §0.2 argues

The survey found three independent paths, not one:

1. **Hand-written `<style>` in JSX, in Design System containers.**
   `design-system/page-layout/src/components/slots/slot-dimensions.tsx:37` renders a `<style>` as
   the **first child** of the page-layout slot `<div>`, sibling to `{children}` — used by
   `top-navigation.tsx:92`, `left-sidebar.tsx:408`, `banner-slot.tsx:86`, `right-panel.tsx:81`,
   `left-panel.tsx:81`, `right-sidebar.tsx:105`, `left-sidebar-without-resize.tsx:45`. Consumers
   absolutely write `& > :first-child` against these slots.
2. **SSR is the amplifier, and it is a hydration-mismatch generator.** Both emotion
   (`node_modules/@emotion/react/dist/emotion-element-f93e57b0.cjs.dev.js:242`) and Compiled
   (`node_modules/@compiled/react/dist/cjs/runtime/style.js:71`) emit `<style>` **inline in the
   component tree** on the server, but strictly into `document.head` in the browser
   (`@emotion/cache/.../emotion-cache.cjs.dev.js:515`,
   `@compiled/react/dist/browser/runtime/sheet.js:85`). The same DOM therefore has **different child
   indexes server vs client** — exactly the SSR hazard the ratchet's description names.
3. **It also fires under jsdom**, because Compiled's `isServerEnvironment()` returns true there
   (`@compiled/react/dist/cjs/runtime/is-server-environment.js:28`) — visible in checked-in
   snapshots such as
   `platform/packages/bulk-operations/platform-context-menu/src/ui/menu-renderer/menu-content/menu-node-renderer/menu-node-item/menu-node-item-button/test.tsx:157`.
   So unit tests see the hazard even when browsers do not.

Note also that arbitrary-container `<style>` injection is _supported_ by Compiled via
`StyleContainerProvider` (`@compiled/react/dist/browser/runtime/style-container.js:58`) with zero
usages today — a latent path that would move hazard (2) into the browser if ever adopted.

---

## Recommended final guard

```
:not(:where([popover], dialog, style, script, template, link, noscript))
```

Used as, for example:

```
& > *:last-child        ->  & > :nth-last-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))
& > div:last-child      ->  & > div:nth-last-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))
& > :not(:last-child)   ->  & > :nth-last-child(n+2 of :not(:where([popover], dialog, style, script, template, link, noscript)))
& > :not(:first-child)  ->  & > :nth-child(n+2 of :not(:where([popover], dialog, style, script, template, link, noscript)))
& > *:first-child       ->  & > :nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))
```

This is **§0.2's 4-term proposal plus the remaining never-rendered element types**. §0.2's core
conclusion — settle it once, and `style` must be in it — is confirmed; the list is three terms wider
because `template` and `link` turned out to have direct in-repo evidence of appearing as siblings in
arbitrary containers, and once those are in, `script` and `noscript` complete the never-rendered set
at zero cost rather than leaving two known-shaped gaps for a future sweep.

Verified in Chrome 143: this form is `CSS.supports(selector(…))` → `true`, and is
specificity-`EQUAL` to every pseudo-class it replaces (measured at 8 terms, one wider than this).

**If the wider list is rejected**, the fallback is §0.2's `:not(:where([popover], dialog, style))` —
the `style` term is the one that must not be dropped, since it is the only one that converts the
codemod from a ratchet launder into a real fix.

Because term count is specificity-free, the codemod should emit the guard from **one shared
constant** in TS/TSX, so a later-approved term is a one-line change plus a re-run. Note this is not
possible in the 436 `.css` lines, where the guard is literal text — an argument for settling the
list now rather than later.

---

## Recommended new advice for `NoUnsafeNthChildSelectors`

Replace the `description` at `no-unsafe-nth-child-selectors.ts:75-76`. Current text steers to
`*-of-type`, which cannot be guarded. Proposed:

> Avoid `&:first-child`, `&:nth-child(…)` and `&:last-child`. A non-rendered sibling injected next
> to your element — a `<style>` tag from SSR or some devloops, an inline `<link rel="preload">`, an
> SSR `<template>` — or a sibling promoted to the top layer (`[popover]`, `dialog`) shifts sibling
> positions and silently changes which element matches. Prefer a guarded positional selector, which
> skips those siblings, is specificity-neutral with the pseudo-class it replaces, and is a no-op
> when no such sibling is present. With
> `S = :not(:where([popover], dialog, style, script, template, link, noscript))`, write
> `&:nth-child(1 of S)` for first, `&:nth-last-child(1 of S)` for last, and `&:nth-child(n+2 of S)`
> for "all but the first". Do not migrate to `&:first-of-type` / `&:nth-of-type(…)` /
> `&:last-of-type`: they dodge the `<style>` case only by accident of tag name, they change which
> element matches whenever siblings have mixed tags, and they have no `of S` form, so they can never
> be guarded against a top-layer sibling of the same type (`div[popover]` among divs). There are
> rare cases where a raw positional selector is necessary; for exemption reach out to
> #help-ui-styling-standard

Notes for whoever lands it: keep `&:nth-child(…)` in the text (already tolerated via the
self-exclusion of the rules path plus the `ads-mcp` codegen exclusion at `:44`); the added
`:nth-last-child` matches none of the three regexes, so no new exclusions are required.

---

## Requires human sign-off before the codemod is generated

1. **`style` breaks §0.3's "every guard is a no-op with the flag off" invariant, deliberately.** In
   a container with an injected `<style>`, before and after differ _with the flag off_ —
   browser-verified: `[style,a,b]` gives `#a:first-child` = `false` but `#a:nth-child(1 of GUARD)` =
   `true`. §0.2 wants exactly this ("an upgrade rather than a launder") while §0.3 asserts a blanket
   no-op and says it "is the invariant Phase 4 tests". Both cannot hold. Someone must choose: keep
   `style` and restate the Phase 4 invariant as _no-op only where no non-visual sibling exists,
   intentional fix where one does_, or drop `style` and keep a pure no-op. **This is the single most
   consequential decision in this document.**
2. **Phase 5's "~4,400 lines" and the §0.2 Scale table do not reproduce.** Measured ratchet-visible
   `:last-child` is 665 lines and the true drop bound is 607. If the count-drop argument is being
   used to justify the `style` term to reviewers, the number has to be corrected first.
3. **Three `of` lists would then exist in the repo.** The editor ships
   `:not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)` (no `:where()`, so (0,2,0), and
   it includes the _visual_ element `span`); floating-toolbar ships the plan's 3-term form; the
   codemod would add a 4-term form. Decide explicitly whether the editor sites are unified, left
   alone, or documented as intentionally divergent.
4. **`editor-plugin-block-controls` is not an `of S` adopter** — §0.3's browser-confidence argument
   rests on a four-package list whose fourth member is wrong; the real fourth is
   `editor-plugin-floating-toolbar`. Correct the claim, since it is load-bearing for "both Compiled
   and emotion emit it intact".
5. **The Compiled/emotion round-trip is still unproven in-repo** (no emitted artifact, no installed
   `node_modules`). §0.2 already lists this as a prerequisite; it must complete before the codemod
   runs, though `style` does not add risk beyond the already-shipping comma list.
6. **The recommended list is wider than §0.2's** — 7 terms, not 3. `style` + `template` + `link` are
   evidence-backed; `script` + `noscript` are included only to complete the never-rendered set.
   Someone must ratify the "never-rendered elements are free to include and unsafe to omit"
   principle, because it is what makes the list final. Reject it and you ship the 4-term fallback
   and accept a possible second sweep for `template`/`link`.
7. **`[data-focus-guard]` is a real, unfixed hazard that I did not include.** react-focus-lock
   renders zero-size guard divs as first/last children of containers that product code chooses
   (`Lock.js:129,160`; three platform call sites). It is a _rendered_ element and a third-party
   attribute, so guarding it means coupling ~1,800 selectors to a vendor detail. Choose: add the
   term, or file work to stop the guards leaking into product containers. Not deciding leaves a
   known hole.
8. **Two hazards cannot be guarded at all and need source fixes, not codemod terms** —
   react-select's `A11yText` spans as first children of `SelectContainer`
   (`react-select/src/select.tsx:2829`), and the bare `WidthObserver` div
   (`width-detector/src/WidthObserver/width-detector-observer.tsx:54-65`). Both need a stable
   attribute or a wrapper from their owning teams.
9. **`.css` files are outside the ratchet's `included` globs** (436 matching lines). Confirm the new
   ESLint rule and ratchet cover CSS, or accept that the CSS population has no regression backstop.
   Note the guard cannot be a shared constant in CSS, so the list must be final before the CSS sweep
   runs.
