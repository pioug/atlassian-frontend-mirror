/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { borderRadius } from '@atlaskit/theme/constants';
import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { Editor } from './../src';

export const wrapper: any = css`
  height: 500px;
`;

export const content: any = css`
  padding: 0 20px;
  height: 100%;
  background: ${token('color.background.neutral.subtle', '#fff')};
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${borderRadius()}px;
    }
  }
`;

export type Props = {};
export type State = { disabled: boolean };

export default function Example() {
  return (
    <div css={wrapper}>
      <div css={content}>
        <Editor appearance="full-page" />
      </div>
    </div>
  );
}
