/** @jsx jsx */
import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import skeletonCreateButtonCSS from './styles';
import { SkeletonCreateButtonProps } from './types';

export const SkeletonCreateButton = ({
  text,
  testId,
}: SkeletonCreateButtonProps) => {
  const theme = useTheme();

  return (
    <button css={skeletonCreateButtonCSS(theme)} data-testid={testId}>
      {text}
    </button>
  );
};
