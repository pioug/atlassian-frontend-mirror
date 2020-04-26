import React from 'react';

import { ObjectInterpolation } from '@emotion/core';

import { AnimationCurve, easeIn, easeOut } from '../utils/curves';
import { mediumDurationMs } from '../utils/durations';

import KeyframesMotion, { KeyframesMotionProps } from './keyframes-motion';
import { Direction, Transition } from './types';

export const slideInAnimation = (
  from: Direction,
  state: Transition,
): ObjectInterpolation<undefined> => {
  const initial = state === 'entering' ? '0%' : '100%';
  const end = state === 'entering' ? '100%' : '0%';
  const fromMap = {
    top: 'translate3d(0, -100%, 0)',
    right: 'translate3d(100%, 0, 0)',
    bottom: 'translate3d(0, 100%, 0)',
    left: 'translate3d(-100%, 0, 0)',
  };

  return {
    [initial]: {
      transform: fromMap[from],
    },
    [end]: {
      transform: 'none',
    },
  };
};

export interface SlideInProps extends KeyframesMotionProps {
  /**
   * Direction the element will slide in from.
   * E.g. `"right"` will slide in from the right to the left.
   *
   * If `exitTo` is not set, exiting will reverse this motion.
   * E.g. if `enterFrom: "right"`, will slide out to the right.
   */
  enterFrom: Direction;

  /**
   * Direction the element will slide out towards.
   * E.g. `"right"` will slide out to the right.
   *
   * If this is not set, exiting will reverse the entrance motion.
   * E.g. if `enterFrom: "right"`, will slide out to the right.
   */
  exitTo?: Direction;

  /**
   * A custom function used to override the default animation timings.
   * Returns which animation curve to use depending on the current transitioning state.
   */
  animationTimingFunction?: (state: Transition) => AnimationCurve;
}

const SlideIn: React.FC<SlideInProps> = ({
  children,
  enterFrom,
  exitTo,
  duration = mediumDurationMs,
  animationTimingFunction = state => (state === 'entering' ? easeOut : easeIn),
  ...props
}: SlideInProps) => {
  return (
    <KeyframesMotion
      duration={duration}
      enteringAnimation={slideInAnimation(enterFrom, 'entering')}
      exitingAnimation={slideInAnimation(exitTo || enterFrom, 'exiting')}
      animationTimingFunction={animationTimingFunction}
      {...props}
    >
      {children}
    </KeyframesMotion>
  );
};

export default SlideIn;
