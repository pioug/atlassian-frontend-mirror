import styled, { keyframes, css } from 'styled-components';
import { SpinnerPhases } from '../types';

type AnimationParams = {
  delay: number;
  phase: SpinnerPhases;
};

/* Define keyframes statically to prevent a perfomance issue in styled components v1 where the keyframes function
 * does not cache previous values resulting in each spinner injecting the same keyframe definition
 * in the DOM.
 * This can be reverted to use dynamic keyframes when we upgrade to styled components v2
 */
const keyframeNames = {
  noop: keyframes`
    from { opacity: 0; }
    to { opacity: 0; }
  `,
  enterRotate: keyframes`
    from { transform: rotate(50deg); }
    to { transform: rotate(230deg); }
  `,
  leaveRotate: keyframes`
    from { transform: rotate(230deg); }
    to { transform: rotate(510deg); }
  `,
  leaveOpacity: keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
  `,
};

export const getContainerAnimation = ({ delay, phase }: AnimationParams) => {
  if (phase === 'DELAY') {
    /* This hides the spinner and allows us to use animationend events to move to the next phase in
     * the same way we do with the other lifecycle stages */
    return css`
      animation: ${delay}s ${keyframeNames.noop};
    `;
  }

  if (phase === 'ENTER' || phase === 'IDLE') {
    return css`
      animation: 1s ease-in-out forwards ${keyframeNames.enterRotate};
    `;
  }

  if (phase === 'LEAVE') {
    return css`
      animation: 0.53s ease-in-out forwards ${keyframeNames.leaveRotate},
        0.2s ease-in-out 0.33s ${keyframeNames.leaveOpacity};
    `;
  }

  return '';
};

const getSize = ({ size }: { size: number }) => `${size}px`;

const Container = styled.span<AnimationParams & { size: number }>`
  ${getContainerAnimation}
  display: flex;
  height: ${getSize};
  width: ${getSize};

  /* Rapidly creating and removing spinners will result in multiple spinners being visible while
   * they complete their exit animations. This rules hides the spinner if another one has been
   * added. */
  div + & {
    display: none;
  }
`;
Container.displayName = 'SpinnerContainer';
export default Container;
