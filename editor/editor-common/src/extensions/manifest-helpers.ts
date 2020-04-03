import { ADFEntity } from '@atlaskit/adf-utils';

import {
  ExtensionManifest,
  ExtensionKey,
  ExtensionModuleKey,
  Module,
  ESModule,
  ExtensionModuleAction,
  ExtensionModuleActionObject,
} from './types/extension-manifest';

export const getExtensionKeyAndNodeKey = (extensionKey: ExtensionKey) => {
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
