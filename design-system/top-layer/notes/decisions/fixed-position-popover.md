# Fixed-position Popover

## Status

**Recipe documented 2026-04-23**

Captures the supported pattern for rendering a top-layer surface at a fixed viewport position
(corner, edge, or pinned region) without anchoring to a DOM trigger. No code changes — the existing
`Popover` primitive is sufficient.

---

## Pattern

For a persistent, trigger-less surface that should appear at a fixed viewport position (the
canonical case is `@atlaskit/flag`):

```tsx
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';

const containerStyles = css({
	position: 'fixed',
	insetBlockEnd: token('space.600'),
	insetInlineStart: token('space.1000'),
});

export function PinnedSurface({ children }) {
	return (
		<Popover mode="manual" isOpen={true}>
			<div css={containerStyles}>{children}</div>
		</Popover>
	);
}
```

Two pieces:

1. **`<Popover mode="manual" isOpen={true}>`** — top-layer rendering only. No light dismiss, no
   Escape close, no click-outside close. The consumer's own lifecycle (auto-dismiss timer, close
   button, etc) controls mount/unmount.
2. **A `position: fixed` child** with logical `inset-*` tokens that pins the visible content to a
   viewport region.

---

## Why this works

- `Popover` is intentionally positioning-agnostic. It manages top-layer visibility and animation
  only — see `notes/architecture/positioning.md` and `src/popover/types.tsx`.
- The popover element itself inherits the user agent defaults (`inset: 0; margin: auto`), which
  would otherwise centre it. The fixed-position child paints over the popover's own box, so the UA
  defaults are not visible.
- Top-layer insertion order replaces the legacy z-index stack — there is no `z-index: flag` to
  coordinate.

---

## When to use this

✅ **Use this pattern for:**

- Persistent notifications pinned to a viewport corner (flags, snackbars, banners, toasts).
- Trigger-less surfaces whose position is a function of the viewport, not a DOM element.

❌ **Do not use this pattern for:**

- Click- or hover-triggered popovers anchored to a DOM element. Use `useAnchoredPopover` from
  `@atlaskit/top-layer/use-anchored-popover` instead.
- Popovers that need to follow scroll relative to a DOM trigger.
- Popovers that flip across viewport edges. The placement model (`block-end-align-start`, etc.) does
  not apply here — you choose a fixed region directly via CSS.

---

## Why no new helper today

The recipe is two CSS properties on a child element. A wrapper component would leak layout opinions
(which corner, which inset values) into a layering primitive. The flag and example consumers each
pick the inset values that suit their UI.

If a future use case needs a presets such as `viewport-corner-bottom-start` we can ship a small
`xcss` snippet from `@atlaskit/top-layer/popover`. Defer until a second consumer hits the same
recipe.

---

## Out of scope

- Anchor-to-`(x, y)` (e.g. context menu at click position).
- Virtual-element anchors (`getBoundingClientRect()` from a non-DOM source).
- Follow-on-scroll for virtual anchors.

These are Floating-UI-style features. They are not needed for fixed-corner UI and will be revisited
only when a real consumer arrives.

---

## References

- `notes/migrations/flag-migration.md` — first consumer of this pattern.
- `notes/architecture/positioning.md` — `useAnchoredPopover` (the anchored positioning primitive).
- `examples/all-placements.tsx` — demonstrates the pattern across the nine viewport regions
  (corners, edges, centre).
- `packages/design-system/flag/src/flag-group.tsx` — production usage.
