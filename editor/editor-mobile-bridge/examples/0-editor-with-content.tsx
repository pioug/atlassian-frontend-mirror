import React from 'react';
import styled from 'styled-components';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import Editor from './../src/editor/mobile-editor-element';
import { createEditorProviders } from '../src/providers';
import { useFetchProxy } from '../src/utils/fetch-proxy';
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
  const defaultValue = useExampleDocument();
  const fetchProxy = useFetchProxy();
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(bridge);

  return (
    <Wrapper>
      <Editor
        bridge={bridge}
        {...createEditorProviders(fetchProxy)}
        defaultValue={defaultValue}
        editorConfiguration={editorConfiguration}
        locale={editorConfiguration.getLocale()}
      />
    </Wrapper>
  );
}
