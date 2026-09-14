# Codemod exclusion list — `:not(:where([popover], dialog, style))`

**Criterion for exclusion.** A path is excluded iff adding the guard there is **not a no-op with the
top-layer flag OFF** — i.e. an element matching `[popover]`, `dialog` (or, for the third term,
`style`) is in the DOM regardless of the flag _and_ a selector in the same styling scope currently
matches or positionally counts it. Two populations qualify, and they are handled differently.
Population **(b)** — DS-internal styles whose intended subject **is** the host — is now resolved as
a **group**: the design system layering components are an enumerable, already-migrated set recorded
in [`../../decisions/migration-roadmap.md`](../../decisions/migration-roadmap.md), so they are
allow-listed by package glob rather than judged file by file. Population **(a)** — ungated `popover`
/ `dialog` producers outside that set — is **not** covered by the allow list and still carries
per-file justification below; the allow list must not absorb it, because those hosts exist flag-off
for reasons that have nothing to do with a DS migration.

Three things constrain how far the group direction goes. First, the roadmap's ✅ column undercounts
by one: `@atlaskit/popper` is filed under _Infrastructure / primitives_, but
[`../../migrations/popper-migration.md`](../../migrations/popper-migration.md) § Status states it
"ships an **in-package FF-on adapter** behind the `platform-dst-top-layer` feature gate" and
`popper-top-layer.tsx` exists — so it is host-authoring and belongs in the allow list. Second,
package globs are **not** free: five allow-listed packages contain 13 files with guardable
candidates, and two of those are genuine shipped-source fixes that a blanket glob would silently
drop. They are carved back out below — that carve-out is what keeps this list from being the
over-broad kind. Third, the `style` term is _designed_ to change flag-off behaviour (it subsumes the
`NoUnsafeNthChildSelectors` ratchet hazard —
`platform/packages/monorepo-tooling/ratcheting/src/rules/no-unsafe-nth-child-selectors.ts:74`), so
`style`-driven flag-off VR diffs are **expected successes, not exclusions**; gate 3 must budget for
them separately and they will far outnumber the popover-driven set, which is empty today.

**Out of scope (owned elsewhere):** Phase 0b rung 2's 33 findings where DS-internal geometry setters
break under host `!important` — see
[`phase0b-rung2-blast-radius.md`](./phase0b-rung2-blast-radius.md). That is a runtime cascade
conflict, not a codemod-targeting question, and nothing in this document addresses it.

## Allow list — DS layering packages (population b, group-level)

Status is as stated in the notes, not inferred. `migrated` = the roadmap's "Migrated (FF)? ✅ Yes";
`deferred` = "❌ No". Every row is a package glob, which is the point of the direction: these
packages author the `[popover]` / `dialog` host, so any selector they add has the host as its
subject and the guard would nullify their own rule.

| package glob                                         | status   | source note                                                                            | guardable candidates inside |
| ---------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- | --------------------------- |
| `platform/packages/design-system/top-layer/**`       | migrated | roadmap → Infrastructure / primitives, "Target primitive"                              | 0                           |
| `platform/packages/design-system/popup/**`           | migrated | roadmap ✅; `migrations/popup-migration.md`                                            | 0                           |
| `platform/packages/design-system/tooltip/**`         | migrated | roadmap ✅; `migrations/tooltip-migration.md`                                          | 0                           |
| `platform/packages/design-system/modal-dialog/**`    | migrated | roadmap ✅; `migrations/modal-dialog-migration.md`                                     | 3 (all inert — see below)   |
| `platform/packages/design-system/dropdown-menu/**`   | migrated | roadmap ✅; `migrations/dropdown-menu-migration.md`                                    | 0                           |
| `platform/packages/design-system/flag/**`            | migrated | roadmap ✅; `migrations/flag-migration.md`                                             | 0                           |
| `platform/packages/design-system/spotlight/**`       | migrated | roadmap ✅; `migrations/spotlight-migration.md`                                        | 0                           |
| `platform/packages/design-system/select/**`          | migrated | roadmap ✅ (`PopupSelect` only); `migrations/select-migration.md`                      | 0                           |
| `platform/packages/design-system/datetime-picker/**` | migrated | roadmap ✅; `migrations/datetime-picker-migration.md`                                  | 7 (all inert — see below)   |
| `platform/packages/design-system/inline-dialog/**`   | migrated | roadmap ✅; `migrations/inline-dialog-migration.md`                                    | 1 (inert — see below)       |
| `platform/packages/design-system/avatar-group/**`    | migrated | roadmap ✅ (overflow menu only); `migrations/avatar-group-migration.md`                | 1 (**carved out**)          |
| `platform/packages/design-system/react-select/**`    | migrated | roadmap ✅; `migrations/react-select-migration.md`                                     | 1 (**carved out**)          |
| `platform/packages/design-system/drawer/**`          | migrated | roadmap ✅ (no per-adopter note exists)                                                | 0                           |
| `platform/packages/design-system/popper/**`          | migrated | `migrations/popper-migration.md` § Status (roadmap files it as infrastructure, not ✅) | 0                           |

Recorded as **not** allow-listed, from the same roadmap: `blanket` (deferred — replaced by
`::backdrop`), `onboarding` (deferred — deprecated for Spotlight), `banner` (deferred —
static/in-flow), `navigation-system` (deferred — "Flyouts deferred"), `menu` (deferred — no local
adapter, FF coverage via tests only), `inline-message` (tests only, no `@atlaskit/top-layer` import
in component source), `portal` and `layering` (legacy). `navigation-system` is the consequential
one: it depends on `@atlaskit/top-layer` and its `root.tsx` is host-aware, yet the notes record it
as deferred — so it stays a per-file entry rather than joining the group.

### Carve-outs — allow-listed packages, still codemod these

Without these two rows the glob would drop real fixes. The other 11 candidate sites inside
allow-listed packages are genuinely inert and need no carve-out — each is audited individually in
[Guardable candidates inside allow-listed packages](#guardable-candidates-inside-allow-listed-packages)
below, which also records that the `modal-dialog` `:only-child` pair is unfixable **residue** rather
than a safe rule, and that no selector in these five packages is actually `host-targeting`.

| path                                                                          | why it must still be rewritten                                                                                                                                               |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform/packages/design-system/react-select/src/components/multi-value.tsx` | `multiValueTagWrapperStyles.root`'s `'& > *'` sets `display: flex` / `flex: 1 1 0` on tag-wrapper children — live on an open host per §0.4, and the wrapper is not the host. |
| `platform/packages/design-system/avatar-group/examples-util/helpers.tsx`      | `styles.wrapper`'s `'& > *'` sets `marginRight` on children — `margin` is live on an open host, and this utility feeds VR examples.                                          |

### Guardable candidates inside allow-listed packages

All 13 detector hits inside the allow list, audited one file at a time. The question for each is
narrow: **the glob makes the codemod skip this file wholesale — is that skip correct?** Living
inside a DS layering package is _not_ an answer; the live hazard is a **nested** surface (a
`Tooltip` inside a `DropdownItem`, a tooltip on a flag action) landing in the package's own internal
container, where an ordinary `:last-child` / `& > *` rule matches it. So each row records whether a
top-layer host can join the sibling list that the selector's positional/universal step actually
counts.

`verdict` uses the three audit labels — `host-targeting` (subject is the host or the surface root
the package renders), `ordinary` (everyday positional selector on internal content), `unclear`. Two
rows carry **`n/a`** instead: the detector hit is not a selector at all, so there is nothing to
classify.

| file                                                                                           | package         | selector (verbatim)                                                         | verdict  | nestedSurfacePossible | reason                                                                                                                                                                                                                                                                                                                                | remedy        |
| ---------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------- | -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `modal-dialog/src/internal/components/modal-dialog.tsx`                                        | modal-dialog    | `& > form:only-child`                                                       | ordinary | yes                   | Subject is a consumer-supplied `<form>` inside the legacy `section[role="dialog"]` surface, not the host — a `<Tooltip>` placed directly in the modal body joins that sibling list and voids `:only-child` (`real-element-loses`). `:only-child` has **no guard form** (§0.2), so the codemod has nothing to rewrite here either way. | keep-skip     |
| `modal-dialog/src/internal/components/modal-wrapper.tsx`                                       | modal-dialog    | `& > form:only-child`                                                       | ordinary | yes                   | Identical rule; `surfaceStyles.root` sits on the visual content `<div>` **inside** `<Dialog>` (`modal-wrapper.tsx:442`), not on the `dialog` host, so the subject is again consumer content. Same unguardable `:only-child` residue.                                                                                                  | keep-skip     |
| `modal-dialog/src/__tests__/unit/modal-dialog-top-layer.test.tsx`                              | modal-dialog    | _(none — `calc(<pct> * (100vw - 120px) / 100)` in a `//` comment)_          | n/a      | no                    | Detector false positive: the `> *` regex matched prose in a width-`calc` comment.                                                                                                                                                                                                                                                     | keep-skip     |
| `datetime-picker/src/components/__tests__/playwright/time-picker.spec.tsx`                     | datetime-picker | `[data-testid="timePicker--container"] > div > div > div > div:first-child` | ordinary | no                    | Playwright locator string, not CSS. The `:first-child` step counts children of react-select's value container four levels down, while the `[popover]` menu host is a **direct** child of `--container` at depth 1.                                                                                                                    | keep-skip     |
| `datetime-picker/.../ff-testing/platform_dst_popup-disable-focuslock/time-picker.spec.tsx`     | datetime-picker | `[data-testid="timePicker--container"] > div > div > div > div:first-child` | ordinary | no                    | Same locator, same depth mismatch; this variant gates on `platform_dst_popup-disable-focuslock`, which does not create a host at all.                                                                                                                                                                                                 | keep-skip     |
| `datetime-picker/src/components/__tests__/playwright/datetime-picker.spec.tsx`                 | datetime-picker | `[role=gridcell]:nth-child(6)`                                              | ordinary | no                    | Playwright locator. The counted sibling list is a calendar week row, and `@atlaskit/calendar` imports neither `@atlaskit/tooltip` nor `@atlaskit/top-layer`, so no surface can join it.                                                                                                                                               | keep-skip     |
| `datetime-picker/.../ff-testing/platform_dst_popup-disable-focuslock/datetime-picker.spec.tsx` | datetime-picker | `[role=gridcell]:nth-child(6)`                                              | ordinary | no                    | Same locator and same gridcell row; the gate under test creates no host.                                                                                                                                                                                                                                                              | keep-skip     |
| `datetime-picker/src/components/__tests__/playwright/date-picker.spec.tsx`                     | datetime-picker | `[role=gridcell]:nth-child(6)`                                              | ordinary | no                    | Same locator; calendar rows hold only gridcells.                                                                                                                                                                                                                                                                                      | keep-skip     |
| `datetime-picker/.../ff-testing/platform-dst-top-layer/date-picker.spec.tsx`                   | datetime-picker | `[data-testid="datepicker-1--container"] > div:first-of-type`               | ordinary | **yes**               | Playwright locator **and** `:nth-of-type` residue (no guard form, §0.2). Useful corroboration: `menu-top-layer.tsx` replaces react-select's `Menu`, so the host _is_ a direct child of `--container`, and this suite passes with `platform-dst-top-layer` **ON** — proving the host lands at slot 2+, never slot 1.                   | keep-skip     |
| `datetime-picker/examples/140-overflow.vr.ap.tsx`                                              | datetime-picker | _(none — `/> */}` closing two commented-out JSX blocks)_                    | n/a      | no                    | Detector false positive: the `> *` regex matched a JSX-comment terminator.                                                                                                                                                                                                                                                            | keep-skip     |
| `inline-dialog/src/__tests__/playwright/inline-dialog.spec.tsx`                                | inline-dialog   | `.react-select__option:nth-child(1)`                                        | ordinary | no                    | Playwright locator. The counted list is `.react-select__menu-list`'s option rows, which sit _inside_ the host and gain no surface of their own in the `04-select-datepicker` example.                                                                                                                                                 | keep-skip     |
| `avatar-group/examples-util/helpers.tsx`                                                       | avatar-group    | `& > *`                                                                     | ordinary | **yes**               | `ExampleGroup` is a generic layout utility setting `marginRight` on arbitrary `ReactNode` children. With the tooltip gate on, `Tooltip` returns `<Fragment>{trigger}{host}</Fragment>` (`tooltip.tsx:588–612`), so any directly-placed tooltip puts a `[popover]` in that child list and it takes the margin.                         | **carve-out** |
| `react-select/src/components/multi-value.tsx`                                                  | react-select    | `& > *`                                                                     | ordinary | no                    | Tag-wrapper `<div>` whose sole child is `<Tag>` (`@atlaskit/tag` imports no tooltip), and the wrapper is an in-flow value chip, not the host. Carved out anyway because it sets `display: flex` on a universal child selector — the §0.4 **P0** pattern that would unhide a _closed_ `[popover]`.                                     | **carve-out** |

**Totals: 13 audited — 11 `keep-skip`, 2 `carve-out`, 0 `unclear`; 4 files where a nested surface
can join the counted sibling list.**

Two conclusions the per-file pass changes:

1. **The glob is doing no real work for 11 of the 13.** Every keep-skip row is inert for a reason
   that has nothing to do with the allow list — 7 are Playwright locator strings (the codemod must
   skip runtime/query selector arguments, same rule as the `querySelector` row in _Cleared_), 2 are
   `:only-child` / `:nth-of-type` residue with no guard form per §0.2, and 2 are detector false
   positives that are not selectors. Remove all five package globs and the codemod's output would be
   byte-identical apart from the two carve-outs. That is the honest measure of the glob's blast
   radius: **the carve-out set is complete at 2, and it is the only part of the allow list that
   changes behaviour inside these five packages.**
2. **`modal-dialog`'s two `& > form:only-child` rules are a live, unfixable hazard**, not a safe
   DS-internal rule. A consumer `<Tooltip>` rendered directly in the modal body joins the surface's
   child list flag-on, the `<form>` stops being `:only-child`, and the modal silently loses its
   scroll/flex inheritance (`real-element-loses`). No guard form exists, so this is residue that
   **Phases 1–3 must carry** — it must not be filed as "handled by the allow list".

Zero rows classified `host-targeting`. Worth noting explicitly, because it is the premise the group
allow list was built on: inside these five packages the detector found **no** selector whose subject
is the host or the package's own surface root. The allow list's justification holds for the packages
with `0` candidates; for these five it is a no-op plus two suppressed real fixes.

## Excluded — population (a), per file

Ungated `[popover]` / `dialog` producers outside the DS layering set. Each is a path where a host is
in the DOM with the flag off, so a guard there is live. Note that the plan's "66 files that set
`popover=`" is a grep artefact: only **five production files** in AFM actually create such an
element without a top-layer gate; the rest are comments, local variable names, `.spec`/`.test`
assertions, or `showModal()` calls that are React modal-registry helpers rather than
`HTMLDialogElement.showModal()`.

**Six entries** — those five population-(a) producers, plus the one population-(b) row
(`navigation-system`'s `root.tsx`) that no package glob covers because the roadmap records the
package as `deferred`. Every row is `certain`; **no `likely` rows remain** (see
[the resolution below](#how-the-six-previous-likely-entries-resolved)).

| path                                                                                                    | population | reason                                                                                                                                                                                                                                                                                                                                                                               | confidence |
| ------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `platform/packages/editor/editor-common/src/vanilla-tooltip/**`                                         | a          | `index.ts:64` sets `tooltip.popover = 'hint'` with no feature gate and `button.appendChild(tooltip)`, so the host is a real child of the trigger `<button>` flag-off.                                                                                                                                                                                                                | certain    |
| `platform/packages/editor/editor-plugin-block-controls/src/pm-plugins/vanilla-quick-insert.tsx`         | a          | Builds `button.blocks-quick-insert-button` and attaches an ungated `VanillaTooltip` (`<span popover="hint" class="blocks-quick-insert-tooltip">`) inside it.                                                                                                                                                                                                                         | certain    |
| `platform/packages/editor/editor-plugin-emoji/src/nodeviews/EmojiNodeView.ts`                           | a          | `createTooltip` appends `<span popover="hint" class="emoji-tooltip-editor">` into the emoji node inside ProseMirror content, gated only by `platform_editor_emoji_hover_show_tooltip`.                                                                                                                                                                                               | certain    |
| `platform/packages/pragmatic-drag-and-drop/core/src/honey-pot-fix/**`                                   | a          | `make-honey-pot-fix.ts:154` sets `popover="manual"` behind only `supportsPopover()` and appends to `document.body`, so `body`'s last child is a `[popover]` for every drag.                                                                                                                                                                                                          | certain    |
| `platform/packages/pragmatic-drag-and-drop/core/src/public-utils/element/custom-native-drag-preview/**` | a          | `set-custom-native-drag-preview.ts:66` sets `popover="manual"` ungated, appends to `document.body`, calls `showPopover()`; consumer preview content renders inside that host.                                                                                                                                                                                                        | certain    |
| `platform/packages/design-system/navigation-system/src/ui/page-layout/root.tsx`                         | b          | **Skip the `safetyRail` declaration only.** `styles.safetyRail` (`root.tsx:61`–`67`) is selected only when `fg('platform-dst-top-layer')` is false (`root.tsx:219`–`221`); its flag-on twin already carries the guard, so guarding the flag-off half makes the pair identical and unhides stray hosts. Full mechanism and the granularity caveat: [below](#the-last-three-resolved). | certain    |

### How the six previous `likely` entries resolved

| previous `likely` entry                                                | outcome                                                                          |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `design-system/modal-dialog/src/internal/components/modal-wrapper.tsx` | **Resolved** — inside allow-listed `modal-dialog` (`migrated`); now group-level. |
| `design-system/tooltip/src/tooltip.tsx`                                | **Resolved** — inside allow-listed `tooltip` (`migrated`); now group-level.      |
| `design-system/flag/src/flag-group.tsx`                                | **Resolved** — inside allow-listed `flag` (`migrated`); now group-level.         |
| `design-system/navigation-system/src/ui/page-layout/root.tsx`          | **`exclude-certain`** — stays excluded, scoped to one declaration.               |
| `post-office/.../rovo-button-spotlight.tsx`                            | **`no-exclusion-needed`** — removed from `exclude`, moved to _Cleared_.          |
| `editor-plugin-ai/examples/utils/use-opt-in-nag.tsx`                   | **`no-exclusion-needed`** — removed from `exclude`, moved to _Cleared_.          |

**6 of 6 resolved; 0 `likely` entries remain.** Gate 3's expected-failure set is therefore
enumerated by construction rather than discovered by running it. Neither of the two removals became
an `expectedDiff` entry, because neither produces a flag-off diff at all — so the `expectedDiff`
population from this document is still empty and gate 3's only budgeted flag-off changes are the
`style`-term successes described in the preamble, plus whatever the two known ungated `[popover]`
producers (`editor-common/src/vanilla-tooltip`, pdnd's honey-pot) are found to reach.

#### The last three, resolved

**1. `navigation-system/src/ui/page-layout/root.tsx` → `exclude-certain`.**

The concrete mechanism. `styles.safetyRail` is
`'> :not([data-layout-slot])' { display: none !important }` (`root.tsx:61`–`67`) and it is chosen
**only** when `fg('platform-dst-top-layer')` is false (`root.tsx:219`–`221`). Its flag-on twin
`styles.safetyRailWithTopLayer` (`root.tsx:72`–`78`) is the same rule already spelling out
`:not(dialog):not([popover])`. Adding `S` to the flag-off half makes the two halves behave
identically, which (i) leaves the gate with nothing to switch, and (ii) stops any stray `dialog` /
`[popover]` rendered as a direct child of the grid root (`#unsafe-design-system-page-layout-root`)
from being force-hidden flag-off — the exact leakage the rail exists to prevent. That this is
_intended_ rather than incidental is settled inside the same file: the dev-only child audit at
`root.tsx:166`–`179` exempts `dialog` / `[popover]` children **only when `topLayerGateOn`**, and
still `console.error`s them when the gate is off. Guarding line 63 would put the CSS and that
runtime contract in open disagreement.

Two supporting facts, neither of which changes the verdict but both of which were missing from the
`likely` note:

- **"Main gate off" does not imply "no host exists."** Per-component gates are independent —
  `@atlaskit/spotlight`'s host is behind `platform-dst-top-layer-spotlight`, not the shared gate
  ([`insertion-positions-in-place.md`](./insertion-positions-in-place.md)). If an in-place host ever
  lands as a **direct** child of Root in that combination it will be wrongly hidden today; the fix
  belongs in Root (key the variant on host presence, or mark the slot), not in a codemod rewrite of
  the flag-off rail.
- **`> :not([data-layout-slot])` carries none of the four codemod signals** (`first-child`,
  `last-child`, `nth-child`, `& > *`), so a signal-keyed detector never reaches it. The entry is
  belt-and-braces for a detector that generalises the 🔴 "`& > *`, `& > div`,
  `& > [role="presentation"]`" row of the plan's risk matrix.

**Granularity caveat — this is the one entry the path-keyed `exclude` array cannot express
exactly.** Skip `safetyRail`, _not_ the file. `root.tsx:74` is one of the three divergent `of`-lists
already shipping, and its `:not(dialog):not([popover])` without `:where()` is a real (0,2,0)
specificity bump that §0.2 requires normalising to `:not(:where(...))`. A whole-file skip would
silently drop that fix — the failure mode this list has already been trimmed for once. Implement as
a per-declaration skip and assert after the codemod that `root.tsx:74` was rewritten and
`root.tsx:63` was not.

**2. `post-office/.../rovo-button-spotlight.tsx` → `no-exclusion-needed`.**

What made `likely` over-cautious: the recorded reason — "gate 3 is structurally blind to a
regression here" — is a statement about **verification coverage**, not about flag-off liveness, and
only the latter is the exclusion criterion. The selector's own leading `[popover="manual"]` step is
the proof it is inert flag-off. Spotlight's host is `<Popover mode="manual">`
(`spotlight/src/ui/popover-content/top-layer.tsx:136`,`:139`), reachable only through
`fg('platform-dst-top-layer-spotlight')` (`popover-content/index.tsx:90`, and again for the caret at
`card/caret/index.tsx:37`); the legacy path sets no `popover` attribute anywhere in the package and
still portals out. So the rewrite is a guaranteed flag-off no-op — which also rules out
`expectedDiff`, since there is no flag-off diff to budget for.

The guard cannot nullify the rule flag-**on** either, so nothing is being protected by skipping it.
Three levels inside the host, `div:first-child` resolves to the spotlight **caret**: a bare `<div>`
(`spotlight/src/ui/card/caret/top-layer.tsx:114`) that is the first element child of the card root
(`card/top-layer.tsx:66`–`67`). A `div` can never match `dialog`, and the caret carries no `popover`
attribute, so `S` never excludes the intended subject. Re-indexing to `div:nth-child(1 of S)` can
only help: if a Compiled `<style>` or a nested `[popover]` ever precedes the caret, today's bare
`:first-child` silently stops matching and the hidden pointer reappears — precisely the class of bug
this codemod exists to fix, and precisely the fix an exclusion would drop. Residual flag-on
verification for this consumer belongs to spotlight's own FF-on Playwright/VR coverage; record it
there, not in gate 3.

**3. `editor-plugin-ai/examples/utils/use-opt-in-nag.tsx` → `no-exclusion-needed`.**

What made `likely` over-cautious: the entry was filed on the strength of the host existing, without
checking whether the path contains anything to rewrite. **It contains no selector of any kind** —
one `<dialog open>` with an inline `style` prop (`:22`) and no CSS block at all. The entry therefore
cannot change codemod output under any implementation. It is a producer-only path, and producers are
structurally outside what path exclusion can express — the same point that makes
`editor-common/src/vanilla-tooltip` and pdnd's honey-pot expected-diff material rather than
exclusions.

It does not need an `expectedDiff` entry either, on two independent grounds. The `<dialog>` mounts
only after a click (`showOptinNag` defaults to `false`), so no default VR state contains it; and
across the 18 examples that render `{optInNagUi}` the only positional selector anywhere in the
examples tree is `examples/utils/product-styles/trello.tsx:30`
(`.akEditor > :first-child > div > div`), whose counted list sits inside `.akEditor` while
`{optInNagUi}` renders as a sibling of the editor container. Nothing counts this host.

What the entry was actually pointing at is a **term-list** question, not a path: this is an in-flow
`<dialog open>` that was never `showModal()`-ed, so it is not in the top layer and a bare `dialog`
term in `S` over-excludes it. That is the plan's still-open `dialog` vs `dialog:modal` item in §0.2,
which cites this exact line alongside `react-select/src/__tests__/unit/select.test.tsx:3064`.
Resolve it there; an exclusion here would never have addressed it.

## Direction of the residual error

The allow list is keyed on **migration status**, so it decays in one direction only: it goes **stale
under-inclusive** as packages migrate. A package that gains a top-layer code path after 2026-08-10
becomes host-authoring while still sitting outside the list, and the codemod will guard its
host-targeting selectors — a flag-**on** breakage that gate 3 (flag-off VR) cannot see. The
ambiguous middle is the `deferred` rows that already depend on `@atlaskit/top-layer`:
`navigation-system` today, and `menu` / `inline-message`, which carry FF-on Playwright/VR coverage
without a local adapter. There is no over-inclusive failure mode: removing a package from the list
can only re-expose sites, never hide them.

**Re-trigger:** the plan's new-adopter checklist (§"Re-trigger on every new adopter") already fires
when a package gains a top-layer code path — "(a) record its insertion position, (b) re-run the
detector for the selector classes that its position newly exposes, (c) re-run the Phase 1b runtime
sweep over that package's suites". Add a fourth step: **add the package to this allow list and
re-run the carve-out check** (`rg` the package for guardable candidates and carve back any
shipped-source site). The roadmap links the checklist, so updating the roadmap's ✅ column is the
natural trigger point.

## Cleared (inspected, not excluded)

| path                                                                                                                                                                                                                                                                                                                                              | reason                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `platform/packages/editor/editor-plugin-block-controls/src/ui/global-styles.tsx`                                                                                                                                                                                                                                                                  | Its ~20 positional selectors count `.ProseMirror` block children; the ungated `[popover="hint"]` it produces sits two levels down inside `button.blocks-quick-insert-button`.                                                                                                                                                  |
| `platform/packages/editor/editor-plugin-block-controls/src/ui/quick-insert-button.tsx`                                                                                                                                                                                                                                                            | No positional or universal-child selectors — only `:has()` sticky-table variants.                                                                                                                                                                                                                                              |
| `platform/packages/elements/emoji/src/**`                                                                                                                                                                                                                                                                                                         | Zero positional/universal selectors, so the emoji `[popover]` tooltip host cannot be counted.                                                                                                                                                                                                                                  |
| `platform/packages/editor/editor-core/src/ui/EditorContentContainer/styles/emoji.ts`                                                                                                                                                                                                                                                              | Emoji selectors are all attribute/class based with no positional pseudo-class.                                                                                                                                                                                                                                                 |
| `platform/packages/editor/editor-plugin-table/src/ui/FloatingContextualButton/styles.ts`                                                                                                                                                                                                                                                          | Already guarded — `'> div:not([popover])'` inside the flag-gated `topLayerTooltipCellButtonStyles`.                                                                                                                                                                                                                            |
| `platform/packages/editor/editor-common/src/styles/shared/table.ts`, `platform/packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx`, `.../styles/{list,layout,expandStyles,syncBlockStyles}.ts`, `platform/packages/editor/renderer/src/ui/Renderer/RendererStyleContainer.tsx`                         | Already `of S` with a hand-tuned `S` (`:not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)`); not an (a)/(b) exclusion, but the codemod MUST **merge** `[popover], dialog` into that `S`, never replace it.                                                                                                         |
| `platform/packages/editor/editor-plugin-ai/src/ui/components/GlobalWrapper/{GlobalWrapper,GlobalWrapperLegacy}.tsx`                                                                                                                                                                                                                               | `> span:only-child` is `:only-child` residue, outside the codemod population by §0.2.                                                                                                                                                                                                                                          |
| `platform/packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/AtlassianIntelligenceToolbarButton.tsx:86`                                                                                                                                                                                                        | `querySelector(':scope > span:last-child:empty')` is a runtime DOM query, not CSS — the codemod must skip `querySelector`/`matches`/`closest` arguments (jsdom has no `of S`).                                                                                                                                                 |
| `platform/packages/design-system/react-select/src/select.tsx`                                                                                                                                                                                                                                                                                     | Its only `popover=` hits are prose comments; the host is created in the gated `menu-portal-top-layer.tsx`. (Also inside the allow list.)                                                                                                                                                                                       |
| `platform/packages/pragmatic-drag-and-drop/core/src/util/popover-reset-styles.ts`                                                                                                                                                                                                                                                                 | An inline `CSSProperties` object applied to the host — no selectors for a codemod to rewrite.                                                                                                                                                                                                                                  |
| `platform/packages/pragmatic-drag-and-drop/core/src/util/supports-popover.ts`                                                                                                                                                                                                                                                                     | Feature detection only; creates no element.                                                                                                                                                                                                                                                                                    |
| `platform/packages/design-system/motion-inspector/src/content.tsx`                                                                                                                                                                                                                                                                                | Deliberately matches `dialog, [popover], [popover] *` at runtime but holds zero positional/universal selectors.                                                                                                                                                                                                                |
| `wac/services/trello/src/entries/styles/index.ts`, `help-center/packages/common-utils/styles/src/{mixins,styled-components}.tsx`, `help-center/.../csm-global-styles/index.tsx`, `help-center/.../featured-portals/{featured-portals,styled}.tsx`, `townsquare/packages/embeds/src/{Embed.tsx,components/GoalsDirectory/GoalsDirectoryEmbed.tsx}` | The `injectGlobal` / `createGlobalStyle` set: none contains a `body >` or positional child selector, so pdnd's body-level `[popover]` hosts are unreached.                                                                                                                                                                     |
| `post-office/integrated-teams/jsm-nebula/message-templates/solcom-create-space-spotlight/src/placements/in-app/screen-space-flags/render.tsx`                                                                                                                                                                                                     | `popoverTargetDiv` is a local variable name; no `popover` attribute is ever set.                                                                                                                                                                                                                                               |
| `confluence/next/**`, `adminhub/**`, `jira/src/**`, `studio/**`, `avp/**`, `afm-tools/src/packages/isl/**` `showModal(`/`hideModal(` call sites (~120 files)                                                                                                                                                                                      | All React modal-registry helpers, not `HTMLDialogElement.showModal()` — no `dialog` element is produced.                                                                                                                                                                                                                       |
| The 23 files already carrying `of :not(:where([popover], dialog))` from PRs 427523 / 430991                                                                                                                                                                                                                                                       | Already guarded; the codemod's only job there is adding the `style` term (a deliberate flag-off change, not an exclusion).                                                                                                                                                                                                     |
| `post-office/integrated-teams/cc-flywheel-activation/message-templates/confluence-ootb-daily-brief-agent-spotlight/src/placements/in-app/screen-space-flags/components/rovo-button-spotlight.tsx`                                                                                                                                                 | **Was `likely`, now cleared.** `& [popover="manual"] > …` is dead flag-off (spotlight's host is behind `platform-dst-top-layer-spotlight`) and the subject is the caret `<div>`, which `S` can never exclude — so the guard is a no-op flag-off and a fix flag-on. See [_The last three, resolved_](#the-last-three-resolved). |
| `platform/packages/editor/editor-plugin-ai/examples/utils/use-opt-in-nag.tsx`                                                                                                                                                                                                                                                                     | **Was `likely`, now cleared.** Producer only — the file holds no selector, so there is nothing at this path to rewrite; the real question its `<dialog open>` raises is `dialog` vs `dialog:modal` in §0.2. See [_The last three, resolved_](#the-last-three-resolved).                                                        |

## Machine-readable

`allowList` entries are package globs (population b, group-level). `exclude` entries are the
remaining per-file / per-module paths — **six**, all `certain`.

**Resolution order (one line):** a path is skipped if it matches `allowList` or `exclude` —
**except** that an exact match in `carveOut` always wins over `allowList` and is rewritten.

**One entry needs sub-file granularity:** `navigation-system/.../root.tsx` must skip only the
`safetyRail` declaration (`root.tsx:63`); the already-shipping guard at `root.tsx:74` must still be
normalised to `:not(:where(...))` per §0.2. A literal whole-file skip drops that specificity fix.

There is no `expectedDiff` array: no path in this document resolved to
`expected-diff-not-exclusion`, so the only budgeted flag-off VR changes are the `style`-term
successes and the two ungated `[popover]` producers, both owned by gate 3 rather than by this list.

```json
{
	"allowList": [
		"platform/packages/design-system/top-layer/**",
		"platform/packages/design-system/popup/**",
		"platform/packages/design-system/tooltip/**",
		"platform/packages/design-system/modal-dialog/**",
		"platform/packages/design-system/dropdown-menu/**",
		"platform/packages/design-system/flag/**",
		"platform/packages/design-system/spotlight/**",
		"platform/packages/design-system/select/**",
		"platform/packages/design-system/datetime-picker/**",
		"platform/packages/design-system/inline-dialog/**",
		"platform/packages/design-system/avatar-group/**",
		"platform/packages/design-system/react-select/**",
		"platform/packages/design-system/drawer/**",
		"platform/packages/design-system/popper/**"
	],
	"carveOut": [
		"platform/packages/design-system/react-select/src/components/multi-value.tsx",
		"platform/packages/design-system/avatar-group/examples-util/helpers.tsx"
	],
	"exclude": [
		"platform/packages/editor/editor-common/src/vanilla-tooltip/**",
		"platform/packages/editor/editor-plugin-block-controls/src/pm-plugins/vanilla-quick-insert.tsx",
		"platform/packages/editor/editor-plugin-emoji/src/nodeviews/EmojiNodeView.ts",
		"platform/packages/pragmatic-drag-and-drop/core/src/honey-pot-fix/**",
		"platform/packages/pragmatic-drag-and-drop/core/src/public-utils/element/custom-native-drag-preview/**",
		"platform/packages/design-system/navigation-system/src/ui/page-layout/root.tsx"
	]
}
```
