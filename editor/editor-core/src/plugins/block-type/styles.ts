import { css } from '@emotion/react';
import type { ThemeProps } from '@atlaskit/theme/types';
import {
  blockquoteSharedStyles,
  headingsSharedStyles,
} from '@atlaskit/editor-common/styles';

export const blocktypeStyles = (props: ThemeProps) => css`
  .ProseMirror {
    ${blockquoteSharedStyles};
    ${headingsSharedStyles(props)};
  }
`;
