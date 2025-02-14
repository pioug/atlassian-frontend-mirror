import type { Durations } from '../utils/durations';

/**
 * Direction the motion is going.
 */
export type Transition = 'entering' | 'exiting';

/**
 * Direction an element enters from or leaves towards
 */
export type Direction = 'top' | 'right' | 'bottom' | 'left';

/**
 * The distance the element moves in a direction-based animation.
 * A `proportional` distance is based on the size of the element.
 * A `constant` distance will always move the same amount, regardless of size.
 */
export type Distance = 'constant' | 'proportional';

/**
 * Whether an element will fade on enter, on exit or both
 */
export type Fade = 'none' | 'in' | 'out' | 'inout';

/**
 * Animation curve to use for the motion.
 */
export type AnimationCurve = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Common props all entering motions should make available for consumers.
 */
export interface MotionProps<TProps extends {}> {
	/**
	 * How long the motion will take.
	 */
	duration?: Durations;

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
	children: (opts: TProps, state: Transition) => React.ReactNode;
}
