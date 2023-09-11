/** @jsx jsx */
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const emojiButtonStyle = css({
  outline: 'none',
  display: 'flex',
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '0',
  padding: `10px ${token('space.100', '8px')}`,
  '&:hover > span': {
    transition: 'transform cubic-bezier(0.23, 1, 0.32, 1) 200ms',
    transform: 'scale(1.33)',
  },
});
