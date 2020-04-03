import React from 'react';
import Loadable, { LoadingComponentProps } from 'react-loadable';

import {
  ExtensionProvider,
  ExtensionType,
  ExtensionKey,
  ExtensionParams,
} from './types';
import { getExtensionKeyAndNodeKey, resolveImport } from './manifest-helpers';

export async function getExtensionModuleNode(
  extensionProvider: ExtensionProvider,
  extensionType: ExtensionType,
  extensionKey: ExtensionKey,
) {
  const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey);

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
  return Loadable<{ extensionParams: ExtensionParams<T> }, any>({
    loader: () => {
      return getExtensionModuleNode(
        extensionProvider,
        extensionType,
        extensionKey,
      ).then(node => resolveImport(node.render()));
    },
    loading: ExtensionLoading,
  });
}
