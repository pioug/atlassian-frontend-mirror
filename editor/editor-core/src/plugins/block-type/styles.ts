import { css } from 'styled-components';
import {
  blockquoteSharedStyles,
  headingsSharedStyles,
} from '@atlaskit/editor-common/styles';

export const blocktypeStyles = css`
  .ProseMirror {
    ${blockquoteSharedStyles};
    ${headingsSharedStyles};
  }
`;
