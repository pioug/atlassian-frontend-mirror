/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import { SkeletonCreateButtonProps } from './types';

const skeletonCreateButtonStyles = css({
  height: 32,
  padding: '0 12px',
  alignSelf: 'center',
  border: 0,
  borderRadius: 3,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1,
  pointerEvents: 'none',
  ':focus, :active, :hover': {
    appearance: 'none',
    border: 0,
    outline: 0,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '&&': {
    marginLeft: 12,
  },
});

export const SkeletonCreateButton = ({
  text,
  testId,
}: SkeletonCreateButtonProps) => {
  const theme = useTheme();

  return (
    <button
      style={theme.mode.create.default as React.CSSProperties}
      css={skeletonCreateButtonStyles}
      data-testid={testId}
    >
      {text}
    </button>
  );
};
