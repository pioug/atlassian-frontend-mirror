# Plan: make AFM's unsafe styles safe for top layer

**Goal:** no AFM-authored style breaks, or gets broken by, a DS surface rendering inline in the top
layer.

## Background

With `platform-dst-top-layer` (and `platform-dst-top-layer-tooltip`) on, DS layering surfaces stop
portalling to `<body>`. The host — a `<div popover>` or a `<dialog>` — becomes a real node in the
consumer's tree. So parent CSS that could never reach a portalled surface now matches it, and
positional selectors that counted only real children now count the host.

Three verified facts shape the work:

| Fact                                                                                                   | Consequence                                                                       |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| The host is in the DOM only while open or exit-animating                                               | Breakage is open-state only; existing VR and unit tests cannot see it             |
| Anchored adopters insert after the trigger; `spotlight`, `flag`, `modal-dialog`, `drawer` **in place** | A host can be a container's first DOM child, so bare `:first-child` is live today |
| `react-select`, `datetime-picker` and `avatar-group` wrap the host in their own element                | Their hosts can never reach a consumer's `& > *` — scope them out                 |

Non-selector layering hazards (portals, `z-index`, focus traps, blankets) are out of scope.

## Two populations

Split before any agent reads anything:

| Population    | Share | Fixed by                                   |
| ------------- | ----- | ------------------------------------------ |
| **Guardable** | ~75%  | Mechanical rewrite. No per-site judgement. |
| **Residue**   | ~25%  | Agent triage, one row at a time.           |

A guardable selector's rewrite is correct **whether or not** a host can reach it —
`:nth-child(An+B of S)` holds either way. So don't ask. Asking is the expensive part, it is where
misses come from, and the answer changes with every new adopter. Judgement is for the residue: ~450
rows.

---

## Step 1 — Write the guard-form doc

**Deliverable:** `notes/decisions/top-layer-unsafe-selectors.md`, one page. Later steps hand agents
its **path**, never its text. Without it each agent invents its own fix — the repo already carries
three divergent guard lists. The forms and specificity reasoning live in commits `b45e18ac59c21` and
`8765bd681cd8b`.

**Two damage modes**, needing different fixes:

- `popover-receives` — a declaration lands on the host. A `:not()` guard fixes it.
- `real-element-loses` — the host takes a positional slot, so a **real** element stops matching.
  **Only `of S` fixes this**; a `:not()` guard cannot.

**`L`** = `[popover], dialog, style, script, template, link, noscript`. **`S`** = `:not(:where(L))`.
Emit both **literally at every site**, never via a constant — a constant hides which of AFM's three
divergent `of` lists a site carries. (An earlier draft justified this by the ratchet count; that
argument is void, and the doc records why.)

```
X                       ->  X:not(:where(L))
& > *                   ->  & > *:not(:where(L))
& > div                 ->  & > div:not(:where(L))
& > *:first-child       ->  & > :nth-child(1 of S)
& > *:last-child        ->  & > :nth-last-child(1 of S)
& > :not(:first-child)  ->  & > :nth-child(n+2 of S)
& > :not(:last-child)   ->  & > :nth-last-child(n+2 of S)
& > *:only-child        ->  & > :nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))
```

`L` covers both routes into the top layer: `[popover]`, and `dialog` for modal and drawer, which use
`showModal()` and set no `popover` attribute. So it needs no revisiting as packages migrate.
Descendant rules also exclude the subtree — `[popover] *`, `dialog *` — and that wide form is what
goes inside a `:has()` argument, where the matching element is the host's _descendant_.

Every form above is specificity-neutral: `:where()` is weightless, `:not()` inherits its argument,
and `of S` contributes only the pseudo-class. Keep `S` weightless or that stops holding.

**Four traps, verified in Chromium. Each reads as fixed and is not:**

1. `X:not(S)` is a double negative matching only hosts. Append `:not(:where(L))`.
2. `& > div > div` needs **two** guards — the rightmost alone leaves the rule matching through the
   host, with the guard inert on the surface wrapper. `& > div > span` needs one; no host is a
   `<span>`.
3. `:has(A, B)` needs a guard on **every** comma branch, since `:has()` matches if any branch does.
   Split on top-level commas only.
4. `:only-child`'s naive `:nth-child(1 of S):nth-last-child(1 of S)` is (0,2,0) against (0,1,0). Use
   the form above.

**No guard form exists** for `:nth-of-type`, `:empty`, `& + X` / `& ~ X`, `:has(+ X)` /
`:has(X + Y)`, or `:has(… :hover / :focus-within / :active)`. That is the residue. Record the
candidate forms tried against each — "no guard form" is a claim about a search, and `:only-child`
was written off wrongly on exactly that basis.

---

## Step 2 — Enumerate into sqlite

One re-runnable script that **judges nothing**. A detector allowed to reason about risk rationalises
violations away.

```sql
PRAGMA journal_mode = WAL;   -- many agents, concurrent writers
PRAGMA busy_timeout = 5000;

CREATE TABLE selectors (
  id            TEXT PRIMARY KEY,  -- hash(file + selector text + rule body); survives line drift
  file          TEXT NOT NULL,     -- repo-relative
  selector      TEXT NOT NULL,
  declarations  TEXT NOT NULL,     -- feeds priority and the property-effect filter
  occurrences   INTEGER NOT NULL,
  population    TEXT NOT NULL,     -- 'guardable' | 'residue' | 'excluded'
  phase         TEXT NOT NULL,     -- 'ready' | 'processing' | 'done'
  fix           TEXT               -- the applied rewrite, once known
);
```

**No line numbers** — they drift. The `id` hash includes the rule body, so two rules sharing
selector text stay separate rows. `population` is assigned **by rule, not by an agent**: does a Step
1 guard form exist?

**Sources.** A `.tsx` grep for positional pseudo-classes finds about half:

- `css` / `cssMap` / `styled` objects, including **styles in a different file from their JSX** —
  `styled.tsx` exports `Container`, `index.tsx` renders `<Container><Tooltip/></Container>`.
- `xcss` and `css` prop values.
- `.css` files repo-wide, plus `injectGlobal` / `createGlobalStyle`. Highest-risk class: unbounded
  reach. Needs a real CSS parser.
- Overrides passed **into** DS components — `css`, `className`, `cssFn`, `xcss` land on DS
  internals, where the host now lives.
- `& > *` and `& > div`. The host **is** a `<div popover>`, so `& > div` receives; it carries no
  positional signal, so it is easy to miss.
- Concatenated selector strings, which must be **skipped** rather than guessed at. Statically
  detectable.

**Exclusions** — neither "all DS packages" nor a path glob:

- Host-authoring DS packages are allow-listed, but a glob over-excludes: some hold ordinary
  consumer-style selectors that do need rewriting. Audit per file and carve those back in.
- **Ungated `[popover]` producers**, though outside DS: `editor-common`'s `vanilla-tooltip` sets
  `popover = 'hint'`, and `pragmatic-drag-and-drop`'s honey-pot appends `popover="manual"` to
  `document.body` on every drag. Both sit in flag-**off** DOM, so a guard changes shipped behaviour.
- `examples/` and `examples-util/` are **in** scope — that is what consumers copy.

**Calibrate first.** Reconstruct the pre-fix tree for the two landed audit PRs (`8a3600f3f196b`,
`234fda770bd2b`) via `git show <commit>^:<file>`: 53 violations in 37 files, and recall must be
100%. That corpus holds zero global-style and zero reverse-direction rows, so recall can read 100%
while covering neither; both need hand-built fixtures.

---

## Step 3 — Rewrite the guardable population

**No agents.** The ESLint rule (`no-top-layer-unsafe-selectors`) and the codemod are the same
transform — build it once, autofixing to the Step 1 forms, then run it wide. It needs a real
selector parser; a regex that appends once produces traps 2 and 3.

Expect style-snapshot churn: tests asserting emitted CSS strings break at scale, and the transform
must rewrite the assertions it invalidates.

Land one commit per ownership slice on a single branch. The slice key is CODEOWNERS for platform and
confluence, `package.json` → `atlassian.team` for jira, which has no granular CODEOWNERS. Decide the
PR cut after the branch is green.

---

## Step 4 — Triage the residue

The sqlite queue. Per `residue` row:

1. **Claim** it (`phase = 'processing'`).
2. **Recon agent** resolves the styled element's JSX children outward from the selector, following
   `styled` / `cssMap` exports across files and recursing into child components **only until a DOM
   element is reached** — past that, an inline host can no longer reach the outer selector. Selector
   reach bounds the search: `& > X` is the immediate children, `& + X` / `& ~ X` the parent's
   children, `& X` the only unbounded case. **"Child" means DOM child, not React child.** Writes one
   `usages` row per site.
3. **Verify agents**, one per usage row: can a host occupy a position this selector reaches? Return
   `{ atRisk, reason, adjacency }`. `adjacency` is one line and the entire trace owed — never a file
   excerpt.
4. **Execution agent** reads the row's usages and returns `{ before, after }`.

Four rules:

- **Agents never write source or run git.** They return `before` / `after`; one applier script
  writes and the orchestrator commits serially. Otherwise two agents editing one file clobber each
  other, and parallel `git add` races on `index.lock`.
- **Default `atRisk = false` with a mandatory reason.** This is the residue's largest unbounded
  error, which is why Step 5 samples it.
- **Batch to the tooling.** Concurrency caps around a dozen agents and ~1000 per workflow run, so
  ~450 rows is several runs. The DB is the resume point.
- **Order by priority** so partial completion ships value: global styles, then `display` /
  `position` / `transform` on a universal child selector, then `real-element-loses` in
  product-critical surfaces, then the rest.

**Property-effect filter — `popover-receives` only.** An open host is `position: fixed`, so these
are inert on it and the site is a false positive:

`flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`, `align-self`, `justify-self`,
`grid-area`, `grid-column`, `grid-row`, `float`, `vertical-align`, `z-index`

These are live: `width`/`height`, `min`/`max-*`, `margin`, `padding`, `border`, `display`,
`position`, `inset`, `transform`, `overflow`, `pointer-events`, and every inherited typography
property. `position`, `inset` and `transform` override anchor positioning outright. The filter does
not apply to `real-element-loses`, where any property matters.

Two classes take no guard form and must be routed rather than patched: the reverse direction and
inheritance bleed, both in Step 6.

---

## Step 5 — Verify

Three scripts and one sample. Compute specificity; do not ask an agent to check it.

1. **Differential `matches()` oracle** in real Chromium — jsdom cannot evaluate
   `:nth-child(… of S)`. Assert `el.matches(before) === el.matches(after)` for every **real**
   element, and `host.matches(after) === false`. Fixture: real children plus at most the host. Add a
   `<style>` sibling and a _correct_ rewrite flips a real element — that is the intended SSR fix —
   so `<style>` / `<script>` / `<link>` belong in a separate expected-diff fixture.
2. **Specificity equality** — compute (a,b,c) before and after, assert equal.
3. **Totality and idempotency** — re-running yields no diff, and no in-scope guardable pattern
   survives outside the exclusion list. Assert guard **counts**: `'.x:has(button, a)'` → two,
   `'& > div > div'` → two, `'& > div > span'` → exactly one. A presence check passes on traps 2
   and 3.
4. **Re-triage ~5% of `atRisk = false` rows** adversarially — independent agent, blind to the
   original reason, stratified by pattern. The disagreement rate is the residual-risk bound; above
   ~5% the criteria are wrong, so fix them and re-sweep that class.

**Flag-off VR: zero diffs outside an enumerated set.** Not "zero diffs" — ungated `[popover]`
elements are in flag-off DOM today, and `L`'s SSR terms reach in-body `<style>` and `<link>`
producers by design. Enumerate the set **before** the sweep; a gate whose expected failures are
discovered by running it is not a gate.

**What tests structurally cannot see.** The host exists only while open, so no static VR or unit
test observes any of this. Worse for `:has(… :hover / :focus-within / :active)`: those match an
element _and its ancestors_, so the flip exists only while the pointer or focus is inside the
surface, and no guard form exists at any depth. Coverage there is `snapshotInformational` with a
`prepare` action that opens the surface _and_ hovers or focuses into it.

---

## Step 6 — Prevent, and close what grep cannot find

**Ratchet, early.** Ship the ESLint rule and ratchet to master ahead of the fixes or this is stale
on merge; AFM lands hundreds of PRs a day.

- Add a **fourth** entry to `NoUnsafeNthChildSelectors`
  (`platform/packages/monorepo-tooling/ratcheting/src/rules/no-unsafe-nth-child-selectors.ts`).
  Replacing the existing three would launder their coverage.
- **It must be the plain substring `:nth-last-child`, not a guarded-but-not-SSR-safe regex.** Rule
  sources are fed to `git grep -e` with neither `-E` nor `-P` (`ratcheting/src/utils/pathspec.ts`),
  so they must be POSIX **basic** regex; `git-helpers.ts` rethrows on any exit other than 0/1, so an
  unparseable source aborts the run instead of counting. Both
  `:nth-(last-)?child\((?![^)]*\bstyle\b)` and `:nth-last-child\(` fail with
  `parentheses not balanced`. **The ratchet therefore cannot tell a guarded selector from an
  unguarded one** — see the emission section of
  [`../decisions/top-layer-unsafe-selectors.md`](../decisions/top-layer-unsafe-selectors.md). What
  the fourth entry buys is the reverse direction: `:nth-last-child` is invisible to the first three
  (no colon before `last-child`), so this stops new unguarded `:nth-last-child` landing free. It is
  prevention, not progress measurement.
- **Do not build a count-drop gate on this rule.** Of the 1,766 lines it counts today, 1,177 (67%)
  carry `:first-child` or `:nth-child` and still count after the rewrite, because the guard's own
  output `:nth-child(1 of S)` matches the bare `:nth-child` substring. Only the 589
  `:last-child`-only lines could ever drop out. Enforcing the guard's _content_ is the ESLint rule's
  job, which reads the AST.
- **There are four registrations, not two,** and all four are diff-based off `merge-base..HEAD` with
  no stored count — so "re-baseline" is a no-op for the three JS ones:
  `platform/packages/monorepo-tooling/platform-ratcheting-config/src/ratcheting-rules.ts`,
  `platform/monorepo.config/tasks/global-ratcheting/rules/global-ratcheting-rules.ts`, and
  `confluence/next/tools/ratcheting/ratcheting-entrypoint.js`. The path this plan used to name
  (`monorepo.config/tasks/ratcheting/rules/ratcheting-rules.ts`) no longer exists.
- **jira is the exception: it runs a Rust engine** (`afm ratcheting-experimental`) whose `regex`
  crate has no lookaround at all, and it carries materialized artifacts —
  `platform/packages/monorepo-tooling/ratcheting/ratcheting-jira.toml` must be regenerated. This is
  the second, independent reason the fourth entry cannot use a lookahead.
- The confound is **27 newly-counted lines, not 63.** The 63 was a loose count of every line
  containing `:nth-last-child` (62 today); 35 of those already match one of the first three regexes
  on the same line and per-line dedupe means the fourth adds nothing there. Split: jira 14,
  confluence 4, wac 3, kitsune 2, platform 2, avp 1, townsquare 1. None sits inside the rule's
  `excluded` list, and because all four ratchets are diff-based these only bite a PR that touches
  those lines.
- `editor-common/src/styles/shared/table.ts:39` needs no exclusion: it is
  `> :nth-child(1 of :not(style, …))`, forward direction, so it still counts via the bare
  `:nth-child` exactly as today. Net zero.
- Fix that rule's advice, which steers authors toward `*-of-type` — the one pattern with no guard
  form.
- **The rule scans its own source file** (diff mode never applies `getDefaultExcluded`), so the
  `regexes` array must stay on one line or it counts as three. Pin it with `// prettier-ignore` plus
  a test; a comment alone is not enough.

**Inheritance bleed** has no selector to rewrite, so the audit cannot reach it. The only fix is the
host surface reset, applied in `popover/popover.tsx` and `dialog/dialog-content.tsx`, currently
covering six text-layout properties.

- Close its holes: `line-height` and `pointer-events` at minimum. `line-height: 0` on icon wrappers
  is everywhere, and an inherited `pointer-events: none` makes a popup unclickable.
- ~~Wrap it in `:where()` so it is (0,0,0) and a deliberate consumer override wins.~~ **Unreachable
  through `cssMap`, and dropped.** Three independent blockers, all verified: Compiled cannot emit a
  (0,0,0) rule at all (`&:where(&)` compiles to `._x:where(._x)`, still (0,1,0));
  `@atlaskit/ui-styling-standard/no-unsafe-selectors` works from an allow-list that omits `:where`,
  and suppressing it is itself ratchet-blocked by
  `ratcheting/src/rules/no-eslint-disable-ui-styling-standard-rules.ts`; and `@layer`, which would
  give the same "always loses" semantics, is blocked by that same rule. The one route that _can_
  emit (0,0,0) is a raw injected `<style>`, as `popper/src/create-popper-top-layer.tsx:150` already
  does — rejected because runtime injection is absent from server-rendered HTML and both hosts SSR,
  so a surface would render un-reset until hydration. Residual exposure is narrow: a consumer rule
  selecting the host at (0,0,1) now loses, and a (0,1,0) tie is decided by stylesheet insertion
  order. Neither host exposes a consumer override path for any reset property anyway — `Popover`
  takes no `className`/`xcss`, and `Dialog`'s `xcss` is a geometry-only union.
- **No `!important`, no specificity escalation.** A survey found 33 of 48 sites break under blanket
  `!important`, most of them DS-owned geometry and public width props.
- Add a test asserting the two duplicated copies match.

**Reverse direction** — rules that _targeted_ portalled content and now silently stop matching:
`body > .atlaskit-portal …`, `div[role="tooltip"] …`, anything coupled to the legacy portal DOM
shape. No positional grep finds these; they need their own detector and a bespoke rewrite per site,
routed to the owning team with evidence.

**Runtime sweep — the only evidence the fix was sufficient.** Inject a detector into the existing
Playwright suites with the flag on: on every `toggle` event, enumerate `document.styleSheets` and
test `host.matches(rule.selectorText)`, reporting hits not originating from DS. Wrap `.cssRules` in
try/catch for cross-origin sheets. Near-zero false positives, and the only instrument that can size
inheritance bleed or catch a class nobody enumerated. State suite coverage as a number — these
suites exercise a minority of product screens.

**New-adopter checklist**, in the decision doc: on gaining a top-layer code path, record the
package's insertion position and re-run the detector for the residue classes it newly exposes. The
guardable population needs no re-triage — that is the point of `of S`.

---

## Done when

1. The guard-form doc is the only source of guard strings, and lists the patterns with no guard form
   plus the candidate forms tried against each.
2. Detector recall against the 53-site corpus is 100%, precision recorded, with separate fixtures
   for global styles and the reverse direction.
3. Every `guardable` row is rewritten or excluded with a reason; the transform is total and
   idempotent; scope and exclusions are numbers, not adjectives.
4. Every `residue` row has a disposition, and every `atRisk = false` row a reason.
5. Steps 5.1–5.3 pass over every rewrite; 5.4's disagreement rate is recorded as the risk bound.
6. The surface reset has landed — ungated, with a test asserting its two copies match. **Not
   `:where()`-wrapped:** unreachable through `cssMap` for the three reasons recorded in Step 6.
7. The runtime sweep reports zero non-DS rules matching a host, with suite coverage stated.
8. The ESLint rule and ratchet are on master. "Re-baselined" is a no-op for the three JS
   registrations (all diff-based, no stored count); jira's Rust artifacts are regenerated.
9. The branch is green — `afm lint --changed`, targeted `afm ts check --project`, unit tests for
   touched packages, `yarn ratcheting` with the local `master` ref reset — with one commit per
   ownership slice and exactly one changeset.

**Claimed:** every guardable AFM-authored selector is rewritten by a verified transform rather than
a judgement call; the residue is triaged with a measured error bound; the host gives its surfaces
sane inherited defaults without fighting the cascade; new violations are blocked.

**Not claimed:** that no unsafe style can reach a surface. A consumer rule targeting the host
directly still wins, by design — that fix is the consumer's, enforced by the ESLint rule. CSS
outside AFM (Confluence custom stylesheets and admin custom HTML, Jira banners, legacy AUI/ADG,
server-rendered templates) is unmitigated, and the runtime sweep is the only thing that can size it.
