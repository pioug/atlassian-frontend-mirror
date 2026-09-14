# Residue classification — how much of the 1,149 is really judgement work?

> ⚠️ **STALE — the numbers in this document are pre-correction. Do not size work against them.**
> Everything below reports what `scripts/classify-residue.mjs` emits today: `293 / 344 / 7 / 505`
> over 283 files. Four corrections have landed since, none of them in the script:
>
> | Correction                                                                                      | Recorded in                                                |
> | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
> | `+15` a propagating dynamic pseudo-class inside a `:has()` argument is not fixed by guarding it | [`has-guard-verification.md`](./has-guard-verification.md) |
> | `+1` root-scoped `:has()` is not invariant for state pseudo-classes                             | [`has-guard-verification.md`](./has-guard-verification.md) |
> | `−21` a leading `~` in a `:has()` argument is codemod-able (browser-verified)                   | [`has-guard-verification.md`](./has-guard-verification.md) |
> | `−43` `:only-child` is guardable at (0,1,0), so it is a codemod target                          | plan §0.2, audit revision 3                                |
>
> **Current figures: `299 / 324 / 6 / 457`, summing to 1,086.** Patching and re-running this script
> is a prerequisite of the `population` assignment in Step 2 of
> [`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md), and it must happen before any
> residue shard is cut — deriving them from the un-patched script re-triages 43 `:only-child` rows
> the transform now owns. The methodology below is still correct and is why the script is worth
> patching rather than replacing.

**Question.** The plan sizes the §0.2 residue — the unsafe-selector patterns with no `of S` guard
form — at **1,149 lines in 516 files**, and uses that number to decide whether the residue is
sequenced before or after the codemod. How much of it is **genuinely per-site human judgement**,
after removing what is mechanically handleable or deterministically safe?

**Why the 1,149 was not decision-grade.** It was produced by **pattern presence only**: seven `rg`
signals over `*.ts` / `*.tsx` / `*.css`, deduped because one line can carry two. It had never been
filtered for guardability or reachability. That matters here more than usual, because elsewhere in
this same plan the candidate:violation ratio is roughly **50:1** — two landed audit passes found 53
real violations in 37 files across a 2,707-line candidate pool. A presence count is the right unit
for sizing a _rewrite_; it is the wrong unit for sizing _judgement_, which is what Phase 2's filter
2 and the W2 fan-out are budgeted against.

The denominator reproduces exactly. The script re-measures the union on the plan's own basis and
gets **1,149 lines / 516 files**, and each of the seven per-pattern figures to the line (`:has(`
547, `nth-of-type` 268, `:empty` 176, `only-child` 81, `& + ` 77, `injectGlobal`/`createGlobalStyle`
24, `& ~ ` 6). So the disagreement below is entirely about classification, not about measurement.

---

## Result

| Pattern                               |     Total | codemod-able | deterministically-safe | unreachable | **needs-judgement** |
| ------------------------------------- | --------: | -----------: | ---------------------: | ----------: | ------------------: |
| `:has(`                               |       547 |      **293** |                    121 |           0 |             **133** |
| `nth-of-type`                         |       268 |            0 |                **134** |           0 |             **134** |
| `:empty`                              |       176 |            0 |                     47 |           3 |             **126** |
| `only-child`                          |        81 |            0 |                     21 |           1 |              **59** |
| `& + `                                |        77 |            0 |                     10 |           3 |              **64** |
| `injectGlobal` / `createGlobalStyle`  |        24 |            0 |                     17 |           0 |               **7** |
| `& ~ `                                |         6 |            0 |                      1 |           0 |               **5** |
| _(presence sum — lines double-count)_ |   _1,179_ |              |                        |             |                     |
| **Deduped total**                     | **1,149** |      **293** |                **344** |       **7** |             **505** |

The per-pattern rows are on the **presence** basis, matching how the plan's residue table was built:
a line carrying two patterns appears in both rows, which is why they sum to 1,179 rather than 1,149.
The final row is the **deduped** basis, where buckets are exclusive and sum to 1,149; a line
carrying two patterns takes the **worst** verdict across both, so a row like
`'& table:nth-of-type(1):empty'` is not pruned by the `:nth-of-type` type rule while its unguardable
`:empty` half quietly disappears. The per-reason breakdowns quoted below are deduped, so they can be
a line or two under the presence-basis table.

**Precedence** (first rule that fires wins): not-a-selector → pattern-specific proof → codemod-able
→ unreachable → needs-judgement. `unreachable` therefore reads as "would otherwise need judgement,
but sits in a package the codemod does not even scope in".

### Host ground truth the rules rest on

Read from `@atlaskit/top-layer`, not assumed:

- popover host is `<div popover>` — `src/popover/popover.tsx:401`
- dialog host is `<dialog>` — `src/dialog/dialog-content.tsx:273`
- surface content is rendered **inside** the host (`popover-surface` wraps `children` in its own
  div), so for a `> X` argument only the host element itself is a candidate match
- `role`, `data-testid`, `id`, `aria-label` are **consumer-supplied** and forwarded to the host, so
  a compound qualified only by those is host-matchable. A consumer _semantic class_ is not: the
  host's `className` is `cx()` over DS-internal xcss only.

---

## `:nth-of-type` — the type-selector analysis

The hypothesis was that this prunes most of the 268: `:nth-of-type` counts siblings **of the same
element type**, the host is a `div` or a `dialog`, so `p:nth-of-type(2)`, `li:…`, `tr:…`, `span:…`
cannot shift when a host is inserted beside them.

The rule is sound and it does fire — but it prunes **half, not most**. Type histogram, by
`:nth-of-type(` occurrence (298 occurrences across the 268 lines):

| Leading type selector                       | Occurrences | Can the host shift the count?                            |
| ------------------------------------------- | ----------: | -------------------------------------------------------- |
| **(no type selector)**                      |      **75** | **yes** — groups by whatever type the matched element is |
| **`div`**                                   |      **52** | **yes** — host tag                                       |
| `td`                                        |          39 | no                                                       |
| `tr`                                        |          27 | no                                                       |
| `th`                                        |          20 | no                                                       |
| `span`                                      |          20 | no                                                       |
| _(not a pseudo — prose/rule name)_          |          15 | not a selector                                           |
| **`*` (universal)**                         |      **12** | **yes**                                                  |
| `p`                                         |          11 | no                                                       |
| `svg`                                       |           9 | no                                                       |
| `li`                                        |           8 | no                                                       |
| `col`, `ul`, `table`, `a`, `text`, `button` |          10 | no                                                       |
| **can shift**                               |     **139** |                                                          |
| **cannot shift**                            |     **144** |                                                          |
| not a selector                              |          15 |                                                          |

Line-level: **134 pruned** — 115 by the type rule, the rest comments, prose and lint-rule fixtures —
and **134 survive**. `dialog:nth-of-type` does not occur at all.

The reason the prune is 50% rather than 90% is the first two rows. **75 occurrences carry no type
selector** — `'&:nth-of-type(1)'`, `':nth-of-type(2)'`, `'[role="tab"]:nth-of-type(n)'`,
`':not(:nth-of-type(1))'`. Those group by the matched element's own tag, and if that element is a
`div` the host collides, so they cannot be pruned without resolving `&` to a tag. A further **52 are
literally `div:nth-of-type`**. So the hypothesis holds as physics and fails as a saving: the corpus
is dominated by exactly the two forms the rule cannot clear.

---

## `:has()` — the sampling method and what it found

`:has()` is 547 of 1,149 and the only pattern with a real `codemod-able` population. A host can
change the truth of `E:has(A)` in exactly two ways: (i) the host or something in its subtree
satisfies `A` relative to `E`; (ii) the host's presence changes whether a **real** element satisfies
`A`, i.e. `A` contains a positional pseudo. `:has()` can only ever go **false → true** — a host adds
elements, never removes them.

Both are fixable **in-argument**, which is what moves them out of the residue:

| Argument shape                          | Rewrite                                                                                                                                                              | Lines |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----: |
| descendant-reaching `A`                 | append `:not(:where([popover], dialog, [popover] *, dialog *, …))` to the rightmost compound of every top-level branch — §0.2 already specifies this descendant form |   282 |
| `> X` where the host itself matches `X` | `> X:not(:where(S))`                                                                                                                                                 |    10 |
| positional pseudo nested inside `A`     | the ordinary §0.2 `of S` rewrite, one level down                                                                                                                     |     1 |

All three are appends to the rightmost compound of each branch: mechanical given a selector parser,
and zero-specificity because `:where()` is weightless (§0.3).

What genuinely **cannot** be guarded in-argument — the 133 that stay:

| Reason                                                     | Lines | Why no guard exists                                                                                                                                                 |
| ---------------------------------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sibling combinator inside the argument                     |    49 | `:has(+ X)` / `:has(~ X)` / `:has(span+span)` — a host inserted between `E` and `X` breaks the adjacency and there is no `+ X of S` form. Same dead end as `& + X`. |
| interpolated argument                                      |    49 | `:has(${SEL})` — the branch structure is unknown at the site, so "append to the rightmost compound" is unsafe if `SEL` is a comma list                              |
| argument carries `:only-child` / `:nth-of-type` / `:empty` |    20 | no guard form at any nesting depth                                                                                                                                  |
| self-referential argument                                  |    12 | `:has(> &)`, `:has(&)` — `&` resolves to the enclosing rule, so the guard target is not local                                                                       |
| argument unterminated on the line                          |     3 | multi-line selector; not resolvable line-wise                                                                                                                       |

Deterministically safe (121): 44 comments, 26 `root-scoped-has-is-invariant`, 25
`host-cannot-match-direct-child`, 15 non-CSS (esquery AST selectors in ESLint rules, test titles), 9
generated artifacts, 2 lint-rule fixtures.

`root-scoped-has-is-invariant` is worth calling out as a new rule: **`body:has(X)` / `html:has(X)` /
`:root:has(X)` cannot change.** The top layer is a _painting_ concept, not a DOM relocation — the
host stays a descendant of `<body>`, and the flag-off `@atlaskit/portal` container is appended to
`document.body` too. Whether `X` exists somewhere under `<body>` is the same either way. 26 lines.

### Sampling method and confidence

The bucket rules are a script, but "is this argument really guardable" is a judgement the script
encodes rather than proves, so it was validated by hand-checking evenly-spaced samples (every _n_-th
of the 547 `:has(` lines in `rg` order — a systematic sample, not a convenience one).

- **Sample 1 (n=36)** — 33/36 correct. Drove four rule corrections: a checked-in **minified** CSS
  bundle counted as one line, a test _title_ containing `:has(+)` counted as a selector,
  `body:has()` invariance missed, and `:has(> .class > …)` under-pruned to `codemod-able` when it is
  provably safe.
- **Sample 2 (n=36, different stride)** — 35/36 correct. One imprecision found and left in: a line
  with two `:has()`, one root-scoped and one not, is pruned wholesale by the `body:has()` early
  return. **3 lines** are affected; they are counted as safe and may not be.
- **Sample 3 (n=30, final classifier)** — **30/30 correct.**

**`hasGuardableFraction` = 293 / 547 = 0.54** (n=30 sampled, 30/30 agreement). Of the _live_
`:has()` lines — excluding the 121 that are safe or not selectors at all — the guardable share is
293 / 426 = **0.69**.

**The 282-line descendant-guard row is the most contestable number in this document, and the whole
result turns on it.** It is a _design claim_, not a measured one: the rewrite has not been
implemented, and the descendant guard has not been round-trip verified in a browser the way the
seven `of S` authoring forms were. Two honest caveats:

1. **The guard is a no-op at most of these sites.**
   `'.extension-container:has([data-native-embed-alignment])'` is mechanically guardable, but a
   top-layer surface will never contain that attribute. Calling it `codemod-able` is a claim about
   _who owns the row_ (the transform), not a claim that 282 latent bugs exist. Under the plan's
   stated posture — always emit, do not decide whether it would have mattered — that is the correct
   owner. Under a "only rewrite what can break" posture it is 282 more rewritten sites for no
   behavioural gain.
2. **It needs a real selector parser**, which the `first-child`/`last-child` transform does not: the
   guard must be appended per top-level branch (`:has(button,a)` needs both), and appended _inside_
   any wrapping `:not()`.

If a reviewer rejects the descendant-guard claim, those 282 lines return to the residue and
judgement work rises from **505 to 787**. That is the sensitivity that matters; it is stated here
rather than buried so the decision can be made against either number.

---

## `:empty`, `only-child`, `& + `, `& ~ ` — the null result

These four are **340 lines** (`:empty` 176, `only-child` 81, `& + ` 77, `& ~ ` 6) and **254 of them
stay** — a 25% prune, all of it non-selector hygiene rather than any structural proof. This is the
honest finding of the exercise and it should not be softened.

- **`:empty` (176 → 126 judgement).** The only deterministic rules that fire are non-selector
  pruning: **24 lines are `rg` false positives** — `'712020:empty'`, `'client:root:actions:empty'`,
  `'/gateway/api/…/task?:empty'`, `':empty_value'`, `:empty-container-count`, test titles. No void
  element (`input:empty`, `img:empty`) occurs, so that rule never fires. Whether a given element
  "actually receives a host" is not statically decidable.
- **`only-child` (81 → 59).** No type-based prune exists, and that is a property of the selector,
  not a gap in the script: **`:only-child` is type-agnostic** — it counts every sibling regardless
  of tag, so unlike `:nth-of-type` there is nothing for the host's tag to miss. Combined with §0.2's
  finding that `:nth-child(1 of S):nth-last-child(1 of S)` is (0,2,0) against (0,1,0) and so fails
  gate 2, this pattern is irreducible. 21 pruned, all comments / bare-word `only-child` in prose /
  generated files.
- **`& + ` (77 → 64) and `& ~ ` (6 → 5).** Nothing prunes these. Adjacency needs the parent's child
  list, which the selector does not describe, and there is no type or scope rule to apply.
- **`injectGlobal` / `createGlobalStyle` (24 → 7).** 9 of the 24 lines are imports or re-exports of
  the API, which carry no selector; the real judgement unit is the **call site**, and there are 7
  across 13 files.

### One narrowing argument that is real but not scriptable

For `:empty` there is a strong argument the script deliberately does **not** apply as a bucket:
`E:empty` can only flip if a host is inserted as a child of `E`. An **anchored** host is inserted
beside its trigger, and the trigger is itself a child of `E` — so `E` was never `:empty`, and the
match cannot flip. Only an **in-place** adopter (`modal-dialog`, `drawer`, `flag`, `spotlight`)
landing in an otherwise-empty container can flip it.

That would cut the 126 `:empty` rows substantially, but it needs to know _which adopter renders
there_, which is precisely the per-site question filter 2 exists to answer. It is recorded here as a
triage heuristic for the W2 prompts — "if the adopter is anchored, `:empty` is safe" — not as a
prune.

---

## Reachability — filter 1 delivers 7 rows

As the plan warns, do not expect much: filter 1 prunes ~6–7% globally. On the residue it prunes **7
of 1,149 (0.6%)** — worse than globally, because the residue concentrates in editor, renderer,
smart-card and product packages that are all comfortably in scope. All 7 are
`no-path-to-a-migrated-adopter`; **the three `wrapped` adopters (`react-select`, `datetime-picker`,
`avatar-group`) contribute zero** — they hold no residue rows at all.

Reachability is not a lever here. Reported as found, not as hoped.

---

## Measurement caveats

- **`node_modules` is excluded from every basis.** Traversing it (`rg -uu`) inflates the union ~4×
  and caused every wrong number in earlier drafts of this plan. Do not "fix" this by removing the
  exclusion.
- **One "line" is a 75 KB minified stylesheet.**
  `platform/services/frontkit-dashboard/prebuilt/index.<hash>.css:1` is a single-line build artifact
  carrying a whole sheet. It plus `adminhub/mock/mock-server/aui/*.min.css`, the auto-generated
  `platform/package-declarations/**/declaration.d.ts` files, and two `*.codegen.tsx` files account
  for the **24** rows bucketed `generated-build-artifact-not-hand-written-source`. Fixing those
  means regenerating them, not judging them.
- **16 rows are a linter's own pattern table or fixtures** (`eslint-plugin*/src/rules/**`,
  `ratcheting/src/rules/**`) — selector strings matched against other code, never applied as CSS.
- **3 lines** may be over-pruned by the `body:has()` early return (see Sample 2).
- Playwright / `querySelector` selector strings are counted **conservatively as judgement**, not
  pruned, even though they are DOM queries rather than style rules. A host insertion can genuinely
  break them.

## Re-run

```bash
cd <repo-root>
node platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/classify-residue.mjs \
  --out /tmp/residue-classification.json
```

Read-only over the repo; JSON to stdout, tables to stderr. Useful flags:
`--print-bucket needs-judgement`, `--print-bucket deterministically-safe:empty` (dump a bucket for
eyeballing), `--sample-has 30` (regenerate the `:has()` sampling frame), `--scope <path>` (point at
a different `filter1-scope.json`). Reachability reuses `filter1-scope.json` from
[`filter1-package-scope.md`](./filter1-package-scope.md); if that file is absent the script still
runs and reports `unreachable: 0`.

The JSON carries the full `judgementRows` list (`site`, `pattern`, `reason`) — **505 rows across 283
files** — which is the shard input for W2, replacing the 1,149/516 figure.

---

## Bottom line

**The real judgement-work figure is ~505 rows in 283 files, not 1,149 in 516 — a 2.3× reduction.**
Uncertainty is asymmetric and concentrated in one place:

- **Firm floor: ~505.** `:empty` (126), `nth-of-type` (134), `only-child` (59), `& + ` / `& ~ ` (69)
  and the `:has()` non-guardables (133) are irreducible by any rule tried here. If anything this
  floor is slightly **too low** — 3 lines may be over-pruned by the `body:has()` rule, and the
  Playwright-locator rows are counted in but are arguably not style work.
- **Ceiling: ~787,** if the reviewer rejects the `:has()` descendant-guard claim and returns those
  282 lines to the residue. That single design decision is worth more than every other filter in
  this document combined.
- **Not a source of upside: reachability.** Filter 1 clears 7 rows; the wrapped adopters clear none.

So the plan's "1,149 bounded per-site questions" is an overstatement by roughly 2×, but this is
**not** the 50:1 collapse the candidate:violation ratio elsewhere in the plan might have suggested.
The residue is genuinely large. The two hypotheses the exercise was built to test both came back
weaker than hoped: `:nth-of-type` prunes **half**, not most, because 127 of its 298 occurrences are
either `div` or carry no type selector at all; and `:empty` / `only-child` / the sibling combinators
prune essentially nothing, for reasons that are properties of the selectors rather than gaps in the
tooling. The one genuine saving is `:has()`, and it is a saving only if the descendant guard is
accepted as part of the transform.

For the sequencing decision this feeds: at ~505 rows the residue is still the largest fan-out in the
plan and still wants W2, but it is no longer close to the ~2,614-line codemod population, so
sequencing it **after** the codemod costs one re-measure rather than a re-plan.

**Confidence: medium.** The denominator and all seven per-pattern counts reproduce the plan exactly;
the `:nth-of-type` rule is a spec property; the `:has()` classification was validated at 30/30 on a
final systematic sample. The medium rather than high rating is entirely the 282-line
descendant-guard claim, which is unimplemented and unverified in a browser.
