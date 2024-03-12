import { css } from '@emotion/react';

// We use !important to ensure next sibling gets the margin reset no matter what

export const clearNextSiblingMarginTopStyle = css({
  '& + *': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
    marginTop: '0 !important',
  },
});

const textElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const nextSiblingBlockMarkContentSelectors = textElements
  .map((elem) => `+ .fabric-editor-block-mark > ${elem}`)
  .join(',');

export const clearNextSiblingBlockMarkMarginTopStyle = css({
  [`${nextSiblingBlockMarkContentSelectors}`]: {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
    marginTop: '0 !important',
  },
});
