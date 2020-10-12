/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import { iconButtonSkeletonCSS } from './styles';
import { IconButtonSkeletonProps } from './types';

export const IconButtonSkeleton = (props: IconButtonSkeletonProps) => {
  const theme = useTheme();
  return (
    <div
      className={props.className}
      css={iconButtonSkeletonCSS(theme, props)}
    />
  );
};
