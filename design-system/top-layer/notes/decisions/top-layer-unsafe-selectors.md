# Top layer — guard forms for unsafe selectors

**Status:** Decided. This file is the **single source of guard strings** for the hand-fixes in
[`../plans/unsafe-selectors-plan.md`](../plans/unsafe-selectors-plan.md).

Every hand-fix that guards a selector for top-layer safety takes its guard string **from here and
nowhere else**. Three divergent `of` lists already ship in AFM; without one authority each fix
invents a fourth. If you need a form that is not on this page, add it here first, with the
specificity arithmetic and the browser and build evidence, and then use it.

> ## ⛔ The `of S` forms are withdrawn — do not apply them
>
> Every form on this page that contains an `of` clause is **correct CSS and unshippable**, because
> Atlaspack's Rust Compiled transforms write the `of` clause with no space, as an invalid selector
> the browser discards. Read
> [The `of S` forms do not survive the build](#the-of-s-forms-do-not-survive-the-build) before using
> any positional row of the table below. The `:not(:where(…))` forms are unaffected and ship.

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

## The term lists and the guards

Keeping these names distinct is load-bearing. Conflating `L` with `S` produced an inverted guard row
— `X:not(S)` — in an earlier draft, which matched **only** hosts.

| Name | Definition                                                             | Specificity |
| ---- | ---------------------------------------------------------------------- | ----------- |
| `L`  | `[popover], dialog`                                                    | (term list) |
| `G`  | `:not(:where(L))` — the **narrow** guard                               | (0,0,0)     |
| `Lw` | `L, [popover] *, dialog *` — adds the host's **subtree**               | (term list) |
| `Gw` | `:not(:where(Lw))` — the **wide** guard, absolute (global scope)       | (0,0,0)     |
| `Li` | `L, & :is(L) *` — the host, and the subtree of a host nested under `&` | (term list) |
| `Gi` | `:not(:where(Li))` — the **wide** guard, relative (nested scope)       | (0,0,0)     |
| `Ls` | `L, style, script, template, link, noscript` — adds non-rendered tags  | (term list) |
| `S`  | `:not(:where(Ls))` — the `of` argument, **withdrawn**                  | (0,0,0)     |

Written out in full:

```
G  = :not(:where([popover], dialog))
Gw = :not(:where([popover], dialog, [popover] *, dialog *))
Gi = :not(:where([popover], dialog, & :is([popover], dialog) *))
S  = :not(:where([popover], dialog, style, script, template, link, noscript))
```

`[data-focus-guard]` is deliberately not a term of `S`. Every top-layer path removes
`react-focus-lock`, so its sentinel elements are the same with the flag on and off, and a term would
change only flag-off behaviour.

### Which wide guard: `Gi` at nested scope, `Gw` at global scope

`Gw`'s subtree terms mean "not inside **any** surface". So when the element carrying `&` is itself
rendered inside a Modal or a popover, every compound under it is `dialog *` or `[popover] *`, and
the rule stops applying to the component's own content. `Gi` names `&` inside the guard: it excludes
the host and the subtree of a host nested **under `&`**, and nothing above `&`. A component inside a
surface keeps its own descendant rules; a surface nested inside the component stays excluded.

- **Nested scope** (style objects, `css` / `styled` templates, the `css` and `xcss` props): use
  `Gi`.
- **Global scope** (`.css` files, `injectGlobal`): there is no `&`, so use `Gw`.

**Two traps when you write `Gi` by hand.** Both were measured in real builds.

1. **Write the `&` out.** A key that contains `&` anywhere loses implicit nesting, in Compiled and
   in stylis. So `div:not(:where(…& …))` emits an unscoped `div:not(…)` that matches every `div` on
   the page. Write `& div<Gi>`. Compiled and stylis decide this per comma branch, so `'> div, span'`
   becomes `'> div<G>, & span<Gi>'`.
2. **Write the `&` on the enclosing key too.** Compiled's babel path substitutes a nested `&` before
   an implicit parent key is nested under the component. So under `'.p': { '& .q<Gi>': … }` the
   guard is anchored to `.p`, not to the component, and under `> div` it becomes an invalid term
   that `:where()` drops. Write `'& .p'`. A parent key that opens with a pseudo-class (`:hover`) is
   correct as it is. stylis is correct either way.

**Known limitation.** A nested `&` stands for the parent key's whole selector, so a `Gi` on a nested
key excludes only surfaces between its parent's element and its own. The parent's own guard covers
the gap above. When the parent cannot be guarded (for example `'.r:first-child'`), a surface between
the component and `.r` stays open.

**Why one `&`, not `& [popover] *, & dialog *`.** stylis 4, which Emotion uses, substitutes only the
first `&` inside a pseudo-class argument. The two-`&` spelling therefore leaves `& dialog *`
literal, which a browser reads as `:scope dialog *`, the absolute term again. `& :is(L) *` matches
the same elements with one `&`. It also grows more slowly when nested: a nested `&` expands to the
whole parent selector, guards included, so each level doubles the guard text rather than tripling
it.

**Specificity.** `Gi` is still (0,0,0): everything is inside `:where()`, which is weightless
whatever it contains, `:is()` included.

### Certified in all three production transforms

Production code is built by three Compiled transforms: `ap` (Gemini VR and the `ap` tool),
`@atlaspack/rust` (Jira and Confluence processes in the `compiledCssInJsTransformer` rollout), and
babel extract (`@compiled/babel-plugin` with strip-runtime, everywhere else). Each was driven on
`Gi`, then `@compiled/parcel-optimizer`'s `buildDeterministicStylesheet`, then lightningcss minify,
and the rules were counted with Chromium's `CSSStyleSheet.replaceSync`:

| Shape                                | Forms                                                | babel extract | `@atlaspack/rust` | `ap`   |
| ------------------------------------ | ---------------------------------------------------- | ------------- | ----------------- | ------ |
| explicit `& div<Gi>`                 | `css()`, `cssMap`, `cssMapScoped`, `styled` template | 1 rule        | 1 rule            | 1 rule |
| implicit key written as `& span`     | the same four                                        | 1 rule        | 1 rule            | 1 rule |
| two levels, `& .a<Gi>` > `& .b<Gi>`  | the same four                                        | 1 rule        | 1 rule            | 1 rule |
| `&:nth-last-child(n+2 of S)` control | `css()`, `cssMap`, `styled` template                 | 1 rule        | **0**             | **0**  |

In Chromium 143, `Gi` gives the expected six-case result. Content of a component on the page, in a
modal or in a popover matches. Content of a popover or a dialog inside the component does not, and
neither does a popover inside the component when the component is in a modal. stylis 3 and 4 emit
`Gi` intact.

**Certifying a new guard form.** Gemini VR certifies `ap` output only. A new form must also survive
`@atlaspack/rust` and babel extract, then `buildDeterministicStylesheet`, then a Chromium rule count
of one per rule, before it ships.

### Why guards are applied by hand, not to every site

A blanket rewrite was measured and rejected. The relative guard repeats the parent selector at each
nested level, so it grows CSS fast:

| File                                              | Before  | With `Gw`      | With `Gi`        |
| ------------------------------------------------- | ------- | -------------- | ---------------- |
| Editor main stylesheet (`EditorContentContainer`) | 292,559 | 506,643 (+73%) | 796,774 (+172%)  |
| Editor main stylesheet, gzipped                   | 31,529  | 35,418 (+12%)  | 42,314 (+34%)    |
| team-calendar `FullCalendarWrapper`               | 51,060  |                | 5,278,650 (×103) |

The editor's longest single selector with `Gi` is 19,512 characters. The absolute `Gw` is smaller
but wrong for the editor: 98.8% of its declarations sit under a `Gw` and would turn off for an
editor inside any surface. A DS-owned host attribute in place of `L` does not help either, because a
DS Modal or popup would carry the attribute too.

So guard only the sites where a hazard is real, and use `Gi` there.

### Other rules for every guard

**Why the guards leave out the non-rendered tags.** `style`, `script`, `template`, `link` and
`noscript` are `display: none`. A style that reaches one has no visible effect unless it sets
`display`, and that hazard predates the top layer. They matter only to positional counting, which
has no guard form while `of S` is withdrawn. So they stay in `Ls` and are left out of `G`, `Gw` and
`Gi`.

**Use `G` when the element that must be excluded is the host itself.** **Use the wide guard (`Gi` at
nested scope, `Gw` at global scope) when the element that must be excluded is _inside_ the host** —
every descendant-reaching selector, and every `:has()` argument that can reach a descendant.
Chromium confirms `[popover] *` excludes a match at any depth inside the host whether or not the
popover has been shown, and `dialog *` does the same for the `<dialog>` host.

`L` covers both routes into the top layer: `[popover]`, and `dialog` for `modal-dialog` and
`drawer`, which use `showModal()` and set no `popover` attribute. **It therefore needs no revisiting
as packages migrate.** `dialog` is deliberately bare rather than `dialog:modal` — it over-excludes
in-flow `<dialog open>` at 2 known sites, accepted for the simpler term and for consistency with
what already ships.

**Write the guard out in full at every site — never via a constant.** A guard interpolated from a
constant (`of ${GUARD}`) hides which terms a site carries, and AFM already ships three divergent
`of` lists. Written out, a reviewer and `git grep` can tell a canonical site from a two-term one.

---

## The rewrite forms

### Two damage modes, needing different fixes

- **`popover-receives`** — a declaration lands on the host. A `:not()` guard fixes it.
- **`real-element-loses`** — the host takes a positional slot, so a **real** element stops matching.
  **Only `of S` fixes this**; a `:not()` guard cannot. And `of S` does not survive the build, so
  **`real-element-loses` currently has no guard fix at all**. Fix such a site by naming the element
  you mean (a class or a `data-` attribute) instead of counting to it.

### Narrow forms — the host itself is the element to exclude

The first three rows ship. The last five are the `of S` family and are **withdrawn** — kept here
because they are correct CSS, verified in Chromium, and specificity-neutral, so they are what to
restore when the Rust Compiled serialiser is fixed. Do not apply them today.

```
X                       ->  X:not(:where(L))
& > *                   ->  & > *:not(:where(L))
& > div                 ->  & > div:not(:where(L))

⛔ WITHDRAWN — the Rust Compiled transforms write these as invalid selectors.
& > *:first-child       ->  & > :nth-child(1 of S)
& > *:last-child        ->  & > :nth-last-child(1 of S)
& > :not(:first-child)  ->  & > :nth-child(n+2 of S)
& > :not(:last-child)   ->  & > :nth-last-child(n+2 of S)
& > *:only-child        ->  & > :nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))
```

`& > div` carries no positional signal and is easy to miss, but the host **is** a `<div popover>`,
so it receives.

### Wide forms — something inside the host is the element to exclude

Descendant-reaching selectors and `:has()` arguments take the wide guard: `Gi` at nested scope, `Gw`
at global scope. The examples below are spelled with `Gw`, as in a stylesheet. Inside a `:has()`,
**every top-level branch** is guarded, and within a branch every compound is planned exactly as a
top-level compound is: the leftmost compound is a descendant of the subject and takes the wide
guard; a compound after `>` takes `G` only if a host could be that element. So
`.x:has(> div > span)` guards the `div` and leaves the `span` alone, exactly as `& > div > span`
does. Guarding the rightmost compound instead leaves `<div class=x><div popover><span>` matching
through the unguarded host (raised on PR 467939).

```css
/* ✗ WRONG — guard on the last branch only. Measured F→T: no protection at all. */
.x:has(button, a:not(:where([popover], dialog, [popover] *, dialog *)))

/* ✓ RIGHT — every top-level branch guarded. */
.x:has(
  button:not(:where([popover], dialog, [popover] *, dialog *)),
  a:not(:where([popover], dialog, [popover] *, dialog *))
)
```

A positional pseudo nested inside a `:has()` argument takes the ordinary `of S` rewrite one level
down; that is browser-verified and needs no separate form — and it is withdrawn with the rest of the
`of S` family, at that depth too.

### Specificity is neutral, by construction

`:where()` is weightless, `:not()` inherits the specificity of its most specific argument (here
`:where(…)`, so zero), and `:nth-child(An+B of S)` contributes only the pseudo-class plus the most
specific complex selector in `S` (zero). Every form above therefore preserves (a,b,c) exactly.
**Keep `G`, `Gw`, `Gi` and `S` weightless or that stops holding.** Never reach for `!important` or a
specificity bump on the consumer side: a survey of 48 sites found 33 break under blanket
`!important`, most of them DS-owned geometry and public width props
([`phase0b-rung2-blast-radius.md`](../plans/unsafe-selectors-prework/phase0b-rung2-blast-radius.md)).

---

## The `of S` forms do not survive the build

**Status: measured, open, no workaround.** This is a defect in Atlaspack's Rust Compiled transforms,
not in the guard form. An earlier version of this section blamed `@compiled/react`'s `extract: true`
mode; that was wrong. Babel is fine.

**The cause.** Both Rust Compiled transforms, `ap` and `@atlaspack/rust` 4.0.0, serialise an
`:nth-child()` / `:nth-last-child()` argument with no space around `of`:
`&:nth-last-child(n+2 of S)` comes out as `:nth-last-child(n+2of:not(…))`, and `of li` as `n+2ofli`.
The rule is in the stylesheet, but its selector is invalid, so the browser discards it. There is no
warning and no build error. The class is on the element and no rule applies.

- In `ap`, `serialize_pseudo_class_children` in
  `afm-tools/crates/ap_compiled_css/src/postcss/utils/selector_stringifier.rs:220-266` joins the
  parts with `""`. The fix is one line, owned by the `ap` team (AFB).
- The `@atlaspack/rust` source is not in this repo. A shared serialiser there is inferred from
  identical output. The fix belongs to Atlaspack.
- Babel extract (`@compiled/babel-plugin` with `@compiled/babel-plugin-strip-runtime`) keeps the
  space, and its rule survives `@compiled/parcel-optimizer`'s `buildDeterministicStylesheet` and
  lightningcss. Chromium `replaceSync` rule counts: babel 1, `@atlaspack/rust` 0, `ap` 0; a plain
  control is 1 in all three.

**Where each transform runs.** Gemini VR builds all of platform with `VR_BUNDLER=ap-headless`, which
the Statsig gate `enable_platform_gemini_vr_ap_headless` turns on
(`platform/packages/monorepo-tooling/gemini/src/run-tests.ts`, `platform/vr.config.js`). Jira and
Confluence production builds use `@atlaspack/transformer-compiled-css-in-js`, which is
`@atlaspack/rust`, in the processes the `compiledCssInJsTransformer` rollout flag covers, and babel
otherwise (`jira/.parcelrc-v3`, `confluence/.parcelrc`). So the `of S` forms are dead wherever a
Rust transform built the code, and the withdrawal stands until both serialisers are fixed.

Repro: `css({ '&:nth-last-child(n+2 of li)::after': { content: '"x"' } })` emits `n+2ofli`.

Measured by a VR run on `@atlaskit/breadcrumbs`, flag on:

| Selector                                        | Rules in page | Matching `::after` rules | Computed `content` | Separators |
| ----------------------------------------------- | ------------- | ------------------------ | ------------------ | ---------- |
| `&:not(:last-child)::after` (control)           | 325           | 7                        | `"/"`              | render     |
| `&:nth-last-child(n+2 of S)::after` (the guard) | 318           | **0**                    | `none`             | all gone   |

325 − 318 is exactly the seven discarded rules.

**The trigger is the `of <selector-list>` clause itself, not the guard's content.** `of li` fails
identically; a plain `:nth-last-child(n+2)` works.

### What follows from it

1. **The rewrite is worse than the disease.** For the positional family the guard does not merely
   fail to help — it **deletes working styling**, which is the one outcome worse than leaving the
   site unguarded. Do not hand-apply it.
2. **A site that already carries an `of` clause is broken, not fixed.** Its rule is discarded
   wherever a Rust transform built it. Merging it up to the canonical terms leaves it exactly as
   dead and reads in review as progress.
3. **The ratchet keeps counting the `of S` form as debt.** `NoUnsafeNthChildSelectors` matches on
   plain substrings, in both directions (its fourth entry is `:nth-last-child`), so a guarded
   positional selector still counts. That is correct: the guard is not a fix.
4. **`.css` files are not affected by the defect**, because no Compiled transform writes them.
   Certify the pipeline that does before you rely on `of S` there.

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

---

## Patterns with no guard form, and the search behind each claim

"No guard form" is a claim about a **search**, not a property of CSS — `:only-child` was written off
on exactly that basis and was wrong. Each row records what was tried, so the next reader extends the
search instead of repeating it. The case IDs (C9 and so on) are rows of the truth table in
[`has-guard-verification.md`](../plans/unsafe-selectors-prework/has-guard-verification.md).

| Pattern                                                                                                                                                    | Candidate forms tried                                                                                                                                                                         | Verdict                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:nth-of-type` / `:nth-last-of-type`                                                                                                                       | `of S` — the CSS grammar admits `of` only on `:nth-child` / `:nth-last-child`. Type-selector pruning (`td`, `tr`, `th`, `span`, `p`, `li`, `svg`… cannot collide with a `div`/`dialog` host). | **Closed by grammar.** Type pruning marks occurrences _safe_, not _guarded_, and clears only about half of them.                                                                                                                                                                                    |
| `& + X` / `& ~ X`                                                                                                                                          | `+ X of S` — no such form exists; `of` is not part of the combinator grammar. Adjacency needs the parent's child list, which the selector does not describe.                                  | **Closed by grammar.**                                                                                                                                                                                                                                                                              |
| `:has(+ X)` / `:has(X + Y)`                                                                                                                                | Narrow guard, wide guard, both measured (C9, C12, D1, D9).                                                                                                                                    | **Closed by measurement.** Goes true→false — the host destroys the adjacency the rule was written for — and no guard restores it.                                                                                                                                                                   |
| `:has(… :hover / :focus-within / :active)`                                                                                                                 | Narrow guard, wide guard, both measured (C21, C22, C23, D7).                                                                                                                                  | **Closed by measurement.** See below — no form can exist.                                                                                                                                                                                                                                           |
| `:empty`                                                                                                                                                   | **No guard candidate has been tried.** Only non-selector pruning and reachability were attempted.                                                                                             | **Search open.** This is a gap, not a proof.                                                                                                                                                                                                                                                        |
| ~~`:only-child`~~                                                                                                                                          | `:nth-child(1 of S):nth-last-child(1 of S)` — rejected at (0,2,0) vs (0,1,0). Then `:nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))` — **accepted**, exact and (0,1,0).             | **A guard form exists and is withdrawn.** The form is correct and is in the table above; it is unshippable only because it carries an `of` clause. Do not re-open the CSS search — the open question is the Compiled defect. This row is still the cautionary tale about declaring a search closed. |
| The whole positional family — `:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-last-child()`, `:not(:first-child)`, `:not(:last-child)` | `of S`, in every form above. Verified in Chromium 143 and specificity-neutral.                                                                                                                | **No guard form by build defect, not by CSS.** The Rust Compiled transforms write an `of` clause as an invalid selector, so applying the guard deletes the rule.                                                                                                                                    |

### Why propagating state pseudos can never have a guard form

`:hover`, `:focus-within` and `:active` match an element **and all its ancestors**. The host is
still a DOM descendant of its insertion point, so the moment focus or the pointer lands inside the
host, every **real** element between the host and the subject starts matching. The element that
flips is neither the host nor inside the host — it is the host's real _ancestor_ — so there is
nothing for a `:not(:where(…))` to exclude, at any depth, and there is no `of S`-style form for a
state pseudo.

Two measured refinements:

- **Non-propagating state pseudos are fine.** `:focus` / `:focus-visible` match only the focused
  element, which _is_ inside the host, so the wide guard holds.
- **The break is depth-dependent.** With the host as a _direct_ child of the subject there is no
  real element between them and the wide guard holds; add one real intermediate `div` and it breaks.
  Insertion depth is a per-site property, so this is not statically decidable.

This class is **structurally invisible to static tests**: the flip exists only _during_ interaction.
A static VR snapshot photographs the open host but never hovers or focuses inside it. Coverage
requires `snapshotInformational` with a `prepare` action that opens the surface **and** hovers or
focuses into it, or the runtime detector driving the same interaction.

---

## The guards are **not** all flag-off no-ops

A hand-fix can change shipped behaviour with the flag **off**. Check these before you add a guard:

1. **Ungated `[popover]` producers** are in flag-off DOM today: `editor-common`'s `vanilla-tooltip`
   (`popover = 'hint'` on the trigger) and `pragmatic-drag-and-drop`'s honey-pot (`popover="manual"`
   on `document.body`, on every drag). Both gate on capability, not on `platform-dst-top-layer`. A
   guard in styles that reach them changes what ships. The editor's block drag preview, for example,
   copies an editor class onto pdnd's container.
2. **The subtree terms reach into _any_ popover or dialog subtree**, including consumer `<dialog>`s
   and ungated `popover="hint"` tooltips. `Gi` limits this to surfaces under `&`; `Gw` does not. The
   wide guard does **not** reach `shouldRenderToParent` sites: with the gates off, every adopter
   renders an inline surface as a plain element, with no `popover` attribute and no `<dialog>`.
3. **`Ls`'s non-rendered terms change positional matches by design**, because a `<style>` sibling is
   in the DOM regardless of top layer. Dormant while `of S` is withdrawn. When it comes back,
   rewriting `:last-child` → `:nth-last-child(…)` also trips `@emotion/cache`'s SSR warning (its
   regex matches `:nth-last-child` but not `:last-child`), which is globally suppressed for VR
   today.

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
   conclusion that a **leading `~`** inside a `:has()` argument is guardable rests entirely on that
   premise. If a new adopter wraps a subtree, `~` breaks the way `+` does and that conclusion is
   void.

3. **A run of the runtime detector** over its examples, with the surface open, to find the hazards
   it newly exposes.

---

## Authoring forms

The guard round-trips through AFM's authoring **forms**: `css()`, `cssMap()`, `styled` template
literals and `xcss` by existing usage; `@atlaskit/css`, raw `.css` (postcss / cssnano /
lightningcss) and interpolated selectors by experiment. The `cssMap` selector validator accepts the
guard. Two exceptions:

- **`xcss()` from `@atlaskit/primitives` cannot hold any guard.** It validates its keys at module
  evaluation and, outside production, throws `Styles not supported for key '…'` for any key with
  whitespace, `&` or `[…]`. Every guard holds `[popover]`, so jest, the dev server and Gemini VR
  crash at import. Move such a style to `cssMap` from `@atlaskit/css` to fix it.
- **`@atlaskit/css`'s strict API cannot express a descendant or positional key at all**, guarded or
  not, so it has no sites to fix.

**That survey covered authoring APIs and CSS processors, and it missed the pipeline stage that
matters.** Every authoring form above is compiled by a Compiled transform, and the Rust ones write
the `of S` variant of the guard as an invalid selector — class names emitted, rule discarded by the
browser, no warning. An authoring-form survey cannot catch that, because the selector text is
accepted everywhere it is _parsed_; the loss happens where the rules are _written out_. When adding
a new form, the question to ask is not "does the toolchain accept this selector" but "does each
production transform write a rule the browser keeps".

## Related

- **[`../plans/unsafe-selectors-plan.md`](../plans/unsafe-selectors-plan.md)** — the plan: host
  defence, the runtime detector, and the hand-fixes that use this page
- **[`../plans/unsafe-selectors-prework/has-guard-verification.md`](../plans/unsafe-selectors-prework/has-guard-verification.md)**
  — the Chromium fixture and truth table behind every `:has()` claim on this page (cases C1–C25,
  D1–D9), and the naming of the interaction-only hazard class
- **[`../follow-ups/compiled-transform-quirks-found-by-guard-probes.md`](../follow-ups/compiled-transform-quirks-found-by-guard-probes.md)**
  — the `ap` and `@atlaspack/rust` bugs found by the guard probes, for the AFB team
- Landed guard work, for worked examples: commits `b45e18ac59c21` and `8765bd681cd8b`
