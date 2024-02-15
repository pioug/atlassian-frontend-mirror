import { css } from '@emotion/react';

import {
  blockquoteSharedStyles,
  headingsSharedStyles,
} from '@atlaskit/editor-common/styles';

export const blocktypeStyles = () => css`
  .ProseMirror {
    ${blockquoteSharedStyles};
    ${headingsSharedStyles()};
  }
`;
