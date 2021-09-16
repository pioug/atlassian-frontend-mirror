import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import TextArea from '@atlaskit/textarea';
import { CodeBlock } from '@atlaskit/code';

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

const ExampleWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div<{ width: number | string }>`
  width: ${(props) => props.width}px;
  margin: ${gridSize() * 2}px;

  h3 {
    border-bottom: 1px solid ${colors.N50};
    margin-bottom: ${gridSize() * 2}px;
  }
`;

const CodeWrapper = styled.div`
  margin-top: ${gridSize() * 2}px;
`;

function ExtensionConfigPanel({
  extension,
  node,
  nodeKey,
  extensionProvider,
  parameters: initialParameters = {},
  item,
}: { extensionProvider: ExtensionProvider; nodeKey: string } & CallbackParams) {
  const [fields] = useStateFromPromise(
    function getFields() {
      if (node && typeof node.getFieldsDefinition === 'function') {
        return node.getFieldsDefinition({});
      }
    },
    [node],
    [],
  );

  const [parametersJson, setParametersJson] = useState(() =>
    JSON.stringify(initialParameters),
  );

  const [parameters, setParameters] = useState(initialParameters);

  function onChangeParametersJson(event: any) {
    setParametersJson(event.target.value);
  }

  useEffect(() => {
    try {
      setParameters({
        ...parameters,
        ...JSON.parse(parametersJson),
      });
    } catch (e) {
      console.error('Invalid JSON Parameters', e.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametersJson]);

  if (!extension || !node || !item) {
    return null;
  }

  return (
    <ExampleWrapper>
      <Column width="400" key="config-panel">
        <h3>Config panel:</h3>
        <ConfigPanelWithProviders
          extensionType={extension.type}
          extensionKey={extension.key}
          nodeKey={nodeKey}
          extensionProvider={extensionProvider}
          parameters={parameters}
          onChange={setParameters}
        />
      </Column>
      <Column width="500" key="parameters">
        <h3>Initial Parameters:</h3>
        <CodeWrapper>
          {parameters && (
            <TextArea
              onChange={onChangeParametersJson}
              value={parametersJson}
            />
          )}
        </CodeWrapper>
        <h3>State:</h3>
        <CodeWrapper>
          {parameters && (
            <CodeBlock
              language="json"
              text={JSON.stringify(parameters, null, 4)}
              showLineNumbers={false}
            />
          )}
        </CodeWrapper>
      </Column>
      <Column width="500" key="fields-definition">
        <h3>Fields definition:</h3>
        <CodeWrapper>
          <CodeBlock
            language="json"
            text={JSON.stringify(fields, null, 4)}
            showLineNumbers={false}
          />
        </CodeWrapper>
      </Column>
    </ExampleWrapper>
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
  const [extensionKey, nodeKey] = getExtensionKeyAndNodeKey(
    hash,
    extensionNode && extensionNode.extension
      ? extensionNode.extension.type
      : '',
  );

  const actualParameters =
    extensionNode &&
    extensionNode.parameters &&
    Object.keys(extensionNode.parameters).length > 0
      ? extensionNode.parameters
      : parameters;

  return (
    <IntlProvider locale="en-AU">
      <Wrapper>
        <div style={{ float: 'left' }} key="panel">
          {extensionNode?.node && item && (
            <ExtensionConfigPanel
              key={hash}
              extension={extensionNode.extension}
              extensionProvider={extensionProvider}
              nodeKey={nodeKey}
              node={extensionNode.node}
              item={item}
              parameters={actualParameters}
            />
          )}
        </div>
        <div style={{ float: 'right' }} key="picker">
          <ExtensionNodePicker
            selectedExtension={extensionKey}
            selectedNode={nodeKey}
            extensionProvider={extensionProvider}
            onSelect={(params) => {
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
