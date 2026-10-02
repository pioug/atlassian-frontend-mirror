# Plan: make AFM's unsafe styles safe for top layer

**Goal:** no AFM-authored style breaks, or gets broken by, a DS surface rendering inline in the top
layer.

**Status:** direction decided by the owner on 2026-10-02. Nothing in "Direction" is built yet. The
guard strings for hand-fixes are in
[`../decisions/top-layer-unsafe-selectors.md`](../decisions/top-layer-unsafe-selectors.md).

## Evidence

The plan was first a blanket migration: an ESLint rule whose autofix guarded every unsafe selector.
Five measurements stopped it.

| Measurement              | Result                                                                                                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime run              | 1,707 examples, gate on, 21,027 interactions; 1,019 opened a surface. About 1% of unsafe sites fired, and only **3 did visible damage**. No non-DS positional damage. Jira and Confluence were not covered. |
| Host specificity         | A (0,4,0) boost on the host beats all 45 host-landing rules in the corpus, in Chrome, Safari and Firefox.                                                                                                   |
| Static precision         | About 7,750 sites cannot be decided statically: whether a host can reach them depends on runtime DOM.                                                                                                       |
| CSS cost of blanket `Gi` | Editor main stylesheet +172% (+34% gzipped). team-calendar `FullCalendarWrapper` 51 KB to 5.28 MB.                                                                                                          |
| Rule as prevention       | No AFM product enables it (all extend `recommended`; the rule was only in `all` and `all-flat`). On recent history it would give 697 reports in 45 days for 0 to 1 real hazard.                             |

## Direction

1. **Host specificity defence.** Put `Popover`'s geometry and surface reset in a
   `&:popover-open:popover-open:popover-open` block, which is (0,4,0), so a consumer rule that lands
   on the host loses. Do `Popover` first. Then give `Dialog` its defaults inline. Do not use
   `!important`:
   [`phase0b-rung2-blast-radius.md`](./unsafe-selectors-prework/phase0b-rung2-blast-radius.md) found
   33 of 48 sites break under it.
2. **Runtime detector**, as a Playwright fixture for the gate-on suites and as a nightly crawl of
   all examples. It finds real hazards; static analysis cannot. **Jira and Confluence must run it in
   their own suites**, because the examples do not cover them.
3. **Hand-fixes** of what the detector finds, with the guards `G`, `Gi` and `Gw` from the decision
   doc. Start with the 3 known hazards:
   - `platform/packages/editor/renderer/src/ui/Renderer/RendererStyleContainer.tsx`, the `'ul, ol'`
     list padding (about `:887`).
   - `platform/packages/linking-platform/link-datasource/src/ui/issue-like-table/draggable-table-heading.tsx:119`,
     `'& button'`.
   - `platform/packages/design-system/button/src/new-button/containers/split-button/split-button.tsx:16,23`,
     the `'button,a'` border radius.

## The runtime detector

The probe used for the evidence was a throwaway script, about 700 lines, so it is not in the tree.
Rebuild it from this description.

- **Injection.** `page.addInitScript`. It counts `toggle` events to `open`, and wraps
  `HTMLDialogElement.prototype.showModal` and `show` to count dialog opens. These counters prove
  that a run opened surfaces, so a clean result is not a false green.
- **Scan.** After each interaction, while any host is open (`[popover]:popover-open`,
  `dialog[open]`): collect every `CSSStyleRule` from `document.styleSheets` and
  `adoptedStyleSheets`, entering `@media` and `@supports` only when they apply, and `@layer`,
  `@container` and `@import`. Replace pseudo-elements and dynamic pseudo-classes (`:hover`,
  `:focus*`, `:popover-open` and so on) with `:is(*)`, so the comparison is of DOM shape only. Test
  only complex selectors (combinators, positional pseudo-classes, `:has`, `:not`, `:is`, `:where`,
  `:empty`).
- **Counterfactual portal shape.** Clone `document.body` into
  `document.implementation.createHTMLDocument()`, and map live elements to clones with two paired
  `TreeWalker`s. Move each open host's clone into
  `div.atlaskit-portal-container > div.atlaskit-portal` at the end of the cloned body. That is the
  flag-off DOM.
- **Compare.** A rule that matches the host or its content live but not in the clone is a
  `popover-receives` hit. One that matches in the clone but not live is a reverse loss, unless it
  names only the element's own classes. For positional rules, elements outside every host whose
  match differs are `real-element-loses` hits.
- **Liveness check.** For each hit, exclude the rule from that one element and measure again: set
  `data-rts-x` on it and append `:not(:where([data-rts-x]))` to each top-level branch of the rule's
  `selectorText`, before any trailing pseudo-element. Specificity does not change. The hit is
  **live** if a declared longhand's computed value changes on the element, and **visible** if the
  rect or a paint property (colour, border, display, transform, overflow, font size and so on)
  changes on any of up to 1,500 elements in the host. Flag hits whose properties are inert on a
  fixed-position host (`flex*`, `order`, grid placement, `float`, `vertical-align`, `z-index`).
- **Attribution.** From the element that carries a class token of the selector, walk React fiber
  `_debugSource` up to the first file outside `primitives`, `css` and top-layer internals.
- **Driver.** Per example: load with the gate on, then click up to 14 candidates (`[aria-haspopup]`,
  `[aria-expanded]`, `[popovertarget]`, buttons, menu items, tabs, links, inputs), outside and then
  inside open hosts, and scan after each. A scan cost about 11 ms.

## What was removed, and why

- **The ESLint rule `no-top-layer-unsafe-selectors`** and its autofix, which was the codemod. It was
  released in 2.3.0 and 2.4.0, so its removal is a major change. The reasons are in "Evidence".
- **The shared style-walk options** that only the rule used.
- **The prework for the autofix run**: the exclusion list, the scope resolver, the recall harness,
  the expected-diff set, the labelled corpus, the package-scope filter, the residue classifier and
  the `of S` term studies. Their conclusions are in the decision doc.
- **Two decision notes** on the wide guard's reach in the editor and on the relative guard. The
  decision doc now carries their result: why guards are applied by hand, and why `Gi`.

## What stays

- **The ratchet.** `NoUnsafeNthChildSelectors`'s fourth entry, `:nth-last-child`, which protects
  positional SSR in both directions.
- **The guard strings** and their evidence in the decision doc, including the withdrawn `of S`
  forms. Atlaspack's Rust Compiled transforms print `n+2of`, an invalid selector; babel is fine. The
  bugs are in
  [`../follow-ups/compiled-transform-quirks-found-by-guard-probes.md`](../follow-ups/compiled-transform-quirks-found-by-guard-probes.md).
- **The surface reset** (`surfaceResetStyles`, kept in sync by `TSurfaceResetCheck`). `line-height`
  stays out of it. See
  [`phase0b-rung1-surface-reset-gaps.md`](./unsafe-selectors-prework/phase0b-rung1-surface-reset-gaps.md)
  and [`surface-style-abstraction.md`](./unsafe-selectors-prework/surface-style-abstraction.md).
- **The `:has()` truth table**,
  [`has-guard-verification.md`](./unsafe-selectors-prework/has-guard-verification.md).
