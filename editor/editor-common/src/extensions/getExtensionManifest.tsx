import { getExtensionKeyAndNodeKey } from './manifest-helpers';
import type { ExtensionKey, ExtensionManifest, ExtensionType } from './types/extension-manifest';
import type { ExtensionProvider } from './types/extension-provider';

export function getExtensionManifest(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic extension types; any required for provider compatibility
): Promise<ExtensionManifest<any> | undefined> {
	const [extKey] = getExtensionKeyAndNodeKey(extensionKey, extensionType);
	return extensionProvider.getExtension(extensionType, extKey);
}
