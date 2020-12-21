import React, { useState } from 'react';

import {
  ExtensionManifest,
  FieldDefinition,
  ExtensionProvider,
  ExtensionType,
  ExtensionKey,
  Parameters,
} from '@atlaskit/editor-common/extensions';

export type PublicProps = {
  extensionProvider: ExtensionProvider;
  extensionType: ExtensionType;
  extensionKey: ExtensionKey;
  nodeKey: string;
  extensionParameters?: Parameters;
  parameters?: Parameters;
  autoSave?: boolean;
  autoSaveTrigger?: unknown;
  closeOnEsc?: boolean;
  showHeader?: boolean;
  onChange: (data: Parameters) => void;
  onCancel: () => void;
};

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

// having the default value in the props instead of a reference will cause excessive rerenders
const defaultEmptyObject = {};

export default function FieldsLoader({
  extensionType,
  extensionKey,
  nodeKey,
  extensionProvider,
  extensionParameters = defaultEmptyObject,
  parameters = defaultEmptyObject,
  autoSave,
  autoSaveTrigger,
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
      autoSaveTrigger={autoSaveTrigger}
      closeOnEsc={closeOnEsc}
      showHeader={showHeader}
      onChange={onChange}
      onCancel={onCancel}
      errorMessage={errorMessage}
    />
  );
}
