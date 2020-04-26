import React from 'react';

import { transitionDuration, transitionTimingFunction } from './constants';

export const Shadow = ({ direction, isBold, isOverDarkBg, ...props }) => {
  let width = isOverDarkBg ? 6 : 3;
  if (isBold) width = isOverDarkBg ? 12 : 6;

  const colorStops = `
    rgba(0, 0, 0, 0.2) 0px,
    rgba(0, 0, 0, 0.2) 1px,
    rgba(0, 0, 0, 0.1) 1px,
    rgba(0, 0, 0, 0) 100%
  `;

  return (
    <div
      css={{
        background: `linear-gradient(${direction}, ${colorStops})`,
        bottom: 0,
        left: direction === 'to left' ? -width : -1,
        opacity: isBold ? 1 : 0.5,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        transitionDuration,
        transitionProperty: 'left, opacity, width',
        transitionTimingFunction,
        width,
      }}
      {...props}
    />
  );
};
Shadow.defaultProps = {
  direction: 'to left',
};
