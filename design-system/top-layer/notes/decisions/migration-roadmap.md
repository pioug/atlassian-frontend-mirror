# Design System Layering Packages — Migration roadmap

> **Last updated:** 2026-07-07 **Feature flag:** `platform-dst-top-layer` gates native top-layer
> rendering in consuming packages.

This table tracks **whether a package ships a top-layer code path** (imports `@atlaskit/top-layer`
and branches on the flag). It is not the same as “every example in the package uses top layer”: base
`Select`, for instance, stays legacy; only `PopupSelect` migrates.

## Layering components

| Package             | Name                          | Category   | Migrated (FF)? | Notes                                                                                                                                                                                                                                                                                              |
| ------------------- | ----------------------------- | ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup`             | `@atlaskit/popup`             | Overlays   | ✅ Yes         | `popup-top-layer.tsx`, compositional path                                                                                                                                                                                                                                                          |
| `tooltip`           | `@atlaskit/tooltip`           | Overlays   | ✅ Yes         | `Popover` + anchor positioning                                                                                                                                                                                                                                                                     |
| `modal-dialog`      | `@atlaskit/modal-dialog`      | Messaging  | ✅ Yes         | Native `<dialog>` via `Dialog`                                                                                                                                                                                                                                                                     |
| `dropdown-menu`     | `@atlaskit/dropdown-menu`     | Forms      | ✅ Yes         | `Popup` + menu keyboard via `useArrowNavigation`                                                                                                                                                                                                                                                   |
| `flag`              | `@atlaskit/flag`              | Messaging  | ✅ Yes         | `Popover` `manual` for stacking; motion unchanged                                                                                                                                                                                                                                                  |
| `spotlight`         | `@atlaskit/spotlight`         | Messaging  | ✅ Yes         | `Popover` + `useAnchoredPopover` + `useSimpleLightDismiss`                                                                                                                                                                                                                                         |
| `select`            | `@atlaskit/select`            | Forms      | ✅ Yes         | `PopupSelect` via `popup-select-top-layer.tsx`                                                                                                                                                                                                                                                     |
| `datetime-picker`   | `@atlaskit/datetime-picker`   | Forms      | ✅ Yes         | Calendar menu: `menu-top-layer.tsx`, `fixed-layer-menu-top-layer.tsx`                                                                                                                                                                                                                              |
| `inline-dialog`     | `@atlaskit/inline-dialog`     | Overlays   | ✅ Yes         | `inline-dialog-top-layer.tsx` — deprecate-in-favor-of-popup still applies to product direction                                                                                                                                                                                                     |
| `avatar-group`      | `@atlaskit/avatar-group`      | Display    | ✅ Yes         | Overflow dropdown: `avatar-group-top-layer.tsx`                                                                                                                                                                                                                                                    |
| `react-select`      | `@atlaskit/react-select`      | Forms      | ✅ Yes         | `MenuPortalTopLayer` via `menu-portal-top-layer.tsx`; combobox virtual-focus path (`aria-activedescendant`)                                                                                                                                                                                        |
| `drawer`            | `@atlaskit/drawer`            | Overlays   | ✅ Yes         | `drawer-top-layer.tsx` via `Dialog` (native `<dialog>`). Longer-term intent to deprecate in favor of modal still applies                                                                                                                                                                           |
| `blanket`           | `@atlaskit/blanket`           | Overlays   | ❌ No          | Replaced by `::backdrop` where modals use native dialog                                                                                                                                                                                                                                            |
| `onboarding`        | `@atlaskit/onboarding`        | Messaging  | ❌ No          | Deprecated — replaced by Spotlight                                                                                                                                                                                                                                                                 |
| `banner`            | `@atlaskit/banner`            | Messaging  | ❌ No          | Static / in-flow; not a target for this stack                                                                                                                                                                                                                                                      |
| `navigation-system` | `@atlaskit/navigation-system` | Navigation | ❌ No          | Flyouts deferred                                                                                                                                                                                                                                                                                   |
| `menu`              | `@atlaskit/menu`              | Navigation | ❌ No\*        | \*No local top-layer adapter (menu is in-flow, not an overlay). **Playwright + VR** run with the FF to catch regressions when menu content renders inside top-layer popovers. Focus contract in `top-layer-focus.spec.tsx`; broader WCAG sweep (semantics, sequence, structure) in `menu.spec.tsx` |

## Coverage without a package-local adapter

| Package          | Notes                                                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inline-message` | **Tests only** (no `@atlaskit/top-layer` import in component source). Browser + VR suites run with `platform-dst-top-layer`, including a dedicated `top-layer-focus.spec.tsx` covering the popup focus contract |

## Infrastructure / primitives

| Package     | Role                                                                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `portal`    | Legacy stacking; new stack avoids portals for top-layer surfaces                                                                                                |
| `layering`  | Legacy coordination; browser handles nesting for native popovers / dialog                                                                                       |
| `popper`    | Legacy positioning; replaced by CSS Anchor Positioning (+ JS fallback in top-layer). Deprecation plan: [popper-migration.md](../migrations/popper-migration.md) |
| `top-layer` | **Target primitive** — Popover API, `<dialog>`, hooks, placement map, animations                                                                                |

## Open API decisions deferred to a follow-up PR

The initial top-layer adoption ships with **near-zero changes to adopter packages' public types**.
The two ARIA-semantics widenings below were prepared and then deliberately reverted to keep the
public API of `@atlaskit/popup` and `@atlaskit/dropdown-menu` byte-identical to master. The places
where the FF-on path bridges the gap are tagged `FUDGE(top-layer-api)` in source so they are easy to
grep for.

When the top-layer public API is committed, a follow-up PR should:

1. Widen the public types listed below to match what the top-layer API actually produces.
2. Delete every `FUDGE(top-layer-api)` cast and its comment block.
3. Bump the affected packages with a `minor` changeset.

| Deferred change                                                        | Current narrow public type       | Target wide type                                                 | FUDGE site(s)                                                                                                                                                            |
| ---------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@atlaskit/popup` — widen `TriggerProps['aria-haspopup']`              | `boolean \| 'dialog'`            | `boolean \| 'dialog' \| 'menu' \| 'listbox' \| 'tree' \| 'grid'` | `packages/design-system/popup/src/popup-top-layer.tsx`                                                                                                                   |
| `@atlaskit/dropdown-menu` — widen `DropdownItemProps['aria-haspopup']` | `boolean \| 'dialog'` (optional) | `boolean \| 'dialog' \| 'menu' \| 'grid' \| 'listbox' \| 'tree'` | `packages/design-system/dropdown-menu/src/dropdown-menu-top-layer.tsx` (cast on `ariaAttributes` spread; covers `CustomTriggerProps` which extends popup `TriggerProps`) |

To find every fudge before the follow-up PR:

```bash
git grep -n "FUDGE(top-layer-api)" platform/packages/design-system
```

### Sizing API decisions deferred (`useAnchoredPopover`, 2026-09-10)

- **`shouldFlip={false}` is inert on the top-layer path**, documented as such since the adapters
  landed: the fallback chain comes from `position-try-fallbacks` and there is no per-consumer
  switch. The flip floor makes that more visible, not less: a fitting popover now flips at a
  well-defined threshold (`floor + gap + padding`) where before it stayed put and shrank. jira
  `horizontal-nav-tabs/AppTabMenu.tsx` is the site to watch; it sets the prop and reaches this path
  through `JiraPopup`.
- **`placement.minSize: 0` is the expressible answer**, and did not exist before: it caps the
  popover without giving it a reason to move. Consider exposing it on `Popup`, or wiring
  `shouldFlip={false}` to it, rather than leaving the prop inert. One limit before promising it: on
  a placement axis that is `'min-anchor'` or `'match-anchor'` while something is fitting,
  `minSize: 0` composes as `max(0px, anchor)` and leaves the anchor floor, and therefore the flip,
  standing. See [width-from-anchor-floors.md](./width-from-anchor-floors.md) → _Update (2026-08-25,
  later)_.
- **`TPopoverAxisSize`, `VIEWPORT_PADDING` and `FALLBACK_MINIMUM_MAIN_AXIS_SIZE` have no `exports`
  subpath.** `anchored-popover-size.tsx` is internal and `use-anchored-popover.tsx` does not
  re-export them. `TAnchoredPopoverOptions['inlineSize']` is the only way to name the axis-size type
  from outside the package (`@atlaskit/popup` does so in `src/internal/get-popup-axis-sizes.tsx`); a
  consumer that wants the padding constant still cannot have it. Not a regression, since the old
  `fit-axis-cap.tsx` had no subpath either.

### Tooltip `TriggerProps.testId` (kept on the public surface — not deferred)

`@atlaskit/tooltip` `TriggerProps` keeps the optional `testId?: string` field added on this branch.
It is the only public-API addition that ships with the initial adoption. Reasoning:

- It is not ARIA-semantics widening; it is a single optional `testId` plumbing field.
- Without it, every consumer that wraps `Tooltip` around `@atlaskit/button/new` (or any other
  `Pressable`-backed primitive) silently loses `data-testid` on the trigger element. Pressable
  hard-overwrites `data-testid={testId}` after the spread, so the legacy
  `(triggerProps as any)['data-testid']` workaround is absorbed. A typed `testId` field flows
  through Button/Pressable's own `testId` destructure and reaches the rendered DOM.
- The fix is consumer-visible (anything spreading `triggerProps` onto `Button`/`Pressable` starts
  getting `data-testid` again), but additive: no existing prop changes shape.

### Tooltip pointer dismissal (decided)

`@atlaskit/tooltip` keeps `mode="hint"` and lets the browser own pointer dismissal, rather than
following the `mode="manual"` precedent. A press dismisses the tooltip, and it stays dismissed until
the trigger is re-entered. Full reasoning and mechanism:
[tooltip-pointer-dismissal.md](./tooltip-pointer-dismissal.md).

The `hint` to `auto` fallback in `popover.tsx` is **not** a rollout concern. Platform ships to
`last 1 chrome / firefox / safari / ios_saf versions` plus `edge >= 18` (root `package.json`
`browserslist`), and current releases of those engines support `hint`, so the fallback does not
engage for supported users. The measurements showing fallback behaviour came from pinned Playwright
WebKit 26 and Firefox 144 builds, which lag shipping browsers and are not the support matrix.

One follow-up remains: **retiring `hideTooltipOnMouseDown` (119 call sites)**. It is the only way to
hide before a press completes, which native dismissal cannot reproduce because it fires on release.
Needs an audit of the call sites that use it, to avoid a tooltip sitting over content the press
removed. `hideTooltipOnClick` (311 call sites) has no observable effect on the top-layer path and
can be deprecated independently.

## Related docs

- Per-package write-ups: [`notes/migrations/`](../migrations/) — full list in
  [`notes/README.md`](../README.md)
