# ARIA controls trigger contract

## Status

**Decision recorded 2026-06-04**

`getAriaForTrigger()` always returns `aria-controls`.

## Context

After deleting the `Popup` compound, trigger wiring is owned by consumers using
`usePopoverId()` and `getAriaForTrigger()`. The helper needs one clear contract
for the relationship between a trigger and the `Popover` it controls.

The competing shapes were:

- emit `aria-controls` only while the popover is open,
- emit `aria-controls` whenever the trigger controls a mounted popover.

`Popover` stays mounted while closed, so the referenced element exists even
when it is not visible.

## Decision

Keep `aria-controls` stable and let `aria-expanded` describe visibility.

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

This gives assistive technology a stable trigger-to-popover relationship and a
separate dynamic state:

- `aria-controls`: this trigger controls that popover element.
- `aria-expanded`: that popover element is currently visible or hidden.
- `aria-haspopup`: activating this trigger opens a popup of the given role.

## Rationale

- WAI-ARIA defines `aria-controls` as the relationship to the element whose
  contents or presence are controlled by the current element. It does not limit
  that relationship to the visible state.
- WAI-ARIA says that when an expandable controlled container is not owned by the
  element with `aria-expanded`, authors should identify the relationship using
  `aria-controls`.
- APG combobox guidance says `aria-controls` only needs to be set when the
  popup is visible, but that referencing a non-visible element is valid.
- APG accordion guidance keeps `aria-controls` present while `aria-expanded`
  changes between `true` and `false`.
- APG menu button guidance treats `aria-controls` as optional. Always emitting
  it is a valid top-layer convention, not a broader conformance requirement.
- Top-layer accessibility goals list missing trigger-to-popup relationships as
  a WCAG 1.3.1 / 4.1.2 gap. A stable `aria-controls` relationship directly
  addresses that gap.

## Consequences

- `getAriaForTrigger()` has no option to gate `aria-controls` on open state.
- README and architecture examples should show `usePopoverId()` plus
  `getAriaForTrigger()` rather than hand-written, open-only `aria-controls`.
- Legacy adapter packages can still reshape trigger props locally when their
  public API requires legacy compatibility, but that is not the top-layer
  helper contract.

## References

- [WAI-ARIA 1.2: `aria-controls`](https://www.w3.org/TR/wai-aria-1.2/#aria-controls)
- [WAI-ARIA 1.2: `aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded)
- [WAI-ARIA APG: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [WAI-ARIA APG: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
