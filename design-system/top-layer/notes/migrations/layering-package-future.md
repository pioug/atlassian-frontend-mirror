# Future of `@atlaskit/layering` under top-layer

`@atlaskit/layering` becomes deletable once `platform-dst-top-layer` (and the tooltip and spotlight
gates) roll out. This note records the end state, the mapping from each old API to its replacement,
and the cleanup order.

## End state

- `@atlaskit/top-layer` does not depend on `@atlaskit/layering`. `Popover` and `Dialog` do not
  register with the open layer observer.
- The observer is replaced by the `@atlaskit/top-layer/page-surface` entry points:
  `hasOpenDialogOrPopover`, `requestClosePopovers` and `useCloseOnUnclaimedEscape`. They read the
  DOM, so they need no provider and no registration.
- With the gate on, every DS overlay renders an inline `popover` or `<dialog>` and does not render
  `<Layering>`. The level tree (`useLayering`, `useCloseOnEscapePress`) does not see DS overlays any
  more, so every remaining layering call is disabled on that path.
- With the gate off, behaviour is unchanged: legacy layering plus the observer.

## What counts as an open layer

- An open `<dialog>`. `type: 'modal'` counts only `dialog:modal`.
- An open `Popover` that has `onClose`. `Popover` marks its host with `data-top-layer-closable`.
- Never a tooltip (`role="tooltip"`), and never a popover without `onClose` (flag group, spotlight).

Surfaces render inline, so a surface opened from inside an element is a DOM descendant of it.
`within` replaces observer namespaces.

## Old API to new primitive

| Old call (gate off)                                                     | Gate-on replacement                                                                                                                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useCloseOnEscapePress({ onClose })` on a base-layer surface            | `useCloseOnUnclaimedEscape({ isEnabled, onClose, shouldClose, targetRef })`. It skips a prevented or repeated Escape, and an Escape while a layer is open. |
| `useLayering().isLayerDisabled()` in a grid or panel `onKeyDown`        | `hasOpenDialogOrPopover({ within: event.currentTarget })` at event time.                                                                                   |
| `<Layering isDisabled={false}>`, `currentLevel` as `data-ds--level`     | Nothing. Do not render on the gate-on path.                                                                                                                |
| `currentLevel > 0` as "render inline"                                   | Nothing. Top-layer overlays are inline. Keep the value that matches today's UX.                                                                            |
| `useOpenLayerObserver().getCount(...)`                                  | `hasOpenDialogOrPopover(...) \|\| Boolean(observer?.getCount(...))`. The observer is `null` on the gate-on path.                                           |
| `observer.onChange(...)`                                                | Listen for `toggle` and `close` in the capture phase, then re-read with `hasOpenDialogOrPopover`.                                                          |
| `observer.closeLayers()`                                                | `requestClosePopovers({ within })` plus `observer?.closeLayers()`.                                                                                         |
| `useNotifyOpenLayerObserver(...)` in an overlay                         | Pass `onClose` to the top-layer `Popover`. `Dialog` counts automatically.                                                                                  |
| `<OpenLayerObserver>`, `<OpenLayerObserverNamespaceProvider>` providers | Render only on the gate-off path.                                                                                                                          |

## Rollout shape: `isEnabled`

Hooks must still be called on both paths, so each layering hook takes `isEnabled`. Pass
`isEnabled: !fg('platform-dst-top-layer')`.

- `useLayering({ isEnabled: false })`: `currentLevel` is 0, `isLayerDisabled()` is `false`,
  `getTopLevel()` is `null`.
- `useCloseOnEscapePress({ isEnabled: false })`: no listener.
- `useNotifyOpenLayerObserver({ isEnabled: false })`: never registers.
- `useOpenLayerObserver({ isEnabled: false })`: returns `null`.
- `<Layering>`: do not render it on the gate-on path (render the children directly), or pass
  `isDisabled`.

## Cleanup once the gates roll out

1. Delete each `fg('platform-dst-top-layer')` check and its gate-off branch. Every layering hook is
   then called with `isEnabled: false`, and every provider and `<Layering>` is gone.
2. Delete the layering calls and imports. They do nothing, so this is mechanical. Collapse
   `hasOpenDialogOrPopover(...) || Boolean(observer?.getCount(...))` to
   `hasOpenDialogOrPopover(...)`, and drop `observer?.closeLayers()`.
3. Remove `@atlaskit/layering` from each `package.json`.
4. Deprecate, then delete, `@atlaskit/layering`.
