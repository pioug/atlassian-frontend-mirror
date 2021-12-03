import { css } from 'styled-components';

export const textColorStyles = css`
  .fabric-text-color-mark {
    color: var(--custom-text-color, inherit);
  }

  a .fabric-text-color-mark {
    color: unset;
  }
`;
