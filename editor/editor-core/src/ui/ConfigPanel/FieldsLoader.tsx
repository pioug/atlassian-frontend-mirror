import React from 'react';

import Spinner from '@atlaskit/spinner';

import {
  ExtensionProvider,
  ExtensionManifest,
  ExtensionType,
  ExtensionKey,
  Parameters,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { useStateFromPromise } from '../../utils/react-hooks/use-state-from-promise';
import ConfigPanel from './ConfigPanel';

type Props = {
  extensionProvider: ExtensionProvider;
  extensionType: ExtensionType;
  extensionKey: ExtensionKey;
  nodeKey: string;
  parameters?: Parameters;
  onSave: (data: Parameters) => void | string;
  onCancel: () => void;
};

const getFieldsDefinitionFn = (
  extensionManifest: ExtensionManifest,
  nodeKey: string,
) => {
  if (
    extensionManifest &&
    extensionManifest.modules.nodes &&
    extensionManifest.modules.nodes[nodeKey] &&
    extensionManifest.modules.nodes[nodeKey].getFieldsDefinition
  ) {
    return extensionManifest.modules.nodes[nodeKey].getFieldsDefinition;
  }
};

export default function FieldsLoader({
  extensionType,
  extensionKey,
  nodeKey,
  extensionProvider,
  parameters = {},
  onSave,
  onCancel,
}: Props) {
  const [extensionManifest] = useStateFromPromise<
    ExtensionManifest | undefined
  >(() => extensionProvider.getExtension(extensionType, extensionKey), [
    extensionProvider,
    extensionType,
    extensionKey,
  ]);

  const [fields] = useStateFromPromise<FieldDefinition[] | undefined>(
    function getExtensionFields() {
      const fn = getFieldsDefinitionFn(
        extensionManifest as ExtensionManifest,
        nodeKey,
      );

      if (typeof fn === 'function') {
        return fn();
      }
    },
    [extensionManifest, nodeKey],
  );

  if (!extensionManifest || !fields) {
    return <Spinner size="small" />;
  }

  return (
    <ConfigPanel
      extensionManifest={extensionManifest}
      fields={fields}
      parameters={parameters}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
