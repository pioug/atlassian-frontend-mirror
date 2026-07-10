import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { bind, bindAll } from 'bind-event-listener';

import { prefersReducedMotion } from './reduced-motion';
import type { TPlacementOptions } from './resolve-placement';

type TAnimationPresetKind = 'dialog' | 'popover';

/**
 * A self-contained animation preset for top-layer elements.
 *
 * Contains a stable preset name used by the host component to select its
 * component-local Compiled style entry, plus optional per-placement inline
 * styles.
 *
 * The actual Compiled styles are kept static and component-local so the
 * Compiled transform can extract them at build time.
 */
export type TAnimationPreset<Kind extends TAnimationPresetKind, Name = string> = {
	kind: Kind;
	/**
	 * Stable preset name used to select a component-local Compiled style entry.
	 */
	name: Name;
	/**
	 * Per-placement inline styles (e.g. directional offset custom properties for
	 * `slideAndFade`). Only used by presets that vary by placement or by a
	 * configurable distance.
	 */
	getStyles?: (args: {
		placement: TPlacementOptions;
	}) => Array<{ property: string; value: string }>;
};

type TRunOnTransitionEndArgs = {
	element: HTMLElement;
	safetyNetMs: number;
	onSettled: () => void;
};

/**
 * Using the recommended motion timings for safety net.
 *
 * Not setting these timings on the preset config because they're defined in the CSS,
 * so configuring it in the preset doesn't achieve anything except introduce a potential
 * source of drift.
 *
 * TODO: figure out a way to not need to redeclare these in the future,
 * and keep CSS and JS timings in sync always.
 */
const safetyNetMsMap: Record<TAnimationPresetKind, { enter: number; exit: number }> = {
	dialog: {
		enter: 250, // Corresponds to `motion.duration.long`
		exit: 200, // Corresponds to `motion.duration.medium`
	},
	popover: {
		enter: 150, // Corresponds to `motion.duration.short`
		exit: 100, // Corresponds to `motion.duration.xshort`
	},
};

/**
 * Fires `onSettled` once when `transitionend` fires on `element`, or after
 * `safetyNetMs` if the event is swallowed (mid-transition unmount, CSS
 * mismatch, browser quirks). Returns a cleanup that cancels both paths.
 */
function runOnTransitionEndOrTimeout({
	element,
	safetyNetMs,
	onSettled,
}: TRunOnTransitionEndArgs): () => void {
	const state = { isSettled: false };

	function teardown() {
		state.isSettled = true;
		clearTimeout(safetyNetId);
		unbind();
	}

	function settle() {
		if (state.isSettled) {
			return;
		}
		teardown();
		onSettled();
	}

	const unbind = bind(element, {
		type: 'transitionend',
		listener: settle,
		options: { once: true },
	});
	const safetyNetId = setTimeout(settle, safetyNetMs);

	return teardown;
}

type TUseAnimatedVisibilityArgs<Kind extends TAnimationPresetKind, Name> = {
	/**
	 * Whether the element is logically open.
	 */
	isOpen: boolean;
	/**
	 * Animation preset for entry/exit transitions.
	 * Pass `false` or `undefined` to disable animation.
	 */
	animate: TAnimationPreset<Kind, Name> | false | undefined;
	/**
	 * Ref to the DOM element that plays the entry/exit transitions.
	 * Used to listen for `transitionend`.
	 */
	elementRef: RefObject<HTMLElement | null>;
	/**
	 * Called after the entry animation completes (or immediately on open
	 * when there is no animation or reduced motion is active).
	 * This includes initial mount with `isOpen=true`.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the exit animation completes (or immediately on close
	 * when there is no animation or reduced motion is active).
	 */
	onExitFinish?: () => void;
};

type TUseAnimatedVisibilityResult<Kind extends TAnimationPresetKind, Name> = {
	/**
	 * Current visibility phase. See `TPhase` for the full lifecycle.
	 *
	 * `phase !== 'closed'` means the host element is mounted and on
	 * screen, including during animated entry, animated exit, and the
	 * non-animated close handshake. Use this when you need "the user
	 * can still see / interact with the element" semantics (e.g. focus
	 * trapping, listeners that must outlive the exit).
	 */
	phase: TPhase;
	/**
	 * Resolved animation preset (styles applied via the host element's `css`
	 * prop), or `null` if animation is disabled.
	 */
	preset: TAnimationPreset<Kind, Name> | null;
};

/**
 * Visibility lifecycle phase shared between `useAnimatedVisibility`,
 * `useFocusWrap`, `useInitialFocus`, and the `Popover` / `Dialog`
 * components.
 *
 * - `closed`: host element is unmounted. No DOM presence.
 * - `entering`: host element is mounted and the CSS entry transition
 *   is playing. **Only emitted when animation is enabled.** With
 *   animation disabled the lifecycle goes directly `closed → open`.
 * - `open`: host element is mounted and settled. No transition is
 *   playing.
 * - `exiting`: `isOpen` has flipped to `false` but the host element
 *   is still mounted. Emitted while the CSS exit transition is playing
 *   (animation enabled) OR while we wait for the browser's
 *   `toggle`/`close` event to fire on the still-attached element so
 *   focus restoration can run (animation disabled).
 *
 * State machine:
 * ```
 *   animation ON:   closed → entering → open → exiting → closed
 *   animation OFF:  closed →            open → exiting → closed
 *   interrupts:     entering → exiting (close mid-entry)
 *                   exiting  → entering (reopen mid-exit, animated)
 *                   exiting  → open     (reopen mid-handshake, non-animated)
 * ```
 *
 * `phase !== 'closed'` is the canonical "host is currently in the DOM
 * and on screen" predicate.
 */
export type TPhase = 'closed' | 'entering' | 'open' | 'exiting';

/**
 * Manages the children mount/unmount lifecycle around CSS exit transitions.
 *
 * Used by both `Popover` and `Dialog` to share the same animation lifecycle
 * logic. Those components own their own show/hide mechanisms (showPopover /
 * hidePopover vs showModal / close) and event handling - this hook only
 * manages the relationship between `isOpen` and when children are rendered.
 *
 * ## Problem
 *
 * We want to delay the unmount of children until a CSS exit transition has
 * finished playing. If we unmount children the moment `isOpen` becomes
 * `false`, the exit animation is never visible - the content just disappears.
 *
 * ## How it works
 *
 * The lifecycle is modeled as a `phase` discriminated union (`closed`,
 * `entering`, `open`, `exiting`). The host element is rendered while
 * `phase !== 'closed'`, so the `exiting` phase keeps the host mounted
 * while the CSS exit transition plays (or, with animation disabled,
 * while we wait for the browser `toggle` / `close` event to fire on the
 * still-attached element):
 *
 * ```
 * isOpen:  true ──────────────── false
 * phase:   open ──────────────── exiting ─── (exit settle) ─── closed
 * ```
 *
 * Every effect dispatches on the single `phase` value instead of a
 * cross-product of booleans.
 */
export function useAnimatedVisibility<Kind extends TAnimationPresetKind, Name>({
	isOpen,
	animate,
	elementRef,
	onEnterFinish,
	onExitFinish,
}: TUseAnimatedVisibilityArgs<Kind, Name>): TUseAnimatedVisibilityResult<Kind, Name> {
	// Styles are applied via the `css` prop on the host element (see `Popover`
	// and `Dialog`), so there is no longer any CSS injection step. Normalize a
	// falsy `animate` to `null`.
	const preset = animate || null;

	// False when there is no preset or `prefers-reduced-motion` is set.
	const willAnimate = Boolean(animate) && !prefersReducedMotion();

	// Promote `closed → entering`/`closed → open` synchronously during
	// render so the host element mounts in the same commit as the open
	// intent. All other transitions are driven by phase-specific effects.
	const [phase, setPhase] = useState<TPhase>(() => {
		if (!isOpen) {
			return 'closed';
		}
		return willAnimate ? 'entering' : 'open';
	});

	if (isOpen && phase === 'closed') {
		setPhase(willAnimate ? 'entering' : 'open');
	}
	if (!isOpen && (phase === 'open' || phase === 'entering')) {
		// Close intent. Move to `exiting` to gate the unmount on either
		// the exit transition (animated) or the toggle/close event
		// (non-animated). Includes interrupted entry (`entering → exiting`).
		setPhase('exiting');
	}
	if (isOpen && phase === 'exiting') {
		// Reopen mid-exit. With animation, jump back to `entering` and let
		// the entry transition restart from current visual state. Without
		// animation, jump straight to `open` (the handshake we were waiting
		// for is no longer relevant; the consumer wants the host visible
		// again synchronously).
		setPhase(willAnimate ? 'entering' : 'open');
	}

	// Keep stable refs to the latest callbacks so effects and timeout closures
	// always call the current callback without needing them in dependency arrays.
	const onEnterFinishRef = useRef(onEnterFinish);
	onEnterFinishRef.current = onEnterFinish;

	const onExitFinishRef = useRef(onExitFinish);
	onExitFinishRef.current = onExitFinish;

	// Animated entry: wait for `transitionend` (or a safety-net timeout) and
	// move to `open`. The fallback guarantees settle on swallowed events
	// (zero-duration, browser quirk, mid-transition unmount).
	useEffect(() => {
		if (phase !== 'entering' || !preset?.kind) {
			return;
		}

		const element = elementRef.current;
		if (!element) {
			return;
		}

		return runOnTransitionEndOrTimeout({
			element,
			safetyNetMs: safetyNetMsMap[preset.kind].enter + 50,
			onSettled: () => {
				// Fire the consumer callback before transitioning phase so any
				// state the consumer reads (refs, DOM nodes) is still attached
				// in the same synchronous tick, regardless of React batching
				// semantics.
				onEnterFinishRef.current?.();
				setPhase((current) => (current === 'entering' ? 'open' : current));
			},
		});
	}, [phase, preset?.kind, elementRef]);

	// Non-animated entry callback. The lifecycle goes `closed → open`
	// directly with no `entering` phase; fire `onEnterFinish` on that jump.
	// A previous-phase ref avoids double-firing on the animated path.
	const prevPhaseForEntryRef = useRef<TPhase>('closed');
	useEffect(() => {
		const prevPhase = prevPhaseForEntryRef.current;
		prevPhaseForEntryRef.current = phase;

		// Animated entry settle goes through `entering` and already fired
		// onEnterFinish above; only handle the non-animated direct jumps.
		if (prevPhase !== 'open' && phase === 'open' && prevPhase !== 'entering') {
			onEnterFinishRef.current?.();
		}
	}, [phase]);

	// Animated exit: wait for `transitionend` (or a safety-net timeout),
	// fire `onExitFinish`, then move to `closed` to unmount the host.
	useEffect(() => {
		if (phase !== 'exiting' || !willAnimate || !preset?.kind) {
			return;
		}

		const element = elementRef.current;
		if (!element) {
			return;
		}

		return runOnTransitionEndOrTimeout({
			element,
			safetyNetMs: safetyNetMsMap[preset.kind].exit + 50,
			onSettled: () => {
				// Fire the consumer callback before transitioning phase to
				// `closed`. The phase change drives the host element unmount,
				// and consumers expect to be able to read the element (or a
				// forwarded ref to it) inside `onExitFinish`. Doing this in
				// the safe order avoids relying on React's automatic batching
				// to keep the element attached across the callback.
				onExitFinishRef.current?.();
				setPhase((current) => (current === 'exiting' ? 'closed' : current));
			},
		});
	}, [phase, willAnimate, preset?.kind, elementRef]);

	// Non-animated exit: wait for the browser's `toggle` (closed) or
	// `close` event before unmounting, so the consumer's listener (close
	// reason, nested focus restoration, `onClose`) and the browser's
	// native focus restoration both run against the still-attached
	// element. A naive `setTimeout(0)` occasionally beats the `toggle`
	// task in Chromium and drops focus restoration.
	//
	// `useLayoutEffect` so the listener binds in the same commit as the
	// show/hide layout effect that calls `hidePopover()` / `dialog.close()`.
	// The toggle/close event is queued as a task and cannot run until the
	// frame completes. SSR-safe: `phase` starts at `'closed'`.
	//
	// `onExitFinish` is fired separately (see effect below) so consumers
	// observe it the moment `isOpen` flips to `false`.
	useLayoutEffect(() => {
		if (phase !== 'exiting' || willAnimate) {
			return;
		}
		const element = elementRef.current;
		if (!element) {
			return;
		}

		function unmount() {
			setPhase((current) => (current === 'exiting' ? 'closed' : current));
		}

		return bindAll(element, [
			{
				type: 'toggle',
				listener: (event: ToggleEvent) => {
					if (event.newState === 'closed') {
						unmount();
					}
				},
			},
			{
				type: 'close',
				listener: unmount,
			},
		]);
	}, [phase, willAnimate, elementRef]);

	// Non-animated exit callback. No `transitionend` to wait for, so fire
	// `onExitFinish` on the transition into `exiting` (the unmount itself
	// is gated by the toggle/close handshake above).
	const prevPhaseForExitRef = useRef<TPhase>('closed');
	useEffect(() => {
		const prevPhase = prevPhaseForExitRef.current;
		prevPhaseForExitRef.current = phase;

		// Only fire on the non-animated transition into `exiting`. The
		// animated path's `exiting → closed` settle already fires
		// `onExitFinish` from `runOnTransitionEndOrTimeout`.
		if (prevPhase !== 'exiting' && phase === 'exiting' && !willAnimate) {
			onExitFinishRef.current?.();
		}
	}, [phase, willAnimate]);

	return { phase, preset };
}
