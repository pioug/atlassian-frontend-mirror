import React from 'react';

import { CSSObject } from '@emotion/react';

import { AnimationCurve, easeIn, easeOut } from '../utils/curves';
import { mediumDurationMs } from '../utils/durations';

import KeyframesMotion, { KeyframesMotionProps } from './keyframes-motion';
import { Direction, Fade, Transition } from './types';

export const slideInAnimation = (
  from: Direction,
  state: Transition,
  fade: Fade,
): CSSObject => {
  const initial = state === 'entering' ? '0%' : '100%';
  const end = state === 'entering' ? '100%' : '0%';
  const fromMap = {
    top: 'translate3d(0, -100%, 0)',
    right: 'translate3d(100%, 0, 0)',
    bottom: 'translate3d(0, 100%, 0)',
    left: 'translate3d(-100%, 0, 0)',
  };

  const animateOpacity =
    fade === 'inout' ||
    (fade === 'in' && state === 'entering') ||
    (fade === 'out' && state === 'exiting');

  return {
    [initial]: {
      transform: fromMap[from],
      opacity: animateOpacity ? 0 : 1,
    },
    [end]: {
      transform: 'none',
      opacity: 1,
    },
  };
};

export interface SlideInProps extends KeyframesMotionProps {
  /**
   * Direction the element will slide in from.
   * E.g. `"right"` will slide in from the right to the left.
   *
   * If `exitTo` is not set, exiting will reverse this motion.
   * E.g. If `enterFrom: "right"`, will slide out to the right.
   */
  enterFrom: Direction;
  /**
   * Direction the element will slide out towards.
   * E.g. `"right"` will slide out to the right.
   *
   * If this is not set, exiting will reverse the entrance motion.
   * E.g. If `enterFrom: "right"`, will slide out to the right.
   */
  exitTo?: Direction;
  /**
   * Whether an element will fade on enter, on exit or both.
   *
   * `'none'` is the default and will cause the element to not fade,
   * `'in'` will cause the element to fade on enter,
   * `'out'` will cause the element to fade on exit,
   * `'inout'` will cause the element to fade on both.
   */
  fade?: Fade;
  /**
   * A custom function used to override the default animation timings.
   * Returns which animation curve to use depending on the current transitioning state.
   */
  animationTimingFunction?: (state: Transition) => AnimationCurve;
}

/**
 * __SlideIn__
 *
 * Will slide an element into position, generally used for things that appear from outside of the viewport into view.
 *
 * See [examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions).
 */
const SlideIn = ({
  children,
  enterFrom,
  exitTo,
  fade = 'none',
  duration = mediumDurationMs,
  isPaused,
  onFinish,
  animationTimingFunction = (state) =>
    state === 'entering' ? easeOut : easeIn,
}: SlideInProps) => {
  return (
    <KeyframesMotion
      duration={duration}
      enteringAnimation={slideInAnimation(enterFrom, 'entering', fade)}
      exitingAnimation={slideInAnimation(exitTo || enterFrom, 'exiting', fade)}
      animationTimingFunction={animationTimingFunction}
      isPaused={isPaused}
      onFinish={onFinish}
    >
      {children}
    </KeyframesMotion>
  );
};

export default SlideIn;
