# Pre-work findings — the unsafe-selector plan

Index of the nine pre-work investigations the plan flags as before-anything-else (ground truth #3,
the round-trip prerequisite, the exclusion list, the `of`-list settlement, Phase 0b rungs 1–2, the
labelled corpus, Phase 2 filter 1), plus the four follow-ups that came out of them and the audit
pass. Run 2026-08-10; audited and revised the same day.

Each investigation was a separate agent with a closed question; each owns its own document. This
file is an index plus the cross-cutting results — the per-item detail lives in the linked docs, not
here.

## Handover — start here

Read [`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md) first — it is the plan, and it is
standalone. This directory is the **evidence** behind it: what was measured, in a browser or with a
script, and what each measurement settled. **Every _decision_ is made** — what remains is work.

> ⚠️ **The plan is authoritative wherever the two disagree.** These documents were written across
> several rounds against an earlier, longer draft of the plan, so they carry its vocabulary (phases,
> filters, `W2` shards) and some of its superseded framing. Sections marked _archived_ record how a
> decision was reached, not what it is. Read the numbers here and the decisions there.

Prerequisites, in order, before any codemod runs:

0. **Regenerate the residue classification artifact.** `scripts/classify-residue.mjs` still returns
   the pre-correction `293 / 344 / 7 / 505` over 283 files. Four corrections have been folded into
   the plan by hand since and none is in the script, so it is the only machine-readable residue
   figure and it disagrees with every residue number in the plan. Patch it (the four changes are
   enumerated in the plan's _Prerequisite 0_), commit its JSON **here** rather than to `/tmp`, and
   replace the plan's ⏳ markers with its output. Expected: `299 / 324 / 6 / 457`, summing to 1,086.
   **W2's shards must come from the regenerated artifact.**
1. **Enumerate Phase 4 gate 3's expected-diff populations 2 and 3** — ungated `[popover]` producers
   (`vanilla-tooltip`, `pragmatic-drag-and-drop`'s honey-pot) and the ~5 in-body `<style>`/`<link>`
   producers. They exist as prose, not as lists, and the gate is meaningless without them.
2. ~~**Land the `NoUnsafeNthChildSelectors` fourth regex and re-baseline** (§0.2).~~ **Done, and
   this item was wrong on four counts — see the corrected Step 6 in
   [`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md), which is authoritative.** In
   summary: the fourth entry cannot be a guarded-but-not-SSR-safe regex, because rule sources go to
   `git grep -e` as POSIX basic regex and any lookahead form fails to parse — it is the plain
   substring `:nth-last-child`, and the ratchet cannot distinguish guarded from unguarded at all.
   There are **four** registrations, not two, and the path named here no longer exists.
   "Re-baseline" is a no-op for the three JS registrations; only jira's Rust artifacts regenerate.
   The confound is **27** newly-counted lines, not 63. And `editor-common/.../table.ts:39` needs no
   exclusion — it is forward-direction and still counts via the bare `:nth-child`.
3. **Write `notes/decisions/top-layer-unsafe-selectors.md`** — the Phase 0 taxonomy doc, and the one
   file every later subagent is told to read. Definition-of-done item 1. It must carry the `L` / `S`
   distinction: conflating them is what produced an inverted guard row in an earlier draft.

Then, in parallel where possible:

4. **Phase 5 ESLint rule + autofix — this _is_ the codemod.** Emit the guard literally, guard every
   comma branch inside `:has()`, and cover the two classes the audit added: `& > div` and
   `:only-child`.
5. **Phase 0b** — surface reset: add the host properties and the sync test; plus adopter-side
   `font-weight`/`font-style` token adoption in the 6 packages that lack it. **The `:where()`-wrap
   is unreachable through `cssMap` and has been dropped** — see Step 6 in the plan for the three
   verified blockers.
6. **W1 detector bake-off** against the 53-site corpus — and hand-built fixtures for `global` and
   `reverse`, which the corpus cannot measure.
7. **Phase 1b runtime sweep.** Priority is raised: with no host-side geometry defence,
   `popover-receives` outside AFM is unmitigated and this is the only instrument that can see it.

Then the codemod run, then the 457-row residue with P0 global styles first. One hand-edit is owed
separately: `navigation-system/src/ui/page-layout/root.tsx:74` is excluded from the codemod **and**
needs its missing `:where()` fixed — see the plan's §0.2 for the precise target, which is
**(0,1,0)** and not (0,0,0).

## Artifacts

The nine original investigations:

| #   | Investigation                           | Document                                                                                                                                                                           |
| --- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Insertion position — anchored adopters  | [`insertion-positions-anchored.md`](./insertion-positions-anchored.md)                                                                                                             |
| 2   | Insertion position — in-place adopters  | [`insertion-positions-in-place.md`](./insertion-positions-in-place.md)                                                                                                             |
| 3   | Guard round-trip per authoring form     | [`round-trip-authoring-forms.md`](./round-trip-authoring-forms.md)                                                                                                                 |
| 4   | Codemod exclusion list                  | [`codemod-exclusions.md`](./codemod-exclusions.md)                                                                                                                                 |
| 5   | Phase 0b rung 1 — surface reset gaps    | [`phase0b-rung1-surface-reset-gaps.md`](./phase0b-rung1-surface-reset-gaps.md)                                                                                                     |
| 6   | Phase 0b rung 2 — geometry blast radius | [`phase0b-rung2-blast-radius.md`](./phase0b-rung2-blast-radius.md)                                                                                                                 |
| 7   | Labelled corpus                         | [`labelled-corpus.md`](./labelled-corpus.md), [`corpus/manifest.jsonl`](./corpus/manifest.jsonl), [`scripts/materialize-corpus.mjs`](./scripts/materialize-corpus.mjs)             |
| 8   | Phase 2 filter 1 — package scope        | [`filter1-package-scope.md`](./filter1-package-scope.md), [`filter1-scope.json`](./filter1-scope.json), [`scripts/filter1-package-scope.mjs`](./scripts/filter1-package-scope.mjs) |
| 9   | `of` list + ratchet interaction         | [`of-list-and-ratchet-interaction.md`](./of-list-and-ratchet-interaction.md)                                                                                                       |

The four follow-ups, all of which the plan cites and none of which was in this index before the
audit:

| #   | Follow-up                              | Document                                                                                                                                                                  |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | Residue classification                 | [`residue-classification.md`](./residue-classification.md), [`scripts/classify-residue.mjs`](./scripts/classify-residue.mjs) — ⚠️ output is **stale**, see prerequisite 0 |
| 11  | `:has()` guard verification (Chromium) | [`has-guard-verification.md`](./has-guard-verification.md) — owns the `505 → 500` correction ledger                                                                       |
| 12  | Surface style ownership split          | [`surface-style-abstraction.md`](./surface-style-abstraction.md) — settles host vs component per property                                                                 |
| 13  | `[data-focus-guard]` term              | [`data-focus-guard-term.md`](./data-focus-guard-term.md) — settled: **no** term                                                                                           |

## The headline: the plan is sized against `node_modules`

The plan's Scale table counted third-party installed CSS. Reproducing it with `rg -uu` gives 12,770
union lines, of which **9,651 (76%) are inside `node_modules`**. The falsification test is
`only-child`, the pattern least present in third-party CSS: the plan's 103 matches `-uu` exactly,
against 81 in AFM source.

Two agents reached the same ~4.5× multiplier independently, by different routes, before the cause
was found.

|                                   | Plan    | Actual (AFM source) |
| --------------------------------- | ------- | ------------------- |
| Candidate lines                   | ~11,838 | **2,707**           |
| Candidate files                   | ~1,200  | **1,029**           |
| Candidate lines in filter-1 scope | —       | **2,522**           |
| Corpus violations / files         | 57 / 42 | **53 / 37**         |
| Phase 5 ratchet count drop        | ~4,400  | **607**             |
| Newly-counted `:nth-last-child`   | 31      | **27** (repo-wide)  |

Measured with `rg -cF -g '*.ts' -g '*.tsx' -g '*.css' -g '!**/node_modules/**'` from the repo root,
respecting `.gitignore` — the same basis as the plan's corrected Scale table. A second valid basis
(`--no-ignore`, so build output included) gives 3,119 / 2,931; the difference is generated files,
not source.

Everything sized off ~12,000 was oversized — most consequentially the execution model ("~1,200
candidate files and ~12,000 candidate lines. No single context can hold that"). At this scale the
orchestrator-discipline machinery is a convenience, not a survival requirement.

**The plan's own figures are now broader than this table**, and deliberately so: a later consistency
pass widened the population beyond these five positional patterns to include `:has(`, `:empty`,
sibling combinators, global styles and `.css` files repo-wide, and the 2026-08-10 audit added
`& > div` and `:only-child` to the codemod population. Current: **4,167 candidate rows — 3,123
codemod population in 1,299 files, and 1,086 residue**. The 1,086 is a _pattern_ count, not a
workload: classified ([`residue-classification.md`](./residue-classification.md),
[`has-guard-verification.md`](./has-guard-verification.md)) it is **299 codemod-able + 324
deterministically safe + 6 unreachable + 457 needing judgement**. So the plan's original "residue is
hundreds, not thousands" framing was roughly right after all — but only because two thirds of it
turned out to be mechanically handleable, which nobody had checked.

⚠️ **Those four bucket figures are hand-derived, not measured.** `classify-residue.mjs` still emits
`293 / 344 / 7 / 505` over 283 files; the corrections live in prose in
[`has-guard-verification.md`](./has-guard-verification.md) and in the plan's audit-revisions
section. Prerequisite 0 closes that gap, and until it does, **the script is the number a reader can
reproduce and the plan is the number to size work against** — which is exactly the situation this
directory exists to prevent.

The table above is the narrow five-pattern basis used for the `node_modules` falsification; the
plan's numbers are the ones to size work against.

## Ground truth #3 — resolved, 11/11

| Position        | Adopters                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| `after-trigger` | `popup`, `dropdown-menu`, `select`, `inline-dialog` (+ `tooltip`, already verified) |
| `in-place`      | `spotlight`, `flag`, `modal-dialog`, `drawer`                                       |
| `wrapped`       | `react-select`, `datetime-picker`, `avatar-group`                                   |

Two consequences:

- **`canTakeSlot1` is true.** In-place adopters can be the first DOM child of a consumer container,
  so the risk matrix's 🟢 "a trailing insert cannot take slot 1" row is dead and bare `:first-child`
  / `:nth-child(1)` is live. The plan predicted the codemod would be invariant to this answer; it
  is, but the triage-everything alternative would have lost its single largest saving here.
- **`wrapped` is a genuine scope reduction the plan did not anticipate.** Three adopters render the
  host inside their own wrapper element, so it can never reach a consumer's `& > *`. That is a
  deterministic exclusion, not a judgement call.

## The `of`-list finding — `style` breaks Phase 4 gate 3 _(archived)_

> **Archived. Resolved — see
> ["Resolution of the `of`-list blocker"](#resolution-of-the-of-list-blocker) below.** The plan
> first adopted two terms on the strength of the analysis here, then **reversed** after an
> adversarial pass showed its premise was false. **Final position: seven terms, one pass, emitted
> literally.** The "resolve one way or the other" instruction at the end of this section is kept as
> the record of the fork, not as an outstanding action — do not act on it.

The investigation recommended seven terms:

```
:not(:where([popover], dialog, style, script, template, link, noscript))
```

Browser-verified in real Chromium (jsdom cannot evaluate `of S`). But the never-rendered terms are
**not** flag-off no-ops. A `<style>` sibling is in the DOM today regardless of top layer, so
`:nth-last-child(1 of :not(:where(style)))` already selects a different element than `:last-child`.
That is the intended SSR fix — and it contradicts §0.3's blanket "every guard is a no-op with the
flag off" and Phase 4 gate 3's "flag-off VR must produce zero diffs", which the plan asserts
simultaneously.

Resolve one way or the other before generating the codemod:

- **Keep `style`** — restate gate 3 as "zero diffs outside a declared expected-change set", and
  accept that the set is discovered partly by running it. Weakens the gate that makes the codemod
  trustworthy.
- **Drop `style`** — gate 3 survives intact, the SSR hazard stays open, and the rewrite still
  deletes the string the existing ratchet detects it by. This is the "launder" outcome §0.2 warns
  against.

Retro-fitting either choice across the rewritten population is a second sweep, which is why this is
pre-work rather than a Phase 5 detail.

## Other results

- **Round-trip: proven, all 7 authoring forms, zero blockers.** `css()`, `cssMap()`, `styled`
  template literals and `xcss` by existing usage; `@atlaskit/css`, raw `.css`
  (postcss/cssnano/lightningcss) and interpolated selectors by experiment. The `cssMap` selector
  validator — flagged as highest-risk — accepts the guard. **83 dynamically-constructed selector
  sites** must be skipped, not rewritten.
- **Filter 1 does not prune hard.** 10,110 of 13,725 packages in scope; 2,522 of 2,707 candidate
  lines in scope, only 185 pruned. Prune ratio **0.07**. The plan's claim that the surviving package
  count "is the difference between 'we rewrote the repo' and 'we rewrote where a surface can
  appear'" does not survive — filter 1 is nearly a no-op and cannot carry that argument to
  reviewers.
- **Exclusions are an allow list plus 6 files, with 0 uncertain.** The DS layering components are
  already migrated to top-layer and are enumerable from the migration notes, so they are
  allow-listed as **14 package globs** rather than judged per file. All **6** previously-`likely`
  entries have since resolved — one to `exclude-certain`
  (`navigation-system/src/ui/page-layout/root.tsx`) and two to `no-exclusion-needed` — so gate 3's
  expected-failure set is not discovered after the fact. The **6** file-level exclusions are ungated
  `popover`/`dialog` producers _outside_ the DS layering set (`editor-common`'s `vanilla-tooltip`
  and similar); the allow list does not cover them. Plus **2 `carveOut` entries**, which beat the
  allow list and are rewritten. 17 paths were inspected and cleared; the 42 `popover=` files mostly
  have no positional or universal selector aimed at them. Authoritative counts are the `allowList` /
  `carveOut` / `exclude` arrays in [`codemod-exclusions.md`](./codemod-exclusions.md)'s JSON block —
  14 / 2 / 6. Re-trigger: a package gains a top-layer code path, per the roadmap's new-adopter
  checklist.
- **Rung 1:** both application sites confirmed (`popover.tsx:415`, `dialog-content.tsx:286`), 6
  properties covered, **no sync test**, and **no feature gate**. Ten additions recommended: the
  plan's `line-height`, `pointer-events`, `letter-spacing`, `word-spacing`, `text-shadow`, plus
  `writing-mode`, `user-select`, `cursor`, `font-weight`, `font-style`. The last two cut against the
  deliberate `color`/`font` theming exclusion — a decision, not a patch.
- **Rung 2:** 48 findings, **33 break under blanket `!important`**, 4 unknown. Verdict
  `viable-with-carve-outs` — carve-out engineering, not the one-line hardening the plan bills.
  Escape hatch: host declares `!important` against per-property custom properties registered
  `@property { inherits: false }`, plus a data-attribute opt-out. The `inherits: false` is
  load-bearing — without it the hatch becomes a new inheritance-bleed channel, the class rung 1
  exists to close.
- **Corpus:** 53 violations / 37 files, with `global: 0` and `reverse: 0`. Phase 1 names five source
  classes; the corpus contains no example of the two highest-reach ones, so **recall measured
  against it can read 100% while covering neither**. W1's bake-off would otherwise pick a winner on
  a score that does not mean what it appears to.

## Corrections applied to the plan

All thirteen landed in the plan; kept here as the audit trail of what changed. Items 1–8 came from
the pre-work round, 9–13 from the 2026-08-10 audit pass.

1. ✅ Scale table re-measured excluding `node_modules`; execution model resized to 2,707 / 1,029.
2. ✅ Definition of done #2 — 53-site corpus, with the `global`/`reverse` blind spot stated.
3. ✅ Phase 2 filter 1 — "prunes hard" removed, 0.07 recorded, reviewer argument moved off it.
4. ✅ §0.3 / Phase 4 gate 3 — reconciled by the `of`-list decision below.
5. ✅ Phase 5 — 607, and no checked-in baseline (merge-base diff-based).
6. ✅ §0.3 round-trip citation — `floating-toolbar`, not `editor-plugin-block-controls`.
7. ✅ Ground truth #3 table filled; 🟢 row deleted; `wrapped` added as a deterministic exclusion.
8. ✅ Phase 0b — reset recorded as ungated; rung 2 recorded as needing carve-outs.

9. ✅ `& > div` added as a codemod class — 🔴 in §0.5 but in no population; 422 lines in 276 files.
   Codemod population 2,614 → **3,123** lines, 1,024 → **1,299** files.
10. ✅ §0.2's `X -> X:not(S)` row fixed. `S` is itself a `:not()`, so the row was a double negative
    that matched only hosts; the table now names `L` (term list) and `S` (`of` argument) separately.
11. ✅ `:only-child` reclassified from residue to codemod target —
    `:nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))` is exact and (0,1,0). Judged residue
    500 → **457**.
12. ✅ `root.tsx:74`'s hand-edit re-specified — (0,2,1) not (0,2,0), neutral target (0,1,0) not
    (0,0,0), and its declaration is `!important` so severity was overstated.
13. ✅ Phase 4 gate 1's fixture constrained — its equality assertion is false by design when an
    `L`-listed non-host sibling is present, which contradicted gate 3.

Also added: a "Why a blanket transform, and what it costs" section stating the ratio (now **59:1**,
after items 9 and 11) and the reviewer-facing case, since the volume argument the strategy
originally rested on did not survive the `node_modules` correction. And a **Prerequisite 0**,
because the correction ledger for the residue now lives in three places and only the least
authoritative one is machine-readable.

## Resolution of the `of`-list blocker

**Settled: seven terms, one pass, emitted literally.**
`:not(:where([popover], dialog, style, script, template, link, noscript))`

This reversed an earlier decision in the plan to ship two terms and defer the rest. The reversal is
worth recording, because the reasoning failed in a way that looked sound:

- **The two-term case rested on gate 3 being a clean binary. It never was.** Ungated `[popover]`
  elements are in flag-off DOM today — `editor-common`'s `vanilla-tooltip` appends
  `popover = 'hint'` to its trigger button, and `pragmatic-drag-and-drop`'s honey-pot appends
  `popover="manual"` to `document.body` on every drag. Both gate on capability, not on
  `platform-dst-top-layer`.
- Since an enumerated expected-diff set is unavoidable anyway, and the in-body `<style>`/`<link>`
  producers are only ~5 enumerable files, adding them costs little — while two passes over ~1,000
  files costs a great deal.
- ~~**Emission form turned out to be a correctness requirement.**~~ **The conclusion stands; this
  argument for it does not, and the table below is void.** It assumed the fourth ratchet entry could
  be `/:nth-(last-)?child\((?![^)]*\bstyle\b)/`. It cannot: rule sources are passed to `git grep -e`
  with neither `-E` nor `-P`, so they must be POSIX **basic** regex, where `\(` opens a group. That
  form — and `:nth-last-child\(` — both die with `parentheses not balanced`, and `git-helpers.ts`
  rethrows on any exit other than 0/1, so the rule would abort rather than count. The fourth entry
  is the plain substring `:nth-last-child`, and **the ratchet cannot distinguish a guarded selector
  from an unguarded one at all.** Two further nails: the count would not have fallen anyway (of the
  1,766 lines counted today, 1,177 carry `:first-child` or `:nth-child` and survive the rewrite,
  because the guard's own output `:nth-child(1 of S)` matches the bare `:nth-child`), and keying on
  `style` alone would have scored `:nth-last-child(1 of :not(style))` — SSR-safe but _not_
  top-layer-safe — as clean, rewarding a real top-layer bug.

  Emit the guard literally regardless. The reason is the ESLint rule and the human reader, not the
  ratchet: a constant hides which of AFM's three divergent `of` lists a site actually carries. See
  the emission section of
  [`../../decisions/top-layer-unsafe-selectors.md`](../../decisions/top-layer-unsafe-selectors.md).

  | Emitted form                | `/:nth-(last-)?child\((?![^)]*\bstyle\b)/` — **void, see above** |
  | --------------------------- | ---------------------------------------------------------------- |
  | `& > *:last-child` (before) | no match                                                         |
  | two-term guard              | match — still counts as SSR debt                                 |
  | seven-term guard            | no match — count falls where fixed ❌ _(false: 67% still count)_ |
  | `of ${GUARD}` via constant  | match forever — property unverifiable                            |

- The ratchet extension is still required, and must be **additive** (a fourth entry); as a
  replacement it would launder ~1,766 lines. The confound is **27** newly-counted `:nth-last-child`
  lines, not 63 — that figure counted every line containing the substring (62 today), but 35 already
  match one of the first three regexes on the same line and per-line dedupe means the fourth adds
  nothing there. The `31` recorded here originally was the platform + jira + confluence subtotal of
  the loose count. `editor-common/src/styles/shared/table.ts:39` needs no exclusion: it is
  forward-direction, so it still counts via the bare `:nth-child`. The rule is registered in
  **four** ratchets, not two — and only jira's, which runs a Rust engine, has artifacts to
  regenerate.

Also surfaced and now recorded in the plan: rewriting `:last-child` → `:nth-last-child(…)` trips
`@emotion/cache`'s own SSR warning (its regex matches `:nth-last-child` but not `:last-child`) at
~607 sites that are silent today — and that warning was already globally suppressed for VR in
`234fda770bd2b`, which should be revisited rather than relied on. The
`dialog:modal`-vs-bare-`dialog` question this raised is **settled: bare `dialog`** — see the
decisions table below.

## Decisions — all resolved

This was an **Open decisions** table. Every row has since been decided, and leaving it open-shaped
was the single most misleading thing in this file: an agent picking up the handover would either
stop for input it did not need, or act against a decision already made. The resolutions are recorded
here and are owned by the plan.

| Decision                                                          | Resolution                                                                                                                                        | Owned by                                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `font-weight` / `font-style` vs. the theming exclusion            | **Components, not the host** — 6 of 12 adopters already reset them via the `font` shorthand; the other 6 adopt the same token.                    | Plan Phase 0b, [`surface-style-abstraction.md`](./surface-style-abstraction.md) |
| Gate the surface reset; gate rung 2's `!important`                | **No gate, and no `!important`.** Rungs 2–3 rejected on principle and on the 33-of-48 blast radius; the reset only runs where the host exists.    | Plan Phase 0b                                                                   |
| Confirm the remaining `likely` exclusions                         | **All 6 resolved, 0 uncertain** — 1 `exclude-certain`, 2 `no-exclusion-needed`, rest cleared.                                                     | [`codemod-exclusions.md`](./codemod-exclusions.md)                              |
| Are `examples/` / `examples-util/` in the codemod's scope?        | **Yes** — 64 candidate lines in 29 files. Keeps the scoping rule free of a path exception.                                                        | Plan §0.2                                                                       |
| Three divergent `of` lists already shipping                       | **Unify onto the canonical seven-term form.** The editor's `span`-containing list is a behaviour change and needs the editor team, not a codemod. | Plan §0.2                                                                       |
| `[data-focus-guard]` — add a term?                                | **No term.** The guards are flag-invariant (every top-layer path deletes `react-focus-lock`), so a term would only change flag-off behaviour.     | [`data-focus-guard-term.md`](./data-focus-guard-term.md)                        |
| `dialog:modal` rather than bare `dialog`?                         | **Bare `dialog`.** Over-excludes in-flow `<dialog open>` at 2 known sites; accepted for the simpler term and consistency with what ships.         | Plan §0.2                                                                       |
| `.css` lines watched by neither ESLint nor ratchet                | **Open, not blocking** — **440** lines (an earlier 436/437 was measurement drift). Phase 1 source class 3 sweeps them; nothing prevents new ones. | Plan §0.2, Phase 1                                                              |
| Is the orchestrator-discipline machinery warranted at this scale? | **A convenience, not a survival requirement.** Right-sized in the plan's execution model; a breach is a smell to explain, not a failed gate.      | Plan execution model                                                            |

**The one thing still genuinely awaiting a human** is the scope confirmation from the 2026-08-10
audit: accepting the `& > div` class grows the codemod diff by ~509 lines and ~275 files. It follows
from the plan's own risk matrix, so the plan applies it — but rejecting it is a legitimate call, and
it would mean downgrading `& > div` in §0.5 with a stated reason rather than leaving it 🔴 and
unrouted, which is the state the audit found.
