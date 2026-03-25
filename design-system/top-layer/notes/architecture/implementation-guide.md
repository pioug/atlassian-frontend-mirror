# @atlaskit/top-layer — Complete Rebuild Guide

> **Purpose:** This document contains every detail needed to recreate the `@atlaskit/top-layer` package from scratch. It covers architecture, APIs, props, event flows, animation timings, positioning, accessibility, focus management, type system design, and legacy compatibility concerns.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Component Hierarchy](#2-architecture--component-hierarchy)
3. [Entry Points](#3-entry-points)
4. [Popover Primitive](#4-popover-primitive)
5. [Dialog Primitive](#5-dialog-primitive)
6. [Popup Compound Component](#6-popup-compound-component)
7. [Placement System](#7-placement-system)
8. [Anchor Positioning](#8-anchor-positioning)
9. [Animation System](#9-animation-system)
10. [Focus Management](#10-focus-management)
11. [ARIA & Type-Safe Accessibility](#11-aria--type-safe-accessibility)
12. [Arrow System](#12-arrow-system)
13. [Light Dismiss](#13-light-dismiss)
14. [Scroll Lock](#14-scroll-lock)
15. [Legacy Migration Utilities](#15-legacy-migration-utilities)
16. [Internal Utilities](#16-internal-utilities)
17. [Testing Infrastructure](#17-testing-infrastructure)
18. [Browser Compatibility](#18-browser-compatibility)
19. [What You Wouldn't Need Without Legacy Support](#19-what-you-wouldnt-need-without-legacy-support)

---

## 1. Project Overview

### What It Is

`@atlaskit/top-layer` is a low-level primitives library that provides three core building blocks for layered UI:

- **`Popover`** — Wraps the native Popover API (`<div popover="auto">`). Manages visibility, animation, focus wrapping, and initial focus. No positioning opinions.
- **`Dialog`** — Wraps the native `<dialog>` element. Manages `showModal()`/`close()`, animation, focus wrapping, Escape handling, and backdrop click detection. No visual opinions.
- **`Popup`** — Compound component (`Popup` + `Popup.Trigger` + `Popup.Content` + `Popup.Surface`) that composes Popover with anchor positioning, trigger wiring, and automatic ARIA attributes.

### Design Principles

1. **Browser-native first.** Use the Popover API and `<dialog>` element instead of portals, z-index, and custom layering.
2. **Declarative visibility.** `isOpen` prop controls show/hide. The element stays mounted in the DOM — never conditionally rendered.
3. **CSS-first positioning.** CSS Anchor Positioning (`position-anchor`, `position-area`, `position-try-fallbacks`) with a JS fallback for older browsers.
4. **CSS-first animation.** `@starting-style` for entry, `transition-behavior: allow-discrete` for exit. No JS animation libraries.
5. **No visual opinions.** The primitives reset browser defaults to transparent/borderless. Consumers (or `PopupSurface`) provide visual styling.
6. **Accessibility by construction.** TypeScript discriminated unions enforce WCAG 4.1.2 at compile time. Focus management is role-based and automatic.
7. **Animation and visibility are one concern.** Exit animations require controlling `hidePopover()` timing, so they cannot be split into a separate hook.

### Dependencies

```json
{
  "@atlaskit/browser-apis": "workspace:^",
  "@atlaskit/css": "workspace:^",
  "@atlaskit/ds-lib": "workspace:^",
  "@atlaskit/primitives": "workspace:^",
  "@atlaskit/tokens": "workspace:^",
  "@babel/runtime": "root:*",
  "@compiled/react": "root:*",
  "bind-event-listener": "root:*",
  "raf-schd": "^4.0.3"
}
```

Key external dependencies:
- **`@compiled/react`** — Atomic CSS-in-JS (used for component reset styles via `cssMap`)
- **`bind-event-listener`** — Type-safe event binding that returns cleanup functions
- **`raf-schd`** — `requestAnimationFrame`-throttled scheduling for scroll/resize handlers
- **`@atlaskit/ds-lib`** — Utilities: `mergeRefs`, `noop`, `once`
- **`@atlaskit/tokens`** — Design tokens for colors, spacing, shadows
- **`@atlaskit/css`** — `cssMap` for Compiled CSS

---

## 2. Architecture & Component Hierarchy

```
┌─────────────────────────────────────────────────────┐
│  Popup (compound)                                    │
│  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ Popup.Trigger│  │ Popup.Content (PopupContent)  │  │
│  │ (cloneElement│  │  ┌─────────────────────────┐  │  │
│  │  or render   │  │  │ useAnchorPosition       │  │  │
│  │  prop)       │  │  │ (native focus restore)  │  │  │
│  └──────────────┘  │  │ usePresetStyles (arrow) │  │  │
│                    │  └─────────────────────────┘  │  │
│                    │  ┌─────────────────────────┐  │  │
│                    │  │ Popover (primitive)      │  │  │
│                    │  │  ┌───────────────────┐   │  │  │
│                    │  │  │ useAnimatedVis.   │   │  │  │
│                    │  │  │ useFocusWrap      │   │  │  │
│                    │  │  │ useInitialFocus   │   │  │  │
│                    │  │  └───────────────────┘   │  │  │
│                    │  └─────────────────────────┘  │  │
│                    └──────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Dialog (primitive)                                  │
│  ┌───────────────────┐                               │
│  │ useAnimatedVis.   │                               │
│  │ useFocusWrap      │                               │
│  └───────────────────┘                               │
└─────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── index.tsx                          # Empty — use entry points
├── animations/
│   ├── presets.tsx                     # slideAndFade, fade, scaleAndFade, dialogSlideUpAndFade, dialogFade
│   └── types.tsx                      # TAnimationPreset type
├── arrow/
│   ├── index.tsx                      # arrow() preset with CSS and @position-try rules
│   └── types.tsx                      # TArrowPreset type
├── dialog/
│   ├── dialog-content.tsx             # <Dialog> component (forwardRef)
│   ├── create-close-event.tsx         # createCloseEvent({ reason }) for legacy bridges
│   ├── index.tsx                      # Re-exports
│   └── types.tsx                      # TDialogProps, TDialogCloseReason
├── dialog-scroll-lock/
│   └── index.tsx                      # DialogScrollLock component
├── focus/
│   ├── focus.tsx                      # getFirstFocusable, getLastFocusable, getNextFocusable
│   └── index.tsx                      # Re-exports
├── internal/
│   ├── anchor-positioning-fallback.tsx # JS fallback: computeFallbackPosition()
│   ├── combine.tsx                    # combine() — merge cleanup functions
│   ├── ensure-preset-styles.tsx       # ensurePresetStyles() — inject CSS into <head>
│   ├── reduced-motion.tsx             # prefersReducedMotion() — SSR-safe check
│   ├── resolve-placement.tsx          # TPlacement type, getPlacement()
│   ├── role-types.tsx                 # ARIA role types with compile-time enforcement
│   ├── set-style.tsx                  # setStyle() — apply inline styles, return cleanup
│   ├── use-anchor-positioning.tsx     # useAnchorPosition() hook
│   ├── use-animated-visibility.tsx    # useAnimatedVisibility() hook
│   ├── use-animation-preset.tsx       # useAnimationPreset() hook (unused/legacy)
│   ├── (deleted: use-focus-restore.tsx — now native browser behavior)
│   ├── use-focus-wrap.tsx             # useFocusWrap() hook
│   ├── use-initial-focus.tsx          # useInitialFocus() hook
│   └── use-preset-styles.tsx          # usePresetStyles() hook
├── placement-map/
│   └── index.tsx                      # fromLegacyPlacement(), placementMapping
├── popover/
│   ├── popover.tsx                    # <Popover> component (forwardRef)
│   ├── create-close-event.tsx         # createPopoverCloseEvent({ reason })
│   ├── index.tsx                      # Re-exports
│   └── types.tsx                      # TPopoverProps, TPopoverCloseReason, TPopoverForwardedProps
├── popup/
│   ├── popup.tsx                      # PopupRoot component
│   ├── popup-content.tsx              # PopupContent component (forwardRef)
│   ├── popup-context.tsx              # PopupContext, PopupProvider, usePopupContext
│   ├── popup-trigger.tsx              # PopupTrigger (cloneElement-based)
│   ├── popup-trigger-function.tsx     # PopupTriggerFunction (render-prop-based)
│   ├── popup-surface.tsx              # PopupSurface (styled wrapper)
│   ├── index.tsx                      # Compound export: Popup.Trigger, Popup.Content, etc.
│   └── types.tsx                      # TPopupProps, TPopupContentProps, TPopupTriggerProps, etc.
├── use-simple-light-dismiss/
│   └── index.tsx                      # useSimpleLightDismiss() hook
└── entry-points/
    ├── animations.tsx
    ├── arrow.tsx
    ├── create-close-event.tsx
    ├── dialog-scroll-lock.tsx
    ├── dialog.tsx
    ├── focus.tsx
    ├── placement-map.tsx
    ├── popover.tsx
    ├── popup.tsx
    ├── popup-surface.tsx
    ├── use-anchor-position.tsx
    └── use-simple-light-dismiss.tsx
```

---

## 3. Entry Points

Every public API is accessed through a dedicated entry point. The main `index.tsx` is empty — consumers always import from sub-paths:

```json
{
  ".": "./src/index.tsx",
  "./popover": "./src/entry-points/popover.tsx",
  "./popup": "./src/entry-points/popup.tsx",
  "./popup-surface": "./src/entry-points/popup-surface.tsx",
  "./dialog": "./src/entry-points/dialog.tsx",
  "./create-close-event": "./src/entry-points/create-close-event.tsx",
  "./dialog-scroll-lock": "./src/entry-points/dialog-scroll-lock.tsx",
  "./placement-map": "./src/entry-points/placement-map.tsx",
  "./animations": "./src/entry-points/animations.tsx",
  "./arrow": "./src/entry-points/arrow.tsx",
  "./focus": "./src/entry-points/focus.tsx",
  "./use-anchor-position": "./src/entry-points/use-anchor-position.tsx",
  "./use-simple-light-dismiss": "./src/entry-points/use-simple-light-dismiss.tsx"
}
```

Each entry point re-exports from the internal modules. This keeps bundle sizes small — consumers only pay for what they import.

---

## 4. Popover Primitive

### Overview

`Popover` is the lowest-level top-layer primitive. It wraps a `<div popover="auto|hint|manual">` and manages:

- Visibility lifecycle (`showPopover()` / `hidePopover()`)
- Entry/exit animations
- Focus wrapping (for `role="dialog"` / `role="alertdialog"`)
- Initial focus (role-based)
- Close reason detection (escape vs light-dismiss)

It has **no knowledge of positioning** — compose with `useAnchorPosition` for that.

### HTML Element

Renders a `<div>` with the `popover` attribute. All browser default styles are reset:

```css
border: none;
padding: 0;
margin: 0;
inset: auto;
overflow: visible;
background: transparent;
```

### Props (`TPopoverProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | *required* | Controls visibility. `true` → `showPopover()`, `false` → `hidePopover()`. |
| `children` | `ReactNode` | *required* | Content rendered inside the popover. Only mounted when `showChildren` is true (stays during exit animation). |
| `mode` | `'auto' \| 'hint' \| 'manual'` | `'auto'` | Native popover attribute value. `'hint'` falls back to `'auto'` if browser doesn't support it. |
| `onClose` | `(args: { reason: TPopoverCloseReason }) => void` | `noop` | Called on browser-initiated dismiss. Not called for programmatic close (consumer already knows). Not available when `mode='manual'`. |
| `onOpenChange` | `(args: { isOpen: boolean; element: HTMLDivElement }) => void` | — | Fires on toggle events. Provides a ref to the DOM element. |
| `onExitFinish` | `() => void` | — | Fires after exit animation completes (or immediately if no animation). |
| `animate` | `TAnimationPreset \| false` | — | Animation preset. Entry via `@starting-style`, exit via `allow-discrete`. |
| `placement` | `TPlacementOptions` | — | Hint for directional animations (sets CSS vars like `--ds-popover-tx`). Does NOT control positioning. |
| `role` | `TRoleRequiringAccessibleName \| TRoleWithImplicitName` | — | ARIA role. Determines focus behavior. |
| `label` | `string` | — | `aria-label`. Required for roles like `dialog`, `alertdialog`, `menu` (enforced by types). |
| `labelledBy` | `string` | — | `aria-labelledby`. Alternative to `label`. |
| `id` | `string` | auto-generated | HTML id. Used for `aria-controls` on triggers. |
| `testId` | `string` | — | `data-testid` attribute. |

### Close Reasons (`TPopoverCloseReason`)

```typescript
type TPopoverCloseReason = 'escape' | 'light-dismiss';
```

- `'escape'` — User pressed Escape key
- `'light-dismiss'` — User clicked outside, or browser dismissed for another `popover="auto"` reason

### Visibility Lifecycle

```
isOpen=true  → showPopover() called in useLayoutEffect
               @starting-style plays entry animation
               showChildren=true → children rendered

isOpen=false → hidePopover() called in useLayoutEffect
               programmaticCloseRef set to prevent redundant onClose
               Exit animation plays via CSS allow-discrete
               transitionend fires (or fallback timeout)
               showChildren=false → children unmounted
               onExitFinish fires
```

### Popover Mode: `'hint'`

The `'hint'` mode is for ephemeral UI like tooltips. Unlike `'auto'`, opening a hint popover does NOT close other `auto` popovers. Browser support detection uses DOM reflection:

```typescript
const supportsPopoverHint = once((): boolean => {
  const el = document.createElement('div');
  el.setAttribute('popover', 'hint');
  return el.popover === 'hint'; // unsupported browsers reflect to 'manual'
});
```

If unsupported, `'hint'` falls back to `'auto'` transparently.

### Close Reason Detection

Escape detection uses a capture-phase keydown listener on the popover element. The sequence:

1. User presses Escape → capture-phase keydown fires → `closeReasonRef.current = 'escape'`
2. Browser processes light dismiss → native `toggle` event fires with `newState: 'closed'`
3. Toggle handler reads `closeReasonRef.current` → calls `onClose({ reason: 'escape' })`
4. Ref is reset to `'light-dismiss'` for the next dismiss

For programmatic close (`isOpen` goes `false`), `programmaticCloseRef` is set to `true` before calling `hidePopover()`. The toggle handler checks this ref and skips calling `onClose`.

### Data Attribute for Animation CSS

When an animation preset is active, a data attribute is set on the element: `data-ds-popover-{preset.name}=""`. This is the CSS selector target for animation rules (e.g. `[data-ds-popover-slide-and-fade]`).

---

## 5. Dialog Primitive

### Overview

`Dialog` wraps the native `<dialog>` element. It manages `showModal()` / `close()`, animation, focus wrapping, Escape handling, and backdrop click detection. It has **no visual opinions** — no width, height, background, border-radius, or layout.

### HTML Element

Renders a `<dialog>` with reset styles:

```css
padding: 0;
border: none;
max-width: none;
max-height: none;
margin: auto;
background-color: transparent;

&::backdrop {
  background-color: token('color.blanket');  /* semi-transparent overlay */
}
```

### Props (`TDialogProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | *required* | `true` → `showModal()`, `false` → `close()`. |
| `children` | `ReactNode` | *required* | Dialog content. |
| `onClose` | `(args: { reason: TDialogCloseReason }) => void` | *required* | Called on Escape or backdrop click. Dialog does NOT close itself — consumer decides. |
| `animate` | `TAnimationPreset \| false` | — | Animation preset. |
| `onExitFinish` | `() => void` | — | Fires after exit animation completes. |
| `style` | `CSSProperties` | — | Inline styles on `<dialog>`. |
| `testId` | `string` | — | `data-testid`. |
| `id` | `string` | auto-generated | HTML id. |
| `label` | `string` | — | `aria-label`. When provided, `aria-labelledby` is not set. |
| `labelledBy` | `string` | — | `aria-labelledby`. Ignored when `label` is provided. |
| `shouldHideBackdrop` | `boolean` | `false` | Renders `::backdrop` transparent via an ID-scoped `<style>` tag. |

### Close Reasons (`TDialogCloseReason`)

```typescript
type TDialogCloseReason = 'escape' | 'overlay-click';
```

### Close Flow (Critical Design Decision)

The dialog **never closes itself**. The full flow:

1. **Escape key:** Native `cancel` event fires → we call `event.preventDefault()` (browser does NOT close it) → we call `onClose({ reason: 'escape' })` → consumer decides whether to set `isOpen={false}`.
2. **Backdrop click:** Our `onClick` handler detects `event.target === event.currentTarget` → calls `onClose({ reason: 'overlay-click' })` → consumer decides.
3. **Programmatic:** Consumer calls their own close logic → sets `isOpen={false}`.
4. **`isOpen={false}` detected:** `useLayoutEffect` calls `dialog.close()` → exit animation plays → `onExitFinish` fires → children unmount.

This design means consumers can gate closing by reason. For example, `@atlaskit/modal-dialog` checks `shouldCloseOnEscapePress` and `shouldCloseOnOverlayClick` in its `onClose` handler.

### Backdrop Transparency

Compiled CSS (atomic) deduplicates `::backdrop { background-color }` into a shared class, making it impossible to toggle between values via `cssMap`. The solution: inject an ID-scoped `<style>` tag with higher specificity:

```tsx
{shouldHideBackdrop && (
  <style>{`#${CSS.escape(dialogId)}::backdrop{background-color:transparent}`}</style>
)}
```

---

## 6. Popup Compound Component

### Overview

`Popup` is a compound component that composes Popover with trigger wiring, anchor positioning, focus management, and automatic ARIA attributes. It is the recommended API for the common "button opens anchored content" pattern.

### Component Parts

#### `Popup` (Root — `PopupRoot`)

Manages state and context. Does not render any DOM — just provides `PopupContext`.

**Props (`TPopupProps`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `TPlacementOptions` | *required* | Where to position content relative to trigger. |
| `children` | `ReactNode` | *required* | Must contain `Popup.Trigger` and `Popup.Content`. |
| `onClose` | `(args: { reason: TPopoverCloseReason }) => void` | *required* | Called on light dismiss. |
| `onOpenChange` | `(args: { isOpen: boolean; element: HTMLDivElement }) => void` | — | Called when popup opens/closes. |
| `mode` | `'auto' \| 'hint' \| 'manual'` | `'auto'` | Native popover mode. |
| `testId` | `string` | — | Forwarded to content element. |
| `forceFallbackPositioning` | `boolean` | — | Forces JS positioning fallback. |

**Context provided (`TPopupContextValue`):**

```typescript
type TPopupContextValue = {
  popoverId: string;
  placement: TPlacementOptions;
  onClose: ((args: { reason: TPopoverCloseReason }) => void) | null;
  triggerRef: MutableRefObject<HTMLElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenChange?: (args: { isOpen: boolean; element: HTMLDivElement }) => void;
  mode: 'auto' | 'hint' | 'manual';
  ariaHasPopup: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | 'true';
  setAriaHasPopup: (value: ...) => void;
  testId?: string;
  forceFallbackPositioning?: boolean;
};
```

#### `Popup.Trigger` (cloneElement-based)

Wraps a single child element via `cloneElement`. Injects:
- `ref` → merged with child's existing ref and `triggerRef` from context
- `onClick` → calls `popoverEl.togglePopover()` then child's original `onClick`
- `aria-expanded` → `isOpen` from context
- `aria-controls` → `popoverId` from context
- `aria-haspopup` → derived from content's role via context

**Limitation:** Incompatible with Compiled's `css` prop on the direct child (the `@jsx jsx` pragma transforms the child before `cloneElement` can inject props). Use `Popup.TriggerFunction` instead.

#### `Popup.TriggerFunction` (render-prop-based)

Alternative to `Popup.Trigger` that avoids `cloneElement`. Calls a render function with:

```typescript
type TTriggerFunctionRenderProps = {
  ref: RefCallback<HTMLElement>;
  isOpen: boolean;
  popoverId: string;
  toggle: () => void;
  ariaAttributes: {
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-haspopup': 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | 'true';
  };
};
```

Usage:
```tsx
<Popup.TriggerFunction>
  {({ ref, toggle, ariaAttributes }) => (
    <button ref={ref} onClick={toggle} {...ariaAttributes}>Open</button>
  )}
</Popup.TriggerFunction>
```

#### `Popup.Content` (`PopupContent`)

The core content wrapper. Composes `Popover` + `useAnchorPosition`. Can be used standalone (outside `<Popup>`) or within the compound. Focus restoration is handled natively by the browser's Popover API.

**Props (`TPopupContentProps`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `role` | `TRoleRequiringAccessibleName \| TRoleWithImplicitName` | *required* | ARIA role. Determines focus and ARIA behavior. |
| `label` / `labelledBy` | `string` | conditional | Required for `dialog`, `alertdialog`, `menu` roles. TypeScript enforces this. |
| `children` | `ReactNode` | *required* | Content. |
| `width` | `'content' \| 'trigger'` | `'content'` | `'trigger'` matches trigger width via `anchor-size(width)`. |
| `animate` | `TAnimationPreset \| false` | — | Animation preset. |
| `arrow` | `TArrowPreset \| false` | — | Arrow preset from `@atlaskit/top-layer/arrow`. |
| `offset` | `number` | `8` | Gap between popover and trigger in px. Tooltip uses `4`. |
| `mode` | `'auto' \| 'hint' \| 'manual'` | from context | Native popover mode override. |
| `isOpen` | `boolean` | from context | Override for standalone usage. |
| `triggerRef` | `RefObject<HTMLElement \| null>` | from context | Override for standalone usage. |
| `placement` | `TPlacementOptions` | from context | Override for standalone usage. |
| `onClose` | `(args: { reason }) => void` | from context | Override for standalone usage. |
| `testId` | `string` | from context | Override. |
| `forceFallbackPositioning` | `boolean` | from context | Override. |

**Internal behavior:**
1. Reads defaults from `PopupContext` if available; props always override context
2. Browser's Popover API handles focus restoration automatically (see notes/architecture/focus.md)
3. Calls `useAnchorPosition({ anchorRef, popoverRef, placement, offset, arrow })` for positioning
4. Sets `aria-haspopup` on trigger via context's `setAriaHasPopup` (syncs role → trigger ARIA)
5. Sets `width: anchor-size(width)` on popover when `width='trigger'`
6. Forwards all props to `Popover` via the flat `TPopoverInternalProps` type

#### `Popup.Surface` (`PopupSurface`)

Optional styled wrapper providing default visual styling:

```css
background-color: token('elevation.surface.overlay');
border-radius: token('radius.small', '3px');
box-shadow: token('elevation.shadow.overlay');
overflow: auto;
```

### ARIA Flow: Content Role → Trigger `aria-haspopup`

The content's `role` prop automatically flows to the trigger's `aria-haspopup` via context:

1. `PopupContent` renders → `useLayoutEffect` calls `setAriaHasPopup(roleToAriaHasPopup({ role }))`
2. `PopupTrigger` reads `ariaHasPopup` from context → sets `aria-haspopup={ariaHasPopup}` on trigger

Mapping (`roleToAriaHasPopup`):
| Role | `aria-haspopup` value |
|------|----------------------|
| `menu` | `'menu'` |
| `listbox` | `'listbox'` |
| `tree` | `'tree'` |
| `grid` | `'grid'` |
| all others | `'dialog'` |

---

## 7. Placement System

### Placement Type

```typescript
type TPlacement = {
  axis: 'block' | 'inline';
  edge: 'start' | 'end';
  align: 'start' | 'center' | 'end';
};

type TPlacementOptions = Partial<TPlacement>;
```

All fields are optional. Defaults: `axis: 'block'`, `edge: 'end'`, `align: 'center'` (equivalent to Popper.js `'bottom'`).

### Semantic Meaning

- **`axis: 'block'`** — above/below the trigger (vertical in LTR horizontal writing mode)
- **`axis: 'inline'`** — left/right of the trigger
- **`edge: 'start'`** — above (block) or left (inline, LTR)
- **`edge: 'end'`** — below (block) or right (inline, LTR)
- **`align: 'start'`** — left-aligned (block axis, LTR) or top-aligned (inline axis)
- **`align: 'center'`** — centered on the cross-axis
- **`align: 'end'`** — right-aligned (block axis, LTR) or bottom-aligned (inline axis)

### Examples

```typescript
{}                                          // below, centered (Popper: 'bottom')
{ edge: 'start' }                          // above, centered (Popper: 'top')
{ align: 'start' }                         // below, left-aligned (Popper: 'bottom-start')
{ axis: 'inline' }                         // right, centered (Popper: 'right')
{ axis: 'inline', edge: 'start' }          // left, centered (Popper: 'left')
{ edge: 'start', align: 'end' }            // above, right-aligned (Popper: 'top-end')
```

### Legacy Placement Mapping

`fromLegacyPlacement({ legacy })` converts Popper.js strings to the new format:

| Legacy | New |
|--------|-----|
| `'top'` | `{ axis: 'block', edge: 'start', align: 'center' }` |
| `'top-start'` | `{ axis: 'block', edge: 'start', align: 'start' }` |
| `'top-end'` | `{ axis: 'block', edge: 'start', align: 'end' }` |
| `'bottom'` | `{ axis: 'block', edge: 'end', align: 'center' }` |
| `'bottom-start'` | `{ axis: 'block', edge: 'end', align: 'start' }` |
| `'bottom-end'` | `{ axis: 'block', edge: 'end', align: 'end' }` |
| `'right'` | `{ axis: 'inline', edge: 'end', align: 'center' }` |
| `'right-start'` | `{ axis: 'inline', edge: 'end', align: 'start' }` |
| `'right-end'` | `{ axis: 'inline', edge: 'end', align: 'end' }` |
| `'left'` | `{ axis: 'inline', edge: 'start', align: 'center' }` |
| `'left-start'` | `{ axis: 'inline', edge: 'start', align: 'start' }` |
| `'left-end'` | `{ axis: 'inline', edge: 'start', align: 'end' }` |
| `'auto'` / `'auto-start'` / `'auto-end'` | Maps to `block-end` variants (`position-try-fallbacks` handles flipping) |

---

## 8. Anchor Positioning

### `useAnchorPosition` Hook

The positioning primitive. No knowledge of popovers or visibility — just positions one element relative to another.

**Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `anchorRef` | `RefObject<HTMLElement \| null>` | *required* | Element to position relative to. |
| `popoverRef` | `RefObject<HTMLElement \| null>` | *required* | Element being positioned. |
| `placement` | `TPlacementOptions` | *required* | Where to place it. |
| `offset` | `number` | `8` | Gap in pixels. |
| `forceFallbackPositioning` | `boolean` | `false` | Force JS fallback. |
| `arrow` | `TArrowPreset \| null` | — | When provided, uses named `@position-try` rules for arrows. |

### CSS Anchor Positioning Path (Modern Browsers)

When `CSS.supports('anchor-name', '--a')` returns `true`:

1. **Trigger:** `anchor-name: --anchor-{id}` set via `el.style.setProperty()`
2. **Popover:** Multiple CSS properties set:
   - `position-anchor: --anchor-{id}`
   - `position-area: {computed from placement}` (e.g. `block-end`, `block-end span-inline-end`)
   - `position-try-fallbacks: {computed fallback list}`
   - `margin: 0` (reset UA default)
   - `inset: auto` (reset UA default)
   - `margin-{anchor-facing-side}: {offset}px` (gap between elements)

### Placement → `position-area` Mapping

The `placementToPositionArea()` function converts placements:

- Centered: `{ axis: 'block', edge: 'end' }` → `'block-end'`
- Aligned: `{ axis: 'block', edge: 'end', align: 'start' }` → `'block-end span-inline-end'`

**Important inversion:** CSS `span-*` keywords indicate expansion direction, which is the opposite of visual alignment. Visual `align: 'start'` → CSS `span-{cross-axis}-end` (expand toward end = start-aligned).

### `position-try-fallbacks` Generation

For **centered** placements (e.g. `block-end`), 5 fallbacks:
1. Same edge, start-aligned
2. Same edge, end-aligned
3. `flip-block` (or `flip-inline`)
4. Flipped edge, start-aligned
5. Flipped edge, end-aligned

For **aligned** placements (e.g. `block-end span-inline-end`), 7 fallbacks:
1. Same edge, opposite span direction
2. Same edge, centered
3. Same edge, same span direction
4. Flip keyword
5. Flipped edge, opposite span direction
6. Flipped edge, centered
7. Flipped edge, same span direction

### Edge Margin (Gap)

The `edgeMargin()` function determines which margin creates the gap:

| Placement | Margin |
|-----------|--------|
| `block-end` (below) | `margin-block-start` |
| `block-start` (above) | `margin-block-end` |
| `inline-end` (right) | `margin-inline-start` |
| `inline-start` (left) | `margin-inline-end` |

### JavaScript Fallback Path (Older Browsers)

When CSS Anchor Positioning is unsupported:

1. Reset: `margin: 0`, `inset: auto` on the popover
2. Measure trigger with `getBoundingClientRect()` and viewport with `window.innerWidth/Height`
3. Compute position using `computeFallbackPosition()`:
   - Calculate available space on each side
   - Place on preferred edge; flip to opposite if not enough room (use side with more space)
   - Apply alignment (start/center/end on cross-axis)
   - Clamp to viewport bounds
4. Apply `top` and `left` as inline styles
5. Re-run on `scroll` (capture, passive) and `resize` (passive) using `raf-schd` throttling
6. Clean up: remove inline styles and unbind listeners on effect cleanup

### Browser Support Detection

```typescript
const supportsAnchorPositioning = once((): boolean => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
  return CSS.supports('anchor-name', '--a');
});
```

Cached via `once()` — safe for SSR, evaluated lazily on first call.

---

## 9. Animation System

### Architecture

Animations use pure CSS with no JavaScript animation libraries:

- **Entry:** `@starting-style` (CSS Transitions Level 2) defines the initial state. When `showPopover()` / `showModal()` is called, the browser transitions from `@starting-style` values to the resting state.
- **Exit:** `transition-behavior: allow-discrete` on `display` and `overlay` properties allows transitions to play *after* `hidePopover()` / `close()`, even though `display: none` normally snaps instantly.
- **Reduced motion:** All presets include `@media (prefers-reduced-motion: reduce)` blocks that set `transition-duration: 0s`.

### Why Animation Cannot Be a Separate Hook

Exit animations require calling `hidePopover()` to START the CSS transition, then waiting for `transitionend` before considering the element hidden. The component managing `hidePopover()` must also know whether to wait for an animation. Visibility and animation are one concern — they cannot be separated without one side reaching into the other's internals.

The clean split is: `Popover` = top layer + visibility + animation. `useAnchorPosition` = positioning (separate concern).

### `TAnimationPreset` Type

```typescript
type TAnimationPreset = {
  /** Unique name — used for data-attribute targeting and dedup. */
  name: string;
  /** Raw CSS string injected into <head>. */
  css: string;
  /** Exit duration in ms — used for transitionend fallback timeout. */
  exitDurationMs: number;
  /** Optional: returns CSS custom properties per placement (for directional animations). */
  getProperties?: (args: { placement: TPlacementOptions }) => Record<string, string>;
};
```

### Popover Animation Presets

#### `slideAndFade(options?)`

Directional slide + opacity. The popover slides in from the direction opposite its placement edge.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `distance` | `number` | `4` | Slide distance in pixels. |

**CSS targeting:** `[data-ds-popover-slide-and-fade]`

**CSS custom properties:** `--ds-popover-tx` and `--ds-popover-ty` — set per placement by `getProperties()`:
- `block-end` → `tx: 0, ty: -4px` (slides down from above)
- `block-start` → `tx: 0, ty: 4px` (slides up from below)
- `inline-end` → `tx: -4px, ty: 0` (slides right from left)
- `inline-start` → `tx: 4px, ty: 0` (slides left from right)

**Timing:**
- Entry: `350ms cubic-bezier(0.15, 1, 0.3, 1)`
- Exit: `175ms cubic-bezier(0.15, 1, 0.3, 1)`
- Transitions: `opacity`, `transform`, `overlay` (allow-discrete), `display` (allow-discrete)

#### `fade()`

Simple opacity transition, no transform.

**CSS targeting:** `[data-ds-popover-fade]`

**Timing:** Same as `slideAndFade` (350ms entry, 175ms exit).

#### `scaleAndFade()`

Scale from 0.95 + opacity. Suitable for menus and dropdowns.

**CSS targeting:** `[data-ds-popover-scale-and-fade]`

**Timing:** Same as above.

### Dialog Animation Presets

#### `dialogSlideUpAndFade(options?)`

Slide up + opacity for dialogs. Includes `::backdrop` fade animation.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `distance` | `number` | `12` | Slide distance in pixels. |

**CSS targeting:** `[data-ds-dialog-slide-up-and-fade]` / `[data-ds-dialog-slide-up-and-fade][open]`

**CSS custom property:** `--ds-dialog-ty` (defaults to `12px`)

**Timing:** Same easing and durations. Backdrop transitions `background-color` from `transparent` to `var(--ds-blanket, #050C1F75)`.

**Custom distance:** When `distance !== 12`, the preset name includes the distance (e.g. `dialog-slide-up-and-fade-20`) and the CSS string has `12px` replaced globally.

#### `dialogFade()`

Simple opacity for dialogs. Includes `::backdrop` fade.

**CSS targeting:** `[data-ds-dialog-fade]`

### CSS Injection Mechanism

`ensurePresetStyles({ preset })`:
1. Checks if `preset.name` is in a global `Set<string>`
2. If not, creates a `<style>` element, sets `textContent` to `preset.css`, appends to `document.head`
3. Adds `preset.name` to the Set
4. Styles are **append-only** — never removed (bounded number of presets, removing would break other instances)

SSR-safe: returns early if `typeof document === 'undefined'`.

### `useAnimatedVisibility` Hook

The core hook shared by both `Popover` and `Dialog`. Manages children mount/unmount around CSS exit transitions.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `isOpen` | `boolean` | Whether logically open. |
| `animate` | `TAnimationPreset \| false \| undefined` | Animation preset. |
| `elementRef` | `RefObject<HTMLElement \| null>` | Element playing exit transition. |
| `onExitFinish` | `() => void` | Called after exit completes. |

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `showChildren` | `boolean` | Whether to render children. Stays `true` during exit animations. |
| `preset` | `TAnimationPreset \| null` | Resolved preset (with CSS injected), or `null`. |

**Lifecycle:**

```
isOpen: true ─────────────────── false
showChildren: true ─────────────── true ─── (exit animation) ─── false
```

**Two close paths:**

1. **Animated close** (`willAnimate === true`): `isOpen` → `false`, `showChildren` stays `true`, CSS exit transition plays, `transitionend` fires (with fallback timeout of `exitDurationMs + 50ms`), `showChildren` → `false`, `onExitFinish` fires.

2. **Non-animated close** (`willAnimate === false`): `isOpen` → `false`, `showChildren` → `false` synchronously (setState during render), `onExitFinish` fires in follow-up effect.

**Reduced motion:** When `prefersReducedMotion()` returns `true`, `willAnimate` is `false` regardless of preset — animations are completely skipped.

### `prefersReducedMotion()`

```typescript
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

**Not cached** — the preference can change at runtime. Called on every render where animation decisions are made.

---

## 10. Focus Management

### Three Concerns, Three Hooks

| Concern | Hook | Where Used | Active For |
|---------|------|------------|------------|
| **Initial focus** (move into content on open) | `useInitialFocus` | `Popover` | `dialog`, `alertdialog`, `menu`, `listbox` |
| **Focus wrapping** (Tab cycling within content) | `useFocusWrap` | `Popover`, `Dialog` | `dialog`, `alertdialog` |
| **Focus restoration** (return to trigger on close) | Native browser (Popover API) | Automatic (no custom code) | All roles (native behavior) |

### `useInitialFocus`

Moves focus into the popover when it opens, based on role:

| Role | Focus Target |
|------|-------------|
| `dialog` / `alertdialog` | Element with `[autofocus]`, or first focusable element |
| `menu` | First focusable element (typically `[role="menuitem"]`) |
| `listbox` | First `[aria-selected="true"]` option, or first focusable |
| `tooltip` / other / none | No focus movement |

**Timing:** Uses `requestAnimationFrame` to ensure the popover is fully rendered and visible in the top layer before focusing. The RAF is cancelled on cleanup.

### `useFocusWrap`

Intercepts Tab/Shift+Tab within dialog-role elements to wrap focus directly (A → B → C → A), instead of the native behavior (A → B → C → body → A).

**Implementation:**
- Binds a `keydown` listener in capture phase on the popover element
- On `Tab`: `event.preventDefault()`, calls `getNextFocusable({ container, direction: 'forwards' })`
- On `Shift+Tab`: `event.preventDefault()`, calls `getNextFocusable({ container, direction: 'backwards' })`
- Falls back to first/last focusable if current focus is not in the focusable list
- Only active for `role="dialog"` or `role="alertdialog"`

**Why override native `<dialog>` wrapping:** Native `showModal()` wraps through `<body>` at the boundary per the HTML spec. The APG Dialog Pattern requires direct wrapping. This override aligns keyboard behavior across all dialogs.

**Why NOT wrap menus:** Menus use arrow key navigation, not Tab wrapping. The APG Menu Button pattern does not require Tab trapping.

### Focus Restoration

Focus restoration is handled natively by the browser's Popover API for `popover="auto"` and `popover="hint"`. When the popover is closed (via Escape, `hidePopover()`, or other dismissal), the browser automatically restores focus to the element that triggered the show.

**Browser behavior:**
- When `showPopover()` is called, the browser captures `previouslyFocusedElement`
- When `hidePopover()` is called, the browser conditionally restores focus based on the `focusPreviousElement` parameter passed to the hide algorithm
- Escape and programmatic `hidePopover()` pass `focusPreviousElement=true` → focus is restored
- Light dismiss (click-outside) passes `focusPreviousElement=false` → focus is NOT restored (intentional per spec)

**No custom code needed:** All consumers automatically benefit from this native behavior. See notes/architecture/focus.md for full technical details.

### Focus Utility Functions

All use CSS selectors to discover focusable elements:

```typescript
const focusableSelector = [
  'a[href]:not([tabindex="-1"]):not([aria-disabled="true"]):not([aria-hidden="true"])',
  'button:not([disabled]):not([tabindex="-1"]):not([aria-disabled="true"]):not([aria-hidden="true"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]):not(...)',
  'select:not([disabled]):not(...)',
  'textarea:not([disabled]):not(...)',
  'iframe:not(...)',
  'audio[controls]:not(...)',
  'video[controls]:not(...)',
  '[contenteditable]:not([contenteditable="false"]):not(...)',
  '[tabindex]:not([disabled]):not([tabindex="-1"]):not(...)',
].join(',');
```

**Exclusions:** `disabled`, `aria-disabled="true"`, `tabindex="-1"`, `aria-hidden="true"`.

**Functions:**
- `getFirstFocusable({ container, filter? })` → first focusable element
- `getLastFocusable({ container, filter? })` → last focusable element
- `getNextFocusable({ container, direction, filter? })` → next/previous with wrapping

All accept an optional `TFocusableFilter` callback for further restriction.

---

## 11. ARIA & Type-Safe Accessibility

### Compile-Time WCAG 4.1.2 Enforcement

The type system uses discriminated unions to enforce that roles requiring an accessible name (`dialog`, `alertdialog`, `menu`) MUST have either `label` (aria-label) or `labelledBy` (aria-labelledby). This is checked at compile time — you cannot create a `<Popup.Content role="dialog">` without providing a label.

### Role Categories

```typescript
/** Roles that REQUIRE an accessible name */
type TRoleRequiringAccessibleName = 'dialog' | 'alertdialog' | 'menu';

/** Roles where the name is derived from content or provided externally */
type TRoleWithImplicitName =
  | 'tooltip' | 'listbox' | 'tree' | 'grid'
  | 'note' | 'status' | 'alert' | 'log';
```

### Discriminated Union Structure

```typescript
// For components where role is required (Popup.Content):
type TAriaRoleRequired =
  | ({ role: TRoleRequiringAccessibleName } & AccessibleNameRequired)
  | ({ role: TRoleWithImplicitName } & AccessibleNameOptional);

// For components where role is optional (Popover):
type TAriaRoleOptional =
  | ({ role: TRoleRequiringAccessibleName } & AccessibleNameRequired)
  | ({ role?: TRoleWithImplicitName } & AccessibleNameOptional);

// AccessibleNameRequired enforces at least one of label/labelledBy:
type AccessibleNameRequired =
  | { label: string; labelledBy?: string }
  | { label?: string; labelledBy: string };

type AccessibleNameOptional = {
  label?: string;
  labelledBy?: string;
};
```

### The `TPopoverForwardedProps` Workaround

When `PopupContent` destructures props from its discriminated union (`role`, `label`, `labelledBy`) and forwards them individually to `Popover`, TypeScript cannot prove the individual fields still satisfy the union. `TPopoverForwardedProps` is a flat type that accepts all role/label combinations without the union, since ARIA correctness is already enforced at the `TPopupContentProps` boundary.

### WCAG Success Criteria Covered

| WCAG SC | Level | How Addressed |
|---------|-------|---------------|
| 1.3.1 Info and Relationships | A | Semantic HTML, `aria-labelledby`, `aria-describedby` |
| 1.3.2 Meaningful Sequence | A | DOM order preserved (no portals in top-layer path) |
| 2.1.1 Keyboard | A | All interactions keyboard-accessible |
| 2.1.2 No Keyboard Trap | A | Escape always available; focus wrapping is per-role |
| 2.4.3 Focus Order | A | Focus order matches DOM; initial focus and restoration are role-based |
| 2.4.7 Focus Visible | AA | Uses `:focus-visible`; 3:1 contrast ratio |
| 4.1.2 Name, Role, Value | A | TypeScript enforces accessible names; roles set correctly; `aria-expanded` reflects state |
| 4.1.3 Status Messages | A | `aria-live` announcements via `aria-expanded` state changes |

### ARIA Attributes on Trigger (Auto-Wired)

| Attribute | Value | Source |
|-----------|-------|--------|
| `aria-expanded` | `isOpen` (boolean) | `PopupTrigger` reads from context |
| `aria-controls` | `popoverId` (string) | Auto-generated ID |
| `aria-haspopup` | Role-dependent (see mapping above) | Set by `PopupContent` via context |

---

## 12. Arrow System

### Overview

CSS-only arrows using the `clip-path: inset() margin-box` technique. Four arrow shapes exist simultaneously as `::before` (top/bottom) and `::after` (left/right) hexagonal pseudo-elements. Only the one on the anchor-facing side is visible.

### How It Works

1. `clip-path: inset(1px) margin-box` clips the popover to its margin-box
2. Margin on the anchor-facing side pushes the popover away, creating space where one arrow "escapes" the clip boundary
3. `@position-try` rules change both `position-area` and `margin` when flipping, ensuring the correct arrow is always shown

### `TArrowPreset` Type

```typescript
type TArrowPreset = {
  name: string;
  css: string;
  getTryFallbacks: (args: { placement: TPlacementOptions }) => string;
};
```

### `arrow()` Factory

```typescript
import { arrow } from '@atlaskit/top-layer/arrow';

const myArrow = arrow();
<Popup.Content arrow={myArrow} />
```

Created via `once()` — returns the same object on every call (singleton).

### CSS Variables

- `--ds-arrow-size` — Arrow size in pixels (defaults to `8px`). Set by `useAnchorPosition` to match the `offset` value.
- `--ds-arrow-offset` — Clip inset (defaults to `1px`).

### Named `@position-try` Rules

12 named rules cover all possible position-area values:

| Rule Name | Position Area | Margin Direction |
|-----------|---------------|-----------------|
| `--ds-arrow-block-start` | `block-start` | `margin-block-end` |
| `--ds-arrow-block-end` | `block-end` | `margin-block-start` |
| `--ds-arrow-inline-start` | `inline-start` | `margin-inline-end` |
| `--ds-arrow-inline-end` | `inline-end` | `margin-inline-start` |
| `--ds-arrow-block-start-span-inline-start` | `block-start span-inline-start` | `margin-block-end` |
| `--ds-arrow-block-start-span-inline-end` | `block-start span-inline-end` | `margin-block-end` |
| `--ds-arrow-block-end-span-inline-start` | `block-end span-inline-start` | `margin-block-start` |
| `--ds-arrow-block-end-span-inline-end` | `block-end span-inline-end` | `margin-block-start` |
| `--ds-arrow-inline-start-span-block-start` | `inline-start span-block-start` | `margin-inline-end` |
| `--ds-arrow-inline-start-span-block-end` | `inline-start span-block-end` | `margin-inline-end` |
| `--ds-arrow-inline-end-span-block-start` | `inline-end span-block-start` | `margin-inline-start` |
| `--ds-arrow-inline-end-span-block-end` | `inline-end span-block-end` | `margin-inline-start` |

### Why Named Rules Instead of `flip-block`/`flip-inline`

Built-in CSS keywords like `flip-block` only flip `position-area` — they don't update the margin direction. For arrows, both must change together so the correct arrow appears on the anchor-facing side.

### Constraints

- `box-shadow` must be `none` (interferes with `clip-path: inset() margin-box`)
- `::before` and `::after` pseudo-elements are consumed by the arrows
- Arrow pseudo-elements use `background: inherit` from the popover element
- Only works with CSS Anchor Positioning — no arrow in the JS fallback

---

## 13. Light Dismiss

### `popover="auto"` (Native)

The browser handles light dismiss natively:
- **Escape:** Closes the topmost `popover="auto"` element
- **Click outside:** Closes `popover="auto"` elements not in the click target's ancestor chain
- **Stacking:** Opening a new `popover="auto"` closes the previous one (unless nested)
- **Nesting:** Popovers are automatically nested when one `popover="auto"` contains or is triggered by another

The `Popover` component detects the close reason via a capture-phase keydown listener (Escape) and the native `toggle` event.

### `popover="hint"` (Ephemeral)

For tooltips and ephemeral UI. Does NOT close other `auto` popovers when opened. Falls back to `auto` when unsupported.

### `popover="manual"` (No Native Dismiss)

No native light dismiss at all. Use `useSimpleLightDismiss` for basic Escape + click-outside behavior.

### `useSimpleLightDismiss` Hook

Provides standalone light-dismiss for `popover="manual"` elements:

```typescript
useSimpleLightDismiss({
  popoverRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: (args: { reason: TPopoverCloseReason }) => void,
});
```

**Behavior:**
- Binds `keydown` on `document` for Escape
- Binds `click` on `document` for click-outside (checks `el.contains(event.target)`)
- Listeners only active when `isOpen` is `true`
- Uses stable ref for `onClose` to avoid re-binding on renders

**Important limitation:** No stacking awareness. If multiple manual popovers are open, a single Escape or outside click dismisses ALL of them simultaneously. For stacked dismiss, use `popover="auto"` instead.

---

## 14. Scroll Lock

### `DialogScrollLock` Component

Sets `overflow: hidden` on `document.body` while mounted, restoring on unmount.

```tsx
import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';

// Inside modal-dialog:
{isOpen && <DialogScrollLock />}
```

**Note:** Native `<dialog>.showModal()` makes background content `inert`, which prevents interaction but does NOT prevent scrolling. `DialogScrollLock` adds the scroll prevention.

---

## 15. Legacy Migration Utilities

### `createCloseEvent({ reason })` — Dialog

Converts `TDialogCloseReason` to a synthetic DOM event for legacy APIs that expect `KeyboardEvent` or `MouseEvent`:

```typescript
import { createCloseEvent } from '@atlaskit/top-layer/create-close-event';

// 'escape' → new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
// 'overlay-click' → new MouseEvent('click', { bubbles: true, cancelable: true })
```

**Use case:** Bridging `@atlaskit/modal-dialog`'s `onClose(event, analyticsEvent)` to the Dialog primitive's `onClose({ reason })`.

### `createPopoverCloseEvent({ reason })` — Popover

Converts `TPopoverCloseReason` to a synthetic DOM event:

```typescript
import { createPopoverCloseEvent } from '@atlaskit/top-layer/create-close-event';

// 'escape' → new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
// 'light-dismiss' → new MouseEvent('click', { bubbles: true, cancelable: true })
// fallback → new Event('close')
```

**Use case:** Bridging `@atlaskit/inline-dialog`'s `onClose(event)` to the Popover primitive's `onClose({ reason })`.

### `fromLegacyPlacement({ legacy })` — Placement

Converts Popper.js string placements (`'bottom-start'`, `'top-end'`, etc.) to the new `TPlacementOptions` format. See [Placement System](#7-placement-system) for the full mapping table.

### Feature Flag Pattern

All migrations use the `platform-dst-top-layer` feature flag:

```tsx
import { fg } from '@atlaskit/platform-feature-flags';

// In the main component:
if (fg('platform-dst-top-layer')) {
  return <ComponentTopLayer {...props} />;
}
// ... legacy code continues
```

Each migrated package adds to `package.json`:
```json
{
  "platform-feature-flags": {
    "platform-dst-top-layer": { "type": "boolean" }
  }
}
```

---

## 16. Internal Utilities

### `combine(...cleanupFns)`

Merges multiple cleanup functions into one:

```typescript
function combine(...fns: Array<() => void>): () => void {
  return () => { fns.forEach(fn => fn()); };
}
```

Used extensively in `useAnchorPosition` to compose multiple `setStyle` cleanups and event unbinders.

### `setStyle({ el, styles })`

Applies inline styles via `el.style.setProperty()` (supports hyphenated CSS properties like `position-area` that don't have camelCase mappings). Returns a cleanup function that calls `removeProperty` for each applied style.

```typescript
const cleanup = setStyle({
  el: popover,
  styles: [
    { property: 'position-anchor', value: '--my-anchor' },
    { property: 'position-area', value: 'block-end' },
  ],
});
// Later: cleanup() removes both properties
```

### `usePresetStyles({ preset })`

Hook that normalizes the `animate` / `arrow` prop and injects the preset's CSS via `ensurePresetStyles`. Returns the resolved preset or `null` when the input is falsy.

### `getPlacement({ placement })`

Resolves partial `TPlacementOptions` to fully-specified `TPlacement`:

```typescript
getPlacement({ placement: {} })
// → { axis: 'block', edge: 'end', align: 'center' }

getPlacement({ placement: { align: 'start' } })
// → { axis: 'block', edge: 'end', align: 'start' }
```

---

## 17. Testing Infrastructure

### Unit Tests (JSDOM)

JSDOM does not implement the Popover API or `HTMLDialogElement.showModal()`. Tests require mocks:

- `showPopover()`, `hidePopover()`, `togglePopover()` — Mock on `HTMLElement.prototype`
- `showModal()`, `close()` — Mock on `HTMLElement.prototype`
- `popover` property — Mock property descriptor
- `ToggleEvent` — Custom mock class

### Playwright Tests (Browser)

Real browser tests for:
- Animation lifecycle (entry/exit timing, reduced motion)
- Click-outside passthrough
- Dialog scroll lock
- Dialog behavior (Escape, backdrop click)
- Focus restore / return ref
- Form-in-popup behavior
- Initial focus (role-based)
- Keyboard-mouse interleaving
- Nested layers
- Popover-dialog focus trap
- Positioning (CSS and JS fallback)
- Rapid toggle
- Simple light dismiss

### VR Tests (Visual Regression)

Snapshot tests for:
- Basic dialog
- Animated dialog
- Dialog width variants
- Nested popovers / popups
- Popover positions (all 12 placements)
- Popover surface variants
- CSS fallback positions (flip-block, flip-inline, flip-both)
- JS fallback positions

### Test File Naming Conventions

- Unit: `__tests__/unit/{feature}.tsx`
- Playwright: `__tests__/playwright/{feature}.spec.tsx`
- VR: `__tests__/vr-tests/{feature}.vr.tsx`
- Examples (test fixtures): `examples/{number}-testing-{feature}.tsx`

---

## 18. Browser Compatibility

| Feature | Support (Jira users) | Fallback Strategy |
|---------|---------------------|-------------------|
| `popover` attribute | ~99.8% | None needed (very high support) |
| `<dialog>.showModal()` | ~99.8% | None (would need custom modal) |
| CSS Anchor Positioning | ~94% | JS repositioning via `computeFallbackPosition` |
| `@starting-style` | ~95% | Instant appearance (no animation) |
| `@position-try` | ~94% | JS fallback handles flipping |
| `transition-behavior: allow-discrete` | ~95% | Instant disappearance (no exit animation) |
| `popover="hint"` | Limited (new) | Automatic fallback to `popover="auto"` |
| `anchor-size()` (for `width: 'trigger'`) | ~94% | Falls back to content-width sizing |

---

## 19. What You Wouldn't Need Without Legacy Support

If building green-field with no need to support existing `@atlaskit/popup`, `@atlaskit/modal-dialog`, `@atlaskit/tooltip`, `@atlaskit/dropdown-menu`, etc.:

### Would Remove

1. **`createCloseEvent` / `createPopoverCloseEvent`** — These exist solely to bridge the structured `{ reason }` callback to legacy APIs that expect raw DOM events (`KeyboardEvent`, `MouseEvent`). A green-field API would only use `{ reason }`.

2. **`fromLegacyPlacement` / `placementMapping`** — The entire `placement-map` entry point exists to convert Popper.js string placements. A green-field API would only use `TPlacementOptions` objects.

3. **`TPopoverForwardedProps` flat type** — This exists because `PopupContent` needs to forward discriminated union props to `Popover` and TypeScript can't re-prove the union after destructuring. A simpler architecture could avoid this by having `Popover` accept the discriminated union directly (or not having the split at all).

4. **`onExitFinish` callback** — Primarily exists so `@atlaskit/modal-dialog` can fire its legacy `onCloseComplete` callback. A green-field API might not need this — consumers would observe `isOpen` state changes instead.

5. **`shouldHideBackdrop` prop on Dialog** — Exists for stacked dialogs in `@atlaskit/modal-dialog` where only the front dialog shows a backdrop. A green-field API might handle this differently (e.g. a `<DialogStack>` that manages backdrop visibility).

6. **JavaScript positioning fallback** — The entire `anchor-positioning-fallback.tsx` and the JS branch in `useAnchorPosition` exist for browsers without CSS Anchor Positioning. With ~94% support and growing, a green-field product might accept content appearing at the default position in older browsers.

7. **`PopupSurface`** — Exists to provide the same visual treatment as legacy `@atlaskit/popup`. A green-field API might let consumers style content directly with design tokens.

8. **`width: 'trigger'` prop** — Maps to CSS `anchor-size(width)`. Exists because `@atlaskit/popup`'s `shouldFitContainer` prop needed a replacement. A simpler API might omit this.

9. **`mode` on `TPopupProps`** — The compound forwards `mode` from root to content via context. Without legacy components needing `manual` mode (like `@atlaskit/flag`), the compound might default to `auto` only.

10. **`Popup.Trigger` (cloneElement version)** — `cloneElement` is a React anti-pattern. `Popup.TriggerFunction` is the better API. The cloneElement version exists for easier migration from legacy components that pass trigger elements as children.

### Would Simplify

1. **Role types** — `TRoleWithImplicitName` includes roles like `note`, `status`, `alert`, `log` that were added for future-proofing and edge cases in legacy migrations. A focused API might start with just `dialog`, `menu`, `listbox`, `tooltip`.

2. **`PopupContent` context fallbacks** — Every prop on `PopupContent` has a "from context OR from prop" resolution. Without standalone usage (tooltip, spotlight), this complexity disappears — content always reads from context.

3. **`forceFallbackPositioning`** — Testing prop that forces JS positioning. Useful for testing but not needed in production.

4. **Feature flag infrastructure** — All the `fg('platform-dst-top-layer')` gates, dual code paths, and `*-top-layer.tsx` companion files would not exist. The package would be the only implementation.

### Would Keep As-Is

1. **`useAnimatedVisibility`** — Core animation lifecycle is fundamental regardless of legacy.
2. **`useFocusWrap` / `useInitialFocus`** — WCAG compliance is not legacy-specific. Focus restoration is handled natively by the browser's Popover API.
3. **`Popover` / `Dialog` split** — Popovers and dialogs are fundamentally different browser primitives.
4. **CSS Anchor Positioning** — The positioning approach is modern and correct.
5. **Animation presets** — CSS-based animations are the right approach.
6. **`ensurePresetStyles`** — Global CSS injection for presets is necessary regardless.
7. **ARIA discriminated unions** — Compile-time accessibility enforcement is valuable for any API.
