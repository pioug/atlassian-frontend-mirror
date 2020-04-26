import React from 'react';
import { IntlProvider } from 'react-intl';

import ConfigPanel from '../../src/ui/ConfigPanel';

import {
  ExtensionProvider,
  Parameters,
  ExtensionType,
  ExtensionKey,
} from '@atlaskit/editor-common/extensions';

export default function ConfigPanelWithProviders({
  extensionType,
  extensionKey,
  nodeKey,
  extensionProvider,
  parameters,
}: {
  extensionType: ExtensionType;
  extensionKey: ExtensionKey;
  nodeKey: string;
  extensionProvider: ExtensionProvider;
  parameters: Parameters;
}) {
  return (
    <IntlProvider locale="en">
      <ConfigPanel
        extensionType={extensionType}
        extensionKey={extensionKey}
        nodeKey={nodeKey}
        extensionProvider={extensionProvider}
        parameters={parameters}
        showHeader
        onChange={data => console.log(data, JSON.stringify(data))}
        onCancel={() => console.log('onCancel')}
      />
    </IntlProvider>
  );
}
