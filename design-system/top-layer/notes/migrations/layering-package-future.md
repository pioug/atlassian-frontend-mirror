# Future of `@atlaskit/layering` under top-layer

What to do with `@atlaskit/layering` once `@atlaskit/top-layer` is the rendering
primitive, and what each adopter package should do on the
`platform-dst-top-layer` FF-on path.

---

## TL;DR

`@atlaskit/layering` ships two unrelated surfaces. Top-layer makes one of them
obsolete and leaves the other untouched.

| Surface | What it does | Status under top-layer | Action |
|---|---|---|---|
| **Level-tree + Escape coordination** — `Layering`, `useLayering`, `useCloseOnEscapePress`, plus `LayerNode`, `LevelContext`, `LevelNodeContext`, `RootNodeContext` (entry points `./layering`, `./hooks`) | Userland emulation of a top-layer stack so the topmost open layer "wins" Escape. | Replaced. `popover="auto"` and `<dialog>.showModal()` give us the real browser top-layer stack; `useSimpleLightDismiss` covers manual popovers; Dialog gating moves into the consumer's `onClose({ reason })` handler (see `notes/decisions/dialog-close-flow.md`). | **Deprecate. Do not move into `top-layer`.** Delete from `@atlaskit/layering` once every adopter's top-layer code path is default-on. |
| **Open layer observer** — `OpenLayerObserver`, `OpenLayerObserverNamespaceProvider`, `useOpenLayerObserver`, `useNotifyOpenLayerObserver`, `LayerType`, `LayerCloseListenerFn` (entry points `./experimental/*`) | Count open layers by namespace/type, subscribe to count changes, `closeLayers()`. | Not replaced. Browser top-layer surfaces do not expose count or close-all. Used by `navigation-system` (side-nav, panel splitter, toggle button, keyboard shortcut), `search-page`, `focus-state`, `integration-automation`, `drag-and-drop`, `treegrid`, `modal-wrapper`, etc. | **Keep.** Stays in `@atlaskit/layering` (or moves to a sibling package later). Do **not** bundle into `top-layer`. |

> **Net rule of thumb:** on the FF-on path, keep importing
> `@atlaskit/layering/experimental/open-layer-observer`. Drop everything from
> the package root (`Layering`, `useLayering`, `useCloseOnEscapePress`).

---

## Why the level/Escape primitives go away

`useCloseOnEscapePress` only exists to answer one question:

> "Am I the top layer right now? If not, ignore Escape so the topmost layer
> handles it."

That is `isLayerDisabled = layerNode.getLevel() < rootNode.getHeight()` — a
userland reimplementation of the native top-layer stack.

Top-layer replaces it:

- **Auto popovers and modal dialogs** sit on the actual browser top-layer
  stack. The browser routes Escape to the topmost element and pops only it. No
  `useLayering` / `useCloseOnEscapePress` needed.
- **Manual popovers** (Flag, Spotlight) opt out of the stack and use
  `useSimpleLightDismiss` from
  `top-layer/use-simple-light-dismiss`, which is documented as deliberately
  stack-unaware ("this hook does not track a popover stack" — that is the
  whole point now that the browser has the real stack).
- **Modal Dialog gating** (`shouldCloseOnEscapePress`,
  `shouldCloseOnOverlayClick`) lives in the consumer's `onClose({ reason })`
  handler per `notes/decisions/dialog-close-flow.md`.

There is nothing in `Layering` / `useLayering` / `useCloseOnEscapePress` that
needs to live in `top-layer`. Adding it would re-introduce the userland-stack
model the new architecture is explicitly removing.

## Why `OpenLayerObserver` stays

It solves a different problem from the level tree, and `top-layer` does not (and
should not) expose anything equivalent:

- Counting open layers by namespace and/or `LayerType` (`'modal' | 'popup'`).
- Subscribing to count changes without re-renders.
- `closeLayers()` — single command to dismiss everything (used by side-nav
  flyout, focus-state, integration-automation, search quick-find,
  drag-and-drop, treegrid, modal-dialog wrapper, etc.).

These are app-coordination concerns, not rendering concerns. Bundling the
observer into `top-layer` would force every consumer of `top-layer` to pull in
observer machinery they do not need, couple a stable rendering primitive to a
feature surface still under `experimental/*`, and mix two lifecycles
(`tooltip` is a top-layer consumer that should not register with an observer).

Keep them as separate packages: **`top-layer` renders, the observer
coordinates.**

---

## What the FF-on code path must do in every adopter

For each adopter (`popup`, `dropdown-menu`, `modal-dialog`, `inline-dialog`,
`select`, `react-select`, `tooltip`, `drawer`, `blanket`, `onboarding`,
`datetime-picker`):

1. Remove imports of `Layering`, `useLayering`, `useCloseOnEscapePress` from
   `@atlaskit/layering` (root entry).
2. Remove `<Layering>` wrappers.
3. Remove `useCloseOnEscapePress({ onClose, isDisabled })` calls. Escape now
   flows through `top-layer`'s `onClose({ reason: 'escape' })` (auto popover /
   `<dialog>`) or `useSimpleLightDismiss` (manual popover).
4. Keep `useNotifyOpenLayerObserver({ isOpen, onClose, type })` from
   `@atlaskit/layering/experimental/open-layer-observer`. Make sure the
   `onClose` you pass on the FF-on path actually dismisses the new top-layer
   surface (flips `isOpen` to `false`), so `closeLayers()` still works.
5. Keep `OpenLayerObserver` and `OpenLayerObserverNamespaceProvider` in
   product apps untouched — they sit above the rendering primitives and are not
   affected by the FF.

The cleanest enforcement is the one already in use: the `*-top-layer.tsx`
adapter files (e.g. `popup-top-layer.tsx`, `popup-content-top-layer.tsx`)
**must not** import `Layering`, `useLayering`, or `useCloseOnEscapePress`. The
legacy sibling file keeps those imports until the FF defaults to on and the
legacy path is removed.

### Confirmed FF-on / FF-off split that already exists

- `packages/design-system/popup/src/popup.tsx:90` —
  `if (fg('platform-dst-top-layer'))` chooses between `popup-top-layer.tsx` and
  the legacy `popper-wrapper`-based path.
- `packages/design-system/popup/src/compositional/popup-content.tsx:137` —
  same FF check picks `popup-content-top-layer.tsx`.
- The legacy path imports `Layering` and `useNotifyOpenLayerObserver`. The FF-on
  path keeps `useNotifyOpenLayerObserver` and drops `Layering` (and
  transitively `useLayering` / `useCloseOnEscapePress` from
  `popper-wrapper.tsx`, `use-close-manager.tsx`, `use-focus-manager.tsx`).

### Where `useCloseOnEscapePress` is used outside DS

Non-DS callers (e.g. `packages/eoc/focus-state/src/common/utils/close-on-esc/`)
continue to work against the legacy stack until either (a) they migrate to
`top-layer` themselves, or (b) the final cleanup deletes
`useCloseOnEscapePress` after every adopter is FF-on by default. They are not
in the critical path for the top-layer rollout.

---

## Cleanup sequencing for `@atlaskit/layering`

1. **Now (FF rollout in progress)** — both surfaces ship as today. The FF-on
   adapters already drop the level-tree imports.
2. **FF default-on per adopter** — once an adopter's FF-on path becomes the
   only path, delete the legacy file and the level-tree imports go with it.
3. **All adopters default-on** — mark `Layering`, `useLayering`,
   `useCloseOnEscapePress`, and the `./layering` + `./hooks` entry points as
   deprecated in source, with a JSDoc pointer to the top-layer replacement
   (auto popover for Escape stacking, `useSimpleLightDismiss` for manual
   popovers, `onClose({ reason })` for Dialog gating).
4. **Major bump** — delete the deprecated exports and the `./layering` /
   `./hooks` entry points.
5. **Optional rename / promotion** — promote the observer out of
   `experimental/*` to a stable entry point at the same time. Optional cosmetic
   rename of the package to `@atlaskit/open-layer-observer` (or move the
   observer into a new package and empty `@atlaskit/layering`); ~25 consumers
   would need to update imports, so this is a real cost — defer unless there is
   a clear benefit beyond naming.

---

## Quick adopter import audit (as of writing)

Imports of the **level-tree** surface that need to disappear on the FF-on path
(legacy path keeps them until the legacy path is deleted):

- `packages/design-system/popup/src/popup.tsx` — `Layering`
- `packages/design-system/popup/src/compositional/popup-content.tsx` —
  `Layering`
- `packages/design-system/popup/src/popper-wrapper.tsx` — `useLayering`
- `packages/design-system/popup/src/use-close-manager.tsx` — `useLayering`
- `packages/design-system/popup/src/use-focus-manager.tsx` — `useLayering`
- analogous spots in `dropdown-menu`, `modal-dialog`, `inline-dialog`,
  `select`, `react-select`, `tooltip`, `drawer`, `blanket`, `onboarding`,
  `datetime-picker` (per the broader fan-out in `package.json`)

Imports of the **observer** surface that stay on both paths:

- `popup/src/popup.tsx`, `popup/src/compositional/popup-content.tsx` —
  `useNotifyOpenLayerObserver`
- `tooltip/src/tooltip.tsx` — `useNotifyOpenLayerObserver`
- `select/src/popup-select/notify-open-layer-observer.tsx`,
  `react-select/src/internal/notify-open-layer-observer.tsx`
- `modal-dialog/src/internal/components/modal-wrapper.tsx` —
  `useNotifyOpenLayerObserver`
- `navigation-system` (side-nav, panel splitter, toggle button, keyboard
  shortcut) — `useOpenLayerObserver`
- product callers: `search-page`, `focus-state`, `integration-automation`,
  `drag-and-drop`, `treegrid`, `capacity-planning`, `link-datasource`,
  `jira/timeline-table`, `eoc/focus-state`, `inception-ads`,
  `forge-common-app-gateway`
