import { type RefObject, useCallback, useEffect, useReducer, useRef } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { isNativeElementOpen } from './is-native-element-open';
import { prefersReducedMotion } from './reduced-motion';

type TRunCancellableSettlementArgs = {
	schedule: (settle: () => void) => void;
	onSettled: () => void;
};

/**
 * Calls `schedule` with a `settle` callback, and `settle` calls `onSettled`.
 * The returned cleanup makes `settle` do nothing, so an interrupted or
 * unmounted lifecycle cannot call a stale `onSettled`.
 */
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
		isCancelled = true;
	};
}

type TRunOnAnimationsSettledArgs = {
	element: HTMLElement;
	onSettled: () => void;
};

/**
 * Calls `onSettled` when all animations on `element` at the time of the call
 * finish or are cancelled. With no animations, it settles in a promise
 * microtask. Returns a cleanup that stops a stale `onSettled` call.
 */
function runOnAnimationsSettled({ element, onSettled }: TRunOnAnimationsSettledArgs): () => void {
	return runCancellableSettlement({
		onSettled,
		schedule: (settle) => {
			// Some environments, such as jsdom, do not implement `getAnimations`.
			const animations = element.getAnimations?.() ?? [];
			Promise.allSettled(animations.map((animation) => animation.finished)).then(settle);
		},
	});
}

/**
 * Visibility lifecycle phase shared by `useAnimatedVisibility`, `useFocusWrap`,
 * `useInitialFocus`, `Popover` and `Dialog`.
 *
 * - `closed`: the host element is unmounted.
 * - `entering`: the host element is mounted and its CSS entry animation is
 *   playing. **Only used when animation is enabled.** With animation disabled,
 *   the lifecycle goes directly from `closed` to `open`.
 * - `open`: the host element is mounted and settled. No entry or exit
 *   animation is playing.
 * - `exiting`: a native close has started, and the host element stays mounted.
 *   Usually `isOpen` changed to `false`, but a browser dismiss can also start
 *   this phase while controlled intent is still open. With animation disabled,
 *   this phase lasts until the browser's closed `toggle` fires, so native focus
 *   restoration can finish.
 *
 * State machine:
 * ```
 *   animation ON:   closed → entering → open → exiting → closed
 *   animation OFF:  closed →            open → exiting → closed
 *   interrupts:     entering → exiting (close mid-entry)
 *                   exiting  → entering (reopen mid-exit, animated)
 *                   exiting  → open     (reopen mid-exit, non-animated)
 *                   exiting  → open     (native reopen while controlled intent is open)
 * ```
 */
export type TPhase = 'closed' | 'entering' | 'open' | 'exiting';

/**
 * Lifecycle events for `getNextVisibilityState`.
 *
 * - `open-requested` and `close-requested`: `isOpen` changed.
 * - `native-close-started` and `native-open-started`: `beforetoggle` fired.
 * - `entry-settled` and `exit-settled`: the entry or exit animations settled.
 */
type TVisibilityAction =
	| { type: 'open-requested'; willAnimate: boolean }
	| { type: 'close-requested' }
	| { type: 'native-close-started' }
	| { type: 'native-open-started' }
	| { type: 'entry-settled' }
	| { type: 'exit-settled' };

type TVisibilityState = {
	phase: TPhase;
	// The last `isOpen` value the hook processed. Browser events change `phase`, not this value.
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
 * Applies one lifecycle event to the current visibility state.
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

	if (action.type === 'native-close-started') {
		if (state.phase !== 'open' && state.phase !== 'entering') {
			return state;
		}

		return { ...state, phase: 'exiting' };
	}

	// A browser dismiss started the exit while controlled intent stayed open, and
	// the element was shown natively again before the exit settled. For example,
	// `@atlaskit/tooltip` calls `showPopover()` on `pointerup`, in the same task as
	// the light dismiss of a press. The element never painted closed, so go back
	// to `open`. See `notes/decisions/tooltip-stay-open-on-trigger-click.md`.
	if (action.type === 'native-open-started') {
		if (state.phase !== 'exiting' || state.controlledIntent !== 'open') {
			return state;
		}

		return { ...state, phase: 'open' };
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

type TUseAnimatedVisibilityArgs = {
	/**
	 * Controlled visibility intent from the consumer. This can temporarily differ
	 * from native visibility during browser-initiated dismissal and close settlement.
	 */
	isOpen: boolean;
	/**
	 * Whether to play the entry and exit animations. Animation is also disabled
	 * when the user prefers reduced motion.
	 */
	shouldAnimate: boolean;
	/**
	 * Ref to the host element. The hook waits for its active animations to settle.
	 */
	elementRef: RefObject<HTMLElement | null>;
	/**
	 * Called after each commit that moves the phase to `open`, so the callback
	 * observes the host without its entering styles. This includes the initial
	 * mount with `isOpen=true`.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the native closed `toggle` fires and any exit animations
	 * settle. With animation disabled, this still waits for the task-queued
	 * `toggle`. It runs just before the phase becomes `closed`, so the host is
	 * still mounted.
	 */
	onExitFinish?: () => void;
};

type TUseAnimatedVisibilityResult = {
	/**
	 * Current lifecycle phase.
	 */
	phase: TPhase;
	/**
	 * `true` while the host is mounted. Same as `phase !== 'closed'`.
	 */
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
 * Coordinates controlled intent, native visibility, lifecycle phase and host
 * mounting for `Popover` and `Dialog`. The canonical contract is documented in
 * `notes/architecture/animations.md#canonical-visibility-lifecycle-contract`.
 *
 * The components own native event binding, show and hide commands, and
 * component-specific event handling. They bind the stable `onBeforeToggle`
 * and `onToggle` callbacks from this hook, and the hook owns phase changes.
 *
 * The host element is rendered while `phase !== 'closed'`. The `exiting`
 * phase keeps it mounted until its exit animations settle or, with animation
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

	// Refs hold the latest callbacks and `willAnimate`, so the stable callbacks, effects
	// and settlement closures read current values without them in dependency arrays.
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

	// Call `onEnterFinish` after the `open` commit, so consumers observe the
	// settled host and not its entering styles. Entry can wait for the commit
	// because the host stays mounted. The previous phase starts as `closed`, so
	// a host that is open on mount also calls `onEnterFinish`.
	const previousPhaseRef = useRef<TPhase>('closed');
	useEffect(() => {
		const previousPhase = previousPhaseRef.current;
		previousPhaseRef.current = phase;
		if (previousPhase === phase) {
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

	const onBeforeToggle = useCallback((event: ToggleEvent) => {
		// Any native toggle cancels a pending exit settlement, so a stale
		// settlement cannot close a host that is reopening or closing again.
		cancelExitSettlementRef.current();
		// Snapshot `currentTarget`, because the DOM clears it after event dispatch.
		const element = event.currentTarget;

		if (event.newState === 'open') {
			// Undo the `inert` and `aria-hidden` that a previous close added.
			if (element instanceof HTMLElement) {
				element.removeAttribute('inert');
				element.removeAttribute('aria-hidden');
			}
			// Dispatched on every native open. The reducer only acts when a browser
			// dismiss left the host `exiting` while `isOpen` stayed `true`.
			dispatch({ type: 'native-open-started' });
		}

		if (event.newState === 'closed') {
			if (element instanceof HTMLElement) {
				// Wait a microtask so native focus restoration runs before the host
				// becomes inert. The browser restores focus after `beforetoggle`
				// returns, during its close steps.
				queueMicrotask(() => {
					// A controlled close can be interrupted by `isOpen` changing back to
					// `true`, which reopens the element before this microtask runs.
					if (isNativeElementOpen({ element })) {
						return;
					}

					// Exit animations keep the closed host rendered, so make it
					// non-interactive and hide it from assistive technology.
					element.setAttribute('inert', '');
					// Tooling does not consistently treat inert content as hidden, even
					// though the browser does.
					element.setAttribute('aria-hidden', 'true');
				});
			}

			dispatch({ type: 'native-close-started' });
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

			// The closed `toggle` is task-queued after the synchronous `beforetoggle`.
			// By now the `exiting` styles have committed, so the snapshot holds the
			// animations that decide when the exit settles.
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

	// Entry settlement moves the phase to `open`, which removes the entering
	// styles. The effect above then calls `onEnterFinish`.
	useEffect(
		function settleEntry() {
			if (phase !== 'entering') {
				return;
			}

			// Animation was disabled during entry, so settle now.
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
