import { css } from '@emotion/react';

export const textColorStyles = css`
  .fabric-text-color-mark {
    color: var(--custom-text-color, inherit);
  }

  a .fabric-text-color-mark {
    color: unset;
  }
`;
