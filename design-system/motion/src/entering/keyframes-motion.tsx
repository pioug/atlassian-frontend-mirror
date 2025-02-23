import React, { type Ref, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ClassNames, type CSSObject, keyframes } from '@emotion/react';

import { reduceMotionAsPerUserPreference } from '../utils/accessibility';
import { type Durations, durations, exitingDurations } from '../utils/durations';
import { useSetTimeout } from '../utils/timer-hooks';

import { useExitingPersistence } from './exiting-persistence';
import { useStaggeredEntrance } from './staggered-entrance';
import { type AnimationCurve, type MotionProps } from './types';

/**
 * These are props that motions should use as their external props for consumers.
 * See [FadeIn](packages/helpers/motion/src/entering/fade-in.tsx) for an example usage.
 */
export interface KeyframesMotionProps extends MotionProps<{ className: string; ref: Ref<any> }> {
	/**
	 * Can be used to pause the animation before it has finished.
	 */
	isPaused?: boolean;
}

interface InternalKeyframesMotionProps extends KeyframesMotionProps {
	/**
	 * Timing function to be used with the animation.
	 * Useful if you want a different curve when entering vs. exiting.
	 */
	animationTimingFunction: AnimationCurve;

	/**
	 * Timing function to be used with the animation when exiting.
	 * If not provided, it will default to the entering animation timing function.
	 */
	animationTimingFunctionExiting?: AnimationCurve;

	/**
	 * CSS keyframes for the entering animation.
	 */
	enteringAnimation: CSSObject;

	/**
	 * CSS keyframes for the exiting animation.
	 */
	exitingAnimation?: CSSObject;

	/**.
	 * How long the motion will take.
	 */
	duration: Durations;
}

/**
 * This is the base INTERNAL component used for all other entering motions.
 * This does not need Javascript to execute on the client so it will run immediately
 * for any SSR rendered React apps before the JS has executed.
 */
const EnteringMotion = ({
	children,
	animationTimingFunction,
	animationTimingFunctionExiting = animationTimingFunction,
	enteringAnimation,
	exitingAnimation = enteringAnimation,
	isPaused,
	onFinish: onFinishMotion,
	duration = 'large',
}: InternalKeyframesMotionProps) => {
	const staggered = useStaggeredEntrance();
	const { isExiting, onFinish: onExitFinished, appear } = useExitingPersistence();
	const setTimeout = useSetTimeout();
	const paused = isPaused || !staggered.isReady;
	const delay = isExiting ? 0 : staggered.delay;
	const state = isExiting ? 'exiting' : 'entering';
	const [hasAnimationStyles, setHasAnimationStyles] = useState(appear);

	useEffect(() => {
		// Tracking this to prevent changing state on an unmounted component
		let isCancelled = false;

		if (paused) {
			return;
		}

		// On initial mount if elements aren't set to animate on appear, we return early and callback
		if (!appear) {
			onFinishMotion && onFinishMotion(state);
			return;
		}

		// Elements may need animation styles back after initial mount (they could animate out)
		setHasAnimationStyles(true);

		setTimeout(
			() => {
				if (state === 'exiting') {
					onExitFinished && onExitFinished();
				}
				if (!isCancelled) {
					setHasAnimationStyles(false);
				}
				onFinishMotion && onFinishMotion(state);
			},
			isExiting ? exitingDurations[duration] : durations[duration] + delay,
		);

		return () => {
			isCancelled = true;
		};
		// We ignore this for onFinishMotion as consumers could potentially inline the function
		// which would then trigger this effect every re-render.
		// We want to make it easier for consumers so we go down this path unfortunately.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onExitFinished, state, isExiting, duration, delay, paused, setTimeout]);

	return (
		<ClassNames>
			{({ css, cx }) =>
				children(
					{
						ref: staggered.ref,
						className: hasAnimationStyles
							? cx(
									css({
										...reduceMotionAsPerUserPreference,
										animationDelay: `${delay}ms`,
										animationFillMode: 'backwards',
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
										animationName: keyframes(enteringAnimation),
										animationPlayState: 'running',
									}),
									paused && css({ animationPlayState: 'paused' }),
									duration === 'small' && css({ animationDuration: '100ms' }),
									duration === 'medium' && css({ animationDuration: '350ms' }),
									duration === 'large' && css({ animationDuration: '700ms' }),
									isExiting && duration === 'small' && css({ animationDuration: '50ms' }),
									isExiting && duration === 'medium' && css({ animationDuration: '175ms' }),
									isExiting && duration === 'large' && css({ animationDuration: '350ms' }),
									isExiting &&
										css({
											animationDelay: '0ms',
											animationFillMode: 'forwards',
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
											animationName: keyframes(exitingAnimation),
										}),

									!isExiting &&
										animationTimingFunction === 'linear' &&
										css({ animationTimingFunction: 'cubic-bezier(0,0,1,1)' }),
									!isExiting &&
										animationTimingFunction === 'ease-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.2,0,0,1)' }),
									!isExiting &&
										animationTimingFunction === 'ease-in' &&
										css({ animationTimingFunction: 'cubic-bezier(0.8,0,0,0.8)' }),
									!isExiting &&
										animationTimingFunction === 'ease-in-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.15,1,0.3,1)' }),
									isExiting &&
										animationTimingFunction === 'linear' &&
										css({ animationTimingFunction: 'cubic-bezier(0,0,1,1)' }),
									isExiting &&
										animationTimingFunctionExiting === 'ease-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.2,0,0,1)' }),
									isExiting &&
										animationTimingFunctionExiting === 'ease-in' &&
										css({ animationTimingFunction: 'cubic-bezier(0.8,0,0,0.8)' }),
									isExiting &&
										animationTimingFunctionExiting === 'ease-in-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.15,1,0.3,1)' }),
								)
							: '',
					},
					state,
				)
			}
		</ClassNames>
	);
};

export default EnteringMotion;
