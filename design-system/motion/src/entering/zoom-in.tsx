import React from 'react';

import { ObjectInterpolation } from '@emotion/core';

import KeyframesMotion, { KeyframesMotionProps } from './keyframes-motion';

export const zoomInAnimation = (): ObjectInterpolation<undefined> => ({
  '0%': {
    opacity: 0,
    transform: 'scale(0.5)',
  },
  '50%': {
    opacity: 1,
  },
  '75%': {
    transform: 'scale(1.25)',
  },
  '100%': {
    transform: 'scale(1)',
  },
});

export const shrinkOutAnimation = (): ObjectInterpolation<undefined> => ({
  to: {
    opacity: 0,
    transform: 'scale(0.75)',
  },
});

const ZoomIn: React.FC<KeyframesMotionProps> = ({
  children,
  duration = 125,
  ...props
}: KeyframesMotionProps) => {
  return (
    <KeyframesMotion
      duration={duration}
      enteringAnimation={zoomInAnimation()}
      exitingAnimation={shrinkOutAnimation()}
      animationTimingFunction={() => 'ease-in-out'}
      {...props}
    >
      {children}
    </KeyframesMotion>
  );
};

export default ZoomIn;
