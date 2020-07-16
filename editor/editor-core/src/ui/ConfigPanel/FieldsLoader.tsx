import React, { useState } from 'react';

import {
  ExtensionManifest,
  FieldDefinition,
} from '@atlaskit/editor-common/extensions';

import { PublicProps } from './types';

import { useStateFromPromise } from '../../utils/react-hooks/use-state-from-promise';
import ConfigPanel from './ConfigPanel';

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
  extensionParameters = {},
  parameters = {},
  autoSave,
  closeOnEsc,
  showHeader,
  onChange,
  onCancel,
}: PublicProps) {
  const [extensionManifest] = useStateFromPromise<
    ExtensionManifest | undefined
  >(() => extensionProvider.getExtension(extensionType, extensionKey), [
    extensionProvider,
    extensionType,
    extensionKey,
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fields] = useStateFromPromise<FieldDefinition[] | undefined>(
    function getExtensionFields() {
      const fn = getFieldsDefinitionFn(
        extensionManifest as ExtensionManifest,
        nodeKey,
      );

      if (typeof fn === 'function') {
        return fn(extensionParameters).catch((err: any) => {
          if (err && typeof err.message === 'string') {
            setErrorMessage(err.message);
          }
          return undefined;
        });
      }
    },
    [extensionManifest, nodeKey, extensionParameters],
  );

  return (
    <ConfigPanel
      extensionManifest={extensionManifest}
      isLoading={!extensionManifest || (errorMessage === null && !fields)}
      fields={fields}
      parameters={parameters}
      autoSave={autoSave}
      closeOnEsc={closeOnEsc}
      showHeader={showHeader}
      onChange={onChange}
      onCancel={onCancel}
      errorMessage={errorMessage}
    />
  );
}
