import { css } from '@emotion/react';

const listStyle = css({
  /*
    Increasing specificity with double ampersand to ensure these rules take
    priority over the global styles applied to 'ol' elements.
  */
  '&&': {
    listStyleType: 'none',
    paddingLeft: 0,
  },
});

export default listStyle;
