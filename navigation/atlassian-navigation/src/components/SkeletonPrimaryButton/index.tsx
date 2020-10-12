/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import skeletonPrimaryButtonCSS from './styles';
import { SkeletonPrimaryButtonProps } from './types';

export const SkeletonPrimaryButton = ({
  isDropdownButton = false,
  isHighlighted = false,
  text,
  children,
  testId,
}: SkeletonPrimaryButtonProps) => {
  const theme = useTheme();

  return (
    <button
      css={skeletonPrimaryButtonCSS(theme, isDropdownButton, isHighlighted)}
      data-testid={testId}
    >
      {text || children}
    </button>
  );
};
