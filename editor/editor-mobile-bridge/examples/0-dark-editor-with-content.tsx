import React from 'react';
import styled from 'styled-components';
import { exampleDocument } from '@atlaskit/editor-core/example-helpers/example-document';
import Editor from './../src/editor/mobile-editor-element';
import { createEditorProviders } from '../src/providers';
import { useFetchProxy } from '../src/utils/fetch-proxy';
import MobileEditorConfiguration from '../src/editor/editor-configuration';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';

export const Wrapper: any = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

Wrapper.displayName = 'Wrapper';

export default function Example() {
  const fetchProxy = useFetchProxy();

  return (
    <Wrapper>
      <Editor
        bridge={getBridge()}
        {...createEditorProviders(fetchProxy)}
        defaultValue={exampleDocument}
        initialEditorConfig={
          new MobileEditorConfiguration('{ "mode": "dark" }')
        }
      />
    </Wrapper>
  );
}
