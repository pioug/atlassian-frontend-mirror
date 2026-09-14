# Top layer — guard forms for unsafe selectors

**Status:** Decided. This file is the **single source of guard strings** for
[`../plans/unsafe-selectors-plan.md`](../plans/unsafe-selectors-plan.md).

Every agent, codemod and lint rule that rewrites a selector for top-layer safety takes its guard
strings **from here and nowhere else**. Three divergent `of` lists already ship in AFM; without one
authority each pass invents a fourth. If you need a form that is not on this page, add it here first
— with the specificity arithmetic and the browser evidence — and then use it.

## Why any of this is needed

With `platform-dst-top-layer` (and `platform-dst-top-layer-tooltip`) on, DS layering surfaces stop
portalling to `<body>`. The host — a `<div popover>` or a `<dialog>` — becomes a real node in the
consumer's tree. Top-layer promotion is **paint and stacking only, not DOM relocation**, so the host
is still a DOM descendant of its insertion point. Two consequences: parent CSS that could never
reach a portalled surface now matches it, and positional selectors that counted only real children
now count the host.

The host is in the DOM **only while open or exit-animating**, so no static VR or unit test observes
any of this.

---

## The two term lists, and the two guards

Keeping these four names distinct is load-bearing. Conflating `L` with `S` produced an inverted
guard row — `X:not(S)` — in an earlier draft, which matched **only** hosts.

| Name | Definition                                                      | Specificity |
| ---- | --------------------------------------------------------------- | ----------- |
| `L`  | `[popover], dialog, style, script, template, link, noscript`    | (term list) |
| `S`  | `:not(:where(L))` — the **narrow** guard, and the `of` argument | (0,0,0)     |
| `Lw` | `L, [popover] *, dialog *` — adds the host's **subtree**        | (term list) |
| `Sw` | `:not(:where(Lw))` — the **wide** guard                         | (0,0,0)     |

Written out in full:

```
S  = :not(:where([popover], dialog, style, script, template, link, noscript))
Sw = :not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *))
```

**Use `S` when the element that must be excluded is the host itself.** **Use `Sw` when the element
that must be excluded is _inside_ the host** — every descendant-reaching selector, and every
`:has()` argument that can reach a descendant. Chromium confirms `[popover] *` excludes a match at
any depth inside the host whether or not the popover has been shown, and `dialog *` does the same
for the `<dialog>` host.

`L` covers both routes into the top layer: `[popover]`, and `dialog` for `modal-dialog` and
`drawer`, which use `showModal()` and set no `popover` attribute. **It therefore needs no revisiting
as packages migrate.** `dialog` is deliberately bare rather than `dialog:modal` — it over-excludes
in-flow `<dialog open>` at 2 known sites, accepted for the simpler term and for consistency with
what already ships.

### Emit the guard literally at every site — never via a constant

A guard interpolated from a constant (`of ${GUARD}`) hides which terms a site actually carries, and
AFM already ships three divergent `of` lists. Emit the full string, so that the ESLint rule, a
reviewer and `git grep` can all tell a canonical site from a two-term one.

**Do not justify this by the ratchet count.** An earlier draft did, and that argument is void.
`NoUnsafeNthChildSelectors` feeds each regex source to `git grep -e` with neither `-E` nor `-P`
(`ratcheting/src/utils/pathspec.ts`), so sources must be POSIX **basic** regex — plain substrings.
`git grep -e ':nth-(last-)?child\((?![^)]*\bstyle\b)'` fails with `parentheses not balanced`, and so
does `:nth-last-child\(`; `git-helpers.ts` rethrows on any exit other than 0/1, so such a source
aborts the run instead of counting. **The ratchet cannot distinguish a guarded selector from an
unguarded one**, and it never could.

The count does not fall when a site is fixed, either. Measured on the ratchet's own basis: of the
1,766 lines it counts today, **1,177 (67%) carry `:first-child` or `:nth-child`** and still count
after the rewrite, because the guard's own output `:nth-child(1 of S)` matches the bare `:nth-child`
substring. Only the 589 `:last-child`-only lines could ever have dropped out.

What the ratchet's fourth entry — the plain substring `:nth-last-child` — does buy is the reverse
direction: that family was invisible to the first three regexes (no colon before `last-child`), so
new unguarded `:nth-last-child` can no longer land free. **That is prevention, not progress
measurement.** Enforcing the guard's _content_ belongs to the ESLint rule, which reads the AST and
can require all seven terms. Do not build a gate on the ratchet count.

---

## The rewrite forms

### Two damage modes, needing different fixes

- **`popover-receives`** — a declaration lands on the host. A `:not()` guard fixes it.
- **`real-element-loses`** — the host takes a positional slot, so a **real** element stops matching.
  **Only `of S` fixes this**; a `:not()` guard cannot.

### Narrow forms — the host itself is the element to exclude

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

`& > div` carries no positional signal and is easy to miss, but the host **is** a `<div popover>`,
so it receives.

### Wide forms — something inside the host is the element to exclude

Descendant-reaching selectors and `:has()` arguments take `Sw`, appended to the **rightmost compound
of every top-level branch**:

```css
/* ✗ WRONG — guard on the last branch only. Measured F→T: no protection at all. */
.x:has(button, a:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *)))

/* ✓ RIGHT — every top-level branch guarded. */
.x:has(
  button:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *)),
  a:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *))
)
```

A positional pseudo nested inside a `:has()` argument takes the ordinary `of S` rewrite one level
down; that is browser-verified and needs no separate form.

### Specificity is neutral, by construction

`:where()` is weightless, `:not()` inherits the specificity of its most specific argument (here
`:where(…)`, so zero), and `:nth-child(An+B of S)` contributes only the pseudo-class plus the most
specific complex selector in `S` (zero). Every form above therefore preserves (a,b,c) exactly.
**Keep `S` and `Sw` weightless or that stops holding.** Never reach for `!important` or a
specificity bump: a survey of 48 sites found 33 break under blanket `!important`, most of them
DS-owned geometry and public width props.

---

## Traps — each reads as fixed and is not

All six verified in Chromium 143.

1. **`X:not(S)` is a double negative.** `S` is _itself_ a `:not()`, so `:not(S)` matches only hosts.
   Append `:not(:where(L))`, never `:not(S)`.
2. **`& > div > div` needs two guards.** The rightmost alone leaves the rule matching _through_ the
   host, with the guard inert on the surface wrapper. `& > div > span` needs one — no host is a
   `<span>`.
3. **`:has(A, B)` needs a guard on every comma branch,** since `:has()` matches if any branch does.
   Split on **top-level** commas only (commas inside `()` / `[]` are not branch separators).
4. **`:only-child`'s naive form fails on specificity.** `:nth-child(1 of S):nth-last-child(1 of S)`
   is (0,2,0) against (0,1,0). Use the form in the table.
5. **`:not()` nesting direction matters both ways.** Push the guard **inside** a wrapping
   `:not(:has(A))`; append it **onto** a `:not()` that is itself the argument's rightmost compound.
6. **Never emit a nested `:has()` inside a `:has()` argument.** Chromium rejects the _entire_
   selector, so the rule silently stops applying. Any repair form needing one is off the table.

Traps 2, 3 and 5 all require a **real selector parser**. A regex that appends once ships trap 3;
`'.x:has(button, a)'` → assert **two** occurrences of the guard is the minimum regression test.

Also **skip, do not guess**: 83 dynamically-constructed selector sites, and `:has(${SEL})`
interpolated arguments where the branch structure is unknown at the site. Statically detectable.

---

## Patterns with no guard form, and the search behind each claim

"No guard form" is a claim about a **search**, not a property of CSS — `:only-child` was written off
on exactly that basis and was wrong. Each row records what was tried, so the next reader extends the
search instead of repeating it.

| Pattern                                    | Candidate forms tried                                                                                                                                                                         | Verdict                                                                                                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:nth-of-type` / `:nth-last-of-type`       | `of S` — the CSS grammar admits `of` only on `:nth-child` / `:nth-last-child`. Type-selector pruning (`td`, `tr`, `th`, `span`, `p`, `li`, `svg`… cannot collide with a `div`/`dialog` host). | **Closed by grammar.** Type pruning marks occurrences _safe_, not _guarded_, and clears only ~half: 75 occurrences carry no type selector and 52 are literally `div:nth-of-type`. |
| `& + X` / `& ~ X`                          | `+ X of S` — no such form exists; `of` is not part of the combinator grammar. Adjacency needs the parent's child list, which the selector does not describe.                                  | **Closed by grammar.**                                                                                                                                                            |
| `:has(+ X)` / `:has(X + Y)`                | Narrow guard, wide guard, both measured (C9, C12, D1, D9).                                                                                                                                    | **Closed by measurement.** Goes true→false — the host destroys the adjacency the rule was written for — and no guard restores it.                                                 |
| `:has(… :hover / :focus-within / :active)` | Narrow guard, wide guard, both measured (C21, C22, C23, D7).                                                                                                                                  | **Closed by measurement.** See below — no form can exist.                                                                                                                         |
| `:empty`                                   | **No guard candidate has been tried.** Only non-selector pruning and reachability were attempted.                                                                                             | **Search open.** Treat as residue today, but this is a gap, not a proof.                                                                                                          |
| ~~`:only-child`~~                          | `:nth-child(1 of S):nth-last-child(1 of S)` — rejected at (0,2,0) vs (0,1,0). Then `:nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))` — **accepted**, exact and (0,1,0).             | **Resolved — has a guard form.** Do not return it to the residue; the form is in the table above. This row is the cautionary tale.                                                |

### Why propagating state pseudos can never have a guard form

`:hover`, `:focus-within` and `:active` match an element **and all its ancestors**. The host is
still a DOM descendant of its insertion point, so the moment focus or the pointer lands inside the
host, every **real** element between the host and the subject starts matching. The element that
flips is neither the host nor inside the host — it is the host's real _ancestor_ — so there is
nothing for a `:not(:where(…))` to exclude, at any depth, and there is no `of S`-style form for a
state pseudo.

Two measured refinements:

- **Non-propagating state pseudos are fine.** `:focus` / `:focus-visible` match only the focused
  element, which _is_ inside the host, so `Sw` holds. Do not route these to the residue.
- **The break is depth-dependent.** With the host as a _direct_ child of the subject there is no
  real element between them and `Sw` holds; add one real intermediate `div` and it breaks. Insertion
  depth is a per-site property, so this is not statically decidable — which is the definition of
  judgement work.

This class is **structurally invisible to the whole test strategy**: the flip exists only _during_
interaction. A static VR snapshot photographs the open host but never hovers or focuses inside it,
and a unit test asserting emitted CSS strings never evaluates a selector against a live hover chain.
Coverage requires `snapshotInformational` with a `prepare` action that opens the surface **and**
hovers or focuses into it.

### `:has()` residue that is not a guard-form problem

Route these by skipping, not by patching: interpolated arguments, self-referential arguments
(`:has(> &)` — `&` resolves to the enclosing rule, so the guard target is not local), arguments
unterminated on the line, and arguments that themselves carry `:nth-of-type` / `:empty`.

---

## The guards are **not** all flag-off no-ops

Do not assert "zero flag-off diffs". Assert **zero diffs outside an enumerated set**, and enumerate
it _before_ the sweep — a gate whose expected failures are discovered by running it is not a gate.
Three populations are expected to change with the flag **off**:

1. **`L`'s SSR terms reach in-body `<style>` / `<link>` producers by design.** A `<style>` sibling
   is in the DOM today regardless of top layer, so `:nth-last-child(1 of S)` already selects a
   different element than `:last-child`. That is the intended SSR fix. ~5 enumerable files.
2. **Ungated `[popover]` producers**, outside DS and in flag-off DOM today: `editor-common`'s
   `vanilla-tooltip` (`popover = 'hint'` on the trigger) and `pragmatic-drag-and-drop`'s honey-pot
   (`popover="manual"` on `document.body`, on every drag). Both gate on capability, not on
   `platform-dst-top-layer`, so a guard changes shipped behaviour — these are **excluded**, not
   rewritten.
3. **`Sw` specifically is not a no-op.** Its subtree terms reach into _any_ popover or dialog
   subtree, including consumer `<dialog>`s, ungated `popover="hint"` tooltips, and
   `shouldRenderToParent` sites where the surface was already inline with the flag off. Every wide
   rewrite lands in the expected-diff set.

Rewriting `:last-child` → `:nth-last-child(…)` also trips `@emotion/cache`'s own SSR warning at ~607
sites that are silent today (its regex matches `:nth-last-child` but not `:last-child`). That
warning is currently suppressed globally for VR; revisit the suppression rather than rely on it.

---

## New-adopter checklist

On gaining a top-layer code path, a package must record three things here or in the migration
roadmap:

1. **Its insertion position.** Current ground truth, 11 of 11 resolved:

   | Position        | Adopters                                                       | Consequence                                                                                                      |
   | --------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
   | `after-trigger` | `popup`, `dropdown-menu`, `select`, `inline-dialog`, `tooltip` | Cannot take slot 1 by itself                                                                                     |
   | `in-place`      | `spotlight`, `flag`, `modal-dialog`, `drawer`                  | **Can be a container's first DOM child — bare `:first-child` is live**                                           |
   | `wrapped`       | `react-select`, `datetime-picker`, `avatar-group`              | Host is inside the adopter's own element, so it can never reach a consumer's `& > *` — a deterministic exclusion |

2. **Whether it wraps pre-existing DOM.** No current adopter does: in-place adopters render their
   own previously-portalled content, and anchored hosts are inserted beside the trigger. The
   conclusion that a **leading `~`** inside a `:has()` argument is guardable (21 rows) rests
   entirely on that premise. If a new adopter wraps a subtree, `~` breaks the way `+` does and that
   conclusion is void.

3. **A re-run of the detector for the residue classes it newly exposes.** The **guardable population
   needs no re-triage** — that is the entire point of `of S`: the rewrite is correct whether or not
   a host can reach the site.

---

## Authoring forms

The guard round-trips through all seven AFM authoring forms with zero blockers: `css()`, `cssMap()`,
`styled` template literals and `xcss` by existing usage; `@atlaskit/css`, raw `.css` (postcss /
cssnano / lightningcss) and interpolated selectors by experiment. The `cssMap` selector validator —
flagged as the highest risk, since `@atlaskit/css` has a strict API allowlist — accepts the guard.

## Related

- **[`../plans/unsafe-selectors-plan.md`](../plans/unsafe-selectors-plan.md)** — the plan this doc
  is step 1 of; owns scope, sequencing and the definition of done
- **[`../plans/unsafe-selectors-prework/has-guard-verification.md`](../plans/unsafe-selectors-prework/has-guard-verification.md)**
  — the Chromium fixture and truth table behind every `:has()` claim on this page (cases C1–C25,
  D1–D9), and the naming of the interaction-only hazard class
- **[`../plans/unsafe-selectors-prework/of-list-and-ratchet-interaction.md`](../plans/unsafe-selectors-prework/of-list-and-ratchet-interaction.md)**
  — why seven terms in one pass, and the ratchet interaction
- **[`../plans/unsafe-selectors-prework/residue-classification.md`](../plans/unsafe-selectors-prework/residue-classification.md)**
  — per-pattern residue classification and the `:nth-of-type` type-selector analysis
- **[`../plans/unsafe-selectors-prework/round-trip-authoring-forms.md`](../plans/unsafe-selectors-prework/round-trip-authoring-forms.md)**
  — the seven authoring forms, and the 83 dynamic sites that must be skipped
- **[`../plans/unsafe-selectors-prework/codemod-exclusions.md`](../plans/unsafe-selectors-prework/codemod-exclusions.md)**
  — the allow list, carve-outs and file-level exclusions
- Landed guard work, for worked examples: commits `b45e18ac59c21` and `8765bd681cd8b`
