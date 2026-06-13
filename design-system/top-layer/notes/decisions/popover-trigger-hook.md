# Popover Trigger Hook

## Status

**Decision recorded 2026-06-04**

Do not add a public `usePopoverTrigger` hook yet. Keep `usePopoverId()` and `getAriaForTrigger()` as
the low-level trigger wiring helpers.

---

## Context

The `Popup` compound deletion leaves adopters composing lower-level primitives:

- `Popover` for top-layer lifecycle, animation, focus, and light dismiss.
- `useAnchorPosition` for geometry.
- `usePopoverId` for CSS-safe id generation.
- `getAriaForTrigger` for trigger ARIA.

A proposed `usePopoverTrigger` hook could bundle the id, trigger ref, popover ref, trigger ARIA, and
`Popover` pairing props. This is attractive for examples and greenfield button-triggered popovers,
but the current rollout evidence comes from feature-flagged migration adapters, not greenfield call
sites.

---

## Decision

Do not introduce `usePopoverTrigger` as part of the current top-layer API surface.

The real `/platform` consumers behind `platform-dst-top-layer` mostly need small primitives they can
bend around legacy contracts. A hook that owns the happy path would not remove the hard adapter
code, and a hook that only wraps `usePopoverId` plus `getAriaForTrigger` would add abstraction
without enough authoring benefit.

Keep the documented composition as:

```tsx
const popoverId = usePopoverId();
const triggerAria = getAriaForTrigger({ role: 'menu', isOpen, popoverId });

useAnchorPosition({
	anchorRef: triggerRef,
	popoverRef,
	placement,
});
```

---

## Consumer audit

| Consumer                    | Hook value | Notes                                                                                                                                                                           |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@atlaskit/popup`           | Low        | Must preserve legacy `TriggerProps`, optional consumer-provided ids, role bridging, and width-from-anchor compatibility.                                                        |
| `@atlaskit/dropdown-menu`   | Low        | Trigger wiring is small compared with controlled state, keyboard-open detection, focus binding, custom trigger render-prop support, menu click close rules, and type narrowing. |
| `@atlaskit/inline-dialog`   | Low        | Trigger is arbitrary `children`; the adapter applies ARIA to `firstElementChild` through an effect. A returned `triggerProps` object does not fit naturally.                    |
| `@atlaskit/avatar-group`    | Low        | Could reuse refs/id/ARIA, but the focus wrapper, `renderMoreButton` bridge, ArrowDown-to-open behavior, and menu navigation remain local.                                       |
| `@atlaskit/select`          | None       | Preserves legacy `'aria-haspopup': 'true'` for compatibility, so the hook's main ARIA value would be bypassed.                                                                  |
| `@atlaskit/datetime-picker` | None       | React Select owns the trigger lifecycle and open state. The top-layer menus are `mode="manual"` and always open while mounted, with external trigger refs.                      |
| `@atlaskit/tooltip`         | None       | Tooltip triggers use `aria-describedby`, hover/mouse lifecycle, and sometimes point anchoring. This is intentionally outside `getAriaForTrigger`.                               |
| `@atlaskit/spotlight`       | None       | Programmatic/manual lifecycle with context-owned target refs and `useSimpleLightDismiss`.                                                                                       |
| `@atlaskit/flag`            | None       | Triggerless manual popover used only for top-layer stacking.                                                                                                                    |

---

## Why not add it for examples

Examples do repeat the same basic pattern, but examples are not enough evidence for a public API.
The current migration work shows that most production adopters either:

- need to adapt a legacy trigger prop contract,
- have external trigger ownership,
- use `mode="manual"`,
- use tooltip-style `aria-describedby`, or
- are triggerless.

Publishing a public hook now would risk creating a second semi-compound API immediately after
removing the `Popup` compound.

---

## Revisit criteria

Reconsider a hook only when at least two production consumers can use the same shape without local
reshaping.

A future hook should earn its abstraction by owning the complete happy-path trigger pairing:

```tsx
const { triggerRef, popoverRef, popoverId, triggerProps, popoverProps } = usePopoverTrigger({
	role: 'dialog',
	isOpen,
});
```

It should still leave these concerns outside the hook:

- open/close state transitions,
- trigger event handlers such as `onClick`,
- positioning via `useAnchorPosition`,
- width behavior via `useWidthFromAnchor`,
- tooltip `aria-describedby` wiring,
- manual or triggerless popover lifecycles.

If the hook cannot own refs, id, ARIA, and `Popover` pairing props together, prefer the existing
`usePopoverId` plus `getAriaForTrigger` primitives.

---

## References

- `notes/decisions/delete-popup-compound.md` - records the compound deletion and the earlier
  decision to defer a consolidated anchor/trigger hook.
- `notes/README.md` - current matrix of packages behind `platform-dst-top-layer`.
- `notes/decisions/audit-decisions.md` - records that standalone trigger lifecycles own their own
  `aria-controls` wiring.
- `notes/decisions/aria-controls-trigger-contract.md` - records the stable `aria-controls` contract
  for `getAriaForTrigger`.
- `packages/design-system/top-layer/src/internal/get-aria-for-trigger.tsx` - current low-level ARIA
  helper.
- `packages/design-system/top-layer/src/entry-points/use-popover-id.tsx` - current id helper.
