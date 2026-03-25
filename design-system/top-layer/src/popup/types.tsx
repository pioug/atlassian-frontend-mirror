import { type ReactElement, type ReactNode, type Ref, type RefObject } from 'react';

import { type TAnimationPreset } from '../animations/types';
import { type TArrowPreset } from '../arrow/types';
import { type TPlacement } from '../internal/resolve-placement';
import { type TRoleRequiringAccessibleName, type TRoleWithImplicitName } from '../internal/role-types';
import { type TPopoverCloseReason } from '../popover/types';

/**
 * Describes where to position a popover relative to its trigger.
 *
 * - `axis` — which axis the popover appears along (`'block'` = above/below, `'inline'` = left/right).
 *   Defaults to `'block'`.
 * - `edge` — which end of the axis (`'start'` = above/left in LTR, `'end'` = below/right in LTR).
 *   Defaults to `'end'`.
 * - `align` — where to align on the cross-axis (`'start'`, `'center'`, `'end'`).
 *   Defaults to `'center'`. Can be written explicitly for clarity.
 *
 * All fields are optional. The default `{}` means "below the trigger, centered"
 * (equivalent to Popper.js `'bottom'`).
 *
 * @example
 * ```ts
 * // Below trigger, centered (all defaults)
 * placement={{}}
 * placement={{ axis: 'block', edge: 'end', align: 'center' }}
 *
 * // Below trigger, aligned to the start (left in LTR)
 * placement={{ align: 'start' }}
 *
 * // Above trigger, aligned to the end (right in LTR)
 * placement={{ edge: 'start', align: 'end' }}
 *
 * // Right of trigger, centered
 * placement={{ axis: 'inline' }}
 * ```
 */
export type TPlacementOptions = Partial<TPlacement>;

export type TPopupProps = {
	/**
	 * Position of the popup relative to the trigger. Only the Popup compound uses
	 * placement; the low-level Popover primitive does not.
	 */
	placement: TPlacementOptions;
	/**
	 * Must contain `Popup.Trigger` and `Popup.Content`.
	 */
	children: ReactNode;
	/**
	 * Called when the popup is dismissed via light dismiss.
	 *
	 * The `reason` field indicates how the dismiss occurred:
	 * - `'escape'`: the user pressed the Escape key.
	 * - `'light-dismiss'`: the user clicked outside (or another auto-dismiss).
	 */
	onClose: (args: { reason: TPopoverCloseReason }) => void;
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
	 * Native popover attribute value. Default is `'auto'`.
	 *
	 * - `'auto'`: light dismiss (Escape, click-outside). Only one `popover="auto"` can be open at a time; opening another closes the previous.
	 * - `'hint'`: allows ephemeral UI (e.g. tooltips) to open without closing other `popover="auto"` popovers. Falls back to `popover="auto"` when unsupported.
	 * - `'manual'`: no light dismiss; the consumer controls show/hide entirely. Escape and click-outside do not close the popover.
	 */
	mode?: 'auto' | 'hint' | 'manual';
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
 * level — this ensures exit animations always have a controlled lifecycle.
 */
type TPopupContentBaseProps = {
	children: ReactNode;
	/**
	 * Ref to the underlying `<div popover>` element.
	 */
	ref?: Ref<HTMLDivElement>;
	/**
	 * Controls the width of the popover.
	 *
	 * - `'content'` (default): popover sizes to its content.
	 * - `'trigger'`: popover matches the trigger element's width exactly
	 *   via CSS `anchor-size(width)`. Falls back to a one-off measurement
	 *   of `triggerRef.current.offsetWidth` when CSS Anchor Positioning
	 *   is not supported.
	 * - `'min-trigger'`: popover is at least as wide as the trigger, but
	 *   can grow wider if content requires it. Uses `min-width: anchor-size(width)`.
	 *   Falls back to a one-off measurement of the trigger's width.
	 */
	width?: 'content' | 'trigger' | 'min-trigger';

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
	 * Gap between the popover and its trigger, in pixels.
	 * Defaults to 8 (design token `space.100`). Tooltip uses 4.
	 */
	offset?: number;
	/**
	 * Forces the JavaScript positioning fallback even when the browser
	 * supports CSS Anchor Positioning. Useful for testing fallback
	 * behavior in any environment, including production.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention -- testing prop
	forceFallbackPositioning?: boolean;
	/**
	 * Arrow preset from `@atlaskit/top-layer/arrow`.
	 *
	 * When provided, renders CSS arrows that automatically flip when the
	 * popover flips via `@position-try` fallbacks. The arrows inherit
	 * their background color from the popover element.
	 *
	 * @example
	 * ```tsx
	 * import { arrow } from '@atlaskit/top-layer/arrow';
	 *
	 * const myArrow = arrow();
	 * <Popup.Content arrow={myArrow} />
	 * ```
	 *
	 * Constraints:
	 * - `box-shadow` is disabled on the popover (incompatible with the
	 *   `clip-path: inset() margin-box` technique)
	 * - `::before` and `::after` pseudo-elements are consumed by the arrows
	 * - Only works with CSS Anchor Positioning; no arrow in the JS fallback
	 */
	arrow?: false | TArrowPreset;
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
	 * For standalone usage, provide `isOpen` to control visibility — especially
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
