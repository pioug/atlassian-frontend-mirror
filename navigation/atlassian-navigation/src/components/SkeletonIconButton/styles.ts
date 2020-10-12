import { CSSObject } from '@emotion/core';

import { NavigationTheme } from '../../theme';

export default ({
  mode: {
    iconButton: { default: defaultStyles },
  },
}: NavigationTheme): CSSObject => ({
  ...defaultStyles,
  border: 0,
  margin: 0,
  marginRight: 4,
  padding: '4px 6px',
  borderRadius: '100%',
  pointerEvents: 'none',

  ':focus, :active, :hover': {
    border: 0,
    outline: 0,
    appearance: 'none',
  },

  // targeting the AppSwitcher on the right
  '&:only-of-type': {
    marginRight: 0,
  },

  '& > span': {
    lineHeight: 'normal',
  },

  '& > img': {
    borderRadius: '100%',
    height: 24,
    width: 24,
    verticalAlign: 'middle',
  },
});
