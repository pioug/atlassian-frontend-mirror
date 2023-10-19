import React from 'react';

import { token } from '@atlaskit/tokens';

interface DragInMotionIconProps {
  style?: React.CSSProperties;
}

export const DragInMotionIcon = ({ style }: DragInMotionIconProps) => (
  <svg
    width="28"
    height="20"
    viewBox="0 0 28 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <rect
      x="1"
      y="1"
      width="26"
      height="18"
      rx="5"
      fill={token('color.background.accent.blue.subtle', '#579DFF')}
    />
    <rect
      x="9"
      y="6"
      width="2"
      height="8"
      rx="1"
      fill={token('color.border.inverse', '#FFFFFF')}
    />
    <rect
      x="13"
      y="6"
      width="2"
      height="8"
      rx="1"
      fill={token('color.border.inverse', '#FFFFFF')}
    />
    <rect
      x="17"
      y="6"
      width="2"
      height="8"
      rx="1"
      fill={token('color.border.inverse', '#FFFFFF')}
    />
    <rect
      x="1"
      y="1"
      width="26"
      height="18"
      rx="5"
      stroke={token('color.border.inverse', '#FFFFFF')}
      strokeWidth="2"
    />
  </svg>
);
