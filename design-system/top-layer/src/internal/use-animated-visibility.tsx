import { type RefObject, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { type TAnimationPreset } from '../animations/types';

import { prefersReducedMotion } from './reduced-motion';
import { usePresetStyles } from './use-preset-styles';

type TUseAnimatedVisibilityArgs = {
	/**
	 * Whether the element is logically open.
	 */
	isOpen: boolean;
	/**
	 * Animation preset for entry/exit transitions.
	 * Pass `false` or `undefined` to disable animation.
	 */
	animate: TAnimationPreset | false | undefined;
	/**
	 * Ref to the DOM element that plays the exit transition.
	 * Used to listen for `transitionend`.
	 */
	elementRef: RefObject<HTMLElement | null>;
	/**
	 * Called after the exit animation completes (or immediately on close
	 * when there is no animation or reduced motion is active).
	 */
	onExitFinish?: () => void;
};

type TUseAnimatedVisibilityResult = {
	/**
	 * Whether children should be rendered. Stays `true` during exit
	 * animations so content remains visible while transitioning out.
	 */
	showChildren: boolean;
	/**
	 * Resolved animation preset (with CSS injected), or `null` if
	 * animation is disabled.
	 */
	preset: TAnimationPreset | null;
};

/**
 * Manages the children mount/unmount lifecycle around CSS exit transitions.
 *
 * Used by both `Popover` and `Dialog` to share the same animation lifecycle
 * logic. Those components own their own show/hide mechanisms (showPopover /
 * hidePopover vs showModal / close) and event handling — this hook only
 * manages the relationship between `isOpen` and when children are rendered.
 *
 * ## Problem
 *
 * We want to delay the unmount of children until a CSS exit transition has
 * finished playing. If we unmount children the moment `isOpen` becomes
 * `false`, the exit animation is never visible — the content just disappears.
 *
 * ## How it works
 *
 * `showChildren` tracks whether the consumer's children should be in the DOM.
 * It does not mirror `isOpen` exactly — it intentionally lags behind during
 * exit animations:
 *
 * ```
 * isOpen:        true ──────────────── false
 * showChildren:  true ──────────────── true ─── (exit animation) ─── false
 * ```
 *
 * Two close paths exist:
 *
 * 1. **Animated close** (`willAnimate === true`):
 *    `isOpen` goes `false` → `showChildren` stays `true` → the CSS exit
 *    transition plays → `transitionend` fires → `showChildren` → `false`
 *    → `onExitFinish` fires. A timeout fallback ensures we still unmount
 *    if `transitionend` never fires (e.g. browser quirks, zero-duration).
 *
 * 2. **Non-animated close** (`willAnimate === false`):
 *    `isOpen` goes `false` → `showChildren` → `false` synchronously during
 *    the same render → `onExitFinish` fires in a follow-up effect.
 */
export function useAnimatedVisibility({
	isOpen,
	animate,
	elementRef,
	onExitFinish,
}: TUseAnimatedVisibilityArgs): TUseAnimatedVisibilityResult {
	// Resolve the animation preset and inject its CSS (idempotent).
	// Returns `null` when `animate` is falsy.
	const preset = usePresetStyles({ preset: animate });

	// Whether we should play CSS transitions. False when there is no preset
	// or the user has enabled the "prefers reduced motion" OS setting.
	const willAnimate = Boolean(animate) && !prefersReducedMotion();

	// ── showChildren state ──
	//
	// This is the core of the hook. `showChildren` controls whether the
	// consumer's children are in the DOM. The two `if` blocks below are
	// intentionally written as synchronous state updates during render
	// (React supports this pattern — setState during render is treated as
	// a synchronous re-render before the browser paints).
	//
	// Mount path:  isOpen went true but showChildren is still false → mount.
	// Unmount path: isOpen went false, showChildren is still true, and we
	//               are NOT animating → unmount immediately (no transition
	//               to wait for). If we ARE animating, showChildren stays
	//               true here and the effect below will set it to false
	//               after `transitionend`.
	const [showChildren, setShowChildren] = useState(isOpen);

	if (isOpen && !showChildren) {
		setShowChildren(true);
	}
	if (!isOpen && showChildren && !willAnimate) {
		setShowChildren(false);
	}

	// Keep a stable ref to the latest `onExitFinish` so the effect and
	// timeout closures below always call the current callback without
	// needing `onExitFinish` in dependency arrays (which would reset
	// the timeout on every new closure).
	const onExitFinishRef = useRef(onExitFinish);
	onExitFinishRef.current = onExitFinish;

	// ── Animated exit effect ──
	//
	// Runs when all three conditions are true:
	//   • `isOpen` is false  (consumer wants to close)
	//   • `showChildren` is true  (children are still mounted for exit anim)
	//   • `willAnimate` is true   (we have a preset and reduced motion is off)
	//
	// Listens for `transitionend` on the element to know when the CSS exit
	// transition has finished, then unmounts children and fires onExitFinish.
	//
	// Fallback timeout: `transitionend` can fail to fire in edge cases
	// (e.g. element removed from top layer by browser, zero-duration
	// transition, interrupted animation). The timeout is set to the
	// preset's exit duration + 50ms buffer to guarantee we always unmount.
	useEffect(() => {
		// Guard: only run during the "exiting" window
		if (isOpen || !showChildren || !willAnimate) {
			return;
		}

		const el = elementRef.current;
		if (!el) {
			return;
		}

		function finish() {
			clearTimeout(fallbackId);
			setShowChildren(false);
			onExitFinishRef.current?.();
		}

		// Fallback: unmount even if transitionend never fires
		const fallbackId = setTimeout(finish, (preset?.exitDurationMs ?? 0) + 50);

		// Primary: listen for the CSS transition to complete
		const unbind = bind(el, {
			type: 'transitionend',
			listener: finish,
			options: { once: true },
		});

		// Cleanup on re-render or unmount: cancel pending timeout and listener
		return () => {
			clearTimeout(fallbackId);
			unbind();
		};
	}, [isOpen, showChildren, willAnimate, preset?.exitDurationMs, elementRef]);

	// ── Non-animated exit callback ──
	//
	// When there is no animation, children unmount synchronously (handled
	// by the `if` block above). But `onExitFinish` still needs to fire —
	// we do that in a follow-up effect so the consumer can react to it.
	//
	// Uses a previous-value ref (`wasOpenRef`) to detect the exact
	// true→false transition of `isOpen`, avoiding false positives on
	// mount or re-renders where `isOpen` was already false.
	const wasOpenRef = useRef(isOpen);
	useEffect(() => {
		const wasOpen = wasOpenRef.current;
		wasOpenRef.current = isOpen;

		if (wasOpen && !isOpen && !willAnimate) {
			onExitFinishRef.current?.();
		}
	}, [isOpen, willAnimate]);

	return { showChildren, preset };
}
