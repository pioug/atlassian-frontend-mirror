import { combineProviders } from '../provider-helpers';

import type { ExtensionKey, ExtensionManifest, ExtensionType } from './types/extension-manifest';
import type { ExtensionProvider } from './types/extension-provider';

type CombineExtensionProvidersOptions = {
	resolveExtension?: (
		type: ExtensionType,
		key: ExtensionKey,
	) => Promise<ExtensionManifest | undefined>;
	resolvePreloadedExtension?: (
		type: ExtensionType,
		key: ExtensionKey,
	) => ExtensionManifest | undefined;
};

/**
 * Allow to run methods from the `ExtensionProvider` interface across all providers seamlessly.
 * This handles optional explicit resolution, promise racing, and safely discarded rejections.
 */
export default (
	extensionProviders: (ExtensionProvider | Promise<ExtensionProvider>)[],
	{ resolveExtension, resolvePreloadedExtension }: CombineExtensionProvidersOptions = {},
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
			const resolvedExtension = resolvePreloadedExtension?.(type, key);
			if (resolvedExtension) {
				return resolvedExtension;
			}

			if (providersCache.length === 0) {
				// preload() has not been called yet
				return;
			}

			for (const provider of providersCache) {
				try {
					const result = provider?.getPreloadedExtension?.(type, key);
					if (result) {
						return result;
					}
				} catch {
					// Not every provider will implement this method.
					// In that case we would get error from other providers in the loop
					// and undefined from that particular provider.
					// We can safely ignore it and fallback to the async getExtension when nothing was found.
				}
			}
		},

		async getExtension(type: ExtensionType, key: ExtensionKey) {
			const resolvedExtension = await resolveExtension?.(type, key);
			if (resolvedExtension) {
				return resolvedExtension;
			}

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
