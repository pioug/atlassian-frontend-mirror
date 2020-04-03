import { css } from 'styled-components';
import {
  blockquoteSharedStyles,
  headingsSharedStyles,
} from '@atlaskit/editor-common';

export const blocktypeStyles = css`
  .ProseMirror {
    ${blockquoteSharedStyles};
    ${headingsSharedStyles};
  }
`;
