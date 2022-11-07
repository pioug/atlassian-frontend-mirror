import { css } from '@emotion/react';

import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { browser } from '@atlaskit/editor-common/utils';
import { codeBlockInListSafariFix } from '@atlaskit/editor-common/styles';

export const listsStyles = css`
  .ProseMirror li {
    position: relative;

    > p:not(:first-child) {
      margin: 4px 0 0 0;
    }

    // In SSR the above rule will apply to all p tags because first-child would be a style tag.
    // The following rule resets the first p tag back to its original margin
    // defined in packages/editor/editor-common/src/styles/shared/paragraph.ts
    > style:first-child + p {
      margin-top: ${blockNodesVerticalMargin};
    }

    ${browser.safari ? codeBlockInListSafariFix : ''}
  }
`;
