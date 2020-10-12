import { CSSObject } from '@emotion/core';

import { NavigationTheme } from '../../theme';

export default (
  { mode: { primaryButton } }: NavigationTheme,
  isDropdownButton?: boolean,
  isHighlighted?: boolean,
): CSSObject => ({
  ...primaryButton.default,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: 1,
  position: 'relative',
  pointerEvents: 'none',
  appearance: 'none',
  border: 0,
  padding: '0 4px',
  margin: '0 6px',

  ':focus, :active, :hover': {
    border: 0,
    outline: 0,
    appearance: 'none',
  },

  '::-moz-focus-inner': {
    border: 0,
  },

  ...(isHighlighted && {
    color: primaryButton.selected.color,

    '&:before': {
      position: 'absolute',
      bottom: 0,
      left: 2,
      right: isDropdownButton ? -10 : 2,
      content: '""',
      height: 3,
      backgroundColor: primaryButton.selected.borderColor,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
    },
  }),

  ...(isDropdownButton && {
    marginRight: 18,

    '&:after': {
      // Using a CSS cheveron to limit the
      // DOM element count and avoid
      // unnecessary dependencies
      content: '""',
      display: 'inline-block',
      width: 4,
      height: 4,
      borderRadius: 1,
      borderBottom: '2px solid',
      borderRight: '2px solid',
      borderColor: isHighlighted
        ? primaryButton.default.borderColor
        : primaryButton.default.color,
      transform: 'rotate(45deg) scale(1.05)',
      position: 'absolute',
      top: 'calc(50% - 4px)',
      left: 'calc(100% - 3px)',
      marginLeft: 4,
      verticalAlign: 'middle',
      opacity: 0.51,
    },
  }),
});
