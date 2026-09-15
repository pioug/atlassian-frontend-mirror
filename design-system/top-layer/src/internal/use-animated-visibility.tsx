import { type RefObject, useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react';

import { isNativeElementOpen } from './is-native-element-open';
import { prefersReducedMotion } from './reduced-motion';

type TRunOnAnimationsSettledArgs = {
	element: HTMLElement;
	onSettled: () => void;
};

type TRunCancellableSettlementArgs = {
	schedule: (settle: () => void) => void;
	onSettled: () => void;
};

function runCancellableSettlement({
	schedule,
	onSettled,
}: TRunCancellableSettlementArgs): () => void {
	let isCancelled = false;

	schedule(() => {
		if (isCancelled) {
			return;
		}

		onSettled();
	});

	return () => {
		// Prevent an interrupted or unmounted lifecycle from firing a stale callback.
		isCancelled = true;
	};
}

/**
 * Fires `onSettled` once all animations currently applied to `element`
 * finish or are cancelled. Returns a cleanup that prevents stale settlement.
 */
function runOnAnimationsSettled({ element, onSettled }: TRunOnAnimationsSettledArgs): () => void {
	return runCancellableSettlement({
		onSettled,
		schedule: (settle) => {
			const animations = element.getAnimations?.() ?? [];
			Promise.allSettled(animations.map((animation) => animation.finished)).then(settle);
		},
	});
}

type TUseAnimatedVisibilityArgs = {
	/**
	 * Controlled visibility intent from the consumer. This can temporarily differ
	 * from native visibility during browser-initiated dismissal and close settlement.
	 */
	isOpen: boolean;
	/**
	 * Animation config for entry/exit animations.
	 * Pass `false` to disable animation.
	 */
	shouldAnimate: boolean;
	/**
	 * Ref to the DOM element that plays the entry/exit animations.
	 * Used to inspect its active animations.
	 */
	elementRef: RefObject<HTMLElement | null>;
	/**
	 * Called after entry settles and the `open` phase has committed, so the
	 * callback observes the host without its entering styles. This includes
	 * initial mount with `isOpen=true`.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the native closed `toggle` and any exit animations settle.
	 * With animation disabled, this still waits for the task-queued `toggle`.
	 * The callback runs immediately before the host transitions to `closed`,
	 * so the element remains mounted while the callback runs.
	 */
	onExitFinish?: () => void;
};

type TUseAnimatedVisibilityResult = {
	/**
	 * Current visibility phase. The host element is mounted whenever
	 * `phase !== 'closed'`.
	 */
	phase: TPhase;
	isMounted: boolean;
	/**
	 * Bind to the primitive's native `beforetoggle` event.
	 */
	onBeforeToggle: (event: ToggleEvent) => void;
	/**
	 * Bind to the primitive's native `toggle` event after any primitive-specific
	 * close handling that must complete before exit settlement.
	 */
	onToggle: (event: ToggleEvent) => void;
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
 * - `exiting`: a native close has begun but the host element remains
 *   mounted. Usually this follows `isOpen` changing to `false`, but it can
 *   also begin with a browser-initiated dismissal while controlled intent
 *   is still open. With animation disabled, this phase lasts until the
 *   browser's closed `toggle` fires so native focus restoration can finish.
 *
 * State machine:
 * ```
 *   animation ON:   closed → entering → open → exiting → closed
 *   animation OFF:  closed →            open → exiting → closed
 *   interrupts:     entering → exiting (close mid-entry)
 *                   exiting  → entering (reopen mid-exit, animated)
 *                   exiting  → open     (reopen mid-handshake, non-animated)
 * ```
 */
export type TPhase = 'closed' | 'entering' | 'open' | 'exiting';

type TVisibilityAction =
	| { type: 'open-requested'; willAnimate: boolean }
	| { type: 'close-requested' }
	| { type: 'exit-started' }
	| { type: 'entry-settled' }
	| { type: 'exit-settled' };

type TVisibilityState = {
	phase: TPhase;
	// Tracks controlled prop intent separately from browser-driven phase changes.
	controlledIntent: 'open' | 'closed';
};

function getInitialVisibilityState({
	isOpen,
	willAnimate,
}: {
	isOpen: boolean;
	willAnimate: boolean;
}): TVisibilityState {
	if (!isOpen) {
		return { phase: 'closed', controlledIntent: 'closed' };
	}

	if (willAnimate) {
		return { phase: 'entering', controlledIntent: 'open' };
	}

	return { phase: 'open', controlledIntent: 'open' };
}

/**
 * Applies one lifecycle event to the current visibility phase.
 *
 * Events that are stale for the current phase are ignored. This allows
 * animation callbacks and native close events to settle safely after an
 * interrupted lifecycle.
 */
function getNextVisibilityState(
	state: TVisibilityState,
	action: TVisibilityAction,
): TVisibilityState {
	if (action.type === 'open-requested') {
		const shouldEnter =
			state.phase === 'closed' ||
			(state.phase === 'exiting' && state.controlledIntent === 'closed');

		if (shouldEnter && action.willAnimate) {
			return { phase: 'entering', controlledIntent: 'open' };
		}

		if (shouldEnter) {
			return { phase: 'open', controlledIntent: 'open' };
		}

		return { ...state, controlledIntent: 'open' };
	}

	if (action.type === 'close-requested') {
		return { ...state, controlledIntent: 'closed' };
	}

	if (action.type === 'exit-started') {
		if (state.phase !== 'open' && state.phase !== 'entering') {
			return state;
		}

		return { ...state, phase: 'exiting' };
	}

	if (action.type === 'entry-settled') {
		if (state.phase !== 'entering') {
			return state;
		}

		return { ...state, phase: 'open' };
	}

	if (action.type === 'exit-settled') {
		if (state.phase !== 'exiting') {
			return state;
		}

		return { ...state, phase: 'closed' };
	}

	return state;
}

/**
 * Coordinates controlled intent, native visibility, lifecycle phase, and host
 * mounting around CSS exit transitions. The canonical contract is documented in
 * `notes/architecture/animations.md#canonical-visibility-lifecycle-contract`.
 *
 * Used by both `Popover` and `Dialog` to share the same lifecycle logic. Those
 * components own native event binding, show and hide commands, and
 * component-specific event handling. This hook returns stable `onBeforeToggle`
 * and `onToggle` callbacks that advance lifecycle phase and host mounting.
 *
 * The host element is rendered while `phase !== 'closed'`. The `exiting`
 * phase keeps it mounted until its CSS animation settles or, with animation
 * disabled, until the browser reports that the native element has closed.
 *
 * ```
 * isOpen:  true ──────────────── false
 * phase:   open ──────────────── exiting ─── (exit settle) ─── closed
 * ```
 */
export function useAnimatedVisibility({
	isOpen,
	shouldAnimate,
	elementRef,
	onEnterFinish,
	onExitFinish,
}: TUseAnimatedVisibilityArgs): TUseAnimatedVisibilityResult {
	const willAnimate = shouldAnimate && !prefersReducedMotion();

	const [visibilityState, dispatch] = useReducer(
		getNextVisibilityState,
		{ isOpen, willAnimate },
		getInitialVisibilityState,
	);
	const { phase, controlledIntent } = visibilityState;

	// Keep stable refs to the latest callbacks so effects and animation settlement closures
	// always call the current callback without needing them in dependency arrays.
	const onEnterFinishRef = useRef(onEnterFinish);
	const onExitFinishRef = useRef(onExitFinish);
	const willAnimateRef = useRef(willAnimate);
	useLayoutEffect(() => {
		onEnterFinishRef.current = onEnterFinish;
		onExitFinishRef.current = onExitFinish;
		willAnimateRef.current = willAnimate;
	}, [onEnterFinish, onExitFinish, willAnimate]);

	// Synchronize controlled intent during render so opening mounts the host in
	// the same commit. Keeping the processed intent in reducer state prevents a
	// browser-driven exit from being mistaken for a new controlled open request.
	if (isOpen && controlledIntent === 'closed') {
		dispatch({ type: 'open-requested', willAnimate });
	}

	if (!isOpen && controlledIntent === 'open') {
		dispatch({ type: 'close-requested' });
	}

	// Entry can commit `open` before its callback because the host stays mounted.
	// This ensures consumers observe the settled DOM rather than entering styles.
	// Treat the phase before the initial commit as closed so an initially open host
	// notifies consumers.
	const prevPhaseRef = useRef<TPhase>('closed');
	useEffect(() => {
		const prevPhase = prevPhaseRef.current;
		prevPhaseRef.current = phase;
		if (prevPhase === phase) {
			return;
		}

		if (phase === 'open') {
			onEnterFinishRef.current?.();
		}
	}, [phase]);

	const isMounted = phase !== 'closed';

	const cancelExitSettlementRef = useRef<() => void>(() => {});

	// Exit must notify consumers before `closed` unmounts the host.
	const settleExit = useCallback(() => {
		onExitFinishRef.current?.();
		dispatch({ type: 'exit-settled' });
	}, []);

	// Primitives bind these stable callbacks to their native lifecycle events.
	// This keeps event ownership at the primitive while the hook owns state transitions.
	const onBeforeToggle = useCallback((event: ToggleEvent) => {
		// Any native transition supersedes a previous exit snapshot. This prevents
		// a stale settlement from closing a host that is reopening or closing again.
		cancelExitSettlementRef.current();
		// Snapshot currentTarget because the DOM clears it after event dispatch.
		const element = event.currentTarget;

		if (event.newState === 'open' && element instanceof HTMLElement) {
			element.removeAttribute('inert');
			element.removeAttribute('aria-hidden');
		}

		if (event.newState === 'closed') {
			if (element instanceof HTMLElement) {
				// We use a microtask to let native focus restoration happen before making the element inert.
				// The browser restores focus after beforetoggle returns, during its close steps.
				queueMicrotask(() => {
					// A controlled close can be interrupted by isOpen changing back to true,
					// which reopens the element before this microtask runs.
					if (isNativeElementOpen({ element })) {
						return;
					}

					// Exit animations keep closed content rendered, so make it non-interactive and hide it from assistive technology.
					element.setAttribute('inert', '');
					// Tooling does not consistently treat inert content as hidden, even though the browser does.
					element.setAttribute('aria-hidden', 'true');
				});
			}

			dispatch({ type: 'exit-started' });
		}
	}, []);

	const onToggle = useCallback(
		(event: ToggleEvent) => {
			if (event.newState !== 'closed') {
				return;
			}

			if (!willAnimateRef.current) {
				cancelExitSettlementRef.current = runCancellableSettlement({
					schedule: queueMicrotask,
					onSettled: settleExit,
				});
				return;
			}

			const element = elementRef.current;
			if (!element) {
				return;
			}

			// The closed `toggle` is task-queued after synchronous `beforetoggle`.
			// Snapshot here so the exiting phase styles have committed and the list
			// represents the animations that actually govern exit settlement.
			cancelExitSettlementRef.current = runOnAnimationsSettled({
				element,
				onSettled: settleExit,
			});
		},
		[elementRef, settleExit],
	);

	useLayoutEffect(
		() => () => {
			// Prevent a pending animation or microtask from notifying after unmount.
			cancelExitSettlementRef.current();
		},
		[],
	);

	// Entry settlement only removes entering styles. Its callback runs after the
	// resulting `open` commit in the effect above.
	useEffect(
		function settleEntry() {
			if (phase !== 'entering') {
				return;
			}

			if (!willAnimate) {
				dispatch({ type: 'entry-settled' });
				return;
			}

			const element = elementRef.current;
			if (!element) {
				return;
			}

			return runOnAnimationsSettled({
				element,
				onSettled() {
					dispatch({ type: 'entry-settled' });
				},
			});
		},
		[phase, willAnimate, elementRef],
	);

	return { phase, isMounted, onBeforeToggle, onToggle };
}
