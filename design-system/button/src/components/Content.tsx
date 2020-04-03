/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { gridSize } from '@atlaskit/theme/constants';
import { getLoadingStyle } from './utils';

interface Props {
  followsIcon: boolean;
  spacing: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  testId?: string;
}

export default ({
  children,
  followsIcon,
  spacing,
  isLoading,
  ...rest
}: Props) => (
  <span
    css={{
      alignItems: followsIcon ? 'baseline' : 'center',
      alignSelf: followsIcon ? 'baseline' : 'center',
      flex: '1 1 auto',
      margin: spacing === 'none' ? 0 : `0 ${gridSize() / 2}px`,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...getLoadingStyle(isLoading),
    }}
    {...rest}
  >
    {children}
  </span>
);
