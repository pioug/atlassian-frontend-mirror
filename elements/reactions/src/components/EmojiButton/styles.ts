/** @jsx jsx */
import { css } from '@emotion/react';

export const emojiButtonStyle = css({
  outline: 'none',
  display: 'flex',
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '0',
  padding: '10px 8px',
  '&:hover > span': {
    transition: 'transform cubic-bezier(0.23, 1, 0.32, 1) 200ms',
    transform: 'scale(1.33)',
  },
});
