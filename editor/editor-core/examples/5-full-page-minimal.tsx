import styled from 'styled-components';
import React from 'react';

import { borderRadius } from '@atlaskit/theme/constants';
import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '@atlaskit/editor-shared-styles';

import Editor from './../src/editor';

export const Wrapper: any = styled.div`
  height: 500px;
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  background: #fff;
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
Content.displayName = 'Content';

export type Props = {};
export type State = { disabled: boolean };

export default function Example() {
  return (
    <Wrapper>
      <Content>
        <Editor appearance="full-page" />
      </Content>
    </Wrapper>
  );
}
