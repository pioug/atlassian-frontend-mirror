/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { background } from '@atlaskit/theme/colors';

import { BORDER_WIDTH } from './constants';

interface IconWrapperProps {
  bgColor?: string;
  children?: ReactNode;
}

const IconWrapper: FC<IconWrapperProps> = ({ bgColor, children }) => (
  <span
    css={{
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: bgColor || background(),
      borderRadius: '50%',
      boxSizing: 'border-box',
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      border: `${BORDER_WIDTH}px solid ${bgColor || background()}`,
      width: '100%',
    }}
  >
    {children}
  </span>
);

export default IconWrapper;
