import React from 'react';
import styled from 'styled-components';
import Editor from './../src/editor/mobile-editor-element';
import { createEditorProviders } from '../src/providers';
import { useFetchProxy } from '../src/utils/fetch-proxy';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import MobileEditorConfiguration from '../src/editor/editor-configuration';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'B',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'C',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Heading',
        },
      ],
    },
  ],
};

const Wrapper: any = styled.div`
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
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(
    bridge,
    new MobileEditorConfiguration(),
  );

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
