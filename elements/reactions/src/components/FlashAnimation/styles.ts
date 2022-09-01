/** @jsx jsx */
import { css, keyframes } from '@emotion/core';
import { B75, B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const flashTime = 700;

export const flashAnimation = keyframes({
  '0%': {
    backgroundColor: 'transparent',
  },
  '20%': {
    backgroundColor: token('color.background.selected.pressed', B75),
    borderColor: token('color.border.selected', B300),
  },
  '75%': {
    backgroundColor: token('color.background.selected.pressed', B75),
    borderColor: token('color.border.selected', B300),
  },
  '100%': {
    backgroundColor: token('color.background.selected.pressed', B75),
    borderColor: token('color.border.selected', B300),
  },
});

export const containerStyle = css({
  width: '100%',
  height: '100%',
});

export const flashStyle = css({
  animation: `${flashAnimation} ${flashTime}ms ease-in-out`,
});
