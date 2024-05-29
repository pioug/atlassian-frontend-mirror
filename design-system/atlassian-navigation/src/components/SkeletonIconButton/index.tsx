/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useTheme } from '../../theme';

import { type SkeletonIconButtonProps } from './types';

const skeletonIconButtonStyles = css({
  margin: 0,
  marginRight: token('space.050', '4px'),
  padding: `${token('space.050', '4px')} ${token('space.075', '6px')}`,
  border: 0,
  borderRadius: token('border.radius.circle', '100%'),
  pointerEvents: 'none',
  ':focus, :active, :hover': {
    appearance: 'none',
    border: 0,
    outline: 0,
  },
  '&:only-of-type': {
    marginRight: 0,
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > span': {
    lineHeight: 'normal',
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > img': {
    width: 24,
    height: 24,
    borderRadius: token('border.radius.circle', '100%'),
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      style={theme.mode.iconButton.default as React.CSSProperties}
      data-testid={testId}
      css={skeletonIconButtonStyles}
      type="button"
    >
      {children}
    </button>
  );
};
