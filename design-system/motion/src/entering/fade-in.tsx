import React from 'react';

import { type CSSObject } from '@emotion/react';

import { easeInOut } from '../utils/curves';
import { largeDurationMs } from '../utils/durations';

import KeyframesMotion, { type KeyframesMotionProps } from './keyframes-motion';
import type { Direction, Distance } from './types';

const directionMotions: Record<Distance, Record<Direction, string>> = {
  proportional: {
    bottom: 'translate3d(0, calc(5% + 4px), 0)',
    left: 'translate3d(calc(-5% - 4px), 0, 0)',
    right: 'translate3d(calc(5% + 4px), 0, 0)',
    top: 'translate3d(0, calc(-5% - 4px), 0)',
  },
  constant: {
    bottom: 'translate3d(0, 4px, 0)',
    left: 'translate3d(-4px, 0, 0)',
    right: 'translate3d(4px, 0, 0)',
    top: 'translate3d(0, -4px, 0)',
  },
};

const invertedDirection = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
} as const;

export const fadeInAnimation = (
  direction?: Direction,
  distance: Distance = 'proportional',
): CSSObject => {
  return {
    from: {
      opacity: 0,
      ...(direction !== undefined && {
        transform: directionMotions[distance][direction],
      }),
    },
    '50%': {
      opacity: 1,
    },
    to: {
      transform: direction !== undefined ? 'none' : undefined,
    },
  };
};

export const fadeOutAnimation = (
  direction?: Direction,
  distance: Distance = 'proportional',
): CSSObject => ({
  from: {
    opacity: 1,
    transform: direction !== undefined ? 'translate3d(0, 0, 0)' : undefined,
  },
  to: {
    opacity: 0,
    ...(direction !== undefined && {
      transform: directionMotions[distance][direction],
    }),
  },
});

/**
 * Props for controlling the behavior of the FadeIn animation
 */
export interface FadeKeyframesMotionProps extends KeyframesMotionProps {
  /**
   * The direction the element will enter from using a slide animation. If undefined, no slide will be applied.
   */
  entranceDirection?: Direction;
  /**
   * The direction the element will exit to using a slide animation.
   * If undefined but `entranceDirection` is set, it will exit to the opposite side by default.
   */
  exitDirection?: Direction;
  /**
   * The distance the element moves in a direction-based animation.
   * A `proportional` distance is based on the size of the element.
   * A `constant` distance will always move the same amount, regardless of size.
   */
  distance?: Distance;
}

/**
 * __FadeIn__
 *
 * Useful for fading in one or more elements.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const FadeIn = ({
  children,
  duration = largeDurationMs,
  entranceDirection,
  exitDirection,
  distance = 'proportional',
  onFinish,
  isPaused,
}: FadeKeyframesMotionProps) => {
  const invertedEntranceDirection =
    entranceDirection && invertedDirection[entranceDirection];

  return (
    <KeyframesMotion
      duration={duration}
      enteringAnimation={fadeInAnimation(entranceDirection, distance)}
      exitingAnimation={fadeOutAnimation(
        exitDirection || invertedEntranceDirection,
        distance,
      )}
      animationTimingFunction={() => easeInOut}
      onFinish={onFinish}
      isPaused={isPaused}
    >
      {children}
    </KeyframesMotion>
  );
};

export default FadeIn;
