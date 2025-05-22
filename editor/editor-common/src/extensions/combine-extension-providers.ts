import { combineProviders } from '../provider-helpers';

import type { ExtensionKey, ExtensionType } from './types/extension-manifest';
import type { ExtensionProvider } from './types/extension-provider';

/**
 * Allow to run methods from the `ExtensionProvider` interface across all providers seamlessly.
 * This handles promise racing and discards rejected promises safely.
 */
export default (
	extensionProviders: (ExtensionProvider | Promise<ExtensionProvider>)[],
): ExtensionProvider => {
	let providersCache = [] as ExtensionProvider[];
	const { invokeSingle, invokeList } = combineProviders<ExtensionProvider>(extensionProviders);

	return {
		getExtensions() {
			return invokeList('getExtensions');
		},

		async preload() {
			if (providersCache.length === 0) {
				providersCache = await Promise.all(
					extensionProviders.map((provider) => Promise.resolve(provider)),
				);
			}
			await Promise.all(providersCache.map((provider) => provider?.preload?.()));
		},

		getPreloadedExtension(type: ExtensionType, key: ExtensionKey) {
			if (providersCache.length === 0) {
				// preload() has not been called yet
				return;
			}
			for (const provider of providersCache) {
				const result = provider?.getPreloadedExtension?.(type, key);
				if (result) {
					return result;
				}
			}
		},

		getExtension(type: ExtensionType, key: ExtensionKey) {
			return invokeSingle('getExtension', [type, key]);
		},

		search(keyword: string) {
			return invokeList('search', [keyword]);
		},

		getAutoConverter() {
			return invokeList('getAutoConverter');
		},
	};
};
