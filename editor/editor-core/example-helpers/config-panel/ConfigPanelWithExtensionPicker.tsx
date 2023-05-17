/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { css, jsx } from '@emotion/react';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
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

const wrapper = css`
  margin: 16px;
`;

const exampleWrapper = css`
  display: flex;
  flex-direction: row;
`;

const column = (width: number | string) => css`
  width: ${width}px;
  margin: ${token('space.200', '16px')};

  h3 {
    border-bottom: 1px solid ${colors.N50};
    margin-bottom: ${token('space.200', '16px')};
  }
`;

const codeWrapper = css`
  margin-top: ${token('space.200', '16px')};
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
      console.error(
        'Invalid JSON Parameters',
        e instanceof Error ? e.message : String(e),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametersJson]);

  if (!extension || !node || !item) {
    return null;
  }

  return (
    <div css={exampleWrapper}>
      <div css={column(400)} key="config-panel">
        <h3>Config panel:</h3>
        <ConfigPanelWithProviders
          extensionType={extension.type}
          extensionKey={extension.key}
          nodeKey={nodeKey}
          extensionProvider={extensionProvider}
          parameters={parameters}
          onChange={setParameters}
        />
      </div>
      <div css={column(500)} key="parameters">
        <h3>Initial Parameters:</h3>
        <div css={codeWrapper}>
          {parameters && (
            <TextArea
              onChange={onChangeParametersJson}
              value={parametersJson}
            />
          )}
        </div>
        <h3>State:</h3>
        <div css={codeWrapper}>
          {parameters && (
            <CodeBlock
              language="json"
              text={JSON.stringify(parameters, null, 4)}
              showLineNumbers={false}
            />
          )}
        </div>
      </div>
      <div css={column(500)} key="fields-definition">
        <h3>Fields definition:</h3>
        <div css={codeWrapper}>
          <CodeBlock
            language="json"
            text={JSON.stringify(fields, null, 4)}
            showLineNumbers={false}
          />
        </div>
      </div>
    </div>
  );
}

const addHashToTheUrl = (extensionPath: string): void => {
  // @ts-expect-error
  window.top.location.hash = extensionPath;
};

const getHashFromUrl = (): string =>
  // @ts-expect-error
  window.top.location.hash &&
  // @ts-expect-error
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
      <div css={wrapper}>
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
      </div>
    </IntlProvider>
  );
}
