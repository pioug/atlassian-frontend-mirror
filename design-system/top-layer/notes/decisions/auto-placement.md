# `placement="auto"` on the top layer

**Decision (26 Nov 2026):** on the top layer, `placement="auto"` means below the trigger and
centred. The fallbacks flip it when it does not fit. There is no "most space" logic.

## What `auto` does

- `auto` maps to `{ axis: 'block', edge: 'end', align: 'center' }`. `auto-start` and `auto-end` use
  the same edge with `align: 'start'` and `align: 'end'`. The map is `placementMapping`
  (`src/placement-map/placement-mapping.tsx`), read through `fromLegacyPlacement`.
  `__tests__/unit/placement-map.tsx` pins it.
- CSS anchor positioning: when the popover does not fit, the browser tries its
  `position-try-fallbacks` in order. For a centred popover it first slides along the bottom edge,
  then flips to the top, then slides along the top edge. `placementToTryFallbacks`
  (`src/internal/anchor-positioning/placement-to-try-fallbacks.tsx`) builds the list.
- JavaScript fallback: the popover goes below. It flips above only when it does not fit below and
  there is more space above (`computeFallbackPosition`).

## Who gets it

- `Popup` and `PopupContent` (`@atlaskit/popup`): `auto` is their default `placement`, so every
  top-layer `Popup` with no `placement` opens below its trigger.
- These wrappers also send the legacy placement through `fromLegacyPlacement`, but none defaults to
  `auto`. Only a caller that passes `auto` gets it:
  - `DropdownMenu` and `InlineDialog` (default `bottom-start`).
  - `Tooltip` with `position="auto"` (default `bottom`). Its top-layer path has its own gate,
    `platform-dst-top-layer-tooltip`.
  - `@atlaskit/popper`: `Popper` (default `bottom-start`) and `createPopper` (default `bottom`) with
    `placement="auto"`. They pass `auto` through unchanged.
  - `PopupSelect` with `popperProps.placement="auto"` (default `bottom-start`).

## Difference from legacy

Legacy Popper chooses the side when the popup opens: its `flip` modifier (`computeAutoPlacement` in
`@popperjs/core`) puts an `auto` popup on the side (top, right, bottom or left) with the least
overflow, so the most space. So a legacy `auto` popup can open beside its trigger, where the
top-layer one opens below. A caller that needs a side sets a real `placement`.

## Evidence (26 Nov 2026)

- VR with `platform-dst-top-layer` forced on: 10 informational rows change, all in
  `navigation/atlassian-switcher/__tests__/informational-vr-tests/index.vr.tsx`. Each example wraps
  the switcher in a `Popup` with no `placement`. In the viewed row, legacy opens it to the right of
  the trigger and the top layer opens it below.
- Product app switchers: every callsite sets `placement="bottom-start"`, on `Popup` or through a
  wrapper that forwards it (`PopupTrigger`, `JiraPopup`, adminhub `PopupMenu`). Checked in adminhub,
  avp, confluence, dev-agents, guard-detect, help-center, insights, jira, kitsune, mercury,
  post-office, rovo-extension, store, studio, townsquare, volt, and platform
  (`global-top-navigation`, `standalone-directory`, `forge-common-app-gateway`). The wac switcher
  uses no `Popup`. So no product callsite changes.
- Layers inside the switcher: the org selector and the reorder menu are `DropdownMenu`
  (`bottom-start`), and the unit description popup sets `placement="bottom"`.

## At rollout

- Re-baseline the 10 switcher rows.
- In the JSDoc of the `Popup` `placement` prop (`popup/src/types.tsx`), drop the words "With
  `platform-dst-top-layer`".
- These public docs and examples describe the legacy choice. They are correct while the gate is off.
  Change them when the gate is removed:
  - `popup/constellation/index/usage.mdx:32` and `popup/constellation/index/examples.mdx:29`
  - `inline-dialog/constellation/index/examples.mdx:20`
  - `tooltip/constellation/index/examples.mdx:47` (change it when `platform-dst-top-layer-tooltip`
    is removed)
  - Example text: `inline-dialog/examples/02-positioning.tsx:58` and
    `dropdown-menu/examples/99-testing-placements.vr.ap.tsx:95` (a VR example)
