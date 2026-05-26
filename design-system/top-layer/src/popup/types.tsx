import { type ReactElement, type ReactNode, type Ref, type RefObject } from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';

import { type TAnimationPreset } from '../animations/types';
import { type TPlacementOptions } from '../internal/resolve-placement';
import {
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';
import { type TPopoverCloseReason, type TWidthFromAnchorMode } from '../popover/types';

/**
 * Describes where to position a popover relative to its trigger. All fields
 * are optional. The default `{}` means "below the trigger, centered, with a
 * `space.100` token gap" (equivalent to Popper.js `'bottom'`).
 *
 * - `axis`: `'block'` (above/below, default) or `'inline'` (left/right)
 * - `edge`: `'start'` or `'end'` (default)
 * - `align`: `'start'`, `'center'` (default), or `'end'`
 * - `offset.gap`: distance from the trigger toward the popover (default `token('space.100', '8px')`, accepts number or CSS string)
 * - `offset.crossAxisShift.value`: cross-axis shift (default `0`)
 * - `offset.crossAxisShift.direction`: `'forwards'` (default) or `'backwards'`
 *
 * @example
 * ```ts
 * placement={{ align: 'start' }} // Below trigger, aligned to start
 * placement={{ axis: 'inline' }} // Right of trigger, centered
 * placement={{ offset: { gap: 4 } }} // Tooltip-like gap
 * placement={{ offset: { crossAxisShift: { value: 4, direction: 'backwards' } } }}
 * ```
 */
export { type TPlacementOptions } from '../internal/resolve-placement';

/**
 * Props shared across all `Popup` modes.
 *
 * Mode-specific behaviour for `onClose` is encoded in the discriminated
 * union below: `'auto'` and `'hint'` modes accept an `onClose` handler
 * (called on light dismiss); `'manual'` mode forbids it (no light dismiss
 * exists, so a handler would be dead code).
 */
type TPopupBaseProps = {
	/**
	 * Position of the popup relative to the trigger. Only the Popup compound uses
	 * placement; the low-level Popover primitive does not.
	 *
	 * Defaults to `{}` which means "below the trigger, centered, with a
	 * `space.100` token gap".
	 */
	placement?: TPlacementOptions;
	/**
	 * Must contain `Popup.Trigger` and `Popup.Content`.
	 */
	children: ReactNode;
	/**
	 * Called when the popup's open state changes.
	 *
	 * Receives the new open state and a reference to the popover element,
	 * which is useful for focus management (e.g. focusing the first interactive
	 * child on open via `getFirstFocusable` from `@atlaskit/top-layer/focus`).
	 *
	 * @example
	 * ```tsx
	 * <Popup
	 *   onOpenChange={({ isOpen, element }) => {
	 *     if (isOpen) {
	 *       getFirstFocusable({ container: element })?.focus();
	 *     }
	 *   }}
	 * />
	 * ```
	 */
	onOpenChange?: (args: { isOpen: boolean; element: HTMLDivElement }) => void;
	/**
	 * Test ID applied to the popup content element.
	 */
	testId?: string;
	/**
	 * Forces the JavaScript positioning fallback even when the browser
	 * supports CSS Anchor Positioning. Useful for testing fallback
	 * behavior in any environment, including production.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention -- testing prop
	forceFallbackPositioning?: boolean;
};

/**
 * Props for the `Popup` compound.
 *
 * Discriminated on `mode`:
 * - `'auto'` (default) and `'hint'`: light dismiss is enabled; `onClose` is
 *   optional and is called when the browser dismisses the popover.
 * - `'manual'`: no light dismiss; `onClose` is `never` since the consumer
 *   owns show/hide entirely and there is no dismiss event to handle.
 */
export type TPopupProps = TPopupBaseProps &
	(
		| {
				/**
				 * Native popover attribute value. Default is `'auto'`.
				 *
				 * - `'auto'`: light dismiss (Escape, click-outside). Only one
				 *   `popover="auto"` can be open at a time; opening another closes
				 *   the previous.
				 * - `'hint'`: allows ephemeral UI (e.g. tooltips) to open without
				 *   closing other `popover="auto"` popovers. Falls back to
				 *   `popover="auto"` when unsupported.
				 */
				mode?: 'auto' | 'hint';
				/**
				 * Called when the popup is dismissed via light dismiss.
				 *
				 * The `reason` field indicates how the dismiss occurred:
				 * - `'escape'`: the user pressed the Escape key.
				 * - `'light-dismiss'`: the user clicked outside (or another auto-dismiss).
				 */
				onClose?: (args: { reason: TPopoverCloseReason }) => void;
		  }
		| {
				/**
				 * `'manual'`: no light dismiss; the consumer controls show/hide
				 * entirely. Escape and click-outside do not close the popover.
				 */
				mode: 'manual';
				/**
				 * Manual mode has no dismiss event, so `onClose` is forbidden.
				 * The consumer owns show/hide via their own state.
				 */
				onClose?: never;
		  }
	);

export type TPopupTriggerProps = {
	/**
	 * The trigger element. Must accept a ref.
	 */
	children: ReactElement;
};

/**
 * All ARIA roles supported for popover content.
 * Add new roles to the appropriate category in `internal/role-types.tsx` as needed.
 */
export type TPopupRole = TRoleRequiringAccessibleName | TRoleWithImplicitName;

/**
 * Props shared across all popover role variants.
 *
 * When inside the `<Popup>` compound component, `isOpen` is provided automatically
 * via context (the browser manages visibility through `togglePopover()`).
 *
 * When used standalone (e.g. tooltip, spotlight), the consumer must provide `isOpen`
 * to control visibility. If `animate` is provided, `isOpen` is required at the type
 * level. This ensures exit animations always have a controlled lifecycle.
 */
type TPopupContentBaseProps = {
	children: ReactNode;
	/**
	 * Ref to the underlying `<div popover>` element.
	 */
	ref?: Ref<HTMLDivElement>;
	/**
	 * HTML `id` attribute for the popover element.
	 *
	 * Provide this when using `Popup.Content` standalone (outside the
	 * `<Popup>` compound). The consumer is responsible for wiring
	 * `aria-controls` on their own trigger to this same id. Inside the
	 * `<Popup>` compound, the id flows from context - passing it here is
	 * unnecessary.
	 */
	id?: string;
	/**
	 * Controls the width of the popover relative to its anchor element.
	 *
	 * - `'none'` (default): popover sizes to its content, ignoring the anchor width.
	 * - `'match-anchor'`: popover matches the anchor element's width exactly
	 *   via CSS `anchor-size(width)`. Falls back to a one-off measurement
	 *   of `anchorRef.current.offsetWidth` when CSS Anchor Positioning
	 *   is not supported.
	 * - `'min-anchor'`: popover is at least as wide as the anchor, but
	 *   can grow wider if content requires it. Uses `min-width: anchor-size(width)`.
	 *   Falls back to a one-off measurement of the anchor's width.
	 */
	widthFromAnchor?: TWidthFromAnchorMode;
	/**
	 * Applies additional CSS styles to the popover root element using
	 * design-system-safe xcss.
	 *
	 * @example
	 * ```tsx
	 * const styles = cssMap({ surface: { backgroundColor: token('elevation.surface.overlay') } });
	 * <Popup.Content xcss={styles.surface} ... />
	 * ```
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;

	// ── Standalone props ──
	// Used when PopupContent is rendered outside the <Popup> compound
	// component (e.g. tooltip, which has its own trigger lifecycle).
	// When inside <Popup>, these are supplied by context automatically.

	/**
	 * Ref to the trigger element for anchor positioning.
	 * When absent, anchor positioning is skipped (consumer handles positioning).
	 */
	triggerRef?: RefObject<HTMLElement | null>;
	/**
	 * Position of the popover relative to the trigger.
	 */
	placement?: TPlacementOptions;
	/**
	 * Called when the popover is dismissed via light dismiss (Escape, click outside).
	 * When an animation preset is provided, `onClose` is called after the exit
	 * animation completes.
	 *
	 * The `reason` field indicates how the dismiss occurred:
	 * - `'escape'`: the user pressed the Escape key.
	 * - `'light-dismiss'`: the user clicked outside (or another auto-dismiss).
	 */
	onClose?: (args: { reason: TPopoverCloseReason }) => void;
	/**
	 * Test ID applied to the popover content element.
	 */
	testId?: string;
	/**
	 * Forces the JavaScript positioning fallback even when the browser
	 * supports CSS Anchor Positioning. Useful for testing fallback
	 * behavior in any environment, including production.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention -- testing prop
	forceFallbackPositioning?: boolean;
	/**
	 * Native popover attribute value. Default is `'auto'`.
	 *
	 * - `'auto'`: light dismiss (Escape, click-outside). Only one `popover="auto"` can be open at a time; opening another closes the previous.
	 * - `'hint'`: allows ephemeral UI (e.g. tooltips) to open without closing other `popover="auto"` popovers. When the browser does not support `popover="hint"`, the component automatically falls back to `popover="auto"`; this fallback is transparent to the consumer.
	 * - `'manual'`: no light dismiss; the consumer controls show/hide entirely (e.g. Flag). Escape and click-outside do not close the popover.
	 */
	mode?: 'auto' | 'hint' | 'manual';
	/**
	 * Animation preset for entry/exit transitions.
	 *
	 * - `TAnimationPreset`: a preset object (e.g. from `@atlaskit/top-layer/animations`).
	 *   Entry animation plays via `@starting-style`, exit via `allow-discrete`.
	 * - `undefined` / `false`: no animation.
	 *
	 * When used standalone (outside `<Popup>` compound), pair with `isOpen` for exit
	 * animations to work correctly. Inside the compound, `isOpen` is provided via context.
	 *
	 * Animations use `@starting-style` and `allow-discrete` for progressive
	 * enhancement: browsers without support show/hide instantly.
	 */
	animate?: false | TAnimationPreset;
	/**
	 * Whether the popover is open.
	 *
	 * Controls `showPopover()` / `hidePopover()` on the underlying element.
	 * Inside the `<Popup>` compound, `isOpen` is provided automatically via context
	 * (the browser manages state through `togglePopover()`).
	 *
	 * For standalone usage, provide `isOpen` to control visibility, especially
	 * when `animate` is set, so the exit animation lifecycle works correctly.
	 *
	 * @example
	 * ```tsx
	 * <Popup.Content
	 *   role="tooltip"
	 *   isOpen={isVisible}
	 *   animate={slideAndFade()}
	 * >
	 *   Tooltip content
	 * </Popup.Content>
	 * ```
	 */
	isOpen?: boolean;
	/**
	 * Called after the entry animation completes (or immediately on open when
	 * there is no animation). Use this for lifecycle coordination that must
	 * happen after the popup has fully animated in.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the exit animation completes (or immediately on close when
	 * there is no animation). Use this for lifecycle coordination that must
	 * happen after the popup has fully animated out.
	 */
	onExitFinish?: () => void;
};

/**
 * Popup content props.
 *
 * Roles like `'dialog'`, `'alertdialog'`, and `'menu'` require an accessible
 * name. Provide either `label` (aria-label) or `labelledBy` (aria-labelledby).
 * TypeScript enforces this at compile time.
 */
export type TPopupContentProps = TPopupContentBaseProps &
	(
		| ({
				/**
				 * ARIA role for the popover. Roles that are ARIA landmarks (`dialog`,
				 * `alertdialog`, `menu`) require an accessible name.
				 */
				role: TRoleRequiringAccessibleName;
		  } & (
				| {
						/**
						 * Accessible name via `aria-label`.
						 */
						label: string;
						/**
						 * Accessible name via `aria-labelledby`.
						 */
						// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
						labelledBy?: string;
				  }
				| {
						/**
						 * Accessible name via `aria-label`.
						 */
						label?: string;
						/**
						 * Accessible name via `aria-labelledby`.
						 */
						// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
						labelledBy: string;
				  }
		  ))
		| {
				/**
				 * ARIA role for the popover.
				 */
				role: TRoleWithImplicitName;
				/**
				 * Accessible name via `aria-label`.
				 */
				label?: string;
				/**
				 * Accessible name via `aria-labelledby`.
				 */
				// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
				labelledBy?: string;
		  }
	);

export type TPopupSurfaceProps = {
	children: ReactNode;
};
