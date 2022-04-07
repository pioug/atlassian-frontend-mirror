import { css } from '@emotion/react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

// For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()

export const InlineNodeViewSharedStyles = css`
  .inlineNodeView {
    display: inline;
    user-select: all;
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
