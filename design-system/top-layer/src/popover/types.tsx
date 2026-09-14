import { type ReactNode } from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';

import { type TPlacementOptions } from '../internal/resolve-placement';
import {
	type TAriaRoleRequired,
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';

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
	 * Animation styles applied while the popover is entering.
	 *
	 * Only applied when `shouldAnimate` is `true`.
	 */
	enteringAnimationXcss?: StrictXCSSProp<
		'animationName' | 'animationDuration' | 'animationTimingFunction' | 'animationDelay',
		never
	>;
	/**
	 * Animation styles applied while the popover is exiting.
	 *
	 * Only applied when `shouldAnimate` is `true`.
	 */
	exitingAnimationXcss?: StrictXCSSProp<
		'animationName' | 'animationDuration' | 'animationTimingFunction' | 'animationDelay',
		never
	>;
	/**
	 * Whether the popover should animate in and out.
	 *
	 * When `true`, default popover animation styles are applied. Use `enteringAnimationXcss`
	 * and `exitingAnimationXcss` to override the animation used for each phase.
	 */
	shouldAnimate?: boolean;
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
	 * Controlled visibility intent for the popover. Native visibility and lifecycle
	 * phase can temporarily differ from this value while a close settles.
	 *
	 * - **`true`:** show the popover (calls `showPopover()`). When `shouldAnimate`
	 *   is `true`, the entry animation plays via `@starting-style`.
	 * - **`false`:** hide the popover. When `shouldAnimate` is `true`, the exit
	 *   animation plays via `allow-discrete` while the lifecycle phase is `exiting`.
	 *   Otherwise it hides visually without animation, while lifecycle settlement still
	 *   waits for the native closed `toggle`.
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
	 *   that read from the ref outside of `onEnterFinish` should gate the read on
	 *   `isOpen` being `true`.
	 *
	 * **Important:** For `mode="auto"` popovers, the browser can dismiss the popover
	 * via light dismiss (Escape, click outside) independently of this prop. When that
	 * happens, `onClose` is called and the consumer should respond by setting `isOpen`
	 * to `false`. If `isOpen` remains `true` after a browser dismiss, the DOM and
	 * React state remain out of sync until the consumer changes the prop.
	 */
	isOpen: boolean;
	/**
	 * Placement hint for the default directional animation.
	 *
	 * When `shouldAnimate` is `true`, placement is used to set CSS custom
	 * properties (like `--ds-popover-tx`, `--ds-popover-ty`) that control the
	 * slide direction. Has no effect without `shouldAnimate`.
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
	 * Called after the native closed `toggle` and any exit animations settle.
	 * With no animation or reduced motion, this still waits for the browser's
	 * task-queued `toggle` so focus restoration finishes against a mounted host.
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
				 * Required for `auto` and `hint` modes so the consumer can update
				 * controlled intent after native dismissal. If `isOpen` remains `true`,
				 * the Popover remains natively closed until the prop changes.
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
 *   via CSS `inline-size: anchor-size(self-inline)`. Falls back to a
 *   one-off measurement of `anchorRef.current.offsetWidth` when CSS
 *   Anchor Positioning is not supported.
 * - `'min-anchor'`: popover is at least as wide as the anchor, but
 *   can grow wider if content requires it. Uses
 *   `min-inline-size: anchor-size(self-inline)`. Falls back to a one-off
 *   measurement of the anchor's width.
 */
export type TWidthFromAnchorMode = 'none' | 'match-anchor' | 'min-anchor';
