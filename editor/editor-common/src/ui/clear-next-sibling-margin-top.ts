import { css } from '@emotion/react';

// We use !important to ensure next sibling gets the margin reset no matter what
export const clearNextSiblingMarginTopStyle = css`
  & + * {
    margin-top: 0 !important;
  }
`;
