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
  onChange,
}: {
  extensionType: ExtensionType;
  extensionKey: ExtensionKey;
  nodeKey: string;
  extensionProvider: ExtensionProvider;
  parameters: Parameters;
  onChange?: (parameters: Parameters) => void;
}) {
  function _onChange(data: Parameters) {
    if (onChange) {
      onChange(data);
    }
  }

  return (
    <IntlProvider locale="en">
      <ConfigPanel
        extensionType={extensionType}
        extensionKey={extensionKey}
        nodeKey={nodeKey}
        extensionProvider={extensionProvider}
        parameters={parameters}
        showHeader
        autoSave
        onChange={_onChange}
        onCancel={() => console.log('onCancel')}
      />
    </IntlProvider>
  );
}
