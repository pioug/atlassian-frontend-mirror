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

import { cssMap, jsx, type XCSSAllProperties, type XCSSAllPseudos } from '@atlaskit/css';
import { type Motion as MotionToken } from '@atlaskit/tokens/css-type-schema';

import { isReducedMotion } from '../utils/accessibility';
import { getDurationMs, resolveMotionToken } from '../utils/animation';

import { useExitingPersistence } from './exiting-persistence';
import { useStaggeredEntrance } from './staggered-entrance';
import { type Transition } from './types';

const styles = cssMap({
	base: {
		animationPlayState: 'running',
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
			transition: 'none',
		},
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

type MotionState = 'entering' | 'exiting' | 'idle' | 'reanimating';

interface MotionProps {
	/**
	 * Will callback when the motion has finished in the particular direction.
	 * If it finished entering direction will be `entering`.
	 * And vice versa for `exiting`.
	 */
	onFinish?: (state: Transition) => void;

	/**
	 * Children as `function`.
	 * Will be passed `props` for you to hook up.
	 * The `state` arg can be used to know if the motion is `entering` or `exiting`.
	 */
	children: React.ReactNode;
	/**
	 * CSS keyframes for the entering animation.
	 */
	enteringAnimation?: MotionToken;

	/**
	 * CSS keyframes for the exiting animation.
	 */
	exitingAnimation?: MotionToken;
	/**
	 * CSS properties to apply to the motion container.
	 */
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos>;
	/**
	 * Can be used to pause the animation before it has finished.
	 */
	isPaused?: boolean;
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
			exitingAnimation,
			isPaused,
			onFinish: onFinishMotion,
			xcss,
			testId,
		},
		ref: Ref<any>,
	): React.JSX.Element => {
		const staggered = useStaggeredEntrance();
		const { isExiting, onFinish: onExitFinished, appear } = useExitingPersistence();
		const paused = isPaused || !staggered.isReady;
		const delay = isExiting ? 0 : staggered.delay;

		const [state, setState] = useState<MotionState>(appear ? 'entering' : 'idle');

		const reanimateRef = useRef<Reanimate>();
		const animationRef = useRef<NodeJS.Timeout>();

		useEffect(() => {
			if (isExiting) {
				setState('exiting');
			}
		}, [isExiting]);

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
				// eslint-disable-next-line react-hooks/exhaustive-deps
			},
			[onExitFinished],
		);

		useEffect(() => {
			// Tracking this to prevent changing state on an unmounted component
			let isCancelled = false;

			if (paused) {
				return;
			}

			// On initial mount if elements aren't set to animate on appear, we return early and callback
			// This only occurs on initial mount, as appear will be true once the component is mounted
			if (!appear) {
				onFinishMotion && onFinishMotion('entering');
				return;
			}

			// If the state is idle, we don't need to do anything
			if (state === 'idle') {
				return;
			}

			// If there is reduced motion or no exit animation, we call the onAnimationEnd function immediately
			if (isReducedMotion() || !exitingAnimation) {
				onAnimationEnd(state, isCancelled);
				return;
			}

			// Queue `onAnimationEnd` for after the animation has finished
			if (state === 'exiting' && exitingAnimation) {
				const duration = getDurationMs(resolveMotionToken(exitingAnimation));
				animationRef.current = setTimeout(() => onAnimationEnd(state, isCancelled), duration);
			} else if (state === 'entering' && enteringAnimation) {
				const duration = getDurationMs(resolveMotionToken(enteringAnimation));
				animationRef.current = setTimeout(
					() => onAnimationEnd(state, isCancelled),
					duration + delay,
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
		}, [onAnimationEnd, state, exitingAnimation, enteringAnimation, delay, paused]);

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

		const style: React.CSSProperties = {
			animation:
				state === 'exiting'
					? `${exitingAnimation} forwards ${paused ? 'paused' : ''}`
					: state === 'entering'
						? `${enteringAnimation} backwards ${paused ? 'paused' : ''}`
						: undefined,
		};
		if (delay) {
			style.animationDelay = `${delay}ms`;
		}

		const hasAnimationStyles = state !== 'idle';

		return (
			<div
				className={xcss}
				ref={staggered.ref}
				css={[hasAnimationStyles && styles.base]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={hasAnimationStyles ? style : undefined}
				data-testid={testId}
			>
				{children}
			</div>
		);
	},
);

export default Motion;
