import React from 'react';

import type { LoadingComponentProps } from 'react-loadable';
import Loadable from 'react-loadable';

import { getExtensionKeyAndNodeKey, resolveImport, resolveImportSync } from './manifest-helpers';
import type {
	ExtensionParams,
	MultiBodiedExtensionActions,
	ReferenceEntity,
} from './types/extension-handler';
import type {
	ExtensionKey,
	ExtensionManifest,
	ExtensionModuleNode,
	ExtensionType,
	PreloadableExtensionModuleNode,
} from './types/extension-manifest';
import type { Parameters } from './types/extension-parameters';
import type { ExtensionProvider } from './types/extension-provider';

function getNodeFromManifest(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	manifest: ExtensionManifest<any> | undefined,
	extKey: string,
	nodeKey: string,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
) {
	if (!manifest) {
		throw new Error(`Extension with key "${extKey}" and type "${extensionType}" not found!`);
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

export async function getExtensionModuleNode(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
) {
	const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey, extensionType);
	const manifest = await extensionProvider.getExtension(extensionType, extKey);
	return getNodeFromManifest(manifest, extKey, nodeKey, extensionType, extensionKey);
}

export function getExtensionModuleNodeMaybePreloaded(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ExtensionModuleNode<any>> | ExtensionModuleNode<any> {
	const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey, extensionType);
	const manifest = extensionProvider?.getPreloadedExtension?.(extensionType, extKey);
	if (manifest) {
		return getNodeFromManifest(manifest, extKey, nodeKey, extensionType, extensionKey);
	} else {
		return extensionProvider
			.getExtension(extensionType, extKey)
			.then((manifest) =>
				getNodeFromManifest(manifest, extKey, nodeKey, extensionType, extensionKey),
			);
	}
}

/**
 * Gets `__` prefixed properties from an extension node module definition
 */
export async function getExtensionModuleNodePrivateProps(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
) {
	const moduleNode = await getExtensionModuleNode(extensionProvider, extensionType, extensionKey);
	return Object.keys(moduleNode)
		.filter((key) => key.startsWith('__'))
		.reduce(
			(acc, key) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				acc[key] = (moduleNode as any)[key];
				return acc;
			},
			{} as {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				[prop: string]: any;
			},
		);
}

function ExtensionLoading(props: LoadingComponentProps) {
	if (props.error || props.timedOut) {
		// eslint-disable-next-line no-console
		console.error('Error rendering extension', props.error);
		// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
		return <div>Error loading the extension!</div>;
	} else {
		return null;
	}
}

export function getNodeRenderer<T extends Parameters>(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
) {
	return Loadable<
		{
			actions?: MultiBodiedExtensionActions;
			node: ExtensionParams<T>;
			references?: ReferenceEntity[];
		},
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		any
	>({
		loader: () => {
			const maybePromise = getExtensionModuleNodeMaybePreloaded(
				extensionProvider,
				extensionType,
				extensionKey,
			);
			if (maybePromise instanceof Promise) {
				return maybePromise.then((node) => resolveImport(node.render()));
			} else {
				const preloaded = (maybePromise as PreloadableExtensionModuleNode)?.renderSync?.();
				// Only product implemented preloading will return sync result
				// However the out-of-box won't handle this. Confluence uses a custom implementation
				return preloaded
					? // eslint-disable-next-line @typescript-eslint/no-explicit-any
						(resolveImportSync(preloaded) as any)
					: resolveImport(maybePromise.render());
			}
		},
		loading: ExtensionLoading,
	});
}
