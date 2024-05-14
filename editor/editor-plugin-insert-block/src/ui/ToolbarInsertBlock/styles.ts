import { css } from '@emotion/react';

export const triggerWrapper = css({
  width: '42px',
  display: 'flex',
  alignItems: 'center',
  '> div, > span': {
    display: 'flex',
  },
  '> div > div': {
    display: 'flex',
  },
});
