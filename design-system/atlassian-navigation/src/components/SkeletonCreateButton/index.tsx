/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useTheme } from '../../theme';

import { type SkeletonCreateButtonProps } from './types';

const skeletonCreateButtonStyles = css({
  height: 32,
  padding: `0 ${token('space.150', '12px')}`,
  alignSelf: 'center',
  border: 0,
  borderRadius: token('border.radius', '3px'),
  font: token('font.body'),
  fontWeight: token('font.weight.medium'),
  pointerEvents: 'none',
  ':focus, :active, :hover': {
    appearance: 'none',
    border: 0,
    outline: 0,
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&&': {
    marginInlineStart: token('space.150', '12px'),
  },
});

/**
 * __Skeleton create button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the Create button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonCreateButton = ({
  text,
  testId,
}: SkeletonCreateButtonProps) => {
  const theme = useTheme();

  return (
    <button
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      style={theme.mode.create.default as React.CSSProperties}
      css={skeletonCreateButtonStyles}
      data-testid={testId}
      type="button"
    >
      {text}
    </button>
  );
};
