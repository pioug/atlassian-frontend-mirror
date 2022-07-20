import { css } from '@emotion/react';

// We use !important to ensure next sibling gets the margin reset no matter what
const marginTopReset = `margin-top: 0 !important;`;

export const clearNextSiblingMarginTopStyle = css`
  & + * {
    ${marginTopReset}
  }
`;

const textElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const nextSiblingBlockMarkContentSelectors = textElements
  .map((elem) => `+ .fabric-editor-block-mark > ${elem}`)
  .join(',');

export const clearNextSiblingBlockMarkMarginTopStyle = css`
  ${nextSiblingBlockMarkContentSelectors} {
    ${marginTopReset}
  }
`;
