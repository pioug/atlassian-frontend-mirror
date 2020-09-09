import { css, keyframes } from '@emotion/core';

import {
  transitionDuration,
  transitionTimingFunction,
} from '../../../common/constants';

const enterAnimationDown = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0%); }
`;

const enterAnimationUp = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0%); }
`;

const exitAnimationDown = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

const exitAnimationUp = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

export default ({ state, traversalDirection }) => {
  if (!['entering', 'exiting'].includes(state) || !traversalDirection) {
    return {};
  }

  if (state === 'exiting') {
    const animationName =
      traversalDirection === 'down' ? exitAnimationDown : exitAnimationUp;
    return css`
      ${{
        animationDuration: transitionDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: transitionTimingFunction,
      }}
      animation-name: ${animationName};
    `;
  }

  if (state === 'entering') {
    const animationName =
      traversalDirection === 'down' ? enterAnimationDown : enterAnimationUp;
    return css`
      ${{
        animationDuration: transitionDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: transitionTimingFunction,
        position: 'absolute',
        width: '100%',
        zIndex: 1,
      }}
      animation-name: ${animationName};
    `;
  }

  return {};
};
