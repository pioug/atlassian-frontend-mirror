# Filter 1 — package-level reachability scope

> **Pre-work for** [`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md). **Generated:**
> 2026-08-10 against `master` @ `13ed8365cec29`. **Outcome: the plan does not use this filter** — it
> prunes only 7% of candidate lines, so it cannot carry the "we rewrote where a surface can appear"
> argument it was built for. Kept as the measurement that retired the idea.

## Purpose

Phase 2 filter 1 decides **which packages the positional-selector codemod is allowed to touch**. Its
job is to drop any package with no dependency or import path to a **migrated** top-layer adopter, on
the grounds that a package that can never host a top-layer surface has nothing to guard against.

**This filter is deterministic.** It is a script over `package.json` graphs and `rg` passes — no
model judgement, no bundler, no AST. Re-running it on the same commit produces byte-identical
output. It is the cheap half of Phase 2; the expensive per-site half (filter 2) runs on the residue
only.

> ### ⚠️ Correction to the plan's scale table
>
> The plan's §0 scale table reports ~11,838 candidate lines (first-child 6,064 + last-child 4,444 +
> nth-child 921 + nth-of-type 306 + only-child 103). **That number is ~4x inflated because the `rg`
> that produced it traversed `node_modules`.** Reproduced here with `rg -uu` (ignore files
> disabled), the same pattern set and globs give a union total of 12,770 lines — of which **9,651
> (76%) are inside `node_modules`**, i.e. installed third-party packages that are not AFM code and
> that the codemod can never touch.
>
> The tell is `only-child`: the plan's table says **103**, my `-uu` run says **103**, and AFM source
> says **81**. The plan's figure for the pattern that occurs _least_ in `node_modules` matches the
> node_modules-traversing run **exactly** — that is the reconciliation. The patterns that diverge
> most (`first-child` 6,064 vs 7,508; `last-child` 4,444 vs 6,188) are precisely the ones
> third-party CSS is full of, and they diverge because installed-dependency state differs between
> the two runs.
>
> | Pattern           | Plan table | `-uu` (node_modules in) | **Corrected** (in-repo, no node_modules) | Tracked source only |
> | ----------------- | ---------: | ----------------------: | ---------------------------------------: | ------------------: |
> | `first-child`     |      6,064 |                   7,508 |                                    1,704 |               1,301 |
> | `last-child`      |      4,444 |                   6,188 |                                      853 |                 853 |
> | `nth-child`       |        921 |                     937 |                                      826 |                 418 |
> | `nth-of-type`     |        306 |                     338 |                                      268 |                 268 |
> | `only-child`      |        103 |                     103 |                                       81 |                  81 |
> | _per-pattern sum_ |   _11,838_ |                _15,074_ |                                  _3,732_ |             _2,921_ |
> | _union_           |        n/a |                _12,770_ |                              **_3,119_** |             _2,707_ |
>
> (Per-pattern columns sum higher than the union because a line matching both `first-child` and
> `last-child` is counted once per pattern but once in total. The plan's table is a per-pattern sum,
> so it double-counts as well.) The `-uu` figures are also **not reproducible** — they depend on
> which dependencies happen to be installed, which is why 12,770 here ≠ 11,838 there.
>
> **The plan's scale table should be restated as ~3,119 lines** (or ~2,707 for editable tracked
> source). Everything downstream that was sized off ~12,000 — reviewer load, subagent fan-out, the
> "hundreds not ~12,000" residue estimate — is sized against a number that is three-quarters
> third-party CSS.

## Headline result — the filter does not prune hard

Primary basis: **raw `rg --count` matching lines, ignore files disabled, `node_modules` excluded** —
the plan's own basis minus the indefensible part.

| Measure                                                 |    Value |
| ------------------------------------------------------- | -------: |
| Adopter seeds used                                      |   **13** |
| `package.json` files enumerated (packages)              |   13,725 |
| **In scope** (union of dep closure + import grep)       |   10,110 |
| **Out of scope** (pruned)                               |    3,615 |
| Package-level prune ratio                               | **0.26** |
| Candidate lines total (`*.ts`, `*.tsx`, `*.css`)        |    3,119 |
| Candidate lines **in scope**                            |    2,931 |
| Candidate lines **out of scope**                        |      188 |
| Candidate lines unattributed (no owning `package.json`) |        0 |
| **Candidate-line prune ratio**                          | **0.06** |

The two ratios disagree, and the second one is the one that matters. Filter 1 removes **26% of
packages but only 6.0% of candidate lines**, because positional selectors and overlay usage are
strongly co-located: the packages that write `:first-child` are UI packages, and UI packages reach
an adopter. 2,931 of 3,119 candidate lines survive the filter.

Phase 2 currently claims filter 1 "prunes hard" and that the surviving package count "is the
difference between _we rewrote the repo_ and _we rewrote where a surface can appear_." **On the
current adopter set, measurement does not support that assertion — it does not survive.** With
10,110 of 13,725 packages and 94% of candidate lines in scope, filter 1 does not distinguish "where
a surface can appear" from "the repo". The 188 pruned lines are almost entirely non-product tooling
— VR templates, codemods, dev-tooling, an email renderer, one marketing service. **The full
out-of-scope candidate population, all 18 owners:**

| Lines | Package                                   | Dir                                                               |
| ----: | ----------------------------------------- | ----------------------------------------------------------------- |
|    43 | `@af/gemini-template`                     | `studio/dev-tooling/gemini-template`                              |
|    43 | `@af/visual-regression`                   | `platform/build/test-tooling/gemini-visual-regression`            |
|    40 | `@wac/trello`                             | `wac/services/trello`                                             |
|    14 | `isl`                                     | `afm-tools/src/packages/isl/isl`                                  |
|    10 | `isl-components`                          | `afm-tools/src/packages/isl/components`                           |
|     8 | `@atlaskit/react-ufo`                     | `platform/packages/react-ufo/atlaskit`                            |
|     6 | `@jira-dev/compiled-codemods`             | `jira/dev-tooling/packages/compiled-codemods`                     |
|     5 | `@atlaskit/email-renderer`                | `platform/packages/editor/email-renderer`                         |
|     3 | `atlassian-frontend-monorepo`             | _(repo root)_                                                     |
|     3 | `@atlassian/gemini`                       | `platform/packages/monorepo-tooling/gemini`                       |
|     3 | `graph-vizualizer-poc`                    | `afm-tools/src/graph-visualizer`                                  |
|     3 | `@atlassian/react-resource-router`        | `jira/src/packages/platform/react-resource-router`                |
|     2 | `@atlaskit/adf-utils`                     | `platform/packages/editor/adf-utils`                              |
|     1 | `@atlassian/local-devmetrics-server`      | `platform/prebuilt-tools/local-devmetrics-server`                 |
|     1 | `@post-office/playwright`                 | `post-office/operations/playwright`                               |
|     1 | `@atlassian/a11y-violations-code-scanner` | `platform/packages/accessibility/ci/a11y-violations-code-scanner` |
|     1 | `@atlassian/react-async`                  | `platform/packages/async/react-async`                             |
|     1 | `@jira-dev/ratcheting-config`             | `jira/dev-tooling/packages/ratcheting-config`                     |

An `!**/dev-tooling/**` + `!**/gemini*/**` path exclusion would have bought 96 of those 188 lines (5
of the 18 owners, 51%) for free, without any graph work at all. Filter 1 is still worth running — it
is nearly free, and its per-product table is useful for sequencing the codemod — but it should not
be presented to reviewers as the justification for the diff size.

### Both bases, side by side

| Basis                                                                |    total |  in scope |     out | prune ratio |
| -------------------------------------------------------------------- | -------: | --------: | ------: | ----------: |
| `repoWideIgnoreOff` — **primary**; ignore files off, no node_modules |    3,119 | **2,931** |     188 |  **0.0603** |
| `trackedSourceOnly` — `.gitignore` respected (build output excluded) |    2,707 |     2,522 |     185 |      0.0683 |
| _(plan's literal basis — `-uu`, node_modules traversed)_             | _12,770_ |   _9,257_ | _3,513_ |    _0.2751_ |

Both defensible bases give the same verdict: a prune ratio of 0.06–0.07. The difference between them
is 412 lines of `.gitignore`d build output (399 of them under `platform/packages/*/dist`), which the
codemod would never edit — so **`trackedSourceOnly` is the better estimate of real codemod work**,
and `repoWideIgnoreOff` is reported as primary only because it is the closest honest reproduction of
the plan's own measurement discipline.

The plan's literal `-uu` row is listed for completeness and must not be used: its 0.2751 ratio is an
artifact of _where `node_modules` directories happen to sit_ (repo-root `node_modules` attributes
outside any in-scope product root, product-level `node_modules` attributes inside one). It measures
directory layout, not reachability.

## The migrated-adopter set used

Source of truth: [`../../decisions/migration-roadmap.md`](../../decisions/migration-roadmap.md),
column _Migrated (FF)?_ — "ships a top-layer code path" (imports `@atlaskit/top-layer` and branches
on `platform-dst-top-layer`).

**`migrated` — 12 packages, all seeds:**

`@atlaskit/popup`, `@atlaskit/tooltip`, `@atlaskit/modal-dialog`, `@atlaskit/dropdown-menu`,
`@atlaskit/flag`, `@atlaskit/spotlight`, `@atlaskit/select`, `@atlaskit/datetime-picker`,
`@atlaskit/inline-dialog`, `@atlaskit/avatar-group`, `@atlaskit/react-select`, `@atlaskit/drawer`

**`primitive` — 1 package, also a seed:** `@atlaskit/top-layer`. A package that imports the
primitive directly can render a surface without going through an adopter, so it has to seed the
closure too.

→ **13 seeds** in the canonical run. All 13 resolve to a workspace `package.json`.

**`in-progress` — 2 packages, NOT seeded by default:** `@atlaskit/menu` (roadmap: "No\*" — no
package-local adapter because menu is in-flow, but Playwright + VR run with the flag) and
`@atlaskit/inline-message` (roadmap: "Tests only", no `@atlaskit/top-layer` import in component
source). Available via `--include-partial`; see sensitivity below.

**`deferred/unmigrated` — never seeded:** `@atlaskit/blanket` (replaced by `::backdrop`),
`@atlaskit/onboarding` (deprecated in favour of Spotlight), `@atlaskit/banner` (static / in-flow),
`@atlaskit/navigation-system` (flyouts deferred).

**Legacy layering infra — never seeded:** `@atlaskit/portal`, `@atlaskit/layering`,
`@atlaskit/popper`. These are the _old_ stack; depending on them is evidence of **not** being on the
top layer.

## How the scope was computed

Three passes, unioned:

1. **Enumerate.** `git ls-files 'package.json' '**/package.json'`, `node_modules` filtered out →
   13,725 packages (13,365 distinct names, 25 unnamed, 0 unparsable, 90 names claimed by more than
   one directory).
2. **Reverse transitive closure** over `dependencies` + `devDependencies`, seeded from the 13
   adopters. Only workspace-internal names are followed (an external npm package cannot lead back
   into the repo). → **10,080 packages**. New packages per hop:
   `[13, 3097, 4453, 2137, 294, 68, 17, 1, 0]` — the closure saturates at hop 8, and **6,970 of the
   10,080 arrive at hop ≥ 2**, which is where the over-inclusiveness lives.
3. **Import-specifier `rg` pass**, because many jira / confluence / adminhub source trees import
   `@atlaskit` packages without declaring them. One pass over `*.ts,tsx,js,jsx,mjs,cjs` with the
   quote-delimited specifier regex (all 13 seeds alternated, subpaths allowed):

   ```
   ['"`](?:@atlaskit/popup|@atlaskit/tooltip|…|@atlaskit/top-layer)(?:/[^'"`]*)?['"`]
   ```

   → 18,289 matching files, attributed to **3,186 packages**.

Union: **10,110** (dep-closure-only 6,924; grep-only 30; both 3,156). The grep pass adds only 30
packages the dependency closure missed — undeclared-import drift is real but small.

### Files with no owning package boundary

Every file is attributed to its **nearest ancestor `package.json`**. Where that ancestor is a
product root (`avp/`, `wac/`, `jira/`, …) or the repo root, the file lives in a source tree with no
owning package — the "ancestor fallback":

- **Import grep:** 17,557 of 18,289 files attributed to a real package dir; **732 fell back** to a
  product/repo root; 0 unattributed.
- **Candidate lines:** **32 of 1,097 files (126 lines) attributed via fallback** on the primary
  basis (23 files / 113 lines on the tracked-source basis); **0 unattributed on either basis**. The
  product roots that absorb these (`avp`, `wac`) are in scope, so in this run the fallback does not
  hide anything — but it is a structural weakness, see caveat 3.

## Per-product breakdown

Candidate columns are the **primary** (`repoWideIgnoreOff`) basis.

| Product       |  pkgs | in scope | cand. lines in | cand. lines out |
| ------------- | ----: | -------: | -------------: | --------------: |
| platform      | 2,453 |    1,311 |          1,081 |              64 |
| jira          | 6,009 |    4,685 |            509 |              10 |
| adminhub      |   608 |      548 |            446 |               0 |
| avp           |   147 |      132 |            279 |               0 |
| post-office   | 2,391 |    2,079 |            202 |               1 |
| wac           |    27 |        3 |            120 |              40 |
| confluence    |   869 |      671 |            120 |               0 |
| townsquare    |   362 |      316 |             57 |               0 |
| mercury       |   191 |      140 |             46 |               0 |
| help-center   |   139 |      102 |             44 |               0 |
| studio        |    40 |       34 |              3 |              43 |
| afm-tools     |   276 |        5 |              0 |              27 |
| volt          |     5 |        3 |             12 |               0 |
| guard-detect  |     3 |        1 |              7 |               0 |
| kitsune       |    21 |        8 |              3 |               0 |
| flask         |     1 |        1 |              2 |               0 |
| `<repo-root>` |     1 |        0 |              0 |               3 |
| _(12 others)_ |   182 |       71 |              0 |               0 |

Two things worth carrying into Phase 3 sequencing: `adminhub` and `avp` together hold 725 candidate
lines (23% of the total) on 755 packages, i.e. far denser than jira; and **503 in-scope packages own
candidate lines, so the codemod's real blast radius is 503 packages, not 10,110**. The heaviest are
`adminhub/mock` (144), `wac/services/wac-web` (120), `platform/packages/editor/editor-core` (116),
`post-office/integrated-teams/confluence/common` (93) and
`platform/packages/design-system/css-reset` (86). Note that `platform`'s jump from 679 (tracked) to
1,081 (primary) is entirely `.gitignore`d `dist/` build output in DS packages (`modal-dialog` 93,
`navigation-system` 90, `top-layer` 89) — real source, but not editable source.

## Sensitivity

Candidate columns are the **primary** (`repoWideIgnoreOff`) basis.

| Variant                                                    | in scope | cand. in | cand. out | prune ratio |
| ---------------------------------------------------------- | -------: | -------: | --------: | ----------: |
| **canonical** — 13 seeds, unbounded closure ∪ grep         |   10,110 |    2,931 |       188 |  **0.0603** |
| `--include-partial` — 15 seeds (adds menu, inline-message) |   10,112 |    2,931 |       188 |      0.0603 |
| `--max-depth 1` — direct dep or direct import only         |    3,231 |    2,299 |       820 |      0.2629 |

Two readings:

- **The `menu` / `inline-message` question does not matter.** Adding both moves the scope by 2
  packages and 0 candidate lines. They are already reachable via other adopters. This closes the
  `in-progress` classification question for filter 1's purposes.
- **`--max-depth 1` prunes 4x harder and is unsound.** It excludes `@atlaskit/css-reset` (86
  candidate lines) — a **global stylesheet**, i.e. the exact P0 population Phase 3 prioritises. It
  also excludes `@post-office/confluence-common` (93) and `@adminhub/mock` (144). Do not adopt it as
  the scope definition; it is reported only to show how much of the canonical scope is carried by
  hop-≥2 edges.

## Re-run

Everything in this report, both bases, one command:

```bash
cd /Users/areardon/atlassian/afm/master   # any dir inside the repo works; root is auto-detected
node platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/filter1-package-scope.mjs \
  --out platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/filter1-scope.json
```

~90s (two candidate `rg` passes over the whole repo, ~30s each). Read-only, idempotent, progress on
stderr, JSON on stdout.

Flags: `--include-partial` (seed `menu` + `inline-message`) · `--max-depth <n>` (cap the closure;
`1` = direct only) · `--no-candidates` (skip both slow joins, ~15s total) · `--list-out-of-scope`
(also emit the 3,615 pruned packages) · `--repo <path>` · `--out <path>`.

### The artifact must stay pretty-printed, one list entry per line

`filter1-scope.json` is emitted with `JSON.stringify(result, null, 2)` and nothing else. Do not
re-introduce the compaction that collapsed `inScopePackages` and `outOfScopePackageList` onto one
line each. It saved ~50KB and cost a reverted plan.

The reason is `issue-automat`, the job behind the `<Product> - Automat - Shard N of M` steps. It
scans every `.ts`, `.tsx` and `.json` file under `platform/packages/` (its ENGHEALTH campaign rules
carry no `include`, only `exclude: ['**/node_modules/**']`), greps them with unanchored greedy
patterns, and copies each `git grep --only-matching` hit verbatim into the "Matches in this package"
list of a Jira description. A 1MB line is therefore a 1MB candidate match.

The compacted `inScopePackages` line contained
`"@atlassiansox/engagekit-ts\tplatform/packages/personalization/engagekit-ts"`, which was enough to
match all four patterns of the `remove-deprecated-engagekit-usage-platform` rule and yield matches
of 688KB, 651KB, 376KB and 10KB. Jira rejected the resulting description with
`CONTENT_LIMIT_EXCEEDED`, failing `Platform - Automat - Shard 3 of 6` on master for every team in
that shard (pipelines 19421320 and 19452151), and the plan was reverted in `ca0a047004a9`.

Pretty-printed, each package sits on its own ~60 character line with no `import`, `jest`, `path` or
`workspace` token in front of or behind it, so the rule finds nothing here at all. To check a future
data artifact before landing it, from `platform/`:

```bash
git grep --line-number --only-matching \
  -e "import.*@atlassiansox/engagekit-ts" --or -e "jest.*@atlassiansox/engagekit-ts" \
  --or -e "@atlassiansox/engagekit-ts.*workspace" --or -e "path.*personalization/engagekit-ts" \
  -- ./packages | awk '{ print length($0) }' | sort -rn | head -1
```

More generally, no committed `.ts`/`.tsx`/`.json` file under `platform/packages/` should carry a
pathologically long line, because every ENGHEALTH regex campaign is a fresh chance for one to become
an oversized Jira payload.

The two candidate bases the script measures, as bare `rg` if you want to verify them independently:

```bash
# PRIMARY — raw rg matching-line counts, ignore files off, node_modules excluded → 3,119
rg -c --no-messages --no-ignore -g '*.ts' -g '*.tsx' -g '*.css' -g '!**/node_modules/**' \
  -e 'first-child|last-child|nth-child|nth-of-type|only-child' . | awk -F: '{s+=$NF} END{print s}'

# ALT — rg defaults (.gitignore respected, build output excluded) → 2,707
rg -c --no-messages -g '*.ts' -g '*.tsx' -g '*.css' \
  -e 'first-child|last-child|nth-child|nth-of-type|only-child' . | awk -F: '{s+=$NF} END{print s}'

# The plan's (inflated) basis, for reference only — node_modules traversed → 12,770, DO NOT USE
rg -c --no-messages -uu -g '*.ts' -g '*.tsx' -g '*.css' \
  -e 'first-child|last-child|nth-child|nth-of-type|only-child' . | awk -F: '{s+=$NF} END{print s}'
```

If `node` fails with `OpenSSL configuration error: … /System/Library/OpenSSL/openssl.cnf`, prefix
with `OPENSSL_CONF=/dev/null` — that is a local sandbox artefact, not a script problem.

## Caveats — where this filter is unsound

Ordered by how much they should change your confidence.

1. **Children / render-prop hosting — under-inclusive, and unmeasurable here.** A package with no
   static reference to any adopter still **hosts** a surface when a parent passes
   `<Tooltip>`-containing children (or a render prop, or a `slot`) into that package's styled
   element. The selector lives in the out-of-scope package; the popover arrives from the caller's
   tree. There is no static edge to find, so no dependency-graph filter can see it. This is the one
   caveat that could invalidate a pruning decision on real product code, and it is the reason Phase
   0b (host hardening) cannot be skipped in favour of the codemod.

2. **Global styles are not scoped by dependency direction at all — under-inclusive.** A selector in
   a global stylesheet applies to the whole document regardless of who depends on whom.
   `@atlaskit/css-reset` (86 candidate lines) only lands in the canonical scope by accident, through
   a devDependency chain via `@atlaskit/docs` / `@atlaskit/section-message` — nothing in its runtime
   dependencies reaches an adopter. `--max-depth 1` prunes it, which is the proof. Any global or
   product-wide stylesheet must be force-included by path, not left to the closure.

3. **Source trees with no `package.json` boundary — over-inclusive here, under-inclusive in
   general.** 732 adopter-importing files and 32 candidate files (126 lines) resolve only to a
   product-root `package.json`. Attribution to the product root makes the entire product a single
   scope unit, so those files are neither individually confirmed nor individually excluded. In this
   run the affected roots (`avp`, `wac`) are in scope → over-inclusive. But if a product root ever
   fell out of scope, every unowned file beneath it would be silently pruned → under-inclusive. The
   direction of the error is a property of the run, not of the method, which is the real problem.

4. **Transitive `dependencies` + `devDependencies` is not a render-reachability relation —
   over-inclusive, and this dominates the package count.** 6,970 of 10,080 packages enter at hop
   ≥ 2. "Depends on something that depends on `@atlaskit/tooltip`" is nearly universal in AFM and
   says nothing about whether the package renders an overlay. devDependency edges are the worst
   offenders: docs/example/test tooling drags in packages whose runtime never touches an adopter,
   which is how `platform/packages/monorepo-tooling/gemini-vr-ap-entry-point` (43 candidate lines)
   stays in scope.

5. **The grep proves a specifier, not a render — over-inclusive.** `jest.mock('@atlaskit/tooltip')`,
   `import type { TooltipProps }`, a commented-out import and a string in a codemod fixture all
   match. No JSX resolution is attempted (deliberately — that is filter 2's job).

6. **Package-level granularity — over-inclusive.** An in-scope package has _all_ its files in scope,
   including build scripts, `__tests__` fixtures, VR snapshots and codemod inputs. The codemod needs
   its own file-level exclusion list on top of this scope; filter 1 does not supply one.

7. **90 package names are claimed by more than one directory — over-inclusive.** The closure walks
   names, so a dependency on a duplicated name marks every claimant in scope. TypeScript `paths` /
   resolver-specific disambiguation is not modelled.

8. **`peerDependencies` are not traversed — under-inclusive.** A package that lists an adopter only
   as a peer dep, expecting the host to supply it, has no edge in this graph. Small in AFM
   (workspace deps are declared explicitly and `check-peer-dependencies` enforces it) but non-zero.

9. **CSS that is not in the repo is outside the enumeration entirely.** Confluence custom
   stylesheets and admin custom HTML, Jira announcement banners, legacy AUI/ADG, server-rendered
   templates. The plan already routes these to Phase 0b; noted so the 3,119 is not mistaken for a
   total.

10. **`node_modules` is deliberately excluded from every basis — and this is not a caveat, it is the
    correction.** Installed third-party packages are not AFM code, cannot be codemodded, and are
    reinstalled per machine. Any count that includes them (like the plan's current scale table) is
    both wrong for scoping and irreproducible. The `repoWideIgnoreOff` basis does still include
    `.gitignore`d in-repo build output (412 lines, 399 of them `platform/packages/*/dist`), which is
    also not editable — that is why `trackedSourceOnly` (2,707) is the better estimate of actual
    codemod work.

**Net.** Caveats 4–7 (over-inclusive) explain why the filter keeps 74% of packages. Caveats 1–3 and
8 (under-inclusive) mean the 26% it prunes is not provably safe to prune — but the pruned population
is 18 tooling packages holding 188 lines, so the exposure is small in absolute terms. The filter is
worth keeping as a cheap sanity bound and a sequencing input. It is not worth advertising as the
thing that keeps the diff small.

## Artifact

Full in-scope list (10,110 entries, `"<package name>\t<repo-relative dir>"`):
[`filter1-scope.json`](./filter1-scope.json) → `.inScopePackages`.

```json
{
	"deterministic": true,
	"adopterSource": "platform/packages/design-system/top-layer/notes/decisions/migration-roadmap.md",
	"adopters": {
		"seedsUsedCount": 13,
		"migrated": [
			"@atlaskit/popup",
			"@atlaskit/tooltip",
			"@atlaskit/modal-dialog",
			"@atlaskit/dropdown-menu",
			"@atlaskit/flag",
			"@atlaskit/spotlight",
			"@atlaskit/select",
			"@atlaskit/datetime-picker",
			"@atlaskit/inline-dialog",
			"@atlaskit/avatar-group",
			"@atlaskit/react-select",
			"@atlaskit/drawer"
		],
		"primitive": ["@atlaskit/top-layer"],
		"inProgress": ["@atlaskit/menu", "@atlaskit/inline-message"],
		"inProgressIncludedInSeeds": false,
		"deferredOrUnmigrated": [
			"@atlaskit/blanket",
			"@atlaskit/onboarding",
			"@atlaskit/banner",
			"@atlaskit/navigation-system"
		]
	},
	"packages": {
		"total": 13725,
		"distinctNames": 13365,
		"unnamed": 25,
		"namesClaimedByMultipleDirs": 90
	},
	"reach": {
		"maxDepth": "unbounded",
		"depClosureNewPackagesPerHop": [13, 3097, 4453, 2137, 294, 68, 17, 1, 0],
		"depClosurePackages": 10080,
		"importGrepPackages": 3186,
		"unionInScope": 10110,
		"depOnly": 6924,
		"grepOnly": 30,
		"both": 3156,
		"importGrepFiles": 18289,
		"importGrepFilesAttributedDirect": 17557,
		"importGrepFilesAttributedViaAncestorFallback": 732,
		"importGrepFilesUnattributed": 0
	},
	"inScopePackagesCount": 10110,
	"outOfScopePackages": 3615,
	"candidateSignalByBasis": {
		"repoWideIgnoreOff": {
			"basis": "repoWideIgnoreOff",
			"rgIgnoreFilesDisabled": true,
			"nodeModulesIncluded": false,
			"regex": "first-child|last-child|nth-child|nth-of-type|only-child",
			"globs": ["*.ts", "*.tsx", "*.css"],
			"countedAs": "matching lines (rg --count), same basis as the plan scale table",
			"totalLines": 3119,
			"linesInScope": 2931,
			"linesOutOfScope": 188,
			"linesUnattributed": 0,
			"filesInScope": 1049,
			"filesOutOfScope": 48,
			"filesAttributedViaAncestorFallback": 32,
			"linesAttributedViaAncestorFallback": 126,
			"pruneRatio": 0.0603
		},
		"trackedSourceOnly": {
			"basis": "trackedSourceOnly",
			"rgIgnoreFilesDisabled": false,
			"nodeModulesIncluded": false,
			"totalLines": 2707,
			"linesInScope": 2522,
			"linesOutOfScope": 185,
			"linesUnattributed": 0,
			"filesInScope": 983,
			"filesOutOfScope": 46,
			"filesAttributedViaAncestorFallback": 23,
			"linesAttributedViaAncestorFallback": 113,
			"pruneRatio": 0.0683
		}
	},
	"inScopePackages": ["… 10110 entries — see filter1-scope.json"]
}
```

`candidateSignal` in the artifact is an alias for the primary (`repoWideIgnoreOff`) basis.
