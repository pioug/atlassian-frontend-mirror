# Inline modal surfaces stay out of the top layer

## Status

**Decided (2026-10-26).** First case: the Rovo navigation mini-modal tray
(`ai-mate/rovo-navigation/src/ui/side-navigation/MiniModalDialog.tsx`).

## Decision

A custom modal surface that renders **inline** (no portal) inside its host does not need to move to
the top layer. Keep it as its own surface. Change only its keyboard handling, so that nested
top-layer layers get their keys first.

For the Rovo tray, that keyboard change is already on master (#512050). This note records why the
tray stays inline. It does not come with a code change.

## Why it does not need the top layer

- **Stacking is already correct.** The surface is a real DOM child of its host, so it paints with
  the host. Nested DS popups (`Popup`, `DropdownMenu`, `Tooltip`) are top-layer with
  `platform-dst-top-layer` on, so they paint above it. See the "inline overlays" safe pattern in
  [`legacy-layering-interlacing-hazards.md`](../migrations/legacy-layering-interlacing-hazards.md).
- **A modal `Dialog` changes behaviour.** `showModal()` makes the whole page inert, not only the
  host (Rule 14). Its `::backdrop` covers the full viewport, so a click anywhere on the page closes
  the surface and the page does not get the click.
- **A modal `Dialog` costs code.** The surface must be pinned over its host (anchor positioning,
  plus a measured-rect fallback), and the clipping that the host gave for free must be faked
  (`clip-path` in the slide animation).

## The keyboard bug, and how #512050 fixed it

**The bug.** The surface handles Escape and Tab on its root. It used
`useLayering().isLayerDisabled()` to yield to nested layers (Rule 6). The top-layer paths of `Popup`
and `DropdownMenu` do not render `<Layering>`, so `isLayerDisabled()` was `false` while a nested
menu was open. The menu is a DOM descendant, so its `keydown` bubbled to the surface:

- **Escape:** the browser closed the popover but did not call `preventDefault()`. The surface then
  closed too. One Escape closed two layers.
- **Tab:** the surface took the key and moved focus out of the open menu.

**The fix, on master in #512050** (`MiniModalDialog.tsx`). Behind `platform-dst-top-layer`:

- `useLayering({ isEnabled: !fg('platform-dst-top-layer') })` turns the level tree off.
- The `onKeyDown` handler returns early while
  `hasOpenDialogOrPopover({ within: event.currentTarget })` is `true`: an open `<dialog>`, or an
  open closable popover that is not a tooltip. Top-layer surfaces render inline, so `within` scopes
  the check to layers opened from the surface.
- The focus lock stays. Nested popovers are DOM descendants, so the lock contains them.

Use the same pattern for other inline surfaces.

## When to use the top layer instead

Move the surface to `Dialog` or `Popover` only when it must escape its host: the host clips it
(`overflow`, `transform`, `contain`), or it must paint above other top-layer surfaces.
