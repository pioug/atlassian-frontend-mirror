/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import skeletonIconButtonCSS from './styles';
import { SkeletonIconButtonProps } from './types';

export const SkeletonIconButton = ({
  children,
  testId,
}: SkeletonIconButtonProps) => {
  const theme = useTheme();

  return (
    <button data-testid={testId} css={skeletonIconButtonCSS(theme)}>
      {children}
    </button>
  );
};
