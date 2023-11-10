import { css } from '@emotion/react';

import { inlineNodeViewClassname } from '@atlaskit/editor-common/react-node-view';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

// For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()

export const InlineNodeViewSharedStyles = css`
  .${inlineNodeViewClassname} {
    display: inline;
    user-select: all;
    /* Collapses zero width spaces inside the inline node view
    to prevent the node from line breaking too early.
    */
    white-space: nowrap;
    /* Then reset to the Editor default so we don't interfere
    with any component styling. */
    & > *:not(.zeroWidthSpaceContainer) {
      white-space: pre-wrap;
    }
    // Prevent visually hidden assistive text from being selected.
    & > .assistive {
      user-select: none;
    }
  }
  /** Remove browser deafult selections style. This prevents
    unexpected visual artefacts in Safari when navigating
    with the keyboard or making range selections. */
  &.ua-safari {
    .${inlineNodeViewClassname} {
      ::selection,
      *::selection {
        background: transparent;
      }
    }
  }

  &.ua-chrome .${inlineNodeViewClassname} > span {
    user-select: none;
  }

  .${inlineNodeViewClassname}AddZeroWidthSpace {
    ::after {
      content: '${ZERO_WIDTH_SPACE}';
    }
  }
`;
