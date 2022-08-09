/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import { SkeletonIconButtonProps } from './types';

const skeletonIconButtonStyles = css({
  margin: 0,
  marginRight: 4,
  padding: '4px 6px',
  border: 0,
  borderRadius: '100%',
  pointerEvents: 'none',
  ':focus, :active, :hover': {
    appearance: 'none',
    border: 0,
    outline: 0,
  },
  '&:only-of-type': {
    marginRight: 0,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > span': {
    lineHeight: 'normal',
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > img': {
    width: 24,
    height: 24,
    borderRadius: '100%',
    verticalAlign: 'middle',
  },
});

/**
 * __Skeleton icon button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents a generic icon button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonIconButton = ({
  children,
  testId,
}: SkeletonIconButtonProps) => {
  const theme = useTheme();

  return (
    <button
      style={theme.mode.iconButton.default as React.CSSProperties}
      data-testid={testId}
      css={skeletonIconButtonStyles}
      type="button"
    >
      {children}
    </button>
  );
};
