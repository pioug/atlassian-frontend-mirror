# Anchor Name Lifetime

**Status:** Implemented 2026-05-06

`useAnchorPosition` writes `anchor-name` to the trigger element once and **never removes it**. New
hook calls on the same trigger reuse the existing value.

## Why no cleanup

Multiple popovers can anchor to the same trigger. The hook and the popover often live in
different components (compound popovers, portals into the top layer), so React's cleanup
ordering does not help us coordinate across them.

A reference-counted cleanup was prototyped and rejected. It survives the simple cases but breaks
under Strict Mode double-invoke, suspended subtrees, third-party writes to `anchor-name`, and
cross-component teardown ordering. Each adds a guard, the guards interact, and any drift in the
count silently re-introduces the dangling-reference bug.

Setting once and leaving it has no state to drift.

## Why this is safe

- `anchor-name` is an inline style on the trigger, so it is GC'd with the element.
- A declaration with no matching `position-anchor` is inert (no layout, paint, or hit-test cost).
- New consumers read the existing value and reuse it, so the "all popovers on a trigger share one
  anchor name" contract holds across mount/unmount cycles.
- The JS fallback path does not touch `anchor-name`, so unsupported browsers see nothing leftover.

## Trade-off accepted

A trigger that hosted a popover keeps an `anchor-name` declaration on its inline style for the
rest of its life. Visible to anyone serialising `outerHTML`, invisible to layout.

## Tests

`use-anchor-position.test.tsx` &gt; `multiple popovers on same anchor` &gt; `cleanup behaviour
when popovers unmount`. Pins the policy across every relevant unmount order, including reuse of
the lingering anchor name when a fresh popover mounts on a previously-anchored trigger.

## Related

- VR test: `__tests__/vr-tests/multiple-popovers-on-same-anchor.vr.tsx`
- Source comment: search for "We are never cleaning up anchor names" in
  `src/internal/use-anchor-position.tsx`
