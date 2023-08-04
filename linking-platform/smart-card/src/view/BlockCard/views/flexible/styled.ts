import { css } from '@emotion/react';

// in editor prosemirror adds padding-left so we need to overwrite it
export const metadataBlockCss = css`
  /* primary element group */
  span[data-smart-element-avatar-group] {
    > ul {
      padding-left: 0px;
    }
  }
`;
export const titleBlockCss = css`
  gap: 0.5em;
`;
