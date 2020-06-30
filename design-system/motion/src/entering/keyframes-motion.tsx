import React, { Ref, useEffect, useState } from 'react';

import { ClassNames, keyframes, ObjectInterpolation } from '@emotion/core';

import { prefersReducedMotion } from '../utils/accessibility';
import { largeDurationMs } from '../utils/durations';
import { useSetTimeout } from '../utils/timer-hooks';

import { useExitingPersistence } from './exiting-persistence';
import { useStaggeredEntrance } from './staggered-entrance';
import { MotionProps, Transition } from './types';

/**
 * These are props that motions should use as their external props for consumers.
 * See [FadeIn](packages/helpers/motion/src/entering/fade-in.tsx) for an example usage.
 */
export interface KeyframesMotionProps
  extends MotionProps<{ className: string; ref: Ref<any> }> {
  /**
   * Can be used to pause the animation before it has finished.
   */
  isPaused?: boolean;
}

interface InternalKeyframesMotionProps extends KeyframesMotionProps {
  /**
   * Timing function to be used with the animation.
   * Receives the `state` and expects a `string` return value.
   * Useful if you want a different curve when entering vs. exiting.
   */
  animationTimingFunction: (state: Transition) => string;

  /**
   * CSS keyframes for the entering animation.
   */
  enteringAnimation: ObjectInterpolation<undefined>;

  /**
   * CSS keyframes for the exiting animation.
   */
  exitingAnimation?: ObjectInterpolation<undefined>;

  /**
   * Duration in `ms`.
   * How long the motion will take.
   */
  duration: number;
}

/**
 * Used to multiply the initial duration for exiting motions.
 */
const EXITING_MOTION_MULTIPLIER = 0.5;

/**
 * This is the base INTERNAL component used for all other entering motions.
 * This does not need Javascript to execute on the client so it will run immediately
 * for any SSR rendered React apps before the JS has executed.
 */
const EnteringMotion: React.FC<InternalKeyframesMotionProps> = ({
  children,
  animationTimingFunction,
  enteringAnimation,
  exitingAnimation,
  isPaused,
  onFinish: onFinishMotion,
  duration = largeDurationMs,
}: InternalKeyframesMotionProps) => {
  const staggered = useStaggeredEntrance();
  const {
    isExiting,
    onFinish: onExitFinished,
    appear,
  } = useExitingPersistence();
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
      isExiting ? duration * EXITING_MOTION_MULTIPLIER : duration + delay,
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
            className: hasAnimationStyles
              ? css({
                  animationName: `${keyframes(
                    isExiting
                      ? exitingAnimation || enteringAnimation
                      : enteringAnimation,
                  )}`,
                  animationTimingFunction: animationTimingFunction(state),
                  animationDelay: `${delay}ms`,
                  animationFillMode: isExiting ? 'forwards' : 'backwards',
                  animationDuration: `${
                    isExiting ? duration * EXITING_MOTION_MULTIPLIER : duration
                  }ms`,
                  animationPlayState: paused ? 'paused' : 'running',
                  ...prefersReducedMotion(),
                })
              : '',
          },
          state,
        )
      }
    </ClassNames>
  );
};

export default EnteringMotion;
