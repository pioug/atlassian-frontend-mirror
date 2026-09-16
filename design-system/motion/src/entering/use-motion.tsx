import { useCallback, useEffect, useRef, useState } from 'react';

import { type StrictXCSSProp } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { getComputedAnimationDurationMs } from '../utils/get-computed-animation-duration-ms';
import { getDurationMs } from '../utils/get-duration-ms';
import { isReducedMotion } from '../utils/is-reduced-motion';
import { resolveMotionToken } from '../utils/resolve-motion-token';

import { Reanimate } from './reanimate';
import { type Transition } from './types';
import { useExitingPersistence } from './use-exiting-persistence';
import { useStaggeredEntrance } from './use-staggered-entrance';

export type CustomMotionXCSS = StrictXCSSProp<
	'animationName' | 'animationDuration' | 'animationTimingFunction' | 'animationDelay',
	never
>;

type MotionState = 'init' | 'entering' | 'visible' | 'exiting' | 'hidden';

export interface UseMotionProps {
	/**
	 * Will callback when the motion has finished in the particular direction.
	 * If it finished entering direction will be `entering`.
	 * And vice versa for `exiting`.
	 */
	onFinish?: (state: Transition) => void;

	initialState?: MotionState;
}

export interface UseMotionResult<T extends HTMLElement = HTMLElement> {
	/**
	 * Ref that __must__ be attached to the animated element. It is used internally to
	 * measure the animation duration so the exit animation can complete before the
	 * element is removed (via `ExitingPersistence`) and before `onFinish` is called.
	 */
	ref: (node: T | null) => void;

	/**
	 * Imperative handle to reanimate the motion. Intended for advanced use cases such
	 * as exit-then-enter transitions.
	 */
	reanimate: (value: Reanimate) => void;

	/**
	 * The current motion state.
	 */
	state: MotionState;
}

/**
 * __useMotion__
 *
 * A hook form of the `Motion` primitive. It manages the entering/exiting animation
 * lifecycle and returns `{ ref, reanimate, state }` so that motion can be applied to
 * an existing element __without__ introducing an extra wrapper element. The consumer
 * drives the animation styling from `state` (e.g. via a `cssMap`) and applies the
 * animation to their own element.
 *
 * The returned `ref` __must__ be attached to the animated element, otherwise exit
 * timing, `onFinish`, and `ExitingPersistence` removal will not work.
 */
export function useMotion<T extends HTMLElement = HTMLElement>({
	onFinish: onFinishMotion,
	initialState,
}: UseMotionProps = {}): UseMotionResult<T> {
	const reducedMotion = isReducedMotion();
	const staggered = useStaggeredEntrance();
	const { isExiting, onFinish: onExitFinished, appear } = useExitingPersistence();
	const staggeredDelay = isExiting ? 0 : staggered.delay;
	const staggeredIsReady = staggered.isReady;

	const [state, setState] = useState<MotionState>(
		initialState ??
			(appear ? (staggeredIsReady && !staggeredDelay ? 'entering' : 'init') : 'visible'),
	);
	// ExitingPersistence must win during render so consumers apply exit styles before layout effects.
	// The lifecycle effect below uses the same value to measure and finish that exit.
	const motionState: MotionState = isExiting ? 'exiting' : state;

	const elementRef = useRef<T | null>(null);
	const reanimateRef = useRef<Reanimate>();
	const animationRef = useRef<ReturnType<typeof setTimeout>>();
	const staggeredEntryRef = useRef<ReturnType<typeof setTimeout>>();

	/**
	 * Updates relevant state.
	 * Called when the animation is finished, or immediately with reduced motion.
	 */
	const onAnimationEnd = useCallback(
		(currentState: MotionState, cancelled: boolean) => {
			// We are done animating, so we set the state to visible
			let newState: MotionState = 'visible';
			if (currentState === 'exiting') {
				if (!reanimateRef.current) {
					// Updates the `ExitingPersistence` to remove this child
					onExitFinished?.();
				}
				onFinishMotion?.('exiting');
			}
			if (currentState === 'entering') {
				onFinishMotion?.('entering');
			}

			if (reanimateRef.current === Reanimate.exit_then_enter) {
				// We are done exiting, so we set the state to entering
				reanimateRef.current = Reanimate.enter;
				newState = 'entering';
			} else if (reanimateRef.current === Reanimate.enter) {
				// We are done reanimating, so we clear the reanimate state
				reanimateRef.current = undefined;
			} else if (reanimateRef.current === Reanimate.exit) {
				// We are done reanimating, so we clear the reanimate state
				reanimateRef.current = undefined;
				newState = 'hidden';
			}

			if (!cancelled) {
				setState(newState);
			}

			// We ignore this for onFinishMotion as consumers could potentially inline the function
			// which would then trigger this effect every re-render.
			// We want to make it easier for consumers so we go down this path unfortunately.
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[onExitFinished],
	);

	// Handles staggered entry
	useEffect(() => {
		if (state !== 'init') {
			return;
		}

		if (reducedMotion) {
			onAnimationEnd('entering', false);
			return;
		}

		// We delay the entry animation by the stagger delay
		staggeredEntryRef.current = setTimeout(() => {
			setState('entering');
		}, staggeredDelay);

		return () => {
			if (staggeredEntryRef.current) {
				clearTimeout(staggeredEntryRef.current);
			}
		};
	}, [onAnimationEnd, state, staggeredIsReady, staggeredDelay, reducedMotion]);

	useEffect(() => {
		// Tracking this to prevent changing state on an unmounted component
		let isCancelled = false;

		if (!staggeredIsReady) {
			return;
		}
		// On initial mount if elements aren't set to animate on appear, we return early and callback
		// This only occurs on initial mount, as appear will be true once the component is mounted
		if (!appear) {
			onFinishMotion && onFinishMotion('entering');
			return;
		}

		// If the state is visible, hidden or init, we don't need to do anything
		if (motionState === 'visible' || motionState === 'init' || motionState === 'hidden') {
			return;
		}

		// If there is reduced motion or no exit animation, we call the onAnimationEnd function immediately
		if (reducedMotion) {
			onAnimationEnd(motionState, isCancelled);
			return;
		}

		let animationDuration = 0;
		if (motionState === 'entering' || motionState === 'exiting') {
			if (elementRef.current) {
				if (elementRef.current.style.animation) {
					// Motion token
					const animationTimings = getDurationMs(
						resolveMotionToken(elementRef.current.style.animation),
					);
					animationDuration = animationTimings.duration;
					animationDuration += animationTimings.delay;
				} else {
					// Custom motion
					const computedStyles = window.getComputedStyle(elementRef.current);
					animationDuration = getComputedAnimationDurationMs(
						computedStyles.animationName,
						computedStyles.animationDuration,
						computedStyles.animationDelay,
					);
				}
			}
		}

		// Queue `onAnimationEnd` for after the animation has finished
		if (motionState === 'exiting') {
			animationRef.current = setTimeout(
				() => onAnimationEnd(motionState, isCancelled),
				animationDuration,
			);
		} else if (motionState === 'entering') {
			animationRef.current = setTimeout(
				() => onAnimationEnd(motionState, isCancelled),
				animationDuration,
			);
		}

		return () => {
			isCancelled = true;
			if (animationRef.current) {
				clearTimeout(animationRef.current);
			}
		};
		// We ignore this for onFinishMotion as consumers could potentially inline the function
		// which would then trigger this effect every re-render.
		// We want to make it easier for consumers so we go down this path unfortunately.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onAnimationEnd, motionState, appear, staggeredDelay, staggeredIsReady, reducedMotion]);

	const reanimate = useCallback((value: Reanimate) => {
		animationRef.current && clearTimeout(animationRef.current);
		reanimateRef.current = value;
		if (value === Reanimate.exit_then_enter) {
			setState('exiting');
		} else if (value === Reanimate.enter) {
			setState('entering');
		} else if (value === Reanimate.exit) {
			setState('exiting');
		}
	}, []);

	const ref = mergeRefs([staggered.ref, elementRef]);

	return {
		ref,
		reanimate,
		state: motionState,
	};
}
