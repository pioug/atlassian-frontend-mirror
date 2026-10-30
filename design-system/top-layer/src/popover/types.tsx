import { type ReactNode, type RefObject } from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';

import { type TPlacementOptions } from '../internal/resolve-placement';
import {
	type TAriaRoleRequired,
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
	type TRoleWithInitialFocus,
} from '../internal/role-types';

export type { TPlacementOptions };

/**
 * The reason a popover was closed.
 *
 * - `'escape'`: the user pressed the Escape key.
 * - `'light-dismiss'`: the user clicked outside the popover, or the browser dismissed it for
 *   another light dismiss reason (for example, another `auto` popover opened).
 * - `'programmatic'`: code asked the popover to close (`requestClosePopovers()`).
 */
export type TPopoverCloseReason = 'escape' | 'light-dismiss' | 'programmatic';

/**
 * `initialFocusRef` exists only for roles that move focus on open. Other roles, and no role, keep
 * focus where it is, so a custom target has no meaning there.
 */
type TInitialFocusProps =
	| {
			role: TRoleWithInitialFocus;
			/**
			 * The element that takes focus when the popover opens, in place of the
			 * default for its `role`. Read once per open, in a layout effect, so set
			 * it in a ref callback (for example as the `ref` of an element in
			 * `children`) or a layout effect. A `useEffect` is too late. It is
			 * ignored when it holds no element, or an element outside the popover.
			 * When a combobox controls the popover, focus stays on the combobox.
			 *
			 * For `dialog` and `alertdialog` the order is: this target, then the
			 * first `[autofocus]` element, then the first focusable element.
			 *
			 * Use it for `dialog` and `alertdialog`, where the author chooses the
			 * target (for example the least destructive action). `menu` and `listbox`
			 * already focus the right element.
			 */
			initialFocusRef?: RefObject<HTMLElement | null>;
	  }
	| {
			role?: Exclude<TRoleRequiringAccessibleName | TRoleWithImplicitName, TRoleWithInitialFocus>;
			initialFocusRef?: never;
	  };

type TPopoverBaseProps = {
	/**
	 * Pass ONE element. The host is a flex row while open, so that a size cap can reach it (see
	 * `useAnchoredPopover`). Two element children become two flex items SIDE BY SIDE, at half
	 * width each. A fragment does not help, because its children are the flex items. This is why
	 * a type cannot express the rule. It matters most where a consumer's render prop is passed
	 * through unwrapped, as `@atlaskit/popper` and `@atlaskit/spotlight` do.
	 *
	 * The host sets that element's `min-inline-size` and `min-block-size` to zero, so the cap can
	 * shrink a child that does not scroll. The rule has zero specificity, so a minimum that the
	 * element sets itself wins. See the host styles in `popover.tsx`.
	 */
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
	 *   is `true`, the entry animation plays as a keyframe animation.
	 * - **`false`:** hide the popover. When `shouldAnimate` is `true`, the exit
	 *   animation plays as a keyframe animation while the lifecycle phase is `exiting`,
	 *   kept visible by an `allow-discrete` transition.
	 *   Otherwise it hides visually without animation, while lifecycle settlement still
	 *   waits for the native closed `toggle`.
	 *
	 * Do not render the `Popover` conditionally. This prop drives its visibility.
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
	 * **Important:** For `auto` and `hint` popovers, the browser can dismiss the popover
	 * via light dismiss (Escape, click outside) independently of this prop. When that
	 * happens, `onClose` is called and the consumer should respond by setting `isOpen`
	 * to `false`. If `isOpen` remains `true` after a browser dismiss, the DOM and
	 * React state remain out of sync until the consumer changes the prop.
	 */
	isOpen: boolean;
	/**
	 * Placement hint for the default directional animation.
	 *
	 * When `shouldAnimate` is `true`, placement sets the CSS custom properties
	 * `--ds-popover-motion-enter` and `--ds-popover-motion-exit`, which control the slide
	 * direction. Has no effect without `shouldAnimate`.
	 *
	 * This does NOT control positioning. Use `useAnchoredPopover` for that.
	 */
	placement?: TPlacementOptions;
	/**
	 * Called after the entry animation completes (or immediately on open when
	 * there is no animation or reduced motion is active).
	 *
	 * Use this for external lifecycle coordination, for example to tell a manager
	 * that the show sequence is finished.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the native closed `toggle` and any exit animations settle.
	 * With no animation or reduced motion, this still waits for the browser's
	 * task-queued `toggle` so focus restoration finishes against a mounted host.
	 *
	 * Use this for external lifecycle coordination, for example to tell a manager
	 * that the hide sequence is finished, or to call an `onCloseComplete` callback.
	 */
	onExitFinish?: () => void;
};

/**
 * The props that `Popover` accepts. Flat, except that `initialFocusRef` needs a role that moves
 * focus (`TInitialFocusProps`).
 *
 * Wrappers (for example `PopupContent` in `@atlaskit/popup`) destructure their props from a
 * discriminated union and pass each field on. TypeScript cannot prove that the fields still
 * satisfy the union, so `Popover` accepts this flat type. `TPopoverProps` is the strict type: it
 * requires a `role`, and an accessible name for the roles that need one.
 */
export type TPopoverForwardedProps = TPopoverBaseProps &
	TInitialFocusProps & {
		/**
		 * How the browser dismisses the popover. See `TPopoverProps` for each mode.
		 */
		mode?: 'auto' | 'hint' | 'manual';
		/**
		 * Called when the popover asks to close. See `TPopoverProps` for each `reason`.
		 *
		 * Also makes the popover closable: only a popover with
		 * `onClose` is counted by `hasOpenDialogOrPopover()` and asked to close by
		 * `requestClosePopovers()` (`@atlaskit/top-layer/page-surface/request-close-popovers`).
		 */
		onClose?: (args: { reason: TPopoverCloseReason }) => void;
		role?: TRoleRequiringAccessibleName | TRoleWithImplicitName;
		label?: string;
		// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
		labelledBy?: string;
	};

/**
 * Unopinionated top-layer primitive.
 *
 * `Popover` manages top-layer visibility, animation and focus. It has no knowledge of
 * positioning. For anchor positioning and sizing, compose it with the `useAnchoredPopover` hook.
 *
 * Use `Popover` directly for custom trigger lifecycles (hover, timers, external state) or
 * trigger-less UI (flags, toasts). For the common pattern where a button opens content, use
 * `Popup` from `@atlaskit/popup` instead.
 *
 * Dismiss behavior (`mode`):
 * - `'auto'` (default): Escape to close, click-outside to close, focus restoration,
 *   automatic nesting, mutual exclusivity.
 * - `'hint'`: ephemeral UI (for example tooltips) that does not close other `auto`
 *   popovers. Falls back silently to `auto` semantics in browsers without
 *   `popover='hint'` support, meaning the hint will close any other `auto`
 *   popovers in those browsers. If cross-browser uniformity matters more
 *   than the no-close behavior, pass `auto` explicitly.
 * - `'manual'`: no light dismiss. The consumer controls show and hide. Use it for persistent UI
 *   (for example flags and banners), or add light dismiss with `useManualLightDismiss`
 *   (`@atlaskit/top-layer/use-manual-light-dismiss`).
 */
export type TPopoverProps = TPopoverBaseProps &
	TAriaRoleRequired &
	TInitialFocusProps &
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
				 * The `reason` field indicates how the close was requested:
				 * - `'escape'`: the user pressed the Escape key.
				 * - `'light-dismiss'`: the user clicked outside (or another auto-dismiss).
				 * - `'programmatic'`: `requestClosePopovers()` asked every open closable
				 *   popover to close (for example, the side navigation toggle). The popover stays
				 *   open until the consumer sets `isOpen` to `false`.
				 */
				onClose: (args: { reason: TPopoverCloseReason }) => void;
		  }
		| {
				mode: 'manual';
				/**
				 * Makes the popover closable. When provided,
				 * `hasOpenDialogOrPopover()` counts the popover while it is open, and
				 * `requestClosePopovers()` calls this with `reason: 'programmatic'`.
				 * Set `isOpen` to `false` in response. Without it, the popover is not
				 * closable: `requestClosePopovers()` cannot close it and
				 * `hasOpenDialogOrPopover()` does not count it.
				 *
				 * Manual popovers have no light dismiss, so `'programmatic'` is the only
				 * reason they receive.
				 */
				onClose?: (args: { reason: TPopoverCloseReason }) => void;
		  }
	);
