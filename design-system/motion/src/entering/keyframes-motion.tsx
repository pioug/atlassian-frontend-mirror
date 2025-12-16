import React, { type Ref, useEffect, useState } from 'react';

import { ClassNames, keyframes } from '@compiled/react';
import { ax } from '@compiled/react/runtime';

import { isReducedMotion } from '../utils/accessibility';
import { type Durations, durations, exitingDurations } from '../utils/durations';
import { useSetTimeout } from '../utils/timer-hooks';

import { useExitingPersistence } from './exiting-persistence';
import { useStaggeredEntrance } from './staggered-entrance';
import { type AnimationCurve, type Direction, type MotionProps } from './types';

const zoomIn = keyframes({
	'0%': { opacity: 0, transform: 'scale(0.5)' },
	'50%': { opacity: 1 },
	'75%': { transform: 'scale(1.25)' },
	'100%': { transform: 'scale(1)' },
});

const zoomOut = keyframes({
	to: { opacity: 0, transform: 'scale(0.75)' },
});

const fadeIn = keyframes({
	'0%': { opacity: 0 },
	'50%': { opacity: 1 },
	'100%': { opacity: 1 },
});

const fadeOut = keyframes({
	'0%': { opacity: 1 },
	'100%': { opacity: 0 },
});

const fadeInFromTop = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(0, calc(-5% - 4px), 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromTop = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(0, calc(-5% - 4px), 0)' },
});

const fadeInFromLeft = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(calc(-5% - 4px), 0, 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromLeft = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(calc(-5% - 4px), 0, 0)' },
});

const fadeInFromBottom = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(0, calc(5% + 4px), 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromBottom = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(0, calc(5% + 4px), 0)' },
});

const fadeInFromRight = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(calc(5% + 4px), 0, 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromRight = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(calc(5% + 4px), 0, 0)' },
});

const fadeInFromTopConstant = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(0, -4px, 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromTopConstant = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(0, -4px, 0)' },
});

const fadeInFromLeftConstant = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(-4px, 0, 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromLeftConstant = keyframes({
	'0%': { opacity: 1, transform: 'translate3d' },
	'100%': { opacity: 0, transform: 'translate3d(-4px, 0, 0)' },
});

const fadeInFromBottomConstant = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(0, 4px, 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromBottomConstant = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(0, 4px, 0)' },
});

const fadeInFromRightConstant = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(4px, 0, 0)' },
	'50%': { opacity: 1 },
	'100%': { opacity: 1, transform: 'none' },
});

const fadeOutFromRightConstant = keyframes({
	'0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
	'100%': { opacity: 0, transform: 'translate3d(4px, 0, 0)' },
});

const slideInFromTop = keyframes({
	'0%': { transform: 'translate3d(0, -100%, 0)', opacity: 0 },
	'100%': { transform: 'none', opacity: 1 },
});

const slideOutFromTop = keyframes({
	'0%': { transform: 'none', opacity: 1 },
	'100%': { transform: 'translate3d(0, -100%, 0)', opacity: 0 },
});

const slideInFromRight = keyframes({
	'0%': { transform: 'translate3d(100%, 0, 0)', opacity: 0 },
	'100%': { transform: 'none', opacity: 1 },
});

const slideOutFromRight = keyframes({
	'0%': { transform: 'none', opacity: 1 },
	'100%': { transform: 'translate3d(100%, 0, 0)', opacity: 0 },
});

const slideInFromBottom = keyframes({
	'0%': { transform: 'translate3d(0, 100%, 0)', opacity: 0 },
	'100%': { transform: 'none', opacity: 1 },
});

const slideOutFromBottom = keyframes({
	'0%': { transform: 'none', opacity: 1 },
	'100%': { transform: 'translate3d(0, 100%, 0)', opacity: 0 },
});

const slideInFromLeft = keyframes({
	'0%': { transform: 'translate3d(-100%, 0, 0)', opacity: 0 },
	'100%': { transform: 'none', opacity: 1 },
});

const slideOutFromLeft = keyframes({
	'0%': { transform: 'none', opacity: 1 },
	'100%': { transform: 'translate3d(-100%, 0, 0)', opacity: 0 },
});

export type Animations =
	| 'fade-in'
	| 'fade-out'
	| 'zoom-in'
	| 'zoom-out'
	| `slide-${'in' | 'out'}-from-${Direction}`
	| `slide-${'in' | 'out'}-from-${Direction}`
	| `fade-${'in' | 'out'}-from-${Direction}`
	| `fade-${'in' | 'out'}-from-${Direction}-constant`;

/**
 * These are props that motions should use as their external props for consumers.
 * See [FadeIn](packages/helpers/motion/src/entering/fade-in.tsx) for an example usage.
 */
export interface KeyframesMotionProps
	extends MotionProps<{ className: string; style: Record<string, any>; ref: Ref<any> }> {
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
	enteringAnimation: Animations;

	/**
	 * CSS keyframes for the exiting animation.
	 */
	exitingAnimation?: Animations;

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
}: InternalKeyframesMotionProps): React.JSX.Element => {
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

		/**
		 * Updates relevant state.
		 * Called when the animation is finished, or immediately with reduced motion.
		 */
		const onAnimationEnd = () => {
			if (state === 'exiting') {
				// Updates the `ExitingPersistence` to remove this child
				onExitFinished?.();
			}
			if (!isCancelled) {
				setHasAnimationStyles(false);
			}
			onFinishMotion?.(state);
		};

		if (isReducedMotion()) {
			// If there is reduced motion there is no exit animation, so call this immediately
			onAnimationEnd();
			return;
		}

		// Elements may need animation styles back after initial mount (they could animate out)
		setHasAnimationStyles(true);

		// Queue `onAnimationEnd` for after the animation has finished
		setTimeout(
			onAnimationEnd,
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
			{({ css }) =>
				children(
					{
						ref: staggered.ref,
						// @ts-expect-error: `ax` is not typed correctly
						className: hasAnimationStyles
							? ax([
									css({
										animationFillMode: 'backwards',
										animationPlayState: 'running',
										'@media (prefers-reduced-motion: reduce)': {
											animation: 'none',
											transition: 'none',
										},
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
										animationTimingFunction === 'ease-in-40-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.4,0,0,1)' }),
									!isExiting &&
										animationTimingFunction === 'ease-in-60-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.6,0,0,1)' }),
									!isExiting &&
										animationTimingFunction === 'ease-in-80-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.8,0,0,1)' }),
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
										animationTimingFunctionExiting === 'ease-in-40-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.4,0,0,1)' }),
									isExiting &&
										animationTimingFunctionExiting === 'ease-in-60-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.6,0,0,1)' }),
									isExiting &&
										animationTimingFunctionExiting === 'ease-in-80-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.8,0,0,1)' }),
									isExiting &&
										animationTimingFunctionExiting === 'ease-in-out' &&
										css({ animationTimingFunction: 'cubic-bezier(0.15,1,0.3,1)' }),

									((!isExiting && enteringAnimation === 'fade-in') ||
										(isExiting && exitingAnimation === 'fade-in')) &&
										css({ animationName: fadeIn }),
									((!isExiting && enteringAnimation === 'fade-out') ||
										(isExiting && exitingAnimation === 'fade-out')) &&
										css({ animationName: fadeOut }),
									((!isExiting && enteringAnimation === 'zoom-in') ||
										(isExiting && exitingAnimation === 'zoom-in')) &&
										css({ animationName: zoomIn }),
									((!isExiting && enteringAnimation === 'zoom-out') ||
										(isExiting && exitingAnimation === 'zoom-out')) &&
										css({ animationName: zoomOut }),
									((!isExiting && enteringAnimation === 'slide-in-from-top') ||
										(isExiting && exitingAnimation === 'slide-in-from-top')) &&
										css({ animationName: slideInFromTop }),
									((!isExiting && enteringAnimation === 'slide-out-from-top') ||
										(isExiting && exitingAnimation === 'slide-out-from-top')) &&
										css({ animationName: slideOutFromTop }),
									((!isExiting && enteringAnimation === 'slide-in-from-right') ||
										(isExiting && exitingAnimation === 'slide-in-from-right')) &&
										css({ animationName: slideInFromRight }),
									((!isExiting && enteringAnimation === 'slide-out-from-right') ||
										(isExiting && exitingAnimation === 'slide-out-from-right')) &&
										css({ animationName: slideOutFromRight }),
									((!isExiting && enteringAnimation === 'slide-in-from-bottom') ||
										(isExiting && exitingAnimation === 'slide-in-from-bottom')) &&
										css({ animationName: slideInFromBottom }),
									((!isExiting && enteringAnimation === 'slide-out-from-bottom') ||
										(isExiting && exitingAnimation === 'slide-out-from-bottom')) &&
										css({ animationName: slideOutFromBottom }),
									((!isExiting && enteringAnimation === 'slide-in-from-left') ||
										(isExiting && exitingAnimation === 'slide-in-from-left')) &&
										css({ animationName: slideInFromLeft }),
									((!isExiting && enteringAnimation === 'slide-out-from-left') ||
										(isExiting && exitingAnimation === 'slide-out-from-left')) &&
										css({ animationName: slideOutFromLeft }),
									((!isExiting && enteringAnimation === 'fade-in-from-top') ||
										(isExiting && exitingAnimation === 'fade-in-from-top')) &&
										css({ animationName: fadeInFromTop }),
									((!isExiting && enteringAnimation === 'fade-out-from-top') ||
										(isExiting && exitingAnimation === 'fade-out-from-top')) &&
										css({ animationName: fadeOutFromTop }),
									((!isExiting && enteringAnimation === 'fade-in-from-left') ||
										(isExiting && exitingAnimation === 'fade-in-from-left')) &&
										css({ animationName: fadeInFromLeft }),
									((!isExiting && enteringAnimation === 'fade-out-from-left') ||
										(isExiting && exitingAnimation === 'fade-out-from-left')) &&
										css({ animationName: fadeOutFromLeft }),
									((!isExiting && enteringAnimation === 'fade-in-from-bottom') ||
										(isExiting && exitingAnimation === 'fade-in-from-bottom')) &&
										css({ animationName: fadeInFromBottom }),
									((!isExiting && enteringAnimation === 'fade-out-from-bottom') ||
										(isExiting && exitingAnimation === 'fade-out-from-bottom')) &&
										css({ animationName: fadeOutFromBottom }),
									((!isExiting && enteringAnimation === 'fade-in-from-right') ||
										(isExiting && exitingAnimation === 'fade-in-from-right')) &&
										css({ animationName: fadeInFromRight }),
									((!isExiting && enteringAnimation === 'fade-out-from-right') ||
										(isExiting && exitingAnimation === 'fade-out-from-right')) &&
										css({ animationName: fadeOutFromRight }),
									((!isExiting && enteringAnimation === 'fade-in-from-top-constant') ||
										(isExiting && exitingAnimation === 'fade-in-from-top-constant')) &&
										css({ animationName: fadeInFromTopConstant }),
									((!isExiting && enteringAnimation === 'fade-out-from-top-constant') ||
										(isExiting && exitingAnimation === 'fade-out-from-top-constant')) &&
										css({ animationName: fadeOutFromTopConstant }),
									((!isExiting && enteringAnimation === 'fade-in-from-left-constant') ||
										(isExiting && exitingAnimation === 'fade-in-from-left-constant')) &&
										css({ animationName: fadeInFromLeftConstant }),
									((!isExiting && enteringAnimation === 'fade-out-from-left-constant') ||
										(isExiting && exitingAnimation === 'fade-out-from-left-constant')) &&
										css({ animationName: fadeOutFromLeftConstant }),
									((!isExiting && enteringAnimation === 'fade-in-from-bottom-constant') ||
										(isExiting && exitingAnimation === 'fade-in-from-bottom-constant')) &&
										css({ animationName: fadeInFromBottomConstant }),
									((!isExiting && enteringAnimation === 'fade-out-from-bottom-constant') ||
										(isExiting && exitingAnimation === 'fade-out-from-bottom-constant')) &&
										css({ animationName: fadeOutFromBottomConstant }),
									((!isExiting && enteringAnimation === 'fade-in-from-right-constant') ||
										(isExiting && exitingAnimation === 'fade-in-from-right-constant')) &&
										css({ animationName: fadeInFromRightConstant }),
									((!isExiting && enteringAnimation === 'fade-out-from-right-constant') ||
										(isExiting && exitingAnimation === 'fade-out-from-right-constant')) &&
										css({ animationName: fadeOutFromRightConstant }),
								])
							: '',
						style: {
							animationDelay: `${delay}ms`,
						},
					},
					state,
				)
			}
		</ClassNames>
	);
};

export default EnteringMotion;
