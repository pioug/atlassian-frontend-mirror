# Labelled corpus — unsafe selectors fixed by the two landed passes

Pre-work for [`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md) → Step 2, _Calibrate
first_.

`corpus/manifest.jsonl` is the ground truth a candidate detector is scored against. Every row is a
selector site that one of the two landed passes actually rewrote, with its verbatim pre-fix
selector, the verbatim selector as shipped, and the labels needed to compute precision and recall.

| Source commit   | Pass                       | Sites  | Violation files |
| --------------- | -------------------------- | ------ | --------------- |
| `8a3600f3f196b` | tooltip-driven (PR 427523) | 23     | 17              |
| `234fda770bd2b` | audit-driven (PR 430991)   | 30     | 20              |
| **Total**       |                            | **53** | **37**          |

## What this corpus proves — and what it does not

**It proves reproduction.** Both landed passes were themselves grep-driven: someone searched for
`& > *`, `:last-child`, `[role="presentation"]` and friends, then triaged the hits by hand. So the
corpus is a sample of _patterns a human already knew to look for_. A detector scored at 100% recall
here has proved one thing only: **it re-finds everything the previous greps found.** That is a
necessary gate — the plan's "a detector that cannot re-find all of these is not ready to sweep 1000
files" — and it is a real gate, because a detector built around one authoring form or one selector
shape will visibly fail it.

**It does not prove recall against the real population.** Specifically:

1. **The corpus is not a random sample.** It is the intersection of "a human grepped for it" and "a
   human judged it worth fixing". Selector shapes nobody grepped for are absent by construction, so
   recall measured here is an _upper bound_ on recall over the ~1500-candidate pool.

2. **Whole selector classes have zero rows.** `selectorClass` `global` and `reverse` are
   unrepresented; so is the `xcss` authoring form, every product `.css` file, and every
   `injectGlobal` / `createGlobalStyle` site. §0.5 calls `injectGlobal` the highest-risk class in
   the repo and this corpus says nothing about it. Of the §0.2 canonical guard forms,
   `& > *:first-child` → `:nth-child(1 of …)` is exercised by **zero** rows. A detector can score
   100% here and be blind to all of it.

3. **The landed passes demonstrably missed sites in the very files they edited** (see
   "Known-unlabelled sites" below). Seven same-pattern sites survived in three already-touched
   files. A detector that finds them is _more_ correct than the corpus, but naive scoring counts
   them as false positives. The scoring contract therefore treats them as an explicit allowlist
   rather than as errors — and the fact that this allowlist is needed at all is the sharpest
   available evidence that the corpus under-counts the true population.

4. **Fixed ≠ at-risk, and unfixed ≠ safe.** PR 430991 deliberately left two evaluated sites alone
   (`FeedbackScoreButtons` `& > * { flex: 1 }`, and confluence `EmojiWrapper` `> * span` — the
   latter in a file neither commit touches, so it is outside this corpus entirely). Reachability is
   Phase 2's job, not the detector's. Precision here measures "did you find a selector a human
   agreed was unsafe", not "did you find something genuinely broken at runtime".

Treat the score as a regression gate on pattern coverage. Do not report it as repo-wide recall.

## Counts

Sites: **53**. Violation-bearing files: **37**. Files touched by the two commits: **42**.
Non-violation changed files: **5**.

### Non-violation changes (excluded from the manifest, counted separately)

| File                                                                             | Commit          | Why excluded                                                             |
| -------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------ |
| `platform/.changeset/top-layer-fixing-unsafe-tooltip-usage.md`                   | `8a3600f3f196b` | changeset                                                                |
| `platform/.changeset/unlucky-chefs-sit.md`                                       | `234fda770bd2b` | changeset                                                                |
| `.../issue-type-page-field-active/tests/IssueTypePageFieldActiveStyled.test.tsx` | `234fda770bd2b` | jest CSS-string assertions updated to match the fix (2 selector strings) |
| `.../issue-type-page-field-active/tests/styledStyled.test.tsx`                   | `234fda770bd2b` | jest CSS-string assertions updated to match the fix (2 selector strings) |
| `.../gemini/.../playwright-vr-fixture/global-ignore-patterns.ts`                 | `234fda770bd2b` | VR tooling: ignore Emotion's `":nth-last-child"` SSR console warning     |

### Discrepancy against the plan

The plan (§Scale, §"Calibrate the detector") states **57 violations in 42 files**. Measured:

- **42 files is right** if it means _files touched_. Only **37** of them contain a violation; the
  other 5 are the table above.
- **53 violations, not 57.** The 4-site gap is almost certainly the two jest test files: each
  updated **2** selector strings inside a CSS-string assertion (`& > *` and `& > :last-ᴄhild`),
  which is 2 × 2 = 4 — exactly the difference. Those are assertion updates that _track_ fixes made
  elsewhere, not fix sites, so they are counted as non-violation changes here.

Recommendation: the plan should read **53 violations across 37 files (42 files touched)**, and the
candidate:violation ratio in §Scale should be recomputed from 53.

### By `selectorClass`

| Class        | Sites |
| ------------ | ----- |
| `positional` | 16    |
| `universal`  | 14    |
| `descendant` | 11    |
| `attribute`  | 9     |
| `sibling`    | 3     |
| `global`     | 0     |
| `reverse`    | 0     |

Classification precedence, applied to the first compound of the pre-fix selector: `positional` >
`sibling` > `attribute` > `universal` > `descendant`. So `> *:not(:last-child)` is `positional` (it
needs `of S`, which is the actionable fact), and `& > div + div` is `sibling`.

### By `product`

| Product      | Sites |
| ------------ | ----- |
| `jira`       | 32    |
| `platform`   | 12    |
| `other`      | 6     |
| `confluence` | 2     |
| `townsquare` | 1     |

`other` = adminhub 1, kitsune 5.

### By `damageMode`

| Mode                 | Sites |
| -------------------- | ----- |
| `popover-receives`   | 37    |
| `both`               | 16    |
| `real-element-loses` | 0     |
| `unknown`            | 0     |

Derived from the shipped fix, which is the most reliable signal available: a guard-only fix
(`:not(:where(…))`) means the only damage was the host receiving declarations → `popover-receives`.
An `of S` fix means the host also occupied a positional slot → `both`, because
`:nth-last-child(n of S)` simultaneously stops the host matching _and_ restores the real element's
slot. Nothing lands in `real-element-loses` alone: every positional site in this corpus is also a
site where the host would have matched the rule itself.

### By `authoringForm`

| Form              | Sites |
| ----------------- | ----- |
| `inline-object`   | 26    |
| `compiled-css`    | 12    |
| `cssMap`          | 11    |
| `styled-template` | 3     |
| `raw-css`         | 1     |
| `xcss`            | 0     |
| `other`           | 0     |

`inline-object` = `styled.div({…})`; `compiled-css` = `css({…})` / `cssUnbounded({…})`; `cssMap` =
`cssMap({…})` / `cssMapScoped({…})`; `styled-template` =
`styled.div\`…\``/`css\`…\``; `raw-css` = a CSS string embedded in a template literal (`media-card` `wrapper/styles.ts`,
the one site where the selector never appears as an object key — a parser-only detector will miss
it).

### By `guardForm` (§0.2)

| Form                     | Sites |
| ------------------------ | ----- |
| `X`                      | 30    |
| `other`                  | 11    |
| `& > :not(:last-child)`  | 5     |
| `& > *:last-child`       | 3     |
| `& > div:last-child`     | 3     |
| `& > :not(:first-child)` | 1     |
| `& > *:first-child`      | 0     |

`other` (11) is the tail that the §0.2 table does not cover, and is the most interesting column for
codemod scoping: mid-selector guard insertion (`> *:focus`), multi-compound comma lists
(`JoinedButtons` ×4, `issue-type-page-field-active/styled.tsx` ×2), a guard on the subject of a
sibling combinator only (`& > * + *`), `:last-child` behind a state pseudo
(`&:hover > div:last-child`), and universal selectors whose fix drops the `*` (`> *` →
`> :not(:where(…))`). A codemod built from §0.2 alone handles 42 of 53 sites.

## Known-unlabelled sites (do not score as false positives)

Same-pattern sites the landed passes left behind **in files they otherwise edited**. Line numbers
are in the pre-fix file, i.e. valid in the materialized tree.

| Commit          | File                                                                       | Line | Selector           | Note                                            |
| --------------- | -------------------------------------------------------------------------- | ---- | ------------------ | ----------------------------------------------- |
| `8a3600f3f196b` | `…/issue-type-page-product-features-jsm-cmp/src/RestrictedAndReadOnly.tsx` | 223  | `& > *`            | missed                                          |
| `8a3600f3f196b` | `…/issue-type-page-product-features-jsm-cmp/src/RestrictedAndReadOnly.tsx` | 289  | `& > *`            | missed; structurally identical to the fixed 180 |
| `8a3600f3f196b` | `…/issue-type-page-product-features-jsm-cmp/src/RestrictedAndReadOnly.tsx` | 295  | `& > *:last-child` | missed; identical to the fixed 187              |
| `8a3600f3f196b` | `…/project-settings/issue-type-page/src/FieldInactive.tsx`                 | 696  | `& > *`            | missed                                          |
| `234fda770bd2b` | `…/issue-type-page-field-active/src/styled.tsx`                            | 259  | `& > *`            | missed (`verticalAlign`)                        |
| `234fda770bd2b` | `…/issue-type-page-field-active/src/styled.tsx`                            | 415  | `& > *`            | missed (margins/flex)                           |
| `234fda770bd2b` | `…/issue-type-page-field-active/src/styled.tsx`                            | 769  | `& > *`            | missed (`verticalAlign`)                        |
| `234fda770bd2b` | `…/contextual-survey/src/components/FeedbackScoreButtons.tsx`              | 36   | `& > *`            | **deliberately** excluded after evaluation      |

The last row is the durable record the plan asks for: `FeedbackScoreButtons` `& > * { flex: 1 }` was
evaluated and left alone. The other confluence exclusion the plan names (`EmojiWrapper` `> * span`)
is in a file neither commit touches and so is not in the materialized tree.

## Materialize

From the repo root (`/Users/areardon/atlassian/afm/master`):

```bash
node platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/materialize-corpus.mjs "$TMPDIR/unsafe-selector-corpus"
```

Writes `<outDir>/<commit>/<repo-relative-path>` — **37 files**, byte-identical to
`git show <commit>^:<file>`. The script is idempotent (it prunes and rewrites the commit directories
it manages) and drops a `.gitignore` containing `*` plus a `.materialized-unsafe-selector-corpus`
marker at the output root, so the tree can never be committed even if `<outDir>` is placed inside
the repo. Prefer an out-of-repo path regardless. Never commit the materialized tree.

Because the tree is byte-identical to the pre-fix state, `manifest.jsonl`'s `line` values are exact
within it — useful as a tie-breaker, though the contract below does not depend on them.

## Score

Run the candidate detector over the materialized tree and have it emit JSONL findings, one per
selector site:

```json
{
	"file": "<repo-relative path, commit segment stripped>",
	"line": 123,
	"selector": "<verbatim authored selector key>"
}
```

```bash
OUT="$TMPDIR/unsafe-selector-corpus"
node <detector>.mjs "$OUT" > "$TMPDIR/findings.jsonl"
node <scorer>.mjs \
  platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/corpus/manifest.jsonl \
  "$TMPDIR/findings.jsonl"
```

Strip the leading `<commit>/` segment from each detector path to recover the manifest's `file`
value. A detector that reports `<commit>/…` paths verbatim will score 0.

## Scoring contract

**Join key.** `(file, normalize(selector))`. Line numbers are deliberately _not_ part of the key so
the corpus survives rebases and re-materialization onto a drifted tree.

**`normalize(s)`** — apply in order, to both sides:

1. Strip one layer of matching surrounding quotes (`'`/`"`) if present.
2. Collapse every run of whitespace (including newlines/tabs) to a single space.
3. Normalize whitespace around `,`, `>`, `+`, `~` to a single space on each side of the combinator
   and none before a comma: `a>b` and `a > b` both become `a > b`.
4. Trim.

Do **not** normalize quote style inside attribute values ( `[role="presentation"]` and
`[role='presentation']` stay distinct) — the corpus contains both and a detector must reproduce the
authored form.

**Multiplicity.** 5 keys in this corpus carry **2** sites each (`task-info-item/index.tsx`
`div[role="presentation"]`, `multi-select-cell/view.tsx` `& > div`, `styled.tsx` `& > *`,
`styled.tsx` `& > *:last-child,[data-isEditable]…`, `floating-toolbar/Toolbar.tsx`
`> div:last-child`) — 53 sites collapse to 48 distinct keys. Match as a **multiset**: a key with
multiplicity _n_ is fully recalled only if the detector reports _n_ findings at that key. Surplus
findings beyond _n_ at a matched key are **not** false positives (they are almost always the same
rule re-reported) — cap the match at _n_ and discard the surplus.

**Definitions.** Let `M` be the manifest multiset, `F` the detector's finding multiset, `A` the
known-unlabelled allowlist above (as `(file, normalize(selector), line)` triples).

```
TP = |M ∩ F|                       (multiset intersection, per the capping rule)
FN = |M| - TP                      (labelled sites the detector missed)
FP = |F \ M| minus any finding matching A
recall    = TP / |M|               denominator 53
precision = TP / (TP + FP)
```

**Reporting.** A detector reports `{ path, recall, precision }`. Also report, separately and without
penalty:

- `allowlistHits` — findings matching `A`. **Higher is better**; 8/8 means the detector beat both
  landed passes.
- `fnByClass` and `fnByAuthoringForm` — a detector at 0.94 recall that misses the single `raw-css`
  site has a different (and much cheaper) problem than one missing all 16 `positional` sites.

**Gate.** `recall == 1.0` on all 53 sites. Precision is the tie-breaker between detectors that clear
the gate, and should be read alongside `allowlistHits` — a detector with lower nominal precision and
8 allowlist hits is the better instrument.

## Manifest schema

One JSON object per line.

| Field            | Notes                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `id`             | `sha1(file + selectorBefore + sorted(properties).join(','))`, first 12 hex chars                          |
| `commit`         | `8a3600f3f196b` or `234fda770bd2b`                                                                        |
| `file`           | repo-relative, pre-fix path                                                                               |
| `line`           | 1-based line in the **pre-fix** file (verified: every value is a removed line in that commit's diff)      |
| `selectorBefore` | verbatim authored selector key, pre-fix                                                                   |
| `selectorAfter`  | verbatim authored selector key, as shipped                                                                |
| `guardForm`      | matching §0.2 canonical form, or `other`                                                                  |
| `selectorClass`  | `universal`/`positional`/`attribute`/`descendant`/`sibling`/`global`/`reverse`                            |
| `damageMode`     | `popover-receives`/`real-element-loses`/`both`/`unknown`                                                  |
| `properties`     | declaration property names in the rule, authored casing (so both `marginRight` and `margin-right` appear) |
| `authoringForm`  | `compiled-css`/`cssMap`/`styled-template`/`xcss`/`raw-css`/`inline-object`/`other`                        |
| `product`        | `jira`/`confluence`/`platform`/`townsquare`/`other`                                                       |

**One documented deviation on `id`.** The specified hash inputs collide for 3 pairs of rows —
`styled.tsx` `& > *` ×2, `styled.tsx` `& > *:last-child,[data-isEditable]…` ×2, and
`floating-toolbar/Toolbar.tsx` `> div:last-child` ×2 — because each pair sits in the same file with
the same selector and the same property names, differing only in position. For the 2nd occurrence
(ordered by ascending `line`) the id is suffixed `-2`. All 53 ids are unique. This does not affect
scoring: the join key is `(file, selector)`, not `id`.

**Verification performed when this manifest was built** (all clean):

- Every `selectorBefore` occurs verbatim in `git show <commit>^:<file>`.
- Every `line` is a removed-line position in that commit's diff for that file — parsed from
  `git show -U0`, so the row cannot be pointing at an unrelated occurrence of the same pattern
  (three files contain such decoys; see "Known-unlabelled sites").
- All 37 materialized files are byte-identical to their git blobs, and all 53 `line` values land on
  a line containing their `selectorBefore` in the materialized tree.
