import React from 'react';
import { Transition } from 'react-transition-group';

const ENTER_DURATION = 120;
const EXIT_DURATION = 80;
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint

interface Timeout {
  enter: number;
  exit: number;
}

type TransitionStates = 'entering' | 'entered' | 'exiting';

const defaultStyle = (timeout: Timeout) => ({
  transition: `transform ${timeout.enter}ms ${easing}, opacity ${timeout.enter}ms linear`,
  opacity: 0,
});

const transitionStyle = (state: TransitionStates) => {
  const transitions: { [key in TransitionStates]: any } = {
    entering: {},
    entered: {
      opacity: 1,
    },
    exiting: {
      opacity: 0,
    },
  };
  return transitions[state];
};

const getStyle = (timeout: Timeout, state: TransitionStates) => () => ({
  ...defaultStyle(timeout),
  ...transitionStyle(state),
});

type GetAnimationStyles = () => Object;

interface AnimationProps {
  children: (getAnimationFn: GetAnimationStyles) => React.ReactNode;
  immediatelyHide: boolean;
  immediatelyShow: boolean;
  in: boolean;
  onExited: () => any;
}

const Animation = ({
  children,
  immediatelyHide,
  immediatelyShow,
  onExited,
  in: inProp,
}: AnimationProps) => {
  const timeout = {
    enter: immediatelyShow ? 0 : ENTER_DURATION,
    exit: immediatelyHide ? 0 : EXIT_DURATION,
  };

  return (
    <Transition
      timeout={timeout}
      in={inProp}
      onExited={onExited}
      unmountOnExit
      appear
    >
      {(state: TransitionStates) => children(getStyle(timeout, state))}
    </Transition>
  );
};

export default Animation;
