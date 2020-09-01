import React from 'react';

import { ObjectInterpolation } from '@emotion/core';

import { easeInOut } from '../utils/curves';
import { largeDurationMs } from '../utils/durations';

import KeyframesMotion, { KeyframesMotionProps } from './keyframes-motion';
import { Direction } from './types';

const entranceMotions = {
  bottom: 'translate3d(0, calc(5% + 4px), 0)',
  left: 'translate3d(calc(-5% - 4px), 0, 0)',
  right: 'translate3d(calc(5% + 4px), 0, 0)',
  top: 'translate3d(0, calc(-5% - 4px), 0)',
};

const exitMotions = {
  bottom: 'translate3d(0, calc(-5% - 4px), 0)',
  left: 'translate3d(calc(5% + 4px), 0, 0)',
  right: 'translate3d(calc(-5% - 4px), 0, 0)',
  top: 'translate3d(0, calc(5% + 4px), 0)',
};

export const fadeInAnimation = (
  movement?: Direction,
): ObjectInterpolation<undefined> => {
  return {
    from: {
      opacity: 0,
      ...(movement !== undefined && {
        transform: entranceMotions[movement],
      }),
    },
    '50%': {
      opacity: 1,
    },
    to: {
      transform: movement !== undefined ? 'none' : undefined,
    },
  };
};

export const fadeOutAnimation = (
  movement?: Direction,
): ObjectInterpolation<undefined> => ({
  from: {
    opacity: 1,
    transform: movement !== undefined ? 'translate3d(0, 0, 0)' : undefined,
  },
  to: {
    opacity: 0,
    ...(movement !== undefined && {
      transform: exitMotions[movement],
    }),
  },
});

/**
 * Props for controlling the behaviour of the FadeIn animation
 */
export interface FadeKeyframesMotionProps extends KeyframesMotionProps {
  /**
   * Sets an entering and exiting motion
   */
  entranceDirection?: Direction;
}

const FadeIn: React.FC<FadeKeyframesMotionProps> = ({
  children,
  duration = largeDurationMs,
  entranceDirection: entranceSlideDirection,
  ...props
}: FadeKeyframesMotionProps) => {
  return (
    <KeyframesMotion
      duration={duration}
      enteringAnimation={fadeInAnimation(entranceSlideDirection)}
      exitingAnimation={fadeOutAnimation(entranceSlideDirection)}
      animationTimingFunction={() => easeInOut}
      {...props}
    >
      {children}
    </KeyframesMotion>
  );
};

export default FadeIn;
