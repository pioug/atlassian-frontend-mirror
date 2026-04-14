import { type ReactNode } from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';

import { type TAnimationPreset } from '../animations/types';
import {
	type TAriaRoleOptional,
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';
import { type TPlacementOptions } from '../popup/types';

/**
 * The reason a popover was dismissed via light dismiss.
 *
 * - `'escape'`: The user pressed the Escape key.
 * - `'light-dismiss'`: The user clicked outside the popover (or the browser
 *   dismissed it for another auto-mode reason).
 */
export type TPopoverCloseReason = 'escape' | 'light-dismiss';

/**
 * Flat (non-discriminated) props accepted by the Popover component internally.
 *
 * TypeScript limitation: when PopupContent destructures props from a
 * discriminated union (role, label, labelledBy) and re-passes them individually
 * to Popover, TypeScript cannot prove the individual fields still satisfy the
 * union constraint. This flat type accepts all role/label combinations without
 * the union, since ARIA correctness is enforced at the TPopupContentProps
 * boundary where consumers interact.
 */
export type TPopoverForwardedProps = TPopoverBaseProps & {
	mode?: 'auto' | 'hint' | 'manual';
	onClose?: (args: { reason: TPopoverCloseReason }) => void;
	role?: TRoleRequiringAccessibleName | TRoleWithImplicitName;
	label?: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
	labelledBy?: string;
};

/**
 * Alias for TPopoverForwardedProps.
 *
 * Used internally by PopupContent to forward props to Popover without
 * re-proving the discriminated union at each call site.
 */
export type TPopoverInternalProps = TPopoverForwardedProps;

type TPopoverBaseProps = {
	children: ReactNode;
	/**
	 * Additional CSS styles applied to the popover root element.
	 * Use to set `backgroundColor` so arrow pseudo-elements (which use
	 * `background: inherit`) match the popup surface colour.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * Animation preset for entry/exit transitions.
	 *
	 * Animations use `@starting-style` and `allow-discrete` for progressive
	 * enhancement: browsers without support show/hide instantly.
	 */
	animate?: false | TAnimationPreset;
	/**
	 * Test ID applied to the popover element.
	 */
	testId?: string;
	/**
	 * HTML `id` attribute for the popover element. When omitted, a unique ID
	 * is generated automatically. The `<Popup>` compound passes its context ID
	 * so that `Popup.Trigger` can reference it via `aria-controls` / `popovertarget`.
	 */
	id?: string;
	/**
	 * Whether the popover is open.
	 *
	 * - **`true`:** show the popover (calls `showPopover()`, entry animation plays via `@starting-style`).
	 * - **`false`:** hide the popover. When an `animate` preset is provided, the exit
	 *   animation plays (via `allow-discrete`) before the popover becomes logically closed.
	 *   Otherwise hides instantly.
	 *
	 * The element stays mounted in the DOM at all times — the consumer does not
	 * conditionally render it. Visibility is driven by this prop.
	 *
	 * **Important:** For `mode="auto"` popovers, the browser can dismiss the popover
	 * via light dismiss (Escape, click outside) independently of this prop. When that
	 * happens, `onClose` is called — the consumer should respond by setting `isOpen`
	 * to `false`. If `isOpen` remains `true` after a browser dismiss, the DOM and
	 * React state will be out of sync (the popover will be hidden despite `isOpen={true}`).
	 */
	isOpen: boolean;
	/**
	 * Called when the popover's open state changes via browser toggle events.
	 *
	 * Receives the new open state and a reference to the popover element,
	 * which is useful for focus management (e.g. focusing the first interactive
	 * child on open via `getFirstFocusable` from `@atlaskit/top-layer/focus`).
	 *
	 * @example
	 * ```tsx
	 * <Popover
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
	 * Placement hint for directional animations (e.g. `slideAndFade`).
	 *
	 * When `animate` is provided, the preset's `getProperties(placement)` is
	 * called to set CSS custom properties (like `--ds-popover-tx`, `--ds-popover-ty`)
	 * that control the slide direction. Has no effect without `animate`.
	 *
	 * This does NOT control positioning — use `useAnchorPosition` for that.
	 */
	placement?: TPlacementOptions;
	/**
	 * Called after the exit animation completes (or immediately on close when
	 * there is no animation or reduced motion is active).
	 *
	 * Use this for external lifecycle coordination — e.g. notifying a manager
	 * that the hide sequence is finished, or firing an `onCloseComplete` callback.
	 */
	onExitFinish?: () => void;
};

/**
 * Unopinionated top-layer primitive.
 *
 * `Popover` manages only top-layer visibility and animation — it has no
 * knowledge of positioning. For anchor positioning, compose with the
 * `useAnchorPosition` hook separately.
 *
 * Use `Popover` directly for custom trigger lifecycles (hover, timers,
 * external state) or trigger-less UI (flags, toasts). For the common
 * button-opens-content pattern, use the `Popup` compound instead.
 *
 * Dismiss behavior:
 * - `'auto'` (default): Escape to close, click-outside to close, focus restoration,
 *   automatic nesting, mutual exclusivity.
 * - `'hint'`: ephemeral UI (e.g. tooltips) that doesn't close other `auto` popovers.
 *   Falls back to `'auto'` in browsers without `popover="hint"` support.
 * - `'manual'`: no light dismiss. Consumer controls show/hide entirely. Only
 *   appropriate for persistent UI (e.g. flags, banners).
 */
export type TPopoverProps = TPopoverBaseProps &
	TAriaRoleOptional &
	(
		| {
				mode?: 'auto' | 'hint';
				/**
				 * Called when the popover is dismissed via light dismiss
				 * (Escape, click outside).
				 *
				 * The `reason` field indicates how the dismiss occurred:
				 * - `'escape'`: the user pressed the Escape key.
				 * - `'light-dismiss'`: the user clicked outside (or another auto-dismiss).
				 */
				onClose?: (args: { reason: TPopoverCloseReason }) => void;
		  }
		| {
				mode: 'manual';
				onClose?: never;
		  }
	);
