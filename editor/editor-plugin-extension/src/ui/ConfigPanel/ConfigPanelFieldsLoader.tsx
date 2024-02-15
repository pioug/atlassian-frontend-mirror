import React, { useEffect, useState } from 'react';

import type {
  ExtensionKey,
  ExtensionManifest,
  ExtensionProvider,
  ExtensionType,
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';
import type {
  ExtractInjectionAPI,
  FeatureFlags,
} from '@atlaskit/editor-common/types';

import type { ExtensionPlugin, RejectSave } from '../../types';

import ConfigPanel from './ConfigPanel';
import { useStateFromPromise } from './use-state-from-promise';

export type PublicProps = {
  extensionProvider: ExtensionProvider;
  extensionType: ExtensionType;
  extensionKey: ExtensionKey;
  nodeKey: string;
  extensionParameters?: Parameters;
  parameters?: Parameters;
  autoSave?: boolean;
  autoSaveTrigger?: () => void;
  autoSaveReject?: RejectSave;
  closeOnEsc?: boolean;
  showHeader?: boolean;
  featureFlags?: FeatureFlags;
  onChange: (data: Parameters) => void;
  onCancel: () => void;
  api: ExtractInjectionAPI<ExtensionPlugin> | undefined;
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

// having the default value in the props instead of a reference will cause excessive rerenders
const defaultEmptyObject = {};

interface FieldDefsPromiseResolverProps {
  children: (fields?: FieldDefinition[]) => React.ReactNode;
  extensionManifest?: ExtensionManifest<Parameters>;
  extensionParameters: Parameters;
  nodeKey: string;
  setErrorMessage: (message: string | null) => void;
}
const FieldDefinitionsPromiseResolver = (
  props: FieldDefsPromiseResolverProps,
) => {
  const { extensionManifest, nodeKey, extensionParameters, setErrorMessage } =
    props;

  const [fields, setFields] = useState<FieldDefinition[] | undefined>(
    undefined,
  );

  // Resolve the promise
  // useStateFromPromise() has an issue which isn't compatible with
  // DynamicFieldDefinitions when it returns a function as setState()
  // will immediately run the function returned and pass it the currentState.
  useEffect(() => {
    if (!extensionManifest) {
      return;
    }

    const promiseFn = getFieldsDefinitionFn(extensionManifest, nodeKey);

    if (typeof promiseFn !== 'function') {
      setFields(undefined);
      return;
    }

    promiseFn(extensionParameters)
      .catch(err => {
        if (err && typeof err.message === 'string') {
          setErrorMessage(err.message);
        }
        setFields(undefined);
      })
      .then(value => {
        if (Array.isArray(value)) {
          // value: FieldDefinition[]
          setFields(value);
        } else if (typeof value === 'function') {
          try {
            // value: DynamicFieldDefinitions
            const dynamicFields: FieldDefinition[] = value(extensionParameters);
            setFields(dynamicFields);
          } catch (err) {
            if (err instanceof Error) {
              setErrorMessage(err.message);
            }
            setFields(undefined);
          }
        } else {
          // value: undefined
          setFields(undefined);
        }
      });
  }, [extensionManifest, nodeKey, extensionParameters, setErrorMessage]);

  return <>{props.children(fields)}</>;
};

export default function FieldsLoader({
  extensionType,
  extensionKey,
  nodeKey,
  extensionProvider,
  extensionParameters = defaultEmptyObject,
  parameters = defaultEmptyObject,
  autoSave,
  autoSaveTrigger,
  autoSaveReject,
  closeOnEsc,
  showHeader,
  featureFlags,
  onChange,
  onCancel,
  api,
}: PublicProps) {
  const [extensionManifest] = useStateFromPromise<
    ExtensionManifest | undefined
  >(
    () => extensionProvider.getExtension(extensionType, extensionKey),
    [extensionProvider, extensionType, extensionKey],
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <FieldDefinitionsPromiseResolver
      setErrorMessage={setErrorMessage}
      extensionManifest={extensionManifest}
      nodeKey={nodeKey}
      extensionParameters={extensionParameters}
    >
      {fields => (
        <ConfigPanel
          api={api}
          extensionManifest={extensionManifest}
          isLoading={!extensionManifest || (errorMessage === null && !fields)}
          fields={fields}
          parameters={parameters}
          autoSave={autoSave}
          autoSaveTrigger={autoSaveTrigger}
          autoSaveReject={autoSaveReject}
          closeOnEsc={closeOnEsc}
          showHeader={showHeader}
          onChange={onChange}
          onCancel={onCancel}
          errorMessage={errorMessage}
          featureFlags={featureFlags}
        />
      )}
    </FieldDefinitionsPromiseResolver>
  );
}
