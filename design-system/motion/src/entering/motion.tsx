/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import type { XCSSProp } from '@compiled/react';

import { cssMap, cx, jsx, type XCSSAllProperties, type XCSSAllPseudos } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { type Motion as MotionToken } from '@atlaskit/tokens/css-type-schema';

import { convertToMs } from '../utils/convert-to-ms';
import { getDurationMs } from '../utils/get-duration-ms';
import { isReducedMotion } from '../utils/is-reduced-motion';
import { resolveMotionToken } from '../utils/resolve-motion-token';

import { useExitingPersistence } from './exiting-persistence';
import { useStaggeredEntrance } from './staggered-entrance';
import { type Transition } from './types';

export type CustomMotionXCSS = XCSSProp<
	'animationName' | 'animationDuration' | 'animationTimingFunction' | 'animationDelay',
	never
>;

type MotionState = 'init' | 'entering' | 'exiting' | 'idle' | 'reanimating';

const styles = cssMap({
	base: {
		animationPlayState: 'running',
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
			transition: 'none',
		},
	},
	hidden: {
		visibility: 'hidden',
	},
	entering: {
		animationFillMode: 'backwards',
	},
	exiting: {
		animationFillMode: 'forwards',
	},
});

/**
 * Supported reanimate values.
 * 'enter' will re-enter the animation.
 * 'exit-then-enter' will exit the animation and then enter it again.
 */
export enum Reanimate {
	enter = 'enter',
	exit_then_enter = 'exit_then_enter',
}

export interface MotionRef {
	/**
	 * Reanimates the motion.
	 * @param value - The value to reanimate.
	 */
	reanimate: (value: Reanimate) => void;
}

export interface MotionProps {
	/**
	 * Will callback when the motion has finished in the particular direction.
	 * If it finished entering direction will be `entering`.
	 * And vice versa for `exiting`.
	 */
	onFinish?: (state: Transition) => void;

	/**
	 * Children to be animated.
	 */
	children: React.ReactNode;

	/**
	 * Motion token for the entering animation.
	 */
	enteringAnimation?: MotionToken;

	/**
	 * CSS properties to apply to the entering animation.
	 */
	enteringAnimationXcss?: CustomMotionXCSS;

	/**
	 * Motion token for the exiting animation.
	 */
	exitingAnimation?: MotionToken;

	/**
	 * CSS properties to apply to the exiting animation.
	 */
	exitingAnimationXcss?: CustomMotionXCSS;

	/**
	 * CSS properties to apply to the motion container.
	 */
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos>;

	/**
	 * Inline styles to apply to the motion container div.
	 * These are merged with any animation styles managed internally.
	 */
	style?: React.CSSProperties;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Motion__
 *
 * A motion primitive that can be used to animate the entry and exit of components.
 */
const Motion: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<MotionProps> & React.RefAttributes<any>
> = forwardRef(
	(
		{
			children,
			enteringAnimation,
			enteringAnimationXcss,
			exitingAnimation,
			exitingAnimationXcss,
			onFinish: onFinishMotion,
			xcss,
			style: styleProp,
			testId,
		},
		ref: Ref<any>,
	): React.JSX.Element => {
		const staggered = useStaggeredEntrance();
		const { isExiting, onFinish: onExitFinished, appear } = useExitingPersistence();
		const staggeredDelay = isExiting ? 0 : staggered.delay;
		const staggedIsReady = staggered.isReady;

		const [state, setState] = useState<MotionState>(
			appear ? (staggedIsReady && !staggeredDelay ? 'entering' : 'init') : 'idle',
		);

		const elementRef = useRef<HTMLDivElement>(null);
		const reanimateRef = useRef<Reanimate>();
		const animationRef = useRef<NodeJS.Timeout>();
		const staggeredEntryRef = useRef<NodeJS.Timeout>();

		useEffect(() => {
			if (isExiting) {
				setState('exiting');
			}
		}, [isExiting]);

		// Handles staggered entry
		useEffect(() => {
			if (state !== 'init') return;

			// We delay the entry animation by the stagger delay
			staggeredEntryRef.current = setTimeout(() => {
				setState('entering');
			}, staggeredDelay);

			return () => {
				if (staggeredEntryRef.current) {
					clearTimeout(staggeredEntryRef.current);
				}
			};
		}, [state, staggedIsReady, staggeredDelay]);

		/**
		 * Updates relevant state.
		 * Called when the animation is finished, or immediately with reduced motion.
		 */
		const onAnimationEnd = useCallback(
			(state: MotionState, cancelled: boolean) => {
				// We are done animating, so we set the state to idle
				let newState: MotionState = 'idle';
				if (state === 'exiting') {
					if (!reanimateRef.current) {
						// Updates the `ExitingPersistence` to remove this child
						onExitFinished?.();
					}
					onFinishMotion?.('exiting');
				}
				if (state === 'entering') {
					onFinishMotion?.('entering');
				}

				if (reanimateRef.current === Reanimate.exit_then_enter) {
					// We are done exiting, so we set the state to entering
					reanimateRef.current = Reanimate.enter;
					newState = 'entering';
				} else if (reanimateRef.current) {
					// We are done reanimating, so we clear the reanimate state
					reanimateRef.current = undefined;
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

		useEffect(() => {
			// Tracking this to prevent changing state on an unmounted component
			let isCancelled = false;

			if (!staggedIsReady) {
				return;
			}
			// On initial mount if elements aren't set to animate on appear, we return early and callback
			// This only occurs on initial mount, as appear will be true once the component is mounted
			if (!appear) {
				onFinishMotion && onFinishMotion('entering');
				return;
			}

			// If the state is idle or init, we don't need to do anything
			if (state === 'idle' || state === 'init') {
				return;
			}

			// If there is reduced motion or no exit animation, we call the onAnimationEnd function immediately
			if (isReducedMotion() || (!exitingAnimation && !exitingAnimationXcss)) {
				onAnimationEnd(state, isCancelled);
				return;
			}

			let animationDuration = 0;
			let animationDelay = 0;
			if (state === 'entering' || state === 'exiting') {
				if (elementRef.current) {
					if (elementRef.current.style.animation) {
						// Motion token
						const animationTimings = getDurationMs(
							resolveMotionToken(elementRef.current.style.animation),
						);
						animationDuration = animationTimings.duration;
						animationDelay = animationTimings.delay;
					} else {
						// Custom motion
						const styles = window.getComputedStyle(elementRef.current);
						if (styles.animationDuration) {
							animationDuration = convertToMs(styles.animationDuration);
						}
						if (styles.animationDelay) {
							animationDelay = convertToMs(styles.animationDelay);
						}
					}
				}
			}

			// Queue `onAnimationEnd` for after the animation has finished
			if (state === 'exiting' && (exitingAnimation || exitingAnimationXcss)) {
				animationRef.current = setTimeout(
					() => onAnimationEnd(state, isCancelled),
					animationDuration + animationDelay,
				);
			} else if (state === 'entering' && (enteringAnimation || enteringAnimationXcss)) {
				animationRef.current = setTimeout(
					() => onAnimationEnd(state, isCancelled),
					animationDuration + animationDelay,
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
		}, [
			onAnimationEnd,
			state,
			exitingAnimation,
			enteringAnimation,
			exitingAnimationXcss,
			enteringAnimationXcss,
			staggeredDelay,
			staggedIsReady,
		]);

		useImperativeHandle(ref, () => ({
			reanimate: (value: Reanimate) => {
				animationRef.current && clearTimeout(animationRef.current);
				reanimateRef.current = value;
				if (value === Reanimate.exit_then_enter) {
					setState('exiting');
				} else if (value === Reanimate.enter) {
					setState('entering');
				}
			},
		}));

		let style: React.CSSProperties = {};
		let customAnimation: CustomMotionXCSS | undefined;
		if (state === 'entering') {
			if (enteringAnimation) {
				style.animation = `${enteringAnimation} backwards`;
			} else if (enteringAnimationXcss) {
				customAnimation = enteringAnimationXcss;
			}
		} else if (state === 'exiting') {
			if (exitingAnimation) {
				style.animation = `${exitingAnimation} forwards`;
			} else if (exitingAnimationXcss) {
				customAnimation = exitingAnimationXcss;
			}
		}

		const hasAnimationStyles = state !== 'idle' && state !== 'init';

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
				className={cx(xcss, customAnimation)}
				ref={mergeRefs([staggered.ref, elementRef])}
				css={[
					hasAnimationStyles && styles.base,
					state === 'init' && styles.hidden,
					state === 'entering' && styles.entering,
					state === 'exiting' && styles.exiting,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={styleProp || hasAnimationStyles ? { ...styleProp, ...style } : undefined}
				data-testid={testId}
			>
				{children}
			</div>
		);
	},
);

export default Motion;
