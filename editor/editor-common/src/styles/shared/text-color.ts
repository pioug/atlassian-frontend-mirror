import { css } from '@emotion/react';

export const textColorStyles = css({
  '.fabric-text-color-mark': {
    color: 'var(--custom-palette-color, inherit)',
  },
  'a .fabric-text-color-mark': {
    color: 'unset',
  },
});
