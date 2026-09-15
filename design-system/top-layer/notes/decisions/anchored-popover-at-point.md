# Two hooks, not one anchor union

**Decision (2026-08-25).** `useAnchoredPopover` anchors an element and takes `anchorRef`.
`useAnchoredPopoverAtPoint` anchors a viewport coordinate and takes `getPoint`. The
`anchor: TPopoverAnchor | null` discriminated union that briefly held both is gone.

This partially reverses [one-anchored-popover-hook.md](../plans/one-anchored-popover-hook.md), which
merged four hooks into one. That merge was right about the three it kept merged — positioning,
sizing and margins genuinely are one decision, and splitting them is what let a size cap be written
for a containing block that did not exist. It was wrong about the anchor kind, which is not a
decision at all: it is a question of what carries `anchor-name`.

## What the union cost

Point support was ~180 of the merged hook's 908 lines, and only ~35 of those were logic. The rest
was prose explaining machinery that existed **only because** the two kinds shared one hook instance:

- **Two `anchor-name`s from one `useId()`** (`--anchor-{id}` and `--anchor-point-{id}`). Needed
  because names are never removed, so after a flip the trigger and the synthetic anchor both carried
  one, and css-anchor-position-1 resolves a duplicated name to the last acceptable anchor in tree
  order — making the popover's target depend on where in `<body>` the trigger happened to sit. The
  discriminator had to be a PREFIX rather than a suffix so neither name was a substring of the
  other, because `post-office`'s `useElementByAnchorName` matches `[style*="anchor-name: --name"]`.
- **A latch keyed on the anchor KIND**, plus a `getPointRef` whose only job was to keep the effect
  from depending on an inline arrow.
- **A `kind === 'point' ? … : …` branch** in the middle of writing `position-anchor`, with a
  paragraph explaining why the "reuse an existing name" read was unreachable for one of the
  branches.

Two hook instances means two anchor names, so the name collision is impossible by construction — and
the point hook only ever writes to a `<div>` it created itself, never to the trigger. All three
items above deleted themselves.

> **Update (2026-09-10, reversed 2026-09-11).** The name is `--anchor-{useId()}`, and the paragraph
> above once carried a caveat that `useId()` is root-scoped, naming `createPopper` (one React root
> per instance) as the reachable collision. Measured: it was not. A client-rendered root draws
> `useId()` from a counter global to the `react-dom` module, so `createPopper`'s roots never
> collided. Roots that HYDRATE the same markup do, because a hydrated `useId()` is derived from tree
> position, and so does a second copy of `react-dom`. For one day the name came from a module-scope
> counter to close that. Reversed: the popover's `id` is `popover-{useId()}` and `aria-controls` and
> `popovertarget` point at it, so those roots already collide before the anchor name matters, and
> every id the design system mints has the same exposure. React's remedy for all of them is one
> per-root `identifierPrefix`, which `useAnchoredPopover`'s JSDoc now requires of a host that
> hydrates several roots. The counter also had its own hole (two bundled copies of the package would
> both start at `--anchor-1`) that `useId()` does not. Pinned by the two-roots tests in
> `use-anchored-popover.test.tsx`: client-rendered roots are distinct unaided, hydrated roots are
> distinct once prefixed, and the name stays a `<dashed-ident>` whatever the prefix carries.

## What it costs to split

The consumers that switch strategies inside one mount have to call both hooks and keep them mutually
exclusive by hand:

| consumer                                         | shape                                                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `@atlaskit/tooltip` `tooltip.tsx`                | `position="mouse"` shown by keyboard starts on the element, switches to the cursor on first mouse move                   |
| `@atlaskit/popper` `popper-top-layer.tsx`        | `referenceElement` swaps `HTMLElement` ↔ `VirtualElement`                                                                |
| `@atlaskit/popper` `create-popper-top-layer.tsx` | Kind is fixed for the instance's lifetime, so it is a component split (`ElementBridge` / `PointBridge`), not a flag pair |

Hooks cannot be called conditionally, so the first two call both hooks unconditionally with
complementary `isEnabled`. `TPopoverAnchor` made "both active" unrepresentable; `isEnabled` makes it
merely untrue-by-convention. That is the whole cost of the split, and it is worth naming precisely,
because the original merge cited the two-writer problem as its main justification and the argument
is weaker than it looks:

**A disabled hook holds no snapshot.** `isEnabled: false` returns before any `setStyle` call, so it
writes nothing and takes no snapshot to restore. The nested-snapshot bug the merge was fixing needed
two writers live at the SAME time (`use-width-from-anchor` and `use-anchor-position` both were).
Complementary flags forbid that. And the flip itself is safe in either source order: React runs
every effect cleanup for a commit before any effect, so the outgoing hook restores before the
incoming one writes.

**So the residual risk is a call site getting the flags wrong**, not the flip mechanics. Nothing
enforces it at runtime, deliberately.

> **Update (2026-09-04).** The split originally shipped with `claimPopover`, a dev-only
> `WeakMap<HTMLElement, ownerId>` in `use-anchored-popover.tsx` that warned when a second enabled
> hook claimed a popover another already owned. Removed. Both in-tree flippers derive the two flags
> from ONE boolean (`tooltip.tsx`, `popper-top-layer.tsx`), so the invariant is structural there
> rather than a convention that can drift; the failure it caught is mild — with both enabled the
> later-declared hook's writes win, and the lasting damage is a stale inline value on a host the
> hook owns every property of, rewritten wholesale on the next enable; and it cost a module-level
> `WeakMap`, `combine()` on both effect return paths, a test file that had to `jest.resetModules`
> around `warnOnce`, and a known hole across React roots because `ownerId` was a `useId()`.

## Why not extract internally instead

The cheaper option was to keep the union and move the point machinery into an internal
`useSyntheticPointAnchor` returning a `RefObject`. That sheds ~90 lines and keeps one writer, but it
keeps the two-name scheme, which is the single ugliest thing the split deletes. Rejected on that
basis.

## Consequences

- `TAnchoredPopoverOptions` is now exported, because the point hook forwards everything it does not
  own (`Omit<TAnchoredPopoverOptions, 'anchorRef' | 'isEnabled'>`). Incidentally, consumers can now
  name the axis-size type as `TAnchoredPopoverOptions['inlineSize']` instead of inlining string
  literals. The values themselves (`VIEWPORT_PADDING`, `FALLBACK_MINIMUM_MAIN_AXIS_SIZE`) still have
  no subpath; see [migration-roadmap.md](./migration-roadmap.md) → _Open API decisions_.
- `TAnchorPoint` moved to `@atlaskit/top-layer/use-anchored-popover-at-point`. Its importers are
  `popper/src/internal/rect-point-for-placement.tsx` and
  `tooltip/src/internal/get-anchor-point.tsx`.
- The `anchor-name` written to a point anchor is now `--anchor-{id}`, the same shape as an
  element's. Nothing reads the old `--anchor-point-` prefix; `post-office`'s substring matcher never
  targeted a synthetic anchor (it cannot reach one).
- A flipping consumer now draws two anchor names and runs two effect chains where one sufficed. Both
  are negligible, and the disabled one does no layout work.

## Open question: should `setStyle` cleanup be idempotent?

**Not resolved.** It was step 1 of the original one-hook plan, on the grounds that two writers on
one property produce a nested snapshot chain React unwinds in the wrong order, leaving a stale
inline value after unmount — the mechanism behind two shipped defects.

With one hook owning every property that argument is much weaker, but it is not obviously zero.
Three cases where a snapshot can still be taken of a value this hook itself wrote:

- **React 19 strict-mode double invocation** — effect, cleanup, effect.
- **Remounts**, which is how `create-popper-top-layer.tsx` deliberately re-latches the point
  strategy (`generation` as a `key`).
- **The hook re-running on a dependency change** — and the merged hook re-runs its size writes
  whenever a positioning dependency changes, which is strictly more often than before.

Frame any work here as "does a single writer's own re-entry produce a stale restore", not as the
two-writer problem, which is gone.

> **Update (2026-08-25).** The split above means the flipping consumers (`tooltip.tsx`,
> `popper-top-layer.tsx`) again have two hook instances on one popover, so read "one hook" as "one
> ENABLED hook". The framing still holds: a disabled hook returns before any `setStyle` call, so it
> holds no snapshot, and React runs every cleanup for a commit before any effect, so the flip
> restores-then-writes in that order regardless of source position. The invariant is unenforced: the
> dev-only `claimPopover` guard shipped with the split and was removed on 2026-09-04 (see the update
> under _What it costs to split_).
