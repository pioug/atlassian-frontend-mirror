import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';

import { AkCodeBlock } from '@atlaskit/code';

import {
  getExtensionKeyAndNodeKey,
  ExtensionProvider,
  ExtensionModule,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import ConfigPanelWithProviders from './ConfigPanelWithProviders';
import ExtensionNodePicker, { CallbackParams } from './ExtensionNodePicker';
import { useStateFromPromise } from '../../src/utils/react-hooks/use-state-from-promise';

const Wrapper = styled.div`
  margin: 16px;
`;

const FormWrapper = styled.div`
  width: 400px;
`;

const CodeWrapper = styled.div`
  margin-top: 16px;
`;

function ExtensionConfigPanel({
  extension,
  node,
  nodeKey,
  extensionProvider,
  parameters = {},
  item,
}: { extensionProvider: ExtensionProvider; nodeKey: string } & CallbackParams) {
  const [fields] = useStateFromPromise(
    function getFields() {
      if (node && typeof node.getFieldsDefinition === 'function') {
        return node.getFieldsDefinition();
      }
    },
    [node],
    [],
  );

  if (!extension || !node || !item) {
    return null;
  }

  return (
    <FormWrapper>
      <h3>Property panel:</h3>
      <h4>{item.title}</h4>
      {item.description && (
        <p>
          <em>{item.description}</em>
        </p>
      )}
      <p>
        Extension key: <strong>{extension.key}</strong>
      </p>

      <ConfigPanelWithProviders
        extensionType={extension.type}
        extensionKey={extension.key}
        nodeKey={nodeKey}
        extensionProvider={extensionProvider}
        parameters={parameters}
      />

      <h4>Macro fields definition:</h4>
      <CodeWrapper>
        <AkCodeBlock
          language="json"
          text={JSON.stringify(fields, null, 4)}
          showLineNumbers={false}
        />
      </CodeWrapper>

      <h4>Macro parameters:</h4>
      <CodeWrapper>
        {parameters && (
          <AkCodeBlock
            language="json"
            text={JSON.stringify(parameters, null, 4)}
            showLineNumbers={false}
          />
        )}
      </CodeWrapper>
    </FormWrapper>
  );
}

const addHashToTheUrl = (extensionPath: string): void => {
  window.top.location.hash = extensionPath;
};

const getHashFromUrl = (): string =>
  window.top.location.hash &&
  decodeURIComponent(window.top.location.hash.slice(1));

export default function ConfigPanelWithExtensionPicker({
  extensionProvider,
  parameters = {},
}: {
  extensionProvider: ExtensionProvider;
  parameters?: Parameters;
}) {
  const [hash, setHash] = useState<string>(getHashFromUrl());
  const [extensionNode, setNodeAndParameters] = useState<CallbackParams>();
  const [item, setItem] = useState<ExtensionModule>();

  const [extensionKey, nodeKey] = getExtensionKeyAndNodeKey(hash);

  const params =
    extensionNode &&
    extensionNode.parameters &&
    Object.keys(extensionNode.parameters).length > 0
      ? extensionNode.parameters
      : parameters;

  return (
    <IntlProvider locale="en-AU">
      <Wrapper>
        <div style={{ float: 'left' }}>
          {extensionNode && extensionNode.node && item && (
            <ExtensionConfigPanel
              key={hash}
              extension={extensionNode.extension}
              extensionProvider={extensionProvider}
              nodeKey={nodeKey}
              node={extensionNode.node}
              item={item}
              parameters={params}
            />
          )}
        </div>
        <div style={{ float: 'right' }}>
          <ExtensionNodePicker
            selectedExtension={extensionKey}
            selectedNode={nodeKey}
            extensionProvider={extensionProvider}
            onSelect={params => {
              setNodeAndParameters(params);
              setItem(params.item);

              if (params.extension) {
                const hash = `${params.extension.key}:${params.nodeKey}`;
                addHashToTheUrl(hash);
                setHash(hash);
              }
            }}
          />
        </div>
      </Wrapper>
    </IntlProvider>
  );
}
