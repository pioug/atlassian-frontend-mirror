import React from 'react';

import Loadable, { LoadingComponentProps } from 'react-loadable';

import { getExtensionKeyAndNodeKey, resolveImport } from './manifest-helpers';
import {
  ExtensionKey,
  ExtensionParams,
  ExtensionProvider,
  ExtensionType,
} from './types';
import { ReferenceEntity } from './types/extension-handler';

export async function getExtensionModuleNode(
  extensionProvider: ExtensionProvider,
  extensionType: ExtensionType,
  extensionKey: ExtensionKey,
) {
  const [extKey, nodeKey] = getExtensionKeyAndNodeKey(
    extensionKey,
    extensionType,
  );

  const manifest = await extensionProvider.getExtension(extensionType, extKey);

  if (!manifest) {
    throw new Error(
      `Extension with key "${extKey}" and type "${extensionType}" not found!`,
    );
  }

  if (!manifest.modules.nodes) {
    throw new Error(
      `Couldn't find any node for extension type "${extensionType}" and key "${extensionKey}"!`,
    );
  }

  const node = manifest.modules.nodes[nodeKey];

  if (!node) {
    throw new Error(
      `Node with key "${extensionKey}" not found on manifest for extension type "${extensionType}" and key "${extensionKey}"!`,
    );
  }

  return node;
}

/**
 * Gets `__` prefixed properties from an extension node module definition
 */
export async function getExtensionModuleNodePrivateProps(
  extensionProvider: ExtensionProvider,
  extensionType: ExtensionType,
  extensionKey: ExtensionKey,
) {
  const moduleNode = await getExtensionModuleNode(
    extensionProvider,
    extensionType,
    extensionKey,
  );
  return Object.keys(moduleNode)
    .filter((key) => key.startsWith('__'))
    .reduce((acc, key) => {
      acc[key] = (moduleNode as any)[key];
      return acc;
    }, {} as any);
}

function ExtensionLoading(props: LoadingComponentProps) {
  if (props.error || props.timedOut) {
    // eslint-disable-next-line no-console
    console.error('Error rendering extension', props.error);
    return <div>Error loading the extension!</div>;
  } else {
    return null;
  }
}

export function getNodeRenderer<T>(
  extensionProvider: ExtensionProvider,
  extensionType: ExtensionType,
  extensionKey: ExtensionKey,
) {
  return Loadable<
    { node: ExtensionParams<T>; references?: ReferenceEntity[] },
    any
  >({
    loader: () => {
      return getExtensionModuleNode(
        extensionProvider,
        extensionType,
        extensionKey,
      ).then((node) => resolveImport(node.render()));
    },
    loading: ExtensionLoading,
  });
}
