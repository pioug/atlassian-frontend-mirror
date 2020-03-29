import React from 'react';
import { Transition } from 'react-transition-group';

const duration = 500;
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint
const verticalOffset = 16;

// Animation
// ==============================
// Modal has two parts that need to be animated. Everything should fade in/out
// and the popup should slide up/up (sic). These animations happen at the same time.
// This component calls its children with the styles for both animations.

interface AnimationProps {
  in: boolean;
  onExited?: (node: HTMLElement) => void;
  onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  stackIndex?: number;
  children: ({
    fade,
    slide,
  }: {
    fade: Object;
    slide: Object;
  }) => React.ReactNode;
}

type statusValues = 'entering' | 'entered' | 'exiting' | 'exited';
export const Animation = ({
  in: hasEntered,
  stackIndex = 0,
  onExited,
  onEntered,
  children,
}: AnimationProps) => (
  <Transition
    in={hasEntered}
    timeout={{ enter: 0, exit: duration }}
    onExited={onExited}
    onEntered={onEntered}
    appear
  >
    {(unadjustedStatus: statusValues) => {
      // when we first render, we want to finish the 'entering' state render
      // then jump to the 'entered' state as quick as possible.
      const adjustedStatus: statusValues =
        hasEntered && unadjustedStatus === 'exited'
          ? 'entering'
          : unadjustedStatus;
      // Fade styles
      const fadeBaseStyles = {
        transition: `opacity ${duration / 2}ms`,
        opacity: 1,
      };
      const fadeTransitionStyles = {
        entering: {
          opacity: 0,
        },
        entered: {},
        exiting: {
          opacity: 0,
        },
        exited: {},
      };
      // Slide styles
      const slideBaseStyles = {
        transition: `transform ${duration}ms ${easing}`,
        transform: `translate3d(0, ${verticalOffset * 2}px, 0)`,
      };
      const slideTransitionStyles = {
        entering: {},
        entered: {
          transform:
            stackIndex > 0
              ? `translate3d(0, ${stackIndex * (verticalOffset / 2)}px, 0)`
              : null,
        },
        exiting: {
          transform: `translate3d(0, -${verticalOffset * 2}px, 0)`,
        },
        exited: {},
      };
      return children({
        fade: { ...fadeBaseStyles, ...fadeTransitionStyles[adjustedStatus] },
        slide: { ...slideBaseStyles, ...slideTransitionStyles[adjustedStatus] },
      });
    }}
  </Transition>
);
