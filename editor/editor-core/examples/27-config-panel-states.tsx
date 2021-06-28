import React from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';

import {
  DefaultExtensionProvider,
  ExtensionManifest,
  ExtensionProvider,
} from '@atlaskit/editor-common';

import { N30 } from '@atlaskit/theme/colors';

import { nativeFields } from '../example-helpers/config-panel/fields';

import ConfigPanel from '../src/ui/ConfigPanel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;

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
  height: 450px;
  padding: 16px;
  overflow-y: auto;
`;

const createFakeContextPanel = (
  extensionProvider: ExtensionProvider,
) => (props: { title: string; nodeKey: string }) => {
  return (
    <ContextPanelWrapper>
      <h3>{props.title}</h3>
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
  description: 'Extension used as example to demonstrate different states.',
  documentationUrl: 'http://atlassian.com',
  icons: {
    '48': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    nodes: {
      loading: {
        type: 'extension',
        render: () => Promise.resolve(() => null),
        getFieldsDefinition: () => {
          return new Promise((resolve) => {
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
      loaded: {
        type: 'extension',
        render: () => Promise.resolve(() => null),
        getFieldsDefinition: () => {
          return Promise.resolve([nativeFields[0], nativeFields[1]]);
        },
      },
    },
  },
};

const FakeContextPanel = createFakeContextPanel(
  new DefaultExtensionProvider([exampleManifest]),
);

const manifestWithSummary = {
  ...exampleManifest,
  summary: 'Short text describing this extension',
};

const manifestWithoutDescription = {
  ...exampleManifest,
  summary: 'No description',
  description: undefined,
};

const manifestWithoutDescriptionOrDocumentation = {
  ...exampleManifest,
  summary: 'No description, no docs',
  description: undefined,
  documentationUrl: undefined,
};

const manifestWithoutDocumentation = {
  ...exampleManifest,
  summary: 'No docs',
  documentationUrl: undefined,
};

const manifestWithoutSummaryAndDocumentation = {
  ...exampleManifest,
  summary: undefined,
  documentationUrl: undefined,
};

const manifestWithoutSummaryAndDescriptionAndDocumentation = {
  ...exampleManifest,
  summary: undefined,
  description: undefined,
  documentationUrl: undefined,
};

const FakeContextPanelWithSummary = createFakeContextPanel(
  new DefaultExtensionProvider([manifestWithSummary]),
);

const FakeContextPanelWithoutDescription = createFakeContextPanel(
  new DefaultExtensionProvider([manifestWithoutDescription]),
);

const FakeContextPanelWithoutDescriptionOrDocumentation = createFakeContextPanel(
  new DefaultExtensionProvider([manifestWithoutDescriptionOrDocumentation]),
);

const FakeContextPanelWithoutDocumentation = createFakeContextPanel(
  new DefaultExtensionProvider([manifestWithoutDocumentation]),
);

const FakeContextPanelWithoutSummaryAndDocumentation = createFakeContextPanel(
  new DefaultExtensionProvider([manifestWithoutSummaryAndDocumentation]),
);

const FakeContextPanelWithoutSummaryAndDescriptionAndDocumentation = createFakeContextPanel(
  new DefaultExtensionProvider([
    manifestWithoutSummaryAndDescriptionAndDocumentation,
  ]),
);

const noop = () => {};

export default function Example() {
  return (
    <>
      <Wrapper>
        <FakeContextPanel nodeKey="loading" title="Loading state" />
        <FakeContextPanel nodeKey="error" title="Error state" />
        <FakeContextPanel nodeKey="loaded" title="Loaded state" />
      </Wrapper>
      <Wrapper>
        <FakeContextPanelWithSummary nodeKey="loaded" title="With summary" />
        <FakeContextPanelWithoutDescription
          nodeKey="loaded"
          title="Missing description"
        />
        <FakeContextPanelWithoutDescriptionOrDocumentation
          nodeKey="loaded"
          title="Missing description and docs"
        />
      </Wrapper>
      <Wrapper>
        <FakeContextPanelWithoutDocumentation
          nodeKey="loaded"
          title="Missing docs"
        />
        <FakeContextPanelWithoutSummaryAndDocumentation
          nodeKey="loaded"
          title="Missing summary and docs"
        />
        <FakeContextPanelWithoutSummaryAndDescriptionAndDocumentation
          nodeKey="loaded"
          title="Missing description, summary and docs"
        />
      </Wrapper>
    </>
  );
}
