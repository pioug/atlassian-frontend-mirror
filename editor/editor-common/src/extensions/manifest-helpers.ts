import { ADFEntity } from '@atlaskit/adf-utils';

import {
  ExtensionManifest,
  ExtensionKey,
  ExtensionModuleKey,
  Module,
  ESModule,
  ExtensionModuleAction,
  ExtensionModuleActionObject,
  ExtensionType,
} from './types/extension-manifest';

export const FORGE_EXTENSION_TYPE = 'com.atlassian.ecosystem';

export const getExtensionKeyAndNodeKey = (
  extensionKey: ExtensionKey,
  extensionType: ExtensionType,
) => {
  // Forge macro extensionKey has a user generated string, so splitting on
  // a colon is unstable for their particular use case. They only have one
  // node in the relevant manifest so we can hardcode nodeKey to 'default'.
  if (extensionType === FORGE_EXTENSION_TYPE) {
    return [extensionKey, 'default'];
  }

  const [extKey, nodeKey = 'default'] = extensionKey.split(':');
  return [extKey, nodeKey];
};

export const buildExtensionKeyAndNodeKey = (
  extensionKey: ExtensionKey,
  nodeKey?: ExtensionModuleKey,
) => {
  if (!nodeKey || nodeKey === 'default') {
    return extensionKey;
  }

  return `${extensionKey}:${nodeKey}`;
};

export const buildAction = (
  action: ExtensionModuleAction,
  manifest: ExtensionManifest,
) => {
  if (typeof action === 'function') {
    return action;
  }

  if (action.type === 'node' && manifest.modules.nodes) {
    return buildNode(action, manifest);
  }
};

export const resolveImport = async <T>(importPromise: Module<T>) => {
  const importedModule = await importPromise;

  return importedModule && (importedModule as ESModule<T>).__esModule
    ? (importedModule as ESModule<T>).default
    : (importedModule as T);
};

export const buildNode = (
  action: ExtensionModuleActionObject,
  manifest: ExtensionManifest,
): ADFEntity | undefined => {
  if (!manifest.modules.nodes) {
    return;
  }

  const node = manifest.modules.nodes[action.key];
  const extensionKey = buildExtensionKeyAndNodeKey(manifest.key, action.key);

  return {
    type: node.type,
    attrs: {
      extensionType: manifest.type,
      extensionKey: extensionKey,
      parameters: action.parameters,
    },
  };
};
