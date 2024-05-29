import { css, type SerializedStyles } from '@emotion/react';

import { N0, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const scrollingContainerStyles: SerializedStyles = css({
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  scrollPadding: '0 24px',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '&::before': {
    content: '""',
    borderRadius: 2,
    bottom: 0,
    margin: 0,
    position: 'absolute',
    width: 'inherit',
    left: token('space.100', '8px'),
    right: token('space.100', '8px'),
    height: 2,
    backgroundColor: token('color.border', N30),
  },
});

export const containerStyles: SerializedStyles = css({
  position: 'relative',
  '[role="tablist"]': {
    '&::before': {
      display: 'none',
    },
  },
  // Overrides Atlaskit tabs styles to stop overflowing with ellipsis
  '[role="tab"]': {
    overflow: 'unset !important',
    textOverflow: 'unset !important',
  },
});

export const buttonContainerStyles: SerializedStyles = css({
  position: 'absolute',
  top: token('space.050', '4px'),
  zIndex: 999,
  backgroundColor: token('elevation.surface', N0),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-array-arguments -- Ignored via go/DSP-18766
export const backButtonStyles: SerializedStyles = css([
  buttonContainerStyles,
  {
    left: 0,
  },
]);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-array-arguments -- Ignored via go/DSP-18766
export const nextButtonStyles: SerializedStyles = css([
  buttonContainerStyles,
  {
    right: 0,
  },
]);
