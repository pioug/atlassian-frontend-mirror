import { css } from '@emotion/react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

// For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()

export const InlineNodeViewSharedStyles = css`
  .inlineNodeView {
    display: inline;
    user-select: all;
    /* Collapses zero width spaces inside the inline node view
    to prevent the node from line breaking too early.
    */
    white-space: nowrap;
    /* Then reset to the Editor default so we don't interfere
    with any component styling. */
    & > * {
      white-space: pre-wrap;
    }
  }

  &.ua-chrome .inlineNodeView > span {
    user-select: none;
  }

  .inlineNodeViewAddZeroWidthSpace {
    ::after {
      content: '${ZERO_WIDTH_SPACE}';
    }
  }
`;
