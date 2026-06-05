import type { ExtensionKey, ExtensionModuleKey } from './types/extension-manifest';

export const buildExtensionKeyAndNodeKey = (
	extensionKey: ExtensionKey,
	nodeKey?: ExtensionModuleKey,
): string => {
	if (!nodeKey || nodeKey === 'default') {
		return extensionKey;
	}

	return `${extensionKey}:${nodeKey}`;
};
