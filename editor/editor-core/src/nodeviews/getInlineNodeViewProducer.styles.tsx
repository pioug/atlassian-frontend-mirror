import { css } from '@emotion/react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

// For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()

export const InlineNodeViewSharedStyles = css`
  .inlineNodeViewOuterContainer {
    display: inline;
  }

  .inlineNodeViewAddZeroWidthSpace {
    ::after {
      content: '${ZERO_WIDTH_SPACE}';
    }
  }
`;
