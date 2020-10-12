/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import { primaryButtonSkeletonCSS } from './styles';
import { PrimaryButtonSkeletonProps } from './types';

export const PrimaryButtonSkeleton = (props: PrimaryButtonSkeletonProps) => {
  const theme = useTheme();

  return <div {...props} css={primaryButtonSkeletonCSS(theme)} />;
};
