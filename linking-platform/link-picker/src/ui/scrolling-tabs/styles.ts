import { css, SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N0, N30 } from '@atlaskit/theme/colors';

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
    left: 8,
    right: 8,
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
  top: 4,
  zIndex: 999,
  backgroundColor: token('elevation.surface', N0),
});

export const backButtonStyles: SerializedStyles = css([
  buttonContainerStyles,
  {
    left: 0,
  },
]);

export const nextButtonStyles: SerializedStyles = css([
  buttonContainerStyles,
  {
    right: 0,
  },
]);
