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

			let error: Error | undefined;
			for (const provider of providersCache) {
				// Similar to invokeSingle. We are returning the first result that not throwing an error.
				// It's OK to get exception here because we have a lot of providers.
				// The current provider may not have the extension type we are looking for.
				try {
					const result = provider?.getPreloadedExtension?.(type, key);
					if (result) {
						return result;
					}
				} catch (e) {
					error = e instanceof Error ? e : new Error(String(e));
				}
			}

			// If we exhausted all providers and none of them returned a result, we throw the last error.
			// However as a extra precaution, we only throw in the dev environment.
			// In production we will return undefined and getExtensionModuleNodeMaybePreloaded will fallback to regular getExtension call.
			if (error && process.env.NODE_ENV !== 'production') {
				throw error;
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
