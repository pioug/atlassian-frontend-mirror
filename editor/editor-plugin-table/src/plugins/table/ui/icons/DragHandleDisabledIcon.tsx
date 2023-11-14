import React from 'react';

import { token } from '@atlaskit/tokens';

interface DragHandleDisabledIconProps {
  style?: React.CSSProperties;
}

export const DragHandleDisabledIcon = ({
  style,
}: DragHandleDisabledIconProps) => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <rect
      width="24"
      height="16"
      rx="4"
      fill={token('color.background.accent.gray.subtlest', 'Neutral200')}
    />
    <g>
      <rect
        x="7"
        y="4"
        width="2"
        height="8"
        rx="1"
        fill={token('color.icon.disabled', '#091E424F')}
      />
      <rect
        x="11"
        y="4"
        width="2"
        height="8"
        rx="1"
        fill={token('color.icon.disabled', '#091E424F')}
      />
      <rect
        x="15"
        y="4"
        width="2"
        height="8"
        rx="1"
        fill={token('color.icon.disabled', '#091E424F')}
      />
    </g>
  </svg>
);
