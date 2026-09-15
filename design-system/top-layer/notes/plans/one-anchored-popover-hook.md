# One hook for anchored popovers

> **Status: executed 2026-08-24.** `useAnchoredPopover` replaced `useAnchorPosition`,
> `useAnchorPositionAtPoint`, `useWidthFromAnchor` and `useFitAvailableSpace`. Kept for the
> four-problem analysis below, which is the reason the work happened, and because
> [../decisions/fit-available-space.md](../decisions/fit-available-space.md) cites it for two
> specific claims. The shipped API and the migration route are both different from what this plan
> proposed — read the decision note first.
>
> ### Where the shipped work diverged from this plan
>
> - **Clean break, not alias-and-deprecate.** Step 3 below proposed aliasing the old entry points
>   with `@deprecated` so nobody was forced to move. We removed all four outright. The reason step 3
>   gave for the aliases — "nobody is forced to move" — turned out to be free anyway: every importer
>   is inside `platform/packages/design-system`, so the whole migration is one branch, and two names
>   for one hook is a cost with no beneficiary. `@atlaskit/top-layer` major.
> - **A different API.** The plan's `widthMode` + `shouldFitAvailableSpace` became **two per-axis
>   values**, `inlineSize` and `blockSize`, each
>   `'content' | 'match-anchor' | 'min-anchor' | 'max-available'`. A single `widthMode` cannot say
>   "cap the block axis", and a single boolean cannot say which axis to cap; the plan's shape only
>   worked because the old hooks happened to be inline-only. `isEnabled` also became `anchor: null`,
>   and `anchorRef` / `getPoint` became one `anchor` union, which is what let the two positioning
>   strategies collapse into one call site.
> - **`placement` carries the floor.** `placement.minSize` is new, and is what makes Rule 2
>   overridable — including `minSize: 0`, which is now the only expressible way to say "cap me but
>   do not move me".
> - **Step 1 was not done.** `setStyle` cleanup is still not idempotent. See
>   [../decisions/anchored-popover-at-point.md](../decisions/anchored-popover-at-point.md) → _Open
>   question_ — the argument for it is weaker with one writer, but it is not obviously zero.
> - **`useAnchoredPopoverAtPoint` was never created.** The point strategy is a branch of the
>   `anchor` union, not a second hook.
>
> ### Reversed one day later
>
> **`useAnchoredPopoverAtPoint` now exists after all (2026-08-25),** and with it `isEnabled` and
> `anchorRef`. The `anchor` union is gone. Merging the anchor KIND turned out to be the one part of
> this plan's collapse that cost more than it saved: it forced two `anchor-name`s out of one
> `useId()`, a latch keyed on the kind, and a branch in the middle of writing `position-anchor` —
> ~180 lines, of which ~35 were logic. The other three hooks stayed merged, and that part was right.
> See [../decisions/anchored-popover-at-point.md](../decisions/anchored-popover-at-point.md) for the
> full accounting, including why the two-writer argument this plan leaned on is weaker than it
> looks.
>
> ### Claims in this plan that the work found wrong
>
> 1. **The `match-anchor` + fit + left/right bug is LATENT, not live.** `shouldFitContainer` and
>    `shouldFitViewport` co-occur in exactly **3** places, all of them internal prop-forwarding
>    inside `@atlaskit/popup` itself (`popup.tsx`, `popper-wrapper.tsx`,
>    `compositional/popup-content.tsx`). **Zero product call sites.** `@atlaskit/dropdown-menu` has
>    no `shouldFitViewport` prop at all, so its `min-anchor` can never reach the combination.
>    Type-reachable, not code-reachable. Fixed anyway, as part of the merge.
> 2. **"Three hooks disagree about which positioning path is active" is half wrong.** The
>    `supportsAnchorSize()` / `supportsAnchorPositioning()` divergence was **inert**:
>    `useWidthFromAnchor` called `fitAxisCap` with the flag defaulted, but `fitAxisCap` only took
>    the cell branch when the axis WAS the placement axis, and the defaulted value was only ever
>    read on a branch where it was not. The **live** manifestation of problem 4 was only the
>    `forceFallbackPositioning` blind spot: `useFitAvailableSpace` could not see that option, so
>    forcing the JS fallback still emitted a `calc(100% - …)` cap that resolved against the viewport
>    and constrained nothing.
> 3. **Consumers outside `platform/packages/design-system` are not zero.** An earlier audit said
>    they were, because it grepped only `jira/`, `confluence/` and `townsquare/` — which are
>    genuinely zero. It missed **`post-office/`**, which declares `@atlaskit/top-layer` as a
>    dependency and whose `post-office-popover-target` / `use-element-by-anchor-name` depend on the
>    hook's `anchor-name` behaviour: `useElementByAnchorName` resolves an anchor by querying
>    `[style*="anchor-name: --name"]`, i.e. it reads back the inline style this hook writes. It
>    never imports a hook entry point, so the removals do not break its build — but it is a live
>    out-of-tree dependency on `anchor-name` staying an inline style, and on the never-cleaned-up
>    lifetime in [../decisions/anchor-name-lifetime.md](../decisions/anchor-name-lifetime.md).
> 4. **"Migrate the five sizing callers" is not the migration scope.** Those five are the
>    `useWidthFromAnchor` callers. They are not the ~61 `shouldFitViewport` / `shouldFitContainer`
>    consumer call sites, which were untouched: both `@atlaskit/popup` adapters keep those public
>    props unchanged and map them onto axis values inside the adapter. Do not conflate the two
>    numbers. The real migration was **10** adopter packages (`avatar-group`, `datetime-picker`,
>    `dropdown-menu`, `inline-dialog`, `popper`, `popup`, `react-select`, `select`, `spotlight`,
>    `tooltip`) plus the 56 hook-using examples in this package.

## The problem

_As it stood before the merge._ Positioning and sizing an anchored popover took three hooks plus,
until recently, a component prop. Each one wrote a different subset of the same element's inline
styles:

| owner                  | writes                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `useAnchorPosition`    | `position-anchor`, `position-area`, `position-try-fallbacks`, `inset`, all four logical margins, and (JS path) `top` / `left` / `opacity` |
| `useWidthFromAnchor`   | `inline-size`, `min-inline-size`                                                                                                          |
| `useFitAvailableSpace` | `max-block-size`, `max-inline-size`, `min-block-size`                                                                                     |
| `Popover`'s stylesheet | `display` (and the child's `flex-grow`)                                                                                                   |

The partition is hand-maintained. Nothing enforces it, and `setStyle` has no ownership guard — two
hooks writing one property produce a nested snapshot chain that React unwinds in the wrong order,
leaving a stale inline value on the element after unmount. That is not theoretical: it is the
mechanism behind two defects that shipped, and it is why the fit recipe was split this way in the
first place.

Splitting by property, rather than by concern, then caused four further problems.

### 1. A flag has to be threaded to every writer

`shouldFitAvailableSpace` is one decision, but it changes what three of the four writers emit.
Passing it to some and not others produces a partial recipe — caps applied but not enforced, or
enforced but defeatable by a width floor — and nothing catches it. The failure mode is a cap that
silently does nothing, which is the same shape as the bug the feature was built to fix.

### 2. `placement` has to be passed twice

`useAnchorPosition` has always taken `placement`. `useWidthFromAnchor` now needs it too, to know
which axis the cap applies to and what gap to subtract. So callers pass the same object to two hooks
— and because the parameter is optional with a `{}` default, a caller who forgets silently composes
against `axis: 'block'`. `@atlaskit/dropdown-menu` and `@atlaskit/react-select` are one prop away
from that today.

### 3. The cap↔floor rules are a contract between two files

CSS min/max resolution applies the min last, so a floor always beats a cap. Getting that right
requires knowing, per axis, whether the floor is a width contract (clamp it to the cap) or the flip
driver (leave it uncapped, because exceeding the cap is the mechanism). Today `useWidthFromAnchor`
imports `fitAxisCap` and re-derives which axis is which, so the logic is only correct while two
files agree. It has already been wrong twice:

- **`match-anchor` + fit + a left/right placement gets a cap and no floor on either axis** — full
  flip suppression, the exact bug the feature exists to fix, reachable from
  `shouldFitContainer && shouldFitViewport`. The VR baselines that would catch it are
  `snapshot.skip`ped (UTEST-2316). **Latent, not live** — those two props co-occur in exactly three
  places, all internal prop-forwarding inside `@atlaskit/popup`, and in zero product call sites; see
  correction 1 above.
- **`max(150px, anchor-size(self-inline))` leaves the anchor term uncapped**, so a trigger wider
  than the viewport overhangs it. Recorded as "currently unreachable, but wrong" — which was too
  generous: `<DropdownMenu shouldFitContainer>` on a `left-*` / `right-*` placement reaches it.
  _(The `max()` itself was dropped on 2026-08-25 — the floor is one term now — and the anchor term
  is now clamped whenever nothing is fitting, which closes this for every configuration a cap could
  have covered. It survives only on a FITTING anchor-relative placement axis, and the reachable half
  there is `'match-anchor'` (from `<Popup shouldFitContainer shouldFitViewport>`), not
  `'min-anchor'`, whose only consumer never fits. Clamping there would break the size promise the
  floor is there to keep. See
  [../decisions/width-from-anchor-floors.md](../decisions/width-from-anchor-floors.md) → Update
  (2026-08-25, later).)_

### 4. Three hooks disagree about which positioning path is active

`useAnchorPosition` decides from `supportsAnchorPositioning()` **and** its
`forceFallbackPositioning` option. `useWidthFromAnchor` uses a different probe,
`supportsAnchorSize()`. `useFitAvailableSpace` uses the first probe and cannot see
`forceFallbackPositioning` at all — so forcing the JS fallback leaves it emitting `calc(100% - …)`,
which resolves against the viewport instead of a position-area cell and constrains nothing.

**Only the last clause of that was live.** The two-probe divergence never had an observable effect;
see correction 2 above. The `forceFallbackPositioning` blind spot did, which matters because it is
how every test of the fallback path on a supporting engine is written.

## Why one hook fixes all four

Positioning and anchor-relative sizing are one concern, not two. `anchor-size()` is part of the CSS
Anchor Positioning spec — splitting "where the box goes" from "how big it is relative to its anchor"
was our line, not the platform's.

Merged, each problem stops being expressible:

- One call site, so the fit request cannot be half-passed.
- One `placement`, required rather than defaulted, so the wrong-axis trap disappears.
- The cap↔floor decision becomes a local truth table instead of a cross-file contract — and the
  merged hook necessarily knows both the anchor-relative sizes and the fit request, so the two bugs
  above cannot occur.
- The positioning path is resolved once and passed down, instead of probed three ways.

## The shape as shipped

```tsx
useAnchoredPopover({
	anchor: { kind: 'element', ref: triggerRef }, // or { kind: 'point', getPoint }, or null
	popoverRef,
	placement, // required, and carries `minSize`
	isOpen,
	inlineSize: 'match-anchor', // optional, default 'content'
	blockSize: 'max-available', // optional, default 'content'
});

<Popover isOpen>…</Popover>;
```

One hook, one `placement`, one writer for every inline style on the host, and nothing on `Popover`.
Three exports from `@atlaskit/top-layer/use-anchored-popover`: the hook, `TPopoverAnchor` and
`TAnchorPoint`.

Two shapes the plan did not have, both of which fell out of the merge rather than being designed in:

- **`anchor` is a discriminated union**, which is what let `useAnchorPositionAtPoint` collapse into
  the same call rather than becoming a second hook. `anchor: null` replaces `isEnabled`, and reads
  better: the hook does not position because it has nothing to position against. `@atlaskit/tooltip`
  went from two calls with complementary `isEnabled` values to one.
- **`inlineSize` / `blockSize` are per-axis**, not one `widthMode` plus one boolean. Once the caps
  applied to both axes, a single width knob could not express them, and a single fit boolean could
  not say which axis it meant. `placement.minSize` came with them.

`Popover` keeps `&:popover-open { display: flex }` and `& > * { flex-grow: 1 }` in its own
stylesheet, applied unconditionally. That is not negotiable and not an oversight — see
[the decision note](../decisions/fit-available-space.md) for the two measured reasons a hook cannot
own `display`, and for the evidence that unconditional is visually inert (181 VR baselines across
all consuming packages, unchanged).

Name: `useAnchoredPopover` names the thing rather than one of its jobs. `useAnchorLayout` was the
runner-up.

## The plan as written, and what happened

Ordered so each step was safe on its own.

**1. Make `setStyle` cleanup idempotent.** Re-read the current value on cleanup and restore only if
it still matches what this call wrote. Roughly four lines. This removes the stale-value leak that
makes two writers dangerous, which in turn makes the transition period below safe — and it would
have prevented both of the defects that shipped.

> **Not done.** It was step 1 only because it de-risked the alias period in step 3, and the clean
> break removed that need. With one hook owning every property the two-writer argument is much
> weaker, but it is not obviously zero — see
> [../decisions/anchored-popover-at-point.md](../decisions/anchored-popover-at-point.md) → _Open
> question: should `setStyle` cleanup be idempotent?_

**2. Merge sizing into the positioning hook and rename it.** New `./use-anchored-popover` entry
point. Absorb `useWidthFromAnchor` and `useFitAvailableSpace`. Resolve both support probes and
`forceFallbackPositioning` once, at the top, and pass them down. Fix the two live bugs as part of
the merge — they are ownership bugs and disappear when one function decides the whole truth table.
Collapse `fitAxisCap` to a local; keep `VIEWPORT_PADDING` and `FALLBACK_MINIMUM_MAIN_AXIS_SIZE`
exported, because `getFitMarginDeclarations` and the Playwright spec both read them.

> **Done, and it absorbed `useAnchorPositionAtPoint` as well.** `fitAxisCap` and
> `fit-available-space.tsx` are gone; the whole recipe is `getAnchoredPopoverSizeDeclarations` in
> `internal/anchored-popover-size.tsx`, pure and unit-testable without a browser. `VIEWPORT_PADDING`
> and `FALLBACK_MINIMUM_MAIN_AXIS_SIZE` are exported from that module, but note there is **no
> `package.json` subpath for it**, so they are reachable only from inside the package — same as
> `fit-axis-cap.tsx` was. `TPopoverAxisSize` is in the same position, so consumers pass inline
> string literals.

**3. Alias and deprecate, then migrate.** `./use-anchor-position` becomes a true alias
(`export { useAnchoredPopover as useAnchorPosition }`) with `@deprecated` — same hook, same
signature, so nobody is forced to move and calling both is harmless once step 1 lands.
`useWidthFromAnchor` keeps its current standalone implementation and is deprecated; do **not** make
it a delegating wrapper, which would reintroduce the double-write. Migrate the five sizing callers
(`popup` ×2, `popper`, `dropdown-menu`, `react-select`) and top-layer's own examples in the same
change — the deprecation ratchet fails a branch that adds a new import of a deprecated entry point,
and `examples/*.tsx` is not exempt. `react-select` also needs its inline `placement` object hoisted
to a `const`, including its deliberate non-default `offset: { gap: 0 }`.

> **Replaced by a clean break.** All four entry points removed, no aliases, one added. The aliases
> bought nothing: every importer is inside `platform/packages/design-system`, so the migration is
> one branch. The `react-select` note was right and was done — its `placement` is now a
> `useMemo(…, [menuPlacement])`, keeping the deliberate `offset: { gap: 0 }`.

**4. Docs and changeset.** Fold into the existing `@atlaskit/top-layer` changeset. Minor: two
optional parameters and one entry point added, two entry points deprecated, nothing removed. Delete
the aliases in a later major.

> **`major`, not `minor`**, because four entry points were removed rather than deprecated.

### Costs to go in with eyes open

- The eight position-only adopters need no change, because both new parameters are optional. Only
  the five that also size are touched.

  > **Wrong under a clean break:** every adopter had to change, because `anchorRef` became `anchor`.
  > Mechanical in eight of them (`anchorRef: x` → `anchor: { kind: 'element', ref: x }`), and each
  > also had to start passing `placement` and `isOpen`. `@atlaskit/dropdown-menu` did not pass
  > `placement` at all before, which is exactly the trap problem 2 describes.

- Two names for the same hook until the aliases are deleted.

  > Avoided entirely.

- The merged hook re-runs its sizing writes whenever a positioning dependency changes. No
  correctness issue, a little redundant work.

  > Accurate, and accepted as shipped.

### Deliberately not in scope

- Anything on `Popover`. It is already prop-free for this feature.
- Making fitting the default. That is a default _placement_ change, because the floor drives
  flipping.
- The known limitations recorded in
  [../decisions/fit-available-space.md](../decisions/fit-available-space.md) → _Update
  (2026-09-10)_, and the rollout checks in
  [../migrations/popup-migration.md](../migrations/popup-migration.md) → _Risks when flag is turned
  on_.

### One constraint the plan did not name, and which nearly regressed silently

**The `getPoint` latch.** `getPoint` was read through a ref whose effect had `[isEnabled]` as its
only dependency, so the point was captured once per transition into the point strategy and never
re-read. `@atlaskit/popper` and `@atlaskit/tooltip` **depend on that**: they read mutable refs
(`virtualReferenceRef.current`, `topLayerPlacementRef.current`, `mousePos`) from inside `getPoint`
precisely because the closure is latched.

The merged hook keeps the latch, and keys it on the anchor **kind**:

```ts
	}, [anchorKind]); // never [anchor], never [anchor.getPoint]
```

Keying on the identity of the anchor object or of `getPoint` would re-latch on every render, because
an inline `anchor={{ kind: 'point', getPoint: () => … }}` literal is a new object each time — which
thrashes the proxy element. `getPointRef.current` is still reassigned every render, so the latched
closure always sees fresh state; it is only the effect that must not re-run.

## Prior art in this package

Each records a constraint the merged hook had to preserve.

- [../decisions/fit-available-space.md](../decisions/fit-available-space.md) — the cap, the floor,
  why a cap alone suppresses `position-try-fallbacks`, why `display` cannot live in a hook, and the
  two hook-only designs that were built and measured and failed. Now also the record of what the
  merged recipe emits.
- [../decisions/width-from-anchor-floors.md](../decisions/width-from-anchor-floors.md) — at most one
  floor per axis; `max-content` is a keyword and cannot compose inside `min()`; the value must be
  `anchor-size(self-inline)`, not `anchor-size(inline)` or `anchor-size(width)`, and the mismatch is
  invisible in a horizontal writing mode so no test will catch it.
- [../decisions/placement-offset.md](../decisions/placement-offset.md) — the antisymmetric
  cross-axis shift margins the viewport padding has to compose onto rather than overwrite.
- [../decisions/anchor-name-lifetime.md](../decisions/anchor-name-lifetime.md) — why `anchor-name`
  is never removed, which `post-office` depends on from outside this monorepo directory.
- [../architecture/positioning.md](../architecture/positioning.md) — the two-path model.
- [../follow-ups/custom-popup-component-contract.md](../follow-ups/custom-popup-component-contract.md)
  — the container contract the merge left unenforced; the rest of what it left open is re-homed in
  the decision and migration notes above.
