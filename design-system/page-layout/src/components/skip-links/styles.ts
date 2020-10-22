import { CSSObject } from '@emotion/core';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';
import { N30A, N60A } from '@atlaskit/theme/colors';

export const skipLinkStyles: CSSObject = {
  zIndex: -1,
  left: -999999,
  position: 'fixed',
  opacity: 0,

  background: 'white',
  border: 'none',
  padding: '0.8rem 1rem',
  boxShadow: `0 0 0 1px ${N30A}, 0 2px 10px ${N30A}, 0 0 20px -4px ${N60A}`,
  borderRadius: '3px',
  margin: 10,

  /* Do the transform when focused */
  ...prefersReducedMotion(),
  transform: 'translateY(-50%)',
  transition: `transform 0.3s ${easeOut}`,

  ':focus-within': {
    transform: 'translateY(0%)',
    opacity: 1,
    left: 0,
    /* Max z-index is 2147483647. Skip links always be on top,
              but giving a few digits extra space just in case there's
              a future need. */
    zIndex: 2147483640,
  },

  '& > span': {
    fontWeight: 'bold',
  },

  '> ol': {
    listStyleType: 'none',
    listStylePosition: 'outside',
    paddingLeft: 0,
    marginTop: '4px',

    '> li': {
      marginTop: 0,
    },
  },
};
