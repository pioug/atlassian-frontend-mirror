import { type ReactNode } from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';

import { type TPlacementOptions } from '../internal/resolve-placement';
import {
	type TAriaRoleRequired,
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';

import { type TPopoverAnimationPreset } from './animations';

/**
 * The reason a popover was closed.
 *
 * - `'escape'`: The user pressed the Escape key.
 * - `'light-dismiss'`: The user clicked outside the popover (or the browser
 *   dismissed it for another auto-mode reason).
 * - `'programmatic'`: The popover was closed programmatically.
 */
export type TPopoverCloseReason = 'escape' | 'light-dismiss' | 'programmatic';

/**
 * Flat (non-discriminated) props accepted by the Popover component internally.
 *
 * Used by wrappers like `PopupContent` that destructure props from a
 * discriminated union and re-pass the individual fields: TypeScript cannot
 * prove the fields still satisfy the union. ARIA correctness is enforced at
 * the `TPopupContentProps` boundary where consumers interact.
 */
export type TPopoverForwardedProps = TPopoverBaseProps & {
	mode?: 'auto' | 'hint' | 'manual';
	onClose?: (args: { reason: TPopoverCloseReason }) => void;
	role?: TRoleRequiringAccessibleName | TRoleWithImplicitName;
	label?: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
	labelledBy?: string;
};

export type { TPlacementOptions };

type TPopoverBaseProps = {
	children: ReactNode;
	/**
	 * Additional CSS styles applied to the popover root element.
	 * Use to set `backgroundColor` to match the popup surface colour.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * Animation preset for entry/exit transitions.
	 *
	 * Animations use `@starting-style` and `allow-discrete` for progressive
	 * enhancement: browsers without support show/hide instantly.
	 */
	animate?: false | TPopoverAnimationPreset;
	/**
	 * Test ID applied to the popover element.
	 */
	testId?: string;
	/**
	 * HTML `id` attribute for the popover element. When omitted, a unique ID
	 * is generated automatically. Pair the trigger with this ID via `aria-controls`
	 * and the popover with `popovertarget`. Use `usePopoverId()` to generate a
	 * stable, CSS-safe id.
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
	 * The consumer does not conditionally render the `Popover` - visibility is driven
	 * by this prop.
	 *
	 * **Lifecycle observable to consumers:**
	 *
	 * - The host element is in the DOM only while the popover is open or its exit
	 *   animation is playing. After exit completes the element is unmounted so it
	 *   does not leave an empty `role` / `popover` element in the accessibility tree.
	 *   The exact unmount timing is private and may change.
	 * - The `id` (supplied or generated via `usePopoverId()`) is stable across opens.
	 * - The `ref` is populated only while the host element is rendered. Consumers
	 *   that read from the ref outside of `onOpenChange` / `onEnterFinish` should
	 *   gate the read on `isOpen` being `true`.
	 *
	 * **Important:** For `mode="auto"` popovers, the browser can dismiss the popover
	 * via light dismiss (Escape, click outside) independently of this prop. When that
	 * happens, `onClose` is called and the consumer should respond by setting `isOpen`
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
	 * When `animate` is provided, the preset's `getStyles(placement)` is
	 * called to set CSS custom properties (like `--ds-popover-tx`, `--ds-popover-ty`)
	 * that control the slide direction. Has no effect without `animate`.
	 *
	 * This does NOT control positioning. Use `useAnchorPosition` for that.
	 */
	placement?: TPlacementOptions;
	/**
	 * Called after the entry animation completes (or immediately on open when
	 * there is no animation or reduced motion is active).
	 *
	 * Use this for external lifecycle coordination - e.g. notifying a manager
	 * that the show sequence is finished.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the exit animation completes (or immediately on close when
	 * there is no animation or reduced motion is active).
	 *
	 * Use this for external lifecycle coordination, e.g. notifying a manager
	 * that the hide sequence is finished, or firing an `onCloseComplete` callback.
	 */
	onExitFinish?: () => void;
};

/**
 * Unopinionated top-layer primitive.
 *
 * `Popover` manages only top-layer visibility and animation. It has no
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
 * - `'hint'`: ephemeral UI (e.g. tooltips) that does not close other `auto`
 *   popovers. Falls back silently to `auto` semantics in browsers without
 *   `popover='hint'` support, meaning the hint will close any other `auto`
 *   popovers in those browsers. If cross-browser uniformity matters more
 *   than the no-close behaviour, pass `auto` explicitly.
 * - `'manual'`: no light dismiss. Consumer controls show/hide entirely. Only
 *   appropriate for persistent UI (e.g. flags, banners).
 */
export type TPopoverProps = TPopoverBaseProps &
	TAriaRoleRequired &
	(
		| {
				mode?: 'auto' | 'hint';
				/**
				 * Called when the popover is dismissed via light dismiss
				 * (Escape, click outside).
				 *
				 * Required for `auto` and `hint` modes - without it, browser
				 * dismissals leave the consumer's `isOpen` stuck at `true` while
				 * the DOM is hidden, producing a stale-open state.
				 *
				 * The `reason` field indicates how the dismiss occurred:
				 * - `'escape'`: the user pressed the Escape key.
				 * - `'light-dismiss'`: the user clicked outside (or another auto-dismiss).
				 */
				onClose: (args: { reason: TPopoverCloseReason }) => void;
		  }
		| {
				mode: 'manual';
				onClose?: never;
		  }
	);

/**
 * The width mode of the popover relative to its anchor element.
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
export type TWidthFromAnchorMode = 'none' | 'match-anchor' | 'min-anchor';
