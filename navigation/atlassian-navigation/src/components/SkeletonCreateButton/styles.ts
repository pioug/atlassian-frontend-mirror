import { CSSObject } from '@emotion/core';

import { NavigationTheme } from '../../theme';

export default ({
  mode: {
    create: { default: defaultStyles },
  },
}: NavigationTheme): CSSObject => ({
  ...defaultStyles,
  border: 0,
  fontWeight: 500,
  fontSize: 14,
  height: 32,
  borderRadius: 3,
  alignSelf: 'center',
  padding: '0 12px',
  pointerEvents: 'none',
  lineHeight: 1,

  ':focus, :active, :hover': {
    border: 0,
    outline: 0,
    appearance: 'none',
  },

  '&&': {
    marginLeft: 12,
  },
});
