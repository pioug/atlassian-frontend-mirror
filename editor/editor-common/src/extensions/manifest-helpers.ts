import type { ADFEntity } from '@atlaskit/adf-utils/types';

import { buildExtensionKeyAndNodeKey } from './buildExtensionKeyAndNodeKey';
import { resolveImportSync } from './resolveImportSync';
import type {
	ExtensionKey,
	ExtensionManifest,
	ExtensionModuleAction,
	ExtensionModuleActionHandler,
	ExtensionModuleActionObject,
	ExtensionType,
	Module,
} from './types/extension-manifest';
import type { Parameters } from './types/extension-parameters';

export const FORGE_EXTENSION_TYPE = 'com.atlassian.ecosystem';

export const NATIVE_EMBED_EXTENSION_TYPE = 'com.atlassian.confluence.macro.core';
export const NATIVE_EMBED_EXTENSION_KEY = 'native-embed';

export const AGENT_MANAGED_EXTENSION_KEY = 'agent-managed-block';

export const getExtensionKeyAndNodeKey = (
	extensionKey: ExtensionKey,
	extensionType: ExtensionType,
): string[] => {
	// Forge macro extensionKey has a user generated string, so splitting on
	// a colon is unstable for their particular use case. They only have one
	// node in the relevant manifest so we can hardcode nodeKey to 'default'.
	if (extensionType === FORGE_EXTENSION_TYPE) {
		return [extensionKey, 'default'];
	}

	const [extKey, nodeKey = 'default'] = extensionKey.split(':');
	return [extKey, nodeKey];
};

export function buildAction<T extends Parameters>(
	action: ExtensionModuleAction<T>,
	manifest: ExtensionManifest<T>,
): ADFEntity | ExtensionModuleActionHandler | undefined {
	if (typeof action === 'function') {
		return action;
	}

	if (action.type === 'node' && manifest.modules.nodes) {
		return buildNode(action, manifest);
	}
}

type Extension = {
	attrs: {
		extensionKey: ExtensionKey;
		extensionType: ExtensionType;
		// action.parameters coming from ExtensionModuleActionObject, TemplateParams
		parameters: unknown;
	};
	type: ExtensionType;
};

export const resolveImport = async <T extends Parameters>(
	importPromise: Promise<Module<T>> | Module<T>,
): Promise<T> => {
	return resolveImportSync(await importPromise);
};

export function buildNode<T extends Parameters>(
	action: ExtensionModuleActionObject<T>,
	manifest: ExtensionManifest<T>,
): ADFEntity | undefined {
	if (!manifest.modules.nodes) {
		return;
	}

	const node = manifest.modules.nodes[action.key];
	const extensionKey = buildExtensionKeyAndNodeKey(manifest.key, action.key);
	const extension: Extension = {
		type: node.type,
		attrs: {
			extensionType: manifest.type,
			extensionKey: extensionKey,
			parameters: action.parameters,
		},
	};

	if (node.type === 'bodiedExtension') {
		return {
			...extension,
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		};
	} else if (node.type === 'multiBodiedExtension') {
		return {
			...extension,
			content: [
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							content: [],
						},
					],
				},
			],
		};
	}

	return extension;
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { buildExtensionKeyAndNodeKey } from './buildExtensionKeyAndNodeKey';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { resolveImportSync } from './resolveImportSync';
