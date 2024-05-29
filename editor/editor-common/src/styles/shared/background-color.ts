import { css } from '@emotion/react';

export const backgroundColorStyles = (colorMode?: 'light' | 'dark') =>
  css({
    '.fabric-background-color-mark': {
      backgroundColor: 'var(--custom-palette-color, inherit)',
    },
    'a .fabric-background-color-mark': {
      backgroundColor: 'unset',
    },
    '.fabric-background-color-mark .ak-editor-annotation, .fabric-background-color-mark [data-mark-type="annotation"]':
      {
        mixBlendMode: colorMode === 'dark' ? 'color-dodge' : 'multiply',
      },
  });
