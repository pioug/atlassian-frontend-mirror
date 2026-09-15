# Anchor Name Lifetime

**Status:** Implemented 2026-05-06

`useAnchoredPopover` writes `anchor-name` to the trigger element once and **never removes it**. New
hook calls on the same trigger reuse the existing value.

Every anchor's name has the same shape, `--anchor-{id}`, whether it is a consumer's trigger or the
synthetic point anchor `useAnchoredPopoverAtPoint` creates.

> **Update (2026-08-25).** This used to be two shapes — `--anchor-{id}` and `--anchor-point-{id}`,
> derived from the same `useId()` — because merging the positioning hooks had put both anchor kinds
> in ONE hook instance. A shared name was then reachable: `@atlaskit/tooltip` flips element → point
> inside a single mount, and because the trigger's name is never removed both elements would carry
> the same name. A duplicated name resolves to the LAST acceptable anchor in tree order
> (css-anchor-position-1), so the popover's target came down to where in `<body>` the trigger sat.
>
> Splitting the point anchor back into its own hook removed the need for the discriminator entirely:
> two hook instances means two `useId()` values, and the point hook only ever writes to a `<div>` it
> created itself. See [anchored-popover-at-point.md](./anchored-popover-at-point.md).

> **Update (2026-09-10, reversed 2026-09-11).** For one day the `{id}` was drawn from a module-scope
> counter instead of `useId()`, because `useId()` repeats across roots that hydrate the same markup
> (it is derived from tree position there) and across copies of `react-dom`. Reversed: the popover's
> own `id` is `popover-{useId()}` too, so those roots already collide on `aria-controls` and
> `popovertarget`, and every other id the design system mints shares the exposure. The `{id}` is
> `useId()` again, and a host hydrating several roots sets a per-root `identifierPrefix`, as it must
> for every other id. Client-rendered roots, including `createPopper`'s per-instance roots, never
> collided: their `useId()` comes from a counter global to `react-dom`. See
> [anchored-popover-at-point.md](./anchored-popover-at-point.md) → _Update (2026-09-10)_.

## Why no cleanup

Multiple popovers can anchor to the same trigger. The hook and the popover often live in different
components (compound popovers, portals into the top layer), so React's cleanup ordering does not
help us coordinate across them.

A reference-counted cleanup was prototyped and rejected. It survives the simple cases but breaks
under Strict Mode double-invoke, suspended subtrees, third-party writes to `anchor-name`, and
cross-component teardown ordering. Each adds a guard, the guards interact, and any drift in the
count silently re-introduces the dangling-reference bug.

Setting once and leaving it has no state to drift.

## Why this is safe

- `anchor-name` is an inline style on the trigger, so it is GC'd with the element.
- A declaration with no matching `position-anchor` is inert (no layout, paint, or hit-test cost).
- New consumers read the existing value and reuse it, so the "all popovers on a trigger share one
  anchor name" contract holds across mount/unmount cycles. Since 2026-09-07 the read is inline style
  first, then computed style, so a name a consumer set from a STYLESHEET is reused too (the first
  entry, since `anchor-name` is a list and `position-anchor` takes one ident) and nothing is written
  inline over it; the hook writes inline only when it minted the name.
- The JS fallback path does not touch `anchor-name`, so unsupported browsers see nothing leftover.

## Trade-off accepted

A trigger that hosted a popover keeps an `anchor-name` declaration on its inline style for the rest
of its life. Visible to anyone serialising `outerHTML`, invisible to layout.

## An out-of-tree dependant

`post-office`'s `useElementByAnchorName`
(`post-office/integrated-teams/post-office-team/components/in-app/src/ui/use-element-by-anchor-name/index.ts`)
resolves an anchor element by querying `[style*="anchor-name: --name"]`. It reads back the INLINE
style, and it relies on the value still being there when it looks. So two things about this hook are
a contract, not an implementation detail: that `anchor-name` is written inline on the anchor, and
that it is never removed. The names it looks up are ones post-office set on the anchor itself, which
the hook then reuses through `getExistingAnchorName`, so the shape of the hook's own minted name
never reaches it.

`post-office` is in a different product directory and does not import a hook entry point. For future
audits: grepping `jira/`, `confluence/` and `townsquare/` is not the same as grepping everything
outside `platform/packages/design-system`. Any change to **how** or **where** `anchor-name` is
written has to consider it, not only a change to whether it is cleaned up.

## Tests

`use-anchored-popover.test.tsx` &gt; `multiple popovers on same anchor` &gt;
`cleanup behaviour when popovers unmount`. Pins the policy across every relevant unmount order,
including reuse of the lingering anchor name when a fresh popover mounts on a previously-anchored
trigger.

`use-anchored-popover-at-point.test.tsx` &gt; `point anchor, anchor-name`. Pins the two kinds onto
different names across an element → point → element flip, and the popover's `position-anchor` onto
whichever name matches the current kind.

## Related

- VR test: `__tests__/vr-tests/multiple-popovers-on-same-anchor.vr.tsx`
- Source comment: search for "We are never cleaning up anchor names" in
  `src/internal/use-anchored-popover.tsx`
