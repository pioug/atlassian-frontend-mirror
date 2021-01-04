import React from 'react';
import styled from 'styled-components';
import { exampleDocument } from '@atlaskit/editor-core/example-helpers/example-document';
import Editor from './../src/editor/mobile-editor-element';
import { createEditorProviders } from '../src/providers';
import { useFetchProxy } from '../src/utils/fetch-proxy';
import MobileEditorConfiguration from '../src/editor/editor-configuration';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

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
  const bridge = getBridge(new MobileEditorConfiguration('{ "mode": "dark" }'));
  const editorConfiguration = useEditorConfiguration(bridge);

  return (
    <Wrapper>
      <Editor
        bridge={bridge}
        {...createEditorProviders(fetchProxy)}
        defaultValue={exampleDocument}
        editorConfiguration={editorConfiguration}
        locale={editorConfiguration.getLocale()}
      />
    </Wrapper>
  );
}
