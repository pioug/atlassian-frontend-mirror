import styled, { keyframes } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

export const flagWidth = gridSize() * 50;
export const flagAnimationTime = 400;

// This is the translateX position that we target when animating a card out
// towards the left of screen.
const exitXPosition = `${0 - flagWidth / 2}px`;
const flagAnimationDuration = `${flagAnimationTime}ms`;

const animationEnter = keyframes`
    from {
      opacity: 0;
      transform: translate(${exitXPosition}, 0);
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
`;

const animationLeave = keyframes`
  from {
    opacity: 1;
    transform: translate(0, 0);
  }
  to {
    opacity: 0;
    transform: translate(${exitXPosition}, 0);
  }
`;

const getAnimation = ({ transitionState }: { transitionState: string }) => {
  if (transitionState === 'entering') {
    return `${animationEnter} ${flagAnimationDuration}`;
  }

  if (transitionState === 'exiting') {
    return `${animationLeave} ${flagAnimationDuration}`;
  }

  return 'initial';
};

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  transition: transform ${flagAnimationDuration} ease-in-out;
  width: ${flagWidth}px;

  @media (max-width: 560px) {
    width: 100vw;
  }

  &:first-child {
    animation: ${getAnimation};
  }

  &:nth-child(n + 2) {
    transform: translateX(0) translateY(100%) translateY(${2 * gridSize()}px);
  }

  /* Layer the 'primary' flag above the 'secondary' flag */
  &:nth-child(1) {
    z-index: 5;
  }
  &:nth-child(2) {
    z-index: 4;
  }

  /* The 2nd flag should be placed at 0,0 position when the 1st flag is animating out. */
  ${({ transitionState }) =>
    transitionState === 'exiting'
      ? `
    && + * {
      transform: translate(0, 0);
    }
  `
      : null} &:nth-child(n+4) {
    display: none;
  }
`;
Wrapper.displayName = 'Wrapper';
export default Wrapper;
