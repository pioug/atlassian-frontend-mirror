/**
 * Direction the motion is going.
 */
export type Transition = 'entering' | 'exiting';

/**
 * Direction an element enters from or leaves towards
 */
export type Direction = 'top' | 'right' | 'bottom' | 'left';

/**
 * Whether an element will fade on enter, on exit or both
 */
export type Fade = 'none' | 'in' | 'out' | 'inout';

/**
 * Common props all entering motions should make available for consumers.
 */
export interface MotionProps<TProps extends {}> {
  /**
   * Duration in `ms`.
   * How long the motion will take.
   */
  duration?: number;

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
