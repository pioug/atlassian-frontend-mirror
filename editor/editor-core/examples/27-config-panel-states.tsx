import React from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';

import {
  combineExtensionProviders,
  DefaultExtensionProvider,
  ExtensionManifest,
} from '@atlaskit/editor-common';

import { N30 } from '@atlaskit/theme/colors';

import { nativeFields } from '../example-helpers/config-panel/fields';

import ConfigPanel from '../src/ui/ConfigPanel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 90vh;

  h3 {
    margin: 8px 0;
  }
`;

const ContextPanelWrapper = styled.div`
  margin: 8px;
  height: 100%;
`;

const ContextPanel = styled.div`
  border: 1px solid ${N30};
  width: 360px;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
`;

const FakeContextPanel = (props: { nodeKey: string }) => {
  return (
    <ContextPanelWrapper>
      <h3>{props.nodeKey}</h3>
      <ContextPanel>
        <IntlProvider locale="en-AU">
          <ConfigPanel
            showHeader
            extensionProvider={extensionProvider}
            extensionKey="examples"
            extensionType="twp.editor.example"
            nodeKey={props.nodeKey}
            onChange={noop}
            onCancel={noop}
          />
        </IntlProvider>
      </ContextPanel>
    </ContextPanelWrapper>
  );
};

const exampleManifest: ExtensionManifest = {
  title: 'Editor example',
  type: 'twp.editor.example',
  key: 'examples',
  description: 'Example of error in Editor config panel',
  icons: {
    '48': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    nodes: {
      loading: {
        type: 'extension',
        render: () => Promise.resolve(() => null),
        getFieldsDefinition: () => {
          return new Promise(resolve => {
            // never resolves
          });
        },
      },
      error: {
        type: 'extension',
        render: () => Promise.resolve(() => null),
        getFieldsDefinition: () => {
          return Promise.reject(
            new Error(
              'This is an error that gets included when the Promise returned from getFieldsDefinition is rejected.',
            ),
          );
        },
      },
      normal: {
        type: 'extension',
        render: () => Promise.resolve(() => null),
        getFieldsDefinition: () => {
          return Promise.resolve(nativeFields);
        },
      },
    },
  },
};

const extensionProvider = combineExtensionProviders([
  new DefaultExtensionProvider([exampleManifest]),
]);

const noop = () => {};

export default function Example() {
  return (
    <Wrapper>
      <FakeContextPanel nodeKey="loading" />
      <FakeContextPanel nodeKey="error" />
      <FakeContextPanel nodeKey="normal" />
    </Wrapper>
  );
}
