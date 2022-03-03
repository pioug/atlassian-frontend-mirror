import { css } from '@emotion/react';
import {
  blockquoteSharedStyles,
  headingsSharedStyles,
} from '@atlaskit/editor-common/styles';
import { ThemeProps } from '@atlaskit/theme/types';

export const blocktypeStyles = (props: ThemeProps) => css`
  .ProseMirror {
    ${blockquoteSharedStyles};
    ${headingsSharedStyles(props)};
  }
`;
