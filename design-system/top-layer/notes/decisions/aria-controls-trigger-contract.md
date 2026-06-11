# ARIA controls trigger contract

## Status

**Decision recorded 2026-06-04, revised 2026-06-09**

`getAriaForTrigger()` returns `aria-controls` whenever the trigger controls a
popover whose host element is in the DOM. It is set to `undefined` (key
present, value `undefined`) while the popover is closed, because the
`Popover` and `Dialog` primitives no longer keep their host element mounted
between opens (see `host-element-unmount-when-hidden.md`).

## Context

After deleting the `Popup` compound, trigger wiring is owned by consumers
using `usePopoverId()` and `getAriaForTrigger()`. The helper needs one clear
contract for the relationship between a trigger and the `Popover` it
controls.

The competing shapes were:

- emit `aria-controls` only while the popover is open,
- emit `aria-controls` whenever the trigger controls a mounted popover.

Originally `Popover` stayed mounted while closed, so the referenced element
existed even when not visible and `aria-controls` could be stable. With the
unmount-when-hidden contract, the referenced element only exists while open
(or exit-animating), so a closed-state `aria-controls` would dangle.

## Decision

`aria-controls` mirrors the host element's lifecycle.

```tsx
const popoverId = usePopoverId();
const triggerAria = getAriaForTrigger({ role: 'menu', isOpen, popoverId });

<button ref={triggerRef} {...triggerAria}>
	Open menu
</button>

<Popover id={popoverId} role="menu" label="Actions" isOpen={isOpen}>
	{/* content */}
</Popover>
```

- `aria-controls`: this trigger controls that popover element whenever it
  exists. Spread renders no attribute on the trigger while the popover is
  closed.
- `aria-expanded`: mirrors `isOpen`.
- `aria-haspopup`: activating this trigger opens a popup of the given role.

`getAriaForTrigger()` always returns the `aria-controls` key (typed
`string | undefined`) so that the JSX spread will remove a previously set
attribute when the popover closes; it never omits the key.

## Rationale

- WAI-ARIA `aria-controls` is defined as the relationship to the element
  whose contents or presence are controlled by the current element. A
  reference to a non-existent id has no target to act on and is flagged by
  a11y tooling (axe `aria-valid-attr-value` does not flag it today, but
  bespoke linters and reviewers commonly do).
- The unmount-when-hidden contract removes the only reason the relationship
  could stay live across a closed window: the target node no longer exists,
  so the relationship has nothing to point at.
- Always returning the key (with `undefined`) keeps the consumer code a
  single JSX spread. Spread of `aria-controls: undefined` removes the
  attribute from the DOM, so a previously-set value does not leak across
  a re-render.
- APG combobox guidance allows `aria-controls` to be set only when the
  popup is visible.
- APG accordion and menu button patterns are not affected because their
  controlled regions stay mounted, so a stable `aria-controls` would still
  be the right call there. This decision is specific to the top-layer
  primitives whose host element is now lifecycle-managed.

## Consequences

- `TAriaForTrigger['aria-controls']` is `string | undefined`, not optional.
  Consumers can spread the result directly without per-key guarding.
- For consumers that wire `aria-controls` manually on a trigger (rather
  than via `getAriaForTrigger`), the same pattern applies: pass
  `aria-controls={isOpen ? popoverId : undefined}` so the attribute does
  not dangle. The `inline-dialog/src/inline-dialog-top-layer.tsx` adapter
  follows this pattern via an explicit `setAttribute` / `removeAttribute`
  pass on each render.
- README and architecture examples should continue to show
  `usePopoverId()` plus `getAriaForTrigger()` and may briefly call out the
  closed-state behaviour.

## References

- [WAI-ARIA 1.2: `aria-controls`](https://www.w3.org/TR/wai-aria-1.2/#aria-controls)
- [WAI-ARIA 1.2: `aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded)
- [WAI-ARIA APG: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [WAI-ARIA APG: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- `notes/decisions/host-element-unmount-when-hidden.md`
